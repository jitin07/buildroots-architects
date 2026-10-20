/**
 * Business configuration. Public contact details live here; anything that
 * varies per deployment (form endpoint, WhatsApp, phone, social links) comes
 * from environment variables — see .env.example. Unset values are hidden on
 * the site rather than replaced with made-up ones.
 */

const env = import.meta.env
const clean = (value: string | undefined) => value?.trim() || undefined

const whatsappNumber = clean(env.VITE_WHATSAPP_NUMBER)?.replace(/\D/g, '') || undefined

export const site = {
  name: 'BuildRoots Architects',
  shortName: 'BuildRoots',
  email: 'connect@buildroots.in',
  phone: clean(env.VITE_PUBLIC_PHONE),
  location: {
    city: 'Greater Noida',
    region: 'Uttar Pradesh',
    country: 'India',
  },
  whatsapp: whatsappNumber
    ? {
        number: whatsappNumber,
        link: (message: string) => `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`,
      }
    : undefined,
  contactForm: {
    endpoint: clean(env.VITE_CONTACT_ENDPOINT),
    accessKey: clean(env.VITE_CONTACT_ACCESS_KEY),
  },
  social: [
    { id: 'instagram', label: 'Instagram', url: clean(env.VITE_SOCIAL_INSTAGRAM) },
    { id: 'linkedin', label: 'LinkedIn', url: clean(env.VITE_SOCIAL_LINKEDIN) },
    { id: 'facebook', label: 'Facebook', url: clean(env.VITE_SOCIAL_FACEBOOK) },
    { id: 'youtube', label: 'YouTube', url: clean(env.VITE_SOCIAL_YOUTUBE) },
    { id: 'pinterest', label: 'Pinterest', url: clean(env.VITE_SOCIAL_PINTEREST) },
  ].filter((s): s is { id: string; label: string; url: string } => Boolean(s.url)),
}

export const navLinks = [
  { id: 'work', label: 'Work' },
  { id: 'services', label: 'Services' },
  { id: 'about', label: 'About' },
  { id: 'contact', label: 'Contact' },
] as const
