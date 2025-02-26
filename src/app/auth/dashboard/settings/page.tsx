'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { profileService } from '@/services/profileService';
import type { ProfileResponse, Location } from '@/types/profile';
import { User, ArrowLeft, MapPin, Loader2, CheckCircle2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function SettingsPage() {
    const router = useRouter();
    const [mounted, setMounted] = useState(false);
    const [profile, setProfile] = useState<ProfileResponse | null>(null);
    const [originalProfile, setOriginalProfile] = useState<ProfileResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [locationStatus, setLocationStatus] = useState<string>('');

    useEffect(() => {
        setMounted(true);
        loadProfile();
    }, []);

    useEffect(() => {
        let timeout: NodeJS.Timeout;
        if (success) {
            timeout = setTimeout(() => {
                setSuccess(false);
            }, 3000);
        }
        return () => clearTimeout(timeout);
    }, [success]);

    const loadProfile = async () => {
        try {
            const data = await profileService.getProfile();
            setProfile(data);
            setOriginalProfile(JSON.parse(JSON.stringify(data))); // Deep copy for comparison
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load profile');
        } finally {
            setLoading(false);
        }
    };

    // Check if profile has been modified
    const hasChanges = () => {
        if (!profile || !originalProfile) return false;
        return JSON.stringify(profile) !== JSON.stringify(originalProfile);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setProfile(prev => prev ? ({
            ...prev,
            [name]: value
        }) : null);
        setSuccess(false); // Reset success state when changes are made
    };

    const validInterests = [
        'travel', 'music', 'movies', 'books', 'sports',
        'cooking', 'photography', 'art', 'gaming', 'fitness',
        'nature', 'technology', 'food', 'pets', 'dancing'
    ];

    const handleInterestToggle = (interest: string) => {
        setProfile(prev => prev ? ({
            ...prev,
            interests: prev.interests.includes(interest)
                ? prev.interests.filter(i => i !== interest)
                : [...prev.interests, interest]
        }) : null);
        setSuccess(false);
    };

    const handleGenderPreferenceToggle = (gender: 'male' | 'female' | 'other') => {
        setProfile(prev => {
            if (!prev) return null;
            return {
                ...prev,
                preferences: {
                    ...prev.preferences,
                    gender: prev.preferences.gender.includes(gender)
                        ? prev.preferences.gender.filter(g => g !== gender)
                        : [...prev.preferences.gender, gender]
                }
            };
        });
        setSuccess(false);
    };

    const handleGetLocation = () => {
        if (!mounted || typeof window === 'undefined') return;

        setLocationStatus('Getting location...');
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const newLocation: Location = {
                        type: 'Point',
                        coordinates: [position.coords.longitude, position.coords.latitude]
                    };
                    setProfile(prev => prev ? {
                        ...prev,
                        location: newLocation
                    } : null);
                    setLocationStatus('Location updated');
                    setSuccess(false);
                },
                (error) => {
                    setLocationStatus('Error getting location');
                    console.error('Error getting location:', error);
                }
            );
        } else {
            setLocationStatus('Geolocation is not supported by your browser');
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!hasChanges()) return; // Prevent unnecessary API calls

        setError('');
        setSaving(true);
        setSuccess(false);

        try {
            if (!profile) throw new Error('No profile data');

            const updatedProfile = await profileService.updateProfile({
                name: profile.name,
                age: profile.age,
                gender: profile.gender,
                bio: profile.bio,
                interests: profile.interests,
                preferences: profile.preferences,
                location: profile.location
            });

            setProfile(updatedProfile);
            setOriginalProfile(JSON.parse(JSON.stringify(updatedProfile))); // Update original state
            setSuccess(true);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    // Prevent hydration mismatch
    if (!mounted) return null;

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Loader2 className="h-8 w-8 text-[#ff5252] animate-spin" />
            </div>
        );
    }

    if (!profile) {
        return <div className="flex justify-center items-center min-h-screen">Profile not found</div>;
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-white via-pink-50 to-pink-100">
            {/* Back Button Header */}
            <div className="sticky top-0 bg-white shadow-sm p-4 z-10">
                <button
                    type="button"
                    onClick={() => router.push('/auth/dashboard')}
                    className="flex items-center text-gray-600 hover:text-[#ff5252]"
                >
                    <ArrowLeft className="h-5 w-5 mr-2" />
                    <span>Back</span>
                </button>
            </div>

            <form onSubmit={handleSubmit} className="max-w-md mx-auto px-4 py-8 space-y-6">
                {/* Profile Picture Display (non-interactive) */}
                <div className="flex flex-col items-center space-y-4">
                    <div className="h-32 w-32 rounded-full overflow-hidden">
                        {profile.profilePicture ? (
                            <img
                                src={profile.profilePicture}
                                alt="Profile"
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            <div className="h-full w-full bg-gray-200 flex items-center justify-center">
                                <User className="h-12 w-12 text-gray-400" />
                            </div>
                        )}
                    </div>
                </div>

                {/* Name */}
                <div>
                    <input
                        type="text"
                        name="name"
                        placeholder="Name"
                        value={profile.name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#ff5252]"
                        required
                    />
                </div>

                {/* Age */}
                <div>
                    <input
                        type="number"
                        name="age"
                        placeholder="Age"
                        value={profile.age}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#ff5252]"
                        min="18"
                        max="100"
                        required
                    />
                </div>

                {/* Gender */}
                <div>
                    <select
                        name="gender"
                        value={profile.gender}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#ff5252]"
                        required
                    >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                    </select>
                </div>

                {/* Bio */}
                <div>
                    <textarea
                        name="bio"
                        placeholder="Tell us about yourself"
                        value={profile.bio}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#ff5252] h-32"
                        required
                    />
                </div>

                {/* Interests */}
                <div>
                    <label className="text-sm text-gray-600 block mb-2">Interests</label>
                    <div className="flex flex-wrap gap-2">
                        {validInterests.map(interest => (
                            <button
                                key={interest}
                                type="button"
                                onClick={() => handleInterestToggle(interest)}
                                className={`px-4 py-2 rounded-full text-sm ${profile.interests.includes(interest)
                                    ? 'bg-[#ff5252] text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                {interest.charAt(0).toUpperCase() + interest.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Gender Preferences */}
                <div>
                    <label className="text-sm text-gray-600 block mb-2">Interested In</label>
                    <div className="flex flex-wrap gap-2">
                        {(['male', 'female', 'other'] as const).map(gender => (
                            <button
                                key={gender}
                                type="button"
                                onClick={() => handleGenderPreferenceToggle(gender)}
                                className={`px-4 py-2 rounded-full text-sm ${profile.preferences.gender.includes(gender)
                                    ? 'bg-[#ff5252] text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                {gender.charAt(0).toUpperCase() + gender.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Age Range Preferences */}
                <div className="space-y-2">
                    <label className="text-sm text-gray-600 block">Age Range Preference</label>
                    <div className="flex items-center space-x-4">
                        <input
                            type="number"
                            value={profile.preferences.ageRange.min}
                            onChange={(e) => {
                                setProfile(prev => prev ? ({
                                    ...prev,
                                    preferences: {
                                        ...prev.preferences,
                                        ageRange: { ...prev.preferences.ageRange, min: parseInt(e.target.value) }
                                    }
                                }) : null);
                                setSuccess(false);
                            }}
                            className="w-24 px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#ff5252]"
                            min="18"
                            max="100"
                        />
                        <span>to</span>
                        <input
                            type="number"
                            value={profile.preferences.ageRange.max}
                            onChange={(e) => {
                                setProfile(prev => prev ? ({
                                    ...prev,
                                    preferences: {
                                        ...prev.preferences,
                                        ageRange: { ...prev.preferences.ageRange, max: parseInt(e.target.value) }
                                    }
                                }) : null);
                                setSuccess(false);
                            }}
                            className="w-24 px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#ff5252]"
                            min="18"
                            max="100"
                        />
                    </div>
                </div>

                {/* Max Distance */}
                <div className="space-y-2">
                    <label className="text-sm text-gray-600 block">Maximum Distance (km)</label>
                    <input
                        type="number"
                        value={profile.preferences.maxDistance}
                        onChange={(e) => {
                            setProfile(prev => prev ? ({
                                ...prev,
                                preferences: {
                                    ...prev.preferences,
                                    maxDistance: parseInt(e.target.value)
                                }
                            }) : null);
                            setSuccess(false);
                        }}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#ff5252]"
                        min="1"
                        max="100"
                    />
                </div>

                {/* Location */}
                <div className="space-y-2">
                    <label className="text-sm text-gray-600 block">Location</label>
                    <div className="flex items-center space-x-4">
                        <button
                            type="button"
                            onClick={handleGetLocation}
                            className="flex items-center px-4 py-3 rounded-lg border border-gray-300 
                       hover:border-[#ff5252] focus:ring-2 focus:ring-[#ff5252] bg-white"
                        >
                            <MapPin className="h-5 w-5 mr-2 text-gray-500" />
                            {profile.location ? 'Update Location' : 'Get Location'}
                        </button>
                        {locationStatus && (
                            <span className="text-sm text-gray-600">{locationStatus}</span>
                        )}
                    </div>
                    {profile.location && (
                        <p className="text-sm text-gray-600">
                            Location set: {profile.location.coordinates[1].toFixed(4)}°N, {profile.location.coordinates[0].toFixed(4)}°E
                        </p>
                    )}
                </div>

                {/* Status Messages */}
                <div className="space-y-2">
                    {/* Success Message */}
                    {success && (
                        <Alert className="bg-green-50 border-green-200">
                            <AlertDescription className="text-green-600 flex items-center">
                                <CheckCircle2 className="h-4 w-4 mr-2" />
                                Profile updated successfully!
                            </AlertDescription>
                        </Alert>
                    )}

                    {/* Error Display */}
                    {error && (
                        <Alert className="bg-red-50 border-red-200">
                            <AlertDescription className="text-red-600">
                                {error}
                            </AlertDescription>
                        </Alert>
                    )}
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={saving || !hasChanges()}
                    className={`w-full py-3 rounded-lg font-semibold transition-colors duration-200 
                     flex items-center justify-center space-x-2
                     ${hasChanges()
                            ? 'bg-[#ff5252] text-white hover:bg-[#ff3333]'
                            : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}
                >
                    {saving ? (
                        <>
                            <Loader2 className="h-5 w-5 animate-spin" />
                            <span>Saving Changes...</span>
                        </>
                    ) : (
                        <span>{hasChanges() ? 'Save Changes' : 'No Changes to Save'}</span>
                    )}
                </button>
            </form>
        </div>
    );
}