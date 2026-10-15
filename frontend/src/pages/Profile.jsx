import React, { useEffect, useState } from 'react';
import ProfileModal from '../components/ProfileModal';
import {
    User,
    Mail,
    MapPin,
    Calendar,
    Trophy,
    CheckCircle2,
    XCircle,
    Clock,
    Activity,
    Edit,
    LaptopMinimalCheck,
    Loader2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { getJwtPayload } from '../components/RouteGuards';

const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL;

const Profile = () => {
    const [userData, setUserData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const payload = getJwtPayload();
        if (payload) {
            setIsAdmin(payload.role === 'ADMIN');
        }

        const fetchProfileData = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await fetch(`${BACKEND_BASE_URL}api/user/profile`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (response.ok) {
                    const data = await response.json();
                    setUserData(data);
                } else {
                    console.error("Failed to fetch user profile");
                }
            } catch (error) {
                console.error("Error connecting to profile API", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfileData();
    }, []);

    const handleProfileUpdate = async (updatedData) => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`${BACKEND_BASE_URL}api/user/profile`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: updatedData.username,
                    location: updatedData.address // Mapping modal's address field to backend location
                })
            });

            if (!response.ok) {
                const errorMessage = await response.text();
                throw new Error(errorMessage || "Failed to update profile.");
            }

            const updatedProfile = await response.json();
            setUserData(updatedProfile); // Dynamically update UI state with fresh backend data
            setIsModalOpen(false);
        } catch (err) {
            throw new Error(err.message || "An error occurred while updating profile.");
        }
    };

    const getDifficultyColor = (difficulty) => {
        const diff = difficulty?.toUpperCase();
        switch (diff) {
            case 'EASY': return 'text-green-600 bg-green-100 dark:bg-green-900/20 dark:text-green-400';
            case 'MEDIUM': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400';
            case 'HARD': return 'text-red-600 bg-red-100 dark:bg-red-900/20 dark:text-red-400';
            default: return 'text-gray-600 bg-gray-100 dark:bg-gray-800 dark:text-gray-400';
        }
    };

    const calculatePercentage = (solved, total) => {
        if (!total || total === 0) return 0;
        return Math.min(100, Math.round((solved / total) * 100));
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-[#0B0D14] flex justify-center items-center">
                <Loader2 className="animate-spin text-blue-600" size={40} />
            </div>
        );
    }

    if (!userData) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-[#0B0D14] flex flex-col justify-center items-center text-gray-500">
                <p>Failed to load profile data.</p>
                <Link to="/auth" className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg">Sign In Again</Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#0B0D14] text-gray-900 dark:text-gray-100 font-sans transition-colors duration-200 py-8">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Profile Header Card */}
                <div className="bg-white dark:bg-[#12141C] border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm overflow-hidden mb-6 relative">
                    <div className="h-32 w-full bg-linear-to-r from-blue-600 to-indigo-600 dark:from-blue-800 dark:to-indigo-900"></div>

                    <div className="px-6 pb-6 relative sm:flex sm:items-end sm:justify-between">
                        <div className="sm:flex sm:space-x-5 items-end">
                            <div className="relative -mt-16 sm:-mt-16 mb-4 sm:mb-0">
                                <img
                                    className="h-32 w-32 rounded-full border-4 border-white dark:border-[#12141C] bg-white dark:bg-gray-800 object-cover shadow-md"
                                    src={userData.avatar}
                                    alt={userData.name}
                                />
                            </div>

                            <div className="pb-2">
                                <h1 className="text-2xl font-bold text-gray-900 dark:text-white truncate">
                                    {userData.name}
                                </h1>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                                    {userData.username}
                                </p>
                                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                                    <span className="flex items-center gap-1.5"><Mail size={14} /> {userData.email}</span>
                                    <span className="flex items-center gap-1.5"><MapPin size={14} /> {userData.location}</span>
                                    <span className="flex items-center gap-1.5"><Calendar size={14} /> {userData.joinDate}</span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-5 sm:mt-0 pb-2 flex flex-wrap gap-2">
                            <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-[#1A1D24] border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors text-sm font-medium shadow-sm">
                                <Edit size={16} /> Edit Profile
                            </button>

                            {isAdmin &&
                                <Link to="/admin">
                                    <button className="flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium shadow-sm">
                                        <LaptopMinimalCheck size={16} /> Admin Workspace
                                    </button>
                                </Link>}
                        </div>
                    </div>
                </div>

                {/* Two-Column Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Left Column: Stats */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white dark:bg-[#12141C] border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm p-6 flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Global Rank</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">#{userData.stats.rank.toLocaleString()}</p>
                            </div>
                            <div className="p-3 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg text-yellow-600 dark:text-yellow-500">
                                <Trophy size={24} />
                            </div>
                        </div>

                        {/* Solved Problems Breakdown & Dynamic Progress Bars */}
                        <div className="bg-white dark:bg-[#12141C] border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm p-6">
                            <div className="flex items-center gap-2 mb-6 text-gray-900 dark:text-white font-semibold">
                                <Activity size={18} className="text-blue-500" />
                                Problem Solving Stats
                            </div>

                            <div className="mb-6 text-center border-b border-gray-200 dark:border-gray-800 pb-6">
                                <p className="text-4xl font-bold text-gray-900 dark:text-white">{userData.stats.totalSolved}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Total Problems Solved</p>
                            </div>

                            <div className="space-y-5">
                                {/* Easy */}
                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="font-medium text-gray-700 dark:text-gray-300">Easy</span>
                                        <span className="text-gray-500 dark:text-gray-400">{userData.stats.easy.solved} / {userData.stats.easy.total}</span>
                                    </div>
                                    <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2">
                                        <div className="bg-green-500 h-2 rounded-full transition-all duration-500" style={{ width: `${calculatePercentage(userData.stats.easy.solved, userData.stats.easy.total)}%` }}></div>
                                    </div>
                                </div>

                                {/* Medium */}
                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="font-medium text-gray-700 dark:text-gray-300">Medium</span>
                                        <span className="text-gray-500 dark:text-gray-400">{userData.stats.medium.solved} / {userData.stats.medium.total}</span>
                                    </div>
                                    <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2">
                                        <div className="bg-yellow-500 h-2 rounded-full transition-all duration-500" style={{ width: `${calculatePercentage(userData.stats.medium.solved, userData.stats.medium.total)}%` }}></div>
                                    </div>
                                </div>

                                {/* Hard */}
                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="font-medium text-gray-700 dark:text-gray-300">Hard</span>
                                        <span className="text-gray-500 dark:text-gray-400">{userData.stats.hard.solved} / {userData.stats.hard.total}</span>
                                    </div>
                                    <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2">
                                        <div className="bg-red-500 h-2 rounded-full transition-all duration-500" style={{ width: `${calculatePercentage(userData.stats.hard.solved, userData.stats.hard.total)}%` }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Recent Activity */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white dark:bg-[#12141C] border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm overflow-hidden">
                            <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between bg-gray-50 dark:bg-[#0B0D14]">
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                    <Clock size={18} className="text-blue-500" />
                                    Recent Submissions
                                </h2>
                            </div>

                            {userData.recentSubmissions.length === 0 ? (
                                <div className="p-8 text-center text-gray-500">No submissions recorded yet. Start solving problems!</div>
                            ) : (
                                <ul className="divide-y divide-gray-200 dark:divide-gray-800">
                                    {userData.recentSubmissions.map((submission) => (
                                        <li key={submission.id} className="p-4 sm:px-6 hover:bg-gray-50 dark:hover:bg-[#1A1D24] transition-colors">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-4">
                                                    <div className="mt-1">
                                                        {submission.status === 'ACCEPTED' ? (
                                                            <CheckCircle2 size={20} className="text-green-500" />
                                                        ) : (
                                                            <XCircle size={20} className="text-red-500" />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                                                            {submission.title}
                                                        </p>
                                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-2">
                                                            <span>{submission.time}</span>
                                                            <span>•</span>
                                                            <span className="font-mono">{submission.language}</span>
                                                            <span>•</span>
                                                            <span className={submission.status === 'ACCEPTED' ? 'text-green-500 font-medium' : 'text-red-500 font-medium'}>
                                                                {submission.status}
                                                            </span>
                                                        </p>
                                                    </div>
                                                </div>
                                                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(submission.difficulty)}`}>
                                                    {submission.difficulty}
                                                </span>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>

                </div>
            </div>

            <ProfileModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                isFirstTime={false}
                initialData={{ username: userData.username.replace('@', ''), address: userData.location }}
                onSubmit={handleProfileUpdate}
            />
        </div>
    );
};

export default Profile;