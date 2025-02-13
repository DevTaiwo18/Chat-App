'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { authService } from '@/services/auth';

export default function ResetPasswordPage() {
    const router = useRouter();
    const params = useParams();
    const token = params?.token as string;

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);

    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsLoading(true);
        setError('');

        const formData = new FormData(event.currentTarget);
        const password = formData.get('password') as string;
        const confirmPassword = formData.get('confirmPassword') as string;

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            setIsLoading(false);
            return;
        }

        try {
            await authService.resetPassword(token, { password });
            setIsSuccess(true);
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Failed to reset password');
        } finally {
            setIsLoading(false);
        }
    }

    if (isSuccess) {
        return (
            <main className="min-h-screen bg-gradient-to-b from-white via-pink-50 to-pink-100">
                <div className="min-h-screen flex flex-col justify-center items-center px-6">
                    <div className="w-full max-w-md text-center space-y-6">
                        <div className="bg-white/60 h-20 w-20 rounded-full flex items-center justify-center mx-auto">
                            <CheckCircle className="h-10 w-10 text-green-500" />
                        </div>
                        <div className="space-y-2">
                            <h1 className="text-2xl font-bold text-gray-900">
                                Password Reset Successfully!
                            </h1>
                            <p className="text-sm text-gray-600">
                                Your password has been changed successfully
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
                            Reset Your Password
                        </h1>
                        <p className="text-sm text-gray-600">
                            Enter your new password below
                        </p>
                    </div>

                    <form onSubmit={onSubmit} className="space-y-6">
                        <Input
                            type="password"
                            name="password"
                            placeholder="New Password"
                            required
                            className="w-full h-12 bg-white/60 border-none"
                        />
                        <Input
                            type="password"
                            name="confirmPassword"
                            placeholder="Confirm New Password"
                            required
                            className="w-full h-12 bg-white/60 border-none"
                        />
                        
                        {error && <p className="text-sm text-red-500">{error}</p>}
                        
                        <Button
                            type="submit"
                            className="w-full h-12 bg-[#FF6B6B] hover:bg-[#ff5252]"
                            disabled={isLoading}
                        >
                            Reset Password
                        </Button>
                    </form>
                </div>
            </div>
        </main>
    );
}
