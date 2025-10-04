"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChevronRight,
  Clock,
  DollarSign,
  Edit,
  MoreHorizontal,
  Plus,
  Stethoscope,
  Trash2
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import React, { useMemo } from 'react';
import type { Service, SpecialtyWithServices } from '@/types/api';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useTranslations } from 'next-intl';

// Props para los componentes presentacionales
interface SpecialtyCardProps {
  specialty: SpecialtyWithServices;
  onEdit: (specialty: SpecialtyWithServices) => void;
  onDelete: (id: string) => void;
  onViewServices: (specialty: SpecialtyWithServices) => void;
  onAddService: (specialtyId: string) => void;
  isPending?: boolean;
}

interface ServiceCardProps {
  service: Service;
  onEdit: (service: Service) => void;
  onDelete: (serviceId: string) => void;
  isPending?: boolean;
}

interface SpecialtyListProps {
  specialties: SpecialtyWithServices[];
  loading?: boolean;
  onEdit: (specialty: SpecialtyWithServices) => void;
  onDelete: (id: string) => void;
  onViewServices: (specialty: SpecialtyWithServices) => void;
  onAddService: (specialtyId: string) => void;
  isPending?: boolean;
}

interface ServiceListProps {
  services: Service[];
  specialtyName: string;
  loading?: boolean;
  onEdit: (service: Service) => void;
  onDelete: (serviceId: string) => void;
  onAddService: () => void;
  isPending?: boolean;
}

// Componente presentacional para el skeleton de Specialty
export function SpecialtySkeleton() {
  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-48" />
          </div>
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-16" />
          </div>
          <Skeleton className="h-8 w-20" />
        </div>
      </CardContent>
    </Card>
  );
}

// Componente presentacional para el skeleton de Service
export function ServiceSkeleton() {
  return (
    <Card className="w-full">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="space-y-2 flex-1">
            <Skeleton className="h-5 w-3/4" />
            <div className="flex items-center gap-4">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-12" />
            </div>
          </div>
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
      </CardContent>
    </Card>
  );
}

// Componente presentacional para una tarjeta de Specialty
export function SpecialtyCard({ 
  specialty, 
  onEdit, 
  onDelete, 
  onViewServices, 
  onAddService,
  isPending = false 
}: SpecialtyCardProps) {
  const t = useTranslations('SpecialtiesUI');
  const serviceCount = useMemo(() => specialty.services.length, [specialty.services.length]);
  const totalCost = useMemo(() => 
    specialty.services.reduce((sum, service) => sum + service.cost, 0), 
    [specialty.services]
  );
  const averageCost = useMemo(() => 
    serviceCount > 0 ? totalCost / serviceCount : 0, 
    [serviceCount, totalCost]
  );

  return (
    <Card className="w-full hover:shadow-md transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1 flex-1">
            <CardTitle className="text-lg font-semibold text-foreground">
              {specialty.name}
            </CardTitle>
            {specialty.description && (
              <p className="text-sm text-muted-foreground line-clamp-2">
                {specialty.description}
              </p>
            )}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 w-8 p-0"
                disabled={isPending}
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onViewServices(specialty)}>
                <Stethoscope className="mr-2 h-4 w-4" />
                {t('viewServices')}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onAddService(specialty.id)}>
                <Plus className="mr-2 h-4 w-4" />
                {t('addService')}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit(specialty)}>
                <Edit className="mr-2 h-4 w-4" />
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onDelete(specialty.id)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Eliminar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Stethoscope className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">{serviceCount}</span>
              <span className="text-xs text-muted-foreground">
                {serviceCount === 1 ? t('serviceSingular') : t('servicePlural')}
              </span>
            </div>
            {averageCost > 0 && (
              <div className="flex items-center gap-1">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">
                  ${averageCost.toFixed(0)}
                </span>
                <span className="text-xs text-muted-foreground">{t('averageLabel')}</span>
              </div>
            )}
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onViewServices(specialty)}
            disabled={isPending}
          >
            <ChevronRight className="h-4 w-4 mr-1" />
            {t('view')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Componente presentacional para una tarjeta de Service
export function ServiceCard({ 
  service, 
  onEdit, 
  onDelete,
  isPending = false 
}: ServiceCardProps) {
  const t = useTranslations('SpecialtiesUI');
  const formatDuration = useMemo(() => {
    const hours = Math.floor(service.duration / 60);
    const minutes = service.duration % 60;
    
    if (hours > 0 && minutes > 0) {
      return `${hours}h ${minutes}m`;
    } else if (hours > 0) {
      return `${hours}h`;
    } else {
      return `${minutes}m`;
    }
  }, [service.duration]);

  return (
    <Card className="w-full hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="space-y-2 flex-1">
            <h4 className="font-medium text-foreground line-clamp-2">
              {service.description}
            </h4>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">${service.cost}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{formatDuration}</span>
              </div>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 w-8 p-0"
                disabled={isPending}
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(service)}>
                <Edit className="mr-2 h-4 w-4" />
              Editar
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onDelete(service.id)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
              Eliminar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  );
}

// Componente presentacional para la lista de Specialties
export function SpecialtyList({ 
  specialties, 
  loading = false, 
  onEdit, 
  onDelete, 
  onViewServices, 
  onAddService,
  isPending = false 
}: SpecialtyListProps) {
  const t = useTranslations('SpecialtiesUI');
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <SpecialtySkeleton key={index} />
        ))}
      </div>
    );
  }

  if (specialties.length === 0) {
    return (
      <div className="text-center py-12">
        <Stethoscope className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium text-foreground mb-2">
          {t('empty.noSpecialtiesTitle')}
        </h3>
        <p className="text-muted-foreground mb-4">
          {t('empty.noSpecialtiesDescription')}
        </p>
        <Button onClick={() => onAddService('')} disabled={isPending}>
          <Plus className="h-4 w-4 mr-2" />
          {t('newSpecialty')}
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {specialties.map((specialty) => (
        <SpecialtyCard
          key={specialty.id}
          specialty={specialty}
          onEdit={onEdit}
          onDelete={onDelete}
          onViewServices={onViewServices}
          onAddService={onAddService}
          isPending={isPending}
        />
      ))}
    </div>
  );
}

// Componente presentacional para la lista de Services
export function ServiceList({ 
  services, 
  specialtyName, 
  loading = false, 
  onEdit, 
  onDelete, 
  onAddService,
  isPending = false 
}: ServiceListProps) {
  const t = useTranslations('SpecialtiesUI');
  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <ServiceSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (services.length === 0) {
    return (
      <div className="text-center py-12">
        <Stethoscope className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium text-foreground mb-2">
          {t('empty.noServicesTitle', { specialtyName })}
        </h3>
        <p className="text-muted-foreground mb-4">
          {t('empty.noServicesDescription')}
        </p>
        <Button onClick={onAddService} disabled={isPending}>
          <Plus className="h-4 w-4 mr-2" />
          {t('addService')}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">
          {t('serviceList.title', { specialtyName })}
        </h3>
        <Button onClick={onAddService} disabled={isPending}>
          <Plus className="h-4 w-4 mr-2" />
          {t('addService')}
        </Button>
      </div>
      <div className="space-y-3">
        {services.map((service) => (
          <ServiceCard
            key={service.id}
            service={service}
            onEdit={onEdit}
            onDelete={onDelete}
            isPending={isPending}
          />
        ))}
      </div>
    </div>
  );
}

// Componente presentacional para estadísticas
interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  description?: string;
}

export function StatsCard({ title, value, icon: Icon, description }: StatsCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold text-foreground">{value}</p>
            {description && (
              <p className="text-xs text-muted-foreground mt-1">{description}</p>
            )}
          </div>
          <Icon className="h-8 w-8 text-muted-foreground" />
        </div>
      </CardContent>
    </Card>
  );
}
