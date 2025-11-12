import React from 'react';
import { UserInput, Tone } from '../types';
import LoadingSpinner from './LoadingSpinner';
import SparklesIcon from './icons/SparklesIcon';

interface Step1Props {
    userInput: UserInput;
    setUserInput: React.Dispatch<React.SetStateAction<UserInput>>;
    onGenerate: () => void;
    script: string;
    setScript: React.Dispatch<React.SetStateAction<string>>;
    isLoading: boolean;
}

const TONES: Tone[] = ['Friendly', 'Energetic', 'Calm', 'Professional'];

const Step1ScriptGenerator: React.FC<Step1Props> = ({ userInput, setUserInput, onGenerate, script, setScript, isLoading }) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setUserInput({ ...userInput, [e.target.name]: e.target.value });
    };

    const isFormValid =
        userInput.businessName.trim() !== '' &&
        userInput.productService.trim() !== '' &&
        userInput.offer.trim() !== '' &&
        userInput.location.trim() !== '' &&
        userInput.targetAudience.trim() !== '' &&
        userInput.email.trim() !== '' &&
        userInput.phone.trim() !== '';

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
                <h2 className="text-2xl font-bold text-brand-dark mb-4">Tell us about your business</h2>
                <div className="space-y-4">
                    <InputField label="Business Name" name="businessName" value={userInput.businessName} onChange={handleChange} />
                    <InputField label="Product or Service" name="productService" value={userInput.productService} onChange={handleChange} />
                    <InputField label="Offer or Special Message" name="offer" value={userInput.offer} onChange={handleChange} />
                    <InputField label="Location or Area Served" name="location" value={userInput.location} onChange={handleChange} />
                    <InputField label="Target Audience" name="targetAudience" value={userInput.targetAudience} onChange={handleChange} placeholder="e.g., young families, retirees" />
                    <InputField label="Contact Info for Ad (Optional)" name="contactInfo" value={userInput.contactInfo} onChange={handleChange} placeholder="e.g., a public phone number or website" />
                    
                    <div className="p-4 bg-blue-50 border border-brand-secondary rounded-lg">
                        <h3 className="font-semibold text-brand-dark mb-2">Your Contact Details</h3>
                        <p className="text-sm text-gray-600 mb-3">This is for the station to contact you. It will not be in the ad.</p>
                        <div className="space-y-3">
                            <InputField label="Your Contact Email" name="email" value={userInput.email} onChange={handleChange} type="email" />
                            <InputField label="Your Contact Phone" name="phone" value={userInput.phone} onChange={handleChange} type="tel" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Tone</label>
                        <div className="flex flex-wrap gap-2">
                        {TONES.map(tone => (
                            <button
                                key={tone}
                                type="button"
                                onClick={() => setUserInput({ ...userInput, tone })}
                                className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors ${userInput.tone === tone ? 'bg-brand-primary text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                            >
                                {tone}
                            </button>
                        ))}
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="flex flex-col">
                <h2 className="text-2xl font-bold text-brand-dark mb-4">Your 30-Second Radio Script</h2>
                 <div className={`flex-grow p-4 border-2 rounded-lg transition-colors min-h-[250px] ${script ? 'border-brand-primary bg-blue-50' : 'border-dashed border-gray-300 bg-gray-50'}`}>
                    {isLoading ? (
                         <div className="flex items-center justify-center h-full">
                            <LoadingSpinner />
                         </div>
                    ) : script ? (
                        <textarea
                            value={script}
                            onChange={(e) => setScript(e.target.value)}
                            className="w-full h-full bg-transparent border-none focus:ring-0 resize-none text-gray-800 font-mono"
                            aria-label="Editable radio script"
                        />
                    ) : (
                        <div className="flex items-center justify-center h-full text-center text-gray-500">
                            <p>Your generated script will appear here.</p>
                        </div>
                    )}
                </div>

                <button
                    onClick={onGenerate}
                    disabled={!isFormValid || isLoading}
                    className="mt-4 w-full flex items-center justify-center bg-brand-accent hover:bg-amber-500 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                    <SparklesIcon className="w-5 h-5 mr-2" />
                    {isLoading ? 'Generating...' : (script ? 'Regenerate Script' : 'Generate Script')}
                </button>
            </div>
        </div>
    );
};

// Helper component to reduce repetition
interface InputFieldProps {
    label: string;
    name: keyof UserInput;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    placeholder?: string;
    type?: string;
}

const InputField: React.FC<InputFieldProps> = ({ label, name, value, onChange, placeholder, type = 'text' }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700">{label}</label>
        <input
            type={type}
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm"
            required={name === 'email' || name === 'phone' || name === 'businessName' || name === 'productService' || name === 'offer' || name === 'location' || name === 'targetAudience'}
        />
    </div>
);

export default Step1ScriptGenerator;