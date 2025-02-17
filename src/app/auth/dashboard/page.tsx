'use client';
import React from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Search, Users, MessageCircle, Settings, Heart, LogOut } from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function ChatDashboard() {
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (path: string) => pathname === path;

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/');
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-white via-pink-50 to-pink-100 flex flex-col">
      {/* Search Header */}
      <div className="sticky top-0 bg-white shadow-sm p-4 flex justify-between items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          <Input 
            placeholder="Search messages..." 
            className="pl-10 bg-gray-50 border-none"
          />
        </div>
        <button
          onClick={handleLogout}
          className="ml-4 px-3 py-2 text-gray-600 hover:text-[#FF6B6B] transition-colors flex items-center space-x-2 rounded-lg hover:bg-gray-100"
        >
          <LogOut className="h-5 w-5" />
          <span className="text-sm font-medium">Sign Out</span>
        </button>
      </div>

      {/* Rest of your component remains the same */}
      <div className="flex-1 flex items-center justify-center -mt-16">
        <div className="flex flex-col items-center space-y-4">
          <div className="bg-white/60 h-24 w-24 rounded-full flex items-center justify-center">
            <MessageCircle className="h-12 w-12 text-gray-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900">No Messages Yet</h2>
          <p className="text-gray-600 text-center max-w-sm">
            Start matching with people to begin conversations!
          </p>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="sticky bottom-0 bg-white border-t border-gray-200">
        <div className="flex justify-around items-center h-16 px-4 max-w-md mx-auto">
          <Link href="/auth/dashboard/messages" className="flex flex-col items-center space-y-1">
            <MessageCircle className={`h-6 w-6 ${isActive('/auth/dashboard/messages') ? 'text-[#FF6B6B]' : 'text-gray-600'}`} />
            <span className={`text-xs ${isActive('/auth/dashboard/messages') ? 'text-[#FF6B6B]' : 'text-gray-600'}`}>
              Chats
            </span>
          </Link>
          
          <Link href="/auth/dashboard/matches" className="flex flex-col items-center space-y-1">
            <Users className={`h-6 w-6 ${isActive('/auth/dashboard/matches') ? 'text-[#FF6B6B]' : 'text-gray-600'}`} />
            <span className={`text-xs ${isActive('/auth/dashboard/matches') ? 'text-[#FF6B6B]' : 'text-gray-600'}`}>
              Matches
            </span>
          </Link>
          
          <Link href="/auth/dashboard/find" className="flex flex-col items-center space-y-1">
            <Heart className={`h-6 w-6 ${isActive('/auth/dashboard/find') ? 'text-[#FF6B6B]' : 'text-gray-600'}`} />
            <span className={`text-xs ${isActive('/auth/dashboard/find') ? 'text-[#FF6B6B]' : 'text-gray-600'}`}>
              Find Match
            </span>
          </Link>
          
          <Link href="/auth/dashboard/settings" className="flex flex-col items-center space-y-1">
            <Settings className={`h-6 w-6 ${isActive('/auth/dashboard/settings') ? 'text-[#FF6B6B]' : 'text-gray-600'}`} />
            <span className={`text-xs ${isActive('/auth/dashboard/settings') ? 'text-[#FF6B6B]' : 'text-gray-600'}`}>
              Settings
            </span>
          </Link>
        </div>
      </div>
    </main>
  );
}