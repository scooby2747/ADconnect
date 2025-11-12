import React, { useState, useCallback } from 'react';
import { Step, UserInput, PlacementRec, AdminSummary, VoiceActorId, ViewMode, AdRequest } from './types';
import { CONTACTED_STATIONS } from './constants';
import StepIndicator from './components/StepIndicator';
import Step1ScriptGenerator from './components/Step1_ScriptGenerator';
import Step2PlacementRecs from './components/Step2_PlacementRecs';
import Step3AdminSummary from './components/Step3_AdminSummary';
import Step4AudioGenerator from './components/Step4_AudioGenerator';
import AdminDashboard from './components/AdminDashboard';
import { generateScript, generateAdminSummary, generateAudio } from './services/geminiService';
import LandingPage from './components/LandingPage';

const initialState = {
    userInput: {
        businessName: '',
        productService: '',
        offer: '',
        location: '',
        contactInfo: '',
        targetAudience: '',
        tone: 'Friendly' as const,
        email: '',
        phone: '',
    },
    script: '',
    selectedPlacement: null,
    summary: null,
    audioData: '',
    error: null,
    selectedVoice: 'Kore' as VoiceActorId,
};

function App() {
    const [showLandingPage, setShowLandingPage] = useState<boolean>(true);
    const [viewMode, setViewMode] = useState<ViewMode>('advertiser');
    const [currentStep, setCurrentStep] = useState<Step>(Step.GenerateScript);
    const [userInput, setUserInput] = useState<UserInput>(initialState.userInput);
    const [script, setScript] = useState<string>(initialState.script);
    const [selectedPlacement, setSelectedPlacement] = useState<PlacementRec | null>(initialState.selectedPlacement);
    const [summary, setSummary] = useState<AdminSummary | null>(initialState.summary);
    const [audioData, setAudioData] = useState<string>(initialState.audioData);
    const [selectedVoice, setSelectedVoice] = useState<VoiceActorId>(initialState.selectedVoice);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(initialState.error);
    
    // State to hold all submitted ad requests
    const [adRequests, setAdRequests] = useState<AdRequest[]>([]);

    const resetState = () => {
        setCurrentStep(Step.GenerateScript);
        setUserInput(initialState.userInput);
        setScript(initialState.script);
        setSelectedPlacement(initialState.selectedPlacement);
        setSummary(initialState.summary);
        setAudioData(initialState.audioData);
        setSelectedVoice(initialState.selectedVoice);
        setError(initialState.error);
        setIsLoading(false);
    };

    const handleReset = () => {
        resetState();
        setViewMode('advertiser');
        setShowLandingPage(false); // Ensure we stay in the creator flow
    };
    
    const handleReturnHome = () => {
        resetState();
        setViewMode('advertiser');
        setShowLandingPage(true);
    };

    const handleGetStarted = () => {
        setShowLandingPage(false);
    };

    const handleAdminLogin = () => {
        resetState();
        setViewMode('admin');
        setShowLandingPage(false);
    };

    const handleNext = () => {
        setError(null);
        setCurrentStep(prev => Math.min(prev + 1, Object.keys(Step).length / 2));
    };

    const handleBack = () => {
        setError(null);
        setCurrentStep(prev => Math.max(prev - 1, 1));
    };

    const handleUpdateRequestStatus = (id: string, status: AdRequest['status']) => {
        setAdRequests(prevRequests => 
            prevRequests.map(req => req.id === id ? { ...req, status } : req)
        );
    };

    const handleFinalSubmit = () => {
        if (!selectedPlacement || !summary || !audioData) return;
        
        const newAdRequest: AdRequest = {
            id: new Date().toISOString(), // Simple unique ID
            status: 'Pending',
            userInput,
            script,
            placement: selectedPlacement,
            summary,
            audioData,
        };
        
        setAdRequests(prev => [...prev, newAdRequest]);
        setViewMode('admin');
    }
    
    const handleScriptGeneration = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const generatedScript = await generateScript(userInput);
            setScript(generatedScript);
        } catch (e) {
            console.error(e);
            setError('Failed to generate script. Please try again.');
        } finally {
            setIsLoading(false);
        }
    }, [userInput]);

    const handleSummaryGeneration = useCallback(async () => {
        if (!selectedPlacement || !script) return;
        setIsLoading(true);
        setError(null);
        try {
            const adminSummary = await generateAdminSummary(userInput, script, selectedPlacement);
            setSummary(adminSummary);
        } catch (e) {
            console.error(e);
            setError('Failed to generate summary. Please try again.');
        } finally {
            setIsLoading(false);
        }
    }, [userInput, script, selectedPlacement]);
    
    const handleAudioGeneration = useCallback(async () => {
        if (!script) return;
        setIsLoading(true);
        setError(null);
        try {
            const audio = await generateAudio(script, selectedVoice);
            setAudioData(audio);
        } catch (e) {
            console.error(e);
            setError('Failed to generate audio. Please try again.');
        } finally {
            setIsLoading(false);
        }
    }, [script, selectedVoice]);

    const renderAdvertiserView = () => {
        let stepComponent;
        switch (currentStep) {
            case Step.GenerateScript:
                stepComponent = <Step1ScriptGenerator 
                            userInput={userInput} 
                            setUserInput={setUserInput} 
                            onGenerate={handleScriptGeneration} 
                            script={script}
                            setScript={setScript}
                            isLoading={isLoading}
                        />;
                break;
            case Step.GenerateAudio:
                stepComponent = <Step4AudioGenerator 
                            onGenerate={handleAudioGeneration}
                            audioData={audioData}
                            isLoading={isLoading}
                            script={script}
                            selectedVoice={selectedVoice}
                            setSelectedVoice={setSelectedVoice}
                        />;
                break;
            case Step.RecommendPlacement:
                stepComponent = <Step2PlacementRecs 
                            stations={CONTACTED_STATIONS}
                            selectedPlacement={selectedPlacement}
                            setSelectedPlacement={setSelectedPlacement}
                        />;
                break;
            case Step.AdminSummary:
                stepComponent = <Step3AdminSummary 
                            onGenerate={handleSummaryGeneration}
                            summary={summary}
                            isLoading={isLoading}
                        />;
                break;
            default:
                stepComponent = null;
        }

        return (
            <>
                <header className="text-center mb-8">
                    <h1 className="text-4xl sm:text-5xl font-bold text-brand-primary">AdConnect Local</h1>
                    <p className="text-lg text-gray-600 mt-2">Create & place your radio ads in minutes.</p>
                </header>
                
                <main className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
                    <StepIndicator currentStep={currentStep} />
                    
                    <div className="mt-8">
                        {error && (
                            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-md" role="alert">
                                <p className="font-bold">Error</p>
                                <p>{error}</p>
                            </div>
                        )}
                        {stepComponent}
                    </div>
                </main>
                 <footer className="mt-8 flex justify-center items-center w-full">
                     {currentStep > Step.GenerateScript && (
                         <button
                            onClick={handleBack}
                            className="text-gray-600 hover:text-brand-dark font-medium py-2 px-4 rounded-lg transition-colors duration-200 mr-auto"
                        >
                            Back
                        </button>
                     )}
                     {((currentStep === Step.GenerateScript && script) || (currentStep === Step.GenerateAudio && audioData) || (currentStep === Step.RecommendPlacement && selectedPlacement)) && currentStep !== Step.AdminSummary && (
                         <button
                            onClick={handleNext}
                            className="bg-brand-primary hover:bg-blue-800 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5"
                        >
                            Next Step &rarr;
                        </button>
                     )}
                     {currentStep === Step.AdminSummary && summary && (
                         <button
                            onClick={handleFinalSubmit}
                            className="bg-brand-accent hover:bg-amber-500 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 ml-auto"
                        >
                            Submit Ad to Station
                        </button>
                     )}
                </footer>
            </>
        )
    }

    if (showLandingPage) {
        return <LandingPage onGetStarted={handleGetStarted} onAdminLogin={handleAdminLogin} />;
    }

    return (
        <div className="min-h-screen bg-brand-light text-brand-dark flex flex-col items-center p-4 sm:p-6 lg:p-8">
            <div className="w-full max-w-5xl mx-auto">
               {viewMode === 'advertiser' ? renderAdvertiserView() : (
                    <AdminDashboard
                        adRequests={adRequests}
                        onUpdateRequestStatus={handleUpdateRequestStatus}
                        onStartOver={handleReset}
                        onReturnHome={handleReturnHome}
                    />
               )}
            </div>
        </div>
    );
}

export default App;