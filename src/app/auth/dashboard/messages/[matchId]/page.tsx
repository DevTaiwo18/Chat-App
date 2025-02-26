'use client';
import React, { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Send, ChevronDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { messageService } from '@/services/messageService';
import { Message, MessageUser } from '@/types/message';
import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';

export default function ConversationPage() {
  const { matchId } = useParams() as { matchId: string };
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [otherUser, setOtherUser] = useState<MessageUser | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  interface MessageUser {
    _id: string;
    name?: string;
    profilePicture?: string;
  }
  
  interface Message {
    _id: string;
    matchId: string;
    sender: string | MessageUser | {
      _id: string;
      name: string;
    };
    receiver: string;
    content: string;
    isRead: boolean;
    createdAt: string;
    updatedAt: string;
    pending?: boolean;
    failed?: boolean;
  }

  const isSenderCurrentUser = (message: Message) => {
    if (message.sender === 'current-user') return true;
    
    if (typeof message.sender === 'object' && message.sender !== null) {
      return message.sender._id !== otherUser?._id;
    }
    
    return message.sender !== otherUser?._id;
  };

  useEffect(() => {
    const fetchMessagesAndUser = async () => {
      try {
        const messagesData = await messageService.getMessages(matchId);
        console.log(messagesData);
        
        setMessages(messagesData);
        
        const conversationData = await messageService.getConversations();
        const currentConversation = conversationData.find(
          conversation => conversation.matchId === matchId
        );
        
        if (currentConversation && currentConversation.user) {
          setOtherUser(currentConversation.user);
        }
        
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load messages');
        setLoading(false);
      }
    };

    fetchMessagesAndUser();
    
    const intervalId = setInterval(() => {
      messageService.getMessages(matchId)
        .then(data => setMessages(data))
        .catch(err => console.error('Error refreshing messages:', err));
    }, 10000);
    
    return () => clearInterval(intervalId);
  }, [matchId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim()) return;
    
    setSending(true);
    const messageContent = newMessage.trim();
    setNewMessage('');
    
    const tempId = `temp-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    const tempMessage: Message = {
      _id: tempId,
      content: messageContent,
      sender: 'current-user',
      receiver: typeof otherUser?._id === 'string' ? otherUser._id : '',
      isRead: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      matchId: matchId,
      pending: true
    };
    
    setMessages(prev => [...prev, tempMessage]);
    
    try {
      const sentMessage = await messageService.sendMessage(matchId, messageContent);
      
      // Small delay to ensure the loading state is visible to user
      setTimeout(() => {
        setMessages(prev => 
          prev.map(msg => 
            msg._id === tempId ? sentMessage : msg
          )
        );
        setSending(false);
      }, 500);
    } catch (err) {
      setMessages(prev => 
        prev.map(msg => 
          msg._id === tempId ? {...msg, failed: true, pending: false} : msg
        )
      );
      setError(err instanceof Error ? err.message : 'Failed to send message');
      setSending(false);
    }
  };

  const goBack = () => {
    router.push('/auth/dashboard');
  };

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
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return "Just now";
      }
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (e) {
      return 'Just now';
    }
  };

  const groupedMessages: { [key: string]: Message[] } = {};
  messages.forEach(message => {
    const date = new Date(message.createdAt);
    
    if (isNaN(date.getTime())) {
      const key = 'Today';
      if (!groupedMessages[key]) {
        groupedMessages[key] = [];
      }
      groupedMessages[key].push(message);
      return;
    }
    
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    let dateKey: string;
    if (date.toDateString() === today.toDateString()) {
      dateKey = 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      dateKey = 'Yesterday';
    } else {
      dateKey = date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined 
      });
    }
    
    if (!groupedMessages[dateKey]) {
      groupedMessages[dateKey] = [];
    }
    groupedMessages[dateKey].push(message);
  });

  return (
    <main className="min-h-screen flex flex-col bg-gradient-to-b from-white via-pink-50 to-pink-100">
      <div className="sticky top-0 bg-white shadow-sm p-3 flex items-center z-10">
        <button onClick={goBack} className="p-2 text-gray-600">
          <ArrowLeft className="h-5 w-5" />
        </button>
        
        <div className="flex items-center flex-1 ml-2">
          {otherUser?.profilePicture ? (
            <Image 
              src={otherUser.profilePicture} 
              alt={otherUser.name || 'User'} 
              width={40} 
              height={40} 
              className="rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 bg-[#FF5A5A] rounded-full flex items-center justify-center text-white font-semibold">
              {getInitials(otherUser?.name)}
            </div>
          )}
          
          <div className="ml-3">
            <h3 className="font-medium text-gray-900">
              {otherUser?.name || 'Your Match'}
            </h3>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 pb-20">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF5A5A]"></div>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-full">
            <p className="text-red-500 text-center">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 px-4 py-2 bg-[#FF5A5A] text-white rounded-lg hover:bg-[#ff5252] transition-colors"
            >
              Retry
            </button>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 mt-10">
            <div className="bg-white/60 h-20 w-20 rounded-full flex items-center justify-center">
              <ChevronDown className="h-8 w-8 text-gray-400" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900 mt-4">No Messages Yet</h2>
            <p className="text-gray-600 text-center max-w-sm mt-2">
              Send a message to start the conversation!
            </p>
          </div>
        ) : (
          Object.entries(groupedMessages).map(([date, dateMessages], groupIndex) => (
            <div key={`group-${date}-${groupIndex}`} className="mb-6">
              <div className="flex justify-center mb-4">
                <div className="bg-gray-200 rounded-full px-4 py-1 text-xs text-gray-600 shadow-sm">
                  {date}
                </div>
              </div>
              
              <div className="space-y-3">
                {dateMessages.map((message, index) => {
                  const isPending = message.pending === true;
                  const hasFailed = message.failed === true;
                  const fromCurrentUser = isSenderCurrentUser(message);
                  const messageKey = `${message._id || 'msg'}-${index}`;
                  
                  return (
                    <div key={messageKey} className={`flex ${fromCurrentUser ? 'justify-end' : 'justify-start'}`}>
                      <div 
                        className={`
                          max-w-xs sm:max-w-md px-4 py-2 rounded-lg 
                          ${fromCurrentUser 
                            ? 'rounded-tr-none bg-[#FF5A5A] text-white' 
                            : 'rounded-tl-none bg-white text-gray-800 shadow-sm'
                          }
                          ${isPending ? 'opacity-90' : ''}
                          ${hasFailed ? 'bg-red-400 text-white' : ''}
                        `}
                      >
                        <p className="break-words">{message.content}</p>
                        
                        <div className={`flex items-center mt-1 space-x-1 ${fromCurrentUser ? 'justify-end' : 'justify-start'}`}>
                          <span className={`text-xs ${fromCurrentUser ? 'text-pink-100' : 'text-gray-500'}`}>
                            {isPending 
                              ? (
                                <span className="flex items-center">
                                  <span className="mr-1">Sending</span>
                                  <span className="inline-block w-3 h-3 bg-white/30 rounded-full animate-pulse"></span>
                                </span>
                              ) 
                              : hasFailed 
                                ? 'Failed' 
                                : isNaN(new Date(message.createdAt).getTime())
                                  ? 'Just now'
                                  : new Date(message.createdAt).toLocaleTimeString([], { 
                                      hour: '2-digit', 
                                      minute: '2-digit' 
                                    })
                            }
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="sticky bottom-0 bg-white border-t border-gray-100 p-3">
        <form onSubmit={handleSendMessage} className="flex items-center">
          <Input
            type="text"
            placeholder="Type a message..."
            className="flex-1 bg-gray-100 border-0 rounded-full"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            disabled={sending}
          />
          <button
            type="submit"
            className={`ml-2 bg-[#FF5A5A] text-white p-2 rounded-full disabled:opacity-50 ${
              sending ? 'cursor-not-allowed' : 'hover:bg-[#ff5252]'
            }`}
            disabled={sending || !newMessage.trim()}
          >
            <Send className="h-5 w-5" />
          </button>
        </form>
      </div>
    </main>
  );
}