import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import CreateProfileForm from '@/components/profile/CreateProfileForm';

export default function CreateProfilePage() {
    return (
        <main className="min-h-screen bg-gradient-to-b from-white via-pink-50 to-pink-100">
            {/* Header */}
            <div className="pt-10 pb-8 px-6">
                <h1 className="text-2xl font-bold text-gray-900">
                    Create Your Profile
                </h1>
                <p className="text-sm text-gray-600 mt-2">
                    Tell us about yourself to get started
                </p>
            </div>

            {/* Form */}
            <CreateProfileForm />
        </main>
    );
}