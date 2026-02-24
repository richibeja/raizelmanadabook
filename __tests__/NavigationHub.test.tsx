import React from 'react'
import { render, screen } from '@testing-library/react'
import NavigationHub from '../app/components/NavigationHub'

// Mock Next.js Image component
jest.mock('next/image', () => {
  return function MockedImage({ src, alt, ...props }: any) {
    return <img src={src} alt={alt} {...props} />
  }
})

// Mock Lucide React icons
jest.mock('lucide-react', () => ({
  Dog: () => <div data-testid="dog-icon">Dog</div>,
  Cat: () => <div data-testid="cat-icon">Cat</div>,
  Calculator: () => <div data-testid="calculator-icon">Calculator</div>,
  Users: () => <div data-testid="users-icon">Users</div>,
  MessageCircle: () => <div data-testid="message-circle-icon">MessageCircle</div>,
  ArrowRight: () => <div data-testid="arrow-right-icon">ArrowRight</div>,
  Heart: () => <div data-testid="heart-icon">Heart</div>,
  Camera: () => <div data-testid="camera-icon">Camera</div>,
  Globe: () => <div data-testid="globe-icon">Globe</div>,
  Phone: () => <div data-testid="phone-icon">Phone</div>,
  BookOpen: () => <div data-testid="book-open-icon">BookOpen</div>,
  Home: () => <div data-testid="home-icon">Home</div>,
  User: () => <div data-testid="user-icon">User</div>,
  Settings: () => <div data-testid="settings-icon">Settings</div>,
  LogOut: () => <div data-testid="log-out-icon">LogOut</div>,
}))

describe('NavigationHub', () => {
  it('renders all navigation items', () => {
    render(<NavigationHub />)
    
    // Check if main navigation cards are rendered
    expect(screen.getByText('ManadaBook')).toBeInTheDocument()
    expect(screen.getByText('Productos para Perros')).toBeInTheDocument()
    expect(screen.getByText('Productos para Gatos')).toBeInTheDocument()
    expect(screen.getByText('Calculadora de Porciones')).toBeInTheDocument()
  })

  it('renders user menu items', () => {
    render(<NavigationHub />)
    
    // Check if user menu items are rendered
    expect(screen.getByText('Nuestros Aliados')).toBeInTheDocument()
    expect(screen.getByText('Contacto')).toBeInTheDocument()
  })

  it('has proper navigation links', () => {
    render(<NavigationHub />)
    
    // Check if navigation links have proper href attributes
    const manadaBookLink = screen.getByText('ManadaBook').closest('a')
    expect(manadaBookLink).toHaveAttribute('href', '/manadabook')
    
  })
})
