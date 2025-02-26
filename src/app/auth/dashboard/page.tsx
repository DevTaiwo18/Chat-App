'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Search, Users, MessageCircle, Settings, Heart, LogOut } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { messageService } from '@/services/messageService';
import { Conversation } from '@/types/message';
import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';

export default function ChatDashboard() {
  const pathname = usePathname();
  const router = useRouter();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const isActive = (path: string) => pathname === path;

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const data = await messageService.getConversations();
        setConversations(data);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load conversations');
        setLoading(false);
      }
    };

    fetchConversations();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/');
  };

  const filteredConversations = conversations.filter(conversation => 
    conversation.user?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getInitials = (name?: string) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const formatTime = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (e) {
      return 'Recently';
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-white via-pink-50 to-pink-100 flex flex-col">
      {/* Search Header */}
      <div className="sticky top-0 bg-white shadow-sm p-4 flex justify-between items-center z-10">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          <Input 
            placeholder="Search messages..." 
            className="pl-10 bg-gray-50 border-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
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

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF6B6B]"></div>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-64 px-4">
            <p className="text-red-500 text-center">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 px-4 py-2 bg-[#FF6B6B] text-white rounded-lg hover:bg-[#ff5252] transition-colors"
            >
              Retry
            </button>
          </div>
        ) : conversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64">
            <div className="bg-white/60 h-24 w-24 rounded-full flex items-center justify-center">
              <MessageCircle className="h-12 w-12 text-gray-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mt-4">No Messages Yet</h2>
            <p className="text-gray-600 text-center max-w-sm mt-2">
              Start matching with people to begin conversations!
            </p>
            <Link 
              href="/auth/dashboard/find" 
              className="mt-6 px-6 py-3 bg-[#FF6B6B] text-white rounded-full hover:bg-[#ff5252] transition-colors"
            >
              Find Matches
            </Link>
          </div>
        ) : filteredConversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64">
            <p className="text-gray-600">No conversations match your search</p>
          </div>
        ) : (
          <div className="px-4 py-2 space-y-2">
            {filteredConversations.map((conversation) => (
              <Link 
                href={`/auth/dashboard/messages/${conversation.matchId}`} 
                key={conversation.matchId}
                className="flex items-center bg-white rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="relative">
                  {conversation.user?.profilePicture ? (
                    <Image 
                      src={conversation.user.profilePicture} 
                      alt={conversation.user.name || 'User'} 
                      width={50} 
                      height={50} 
                      className="rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-[#FF6B6B] rounded-full flex items-center justify-center text-white font-semibold">
                      {getInitials(conversation.user?.name)}
                    </div>
                  )}
                  
                  {conversation.unreadCount > 0 && (
                    <div className="absolute -top-1 -right-1 bg-[#FF6B6B] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {conversation.unreadCount}
                    </div>
                  )}
                </div>
                
                <div className="ml-3 flex-1 min-w-0">
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-medium text-gray-900 truncate">
                      {conversation.user?.name || 'Unknown User'}
                    </h3>
                    <span className="text-xs text-gray-500">
                      {formatTime(conversation.updatedAt)}
                    </span>
                  </div>
                  
                  <p className={`text-sm truncate ${conversation.unreadCount > 0 ? 'font-semibold text-gray-800' : 'text-gray-500'}`}>
                    {conversation.latestMessage?.content || 'Start a conversation!'}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="sticky bottom-0 bg-white border-t border-gray-200">
        <div className="flex justify-around items-center h-16 px-4 max-w-md mx-auto">
          <Link href="#" className="flex flex-col items-center space-y-1">
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