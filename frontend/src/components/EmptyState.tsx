import React from 'react';

interface EmptyStateProps {
    title: string;
    description: string;
    icon?: string;
    action?: {
        label: string;
        onClick: () => void;
    };
}

const EmptyState: React.FC<EmptyStateProps> = ({ title, description, icon = '📋', action }) => {
    return (
        <div className="flex flex-col items-center justify-center text-center py-16 px-4 bg-gray-50/50 rounded-3xl border border-dashed border-gray-200 animate-fade-in">
            <div className="text-5xl mb-6 grayscale opacity-50">{icon}</div>
            <h3 className="text-xl font-bold text-dark mb-2">{title}</h3>
            <p className="text-gray-500 max-w-sm mb-8 leading-relaxed">{description}</p>
            {action && (
                <button
                    onClick={action.onClick}
                    className="btn-primary px-8 py-3 rounded-xl shadow-lg shadow-blue-500/20"
                >
                    {action.label}
                </button>
            )}
        </div>
    );
};

export default EmptyState;
