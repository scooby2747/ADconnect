import React, { useState, useEffect, useRef } from 'react';
import LoadingSpinner from './LoadingSpinner';
import PlayIcon from './icons/PlayIcon';
import PauseIcon from './icons/PauseIcon';
import { VOICE_ACTORS } from '../constants';
import { VoiceActorId } from '../types';
import { decode, decodePcmAudioData } from '../utils/audioUtils';

interface Step4Props {
    onGenerate: () => void;
    audioData: string; // base64
    isLoading: boolean;
    script: string;
    selectedVoice: VoiceActorId;
    setSelectedVoice: React.Dispatch<React.SetStateAction<VoiceActorId>>;
}

const Step4AudioGenerator: React.FC<Step4Props> = ({ onGenerate, audioData, isLoading, script, selectedVoice, setSelectedVoice }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioContextRef = useRef<AudioContext | null>(null);
    const sourceRef = useRef<AudioBufferSourceNode | null>(null);
    const audioBufferRef = useRef<AudioBuffer | null>(null);
    
    useEffect(() => {
        // Initialize AudioContext. It's best practice to create it once.
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();

        return () => {
            // Cleanup on component unmount
            sourceRef.current?.stop();
            audioContextRef.current?.close();
        }
    }, []);

    useEffect(() => {
        // When new audio data arrives, decode it and store it in a buffer.
        if (audioData && audioContextRef.current) {
            const decodedData = decode(audioData);
            decodePcmAudioData(decodedData, audioContextRef.current).then(buffer => {
                audioBufferRef.current = buffer;
            }).catch(err => console.error("Failed to decode audio data:", err));
        }
    }, [audioData]);

    const handlePlayPause = async () => {
        const audioContext = audioContextRef.current;
        if (!audioContext || !audioBufferRef.current) {
            console.warn("Audio is not ready to play yet.");
            return;
        }

        // Browsers may suspend AudioContext, resume it on user interaction.
        if (audioContext.state === 'suspended') {
            await audioContext.resume();
        }

        if (isPlaying) {
            sourceRef.current?.stop();
            setIsPlaying(false);
        } else {
            // Stop any previous source to prevent overlaps if play is clicked multiple times
            if (sourceRef.current) {
                sourceRef.current.stop();
            }

            // Create a new source node
            const source = audioContext.createBufferSource();
            source.buffer = audioBufferRef.current;
            source.connect(audioContext.destination);
            
            // When playback ends, update the state
            source.onended = () => {
                setIsPlaying(false);
                sourceRef.current = null;
            };

            source.start();
            sourceRef.current = source;
            setIsPlaying(true);
        }
    };


    return (
        <div>
            <h2 className="text-2xl font-bold text-brand-dark mb-4 text-center">Generate & Preview Audio</h2>
            <p className="text-center text-gray-600 mb-8">Bring your script to life! Generate a professional voice-over for your ad.</p>

            <div className="max-w-2xl mx-auto bg-gray-50 p-6 rounded-lg border border-gray-200 shadow-sm">
                <h3 className="text-lg font-semibold text-brand-primary border-b pb-2 mb-4">Your Script</h3>
                <p className="text-gray-700 italic">"{script}"</p>
            </div>

            <div className="mt-8 flex flex-col items-center">
                {isLoading && (
                    <div className="text-center py-4">
                        <LoadingSpinner />
                        <p className="mt-4 text-lg text-gray-600">Voicing your ad, this may take a moment...</p>
                    </div>
                )}

                {!audioData && !isLoading && (
                     <>
                        <div className="w-full max-w-sm mb-6">
                            <h4 className="text-lg font-semibold text-center text-brand-dark mb-3">Choose a Voice Actor</h4>
                            <div className="space-y-2">
                                {VOICE_ACTORS.map((voice) => (
                                    <button
                                        key={voice.id}
                                        onClick={() => setSelectedVoice(voice.id)}
                                        className={`w-full text-left p-3 rounded-lg border-2 transition-all ${selectedVoice === voice.id ? 'border-brand-primary bg-blue-50 ring-2 ring-brand-primary' : 'border-gray-300 bg-white hover:border-brand-secondary'}`}
                                    >
                                        <span className="font-semibold">{voice.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button
                            onClick={onGenerate}
                            className="bg-brand-primary hover:bg-blue-800 text-white font-bold py-3 px-8 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5"
                        >
                            Generate Audio
                        </button>
                    </>
                )}

                {audioData && !isLoading && (
                     <button
                        onClick={handlePlayPause}
                        className="flex items-center justify-center bg-brand-accent hover:bg-amber-500 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-transform transform hover:scale-105"
                    >
                        {isPlaying ? (
                            <>
                                <PauseIcon className="w-6 h-6 mr-2" />
                                <span>Pause</span>
                            </>
                        ) : (
                            <>
                                <PlayIcon className="w-6 h-6 mr-2" />
                                <span>Play Ad</span>
                            </>
                        )}
                    </button>
                )}
            </div>
        </div>
    );
};

export default Step4AudioGenerator;