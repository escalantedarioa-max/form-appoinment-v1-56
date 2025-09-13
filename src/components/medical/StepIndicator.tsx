import React from 'react';
import { Check } from 'lucide-react';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({
  currentStep,
  totalSteps
}) => {
  const getStepState = (step: number) => {
    if (step < currentStep) return 'completed';
    if (step === currentStep) return 'current';
    return 'pending';
  };

  const getStepClass = (state: string) => {
    switch (state) {
      case 'completed':
        return 'bg-success text-success-foreground';
      case 'current':
        return 'bg-primary-foreground text-primary animate-pulse-glow';
      case 'pending':
        return 'bg-primary-foreground/30 text-primary-foreground/60';
      default:
        return '';
    }
  };

  return (
    <div className="w-full">
      {/* Progress bar */}
      <div className="mb-4">
        <div className="flex justify-between text-xs text-primary-foreground/80 mb-2">
          <span>Progreso</span>
          <span>{currentStep}/{totalSteps}</span>
        </div>
        <div className="w-full bg-primary-foreground/20 rounded-full h-2">
          <div
            className="bg-primary-foreground h-2 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      {/* Step indicators */}
      <div className="flex justify-between items-center">
        {Array.from({ length: totalSteps }, (_, index) => {
          const step = index + 1;
          const state = getStepState(step);
          
          return (
            <div key={step} className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${getStepClass(state)}`}
              >
                {state === 'completed' ? (
                  <Check className="w-4 h-4" />
                ) : (
                  step
                )}
              </div>
              <div className="text-xs text-primary-foreground/70 mt-1 text-center max-w-16">
                {getStepLabel(step)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const getStepLabel = (step: number): string => {
  switch (step) {
    case 1: return 'Paciente';
    case 2: return 'Especialidad';
    case 3: return 'Fecha';
    case 4: return 'Confirmar';
    default: return '';
  }
};