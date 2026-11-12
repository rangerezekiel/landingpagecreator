import { Bebas_Neue, Roboto } from 'next/font/google'

export const bebasNeue = Bebas_Neue({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-bebas-neue',
  display: 'swap',
})

export const roboto = Roboto({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
  variable: '--font-roboto',
  display: 'swap',
})

// Arial is a system font, so we'll define it as a CSS variable
export const arial = {
  className: 'font-arial',
  variable: '--font-arial',
} 