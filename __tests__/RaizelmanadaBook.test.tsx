import React from 'react'
import { render, screen } from '@testing-library/react'
import RaizelmanadaBookPage from '../app/raizelmanada-book/page'

// Mock Next.js Image component
jest.mock('next/image', () => {
  return function MockedImage({ src, alt, ...props }: any) {
    return <img src={src} alt={alt} {...props} />
  }
})

// Mock Lucide React icons
jest.mock('lucide-react', () => ({
  BookOpen: () => <div data-testid="book-open-icon">BookOpen</div>,
  PenTool: () => <div data-testid="pen-tool-icon">PenTool</div>,
  Feather: () => <div data-testid="feather-icon">Feather</div>,
  Compass: () => <div data-testid="compass-icon">Compass</div>,
  Facebook: () => <div data-testid="facebook-icon">Facebook</div>,
  Twitter: () => <div data-testid="twitter-icon">Twitter</div>,
  Instagram: () => <div data-testid="instagram-icon">Instagram</div>,
}))

describe('RaizelmanadaBookPage', () => {
  it('renders the main heading', () => {
    render(<RaizelmanadaBookPage />)
    
    expect(screen.getByText('Raizelmanada Book')).toBeInTheDocument()
  })

  it('renders the hero section description', () => {
    render(<RaizelmanadaBookPage />)
    
    expect(screen.getByText('Una experiencia literaria única que combina tradición y modernidad en cada página')).toBeInTheDocument()
  })

  it('renders navigation menu items', () => {
    render(<RaizelmanadaBookPage />)
    
    expect(screen.getByText('Inicio')).toBeInTheDocument()
    expect(screen.getByText('Contenido')).toBeInTheDocument()
    expect(screen.getByText('Testimonios')).toBeInTheDocument()
    expect(screen.getByText('Contacto')).toBeInTheDocument()
  })

  it('renders content sections', () => {
    render(<RaizelmanadaBookPage />)
    
    expect(screen.getByText('El Contenido')).toBeInTheDocument()
    expect(screen.getByText('Narrativa Profunda')).toBeInTheDocument()
    expect(screen.getByText('Estilo Único')).toBeInTheDocument()
  })

  it('renders call-to-action button', () => {
    render(<RaizelmanadaBookPage />)
    
    expect(screen.getByText('Descubrir más')).toBeInTheDocument()
  })
})
