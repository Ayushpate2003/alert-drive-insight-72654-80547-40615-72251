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
    <footer className="bg-primary text-white mt-auto">
      <div className="max-w-7xl mx-auto px-8 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Shield className="w-8 h-8 text-white" />
              <span className="text-xl font-bold">
                <span className="text-white">Safe</span>
                <span className="text-accent">Yatra</span>
              </span>
            </div>
            <p className="text-white/80 text-sm leading-relaxed">
              AI-powered driver safety and fatigue monitoring system ensuring safer journeys for everyone on the road.
            </p>
            <div className="flex gap-3 pt-2">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-accent hover:scale-110 transition-all duration-200"
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-white/80 hover:text-accent hover:translate-x-1 inline-block transition-all duration-200 text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Solutions */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Solutions</h3>
            <ul className="space-y-2">
              {solutions.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-white/80 hover:text-accent hover:translate-x-1 inline-block transition-all duration-200 text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-white/80 text-sm">
                <Mail className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>support@safeyatra.com</span>
              </li>
              <li className="flex items-start gap-2 text-white/80 text-sm">
                <Phone className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>+91 1800-123-4567</span>
              </li>
              <li className="flex items-start gap-2 text-white/80 text-sm">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>Mumbai, Maharashtra, India</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-white/60 text-sm">
              © {currentYear} SafeYatra. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <Link to="/privacy" className="text-white/60 hover:text-accent transition-colors duration-200">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-white/60 hover:text-accent transition-colors duration-200">
                Terms of Service
              </Link>
              <Link to="/cookies" className="text-white/60 hover:text-accent transition-colors duration-200">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
