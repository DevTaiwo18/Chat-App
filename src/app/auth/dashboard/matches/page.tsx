"use client"

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { matchService } from '@/services/matchService';
import { MatchResponse } from '@/types/match';

// Initial avatar component for users without profile pictures
const InitialsAvatar = ({ name, className }: { name: string, className: string }) => {
    const initials = name
        ? name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .substring(0, 2)
        : '?';

    return (
        <div className={`flex items-center justify-center bg-[#FF6B6B] text-white font-medium ${className}`}>
            {initials}
        </div>
    );
};

export default function MatchesPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [matches, setMatches] = useState<MatchResponse[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [notification, setNotification] = useState<{message: string, type: string} | null>(null);

    useEffect(() => {
        // Handle incoming like action from email links
        const action = searchParams.get('action');
        const userId = searchParams.get('userId');
        
        if (action === 'like' && userId) {
            handleEmailLikeAction(userId);
        } else {
            fetchMatches();
        }
    }, [searchParams]);

    const handleEmailLikeAction = async (userId: string) => {
        setIsLoading(true);
        setNotification({ message: 'Processing your response...', type: 'info' });
        
        try {
            const result = await matchService.likeOrPassUser(userId, 'like');
            
            if (result.isMatch) {
                setNotification({ 
                    message: "It's a match! You can now start chatting.", 
                    type: 'success' 
                });
                // Refresh the matches list to include the new match
                await fetchMatches();
            } else {
                setNotification({ 
                    message: "You liked this person! If they like you back, they'll appear here.", 
                    type: 'success' 
                });
                fetchMatches();
            }
            
            // Clear the URL parameters after processing
            window.history.replaceState({}, '', '/auth/dashboard/matches');
        } catch (error) {
            console.error('Error processing like action:', error);
            setNotification({ 
                message: 'Something went wrong. Please try again.', 
                type: 'error' 
            });
            setIsLoading(false);
        }
    };

    const fetchMatches = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const matchesData = await matchService.getMatches();
            setMatches(matchesData);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load matches');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-lg mx-auto py-8 px-4">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Your Matches</h1>
                <Link href="/auth/dashboard" className="flex items-center text-gray-600 hover:text-gray-900">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back
                </Link>
            </div>
            
            {notification && (
                <div className={`p-4 mb-6 rounded-lg ${
                    notification.type === 'success' ? 'bg-green-100 text-green-800' :
                    notification.type === 'error' ? 'bg-red-100 text-red-800' :
                    'bg-blue-100 text-blue-800'
                }`}>
                    {notification.message}
                </div>
            )}
            
            <div className="text-sm text-gray-500 text-center mb-4">
                Showing {matches.length} matches
            </div>

            {error ? (
                <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg">
                    <p>{error}</p>
                    <button
                        onClick={fetchMatches}
                        className="mt-2 text-sm font-medium text-red-600 hover:text-red-800"
                    >
                        Try again
                    </button>
                </div>
            ) : isLoading ? (
                <div className="flex flex-col justify-center items-center h-60">
                    <div className="w-12 h-12 border-4 border-[#FF6B6B] border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="text-gray-600 font-medium">Loading your matches...</p>
                </div>
            ) : matches.length === 0 ? (
                <div className="text-center py-10 px-4">
                    <div className="mb-4 flex justify-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                        </div>
                    </div>
                    <h3 className="text-lg font-medium text-gray-800">No matches yet</h3>
                    <p className="text-gray-500 mt-2">Visit 'Find Matches' to discover new people!</p>
                    <Link
                        href="/auth/dashboard/find"
                        className="mt-4 px-4 py-2 bg-[#FF6B6B] text-white rounded-full hover:bg-[#ff5252] transition-colors inline-block"
                    >
                        Find Matches
                    </Link>
                </div>
            ) : (
                <div className="space-y-4 overflow-y-auto max-h-[70vh] pr-2">
                    {matches.map((match) => (
                        <Link
                            href={`/messages/${match.matchId}`}
                            key={match.matchId}
                            className="flex items-center p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow block"
                        >
                            {match.user.profilePicture ? (
                                <div className="relative h-16 w-16 rounded-full overflow-hidden flex-shrink-0">
                                    <Image
                                        src={match.user.profilePicture}
                                        alt={match.user.name || 'Match'}
                                        fill
                                        style={{ objectFit: 'cover' }}
                                    />
                                </div>
                            ) : (
                                <InitialsAvatar 
                                    name={match.user.name || 'User'} 
                                    className="h-16 w-16 rounded-full"
                                />
                            )}
                            <div className="ml-4 flex-grow">
                                <h3 className="font-semibold text-gray-800 text-lg">{match.user.name || 'Anonymous'}</h3>
                                <p className="text-sm text-gray-500">
                                    Matched on {new Date(match.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                            <div className="ml-2 text-[#6C63FF]">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}