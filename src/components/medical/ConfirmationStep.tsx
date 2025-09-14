import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  CheckCircle, 
  User, 
  Stethoscope, 
  Calendar, 
  Clock, 
  MessageSquare,
  Phone,
  IdCard,
  Mail
} from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { AppointmentData } from './AppointmentForm';

interface ConfirmationStepProps {
  appointmentData: AppointmentData;
  onReasonUpdate: (reason: string) => void;
  onSubmit: () => void;
  onBack?: () => void;
}

const specialties = {
  'medicina-general': 'Medicina General',
  'cardiologia': 'Cardiología',
  'oftalmologia': 'Oftalmología',
  'neurologia': 'Neurología',
  'traumatologia': 'Traumatología',
  'pediatria': 'Pediatría',
  'ginecologia': 'Ginecología',
  'dermatologia': 'Dermatología',
  'odontologia': 'Odontología',
  'laboratorio': 'Laboratorio',
  'psiquiatria': 'Psiquiatría',
  'medicina-interna': 'Medicina Interna',
};

export const ConfirmationStep: React.FC<ConfirmationStepProps> = ({
  appointmentData,
  onReasonUpdate,
  onSubmit,
  onBack
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await onSubmit();
      setIsSubmitted(true);
    } catch (error) {
      console.error('Error submitting appointment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="space-y-6 text-center animate-scale-in">
        <div className="medical-card bg-success/10 border-success/20 p-8">
          <CheckCircle className="w-16 h-16 text-success mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-success mb-2">¡Cita Confirmada!</h2>
          <p className="text-foreground mb-4">
            Tu cita ha sido agendada exitosamente.
          </p>
          <div className="bg-background rounded-lg p-4 border border-success/20">
            <p className="text-sm text-muted-foreground mb-2">ID de Cita:</p>
            <p className="font-mono text-lg font-bold text-success">
              #{Math.random().toString(36).substr(2, 9).toUpperCase()}
            </p>
          </div>
        </div>
        
        <div className="space-y-3 text-sm text-muted-foreground">
          <p>• Recibirás una confirmación por WhatsApp</p>
          <p>• Llega 15 minutos antes de tu cita</p>
          <p>• Trae tu cédula y carnet del seguro</p>
        </div>

        <Button 
          onClick={() => window.location.reload()} 
          className="w-full medical-button bg-primary hover:bg-primary-dark"
        >
          Agendar Nueva Cita
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-slide-in-right">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-foreground mb-2">Confirmar Cita</h2>
        <p className="text-muted-foreground">Revisa los datos antes de confirmar</p>
      </div>

      {/* Appointment Summary */}
      <div className="medical-card space-y-4">
        <h3 className="font-semibold text-foreground flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-primary" />
          Resumen de la Cita
        </h3>

        <div className="space-y-3">
          {/* Patient Info */}
          <div className="flex items-start gap-3 p-3 bg-secondary/50 rounded-lg">
            <User className="w-5 h-5 text-primary mt-0.5" />
            <div className="flex-1">
              <p className="font-medium text-foreground">
                {appointmentData.patient.isNewPatient ? 'Paciente Nuevo' : 'Paciente Existente'}
              </p>
              {appointmentData.patient.isNewPatient ? (
                <div className="text-sm text-muted-foreground space-y-1">
                  <div className="flex items-center gap-2">
                    <User className="w-3 h-3" />
                    <span>{appointmentData.patient.fullName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <IdCard className="w-3 h-3" />
                    <span>{appointmentData.patient.cedula}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3 h-3" />
                    <span>{appointmentData.patient.phone}</span>
                  </div>
                  {appointmentData.patient.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="w-3 h-3" />
                      <span>{appointmentData.patient.email}</span>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  ID: {appointmentData.patient.existingPatientId}
                </p>
              )}
            </div>
          </div>

          {/* Specialty */}
          <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg">
            <Stethoscope className="w-5 h-5 text-primary" />
            <div>
              <p className="font-medium text-foreground">Especialidad</p>
              <p className="text-sm text-muted-foreground">
                {specialties[appointmentData.specialty as keyof typeof specialties]}
              </p>
            </div>
          </div>

          {/* Date & Time */}
          <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg">
            <Calendar className="w-5 h-5 text-primary" />
            <div className="flex-1">
              <p className="font-medium text-foreground">Fecha y Hora</p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>
                  {appointmentData.date && format(appointmentData.date, 'EEEE, d \'de\' MMMM \'de\' yyyy', { locale: es })}
                </span>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{appointmentData.time}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reason for Visit */}
      <div className="space-y-3">
        <Label htmlFor="reason" className="flex items-center gap-2 text-sm font-medium">
          <MessageSquare className="w-4 h-4" />
          Motivo de la Consulta (opcional)
        </Label>
        <Textarea
          id="reason"
          placeholder="Describe brevemente el motivo de tu consulta..."
          value={appointmentData.reason || ''}
          onChange={(e) => onReasonUpdate(e.target.value)}
          className="medical-input min-h-[80px] resize-none"
          maxLength={200}
        />
        <p className="text-xs text-muted-foreground">
          {(appointmentData.reason || '').length}/200 caracteres
        </p>
      </div>

      {/* Important Notes */}
      <div className="medical-card bg-accent/30 border-primary/20">
        <h4 className="font-medium text-foreground mb-2">Información Importante</h4>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• Llega 15 minutos antes de tu cita</li>
          <li>• Trae tu cédula de identidad</li>
          <li>• Si tienes seguro médico, trae tu carnet</li>
          <li>• Puedes reprogramar hasta 2 horas antes</li>
        </ul>
      </div>

      {/* Submit Button */}
      <Button
        onClick={handleSubmit}
        disabled={isSubmitting}
        className="w-full medical-button bg-success hover:bg-success-light h-12 text-base font-semibold"
      >
        {isSubmitting ? (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-success-foreground/20 border-t-success-foreground rounded-full animate-spin"></div>
            Confirmando...
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            Confirmar Cita Médica
          </div>
        )}
      </Button>

      {/* Back Button */}
      {onBack && (
        <Button
          variant="outline"
          onClick={onBack}
          className="w-full h-12 text-base font-medium border-muted-foreground/20 text-muted-foreground hover:bg-muted hover:text-foreground mt-3"
        >
          Volver
        </Button>
      )}
    </div>
  );
};