
import React, { useEffect } from 'react';
import { AdminSummary } from '../types';
import LoadingSpinner from './LoadingSpinner';

interface Step3Props {
    onGenerate: () => void;
    summary: AdminSummary | null;
    isLoading: boolean;
}

const Step3AdminSummary: React.FC<Step3Props> = ({ onGenerate, summary, isLoading }) => {
    useEffect(() => {
        if (!summary) {
            onGenerate();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (isLoading) {
        return (
            <div className="text-center py-10">
                <LoadingSpinner />
                <p className="mt-4 text-lg text-gray-600">Generating admin summary...</p>
            </div>
        );
    }
    
    if (!summary) {
        return <div className="text-center text-gray-500">No summary available.</div>;
    }

    return (
        <div>
            <h2 className="text-2xl font-bold text-brand-dark mb-4 text-center">Admin Summary</h2>
            <p className="text-center text-gray-600 mb-8">This is the summary that will be sent to the radio station for review and scheduling.</p>

            <div className="max-w-md mx-auto bg-gray-50 p-6 rounded-lg border border-gray-200 shadow-sm">
                <h3 className="text-lg font-semibold text-brand-primary border-b pb-2 mb-4">🗂️ For Station Admin Review</h3>
                <div className="space-y-3">
                    <SummaryItem label="Business" value={summary.businessName} />
                    <SummaryItem label="Script Summary" value={summary.scriptSummary} />
                    <SummaryItem label="Requested Slot" value={summary.requestedSlot} />
                    <SummaryItem label="Suggested Price" value={summary.suggestedPrice} />
                    <SummaryItem label="Status" value="Pending Approval" />
                </div>
            </div>
        </div>
    );
};

interface SummaryItemProps {
    label: string;
    value: string;
}

const SummaryItem: React.FC<SummaryItemProps> = ({ label, value }) => (
    <div className="flex flex-col sm:flex-row">
        <p className="font-semibold text-gray-800 w-full sm:w-1/3">{label}:</p>
        <p className="text-gray-600 w-full sm:w-2/3">{value}</p>
    </div>
);


export default Step3AdminSummary;
