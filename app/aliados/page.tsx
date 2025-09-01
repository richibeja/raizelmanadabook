'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Filter, Search, MapPin, Users } from 'lucide-react';
import TarjetaAliado from '../components/TarjetaAliado';

interface Affiliate {
  id: string;
  name: string;
  contact_type: 'WhatsApp' | 'Email' | 'Teléfono' | 'Web';
  contact_value: string;
  region: string;
  description: string;
  logo_url?: string | null;
  is_active: boolean;
}

export default function AliadosPage() {
  const [affiliates, setAffiliates] = useState<Affiliate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filteredAffiliates, setFilteredAffiliates] = useState<Affiliate[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedContactType, setSelectedContactType] = useState('');

  // Obtener aliados desde la API
  useEffect(() => {
    const fetchAffiliates = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/affiliates');
        const result = await response.json();
        
        if (result.success) {
          setAffiliates(result.data);
          setFilteredAffiliates(result.data);
        } else {
          setError(result.message || 'Error al cargar los aliados');
        }
      } catch (err) {
        setError('Error de conexión al cargar los aliados');
        console.error('Error fetching affiliates:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAffiliates();
  }, []);

  // Filtrar aliados según búsqueda y filtros
  useEffect(() => {
    let filtered = affiliates;

    // Filtro por término de búsqueda
    if (searchTerm) {
      filtered = filtered.filter(affiliate =>
        affiliate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        affiliate.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        affiliate.region.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtro por región
    if (selectedRegion) {
      filtered = filtered.filter(affiliate => affiliate.region === selectedRegion);
    }

    // Filtro por tipo de contacto
    if (selectedContactType) {
      filtered = filtered.filter(affiliate => affiliate.contact_type === selectedContactType);
    }

    setFilteredAffiliates(filtered);
  }, [affiliates, searchTerm, selectedRegion, selectedContactType]);

  // Obtener regiones únicas para el filtro
  const uniqueRegions = Array.from(new Set(affiliates.map(affiliate => affiliate.region))).sort();

  // Obtener tipos de contacto únicos para el filtro
  const uniqueContactTypes = ['WhatsApp', 'Email', 'Teléfono', 'Web'];

  // Limpiar filtros
  const clearFilters = () => {
    setSearchTerm('');
    setSelectedRegion('');
    setSelectedContactType('');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando aliados...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center">
            <div className="bg-red-100 rounded-full h-16 w-16 mx-auto mb-4 flex items-center justify-center">
              <span className="text-red-600 text-2xl">⚠️</span>
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Error al cargar aliados</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              Intentar de nuevo
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-green-600 hover:text-green-700 mb-4">
            <ArrowLeft size={20} className="mr-2" />
            Volver a Raízel
          </Link>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Nuestros Aliados</h1>
          <p className="text-lg text-gray-600 max-w-3xl">
            Contacta directamente a los distribuidores autorizados de nuestros productos. 
            Encuentra el aliado más cercano a ti y obtén productos Raízel de calidad.
          </p>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Users className="text-green-600" size={24} />
            </div>
            <h3 className="text-2xl font-bold text-gray-800">{affiliates.length}</h3>
            <p className="text-gray-600">Aliados activos</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <MapPin className="text-blue-600" size={24} />
            </div>
            <h3 className="text-2xl font-bold text-gray-800">{uniqueRegions.length}</h3>
            <p className="text-gray-600">Regiones cubiertas</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Filter className="text-purple-600" size={24} />
            </div>
            <h3 className="text-2xl font-bold text-gray-800">{uniqueContactTypes.length}</h3>
            <p className="text-gray-600">Tipos de contacto</p>
          </div>
        </div>

        {/* Filtros y búsqueda */}
        <div className="bg-white rounded-2xl p-6 shadow-lg mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Filter className="mr-2" size={20} />
            Filtrar y buscar aliados
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            {/* Búsqueda por texto */}
            <div className="relative">
              <Search className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Buscar aliados..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            {/* Filtro por región */}
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="">Todas las regiones</option>
              {uniqueRegions.map(region => (
                <option key={region} value={region}>{region}</option>
              ))}
            </select>

            {/* Filtro por tipo de contacto */}
            <select
              value={selectedContactType}
              onChange={(e) => setSelectedContactType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="">Todos los contactos</option>
              {uniqueContactTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>

            {/* Botón limpiar filtros */}
            <button
              onClick={clearFilters}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Limpiar filtros
            </button>
          </div>

          {/* Resultados del filtro */}
          <div className="text-sm text-gray-600">
            Mostrando {filteredAffiliates.length} de {affiliates.length} aliados
            {(searchTerm || selectedRegion || selectedContactType) && (
              <span className="ml-2">
                (filtrados)
              </span>
            )}
          </div>
        </div>

        {/* Grid de aliados */}
        {filteredAffiliates.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredAffiliates.map((affiliate) => (
              <TarjetaAliado key={affiliate.id} affiliate={affiliate} />
            ))}
          </div>
        ) : (
          <div className="text-center bg-white rounded-2xl p-12 shadow-lg">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="text-gray-400" size={32} />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              No se encontraron aliados
            </h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || selectedRegion || selectedContactType
                ? 'Intenta ajustar los filtros de búsqueda'
                : 'No hay aliados disponibles en este momento'
              }
            </p>
            {(searchTerm || selectedRegion || selectedContactType) && (
              <button
                onClick={clearFilters}
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                Ver todos los aliados
              </button>
            )}
          </div>
        )}

        {/* CTA */}
        <div className="mt-16 text-center bg-white rounded-2xl p-8 shadow-lg">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            ¿Eres distribuidor y quieres ser aliado de Raízel?
          </h2>
          <p className="text-gray-600 mb-6">
            Contáctanos para conocer los beneficios de ser distribuidor autorizado de nuestros productos naturales.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contacto" className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors">
              Contactar para ser aliado
            </Link>
            <Link href="/" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
              Volver a Raízel
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
