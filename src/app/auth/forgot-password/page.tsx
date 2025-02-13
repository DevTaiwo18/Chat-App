'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail } from 'lucide-react';
import Link from 'next/link';
import { authService } from '@/services/auth';

export default function ForgotPasswordPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [isEmailSent, setIsEmailSent] = useState(false);

    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsLoading(true);
        setError('');

        const formData = new FormData(event.currentTarget);
        const email = formData.get('email') as string;

        try {
            await authService.forgotPassword({ email });
            setIsEmailSent(true);
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Failed to send reset email');
        } finally {
            setIsLoading(false);
        }
    }

    if (isEmailSent) {
        return (
            <main className="min-h-screen bg-gradient-to-b from-white via-pink-50 to-pink-100">
                <div className="min-h-screen flex flex-col justify-center items-center px-6">
                    <div className="w-full max-w-md text-center space-y-6">
                        <div className="bg-white/60 h-20 w-20 rounded-full flex items-center justify-center mx-auto">
                            <Mail className="h-10 w-10 text-[#FF6B6B]" />
                        </div>
                        <div className="space-y-2">
                            <h1 className="text-2xl font-bold text-gray-900">
                                Check Your Email
                            </h1>
                            <p className="text-sm text-gray-600">
                                We've sent you instructions to reset your password
                            </p>
                        </div>
                        <Button
                            asChild
                            className="w-full h-12 bg-[#FF6B6B] hover:bg-[#ff5252]"
                        >
                            <Link href="/auth/login">
                                Return to Login
                            </Link>
                        </Button>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-gradient-to-b from-white via-pink-50 to-pink-100">
            <div className="min-h-screen flex flex-col justify-center items-center px-6">
                <div className="w-full max-w-md space-y-6">
                    <div className="text-center space-y-2">
                        <h1 className="text-2xl font-bold text-gray-900">
                            Forgot Password?
                        </h1>
                        <p className="text-sm text-gray-600">
                            Enter your email and we'll send you instructions to reset your password
                        </p>
                    </div>

                    <form onSubmit={onSubmit} className="space-y-6">
                        <Input
                            type="email"
                            name="email"
                            placeholder="Email"
                            required
                            className="w-full h-12 bg-white/60 border-none"
                        />
                        
                        {error && <p className="text-sm text-red-500">{error}</p>}
                        
                        <Button
                            type="submit"
                            className="w-full h-12 bg-[#FF6B6B] hover:bg-[#ff5252]"
                            disabled={isLoading}
                        >
                            Send Reset Instructions
                        </Button>

                        <div className="text-center text-sm">
                            <Link href="/auth/login" className="text-[#FF6B6B] hover:text-[#ff5252]">
                                Back to Login
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </main>
    );
}