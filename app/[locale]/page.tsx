import { BlogSection } from "@/components/sections/blog"
import { HeroSection } from "@/components/sections/hero"
import { MedicalFooter } from "@/components/layout/footer"
import { MedicalHeader } from "@/components/layout/header"
import { SpecialtiesSection } from "@/components/sections/specialties"
import { featureFlags } from "@/lib/config/features"

export default function HomePage() {
  const { blog } = featureFlags.features
  const { services } = featureFlags.features
  return (
    <div className="min-h-screen">
      <MedicalHeader />
      <main>
        <HeroSection />
        {blog && <BlogSection />}
        {services && <SpecialtiesSection />}
      </main>
      <MedicalFooter />
    </div>
  )
}
