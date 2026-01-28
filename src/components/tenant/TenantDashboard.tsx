import React from 'react';
import { useGetTenantStatsQuery, useGetTenantSettingsQuery } from '@/services/tenantApi';
import { useGetCurrentUserProfileQuery } from '@/services/authApi';
import { Card } from '@/components/ui/card';

export const TenantDashboard: React.FC = () => {
    const {
        data: stats,
        isLoading: isStatsLoading,
        error: statsError,
        refetch: refetchStats
    } = useGetTenantStatsQuery();

    const {
        data: settings,
        isLoading: isSettingsLoading,
        error: settingsError,
        refetch: refetchSettings
    } = useGetTenantSettingsQuery();

    const {
        data: userProfile,
        isLoading: isUserLoading,
        error: userError
    } = useGetCurrentUserProfileQuery();

    // Generate display name from email
    const getDisplayName = (email?: string) => {
        if (!email) return 'User';
        return email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1);
    };

    const displayName = getDisplayName(userProfile?.email);
    const initials = displayName.charAt(0).toUpperCase();

    if (isStatsLoading || isSettingsLoading || isUserLoading) {
        return (
            <div className="p-6">
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 rounded mb-6"></div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="h-32 bg-gray-200 rounded"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (statsError || settingsError || userError) {
        return (
            <div className="p-6">
                <Card className="p-4 border-red-200 bg-red-50">
                    <h3 className="text-red-800 font-semibold">Error Loading Dashboard</h3>
                    <p className="text-red-600 text-sm mt-1">
                        {statsError ? 'Failed to load statistics' : settingsError ? 'Failed to load settings' : 'Failed to load user profile'}
                    </p>
                    <div className="mt-3 space-x-2">
                        <button
                            onClick={() => refetchStats()}
                            className="text-sm text-red-600 hover:text-red-800"
                        >
                            Retry Stats
                        </button>
                        <button
                            onClick={() => refetchSettings()}
                            className="text-sm text-red-600 hover:text-red-800"
                        >
                            Retry Settings
                        </button>
                    </div>
                </Card>
            </div>
        );
    }

    return (
        <div className="p-6">
            {/* User Profile Card */}
            {userProfile && (
                <Card className="p-6 mb-8 bg-linear-to-r from-blue-50 to-indigo-50 border-blue-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">Welcome, {displayName}!</h2>
                            <p className="text-gray-600 mt-1">
                                Role: <span className="font-semibold text-gray-900">{userProfile.role.replace('_', ' ')}</span>
                            </p>
                            <p className="text-gray-600 mt-1">
                                Email: <span className="font-semibold text-gray-900">{userProfile.email}</span>
                            </p>
                        </div>
                        <div className="text-right">
                            <div className="w-16 h-16 bg-linear-to-br from-blue-400 to-indigo-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                                {initials}
                            </div>
                        </div>
                    </div>
                </Card>
            )}

            <div className="mb-6">
                <h1 className="text-3xl font-bold">
                    {settings?.name || 'Tenant'} Dashboard
                </h1>
                <p className="text-gray-600 mt-1">
                    Vehicle registration management system
                </p>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card className="p-4">
                    <h3 className="text-sm font-medium text-gray-500">Total Staff</h3>
                    <p className="text-2xl font-bold mt-1">{stats?.team?.totalStaff || 0}</p>
                </Card>

                <Card className="p-4">
                    <h3 className="text-sm font-medium text-gray-500">Total Vehicles</h3>
                    <p className="text-2xl font-bold mt-1">{stats?.inventory?.vehicles || 0}</p>
                </Card>

                <Card className="p-4">
                    <h3 className="text-sm font-medium text-gray-500">Registrations</h3>
                    <p className="text-2xl font-bold mt-1">{stats?.operations?.registrations || 0}</p>
                </Card>

                <Card className="p-4">
                    <h3 className="text-sm font-medium text-gray-500">Pending Reviews</h3>
                    <p className="text-2xl font-bold mt-1 text-yellow-600">{stats?.operations?.pendingReviews || 0}</p>
                </Card>
            </div>

            {/* Revenue and Operations Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card className="p-4">
                    <h3 className="text-sm font-medium text-gray-500">Total Revenue</h3>
                    <p className="text-2xl font-bold mt-1 text-green-600">
                        {stats?.business?.currency} {stats?.business?.totalRevenue?.toLocaleString() || '0'}
                    </p>
                </Card>

                <Card className="p-4">
                    <h3 className="text-sm font-medium text-gray-500">Renewals</h3>
                    <p className="text-2xl font-bold mt-1">
                        {stats?.operations?.renewals || 0}
                    </p>
                </Card>

                <Card className="p-4">
                    <h3 className="text-sm font-medium text-gray-500">Operations Status</h3>
                    <div className="mt-2 space-y-1 text-sm">
                        <p><span className="font-medium">Registrations:</span> {stats?.operations?.registrations || 0}</p>
                        <p><span className="font-medium">Renewals:</span> {stats?.operations?.renewals || 0}</p>
                    </div>
                </Card>
            </div>

            {/* Tenant Info */}
            {settings && (
                <Card className="p-4 mt-8">
                    <h3 className="text-lg font-semibold mb-3">Tenant Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                            <span className="font-medium">Tenant Name:</span> {settings.name}
                        </div>
                        <div>
                            <span className="font-medium">Subdomain:</span> {settings.subdomain}
                        </div>
                        <div>
                            <span className="font-medium">State:</span> {settings.state}
                        </div>
                        <div>
                            <span className="font-medium">Status:</span>
                            <span className={`ml-2 px-2 py-1 rounded text-xs ${settings.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                }`}>
                                {settings.status}
                            </span>
                        </div>
                       
                        <div>
                            <span className="font-medium">Created:</span> {new Date(settings.createdAt).toLocaleDateString()}
                        </div>
                        <div>
                            <span className="font-medium">Updated:</span> {new Date(settings.updatedAt).toLocaleDateString()}
                        </div>
                    </div>
                </Card>
            )}
        </div>
    );
};