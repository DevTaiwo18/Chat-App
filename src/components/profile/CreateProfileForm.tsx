'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { profileService } from '@/services/profileService';
import type { FormData, ProfileData } from '@/types/profile';

export default function CreateProfileForm() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Initial form state
    const initialFormData: FormData = {
        name: '',
        age: '',
        gender: '',
        bio: '',
        interests: [],
        preferences: {
            ageRange: {
                min: 18,
                max: 99
            },
            gender: [],
            maxDistance: 50
        }
    };

    const [formData, setFormData] = useState<FormData>(initialFormData);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Validate required fields
            if (!formData.name || !formData.age || !formData.gender || !formData.bio) {
                throw new Error('Please fill in all required fields');
            }

            // Validate age
            const age = parseInt(formData.age);
            if (isNaN(age) || age < 18 || age > 100) {
                throw new Error('Invalid age. Must be between 18 and 100');
            }

            // Validate gender preferences
            if (formData.preferences.gender.length === 0) {
                throw new Error('Please select at least one gender preference');
            }

            // Transform form data to match API requirements
            const profileData: ProfileData = {
                ...formData,
                age: age,
                gender: formData.gender as 'male' | 'female' | 'other',
                preferences: {
                    ...formData.preferences,
                    gender: formData.preferences.gender as ('male' | 'female' | 'other')[]
                }
            };

            await profileService.createProfile(profileData);
            router.push('/auth/create-profile/success');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    // Form input handlers
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const validInterests = [
        'travel', 'music', 'movies', 'books', 'sports',
        'cooking', 'photography', 'art', 'gaming', 'fitness',
        'nature', 'technology', 'food', 'pets', 'dancing'
    ];

    const handleInterestToggle = (interest: string) => {
        setFormData(prev => ({
            ...prev,
            interests: prev.interests.includes(interest)
                ? prev.interests.filter(i => i !== interest)
                : [...prev.interests, interest]
        }));
    };

    const handleGenderPreferenceToggle = (gender: string) => {
        setFormData(prev => ({
            ...prev,
            preferences: {
                ...prev.preferences,
                gender: prev.preferences.gender.includes(gender)
                    ? prev.preferences.gender.filter(g => g !== gender)
                    : [...prev.preferences.gender, gender]
            }
        }));
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto px-4">
            {/* Name */}
            <div>
                <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={formData.name}
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
                    value={formData.age}
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
                    value={formData.gender}
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
                    value={formData.bio}
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
                            className={`px-4 py-2 rounded-full text-sm ${formData.interests.includes(interest)
                                    ? 'bg-[#ff5252] text-white'
                                    : 'bg-gray-100 text-gray-700'
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
                    {['male', 'female', 'other'].map(gender => (
                        <button
                            key={gender}
                            type="button"
                            onClick={() => handleGenderPreferenceToggle(gender)}
                            className={`px-4 py-2 rounded-full text-sm ${formData.preferences.gender.includes(gender)
                                    ? 'bg-[#ff5252] text-white'
                                    : 'bg-gray-100 text-gray-700'
                                }`}
                        >
                            {gender.charAt(0).toUpperCase() + gender.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {/* Error Display */}
            {error && (
                <div className="bg-red-50 text-red-500 px-4 py-2 rounded-lg text-sm">
                    {error}
                </div>
            )}

            {/* Submit Button */}
            <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#ff5252] text-white py-3 rounded-lg font-semibold 
                         hover:bg-[#ff3333] disabled:bg-[#ff8080] disabled:cursor-not-allowed"
            >
                {loading ? 'Creating Profile...' : 'Create Profile'}
            </button>
        </form>
    );
}