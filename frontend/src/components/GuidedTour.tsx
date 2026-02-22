import React, { useState, useEffect, useContext } from 'react';
import Joyride, { Step, CallBackProps, STATUS } from 'react-joyride';
import { AuthContext } from '../context/AuthContext';
import axiosInstance from '../api/axiosInstance';

const GuidedTour: React.FC = () => {
    const { user, setUser } = useContext(AuthContext)!;
    const [run, setRun] = useState(false);

    useEffect(() => {
        if (user && !user.hasCompletedTour) {
            setRun(true);
        }
    }, [user]);

    const handleJoyrideCallback = async (data: CallBackProps) => {
        const { status } = data;
        const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];

        if (finishedStatuses.includes(status)) {
            setRun(false);
            try {
                // Update backend
                await axiosInstance.patch('/api/auth/profile', { hasCompletedTour: true });
                // Update context
                if (user) {
                    setUser({ ...user, hasCompletedTour: true });
                }
            } catch (error) {
                console.error("Failed to update tour status", error);
            }
        }
    };

    const doctorSteps: Step[] = [
        {
            target: 'body',
            content: 'Welcome Dr. ' + (user?.name || '') + '! This is your specialized clinical workspace.',
            placement: 'center',
        },
        {
            target: '.tour-doctor-welcome',
            content: 'This area greets you and provides a quick context of your current session.',
        },
        {
            target: '.tour-doctor-stats',
            content: 'Monitor your daily performance, including today\'s appointments and completion rates.',
        },
        {
            target: '.tour-doctor-charts',
            content: 'Visualize appointment trends and patient flow over time here.',
        },
        {
            target: '.tour-doctor-actions',
            content: 'Quickly access common clinical tasks like creating EMRs or updating your availability.',
        }
    ];

    const patientSteps: Step[] = [
        {
            target: 'body',
            content: 'Welcome to your MediClinic Dashboard! Let us show you around.',
            placement: 'center',
        },
        {
            target: '.tour-welcome-card',
            content: 'This is your overview section where you can see your upcoming visits at a glance.',
        },
        {
            target: '.tour-book-btn',
            content: 'Ready for a checkup? Click here to start our new 3-step booking wizard.',
        },
        {
            target: '.tour-past-tab',
            content: 'Access your full medical history and digital records anytime from this tab.',
        },
        {
            target: '.tour-active-tab',
            content: 'Use this menu to navigate between your active appointments and historical data.',
        }
    ];

    const adminSteps: Step[] = [
        {
            target: 'body',
            content: 'Welcome to the Administrator Command Center.',
            placement: 'center',
        },
        {
            target: '.tour-stats-grid',
            content: 'Monitor clinic performance, revenue, and patient flow in real-time.',
        },
        {
            target: '.tour-admin-nav',
            content: 'Manage your medical staff, patient database, and clinic services from here.',
        }
    ];

    const getSteps = () => {
        if (user?.role === 'admin') return adminSteps;
        if (user?.role === 'doctor') return doctorSteps;
        return patientSteps;
    };

    const steps = getSteps();

    if (!user || user.hasCompletedTour) return null;

    return (
        <Joyride
            callback={handleJoyrideCallback}
            continuous
            hideCloseButton
            run={run}
            scrollToFirstStep
            showProgress
            showSkipButton
            steps={steps}
            styles={{
                options: {
                    primaryColor: '#2563eb',
                    zIndex: 1000,
                },
            }}
        />
    );
};

export default GuidedTour;
