import { Shield, Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/#about' },
    { name: 'Features', path: '/#features' },
    { name: 'Contact', path: '/#contact' },
  ];

  const solutions = [
    { name: 'Driver Safety', path: '/dashboard' },
    { name: 'Fleet Management', path: '/fleet-dashboard' },
    { name: 'Analytics', path: '/admin-dashboard' },
    { name: 'Reports', path: '/#reports' },
  ];

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
    { icon: Instagram, href: '#', label: 'Instagram' },
  ];

  return (
    <footer className="mt-auto" style={{ background: 'linear-gradient(to top, hsl(218, 64%, 10%), hsl(0, 0%, 0%))' }}>
      <div className="max-w-7xl mx-auto px-8 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Shield className="w-8 h-8" style={{ color: 'hsl(199, 93%, 59%)' }} />
              <span className="text-xl font-bold">
                <span style={{ color: 'hsl(0, 0%, 100%)' }}>Safe</span>
                <span style={{ color: 'hsl(199, 93%, 59%)' }}>Yatra</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: 'hsl(228, 100%, 94%, 0.8)' }}>
              AI-powered driver safety and fatigue monitoring system ensuring safer journeys for everyone on the road.
            </p>
            <div className="flex gap-3 pt-2">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-9 h-9 rounded-full flex items-center justify-center hover:scale-110 transition-all duration-200"
                  style={{ 
                    backgroundColor: 'hsl(199, 93%, 59%, 0.1)',
                    color: 'hsl(228, 100%, 94%)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'hsl(199, 93%, 59%, 0.2)';
                    e.currentTarget.style.color = 'hsl(199, 93%, 59%)';
                    e.currentTarget.style.boxShadow = '0 0 15px hsl(199, 93%, 59%, 0.5)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'hsl(199, 93%, 59%, 0.1)';
                    e.currentTarget.style.color = 'hsl(228, 100%, 94%)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4" style={{ color: 'hsl(0, 0%, 100%)' }}>Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="hover:translate-x-1 inline-block transition-all duration-200 text-sm"
                    style={{ color: 'hsl(228, 100%, 94%, 0.8)' }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = 'hsl(199, 93%, 59%)';
                      e.currentTarget.style.textShadow = '0 0 10px hsl(199, 93%, 59%)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = 'hsl(228, 100%, 94%, 0.8)';
                      e.currentTarget.style.textShadow = 'none';
                    }}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Solutions */}
          <div>
            <h3 className="text-lg font-semibold mb-4" style={{ color: 'hsl(0, 0%, 100%)' }}>Solutions</h3>
            <ul className="space-y-2">
              {solutions.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="hover:translate-x-1 inline-block transition-all duration-200 text-sm"
                    style={{ color: 'hsl(228, 100%, 94%, 0.8)' }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = 'hsl(199, 93%, 59%)';
                      e.currentTarget.style.textShadow = '0 0 10px hsl(199, 93%, 59%)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = 'hsl(228, 100%, 94%, 0.8)';
                      e.currentTarget.style.textShadow = 'none';
                    }}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4" style={{ color: 'hsl(0, 0%, 100%)' }}>Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm" style={{ color: 'hsl(228, 100%, 94%, 0.8)' }}>
                <Mail className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: 'hsl(199, 93%, 59%)' }} />
                <span>support@safeyatra.com</span>
              </li>
              <li className="flex items-start gap-2 text-sm" style={{ color: 'hsl(228, 100%, 94%, 0.8)' }}>
                <Phone className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: 'hsl(199, 93%, 59%)' }} />
                <span>+91 1800-123-4567</span>
              </li>
              <li className="flex items-start gap-2 text-sm" style={{ color: 'hsl(228, 100%, 94%, 0.8)' }}>
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: 'hsl(199, 93%, 59%)' }} />
                <span>Mumbai, Maharashtra, India</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t" style={{ borderColor: 'hsl(199, 93%, 59%, 0.2)' }}>
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm" style={{ color: 'hsl(228, 100%, 94%, 0.6)' }}>
              © {currentYear} SafeYatra. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <Link 
                to="/privacy" 
                className="transition-colors duration-200"
                style={{ color: 'hsl(228, 100%, 94%, 0.6)' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'hsl(199, 93%, 59%)';
                  e.currentTarget.style.textShadow = '0 0 10px hsl(199, 93%, 59%)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'hsl(228, 100%, 94%, 0.6)';
                  e.currentTarget.style.textShadow = 'none';
                }}
              >
                Privacy Policy
              </Link>
              <Link 
                to="/terms" 
                className="transition-colors duration-200"
                style={{ color: 'hsl(228, 100%, 94%, 0.6)' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'hsl(199, 93%, 59%)';
                  e.currentTarget.style.textShadow = '0 0 10px hsl(199, 93%, 59%)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'hsl(228, 100%, 94%, 0.6)';
                  e.currentTarget.style.textShadow = 'none';
                }}
              >
                Terms of Service
              </Link>
              <Link 
                to="/cookies" 
                className="transition-colors duration-200"
                style={{ color: 'hsl(228, 100%, 94%, 0.6)' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'hsl(199, 93%, 59%)';
                  e.currentTarget.style.textShadow = '0 0 10px hsl(199, 93%, 59%)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'hsl(228, 100%, 94%, 0.6)';
                  e.currentTarget.style.textShadow = 'none';
                }}
              >
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
