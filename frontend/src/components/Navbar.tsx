
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, MapPin, TrendingUp, User, Lock, Search, LogOut, Settings, Crown, Truck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Avatar, AvatarFallback } from './ui/avatar';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();

  // Helper function to get role-specific greeting and info
  const getRoleInfo = () => {
    if (!user) return null;

    const timeOfDay = new Date().getHours();
    let greeting = 'Hello';

    if (timeOfDay < 12) {
      greeting = 'Good morning';
    } else if (timeOfDay < 17) {
      greeting = 'Good afternoon';
    } else {
      greeting = 'Good evening';
    }

    switch (user.role) {
      case 'admin':
        return {
          greeting: `${greeting}, Admin`,
          name: user.name,
          icon: Crown,
          roleColor: 'text-purple-600',
          bgColor: 'bg-purple-50',
          borderColor: 'border-purple-200'
        };
      case 'owner':
        return {
          greeting: `${greeting}, Owner`,
          name: user.name,
          icon: Truck,
          roleColor: 'text-orange-600',
          bgColor: 'bg-orange-50',
          borderColor: 'border-orange-200'
        };
      default:
        return {
          greeting: `${greeting}`,
          name: user.name,
          icon: User,
          roleColor: 'text-foodtruck-teal',
          bgColor: 'bg-teal-50',
          borderColor: 'border-teal-200'
        };
    }
  };

  const roleInfo = getRoleInfo();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-[9998] transition-all duration-300 px-4 sm:px-6 lg:px-8",
        scrolled
          ? "py-2 bg-white/90 backdrop-blur-md shadow-sm"
          : "py-4 bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center space-x-2"
        >
          <div className="w-10 h-10 rounded-full bg-foodtruck-teal flex items-center justify-center">
            <MapPin className="h-5 w-5 text-white" />
          </div>
          <span className="font-serif text-2xl font-bold tracking-tight text-foodtruck-slate">
            DishRated
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-8 items-center">
          <Link to="/" className="text-foodtruck-slate hover:text-foodtruck-teal transition-colors">
            Home
          </Link>
          <Link to="/find-trucks" className="text-foodtruck-slate hover:text-foodtruck-teal transition-colors">
            Find Trucks
          </Link>
          <Link to="/events" className="text-foodtruck-slate hover:text-foodtruck-teal transition-colors">
            Events
          </Link>
          <div className="relative group">
            <button className="flex items-center space-x-1 text-foodtruck-slate hover:text-foodtruck-teal transition-colors">
              <span>More</span>
              <svg className="w-4 h-4 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>
            <div className="absolute right-0 z-[9999] mt-2 w-56 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
              <Link to="/owner-signup" className="block px-4 py-2 text-sm text-foodtruck-teal font-medium hover:bg-foodtruck-lightgray">
                Join as Food Truck Owner
              </Link>
              <div className="border-t border-gray-200 my-1"></div>
              <Link to="/aboutus" className="block px-4 py-2 text-sm text-foodtruck-slate hover:bg-foodtruck-lightgray">
                About Us
              </Link>
              <Link to="/sustainability" className="block px-4 py-2 text-sm text-foodtruck-slate hover:bg-foodtruck-lightgray">
                Sustainability
              </Link>
              <Link to="/blog" className="block px-4 py-2 text-sm text-foodtruck-slate hover:bg-foodtruck-lightgray">
                Blog
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {isAuthenticated && roleInfo && (
              <div className={cn(
                "hidden lg:flex items-center space-x-3 px-4 py-2 rounded-full border transition-all duration-300",
                roleInfo.bgColor,
                roleInfo.borderColor,
                scrolled ? "shadow-sm" : ""
              )}>
                <roleInfo.icon className={cn("h-4 w-4", roleInfo.roleColor)} />
                <div className="text-sm">
                  <span className={cn("font-medium", roleInfo.roleColor)}>
                    {roleInfo.greeting}
                  </span>
                  <span className="text-gray-600 ml-1">
                    {roleInfo.name}
                  </span>
                </div>
              </div>
            )}

            <div className="flex space-x-2">
              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>
                          {user?.name?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">{user?.name}</p>
                      <p className="w-[200px] truncate text-sm text-muted-foreground">
                        {user?.email}
                      </p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="flex items-center">
                      <Settings className="mr-2 h-4 w-4" />
                      Profile Settings
                    </Link>
                  </DropdownMenuItem>
                  {user?.role === 'owner' && (
                    <DropdownMenuItem asChild>
                      <Link to="/owner/dashboard" className="flex items-center">
                        <TrendingUp className="mr-2 h-4 w-4" />
                        Owner Dashboard
                      </Link>
                    </DropdownMenuItem>
                  )}
                  {user?.role === 'admin' && (
                    <DropdownMenuItem asChild>
                      <Link to="/admin/dashboard" className="flex items-center">
                        <Settings className="mr-2 h-4 w-4" />
                        Admin Dashboard
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link
                  to="/register"
                  className="inline-flex items-center rounded-full border border-foodtruck-teal px-4 py-1.5 text-sm font-medium text-foodtruck-teal hover:bg-foodtruck-teal hover:text-white transition-colors"
                >
                  <User className="mr-1.5 h-3.5 w-3.5" />
                  Sign Up
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center rounded-full bg-foodtruck-teal px-4 py-1.5 text-sm font-medium text-white hover:bg-foodtruck-slate transition-colors"
                >
                  <Lock className="mr-1.5 h-3.5 w-3.5" />
                  Sign In
                </Link>
              </>
            )}
            </div>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-foodtruck-slate hover:text-foodtruck-teal transition-colors"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>

        {/* Mobile Navigation Menu */}
        <div
          className={cn(
            "absolute top-full left-0 right-0 bg-white shadow-lg transition-all duration-300 ease-in-out md:hidden",
            isOpen ? "opacity-100 visible" : "opacity-0 invisible"
          )}
        >
          <div className="px-4 py-3 space-y-1">
            <Link
              to="/"
              className="block py-2 text-foodtruck-slate hover:text-foodtruck-teal transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/find-trucks"
              className="block py-2 text-foodtruck-slate hover:text-foodtruck-teal transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Find Trucks
            </Link>
            <Link
              to="/events"
              className="block py-2 text-foodtruck-slate hover:text-foodtruck-teal transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Events
            </Link>
            <Link
              to="/aboutus"
              className="block py-2 text-foodtruck-slate hover:text-foodtruck-teal transition-colors"
              onClick={() => setIsOpen(false)}
            >
              About Us
            </Link>
            <Link
              to="/sustainability"
              className="block py-2 text-foodtruck-slate hover:text-foodtruck-teal transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Sustainability
            </Link>
            <Link
              to="/blog"
              className="block py-2 text-foodtruck-slate hover:text-foodtruck-teal transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Blog
            </Link>
            <div className="border-t border-gray-200 my-2"></div>
            <Link
              to="/owner-signup"
              className="block py-2 text-foodtruck-teal font-medium hover:text-foodtruck-teal transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Join as Food Truck Owner
            </Link>
            <div className="pt-2 flex flex-col space-y-2">
              {isAuthenticated ? (
                <>
                  {roleInfo && (
                    <div className={cn(
                      "mx-2 px-4 py-3 rounded-lg border flex items-center space-x-3",
                      roleInfo.bgColor,
                      roleInfo.borderColor
                    )}>
                      <roleInfo.icon className={cn("h-5 w-5", roleInfo.roleColor)} />
                      <div>
                        <div className={cn("font-medium text-sm", roleInfo.roleColor)}>
                          {roleInfo.greeting}
                        </div>
                        <div className="text-sm text-gray-600">
                          {roleInfo.name}
                        </div>
                      </div>
                    </div>
                  )}
                  <Link
                    to="/profile"
                    className="inline-flex items-center justify-center rounded-full border border-foodtruck-teal px-4 py-1.5 text-sm font-medium text-foodtruck-teal hover:bg-foodtruck-teal hover:text-white transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    <Settings className="mr-1.5 h-3.5 w-3.5" />
                    Profile
                  </Link>
                  {user?.role === 'owner' && (
                    <Link
                      to="/owner/dashboard"
                      className="inline-flex items-center justify-center rounded-full border border-foodtruck-teal px-4 py-1.5 text-sm font-medium text-foodtruck-teal hover:bg-foodtruck-teal hover:text-white transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      <TrendingUp className="mr-1.5 h-3.5 w-3.5" />
                      Dashboard
                    </Link>
                  )}
                  {user?.role === 'admin' && (
                    <Link
                      to="/admin/dashboard"
                      className="inline-flex items-center justify-center rounded-full border border-foodtruck-teal px-4 py-1.5 text-sm font-medium text-foodtruck-teal hover:bg-foodtruck-teal hover:text-white transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      <Settings className="mr-1.5 h-3.5 w-3.5" />
                      Admin
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      logout();
                      setIsOpen(false);
                    }}
                    className="inline-flex items-center justify-center rounded-full bg-red-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-red-700 transition-colors"
                  >
                    <LogOut className="mr-1.5 h-3.5 w-3.5" />
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="inline-flex items-center justify-center rounded-full border border-foodtruck-teal px-4 py-1.5 text-sm font-medium text-foodtruck-teal hover:bg-foodtruck-teal hover:text-white transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    <User className="mr-1.5 h-3.5 w-3.5" />
                    Sign Up
                  </Link>
                  <Link
                    to="/login"
                    className="inline-flex items-center justify-center rounded-full bg-foodtruck-teal px-4 py-1.5 text-sm font-medium text-white hover:bg-foodtruck-slate transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    <Lock className="mr-1.5 h-3.5 w-3.5" />
                    Sign In
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
