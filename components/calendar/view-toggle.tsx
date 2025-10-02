"use client"

import { Calendar, List } from 'lucide-react';

import { Button } from '@/components/ui/button';
import React from 'react';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';

interface ViewToggleProps {
  currentView: 'list' | 'calendar';
  onViewChange: (view: 'list' | 'calendar') => void;
  className?: string;
}

export function ViewToggle({ currentView, onViewChange, className }: ViewToggleProps) {
  const t = useTranslations('Calendar');
  
  return (
    <div className={cn("flex items-center gap-1 p-1 bg-muted rounded-lg", className)}>
      <Button
        variant={currentView === 'list' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onViewChange('list')}
        className="flex items-center gap-2"
      >
        <List className="h-4 w-4" />
        <span className="hidden sm:inline">{t('list')}</span>
      </Button>
      <Button
        variant={currentView === 'calendar' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onViewChange('calendar')}
        className="flex items-center gap-2"
      >
        <Calendar className="h-4 w-4" />
        <span className="hidden sm:inline">{t('calendar')}</span>
      </Button>
    </div>
  );
}
