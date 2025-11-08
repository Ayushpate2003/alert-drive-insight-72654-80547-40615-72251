import { 
  User, 
  AuthResponse, 
  LoginCredentials, 
  SignupCredentials, 
  UserRole 
} from '@/types/auth';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithRedirect,
  getRedirectResult,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  User as FirebaseUser,
  onAuthStateChanged,
  AuthError,
  AuthErrorCodes
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, googleProvider } from '@/lib/firebase';

// Helper to map Firebase user to our User type
const mapFirebaseUser = async (firebaseUser: FirebaseUser): Promise<User> => {
  try {
    // Get user data from Firestore
    const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
    const userData = userDoc.data();

    if (!userData) {
      throw new Error('User data not found');
    }

    return {
      id: firebaseUser.uid,
      email: firebaseUser.email || '',
      name: userData.name || firebaseUser.displayName || 'User',
      role: userData.role || 'driver',
      avatar: firebaseUser.photoURL || undefined,
      createdAt: userData.createdAt?.toDate()?.toISOString() || new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error mapping Firebase user:', error);
    throw new Error('Failed to load user data');
  }
};

export const authService = {
  /**
   * Login user with email and password
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const { email, password } = credentials;
      
      if (!email || !password) {
        throw new Error('Email and password are required');
      }
      
      // Sign in with Firebase Auth
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Get user data from Firestore
      const user = await mapFirebaseUser(userCredential.user);
      
      // Get the ID token
      const token = await userCredential.user.getIdToken();
      
      return { user, token };
    } catch (error) {
      console.error('Login error:', error);
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        throw new Error('Invalid email or password');
      } else if (error.code === 'auth/too-many-requests') {
        throw new Error('Too many failed attempts. Please try again later.');
      } else {
        throw new Error(error.message || 'Failed to sign in');
      }
    }
  },

  /**
   * Signup new user with email and password
   */
  async signup(credentials: SignupCredentials): Promise<AuthResponse> {
    try {
      const { email, password, name, role = 'driver' } = credentials;
      
      if (!email || !password || !name) {
        throw new Error('Name, email, and password are required');
      }
      
      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters long');
      }
      
      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const { user } = userCredential;
      
      // Create user document in Firestore
      const userData = {
        name,
        email,
        role,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };
      
      await setDoc(doc(db, 'users', user.uid), userData);
      
      // Get the created user with role
      const createdUser = {
        id: user.uid,
        email: user.email || '',
        name,
        role,
        avatar: user.photoURL || undefined,
      createdAt: new Date().toISOString(),
    };
    
    // Get the ID token
    const token = await user.getIdToken();
    
    return { user: createdUser, token };
    } catch (error) {
      console.error('Signup error:', error);
      if (error.code === 'auth/email-already-in-use') {
        throw new Error('Email is already in use');
      } else if (error.code === 'auth/invalid-email') {
        throw new Error('Invalid email address');
      } else if (error.code === 'auth/weak-password') {
        throw new Error('Password is too weak');
      } else {
        throw new Error(error.message || 'Failed to create account');
      }
    }
  },

  /**
   * Get current user from Firebase Auth state
   */
  async getCurrentUser(token: string): Promise<User | null> {
    // If we have a token, get the current user
    if (auth.currentUser) {
      return mapFirebaseUser(auth.currentUser);
    }
    
    // If no current user but we have a token, try to get the user
    if (token) {
      // This will trigger the onAuthStateChanged listener if the user is still logged in
      return new Promise((resolve, reject) => {
        const unsubscribe = onAuthStateChanged(
          auth,
          async (user) => {
            unsubscribe();
            if (user) {
              try {
                const userData = await mapFirebaseUser(user);
                resolve(userData);
              } catch (error) {
                console.error('Error mapping user:', error);
                resolve(null);
              }
            } else {
              resolve(null);
            }
          },
          (error) => {
            unsubscribe();
            console.error('Auth state error:', error);
            resolve(null);
          }
        );
      });
    }
    
    return null;
  },

  /**
   * Get redirect result from Google sign in
   */
  async getRedirectResult(): Promise<AuthResponse | null> {
    try {
      const result = await getRedirectResult(auth);
      if (result) {
        const { user } = result;

        // Check if user already exists
        const userDoc = await getDoc(doc(db, 'users', user.uid));

        if (!userDoc.exists()) {
          // Create user document if it doesn't exist
          const userData = {
            name: user.displayName || 'User',
            email: user.email || '',
            role: 'driver', // Default role for Google sign in
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          };

          await setDoc(doc(db, 'users', user.uid), userData);
        }

        // Get the user with role
        const currentUser = await mapFirebaseUser(user);
        const token = await user.getIdToken();

        return { user: currentUser, token };
      }
      return null;
    } catch (error) {
      console.error('Error getting redirect result:', error);
      return null;
    }
  },

  /**
   * Sign in with Google
   */
  async signInWithGoogle(role: UserRole = 'driver'): Promise<AuthResponse> {
    try {
      // Try redirect method first to avoid popup blockers
      googleProvider.setCustomParameters({
        prompt: 'select_account'
      });

      // Check if we're returning from a redirect
      const result = await getRedirectResult(auth);
      if (result) {
        const { user } = result;

        // Check if user already exists
        const userDoc = await getDoc(doc(db, 'users', user.uid));

        if (!userDoc.exists()) {
          // Create user document if it doesn't exist
          const userData = {
            name: user.displayName || 'User',
            email: user.email || '',
            role,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          };

          await setDoc(doc(db, 'users', user.uid), userData);
        }

        // Get the user with role
        const currentUser = await mapFirebaseUser(user);
        const token = await user.getIdToken();

        return { user: currentUser, token };
      } else {
        // No redirect result, initiate redirect
        await signInWithRedirect(auth, googleProvider);
        // This will redirect the page, so we won't reach here
        throw new Error('Redirecting to Google...');
      }
    } catch (error) {
      console.error('Error signing in with Google:', error);
      if (error.code === 'auth/popup-blocked') {
        throw new Error('Popup was blocked. Please allow popups for this site and try again.');
      }
      throw error;
    }
  },
  
  /**
   * Logout user
   */
  async logout(): Promise<void> {
    await firebaseSignOut(auth);
  },
};
