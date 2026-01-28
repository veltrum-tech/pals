import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useVerifyMagicLinkQuery } from '@/services/authApi';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export const MagicLinkVerification: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const email = searchParams.get('email');
    const token = searchParams.get('token');

    const {
        data: verificationResult,
        isLoading,
        error,
    } = useVerifyMagicLinkQuery(
        { email: email!, token: token! },
        { skip: !email || !token }
    );

    useEffect(() => {
        if (verificationResult) {
            // Store token in localStorage
            localStorage.setItem('authToken', verificationResult.accessToken);
            // Redirect to admin dashboard
            setTimeout(() => {
                navigate('/admin/dashboard');
            }, 2000);
        }
    }, [verificationResult, navigate]);

    if (!email || !token) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Card className="p-6 w-full max-w-md mx-auto">
                    <div className="text-center">
                        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-red-600 text-2xl">✕</span>
                        </div>
                        <h2 className="text-xl font-semibold text-red-600 mb-2">Invalid Link</h2>
                        <p className="text-gray-600 mb-4">
                            This magic link is invalid or malformed. Please request a new one.
                        </p>
                        <Button onClick={() => navigate('/login')}>
                            Go to Login
                        </Button>
                    </div>
                </Card>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Card className="p-6 w-full max-w-md mx-auto">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <h2 className="text-xl font-semibold mb-2">Verifying Magic Link</h2>
                        <p className="text-gray-600">Please wait while we verify your login...</p>
                    </div>
                </Card>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Card className="p-6 w-full max-w-md mx-auto">
                    <div className="text-center">
                        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-red-600 text-2xl">✕</span>
                        </div>
                        <h2 className="text-xl font-semibold text-red-600 mb-2">Verification Failed</h2>
                        <p className="text-gray-600 mb-4">
                            {'data' in error && error.data ?
                                (error.data as any).message :
                                'This magic link is invalid or has expired. Please request a new one.'
                            }
                        </p>
                        <div className="space-y-2">
                            <Button onClick={() => navigate('/login')} className="w-full">
                                Request New Magic Link
                            </Button>
                            <Button variant="outline" onClick={() => navigate('/')} className="w-full">
                                Go to Home
                            </Button>
                        </div>
                    </div>
                </Card>
            </div>
        );
    }

    if (verificationResult) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Card className="p-6 w-full max-w-md mx-auto">
                    <div className="text-center">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-green-600 text-2xl">✓</span>
                        </div>
                        <h2 className="text-xl font-semibold text-green-600 mb-2">Login Successful!</h2>
                        <p className="text-gray-600 mb-2">
                            Welcome back, {verificationResult.user.name}!
                        </p>
                        <p className="text-sm text-gray-500 mb-4">
                            Redirecting you to the dashboard...
                        </p>
                        <div className="bg-gray-50 p-3 rounded text-xs text-left">
                            <p><strong>Email:</strong> {verificationResult.user.email}</p>
                            <p><strong>Role:</strong> {verificationResult.user.role}</p>
                            <p><strong>Tenant:</strong> {verificationResult.user.tenantId}</p>
                        </div>
                    </div>
                </Card>
            </div>
        );
    }

    return null;
};