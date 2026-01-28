import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLoginMutation, useRequestMagicLinkMutation } from '@/services/authApi';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export const LoginForm: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loginMethod, setLoginMethod] = useState<'password' | 'magic'>('password');
    const navigate = useNavigate();
    const location = useLocation();

    const [login, { isLoading: isLoginLoading, error: loginError }] = useLoginMutation();
    const [requestMagicLink, { isLoading: isMagicLinkLoading, error: magicLinkError }] = useRequestMagicLinkMutation();

    // Get the intended destination from location state, default to dashboard
    const from = location.state?.from?.pathname || '/admin/dashboard';

    const handlePasswordLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const result = await login({ email, password }).unwrap();
            // Extract token - handle multiple possible response formats
            const token = (result as any).accessToken || (result as any).token || (result as any).access_token;
            
            if (!token) {
                console.error('No token found in login response:', result);
                alert('Login succeeded but no token was provided. Please try again.');
                return;
            }
            
            console.log("Login successful, storing token:", token);
            localStorage.setItem('authToken', token);
            
            // Verify token was stored
            const storedToken = localStorage.getItem('authToken');
            console.log("Verified token in localStorage:", storedToken);
            console.log("Token is valid:", storedToken !== null && storedToken !== undefined && storedToken !== 'undefined');
            
            // Navigate to dashboard or intended destination
            navigate(from, { replace: true });
        } catch (error) {
            console.error('Login failed:', error);
        }
    };

    const handleMagicLinkRequest = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const result = await requestMagicLink({ email }).unwrap();
            console.log('Magic link sent:', result);
            alert('Magic link sent to your email!');
        } catch (error) {
            console.error('Magic link request failed:', error);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center w-full h-screen">
            <div>
                <img src="/jigawa-logo.png" alt="Pals Logo" className='w-[30%] h-auto mx-auto' />
                <h1 className='text-xl w-full text-center font-bold my-8'>Login to the Pals Admin</h1>
            </div>
            <Card className="p-6 w-full max-w-md mx-auto">
                <div className="mb-4">
                    <div className="flex gap-2">
                        <Button
                            variant={loginMethod === 'password' ? 'secondary' : 'outline'}
                            onClick={() => setLoginMethod('password')}
                            className="flex-1"
                        >
                            Password Login
                        </Button>
                        <Button
                            variant={loginMethod === 'magic' ? 'secondary' : 'outline'}
                            onClick={() => setLoginMethod('magic')}
                            className="flex-1"
                        >
                            Magic Link
                        </Button>
                    </div>
                </div>

                {loginMethod === 'password' && (
                    <form onSubmit={handlePasswordLogin} className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium mb-1">
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-3 py-2 border rounded-md"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium mb-1">
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-3 py-2 border rounded-md"
                                required
                            />
                        </div>
                        {loginError && (
                            <div className="text-red-600 text-sm">
                                {'data' in loginError && loginError.data ?
                                    (loginError.data as any).message :
                                    'Login failed. Please try again.'
                                }
                            </div>
                        )}
                        <Button type="submit" disabled={isLoginLoading} className="w-full bg-secondary">
                            {isLoginLoading ? 'Logging in...' : 'Login'}
                        </Button>
                    </form>
                )}

                {loginMethod === 'magic' && (
                    <form onSubmit={handleMagicLinkRequest} className="space-y-4">
                        <div>
                            <label htmlFor="email-magic" className="block text-sm font-medium mb-1">
                                Email
                            </label>
                            <input
                                id="email-magic"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-3 py-2 border rounded-md"
                                required
                            />
                        </div>
                        {magicLinkError && (
                            <div className="text-red-600 text-sm">
                                {'data' in magicLinkError && magicLinkError.data ?
                                    (magicLinkError.data as any).message :
                                    'Failed to send magic link. Please try again.'
                                }
                            </div>
                        )}
                        <Button type="submit" disabled={isMagicLinkLoading} className="w-full">
                            {isMagicLinkLoading ? 'Sending...' : 'Send Magic Link'}
                        </Button>
                    </form>
                )}
            </Card>
        </div>
    );
};