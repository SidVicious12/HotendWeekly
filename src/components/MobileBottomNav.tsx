'use client';

import Link from 'next/link';
import { Home, Grid, User, LucideIcon } from 'lucide-react';
import { usePathname } from 'next/navigation';

interface NavItem {
    name: string;
    href: string;
    icon: LucideIcon;
}

const navItems: NavItem[] = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Tools', href: '/tools', icon: Grid },
    { name: 'Profile', href: '/profile', icon: User },
];

export function MobileBottomNav() {
    const pathname = usePathname();

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 pb-safe-area shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-50">
            <div className="flex justify-around items-center h-16">
                {navItems.map((item) => {
                    const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${isActive ? 'text-purple-600' : 'text-gray-500 hover:text-gray-900'
                                }`}
                        >
                            <item.icon className="w-6 h-6" />
                            <span className="text-[10px] font-medium">{item.name}</span>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
