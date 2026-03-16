import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Hotel, Search, User, LogOut, Menu, X } from 'lucide-react';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const token = localStorage.getItem('authToken');
  const userStr = localStorage.getItem('user');
  const isAuthenticated = !!token;
  const user = userStr ? JSON.parse(userStr) : null;

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <Hotel className="h-8 w-8 text-primary-600" />
                <span className="text-xl font-bold text-gray-900">HospitalityMgmt</span>
              </Link>
              
              <div className="hidden md:flex md:ml-10 md:space-x-8">
                <Link to="/" className="text-gray-700 hover:text-primary-600 px-3 py-2 text-sm font-medium transition-colors">
                  <div className="flex items-center space-x-1">
                    <Home className="h-4 w-4" />
                    <span>Home</span>
                  </div>
                </Link>
                <Link to="/hotels" className="text-gray-700 hover:text-primary-600 px-3 py-2 text-sm font-medium transition-colors">
                  <div className="flex items-center space-x-1">
                    <Hotel className="h-4 w-4" />
                    <span>Hotels</span>
                  </div>
                </Link>
                <Link to="/search" className="text-gray-700 hover:text-primary-600 px-3 py-2 text-sm font-medium transition-colors">
                  <div className="flex items-center space-x-1">
                    <Search className="h-4 w-4" />
                    <span>Search</span>
                  </div>
                </Link>
              </div>
            </div>

            <div className="hidden md:flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  {user?.userType === 'admin' && (
                    <Link to="/admin" className="text-primary-600 hover:text-primary-700 px-3 py-2 text-sm font-medium">
                      Admin
                    </Link>
                  )}
                  <Link to="/profile" className="text-gray-700 hover:text-primary-600 px-3 py-2 text-sm font-medium">
                    <div className="flex items-center space-x-1">
                      <User className="h-4 w-4" />
                      <span>{user?.firstName || 'Profile'}</span>
                    </div>
                  </Link>
                  <button onClick={handleLogout} className="text-gray-700 hover:text-red-600 px-3 py-2 text-sm font-medium">
                    <div className="flex items-center space-x-1">
                      <LogOut className="h-4 w-4" />
                      <span>Logout</span>
                    </div>
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="btn-outline">Login</Link>
                  <Link to="/register" className="btn-primary">Register</Link>
                </>
              )}
            </div>

            <div className="md:hidden flex items-center">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-700 hover:text-gray-900 p-2">
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </nav>

        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link to="/" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-md">Home</Link>
              <Link to="/hotels" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-md">Hotels</Link>
              <Link to="/search" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-md">Search</Link>
              {isAuthenticated ? (
                <>
                  {user?.userType === 'admin' && (
                    <Link to="/admin" className="block px-3 py-2 text-base font-medium text-primary-600 hover:text-primary-700 hover:bg-gray-50 rounded-md">Admin</Link>
                  )}
                  <Link to="/profile" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-md">Profile</Link>
                  <button onClick={handleLogout} className="block w-full text-left px-3 py-2 text-base font-medium text-red-600 hover:text-red-700 hover:bg-gray-50 rounded-md">Logout</button>
                </>
              ) : (
                <>
                  <Link to="/login" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-md">Login</Link>
                  <Link to="/register" className="block px-3 py-2 text-base font-medium text-primary-600 hover:text-primary-700 hover:bg-gray-50 rounded-md">Register</Link>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      <main className="flex-grow">{children}</main>

      <footer className="bg-gray-900 text-white mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">About Us</h3>
              <p className="text-gray-400 text-sm">Your trusted platform for finding and booking the best hotels worldwide.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link to="/hotels" className="hover:text-white">Hotels</Link></li>
                <li><Link to="/search" className="hover:text-white">Search</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link to="/contact" className="hover:text-white">Contact</Link></li>
                <li><Link to="/faq" className="hover:text-white">FAQ</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>Email: support@hospitalitymgmt.com</li>
                <li>Phone: +1 (555) 123-4567</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2026 Hospitality Management System. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
