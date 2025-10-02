"use client"

import {
  Calendar,
  Clock,
  FileText,
  Mail,
  MapPin,
  Phone,
  Stethoscope,
  User,
  X
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { CalendarEvent } from '@/lib/utils/calendar';
import React from 'react';
import { Separator } from '@/components/ui/separator';
import { es } from 'date-fns/locale';
import { format } from 'date-fns';
import { useTranslations } from 'next-intl';

interface EventDetailsDialogProps {
  event: CalendarEvent | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (event: CalendarEvent) => void;
  onCancel?: (event: CalendarEvent) => void;
}

export function EventDetailsDialog({
  event,
  isOpen,
  onClose,
  onEdit,
  onCancel
}: EventDetailsDialogProps) {
  const t = useTranslations('Calendar');
  if (!event) return null;

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-900/40';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-300 dark:border-yellow-900/40';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-900/40';
      default:
        return 'bg-muted text-foreground/80 border-border';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'appointment':
        return <Stethoscope className="h-5 w-5 text-primary" />;
      case 'task':
        return <FileText className="h-5 w-5 text-green-600 dark:text-green-300" />;
      case 'event':
        return <Calendar className="h-5 w-5 text-purple-600" />;
      default:
        return <FileText className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getStatusText = (status?: string) => {
    switch (status) {
      case 'confirmed':
        return t('confirmed');
      case 'pending':
        return t('pending');
      case 'cancelled':
        return t('cancelled');
      default:
        return status || '';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              {getTypeIcon(event.type)}
              <span>{event.title}</span>
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Estado */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">{t('status')}:</span>
            <Badge className={getStatusColor(event.status)}>
              {getStatusText(event.status)}
            </Badge>
          </div>
          
          <Separator />
          
          {/* Información básica */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">
                  {format(new Date(event.time), 'EEEE, d \'de\' MMMM \'de\' yyyy', { locale: es })}
                </p>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(event.time), 'HH:mm')}
                  {event.duration && ` (${event.duration} ${t('minutes')})`}
                </p>
              </div>
            </div>
            
            {event.location && (
              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">{t('location')}</p>
                  <p className="text-sm text-muted-foreground">{event.location}</p>
                </div>
              </div>
            )}
            
            {event.patientName && (
              <div className="flex items-center gap-3">
                <User className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">{t('patient')}</p>
                  <p className="text-sm text-muted-foreground">{event.patientName}</p>
                </div>
              </div>
            )}
            
            {event.patientPhone && (
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">{t('phone')}</p>
                  <p className="text-sm text-muted-foreground">{event.patientPhone}</p>
                </div>
              </div>
            )}
            
            {event.patientEmail && (
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">{t('email')}</p>
                  <p className="text-sm text-muted-foreground">{event.patientEmail}</p>
                </div>
              </div>
            )}
          </div>
          
          {/* Especialidad y Servicio */}
          {(event.specialty || event.service) && (
            <>
              <Separator />
              <div className="space-y-2">
                {event.specialty && (
                  <div className="flex items-center gap-2">
                    <Stethoscope className="h-4 w-4 text-muted-foreground" />
                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                      {event.specialty}
                    </Badge>
                  </div>
                )}
                
                {event.service && (
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                      {event.service}
                    </Badge>
                  </div>
                )}
              </div>
            </>
          )}
          
          {/* Notas */}
          {event.notes && (
            <>
              <Separator />
              <div>
                <p className="text-sm font-medium mb-2">{t('notes')}</p>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">{event.notes}</p>
                </div>
              </div>
            </>
          )}
          
          {/* Acciones */}
          <Separator />
          <div className="flex gap-2">
            {onEdit && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(event)}
                className="flex-1"
              >
                {t('editEvent')}
              </Button>
            )}
            {onCancel && event.status !== 'cancelled' && (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => onCancel(event)}
                className="flex-1"
              >
                {t('cancelEvent')}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
