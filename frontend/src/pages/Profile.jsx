import React, {useState} from 'react';
import ProfileModal from '../components/ProfileModal';
import {
    User,
    Mail,
    MapPin,
    Calendar,
    Trophy,
    CheckCircle2,
    Clock,
    Activity,
    Edit
} from 'lucide-react';

// Mock User Data
const USER_DATA = {
    name: 'Vishal Chouhan',
    username: '@vishal_codes',
    email: 'hello@vishalchouhan.com',
    joinDate: 'Joined September 2023',
    location: 'Bhopal, India',
    // Using a free placeholder avatar service for the profile image
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Vishal&backgroundColor=e2e8f0',
    stats: {
        rank: 14052,
        totalSolved: 256,
        easy: { solved: 145, total: 350 },
        medium: { solved: 89, total: 400 },
        hard: { solved: 22, total: 150 }
    }
};

const RECENT_SUBMISSIONS = [
    { id: 1, title: 'Two Sum', difficulty: 'Easy', time: '2 hours ago', language: 'Java' },
    { id: 2, title: 'Merge K Sorted Lists', difficulty: 'Hard', time: '5 hours ago', language: 'Java' },
    { id: 3, title: 'Binary Tree Level Order Traversal', difficulty: 'Medium', time: '1 day ago', language: 'Python' },
    { id: 4, title: 'Valid Parentheses', difficulty: 'Easy', time: '2 days ago', language: 'C++' },
    { id: 5, title: 'Longest Palindromic Substring', difficulty: 'Medium', time: '2 days ago', language: 'Java' },
];

const Profile = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleProfileUpdate = async (updatedData) => {
        // Simulate a network delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Simulate a backend validation error
        if (updatedData.username === 'admin' || updatedData.username === 'taken') {
            throw new Error("This username is already taken. Please choose another.");
        }

        // If successful, we would update our local USER_DATA state here or refetch from DB
        console.log("Profile updated successfully:", updatedData);
    };

    // Helper for difficulty colors
    const getDifficultyColor = (difficulty) => {
        switch (difficulty) {
            case 'Easy': return 'text-green-600 bg-green-100 dark:bg-green-900/20 dark:text-green-400';
            case 'Medium': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400';
            case 'Hard': return 'text-red-600 bg-red-100 dark:bg-red-900/20 dark:text-red-400';
            default: return 'text-gray-600 bg-gray-100 dark:bg-gray-800 dark:text-gray-400';
        }
    };

    const calculatePercentage = (solved, total) => {
        return Math.round((solved / total) * 100);
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#0B0D14] text-gray-900 dark:text-gray-100 font-sans transition-colors duration-200 py-8">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Profile Header Card */}
                <div className="bg-white dark:bg-[#12141C] border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm overflow-hidden mb-6 relative">
                    {/* Cover Photo / Gradient Banner */}
                    <div className="h-32 w-full bg-linear-to-r from-blue-600 to-indigo-600 dark:from-blue-800 dark:to-indigo-900"></div>

                    <div className="px-6 pb-6 relative sm:flex sm:items-end sm:justify-between">
                        <div className="sm:flex sm:space-x-5 items-end">
                            {/* Avatar */}
                            <div className="relative -mt-16 sm:-mt-16 mb-4 sm:mb-0">
                                <img
                                    className="h-32 w-32 rounded-full border-4 border-white dark:border-[#12141C] bg-white dark:bg-gray-800 object-cover shadow-md"
                                    src={USER_DATA.avatar}
                                    alt={USER_DATA.name}
                                />
                            </div>

                            {/* Name & Basic Info */}
                            <div className="pb-2">
                                <h1 className="text-2xl font-bold text-gray-900 dark:text-white truncate">
                                    {USER_DATA.name}
                                </h1>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                                    {USER_DATA.username}
                                </p>
                                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                                    <span className="flex items-center gap-1.5"><Mail size={14} /> {USER_DATA.email}</span>
                                    <span className="flex items-center gap-1.5"><MapPin size={14} /> {USER_DATA.location}</span>
                                    <span className="flex items-center gap-1.5"><Calendar size={14} /> {USER_DATA.joinDate}</span>
                                </div>
                            </div>
                        </div>

                        {/* Edit Profile Button */}
                        <div className="mt-5 sm:mt-0 pb-2">
                            <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-[#1A1D24] border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors text-sm font-medium shadow-sm w-full sm:w-auto justify-center">
                                <Edit size={16} />
                                Edit Profile
                            </button>
                        </div>
                    </div>
                </div>

                {/* Two-Column Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Left Column: Stats */}
                    <div className="lg:col-span-1 space-y-6">

                        {/* Global Rank Card */}
                        <div className="bg-white dark:bg-[#12141C] border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm p-6 flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Global Rank</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{USER_DATA.stats.rank.toLocaleString()}</p>
                            </div>
                            <div className="p-3 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg text-yellow-600 dark:text-yellow-500">
                                <Trophy size={24} />
                            </div>
                        </div>

                        {/* Solved Problems Breakdown */}
                        <div className="bg-white dark:bg-[#12141C] border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm p-6">
                            <div className="flex items-center gap-2 mb-6 text-gray-900 dark:text-white font-semibold">
                                <Activity size={18} className="text-blue-500" />
                                Problem Solving Stats
                            </div>

                            <div className="mb-6 text-center border-b border-gray-200 dark:border-gray-800 pb-6">
                                <p className="text-4xl font-bold text-gray-900 dark:text-white">{USER_DATA.stats.totalSolved}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Total Problems Solved</p>
                            </div>

                            {/* Progress Bars */}
                            <div className="space-y-5">
                                {/* Easy */}
                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="font-medium text-gray-700 dark:text-gray-300">Easy</span>
                                        <span className="text-gray-500 dark:text-gray-400">{USER_DATA.stats.easy.solved} / {USER_DATA.stats.easy.total}</span>
                                    </div>
                                    <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2">
                                        <div className="bg-green-500 h-2 rounded-full" style={{ width: `${calculatePercentage(USER_DATA.stats.easy.solved, USER_DATA.stats.easy.total)}%` }}></div>
                                    </div>
                                </div>

                                {/* Medium */}
                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="font-medium text-gray-700 dark:text-gray-300">Medium</span>
                                        <span className="text-gray-500 dark:text-gray-400">{USER_DATA.stats.medium.solved} / {USER_DATA.stats.medium.total}</span>
                                    </div>
                                    <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2">
                                        <div className="bg-yellow-500 h-2 rounded-full" style={{ width: `${calculatePercentage(USER_DATA.stats.medium.solved, USER_DATA.stats.medium.total)}%` }}></div>
                                    </div>
                                </div>

                                {/* Hard */}
                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="font-medium text-gray-700 dark:text-gray-300">Hard</span>
                                        <span className="text-gray-500 dark:text-gray-400">{USER_DATA.stats.hard.solved} / {USER_DATA.stats.hard.total}</span>
                                    </div>
                                    <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2">
                                        <div className="bg-red-500 h-2 rounded-full" style={{ width: `${calculatePercentage(USER_DATA.stats.hard.solved, USER_DATA.stats.hard.total)}%` }}></div>
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
                                <button className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline">
                                    View All
                                </button>
                            </div>

                            <ul className="divide-y divide-gray-200 dark:divide-gray-800">
                                {RECENT_SUBMISSIONS.map((submission) => (
                                    <li key={submission.id} className="p-4 sm:px-6 hover:bg-gray-50 dark:hover:bg-[#1A1D24] transition-colors cursor-pointer group">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="mt-1">
                                                    <CheckCircle2 size={20} className="text-green-500" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                                        {submission.title}
                                                    </p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-2">
                                                        <span>{submission.time}</span>
                                                        <span>•</span>
                                                        <span>{submission.language}</span>
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
                        </div>
                    </div>

                </div>
            </div>

            <ProfileModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                isFirstTime={false} // Set to true if triggering from Auth page
                initialData={{ username: USER_DATA.username.replace('@', ''), address: USER_DATA.location }}
                onSubmit={handleProfileUpdate}
            />
        </div>

    );
};

export default Profile;