'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export default function Navigation() {
  const { user, signOut } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showToolsDropdown, setShowToolsDropdown] = useState(false);

  const tools = [
    {
      name: 'Diversified Fashion Model Database',
      href: '/tools/fashion-model-database',
      image: '/showcase/fashion-model-database.jpeg',
      description: 'Diverse AI fashion models'
    },
    {
      name: 'Transform to 3D',
      href: '/tools/transform-to-3d',
      image: '/showcase/transform-to-3d.jpeg',
      description: '2D to interactive 3D models'
    },
    {
      name: 'Magic Eraser',
      href: '/tools/magic-eraser',
      image: '/showcase/magic-eraser.jpeg',
      description: 'Fix flaws automatically'
    },
    {
      name: 'Image Retouch',
      href: '/tools/image-retouch',
      image: '/showcase/image-retouch.png',
      description: 'Color changing & textures'
    },
    {
      name: 'Image Enhancer',
      href: '/tools/image-enhancer',
      image: '/showcase/image-enhancer.png',
      description: 'Clarity & detail boost'
    },
    {
      name: 'Image Extender',
      href: '/tools/image-extender',
      image: '/showcase/image-extender.png',
      description: 'Scale & background expansion'
    }
  ];

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">H</span>
            </div>
            <span className="text-xl font-semibold text-gray-900">HotendWeekly</span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            {/* Tools Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setShowToolsDropdown(true)}
              onMouseLeave={() => setShowToolsDropdown(false)}
            >
              <button className="text-gray-700 hover:text-gray-900 text-sm font-medium flex items-center">
                Tools
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Tools Dropdown Menu */}
              {showToolsDropdown && (
                <div className="absolute left-0 mt-2 w-[800px] bg-white rounded-2xl shadow-2xl p-6 border border-gray-100">
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    {tools.map((tool) => (
                      <Link
                        key={tool.href}
                        href={tool.href}
                        className="group flex flex-col gap-3 p-4 rounded-xl hover:bg-gray-50 transition-colors"
                      >
                        <div className="w-full h-32 bg-gray-100 rounded-lg overflow-hidden">
                          <img
                            src={tool.image}
                            alt={tool.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-gray-900 mb-1 group-hover:text-purple-600 transition-colors">
                            {tool.name}
                          </h3>
                          <p className="text-xs text-gray-600">{tool.description}</p>
                        </div>
                      </Link>
                    ))}
                  </div>

                  {/* View All Tools Button */}
                  <div className="pt-4 border-t border-gray-200">
                    <Link
                      href="/tools"
                      className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
                    >
                      <span>View All Tools</span>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <Link href="/pricing" className="text-gray-700 hover:text-gray-900 text-sm font-medium">
              Pricing
            </Link>
            <Link href="/#inspiration" className="text-gray-700 hover:text-gray-900 text-sm font-medium">
              Inspiration
            </Link>
            <Link href="/#contact" className="text-gray-700 hover:text-gray-900 text-sm font-medium">
              Contact
            </Link>
            <Link href="/#api" className="text-gray-700 hover:text-gray-900 text-sm font-medium">
              API
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {/* Language Selector */}
            <button className="hidden md:flex items-center space-x-2 text-gray-700 hover:text-gray-900 text-sm font-medium">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
              </svg>
              <span>English</span>
            </button>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 text-gray-700 hover:text-gray-900"
                >
                  <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-semibold">
                      {user.email?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-200">
                      <p className="text-sm font-medium text-gray-900 truncate">{user.email}</p>
                    </div>
                    <button
                      onClick={() => {
                        signOut();
                        setShowUserMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/auth/login"
                className="bg-black text-white px-6 py-2 rounded-full text-sm font-semibold hover:bg-gray-800 transition-colors"
              >
                LOG IN / SIGN UP
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
