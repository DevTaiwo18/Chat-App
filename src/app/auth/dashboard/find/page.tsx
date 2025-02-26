"use client"

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { matchService } from '@/services/matchService';
import { PotentialMatch } from '@/types/match';

// Heart Icon Component
const HeartIcon = ({ className = 'w-6 h-6' }: { className?: string }) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className={className}
        >
            <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
        </svg>
    );
};

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

// Loading Spinner Component
const LoadingSpinner = ({ size = 'small' }: { size?: 'small' | 'medium' | 'large' }) => {
    const sizeClasses = {
        small: 'w-4 h-4 border-2',
        medium: 'w-6 h-6 border-2',
        large: 'w-12 h-12 border-4'
    };
    
    return (
        <div className={`${sizeClasses[size]} border-white border-t-transparent rounded-full animate-spin`}></div>
    );
};

export default function FindPage() {
    const [potentialMatches, setPotentialMatches] = useState<PotentialMatch[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isMatchModalOpen, setIsMatchModalOpen] = useState<boolean>(false);
    const [currentMatchId, setCurrentMatchId] = useState<string | null>(null);
    const [processingIds, setProcessingIds] = useState<Record<string, string>>({});

    useEffect(() => {
        fetchPotentialMatches();
    }, []);

    const fetchPotentialMatches = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const matches = await matchService.getPotentialMatches();
            setPotentialMatches(matches);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load matches');
        } finally {
            setIsLoading(false);
        }
    };

    const handleLike = async (userId: string) => {
        // Set this user to processing state
        setProcessingIds(prev => ({ ...prev, [userId]: 'liking' }));
        
        try {
            const response = await matchService.likeOrPassUser(userId, 'like');
            // Update status to liked
            setProcessingIds(prev => ({ ...prev, [userId]: 'liked' }));
            
            if (response.isMatch) {
                setCurrentMatchId(userId);
                setIsMatchModalOpen(true);
            }
            
            // Instead of removing, we'll keep it in list with "liked" status
            // After 2 seconds, remove from list
            setTimeout(() => {
                setPotentialMatches(prev => prev.filter(match => match._id !== userId));
                setProcessingIds(prev => {
                    const newProcessing = { ...prev };
                    delete newProcessing[userId];
                    return newProcessing;
                });
            }, 2000);
        } catch (err) {
            // Clear processing state on error
            setProcessingIds(prev => {
                const newProcessing = { ...prev };
                delete newProcessing[userId];
                return newProcessing;
            });
            setError(err instanceof Error ? err.message : 'Failed to like profile');
        }
    };

    const handlePass = async (userId: string) => {
        // Set this user to processing state
        setProcessingIds(prev => ({ ...prev, [userId]: 'passing' }));
        
        try {
            await matchService.likeOrPassUser(userId, 'pass');
            
            // Update status to passed
            setProcessingIds(prev => ({ ...prev, [userId]: 'passed' }));
            
            // After 2 seconds, remove from list
            setTimeout(() => {
                setPotentialMatches(prev => prev.filter(match => match._id !== userId));
                setProcessingIds(prev => {
                    const newProcessing = { ...prev };
                    delete newProcessing[userId];
                    return newProcessing;
                });
            }, 2000);
        } catch (err) {
            // Clear processing state on error
            setProcessingIds(prev => {
                const newProcessing = { ...prev };
                delete newProcessing[userId];
                return newProcessing;
            });
            setError(err instanceof Error ? err.message : 'Failed to pass profile');
        }
    };

    const getCurrentMatchDetails = () => {
        return potentialMatches.find(match => match._id === currentMatchId) || null;
    };

    return (
        <div className="max-w-lg mx-auto py-8 px-4">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Find Matches</h1>
                <Link href="/auth/dashboard" className="flex items-center text-gray-600 hover:text-gray-900">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back
                </Link>
            </div>
            
            <div className="text-sm text-gray-500 text-center mb-4">
                Showing {potentialMatches.length} potential matches
            </div>

            {isLoading ? (
                <div className="flex flex-col justify-center items-center h-60">
                    <div className="w-12 h-12 border-4 border-[#FF6B6B] border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="text-gray-600 font-medium">Loading potential matches...</p>
                </div>
            ) : error ? (
                <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg">
                    <p>{error}</p>
                    <button
                        onClick={fetchPotentialMatches}
                        className="mt-2 text-sm font-medium text-red-600 hover:text-red-800"
                    >
                        Try again
                    </button>
                </div>
            ) : potentialMatches.length > 0 ? (
                <div className="space-y-6 overflow-y-auto max-h-[70vh] pr-2">
                    {potentialMatches.map((match) => (
                        <div key={match._id} className="w-full bg-white rounded-xl shadow-md overflow-hidden">
                            <div className="p-5">
                                <div className="flex items-center mb-4">
                                    {match.profilePicture ? (
                                        <div className="relative h-16 w-16 rounded-full overflow-hidden flex-shrink-0">
                                            <Image
                                                src={match.profilePicture}
                                                alt={match.name || 'Profile picture'}
                                                fill
                                                style={{ objectFit: 'cover' }}
                                                className="w-full h-full"
                                            />
                                        </div>
                                    ) : (
                                        <InitialsAvatar 
                                            name={match.name || 'User'} 
                                            className="h-16 w-16 rounded-full"
                                        />
                                    )}
                                    <div className="ml-4">
                                        <h3 className="text-xl font-semibold text-gray-800">
                                            {match.name || 'Anonymous'}{match.age ? `, ${match.age}` : ''}
                                        </h3>
                                        {match.gender && (
                                            <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                                                {match.gender.charAt(0).toUpperCase() + match.gender.slice(1)}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {match.bio && (
                                    <p className="text-gray-600 mb-4">{match.bio}</p>
                                )}

                                {match.interests && match.interests.length > 0 && (
                                    <div className="mb-5">
                                        <p className="text-sm font-medium text-gray-700 mb-2">Interests:</p>
                                        <div className="flex flex-wrap gap-2">
                                            {match.interests.map((interest, index) => (
                                                <span
                                                    key={index}
                                                    className="px-2 py-1 bg-rose-100 text-rose-700 rounded-full text-xs"
                                                >
                                                    {interest}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="flex justify-center gap-4 mt-4">
                                    <button
                                        onClick={() => handlePass(match._id)}
                                        disabled={!!processingIds[match._id]}
                                        className={`flex-1 py-2 px-4 rounded-full transition-colors flex items-center justify-center ${
                                            processingIds[match._id] === 'passing' 
                                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                                : processingIds[match._id] === 'passed'
                                                ? 'bg-gray-300 text-gray-500'
                                                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                                        }`}
                                        aria-label="Pass"
                                    >
                                        {processingIds[match._id] === 'passing' ? (
                                            <><LoadingSpinner size="small" /><span className="ml-2">Passing</span></>
                                        ) : processingIds[match._id] === 'passed' ? (
                                            'Passed'
                                        ) : (
                                            'Pass'
                                        )}
                                    </button>
                                    <button
                                        onClick={() => handleLike(match._id)}
                                        disabled={!!processingIds[match._id]}
                                        className={`flex-1 py-2 px-4 rounded-full transition-colors flex items-center justify-center ${
                                            processingIds[match._id] === 'liking' 
                                                ? 'bg-[#ff8f8f] text-white cursor-not-allowed'
                                                : processingIds[match._id] === 'liked'
                                                ? 'bg-green-500 text-white'
                                                : 'bg-[#FF6B6B] text-white hover:bg-[#ff5252]'
                                        }`}
                                        aria-label="Like"
                                    >
                                        {processingIds[match._id] === 'liking' ? (
                                            <><LoadingSpinner size="small" /><span className="ml-2">Liking</span></>
                                        ) : processingIds[match._id] === 'liked' ? (
                                            <div className="flex items-center">
                                                <HeartIcon className="w-4 h-4 mr-1" />
                                                <span>Liked</span>
                                            </div>
                                        ) : (
                                            'Like'
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-10 px-4">
                    <div className="mb-4 flex justify-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </div>
                    </div>
                    <h3 className="text-lg font-medium text-gray-800">No more profiles</h3>
                    <p className="text-gray-500 mt-2">Check back later for new potential matches!</p>
                    <button
                        onClick={fetchPotentialMatches}
                        className="mt-4 px-4 py-2 bg-[#FF6B6B] text-white rounded-full hover:bg-[#ff5252] transition-colors"
                    >
                        Refresh
                    </button>
                </div>
            )}

            {/* Match Modal */}
            {isMatchModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl p-6 max-w-sm w-full text-center">
                        <div className="w-20 h-20 mx-auto mb-4 flex items-center justify-center bg-[#FFB5B5] rounded-full">
                            <HeartIcon className="w-10 h-10 text-[#FF6B6B]" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">It's a match!</h3>
                        <p className="text-gray-600 mb-6">
                            You and {getCurrentMatchDetails()?.name || 'your match'} liked each other.
                        </p>
                        <div className="flex gap-4">
                            <button
                                onClick={() => setIsMatchModalOpen(false)}
                                className="flex-1 py-2 px-4 bg-gray-100 text-gray-800 rounded-full hover:bg-gray-200 transition-colors"
                            >
                                Keep Browsing
                            </button>
                            <Link
                                href="/auth/dashboard/matches"
                                className="flex-1 py-2 px-4 bg-[#6C63FF] text-white rounded-full hover:opacity-90 transition-colors text-center"
                                onClick={() => setIsMatchModalOpen(false)}
                            >
                                See Matches
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}