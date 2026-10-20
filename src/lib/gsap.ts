import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

// Register plugins once; every component imports gsap from here.
gsap.registerPlugin(ScrollTrigger, useGSAP)

// The scroll-driven story always starts from the opening shot on reload.
// (ScrollTrigger owns history.scrollRestoration, so set it through its API.)
ScrollTrigger.clearScrollMemory('manual')

export { gsap, ScrollTrigger, useGSAP }
