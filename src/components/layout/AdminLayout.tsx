import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useGetCurrentUserProfileQuery } from '@/services/authApi';
import { Button } from '@/components/ui/button';

export const AdminLayout: React.FC = () => {
    const navigate = useNavigate();
    const { data: userProfile } = useGetCurrentUserProfileQuery();

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        navigate('/admin/login');
    };

    // Generate display name from email
    const getDisplayName = (email?: string) => {
        if (!email) return 'User';
        return email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1);
    };

    const displayName = getDisplayName(userProfile?.email);
    const initials = displayName.charAt(0).toUpperCase();

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        <div className="flex items-center">
                            <h1 className="text-xl font-semibold text-gray-900">PaLS Admin</h1>
                        </div>
                        <div className="flex items-center space-x-4">
                            {userProfile && (
                                <div className="flex items-center space-x-2 px-3 py-2 bg-gray-100 rounded-lg">
                                    <div className="w-8 h-8 bg-linear-to-br from-blue-400 to-indigo-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                                        {initials}
                                    </div>
                                    <div className="hidden sm:block">
                                        <p className="text-sm font-medium text-gray-900">{displayName}</p>
                                        <p className="text-xs text-gray-500">{userProfile.role  }</p>
                                    </div>
                                </div>
                            )}
                            <Button
                                variant="outline"
                                onClick={handleLogout}
                                className="text-sm"
                            >
                                Logout
                            </Button>
                        </div>
                    </div>
                </div>
            </header>
            <main className="max-w-7xl mx-auto">
                <Outlet />
            </main>
        </div>
    );
};