import { LoginForm } from '@/components/auth/LoginForm';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function LoginPage() {
    return (
        <main className="min-h-screen bg-gradient-to-b from-white via-pink-50 to-pink-100">
            {/* Back Button - Fixed at top */}
            <div className="fixed top-12 left-6">
                <Link href="/" className="flex items-center text-gray-600">
                    <ArrowLeft className="h-5 w-5 mr-1" />
                    Back
                </Link>
            </div>

            {/* Centered Content */}
            <div className="min-h-screen flex flex-col justify-center px-6">
                <div className="space-y-2 mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">
                        Sign In
                    </h1>
                    <p className="text-sm text-gray-600">
                        Welcome back to HeartLink
                    </p>
                </div>

                <LoginForm />
            </div>
        </main>
    );
}