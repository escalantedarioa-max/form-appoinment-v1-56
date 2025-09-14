import React, { useState } from 'react';
import { StepIndicator } from './StepIndicator';
import { PatientForm } from './PatientForm';
import { SpecialtyGrid } from './SpecialtyGrid';
import { DateTimeSelector } from './DateTimeSelector';
import { ConfirmationStep } from './ConfirmationStep';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface PatientData {
  isNewPatient: boolean;
  fullName?: string;
  cedula?: string;
  phone?: string;
  email?: string;
  existingPatientId?: string;
}

export interface ValidationState {
  [key: string]: {
    isValid: boolean;
    message?: string;
  };
}

export interface AppointmentData {
  patient: PatientData;
  specialty: string;
  date: Date | null;
  time: string;
  reason?: string;
}

const AppointmentForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [appointmentData, setAppointmentData] = useState<AppointmentData>({
    patient: { isNewPatient: true },
    specialty: '',
    date: null,
    time: '',
    reason: ''
  });
  const [validationState, setValidationState] = useState<ValidationState>({});

  const updatePatientData = (data: PatientData) => {
    setAppointmentData(prev => ({ ...prev, patient: data }));
  };

  const updateSpecialty = (specialty: string) => {
    setAppointmentData(prev => ({ ...prev, specialty }));
  };

  const updateDateTime = (date: Date | null, time: string) => {
    setAppointmentData(prev => ({ ...prev, date, time }));
  };

  const updateReason = (reason: string) => {
    setAppointmentData(prev => ({ ...prev, reason }));
  };

  const validateCurrentStep = (): boolean => {
    switch (currentStep) {
      case 1:
        return appointmentData.patient.isNewPatient
          ? !!(appointmentData.patient.fullName && appointmentData.patient.cedula && appointmentData.patient.phone)
          : !!appointmentData.patient.existingPatientId;
      case 2:
        return !!appointmentData.specialty;
      case 3:
        return !!(appointmentData.date && appointmentData.time);
      case 4:
        return true;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (validateCurrentStep() && currentStep < 4) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    // Simulate API call
    console.log('Submitting appointment:', appointmentData);
    // Handle appointment submission here
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <PatientForm
            patientData={appointmentData.patient}
            onUpdate={updatePatientData}
            validationState={validationState}
            setValidationState={setValidationState}
          />
        );
      case 2:
        return (
          <SpecialtyGrid
            selectedSpecialty={appointmentData.specialty}
            onSelect={updateSpecialty}
          />
        );
      case 3:
        return (
          <DateTimeSelector
            selectedDate={appointmentData.date}
            selectedTime={appointmentData.time}
            onUpdate={updateDateTime}
          />
        );
      case 4:
        return (
          <ConfirmationStep
            appointmentData={appointmentData}
            onReasonUpdate={updateReason}
            onSubmit={handleSubmit}
            onBack={handlePrev}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="mobile-container">
      <div className="flex flex-col h-screen">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-primary-light p-4 text-primary-foreground relative">
          {currentStep === 4 && (
            <Button
              variant="ghost"
              onClick={handlePrev}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 w-10 h-10 p-0 text-primary-foreground hover:bg-white/10"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
          )}
          <h1 className="text-xl font-bold text-center mb-4">Agendar Cita Médica</h1>
          <StepIndicator currentStep={currentStep} totalSteps={4} />
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="animate-fade-in">
            {renderCurrentStep()}
          </div>
        </div>

        {/* Navigation - Only show for steps 1-3 */}
        {currentStep < 4 && (
          <div className="p-4 border-t border-border/50 bg-background">
            <div className="flex justify-between gap-4">
              <Button
                variant="outline"
                onClick={handlePrev}
                disabled={currentStep === 1}
                className="flex-1 medical-button"
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Anterior
              </Button>
              
              <Button
                onClick={handleNext}
                disabled={!validateCurrentStep()}
                className="flex-1 medical-button bg-primary hover:bg-primary-dark"
              >
                Siguiente
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentForm;