
import React from 'react';
import { Step } from '../types';
import SparklesIcon from './icons/SparklesIcon';
import RadioIcon from './icons/RadioIcon';
import ClipboardIcon from './icons/ClipboardIcon';
import PlayIcon from './icons/PlayIcon';

interface StepIndicatorProps {
  currentStep: Step;
}

const steps = [
  { id: Step.GenerateScript, name: 'Create Script', icon: SparklesIcon },
  { id: Step.GenerateAudio, name: 'Voice Ad', icon: PlayIcon },
  { id: Step.RecommendPlacement, name: 'Find Stations', icon: RadioIcon },
  { id: Step.AdminSummary, name: 'Get Summary', icon: ClipboardIcon },
];

const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep }) => {
  return (
    <nav aria-label="Progress">
      <ol role="list" className="flex items-center">
        {steps.map((step, stepIdx) => (
          <li key={step.name} className={`relative ${stepIdx !== steps.length - 1 ? 'pr-8 sm:pr-20' : ''}`}>
            {step.id < currentStep ? (
              <>
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="h-0.5 w-full bg-brand-primary" />
                </div>
                <div className="relative flex h-9 w-9 items-center justify-center bg-brand-primary rounded-full">
                  <step.icon className="h-5 w-5 text-white" />
                </div>
              </>
            ) : step.id === currentStep ? (
              <>
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="h-0.5 w-full bg-gray-200" />
                </div>
                <div className="relative flex h-9 w-9 items-center justify-center bg-white border-2 border-brand-primary rounded-full">
                  <step.icon className="h-5 w-5 text-brand-primary" />
                </div>
                <span className="absolute -bottom-7 w-max text-center text-sm font-semibold text-brand-primary">{step.name}</span>
              </>
            ) : (
              <>
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="h-0.5 w-full bg-gray-200" />
                </div>
                <div className="group relative flex h-9 w-9 items-center justify-center bg-white border-2 border-gray-300 rounded-full">
                  <step.icon className="h-5 w-5 text-gray-400" />
                </div>
              </>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default StepIndicator;
