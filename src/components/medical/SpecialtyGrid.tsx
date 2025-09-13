import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Stethoscope, 
  Heart, 
  Eye, 
  Brain, 
  Bone, 
  Baby, 
  Users, 
  Zap,
  Microscope,
  Activity,
  PersonStanding,
  Smile
} from 'lucide-react';

interface SpecialtyGridProps {
  selectedSpecialty: string;
  onSelect: (specialty: string) => void;
}

const specialties = [
  { id: 'medicina-general', name: 'Medicina General', icon: Stethoscope, color: 'text-blue-600' },
  { id: 'cardiologia', name: 'Cardiología', icon: Heart, color: 'text-red-500' },
  { id: 'oftalmologia', name: 'Oftalmología', icon: Eye, color: 'text-green-600' },
  { id: 'neurologia', name: 'Neurología', icon: Brain, color: 'text-purple-600' },
  { id: 'traumatologia', name: 'Traumatología', icon: Bone, color: 'text-orange-600' },
  { id: 'pediatria', name: 'Pediatría', icon: Baby, color: 'text-pink-500' },
  { id: 'ginecologia', name: 'Ginecología', icon: Users, color: 'text-rose-500' },
  { id: 'dermatologia', name: 'Dermatología', icon: PersonStanding, color: 'text-yellow-600' },
  { id: 'odontologia', name: 'Odontología', icon: Smile, color: 'text-blue-500' },
  { id: 'laboratorio', name: 'Laboratorio', icon: Microscope, color: 'text-teal-600' },
  { id: 'psiquiatria', name: 'Psiquiatría', icon: Zap, color: 'text-indigo-600' },
  { id: 'medicina-interna', name: 'Medicina Interna', icon: Activity, color: 'text-cyan-600' },
];

export const SpecialtyGrid: React.FC<SpecialtyGridProps> = ({
  selectedSpecialty,
  onSelect
}) => {
  return (
    <div className="space-y-6 animate-slide-in-right">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-foreground mb-2">Selecciona la Especialidad</h2>
        <p className="text-muted-foreground">Elige la especialidad médica que necesitas</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {specialties.map((specialty) => {
          const Icon = specialty.icon;
          const isSelected = selectedSpecialty === specialty.id;
          
          return (
            <Button
              key={specialty.id}
              variant="outline"
              onClick={() => onSelect(specialty.id)}
              className={`medical-card h-24 flex-col gap-3 p-4 hover:scale-105 transition-all duration-200 ${
                isSelected ? 'medical-card-selected border-primary bg-accent' : ''
              }`}
            >
              <Icon className={`w-8 h-8 ${isSelected ? 'text-primary' : specialty.color}`} />
              <span className="text-sm font-medium text-center leading-tight">
                {specialty.name}
              </span>
            </Button>
          );
        })}
      </div>

      {selectedSpecialty && (
        <div className="medical-card bg-accent/50 border-primary/20 p-4 animate-scale-in">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
            <p className="text-sm text-foreground">
              <span className="font-medium">Especialidad seleccionada:</span>{' '}
              {specialties.find(s => s.id === selectedSpecialty)?.name}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};