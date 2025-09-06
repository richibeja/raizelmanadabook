'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Filter, Search, MapPin, Users, Plus, Edit, Trash2, Phone, Mail, Globe, MessageCircle, Eye, EyeOff } from 'lucide-react';
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
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingAffiliate, setEditingAffiliate] = useState<Affiliate | null>(null);
  const [showInactive, setShowInactive] = useState(false);

  // Datos de ejemplo para aliados
  const sampleAffiliates: Affiliate[] = [
    {
      id: '1',
      name: 'Veterinaria San Francisco',
      contact_type: 'WhatsApp',
      contact_value: '+57 300 123 4567',
      region: 'Bogotá',
      description: 'Clínica veterinaria especializada en medicina interna y cirugía. Ofrecemos servicios de consulta, cirugía y hospitalización.',
      logo_url: null,
      is_active: true
    },
    {
      id: '2',
      name: 'Pet Store Central',
      contact_type: 'Email',
      contact_value: 'ventas@petstorecentral.com',
      region: 'Medellín',
      description: 'Tienda especializada en productos naturales para mascotas. Distribuimos alimentos BARF, juguetes y accesorios.',
      logo_url: null,
      is_active: true
    },
    {
      id: '3',
      name: 'Guardería Canina HappyPets',
      contact_type: 'Teléfono',
      contact_value: '+57 310 987 6543',
      region: 'Cali',
      description: 'Guardería y hotel para perros con servicios de paseo, entrenamiento y cuidado especializado.',
      logo_url: null,
      is_active: true
    },
    {
      id: '4',
      name: 'Clínica Veterinaria del Norte',
      contact_type: 'Web',
      contact_value: 'https://veterinariadelnorte.com',
      region: 'Barranquilla',
      description: 'Centro veterinario con más de 15 años de experiencia. Especialistas en cardiología y dermatología.',
      logo_url: null,
      is_active: false
    },
    {
      id: '5',
      name: 'Alimentos Naturales PetFood',
      contact_type: 'WhatsApp',
      contact_value: '+57 315 456 7890',
      region: 'Bucaramanga',
      description: 'Fabricantes de alimentos naturales para perros y gatos. Productos orgánicos y sin conservantes.',
      logo_url: null,
      is_active: true
    }
  ];

  // Cargar aliados (simulando API)
  useEffect(() => {
    const loadAffiliates = () => {
      setLoading(true);
      setTimeout(() => {
        setAffiliates(sampleAffiliates);
        setFilteredAffiliates(sampleAffiliates);
        setLoading(false);
      }, 1000);
    };

    loadAffiliates();
  }, []);

  // Funciones de gestión de aliados
  const handleAddAffiliate = (newAffiliate: Omit<Affiliate, 'id'>) => {
    const affiliate: Affiliate = {
      ...newAffiliate,
      id: Date.now().toString()
    };
    setAffiliates(prev => [...prev, affiliate]);
    setShowAddModal(false);
    alert('Aliado agregado exitosamente');
  };

  const handleEditAffiliate = (updatedAffiliate: Affiliate) => {
    setAffiliates(prev => 
      prev.map(affiliate => 
        affiliate.id === updatedAffiliate.id ? updatedAffiliate : affiliate
      )
    );
    setEditingAffiliate(null);
    alert('Aliado actualizado exitosamente');
  };

  const handleDeleteAffiliate = (id: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este aliado?')) {
      setAffiliates(prev => prev.filter(affiliate => affiliate.id !== id));
      alert('Aliado eliminado exitosamente');
    }
  };

  const handleToggleActive = (id: string) => {
    setAffiliates(prev => 
      prev.map(affiliate => 
        affiliate.id === id ? { ...affiliate, is_active: !affiliate.is_active } : affiliate
      )
    );
  };

  const handleContact = (affiliate: Affiliate) => {
    switch (affiliate.contact_type) {
      case 'WhatsApp':
        window.open(`https://wa.me/${affiliate.contact_value.replace(/\D/g, '')}`, '_blank');
        break;
      case 'Email':
        window.open(`mailto:${affiliate.contact_value}`, '_blank');
        break;
      case 'Teléfono':
        window.open(`tel:${affiliate.contact_value}`, '_blank');
        break;
      case 'Web':
        window.open(affiliate.contact_value, '_blank');
        break;
    }
  };

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

    // Filtro por estado activo/inactivo
    if (!showInactive) {
      filtered = filtered.filter(affiliate => affiliate.is_active);
    }

    setFilteredAffiliates(filtered);
  }, [affiliates, searchTerm, selectedRegion, selectedContactType, showInactive]);

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
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-4">Nuestros Aliados</h1>
              <p className="text-lg text-gray-600 max-w-3xl">
                Contacta directamente a los distribuidores autorizados de nuestros productos. 
                Encuentra el aliado más cercano a ti y obtén productos Raízel de calidad.
              </p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
            >
              <Plus size={20} />
              <span>Agregar Aliado</span>
            </button>
          </div>
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
          
          {/* Toggle para mostrar inactivos */}
          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={showInactive}
                onChange={(e) => setShowInactive(e.target.checked)}
                className="rounded border-gray-300 text-green-600 focus:ring-green-500"
              />
              <span className="text-sm text-gray-700">Mostrar aliados inactivos</span>
            </label>
            <div className="text-sm text-gray-500">
              Mostrando {filteredAffiliates.length} de {affiliates.length} aliados
            </div>
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
              <div key={affiliate.id} className="relative">
                <TarjetaAliado affiliate={affiliate} />
                
                {/* Botones de acción */}
                <div className="absolute top-4 right-4 flex space-x-2">
                  <button
                    onClick={() => handleContact(affiliate)}
                    className="p-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors"
                    title="Contactar"
                  >
                    {affiliate.contact_type === 'WhatsApp' && <MessageCircle size={16} />}
                    {affiliate.contact_type === 'Email' && <Mail size={16} />}
                    {affiliate.contact_type === 'Teléfono' && <Phone size={16} />}
                    {affiliate.contact_type === 'Web' && <Globe size={16} />}
                  </button>
                  
                  <button
                    onClick={() => setEditingAffiliate(affiliate)}
                    className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                    title="Editar"
                  >
                    <Edit size={16} />
                  </button>
                  
                  <button
                    onClick={() => handleToggleActive(affiliate.id)}
                    className={`p-2 rounded-full transition-colors ${
                      affiliate.is_active 
                        ? 'bg-yellow-600 text-white hover:bg-yellow-700' 
                        : 'bg-gray-600 text-white hover:bg-gray-700'
                    }`}
                    title={affiliate.is_active ? 'Desactivar' : 'Activar'}
                  >
                    {affiliate.is_active ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                  
                  <button
                    onClick={() => handleDeleteAffiliate(affiliate.id)}
                    className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                    title="Eliminar"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
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

        {/* Modal para agregar/editar aliado */}
        {(showAddModal || editingAffiliate) && (
          <AffiliateModal
            affiliate={editingAffiliate}
            onSave={editingAffiliate ? handleEditAffiliate : handleAddAffiliate}
            onClose={() => {
              setShowAddModal(false);
              setEditingAffiliate(null);
            }}
          />
        )}
      </div>
    </div>
  );
}

// Componente Modal para agregar/editar aliados
interface AffiliateModalProps {
  affiliate?: Affiliate | null;
  onSave: (affiliate: Affiliate) => void;
  onClose: () => void;
}

const AffiliateModal: React.FC<AffiliateModalProps> = ({ affiliate, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    name: affiliate?.name || '',
    contact_type: affiliate?.contact_type || 'WhatsApp',
    contact_value: affiliate?.contact_value || '',
    region: affiliate?.region || '',
    description: affiliate?.description || '',
    is_active: affiliate?.is_active ?? true
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (affiliate) {
      onSave({ ...affiliate, ...formData });
    } else {
      onSave(formData as Affiliate);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          {affiliate ? 'Editar Aliado' : 'Agregar Nuevo Aliado'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre del aliado
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de contacto
              </label>
              <select
                value={formData.contact_type}
                onChange={(e) => setFormData({ ...formData, contact_type: e.target.value as any })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="WhatsApp">WhatsApp</option>
                <option value="Email">Email</option>
                <option value="Teléfono">Teléfono</option>
                <option value="Web">Web</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Valor de contacto
              </label>
              <input
                type="text"
                value={formData.contact_value}
                onChange={(e) => setFormData({ ...formData, contact_value: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Ej: +57 300 123 4567"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Región
              </label>
              <input
                type="text"
                value={formData.region}
                onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Ej: Bogotá"
                required
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descripción
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              rows={4}
              placeholder="Describe los servicios o productos que ofrece este aliado..."
              required
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="is_active"
              checked={formData.is_active}
              onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              className="rounded border-gray-300 text-green-600 focus:ring-green-500"
            />
            <label htmlFor="is_active" className="text-sm text-gray-700">
              Aliado activo
            </label>
          </div>
          
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              {affiliate ? 'Actualizar' : 'Agregar'} Aliado
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
