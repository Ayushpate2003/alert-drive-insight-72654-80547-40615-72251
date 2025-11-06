import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Activity, Loader2, ArrowLeft, Chrome } from 'lucide-react';
import { UserRole } from '@/types/auth';
import { getDashboardPath } from '@/lib/utils';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const { login, signInWithGoogle } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the role from URL query params if present
  const searchParams = new URLSearchParams(location.search);
  const role = (searchParams.get('role') as UserRole) || 'driver';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({
        title: 'Error',
        description: 'Please fill in all fields',
        variant: 'destructive',
      });
      return;
    }
    
    setIsLoading(true);

    try {
      const user = await login(email, password);
      toast({
        title: 'Welcome back!',
        description: 'Login successful',
      });
      // Redirect based on user role
      navigate(getDashboardPath(user.role));
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: 'Login failed',
        description: error instanceof Error ? error.message : 'Invalid credentials',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    try {
      const user = await signInWithGoogle(role);
      toast({
        title: 'Welcome!',
        description: 'Google sign in successful',
      });
      // Redirect based on user role
      navigate(getDashboardPath(user.role));
    } catch (error) {
      console.error('Google sign in error:', error);
      toast({
        title: 'Google sign in failed',
        description: error instanceof Error ? error.message : 'Failed to sign in with Google',
        variant: 'destructive',
      });
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background dark flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <img
              src="/Gemini_Generated_Image_q390vgq390vgq390-removebg-preview (Edited).png"
              alt="SafeYatra Logo"
              className="w-8 h-8"
            />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">
            {role === 'admin' ? 'Admin Login' : role === 'fleet_manager' ? 'Manager Login' : 'Driver Login'}
          </h1>
          <p className="text-muted-foreground">Enter your credentials to access your account</p>
        </div>

        <Card className="p-6 bg-card border-border">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="driver@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In with Email'
              )}
            </Button>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>
            
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={handleGoogleSignIn}
              disabled={isGoogleLoading}
            >
              {isGoogleLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Chrome className="mr-2 h-4 w-4" />
              )}
              Google
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <div className="text-center text-sm space-y-2">
              <div>
                Don't have an account?{' '}
                <Link 
                  to={`/signup${role ? `?role=${role}` : ''}`} 
                  className="underline hover:text-primary"
                >
                  Sign up as {role}
                </Link>
              </div>
              {role !== 'driver' && (
                <div>
                  Are you a {role === 'admin' ? 'driver' : 'admin'}?{' '}
                  <Link 
                    to={`/login?role=${role === 'admin' ? 'driver' : 'admin'}`}
                    className="underline hover:text-primary"
                  >
                    Sign in as {role === 'admin' ? 'Driver' : 'Admin'}
                  </Link>
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 p-4 rounded-lg bg-secondary/50 border border-border">
            <p className="text-xs font-semibold text-foreground mb-2">Demo Accounts:</p>
            <div className="space-y-1 text-xs text-muted-foreground">
              <p>Driver: driver@test.com / password123</p>
              <p>Manager: manager@test.com / password123</p>
              <p>Admin: admin@test.com / password123</p>
            </div>
          </div>
        </Card>

        <div className="text-center mt-6">
          <Button variant="ghost" size="sm" onClick={() => window.history.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Login;
