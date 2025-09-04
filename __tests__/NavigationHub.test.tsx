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
  Users: () => <div data-testid="users-icon">Users</div>,
  ShoppingCart: () => <div data-testid="shopping-cart-icon">ShoppingCart</div>,
  MessageCircle: () => <div data-testid="message-circle-icon">MessageCircle</div>,
  Camera: () => <div data-testid="camera-icon">Camera</div>,
  Heart: () => <div data-testid="heart-icon">Heart</div>,
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
    expect(screen.getByText('Marketplace')).toBeInTheDocument()
    expect(screen.getByText('Conversaciones')).toBeInTheDocument()
    expect(screen.getByText('Momentos')).toBeInTheDocument()
    expect(screen.getByText('Raizelmanada Book')).toBeInTheDocument()
  })

  it('renders user menu items', () => {
    render(<NavigationHub />)
    
    // Check if user menu items are rendered
    expect(screen.getByText('Mi Perfil')).toBeInTheDocument()
    expect(screen.getByText('Configuración')).toBeInTheDocument()
    expect(screen.getByText('Cerrar Sesión')).toBeInTheDocument()
  })

  it('has proper navigation links', () => {
    render(<NavigationHub />)
    
    // Check if navigation links have proper href attributes
    const manadaBookLink = screen.getByText('ManadaBook').closest('a')
    expect(manadaBookLink).toHaveAttribute('href', '/manadabook')
    
    const marketplaceLink = screen.getByText('Marketplace').closest('a')
    expect(marketplaceLink).toHaveAttribute('href', '/marketplace')
  })
})
