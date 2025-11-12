import React from 'react';
import SparklesIcon from './icons/SparklesIcon';
import RadioIcon from './icons/RadioIcon';
import PlayIcon from './icons/PlayIcon';
import CheckCircleIcon from './icons/CheckCircleIcon';


interface LandingPageProps {
    onGetStarted: () => void;
    onAdminLogin: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted, onAdminLogin }) => {
    return (
        <div className="min-h-screen bg-brand-light text-brand-dark">
            {/* Header */}
            <header className="bg-white/80 backdrop-blur-md sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-brand-primary">AdConnect Local</h1>
                    <button
                        onClick={onGetStarted}
                        className="bg-brand-secondary hover:bg-blue-700 text-white font-bold py-2 px-5 rounded-lg transition-all duration-200"
                    >
                        Get Started
                    </button>
                </div>
            </header>

            {/* Hero Section */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center py-20 sm:py-32">
                    <span className="bg-brand-secondary/10 text-brand-primary font-semibold px-3 py-1 rounded-full text-sm">Powered by AI</span>
                    <h2 className="mt-4 text-4xl sm:text-6xl font-extrabold text-brand-dark tracking-tight">
                        Radio Ads for Your Local Business, <span className="text-brand-primary">Made Easy</span>.
                    </h2>
                    <p className="mt-6 max-w-2xl mx-auto text-lg sm:text-xl text-gray-600">
                        Go from idea to on-air in minutes. AdConnect Local uses AI to write, voice, and help you place ads on local radio stations.
                    </p>
                    <button
                        onClick={onGetStarted}
                        className="mt-10 bg-brand-primary hover:bg-blue-800 text-white font-bold py-4 px-8 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1"
                    >
                        Get Started Now &rarr;
                    </button>
                </div>

                {/* How It Works Section */}
                <div className="py-16 bg-white rounded-2xl shadow-lg px-6 lg:px-8">
                    <div className="text-center">
                        <h3 className="text-3xl font-bold text-brand-dark">How It Works in 3 Simple Steps</h3>
                        <p className="mt-2 text-gray-600">Create a professional radio advert in no time.</p>
                    </div>
                    <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-10">
                        <HowItWorksStep
                            icon={<SparklesIcon className="w-8 h-8 text-white" />}
                            title="1. Craft Your Script"
                            description="Answer a few simple questions about your business, and our AI will instantly write a professional 30-second radio script for you."
                        />
                        <HowItWorksStep
                            icon={<PlayIcon className="w-8 h-8 text-white" />}
                            title="2. Choose a Voice"
                            description="Bring your script to life. Select from a range of high-quality, AI-generated voices to perfectly match your brand's tone."
                        />
                         <HowItWorksStep
                            icon={<RadioIcon className="w-8 h-8 text-white" />}
                            title="3. Find Your Audience"
                            description="Select from a list of local radio stations and available ad slots that fit your budget and target customers."
                        />
                    </div>
                </div>

                {/* Benefits Section */}
                 <div className="py-20">
                    <div className="text-center max-w-3xl mx-auto">
                        <h3 className="text-3xl font-bold text-brand-dark">Unlock Your Local Market</h3>
                        <p className="mt-2 text-gray-600">Reach the customers right in your neighborhood with the power of local radio, simplified by AdConnect.</p>
                    </div>
                    <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        <Benefit title="Save Time & Money" description="No need for expensive agencies, voice actors, or production studios. Get everything you need in one place." />
                        <Benefit title="Professional Quality" description="Our AI is trained to create compelling scripts and generate studio-quality audio that will impress listeners." />
                        <Benefit title="Direct Local Reach" description="Connect directly with radio stations in your community and get your message in front of a loyal local audience." />
                    </div>
                 </div>

            </main>

            {/* Footer */}
            <footer className="bg-white mt-10">
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 text-center text-gray-500">
                    <p>&copy; {new Date().getFullYear()} AdConnect Local. Empowering small businesses.</p>
                     <button
                        onClick={onAdminLogin}
                        className="mt-2 text-sm text-gray-500 hover:text-brand-primary font-medium transition-colors"
                    >
                        Are you a station admin? Login here.
                    </button>
                </div>
            </footer>
        </div>
    );
};

interface HowItWorksStepProps {
    icon: React.ReactNode;
    title: string;
    description: string;
}

const HowItWorksStep: React.FC<HowItWorksStepProps> = ({ icon, title, description }) => (
    <div className="text-center">
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-brand-primary">
            {icon}
        </div>
        <h4 className="mt-5 text-xl font-bold text-brand-dark">{title}</h4>
        <p className="mt-2 text-gray-600">{description}</p>
    </div>
);

interface BenefitProps {
    title: string;
    description: string;
}

const Benefit: React.FC<BenefitProps> = ({ title, description }) => (
    <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow">
        <div className="flex items-start">
             <CheckCircleIcon className="w-7 h-7 text-green-500 flex-shrink-0 mr-3 mt-1" />
            <div>
                <h4 className="text-lg font-bold text-brand-dark">{title}</h4>
                <p className="mt-1 text-gray-600">{description}</p>
            </div>
        </div>
    </div>
);


export default LandingPage;