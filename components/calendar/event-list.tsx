"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, MapPin, User } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import type { CalendarEvent } from '@/lib/utils/calendar';
import React from 'react';
import { cn } from '@/lib/utils';
import { es } from 'date-fns/locale';
import { format } from 'date-fns';
import { useTranslations } from 'next-intl';

interface EventListProps {
  date: Date;
  events: CalendarEvent[];
  onEventClick?: (event: CalendarEvent) => void;
  className?: string;
}

export function EventList({ date, events, onEventClick, className }: EventListProps) {
  const t = useTranslations('Calendar');
  const sortedEvents = events.sort((a, b) => {
    const timeA = new Date(a.time).getTime();
    const timeB = new Date(b.time).getTime();
    return timeA - timeB;
  });

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      default:
        return 'bg-muted text-foreground/80';
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

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'appointment':
        return '🏥';
      case 'task':
        return '✅';
      case 'event':
        return '📅';
      default:
        return '📋';
    }
  };

  if (events.length === 0) {
    return (
      <Card className={cn("w-full", className)}>
        <CardHeader>
          <CardTitle className="text-lg">
            {format(date, 'EEEE, d \'de\' MMMM', { locale: es })}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <div className="text-4xl mb-2">📅</div>
            <p>{t('noEvents')}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <CardTitle className="text-lg">
          {format(date, 'EEEE, d \'de\' MMMM', { locale: es })}
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          {t('eventsCount', { count: events.length })}
        </p>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {sortedEvents.map((event) => (
          <div
            key={event.id}
            className="border rounded-lg p-4 hover:bg-muted/50 transition-colors cursor-pointer"
            onClick={() => onEventClick?.(event)}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-lg">{getTypeIcon(event.type)}</span>
                <h3 className="font-medium">{event.title}</h3>
              </div>
              {event.status && (
                <Badge className={getStatusColor(event.status)}>
                  {getStatusText(event.status)}
                </Badge>
              )}
            </div>
            
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{format(new Date(event.time), 'HH:mm')}</span>
              </div>
              
              {event.patientName && (
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>{event.patientName}</span>
                </div>
              )}
              
              {event.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>{event.location}</span>
                </div>
              )}
              
              {event.specialty && (
                <div className="flex items-center gap-2">
                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                    {event.specialty}
                  </span>
                </div>
              )}
              
              {event.service && (
                <div className="flex items-center gap-2">
                  <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                    {event.service}
                  </span>
                </div>
              )}
              
              {event.duration && (
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{event.duration} {t('minutes')}</span>
                </div>
              )}
            </div>
            
            {event.notes && (
              <div className="mt-2 p-2 bg-muted/50 rounded text-sm">
                <p className="text-muted-foreground">{event.notes}</p>
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
