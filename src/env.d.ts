/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** POST endpoint for the contact form (e.g. a Formspree / Getform / Web3Forms URL). */
  readonly VITE_CONTACT_ENDPOINT?: string
  /** Optional access key some form services require (sent as `access_key`). */
  readonly VITE_CONTACT_ACCESS_KEY?: string
  /** WhatsApp number in international format, digits only (e.g. 9198XXXXXXXX). */
  readonly VITE_WHATSAPP_NUMBER?: string
  /** Public phone number shown on the site, as you want it displayed. */
  readonly VITE_PUBLIC_PHONE?: string
  readonly VITE_SOCIAL_INSTAGRAM?: string
  readonly VITE_SOCIAL_LINKEDIN?: string
  readonly VITE_SOCIAL_FACEBOOK?: string
  readonly VITE_SOCIAL_YOUTUBE?: string
  readonly VITE_SOCIAL_PINTEREST?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
