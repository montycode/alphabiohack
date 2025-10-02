import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone, Twitter } from "lucide-react"

import { CONTACT_INFO } from "@/constants"
import Image from "next/image"
import Link from "next/link"
import { Link as LocalizedLink } from "@/i18n/navigation"
import { useTranslations } from "next-intl"

export function MedicalFooter() {
  const t = useTranslations('Footer')
  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="w-full max-w-xs sm:max-w-sm md:max-w-md">
              <LocalizedLink href="/" className="block w-full">
                <Image 
                  src="/images/logo.png" 
                  alt="MyAlphaPulse Logo" 
                  width={200} 
                  height={200} 
                  className="w-full h-auto object-contain"
                />
              </LocalizedLink>
            </div>
            <p className="text-secondary-foreground/80 text-sm leading-relaxed">
              {t('description')}
            </p>
            <div className="flex space-x-4">
              <Link href="https://www.facebook.com/profile.php?id=61575723443538&locale=es_LA" className="text-secondary-foreground/80 hover:text-primary transition-colors">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-secondary-foreground/80 hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-secondary-foreground/80 hover:text-primary transition-colors">
                <Linkedin className="h-5 w-5" />
              </Link>
              <Link href="https://www.instagram.com/tenma_control/" className="text-secondary-foreground/80 hover:text-primary transition-colors">
                <Instagram className="h-5 w-5" />
              </Link>
            </div>
          </div>

          

          {/* For Doctors */}
          <div className="space-y-4 md:mx-auto">
            <h4 className="text-lg font-semibold">{t('forDoctors')}</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#" className="text-secondary-foreground/80 hover:text-primary transition-colors">
                  {t('appointments')}
                </Link>
              </li>
              <li>
                <LocalizedLink href="/auth/login" className="text-secondary-foreground/80 hover:text-primary transition-colors">
                  {t('login')}
                </LocalizedLink>
              </li>
              <li>
                <LocalizedLink href="/auth/sign-up" className="text-secondary-foreground/80 hover:text-primary transition-colors">
                  {t('register')}
                </LocalizedLink>
              </li>
              <li>
                <Link href="#" className="text-secondary-foreground/80 hover:text-primary transition-colors">
                  {t('doctorDashboard')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Us */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">{t('contactUs')}</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-start space-x-3">
                <MapPin className="h-4 w-4 mt-1 shrink-0" />
                <span className="text-secondary-foreground/80">
                  {t('address')}
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 shrink-0" />
                <span className="text-secondary-foreground/80">{CONTACT_INFO.PHONE}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 shrink-0" />
                <span className="text-secondary-foreground/80">{CONTACT_INFO.EMAIL}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-secondary-foreground/20 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-secondary-foreground/80 text-sm">
              © {new Date().getFullYear()} MyAlphaPulse. {t('copyright')}
            </p>
            <div className="flex space-x-6 text-sm">
              <Link href={CONTACT_INFO.TERMS_AND_CONDITIONS} className="text-secondary-foreground/80 hover:text-primary transition-colors">
                {t('termsAndConditions')}
              </Link>
              <Link href={CONTACT_INFO.PRIVACY_POLICY} className="text-secondary-foreground/80 hover:text-primary transition-colors">
                {t('privacyPolicy')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
