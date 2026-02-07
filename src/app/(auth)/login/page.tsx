'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createAuthClient } from 'better-auth/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import Link from 'next/link';

const authClient = createAuthClient({
    baseURL: process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') // client needs base url
});

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await authClient.signIn.email({
                email,
                password,
                callbackURL: '/menu',
            }, {
                onSuccess: () => {
                    toast.success('Logged in successfully');
                    router.push('/menu');
                },
                onError: (ctx) => {
                    toast.error(ctx.error.message);
                }
            });
        } catch (error) {
            toast.error('Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>Login</CardTitle>
                    <CardDescription>Enter your email below to login to your account</CardDescription>
                </CardHeader>
                <form onSubmit={handleLogin}>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="m@example.com"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-4">
                        <Button className="w-full" type="submit" disabled={loading}>
                            {loading ? 'Logging in...' : 'Login'}
                        </Button>
                        <div className="text-center text-sm">
                            Don't have an account?{' '}
                            <Link href="/register" className="underline">
                                Sign up
                            </Link>
                        </div>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
