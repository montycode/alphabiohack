import { SpecialtiesPage } from '@/components/specialties/specialties-page';
import { SpecialtiesProvider } from '@/contexts/specialties-context';

export default function Specialties() {
  return (
    <SpecialtiesProvider>
      <SpecialtiesPage />
    </SpecialtiesProvider>
  );
}
