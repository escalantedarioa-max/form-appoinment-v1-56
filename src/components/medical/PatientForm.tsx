import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UserPlus, UserCheck, Phone, Mail, IdCard, User } from 'lucide-react';
import { PatientData, ValidationState } from './AppointmentForm';

interface PatientFormProps {
  patientData: PatientData;
  onUpdate: (data: PatientData) => void;
  validationState: ValidationState;
  setValidationState: (state: ValidationState) => void;
}

export const PatientForm: React.FC<PatientFormProps> = ({
  patientData,
  onUpdate,
  validationState,
  setValidationState
}) => {
  const [formData, setFormData] = useState<PatientData>(patientData);

  useEffect(() => {
    onUpdate(formData);
  }, [formData, onUpdate]);

  const validateField = (field: string, value: string) => {
    let isValid = true;
    let message = '';

    switch (field) {
      case 'cedula':
        const cedulaRegex = /^[VE]-?\d{7,8}$/i;
        isValid = cedulaRegex.test(value.replace(/\s/g, ''));
        message = isValid ? '' : 'Formato: V-12345678 o E-12345678';
        break;
      case 'phone':
        const phoneRegex = /^(\+58\s?)?(0?4\d{2}|\d{3})-?\s?\d{3}-?\s?\d{4}$/;
        isValid = phoneRegex.test(value.replace(/\s/g, ''));
        message = isValid ? '' : 'Formato: +58 412 1234567 o 0412-1234567';
        break;
      case 'email':
        if (value) {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          isValid = emailRegex.test(value);
          message = isValid ? '' : 'Email no válido';
        }
        break;
      case 'fullName':
        isValid = value.trim().length >= 2;
        message = isValid ? '' : 'Nombre muy corto';
        break;
      case 'existingPatientId':
        isValid = value.trim().length > 0;
        message = isValid ? '' : 'Campo requerido';
        break;
    }

    const newValidationState: ValidationState = {
      ...validationState,
      [field]: { isValid, message }
    };
    setValidationState(newValidationState);

    return isValid;
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Real-time validation
    setTimeout(() => validateField(field, value), 300);
  };

  const formatCedula = (value: string) => {
    const cleaned = value.replace(/[^VEve\d]/g, '').toUpperCase();
    if (cleaned.length > 1) {
      return cleaned.charAt(0) + '-' + cleaned.slice(1, 9);
    }
    return cleaned;
  };

  const formatPhone = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.startsWith('58')) {
      const formatted = '+58 ' + cleaned.slice(2, 5) + ' ' + cleaned.slice(5, 8) + ' ' + cleaned.slice(8, 12);
      return formatted.trim();
    }
    if (cleaned.length >= 10) {
      const formatted = cleaned.slice(0, 4) + '-' + cleaned.slice(4, 7) + '-' + cleaned.slice(7, 11);
      return formatted;
    }
    return value;
  };

  const getInputClass = (field: string) => {
    const validation = validationState[field];
    if (!validation) return 'medical-input';
    return `medical-input ${validation.isValid ? 'success' : 'error'}`;
  };

  return (
    <div className="space-y-6 animate-slide-in-right">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-foreground mb-2">Identificación del Paciente</h2>
        <p className="text-muted-foreground">Selecciona el tipo de paciente para continuar</p>
      </div>

      {/* Patient Type Selection */}
      <div className="grid grid-cols-2 gap-3">
        <Button
          variant={formData.isNewPatient ? "default" : "outline"}
          onClick={() => setFormData({ isNewPatient: true })}
          className={`medical-card h-20 flex-col gap-2 ${formData.isNewPatient ? 'medical-card-selected' : ''}`}
        >
          <UserPlus className="w-6 h-6" />
          <span className="text-sm font-medium">Paciente Nuevo</span>
        </Button>
        
        <Button
          variant={!formData.isNewPatient ? "default" : "outline"}
          onClick={() => setFormData({ isNewPatient: false })}
          className={`medical-card h-20 flex-col gap-2 ${!formData.isNewPatient ? 'medical-card-selected' : ''}`}
        >
          <UserCheck className="w-6 h-6" />
          <span className="text-sm font-medium">Paciente Existente</span>
        </Button>
      </div>

      {/* Form Fields */}
      <div className="space-y-4">
        {formData.isNewPatient ? (
          <div className="space-y-4">
            {/* Full Name */}
            <div className="space-y-2">
              <Label htmlFor="fullName" className="flex items-center gap-2 text-sm font-medium">
                <User className="w-4 h-4" />
                Nombre Completo *
              </Label>
              <Input
                id="fullName"
                type="text"
                placeholder="Juan Pérez González"
                value={formData.fullName || ''}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                className={getInputClass('fullName')}
              />
              {validationState.fullName?.message && (
                <p className="text-xs text-error">{validationState.fullName.message}</p>
              )}
            </div>

            {/* Cédula */}
            <div className="space-y-2">
              <Label htmlFor="cedula" className="flex items-center gap-2 text-sm font-medium">
                <IdCard className="w-4 h-4" />
                Cédula de Identidad *
              </Label>
              <Input
                id="cedula"
                type="text"
                placeholder="V-12345678"
                value={formData.cedula || ''}
                onChange={(e) => handleInputChange('cedula', formatCedula(e.target.value))}
                className={getInputClass('cedula')}
              />
              {validationState.cedula?.message && (
                <p className="text-xs text-error">{validationState.cedula.message}</p>
              )}
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center gap-2 text-sm font-medium">
                <Phone className="w-4 h-4" />
                Teléfono *
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+58 412 123 4567"
                value={formData.phone || ''}
                onChange={(e) => handleInputChange('phone', formatPhone(e.target.value))}
                className={getInputClass('phone')}
              />
              {validationState.phone?.message && (
                <p className="text-xs text-error">{validationState.phone.message}</p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2 text-sm font-medium">
                <Mail className="w-4 h-4" />
                Email (opcional)
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="juan@ejemplo.com"
                value={formData.email || ''}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={getInputClass('email')}
              />
              {validationState.email?.message && (
                <p className="text-xs text-error">{validationState.email.message}</p>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <Label htmlFor="existingPatientId" className="flex items-center gap-2 text-sm font-medium">
              <UserCheck className="w-4 h-4" />
              Buscar Paciente
            </Label>
            <Input
              id="existingPatientId"
              type="text"
              placeholder="Cédula, teléfono o email"
              value={formData.existingPatientId || ''}
              onChange={(e) => handleInputChange('existingPatientId', e.target.value)}
              className={getInputClass('existingPatientId')}
            />
            {validationState.existingPatientId?.message && (
              <p className="text-xs text-error">{validationState.existingPatientId.message}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Ingresa tu cédula, teléfono o email para buscar tu información
            </p>
          </div>
        )}
      </div>
    </div>
  );
};