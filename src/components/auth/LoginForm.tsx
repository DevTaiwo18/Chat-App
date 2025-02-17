'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { authService } from '@/services/auth';

export function LoginForm() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsLoading(true);
        setError('');

        const formData = new FormData(event.currentTarget);
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;

        try {
            const response = await authService.login({ email, password });
            localStorage.setItem('token', response.token);
            router.push('/auth/dashboard');
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Login failed');
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <form onSubmit={onSubmit} className="space-y-6 w-full">
            <div className="space-y-4">
                <Input
                    type="email"
                    name="email"
                    placeholder="Email"
                    required
                    className="w-full h-12 bg-white/60 border-none"
                />
                <div className="space-y-2">
                    <Input
                        type="password"
                        name="password"
                        placeholder="Password"
                        required
                        className="w-full h-12 bg-white/60 border-none"
                    />
                    <div className="text-right">
                        <Link 
                            href="/auth/forgot-password" 
                            className="text-sm text-[#FF6B6B] hover:text-[#ff5252]"
                        >
                            Forgot Password?
                        </Link>
                    </div>
                </div>
            </div>
            
            {error && <p className="text-sm text-red-500">{error}</p>}
            
            <Button
                type="submit"
                className="w-full h-12 bg-[#FF6B6B] hover:bg-[#ff5252]"
                disabled={isLoading}
            >
                Sign In
            </Button>

            <div className="text-center text-sm">
                <span className="text-gray-600">Don't have an account? </span>
                <Link href="/auth/register" className="text-[#FF6B6B] hover:text-[#ff5252]">
                    Sign Up
                </Link>
            </div>
        </form>
    );
}