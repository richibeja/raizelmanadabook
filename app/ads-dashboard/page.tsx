'use client';

import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Eye, 
  MousePointer, 
  Percent, 
  DollarSign, 
  Filter,
  Edit,
  BarChart3, 
  Pause, 
  Play, 
  Trash2,
  Download,
  Settings,
  CreditCard,
  Bell,
  HelpCircle,
  Home,
  ChartLine,
  Megaphone,
  Users,
  Wallet,
  Target,
  Sliders,
  Clock,
  ArrowUpDown
} from 'lucide-react';

export default function AdsDashboardPage() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('7d');
  const [selectedFormat, setSelectedFormat] = useState('all');

  // Datos de ejemplo
  const stats = [
    {
      title: 'Impresiones',
      value: '245,837',
      change: '+12.5%',
      changeType: 'positive',
      icon: Eye,
      color: 'bg-primary'
    },
    {
      title: 'Clics',
      value: '12,469',
      change: '+8.3%',
      changeType: 'positive',
      icon: MousePointer,
      color: 'bg-success'
    },
    {
      title: 'CTR',
      value: '5.07%',
      change: '-1.2%',
      changeType: 'negative',
      icon: Percent,
      color: 'bg-warning'
    },
    {
      title: 'Gasto',
      value: '$3,842.50',
      change: '+22.8%',
      changeType: 'positive',
      icon: DollarSign,
      color: 'bg-info'
    }
  ];

  const ads = [
    {
      id: 1,
      name: 'Oferta de Juguetes para Perros',
      status: 'active',
      impressions: 84239,
      clicks: 4382,
      ctr: 5.2,
      spent: 1284.75
    },
    {
      id: 2,
      name: 'Veterinaria San Francisco',
      status: 'active',
      impressions: 62184,
      clicks: 3104,
      ctr: 5.0,
      spent: 942.60
    },
    {
      id: 3,
      name: 'Tienda de Ropa para Mascotas',
      status: 'paused',
      impressions: 28475,
      clicks: 1238,
      ctr: 4.3,
      spent: 584.30
    },
    {
      id: 4,
      name: 'Alimento Premium para Gatos',
      status: 'pending',
      impressions: 0,
      clicks: 0,
      ctr: 0,
      spent: 0
    },
    {
      id: 5,
      name: 'Guardería Canina HappyPets',
      status: 'active',
      impressions: 45837,
      clicks: 2485,
      ctr: 5.4,
      spent: 782.45
    }
  ];

  const getStatusBadge = (status: string) => {
    const styles = {
      active: 'bg-green-100 text-green-800',
      paused: 'bg-yellow-100 text-yellow-800',
      pending: 'bg-blue-100 text-blue-800',
      rejected: 'bg-red-100 text-red-800'
    };
    return styles[status as keyof typeof styles] || 'bg-gray-100 text-gray-800';
  };

  const getStatusText = (status: string) => {
    const texts = {
      active: 'Activo',
      paused: 'Pausado',
      pending: 'Pendiente',
      rejected: 'Rechazado'
    };
    return texts[status as keyof typeof texts] || status;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white">
      {/* Header */}
      <header className="bg-gray-800/90 backdrop-blur-md shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center text-2xl font-bold">
              <Megaphone className="mr-3 h-8 w-8 text-red-500" />
              <span>ManadaAds</span>
            </div>
            
            <nav className="hidden md:flex space-x-8">
              <a href="#" className="flex items-center text-gray-300 hover:text-white transition-colors">
                <Home className="mr-2 h-4 w-4" />
                Dashboard
              </a>
              <a href="#" className="flex items-center text-gray-300 hover:text-white transition-colors">
                <ChartLine className="mr-2 h-4 w-4" />
                Analytics
              </a>
              <a href="#" className="flex items-center text-gray-300 hover:text-white transition-colors">
                <Megaphone className="mr-2 h-4 w-4" />
                Campañas
              </a>
              <a href="#" className="flex items-center text-gray-300 hover:text-white transition-colors">
                <Users className="mr-2 h-4 w-4" />
                Audiencias
              </a>
              <a href="#" className="flex items-center text-gray-300 hover:text-white transition-colors">
                <Wallet className="mr-2 h-4 w-4" />
                Facturación
              </a>
            </nav>

            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg font-semibold transition-all hover:shadow-lg hover:-translate-y-1 flex items-center"
            >
              <Plus className="mr-2 h-4 w-4" />
              Crear Anuncio
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Filter className="mr-2 h-5 w-5 text-red-500" />
                  Filtros
                </h3>
                <nav className="space-y-2">
                  <a href="#" className="flex items-center text-red-500 bg-red-500/10 px-3 py-2 rounded-lg">
                    <BarChart3 className="mr-3 h-4 w-4" />
                    Resumen
                  </a>
                  <a href="#" className="flex items-center text-gray-300 hover:text-white px-3 py-2 rounded-lg hover:bg-gray-700/50">
                    <Megaphone className="mr-3 h-4 w-4" />
                    Todas las campañas
                  </a>
                  <a href="#" className="flex items-center text-gray-300 hover:text-white px-3 py-2 rounded-lg hover:bg-gray-700/50">
                    <Play className="mr-3 h-4 w-4" />
                    Activas
                  </a>
                  <a href="#" className="flex items-center text-gray-300 hover:text-white px-3 py-2 rounded-lg hover:bg-gray-700/50">
                    <Pause className="mr-3 h-4 w-4" />
                    Pausadas
                  </a>
                  <a href="#" className="flex items-center text-gray-300 hover:text-white px-3 py-2 rounded-lg hover:bg-gray-700/50">
                    <Clock className="mr-3 h-4 w-4" />
                    Pendientes
                  </a>
                </nav>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Settings className="mr-2 h-5 w-5 text-red-500" />
                  Configuración
                </h3>
                <nav className="space-y-2">
                  <a href="#" className="flex items-center text-gray-300 hover:text-white px-3 py-2 rounded-lg hover:bg-gray-700/50">
                    <Sliders className="mr-3 h-4 w-4" />
                    Preferencias
                  </a>
                  <a href="#" className="flex items-center text-gray-300 hover:text-white px-3 py-2 rounded-lg hover:bg-gray-700/50">
                    <CreditCard className="mr-3 h-4 w-4" />
                    Métodos de pago
                  </a>
                  <a href="#" className="flex items-center text-gray-300 hover:text-white px-3 py-2 rounded-lg hover:bg-gray-700/50">
                    <Bell className="mr-3 h-4 w-4" />
                    Notificaciones
                  </a>
                  <a href="#" className="flex items-center text-gray-300 hover:text-white px-3 py-2 rounded-lg hover:bg-gray-700/50">
                    <HelpCircle className="mr-3 h-4 w-4" />
                    Ayuda
                  </a>
                </nav>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Welcome Banner */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 shadow-xl">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                <div>
                  <h2 className="text-3xl font-bold mb-2">Panel de Control de Publicidad</h2>
                  <p className="text-blue-100 max-w-2xl">
                    Gestiona tus campañas publicitarias, analiza el rendimiento y llega a más amantes de mascotas.
                  </p>
                </div>
                <button className="mt-4 md:mt-0 bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center">
                  <Download className="mr-2 h-4 w-4" />
                  Exportar Reporte
                </button>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <div key={index} className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 shadow-lg">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-gray-400 text-sm font-medium">{stat.title}</h3>
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.color}`}>
                      <stat.icon className="h-5 w-5" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold mb-2">{stat.value}</div>
                  <div className={`text-sm flex items-center ${
                    stat.changeType === 'positive' ? 'text-green-400' : 'text-red-400'
                  }`}>
                    <span className="mr-1">
                      {stat.changeType === 'positive' ? '↗' : '↘'}
                    </span>
                    {stat.change} desde ayer
                  </div>
                </div>
              ))}
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <div className="xl:col-span-2 bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 shadow-lg">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold">Rendimiento de Campañas</h3>
                  <select 
                    value={selectedPeriod}
                    onChange={(e) => setSelectedPeriod(e.target.value)}
                    className="bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600"
                  >
                    <option value="7d">Últimos 7 días</option>
                    <option value="30d">Últimos 30 días</option>
                    <option value="90d">Últimos 90 días</option>
                  </select>
                </div>
                <div className="h-64 bg-gray-700/30 rounded-lg flex items-center justify-center">
                  <p className="text-gray-400">Gráfico de rendimiento (Chart.js)</p>
                </div>
              </div>

              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 shadow-lg">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold">Distribución por Formato</h3>
                  <select 
                    value={selectedFormat}
                    onChange={(e) => setSelectedFormat(e.target.value)}
                    className="bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600"
                  >
                    <option value="all">Todos</option>
                    <option value="active">Solo activos</option>
                  </select>
                </div>
                <div className="h-64 bg-gray-700/30 rounded-lg flex items-center justify-center">
                  <p className="text-gray-400">Gráfico circular (Chart.js)</p>
                </div>
              </div>
            </div>

            {/* Ads Table */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 shadow-lg">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold">Tus Anuncios</h3>
                <div className="flex space-x-3">
                  <button className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center">
                    <Filter className="mr-2 h-4 w-4" />
                    Filtrar
                  </button>
                  <button className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center">
                    <ArrowUpDown className="mr-2 h-4 w-4" />
                    Ordenar
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="text-left py-4 px-2 text-gray-400 font-medium">Anuncio</th>
                      <th className="text-left py-4 px-2 text-gray-400 font-medium">Estado</th>
                      <th className="text-left py-4 px-2 text-gray-400 font-medium">Impresiones</th>
                      <th className="text-left py-4 px-2 text-gray-400 font-medium">Clics</th>
                      <th className="text-left py-4 px-2 text-gray-400 font-medium">CTR</th>
                      <th className="text-left py-4 px-2 text-gray-400 font-medium">Gasto</th>
                      <th className="text-left py-4 px-2 text-gray-400 font-medium">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ads.map((ad) => (
                      <tr key={ad.id} className="border-b border-gray-700/50 hover:bg-gray-700/30">
                        <td className="py-4 px-2 font-medium">{ad.name}</td>
                        <td className="py-4 px-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(ad.status)}`}>
                            {getStatusText(ad.status)}
                          </span>
                        </td>
                        <td className="py-4 px-2">{ad.impressions.toLocaleString()}</td>
                        <td className="py-4 px-2">{ad.clicks.toLocaleString()}</td>
                        <td className="py-4 px-2">{ad.ctr}%</td>
                        <td className="py-4 px-2">${ad.spent.toFixed(2)}</td>
                        <td className="py-4 px-2">
                          <div className="flex space-x-2">
                            <button className="text-gray-400 hover:text-white transition-colors">
                              <Edit className="h-4 w-4" />
                            </button>
                            <button className="text-gray-400 hover:text-white transition-colors">
                              <BarChart3 className="h-4 w-4" />
                            </button>
                            <button className="text-gray-400 hover:text-white transition-colors">
                              {ad.status === 'active' ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Create Ad Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-gray-700">
              <h2 className="text-2xl font-bold">Crear Nueva Campaña Publicitaria</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Nombre de la campaña
                  </label>
                  <input
                    type="text"
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-red-500"
                    placeholder="Ej: Oferta de Juguetes para Perros"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Presupuesto diario
                  </label>
                  <input
                    type="number"
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-red-500"
                    placeholder="0.00"
                    step="0.01"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Formato del anuncio
                </label>
                <select className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-red-500">
                  <option value="">Selecciona un formato</option>
                  <option value="image">Imagen</option>
                  <option value="video">Video</option>
                  <option value="carousel">Carrusel</option>
                  <option value="story">Story</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Contenido del anuncio
                </label>
                <textarea
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-red-500"
                  rows={3}
                  placeholder="Describe tu anuncio..."
                />
              </div>

              <div className="bg-gray-700/50 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Target className="mr-2 h-5 w-5 text-red-500" />
                  Opciones de Targeting
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Ubicación
                    </label>
                    <select className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-red-500">
                      <option value="">Todas las ubicaciones</option>
                      <option value="es">España</option>
                      <option value="mx">México</option>
                      <option value="co">Colombia</option>
                      <option value="ar">Argentina</option>
                      <option value="us">Estados Unidos</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Tipos de Mascotas
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <label className="flex items-center text-sm">
                        <input type="checkbox" className="mr-2" />
                        Perros
                      </label>
                      <label className="flex items-center text-sm">
                        <input type="checkbox" className="mr-2" />
                        Gatos
                      </label>
                      <label className="flex items-center text-sm">
                        <input type="checkbox" className="mr-2" />
                        Aves
                      </label>
                      <label className="flex items-center text-sm">
                        <input type="checkbox" className="mr-2" />
                        Otras
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-4 p-6 border-t border-gray-700">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-6 py-3 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Cancelar
              </button>
              <button className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
                Crear Campaña
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
