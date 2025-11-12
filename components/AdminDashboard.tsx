import React, { useState, useMemo } from 'react';
import { AdRequest } from '../types';
import { CONTACTED_STATIONS } from '../constants';
import RequestDetailsModal from './RequestDetailsModal';
import EyeIcon from './icons/EyeIcon';

interface AdminDashboardProps {
    adRequests: AdRequest[];
    onUpdateRequestStatus: (id: string, status: AdRequest['status']) => void;
    onStartOver: () => void;
    onReturnHome: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ adRequests, onUpdateRequestStatus, onStartOver, onReturnHome }) => {
    const [selectedStation, setSelectedStation] = useState('');
    const [viewingRequest, setViewingRequest] = useState<AdRequest | null>(null);

    const filteredRequests = useMemo(() => {
        if (!selectedStation) return [];
        return adRequests.filter(req => req.placement?.stationName === selectedStation);
    }, [selectedStation, adRequests]);

    const cameFromAdvertiserFlow = adRequests.length > 0;

    const handleAcceptRequest = (id: string) => {
        onUpdateRequestStatus(id, 'Accepted');
        setViewingRequest(prev => prev ? { ...prev, status: 'Accepted' } : null);
    };

    return (
        <div>
            <header className="text-center mb-8">
                <h1 className="text-4xl sm:text-5xl font-bold text-brand-primary">Station Admin Dashboard</h1>
                <p className="text-lg text-gray-600 mt-2">Review and manage incoming ad requests.</p>
            </header>

            <main className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
                <div className="max-w-md mx-auto">
                    <label htmlFor="station-select" className="block text-sm font-medium text-gray-700 mb-2">
                        Select Your Station to View Requests
                    </label>
                    <select
                        id="station-select"
                        value={selectedStation}
                        onChange={(e) => setSelectedStation(e.target.value)}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm rounded-md"
                    >
                        <option value="">-- View as... --</option>
                        {CONTACTED_STATIONS.map(station => (
                            <option key={station.name} value={station.name}>{station.name}</option>
                        ))}
                    </select>
                </div>

                <div className="mt-8 overflow-x-auto">
                    {selectedStation ? (
                        filteredRequests.length > 0 ? (
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Business Name</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Requested Slot</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredRequests.map((request) => (
                                        <tr key={request.id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{request.userInput.businessName}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{request.placement?.slot}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${request.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                                                    {request.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <button onClick={() => setViewingRequest(request)} className="text-brand-secondary hover:text-brand-primary flex items-center">
                                                    <EyeIcon className="w-5 h-5 mr-1"/> View
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div className="text-center text-gray-500 py-10">
                                <p>No new requests for {selectedStation}.</p>
                            </div>
                        )
                    ) : (
                        <div className="text-center text-gray-500 py-10">
                            <p>Please select a station to view requests.</p>
                        </div>
                    )}
                </div>
            </main>

            <footer className="mt-8 flex justify-center">
                {cameFromAdvertiserFlow ? (
                    <button onClick={onStartOver} className="bg-brand-accent hover:bg-amber-500 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all">
                        Create New Ad
                    </button>
                ) : (
                    <button onClick={onReturnHome} className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all">
                        Return to Home Page
                    </button>
                )}
            </footer>

            {viewingRequest && (
                <RequestDetailsModal
                    request={viewingRequest}
                    onClose={() => setViewingRequest(null)}
                    onAccept={handleAcceptRequest}
                />
            )}
        </div>
    );
};

export default AdminDashboard;