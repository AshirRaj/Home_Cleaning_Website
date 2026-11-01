/* eslint-disable react-refresh/only-export-components */
import { Check } from 'lucide-react';

export const STEPS = [
  { id: 1, label: 'Services' },
  { id: 2, label: 'Property' },
  { id: 3, label: 'Address' },
  { id: 4, label: 'Schedule' },
  { id: 5, label: 'Contact' },
  { id: 6, label: 'Review' },
  { id: 7, label: 'Payment' },
];

export const BookingStepper = ({ currentStep, setStep }) => {
  return (
    <div className="w-full py-1.5 mb-2">
      {/* Desktop Stepper */}
      <div className="hidden md:flex items-center justify-between relative px-2">
        {/* Horizontal Line behind icons */}
        <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-slate-200 -translate-y-1/2 z-0" />
        <div
          className="absolute top-1/2 left-4 h-0.5 bg-teal-600 -translate-y-1/2 transition-all duration-300 z-0"
          style={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 96}%` }}
        />

        {STEPS.map((step) => {
          const isCompleted = step.id < currentStep;
          const isCurrent = step.id === currentStep;

          return (
            <div key={step.id} className="relative z-10 flex flex-col items-center group">
              <button
                type="button"
                onClick={() => isCompleted && setStep(step.id)}
                disabled={!isCompleted}
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-200 ${
                  isCompleted
                    ? 'bg-teal-600 text-white cursor-pointer hover:bg-teal-700 shadow-xs'
                    : isCurrent
                    ? 'bg-slate-900 text-white ring-2 ring-teal-500/40 shadow-sm scale-105'
                    : 'bg-white text-slate-400 border border-slate-200 cursor-not-allowed'
                }`}
              >
                {isCompleted ? <Check className="w-4 h-4" /> : step.id}
              </button>
              <span
                className={`text-[11px] font-semibold mt-1 transition-colors text-center ${
                  isCurrent ? 'text-slate-900 font-extrabold' : isCompleted ? 'text-teal-700' : 'text-slate-400'
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Mobile Stepper Header */}
      <div className="md:hidden bg-slate-900 text-white p-3 rounded-xl flex items-center justify-between shadow-xs">
        <div>
          <span className="text-[10px] uppercase font-extrabold tracking-wider text-teal-400">
            Step {currentStep} of {STEPS.length}
          </span>
          <h3 className="text-sm font-bold text-white leading-tight">
            {STEPS.find((s) => s.id === currentStep)?.label}
          </h3>
        </div>
        <div className="flex items-center gap-1">
          {STEPS.map((step) => (
            <div
              key={step.id}
              className={`h-1.5 rounded-full transition-all ${
                step.id === currentStep
                  ? 'w-5 bg-teal-400'
                  : step.id < currentStep
                  ? 'w-1.5 bg-teal-600'
                  : 'w-1.5 bg-slate-700'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
