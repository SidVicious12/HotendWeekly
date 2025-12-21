'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Menu, X, ChevronDown } from 'lucide-react';

export default function Navigation() {
  const { user, isAdmin, signOut } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showToolsDropdown, setShowToolsDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const tools = [
    {
      name: 'Fashion Models',
      href: '/tools/fashion-model-database',
      description: 'Diverse AI fashion models for your prints'
    },
    {
      name: 'Transform to 3D',
      href: '/tools/transform-to-3d',
      description: 'Turn 2D images into 3D models'
    },
    {
      name: 'Magic Eraser',
      href: '/tools/magic-eraser',
      description: 'Remove supports and artifacts'
    },
    {
      name: 'Image Enhancer',
      href: '/tools/image-enhancer',
      description: 'Upscale and improve print photos'
    }
  ];

  return (
    <nav className="fixed w-full top-0 z-50 transition-all duration-300 bg-white/80 backdrop-blur-xl border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
              <span className="text-white font-bold text-xl">H</span>
            </div>
            <span className="text-xl font-bold text-gray-900 tracking-tight">HotendWeekly</span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <div
              className="relative group"
              onMouseEnter={() => setShowToolsDropdown(true)}
              onMouseLeave={() => setShowToolsDropdown(false)}
            >
              <button className="text-gray-600 hover:text-black text-sm font-medium flex items-center transition-colors py-2">
                Tools
                <ChevronDown className="w-4 h-4 ml-1 opacity-50 group-hover:opacity-100 transition-opacity" />
              </button>

              {showToolsDropdown && (
                <div className="absolute left-1/2 -translate-x-1/2 top-full pt-4 w-[600px]">
                  <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-2 grid grid-cols-2 gap-2">
                    {tools.map((tool) => (
                      <Link
                        key={tool.href}
                        href={tool.href}
                        className="block p-4 rounded-xl hover:bg-gray-50 transition-all"
                      >
                        <div className="font-semibold text-gray-900 mb-1">{tool.name}</div>
                        <div className="text-sm text-gray-500">{tool.description}</div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Link href="/pricing" className="text-gray-600 hover:text-black text-sm font-medium transition-colors">
              Pricing
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="w-10 h-10 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center hover:border-gray-300 transition-colors"
                >
                  <span className="text-sm font-semibold text-gray-700">
                    {user.email?.charAt(0).toUpperCase()}
                  </span>
                </button>
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-3">
                <Link
                  href="/auth/login"
                  className="text-sm font-medium text-gray-600 hover:text-black transition-colors px-4 py-2"
                >
                  Log In
                </Link>
                <Link
                  href="/auth/signup"
                  className="bg-black text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-gray-800 transition-all hover:scale-105"
                >
                  Sign Up Free
                </Link>
              </div>
            )}

            <button
              className="md:hidden p-2 text-gray-600"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
