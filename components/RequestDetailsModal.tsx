import React, { useState, useEffect, useRef } from 'react';
import { AdRequest } from '../types';
import { decode, decodePcmAudioData, createWavBlobFromBase64 } from '../utils/audioUtils';
import PlayIcon from './icons/PlayIcon';
import PauseIcon from './icons/PauseIcon';
import DownloadIcon from './icons/DownloadIcon';
import CheckCircleIcon from './icons/CheckCircleIcon';

interface ModalProps {
    request: AdRequest;
    onClose: () => void;
    onAccept: (id: string) => void;
}

const RequestDetailsModal: React.FC<ModalProps> = ({ request, onClose, onAccept }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioContextRef = useRef<AudioContext | null>(null);
    const sourceRef = useRef<AudioBufferSourceNode | null>(null);
    const audioBufferRef = useRef<AudioBuffer | null>(null);

    useEffect(() => {
        const initAudio = async () => {
            audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
            if (request.audioData && audioContextRef.current) {
                try {
                    const decodedData = decode(request.audioData);
                    const buffer = await decodePcmAudioData(decodedData, audioContextRef.current);
                    audioBufferRef.current = buffer;
                } catch (err) {
                    console.error("Failed to decode audio data:", err);
                }
            }
        };
        initAudio();
        
        return () => {
            sourceRef.current?.stop();
            audioContextRef.current?.close();
        };
    }, [request.audioData]);

    const handlePlayPause = async () => {
        const audioContext = audioContextRef.current;
        if (!audioContext || !audioBufferRef.current) return;
        if (audioContext.state === 'suspended') await audioContext.resume();

        if (isPlaying) {
            sourceRef.current?.stop();
            setIsPlaying(false);
        } else {
            if (sourceRef.current) {
                sourceRef.current.disconnect();
            }
            const source = audioContext.createBufferSource();
            source.buffer = audioBufferRef.current;
            source.connect(audioContext.destination);
            source.onended = () => setIsPlaying(false);
            source.start();
            sourceRef.current = source;
            setIsPlaying(true);
        }
    };

     const handleDownload = () => {
        if (!request.audioData) return;
        const blob = createWavBlobFromBase64(request.audioData);
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `ad_${request.userInput.businessName.replace(/\s+/g, '_')}.wav`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4" aria-modal="true" role="dialog">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                <div className="p-6 sm:p-8">
                    <div className="flex justify-between items-start">
                         <h2 className="text-2xl font-bold text-brand-primary">Ad Request Details</h2>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">&times;</button>
                    </div>
                    
                    <div className="mt-6 space-y-6">
                        {/* Summary Section */}
                        <div className="p-4 bg-gray-50 rounded-lg border">
                            <h3 className="font-semibold text-lg text-brand-dark mb-2">Request Summary</h3>
                            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                                <p><strong>Business:</strong> {request.summary?.businessName}</p>
                                <p><strong>Requested Slot:</strong> {request.summary?.requestedSlot}</p>
                                <p><strong>Suggested Price:</strong> {request.summary?.suggestedPrice}</p>
                                <p><strong>Status:</strong> <span className={`font-medium ${request.status === 'Pending' ? 'text-yellow-600' : 'text-green-600'}`}>{request.status}</span></p>
                            </div>
                        </div>

                        {/* Advertiser Contact Section */}
                        <div className="p-4 bg-gray-50 rounded-lg border">
                            <h3 className="font-semibold text-lg text-brand-dark mb-2">Advertiser Contact</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-sm">
                                <p><strong>Email:</strong> <a href={`mailto:${request.userInput.email}`} className="text-brand-secondary hover:underline">{request.userInput.email}</a></p>
                                <p><strong>Phone:</strong> <a href={`tel:${request.userInput.phone}`} className="text-brand-secondary hover:underline">{request.userInput.phone}</a></p>
                            </div>
                        </div>

                        {/* Script Section */}
                        <div>
                            <h3 className="font-semibold text-lg text-brand-dark mb-2">Ad Script</h3>
                            <p className="p-4 bg-gray-50 rounded-lg border text-gray-700 italic text-sm">"{request.script}"</p>
                        </div>

                        {/* Audio Player Section */}
                        <div>
                            <h3 className="font-semibold text-lg text-brand-dark mb-2">Generated Audio</h3>
                             <div className="flex items-center space-x-4">
                                <button onClick={handlePlayPause} disabled={!audioBufferRef.current} className="flex items-center justify-center bg-brand-secondary hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition-colors disabled:bg-gray-400">
                                    {isPlaying ? <PauseIcon className="w-5 h-5 mr-2" /> : <PlayIcon className="w-5 h-5 mr-2" />}
                                    {isPlaying ? 'Pause' : 'Listen'}
                                </button>
                                <button onClick={handleDownload} disabled={!request.audioData} className="flex items-center justify-center bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-colors disabled:bg-gray-400">
                                    <DownloadIcon className="w-5 h-5 mr-2" />
                                    Download (.wav)
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-50 px-6 py-4 flex justify-end items-center space-x-4 sticky bottom-0">
                     <button onClick={onClose} className="text-gray-600 hover:text-brand-dark font-medium py-2 px-4 rounded-lg transition-colors">Close</button>
                     {request.status === 'Pending' && (
                        <button onClick={() => onAccept(request.id)} className="flex items-center bg-brand-primary hover:bg-blue-800 text-white font-bold py-2 px-5 rounded-lg shadow-md hover:shadow-lg transition-all">
                            <CheckCircleIcon className="w-5 h-5 mr-2"/>
                            Accept Request
                        </button>
                     )}
                </div>
            </div>
        </div>
    );
};

export default RequestDetailsModal;