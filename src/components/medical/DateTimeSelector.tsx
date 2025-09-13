import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, Clock } from 'lucide-react';
import { addDays, format, isToday, isTomorrow } from 'date-fns';
import { es } from 'date-fns/locale';

interface DateTimeSelectorProps {
  selectedDate: Date | null;
  selectedTime: string;
  onUpdate: (date: Date | null, time: string) => void;
}

const generateAvailableDates = () => {
  const dates = [];
  for (let i = 0; i < 14; i++) {
    const date = addDays(new Date(), i);
    // Skip Sundays (0 = Sunday)
    if (date.getDay() !== 0) {
      dates.push(date);
    }
  }
  return dates.slice(0, 10); // Show 10 available dates
};

const generateTimeSlots = () => {
  const slots = [];
  // Morning slots: 8:00 AM - 12:00 PM
  for (let hour = 8; hour < 12; hour++) {
    slots.push(`${hour.toString().padStart(2, '0')}:00`);
    slots.push(`${hour.toString().padStart(2, '0')}:30`);
  }
  // Afternoon slots: 2:00 PM - 6:00 PM
  for (let hour = 14; hour < 18; hour++) {
    slots.push(`${hour.toString().padStart(2, '0')}:00`);
    slots.push(`${hour.toString().padStart(2, '0')}:30`);
  }
  return slots;
};

export const DateTimeSelector: React.FC<DateTimeSelectorProps> = ({
  selectedDate,
  selectedTime,
  onUpdate
}) => {
  const [currentDateIndex, setCurrentDateIndex] = useState(0);
  const availableDates = generateAvailableDates();
  const timeSlots = generateTimeSlots();

  const handleDateSelect = (date: Date) => {
    onUpdate(date, selectedTime);
  };

  const handleTimeSelect = (time: string) => {
    onUpdate(selectedDate, time);
  };

  const formatDateLabel = (date: Date) => {
    if (isToday(date)) return 'Hoy';
    if (isTomorrow(date)) return 'Mañana';
    return format(date, 'EEE d', { locale: es });
  };

  const formatDateFull = (date: Date) => {
    return format(date, 'EEEE, d \'de\' MMMM', { locale: es });
  };

  return (
    <div className="space-y-6 animate-slide-in-right">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-foreground mb-2">Fecha y Hora</h2>
        <p className="text-muted-foreground">Selecciona cuándo quieres tu cita</p>
      </div>

      {/* Date Selection */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-3">
          <Calendar className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground">Fecha disponible</h3>
        </div>

        <div className="grid grid-cols-2 gap-3 max-h-48 overflow-y-auto">
          {availableDates.map((date, index) => {
            const isSelected = selectedDate && 
              format(selectedDate, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd');
            
            return (
              <Button
                key={index}
                variant="outline"
                onClick={() => handleDateSelect(date)}
                className={`medical-card h-16 flex-col gap-1 p-3 ${
                  isSelected ? 'medical-card-selected border-primary bg-accent' : ''
                }`}
              >
                <span className="text-sm font-medium">
                  {formatDateLabel(date)}
                </span>
                <span className="text-xs text-muted-foreground">
                  {format(date, 'd MMM', { locale: es })}
                </span>
              </Button>
            );
          })}
        </div>

        {selectedDate && (
          <div className="medical-card bg-accent/50 border-primary/20 p-3">
            <p className="text-sm text-foreground">
              <span className="font-medium">Fecha seleccionada:</span>{' '}
              {formatDateFull(selectedDate)}
            </p>
          </div>
        )}
      </div>

      {/* Time Selection */}
      {selectedDate && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex items-center gap-2 mb-3">
            <Clock className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-foreground">Horarios disponibles</h3>
          </div>

          <div className="space-y-4">
            {/* Morning */}
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-2">Mañana</h4>
              <div className="grid grid-cols-4 gap-2">
                {timeSlots.slice(0, 8).map((time) => {
                  const isSelected = selectedTime === time;
                  return (
                    <Button
                      key={time}
                      variant="outline"
                      size="sm"
                      onClick={() => handleTimeSelect(time)}
                      className={`medical-button h-10 text-sm ${
                        isSelected ? 'bg-primary text-primary-foreground border-primary' : ''
                      }`}
                    >
                      {time}
                    </Button>
                  );
                })}
              </div>
            </div>

            {/* Afternoon */}
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-2">Tarde</h4>
              <div className="grid grid-cols-4 gap-2">
                {timeSlots.slice(8).map((time) => {
                  const isSelected = selectedTime === time;
                  return (
                    <Button
                      key={time}
                      variant="outline"
                      size="sm"
                      onClick={() => handleTimeSelect(time)}
                      className={`medical-button h-10 text-sm ${
                        isSelected ? 'bg-primary text-primary-foreground border-primary' : ''
                      }`}
                    >
                      {time}
                    </Button>
                  );
                })}
              </div>
            </div>
          </div>

          {selectedTime && (
            <div className="medical-card bg-success/10 border-success/20 p-3 animate-scale-in">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                <p className="text-sm text-foreground">
                  <span className="font-medium">Hora seleccionada:</span> {selectedTime}
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};