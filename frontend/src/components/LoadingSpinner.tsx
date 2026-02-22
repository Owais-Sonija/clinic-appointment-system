import React from 'react';

const LoadingSpinner: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
            <div className="relative w-16 h-16">
                <div className="absolute inset-0 border-4 border-primary/20 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-t-primary rounded-full animate-spin"></div>
            </div>
            <p className="mt-4 text-gray-500 font-medium tracking-wide">Syncing Medical Data...</p>
        </div>
    );
};

export default LoadingSpinner;
