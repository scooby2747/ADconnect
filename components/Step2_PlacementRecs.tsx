
import React, { useState, useEffect } from 'react';
import { PlacementRec, RadioStation } from '../types';
import RadioIcon from './icons/RadioIcon';

interface Step2Props {
    stations: RadioStation[];
    selectedPlacement: PlacementRec | null;
    setSelectedPlacement: (placement: PlacementRec | null) => void;
}

const SLOTS: PlacementRec['slot'][] = ['Morning Drive', 'Midday', 'Afternoon', 'Evening'];

const Step2PlacementRecs: React.FC<Step2Props> = ({ stations, selectedPlacement, setSelectedPlacement }) => {
    const [selectedStationName, setSelectedStationName] = useState<string>(selectedPlacement?.stationName || '');
    const [selectedSlot, setSelectedSlot] = useState<PlacementRec['slot'] | ''>(selectedPlacement?.slot || '');

    const selectedStation = stations.find(s => s.name === selectedStationName);

    useEffect(() => {
        if (selectedStationName && selectedSlot) {
            const station = stations.find(s => s.name === selectedStationName);
            if (station) {
                setSelectedPlacement({
                    stationName: station.name,
                    slot: selectedSlot as PlacementRec['slot'],
                    price: `R${station.priceRange[0]} - R${station.priceRange[1]}`,
                    reason: '' // Not needed
                });
            }
        } else {
            setSelectedPlacement(null);
        }
    }, [selectedStationName, selectedSlot, stations, setSelectedPlacement]);

    return (
        <div>
            <h2 className="text-2xl font-bold text-brand-dark mb-4 text-center">Select Ad Placement</h2>
            <p className="text-center text-gray-600 mb-8">Choose a radio station and a time slot for your ad.</p>
            
            <div className="max-w-lg mx-auto space-y-6">
                <div>
                    <label htmlFor="station-select" className="block text-sm font-medium text-gray-700 mb-1">
                        Radio Station
                    </label>
                    <select
                        id="station-select"
                        value={selectedStationName}
                        onChange={(e) => {
                            setSelectedStationName(e.target.value);
                            // Reset slot when station changes
                            if (selectedSlot) setSelectedSlot('');
                        }}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm rounded-md"
                    >
                        <option value="">-- Select a station --</option>
                        {stations.map(station => (
                            <option key={station.name} value={station.name}>{station.name}</option>
                        ))}
                    </select>
                </div>

                {selectedStation && (
                    <div className="p-4 rounded-lg border-2 border-brand-secondary bg-blue-50 animate-fade-in">
                        <div className="flex items-center mb-3">
                            <RadioIcon className="w-6 h-6 text-brand-secondary mr-3" />
                            <h3 className="text-xl font-bold text-brand-dark">{selectedStation.name}</h3>
                        </div>
                        <div className="space-y-2 text-sm text-gray-700">
                             <p><span className="font-semibold">Audience:</span> {selectedStation.audience}</p>
                             <p><span className="font-semibold">Genre:</span> {selectedStation.genre}</p>
                             <p><span className="font-semibold">Est. Price:</span> R{selectedStation.priceRange[0]} - R{selectedStation.priceRange[1]}</p>
                        </div>
                    </div>
                )}

                <div>
                    <label htmlFor="slot-select" className="block text-sm font-medium text-gray-700 mb-1">
                        Time Slot
                    </label>
                    <select
                        id="slot-select"
                        value={selectedSlot}
                        onChange={(e) => setSelectedSlot(e.target.value as PlacementRec['slot'] | '')}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm rounded-md disabled:bg-gray-100"
                        disabled={!selectedStationName}
                    >
                        <option value="">-- Select a time slot --</option>
                        {SLOTS.map(slot => (
                            <option key={slot} value={slot}>{slot}</option>
                        ))}
                    </select>
                </div>
            </div>
             <style>{`
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in {
                    animation: fade-in 0.3s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default Step2PlacementRecs;
