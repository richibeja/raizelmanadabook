'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import Header from './Header';
import Footer from './Footer';
import { Calculator, MessageCircle, Package, MapPin, Clock } from 'lucide-react';
import '../globals.css';

// Productos Raízel para pedidos
const productosRaizel = [
  {
    id: 'vital-barf-pollo',
    name: 'Vital BARF Pollo',
    price: 45000,
    presentaciones: [
      { peso: '500g', precio: 22500 },
      { peso: '1kg', precio: 45000 },  
      { peso: '2kg', precio: 85000 }
    ],
    descripcion: 'Alimentación BARF con pollo fresco colombiano'
  },
  {
    id: 'vital-barf-res',
    name: 'Vital BARF Res', 
    price: 52000,
    presentaciones: [
      { peso: '1kg', precio: 52000 },
      { peso: '2kg', precio: 98000 },
      { peso: '5kg', precio: 235000 }
    ],
    descripcion: 'BARF premium con res para perros grandes'
  },
  {
    id: 'vital-pellets',
    name: 'Vital Pellets Naturales',
    price: 38000,
    presentaciones: [
      { peso: '1kg', precio: 38000 },
      { peso: '3kg', precio: 108000 },
      { peso: '8kg', precio: 275000 }
    ],
    descripcion: 'Pellets horneados sin químicos ni conservantes'
  }
];

export default function HacerPedidoPage() {
  const [pedidoForm, setPedidoForm] = useState({
    nombre: '',
    telefono: '',
    direccion: '',
    ciudad: 'Bogotá',
    productos: [] as any[],
    observaciones: ''
  });

  const [pesoMascota, setPesoMascota] = useState('');
  const [porcionCalculada, setPorcionCalculada] = useState<number | null>(null);

  // Calcular porción BARF recomendada
  const calcularPorcion = () => {
    const peso = parseFloat(pesoMascota);
    if (peso > 0) {
      const porcionDiaria = peso * 0.025 * 1000; // 2.5% del peso en gramos
      setPorcionCalculada(Math.round(porcionDiaria));
    }
  };

  const agregarProducto = (producto: any, presentacion: any) => {
    const nuevoProducto = {
      id: `${producto.id}-${presentacion.peso}`,
      nombre: `${producto.name} ${presentacion.peso}`,
      precio: presentacion.precio,
      cantidad: 1
    };
    
    setPedidoForm(prev => ({
      ...prev,
      productos: [...prev.productos, nuevoProducto]
    }));
  };

  const generarMensajeWhatsApp = () => {
    let mensaje = `🐾 *PEDIDO RAÍZEL* 🐾\n\n`;
    mensaje += `👤 *Cliente:* ${pedidoForm.nombre}\n`;
    mensaje += `📞 *Teléfono:* ${pedidoForm.telefono}\n`;
    mensaje += `📍 *Dirección:* ${pedidoForm.direccion}, ${pedidoForm.ciudad}\n\n`;
    
    mensaje += `🛒 *PRODUCTOS:*\n`;
    let total = 0;
    pedidoForm.productos.forEach(prod => {
      mensaje += `• ${prod.nombre} - $${prod.precio.toLocaleString()}\n`;
      total += prod.precio * prod.cantidad;
    });
    
    mensaje += `\n💰 *TOTAL: $${total.toLocaleString()} COP*\n\n`;
    
    if (porcionCalculada) {
      mensaje += `🧮 *Porción calculada:* ${porcionCalculada}g diarios\n\n`;
    }
    
    if (pedidoForm.observaciones) {
      mensaje += `📝 *Observaciones:* ${pedidoForm.observaciones}\n\n`;
    }
    
    mensaje += `🕐 *Horario de entrega preferido:* A coordinar\n`;
    mensaje += `🚚 *Zona de entrega:* ${pedidoForm.ciudad}\n\n`;
    mensaje += `¡Gracias por elegir Raízel! 🐕❤️`;

    const whatsappUrl = `https://wa.me/573108188723?text=${encodeURIComponent(mensaje)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              🐾 Hacer un Pedido Raízel
            </h1>
            <p className="text-gray-600">
              Alimentación 100% natural para tu mascota. Sin químicos ni conservantes.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            
            {/* Calculadora de Porciones */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center mb-4">
                <Calculator className="w-6 h-6 text-green-600 mr-2" />
                <h2 className="text-xl font-semibold">Calculadora de Porciones</h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Peso de tu mascota (kg)
                  </label>
                  <input
                    type="number"
                    value={pesoMascota}
                    onChange={(e) => setPesoMascota(e.target.value)}
                    placeholder="Ej: 15.5"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  />
                </div>
                
                <button
                  onClick={calcularPorcion}
                  className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Calcular Porción BARF
                </button>
                
                {porcionCalculada && (
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-green-800 font-semibold">
                      📊 Porción diaria recomendada: <span className="text-lg">{porcionCalculada}g</span>
                    </p>
                    <p className="text-sm text-green-600 mt-1">
                      Basado en 2.5% del peso corporal (estándar BARF)
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Información de Contacto */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center mb-4">
                <MessageCircle className="w-6 h-6 text-blue-600 mr-2" />
                <h2 className="text-xl font-semibold">Contacto Directo</h2>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="bg-green-100 p-2 rounded-lg mr-3">
                    📞
                  </div>
                  <div>
                    <p className="font-semibold">WhatsApp Business</p>
                    <p className="text-gray-600">+57 310 818 8723</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="bg-blue-100 p-2 rounded-lg mr-3">
                    📧
                  </div>
                  <div>
                    <p className="font-semibold">Email</p>
                    <p className="text-gray-600">contactoraizel@gmail.com</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="bg-purple-100 p-2 rounded-lg mr-3">
                    <MapPin className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-semibold">Ubicación</p>
                    <p className="text-gray-600">Subía, Cundinamarca</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="bg-orange-100 p-2 rounded-lg mr-3">
                    <Clock className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="font-semibold">Horario</p>
                    <p className="text-gray-600">Lun-Sáb 8AM-6PM</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Productos Disponibles */}
          <div className="bg-white rounded-lg shadow p-6 mt-8">
            <div className="flex items-center mb-6">
              <Package className="w-6 h-6 text-green-600 mr-2" />
              <h2 className="text-xl font-semibold">Productos Disponibles</h2>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              {productosRaizel.map(producto => (
                <div key={producto.id} className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-lg mb-2">{producto.name}</h3>
                  <p className="text-gray-600 text-sm mb-3">{producto.descripcion}</p>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Presentaciones:</h4>
                    {producto.presentaciones.map((pres, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <span className="text-sm">{pres.peso}</span>
                        <span className="font-semibold">${pres.precio.toLocaleString()}</span>
                        <button
                          onClick={() => agregarProducto(producto, pres)}
                          className="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700"
                        >
                          Agregar
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Formulario de Pedido */}
          <div className="bg-white rounded-lg shadow p-6 mt-8">
            <h2 className="text-xl font-semibold mb-6">Información de Entrega</h2>
            
            <form className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre completo *
                  </label>
                  <input
                    type="text"
                    value={pedidoForm.nombre}
                    onChange={(e) => setPedidoForm(prev => ({...prev, nombre: e.target.value}))}
                    placeholder="Tu nombre"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Teléfono *
                  </label>
                  <input
                    type="tel"
                    value={pedidoForm.telefono}
                    onChange={(e) => setPedidoForm(prev => ({...prev, telefono: e.target.value}))}
                    placeholder="300 123 4567"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dirección completa *
                </label>
                <input
                  type="text"
                  value={pedidoForm.direccion}
                  onChange={(e) => setPedidoForm(prev => ({...prev, direccion: e.target.value}))}
                  placeholder="Calle 123 #45-67 Apt 801"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ciudad
                </label>
                <select
                  value={pedidoForm.ciudad}
                  onChange={(e) => setPedidoForm(prev => ({...prev, ciudad: e.target.value}))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                >
                  <option value="Bogotá">Bogotá</option>
                  <option value="Subía">Subía</option>
                  <option value="Cota">Cota</option>
                  <option value="Chía">Chía</option>
                  <option value="Zipaquirá">Zipaquirá</option>
                  <option value="Otra">Otra ciudad</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Observaciones adicionales
                </label>
                <textarea
                  value={pedidoForm.observaciones}
                  onChange={(e) => setPedidoForm(prev => ({...prev, observaciones: e.target.value}))}
                  placeholder="Horario preferido, instrucciones especiales, info sobre tu mascota..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>
            </form>
          </div>

          {/* Resumen Pedido */}
          {pedidoForm.productos.length > 0 && (
            <div className="bg-green-50 rounded-lg p-6 mt-8">
              <h3 className="font-semibold text-lg mb-4">📋 Resumen del Pedido</h3>
              
              <div className="space-y-2 mb-4">
                {pedidoForm.productos.map((prod, index) => (
                  <div key={index} className="flex justify-between">
                    <span>{prod.nombre}</span>
                    <span className="font-semibold">${prod.precio.toLocaleString()}</span>
                  </div>
                ))}
              </div>
              
              <div className="border-t pt-2">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total:</span>
                  <span>${pedidoForm.productos.reduce((sum, p) => sum + p.precio, 0).toLocaleString()} COP</span>
                </div>
              </div>

              {porcionCalculada && (
                <div className="bg-white p-3 rounded mt-4">
                  <p className="text-sm text-gray-700">
                    💡 <strong>Recomendación:</strong> Para una mascota de {pesoMascota}kg, 
                    la porción diaria ideal es {porcionCalculada}g de BARF.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Botón WhatsApp */}
          <div className="text-center mt-8">
            <button
              onClick={generarMensajeWhatsApp}
              disabled={!pedidoForm.nombre || !pedidoForm.telefono || pedidoForm.productos.length === 0}
              className="bg-green-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-green-700 transition-colors disabled:bg-gray-400 flex items-center mx-auto"
            >
              <MessageCircle className="w-6 h-6 mr-2" />
              Enviar Pedido por WhatsApp
            </button>
            
            <p className="text-sm text-gray-600 mt-2">
              Se abrirá WhatsApp con tu pedido preformateado
            </p>
          </div>

          {/* Enlaces útiles */}
          <div className="bg-blue-50 rounded-lg p-6 mt-8">
            <h3 className="font-semibold mb-4">🔗 Enlaces Útiles</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <Link href="/calculadora" className="text-blue-600 hover:underline flex items-center">
                <Calculator className="w-4 h-4 mr-1" />
                Calculadora Porciones
              </Link>
              <Link href="/educacion" className="text-blue-600 hover:underline flex items-center">  
                📚 Educación BARF
              </Link>
              <Link href="/consejos" className="text-blue-600 hover:underline flex items-center">
                💡 Consejos y Tips
              </Link>
            </div>
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}




