import { motion } from 'framer-motion';
import { Zap, Brain, Sparkles } from 'lucide-react';

const Skeleton = ({ className }) => (
    <div className={`shimmer bg-white/[0.03] rounded-xl ${className}`}></div>
);

export const CardSkeleton = () => (
    <div className="glass-strong p-6 rounded-2xl space-y-4">
        <div className="flex items-center gap-3">
            <Skeleton className="w-10 h-10 rounded-xl" />
            <Skeleton className="w-32 h-6" />
        </div>
        <Skeleton className="w-full h-20" />
        <div className="flex gap-2">
            <Skeleton className="w-16 h-5 rounded-full" />
            <Skeleton className="w-16 h-5 rounded-full" />
        </div>
    </div>
);

export const ListSkeleton = ({ count = 3 }) => (
    <div className="space-y-4">
        {[...Array(count)].map((_, i) => (
            <div key={i} className="glass p-4 rounded-xl flex items-center justify-between gap-4">
                <div className="flex-1 space-y-2">
                    <Skeleton className="w-1/3 h-5" />
                    <div className="flex gap-2">
                        <Skeleton className="w-16 h-4 rounded-full" />
                        <Skeleton className="w-16 h-4 rounded-full" />
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="text-right space-y-1">
                        <Skeleton className="w-12 h-6" />
                        <Skeleton className="w-16 h-3" />
                    </div>
                    <Skeleton className="w-12 h-12 rounded-xl" />
                </div>
            </div>
        ))}
    </div>
);

export const StatsSkeleton = ({ count = 4 }) => (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[...Array(count)].map((_, i) => (
            <div key={i} className="glass p-4 rounded-2xl text-center space-y-2">
                <Skeleton className="w-8 h-8 rounded-full mx-auto" />
                <Skeleton className="w-12 h-6 mx-auto" />
                <Skeleton className="w-20 h-3 mx-auto" />
            </div>
        ))}
    </div>
);

export const ResumeSkeleton = () => (
    <div className="space-y-8 animate-pulse">
        <div className="glass-strong p-8 rounded-2xl">
            <div className="flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left">
                <Skeleton className="w-32 h-32 rounded-2xl" />
                <div className="flex-1 space-y-4">
                    <div className="space-y-2">
                        <Skeleton className="w-64 h-8" />
                        <Skeleton className="w-48 h-4" />
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {[...Array(5)].map((_, i) => <Skeleton key={i} className="w-20 h-6 rounded-full" />)}
                    </div>
                </div>
                <div className="w-32 h-32 rounded-full border-8 border-white/5 flex items-center justify-center relative">
                    <div className="absolute inset-0 rounded-full border-t-4 border-primary-500/20" />
                    <Skeleton className="w-16 h-10" />
                </div>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-6">
                <div className="glass-strong p-6 rounded-2xl space-y-4">
                    <Skeleton className="w-40 h-6" />
                    <div className="space-y-4">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="space-y-2">
                                <div className="flex justify-between"><Skeleton className="w-20 h-4" /><Skeleton className="w-10 h-4" /></div>
                                <Skeleton className="w-full h-2 rounded-full" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className="lg:col-span-2">
                <div className="glass-strong p-6 rounded-2xl space-y-6">
                    <Skeleton className="w-48 h-6" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-40 rounded-xl" />)}
                    </div>
                </div>
            </div>
        </div>
    </div>
);

export const DashboardSkeleton = () => (
    <div className="space-y-6 pt-32 pb-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
            <div className="space-y-2">
                <Skeleton className="w-48 h-8" />
                <Skeleton className="w-32 h-4" />
            </div>
            <Skeleton className="w-24 h-10 rounded-xl" />
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-32 rounded-2xl" />)}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
                <Skeleton className="h-64 rounded-2xl" />
                <Skeleton className="h-48 rounded-2xl" />
                <Skeleton className="h-40 rounded-2xl" />
            </div>
            <div className="space-y-6">
                <Skeleton className="h-40 rounded-2xl" />
                <Skeleton className="h-40 rounded-2xl" />
                <Skeleton className="h-64 rounded-2xl" />
            </div>
        </div>
    </div>
);

export const NeuralLoading = ({ type = 'quiz' }) => {
    const messages = {
        quiz: ['Synthesizing adaptive questions...', 'Calibrating difficulty levels...', 'Analyzing topic mastery...', 'Fetching intellectual challenges...'],
        assignment: ['Generating real-world scenarios...', 'Mapping industry requirements...', 'Structuring technical tasks...', 'Optimizing learning path...']
    };

    const icons = {
        quiz: <Zap className="text-accent-400" size={32} />,
        assignment: <Brain className="text-primary-400" size={32} />
    };

    return (
        <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
            <div className="relative mb-8">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                    className="absolute -inset-8 border border-white/5 rounded-full"
                />
                <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                    className="absolute -inset-12 border border-white/5 rounded-full border-dashed"
                />

                <div className="relative z-10 w-20 h-20 glass-strong rounded-[2rem] flex items-center justify-center border-white/10 shadow-2xl">
                    <motion.div
                        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute inset-0 bg-primary-500/20 blur-2xl rounded-full"
                    />
                    {icons[type] || icons.quiz}
                </div>

                {[...Array(6)].map((_, i) => (
                    <motion.div
                        key={i}
                        animate={{
                            x: [0, Math.cos(i * 60 * Math.PI / 180) * 80, 0],
                            y: [0, Math.sin(i * 60 * Math.PI / 180) * 80, 0],
                            opacity: [0, 1, 0]
                        }}
                        transition={{ duration: 3, repeat: Infinity, delay: i * 0.5 }}
                        className="absolute top-1/2 left-1/2 w-1.5 h-1.5 bg-accent-400 rounded-full blur-[1px]"
                    />
                ))}
            </div>

            <motion.h2
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xl font-display font-bold text-white mb-3"
            >
                <Sparkles className="inline-block mr-2 text-accent-400 mb-1" size={18} />
                Neural Engine <span className="gradient-text">Processing</span>
            </motion.h2>

            <div className="h-6 overflow-hidden">
                <motion.p
                    animate={{ y: [20, 0, -20] }}
                    transition={{ duration: 3, repeat: Infinity, times: [0, 0.5, 1] }}
                    className="text-sm text-gray-500 font-mono italic"
                >
                    {messages[type][0]}
                </motion.p>
            </div>
        </div>
    );
};
