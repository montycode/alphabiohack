"use client"

import { Mail, Menu, Phone, X } from "lucide-react"

import { AuthButton } from "@/components/auth/header-auth-buttons";
import { Button } from "@/components/ui/button"
import { CONTACT_INFO } from "@/constants"
import Image from "next/image"
import { LanguageSelector } from "@/components/common/language-selector"
import { Link as LocalizedLink } from "@/i18n/navigation"
import { ThemeToggle } from "@/components/common/theme-toggle"
import { useState } from "react"
import { useTranslations } from "next-intl"

export function MedicalHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const t = useTranslations('Navigation')

  const navigation = [
    { name: t('home'), href: "/" as const },
    { name: t('contact'), href: "/contact" as const },
    { name: t('booking'), href: "/booking" as const },
  ]

  return (
    <header className="bg-background border-b border-border sticky top-0 z-50">
      <div className="bg-muted/30 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-10 text-sm">
            {/* Contact Info */}
            <div className="hidden md:flex items-center space-x-6 text-muted-foreground">
              <div className="flex items-center">
                <Mail className="h-3 w-3 mr-1" />
                <span>{CONTACT_INFO.EMAIL}</span>
              </div>
              <div className="flex items-center">
                <Phone className="h-3 w-3 mr-1" />
                <span>{CONTACT_INFO.PHONE}</span>
              </div>
            </div>

            {/* Utility Buttons */}
            <div className="flex items-center space-x-2">
              <ThemeToggle />
              <LanguageSelector />
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg">
            <LocalizedLink href="/" className="block w-full">
              <Image 
                src="/images/logo.png" 
                alt="MyAlphaPulse Logo" 
                width={200} 
                height={200} 
                className="w-full max-w-[250px] h-auto object-contain"
                priority
              />
            </LocalizedLink>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => (
              <LocalizedLink
                key={item.name}
                href={item.href}
                className="text-foreground hover:text-primary transition-colors duration-200"
              >
                {item.name}
              </LocalizedLink>
            ))}
          </nav>

          <div className="hidden md:flex items-center space-x-3 ml-2">
            <AuthButton />
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button variant="ghost" size="sm" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-card border-t border-border">
              {navigation.map((item) => (
                <LocalizedLink
                  key={item.name}
                  href={item.href}
                  className="block px-3 py-2 text-foreground hover:text-primary transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </LocalizedLink>
              ))}
              <div className="px-3 py-2 border-t border-border mt-2">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium">{t('settings')}</span>
                  <div className="flex items-center space-x-2">
                    <ThemeToggle />
                    <LanguageSelector />
                  </div>
                </div>
                <div className="flex items-center text-sm text-muted-foreground mb-2">
                  <Mail className="h-4 w-4 mr-2" />
                  <span>{CONTACT_INFO.EMAIL}</span>
                </div>
                <div className="flex items-center text-sm text-muted-foreground mb-3">
                  <Phone className="h-4 w-4 mr-2" />
                  <span>{CONTACT_INFO.PHONE}</span>
                </div>
                <div className="flex space-x-2">
                  
                  <AuthButton />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
