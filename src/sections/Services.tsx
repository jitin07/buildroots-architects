import { useRef } from 'react'
import { servicesIntro } from '../content/business'
import { services } from '../content/services'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { prefillEnquiry } from '../lib/enquiry'
import { scrollToSection } from '../lib/scrollTo'
import './info.css'

const serviceEnquiryType: Record<string, string> = {
  architecture: 'Contemporary residence',
  interiors: 'Interior design',
  construction: 'Renovation / construction',
  visualisation: '3D visualisation',
  cost: 'BOQ & cost planning',
}

/** Services as editorial numbered rows, each with its deliverables and an enquiry shortcut. */
export default function Services() {
  const root = useRef<HTMLElement>(null)
  useScrollReveal(root)

  const enquire = (id: string) => {
    prefillEnquiry(serviceEnquiryType[id] ?? 'Other')
    scrollToSection('contact')
  }

  return (
    <section ref={root} id="services" className="section services" aria-labelledby="services-title">
      <header className="section__header">
        <p className="section__label t-caption" data-reveal>
          {servicesIntro.label}
        </p>
        <h2 id="services-title" className="section__title t-h1" data-reveal>
          {servicesIntro.title}
        </h2>
      </header>

      <ol className="services__list">
        {services.map((service, i) => (
          <li key={service.id} className="service-row" data-reveal>
            <span className="service-row__index t-caption">{String(i + 1).padStart(2, '0')}</span>
            <h3 className="service-row__title">{service.title}</h3>
            <div className="service-row__body">
              <p className="service-row__summary">{service.summary}</p>
              <ul className="service-row__deliverables">
                {service.deliverables.map((d) => (
                  <li key={d}>{d}</li>
                ))}
              </ul>
              <button type="button" className="service-row__enquire" onClick={() => enquire(service.id)}>
                Enquire about {service.title.toLowerCase()} <span aria-hidden="true">→</span>
              </button>
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}
