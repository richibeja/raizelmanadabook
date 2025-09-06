'use client';

import React, { useState } from 'react';
import { Shield, FileText, Users, Camera, Heart, MessageCircle, AlertTriangle, CheckCircle } from 'lucide-react';

export default function PoliticasPage() {
  const [activeSection, setActiveSection] = useState('terminos');

  const sections = [
    {
      id: 'terminos',
      title: 'Términos de Uso',
      icon: <FileText className="w-6 h-6" />,
      content: (
        <div className="space-y-6">
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">Última actualización: {new Date().toLocaleDateString('es-ES')}</h3>
            <p className="text-blue-700">Estos términos rigen el uso de la plataforma Raízel y sus servicios.</p>
          </div>

          <section>
            <h3 className="text-xl font-bold text-gray-800 mb-4">1. Aceptación de Términos</h3>
            <p className="text-gray-700 mb-4">
              Al acceder y usar Raízel, aceptas estar sujeto a estos Términos de Uso y todas las leyes y regulaciones aplicables. 
              Si no estás de acuerdo con alguno de estos términos, no debes usar este sitio.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-bold text-gray-800 mb-4">2. Descripción del Servicio</h3>
            <p className="text-gray-700 mb-4">
              Raízel es una plataforma social especializada en mascotas que incluye:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li><strong>ManadaBook:</strong> Red social para dueños de mascotas</li>
              <li><strong>ManadaShorts:</strong> Plataforma de videos cortos de mascotas</li>
              <li><strong>Marketplace:</strong> Tienda de productos para mascotas</li>
              <li><strong>Herramientas:</strong> Calculadoras, recetas y guías de cuidado</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-bold text-gray-800 mb-4">3. Uso Aceptable</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2 flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Uso Permitido
                </h4>
                <ul className="text-green-700 space-y-1 text-sm">
                  <li>• Compartir contenido relacionado con mascotas</li>
                  <li>• Interactuar de manera respetuosa</li>
                  <li>• Comprar productos para mascotas</li>
                  <li>• Usar herramientas educativas</li>
                  <li>• Crear contenido original y apropiado</li>
                </ul>
              </div>
              <div className="bg-red-50 p-4 rounded-lg">
                <h4 className="font-semibold text-red-800 mb-2 flex items-center">
                  <AlertTriangle className="w-5 h-5 mr-2" />
                  Uso Prohibido
                </h4>
                <ul className="text-red-700 space-y-1 text-sm">
                  <li>• Contenido inapropiado o ofensivo</li>
                  <li>• Spam o contenido comercial no autorizado</li>
                  <li>• Acoso o intimidación</li>
                  <li>• Violación de derechos de autor</li>
                  <li>• Actividades ilegales</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-bold text-gray-800 mb-4">4. Contenido del Usuario</h3>
            <p className="text-gray-700 mb-4">
              Al subir contenido a Raízel, garantizas que:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Tienes los derechos necesarios sobre el contenido</li>
              <li>El contenido no viola ninguna ley o derecho de terceros</li>
              <li>El contenido es apropiado para la plataforma</li>
              <li>No contiene información falsa o engañosa</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-bold text-gray-800 mb-4">5. Privacidad y Datos</h3>
            <p className="text-gray-700 mb-4">
              Respetamos tu privacidad y protegemos tus datos personales de acuerdo con nuestra 
              <button 
                onClick={() => setActiveSection('privacidad')}
                className="text-blue-600 hover:text-blue-800 underline"
              >
                Política de Privacidad
              </button>.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-bold text-gray-800 mb-4">6. Modificaciones</h3>
            <p className="text-gray-700 mb-4">
              Nos reservamos el derecho de modificar estos términos en cualquier momento. 
              Los cambios entrarán en vigor inmediatamente después de su publicación en la plataforma.
            </p>
          </section>
        </div>
      )
    },
    {
      id: 'privacidad',
      title: 'Política de Privacidad',
      icon: <Shield className="w-6 h-6" />,
      content: (
        <div className="space-y-6">
          <div className="bg-green-50 border-l-4 border-green-400 p-4">
            <h3 className="text-lg font-semibold text-green-800 mb-2">Compromiso con tu Privacidad</h3>
            <p className="text-green-700">Protegemos y respetamos tu información personal.</p>
          </div>

          <section>
            <h3 className="text-xl font-bold text-gray-800 mb-4">1. Información que Recopilamos</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Información Personal</h4>
                <ul className="text-gray-700 space-y-1 text-sm">
                  <li>• Nombre y apellidos</li>
                  <li>• Dirección de correo electrónico</li>
                  <li>• Información de perfil</li>
                  <li>• Datos de mascotas</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Información de Uso</h4>
                <ul className="text-gray-700 space-y-1 text-sm">
                  <li>• Contenido que compartes</li>
                  <li>• Interacciones en la plataforma</li>
                  <li>• Preferencias y configuraciones</li>
                  <li>• Datos de navegación</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-bold text-gray-800 mb-4">2. Cómo Usamos tu Información</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Proporcionar y mejorar nuestros servicios</li>
              <li>Personalizar tu experiencia en la plataforma</li>
              <li>Comunicarnos contigo sobre actualizaciones</li>
              <li>Garantizar la seguridad de la plataforma</li>
              <li>Cumplir con obligaciones legales</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-bold text-gray-800 mb-4">3. Compartir Información</h3>
            <p className="text-gray-700 mb-4">
              No vendemos, alquilamos ni compartimos tu información personal con terceros, excepto:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Con tu consentimiento explícito</li>
              <li>Para cumplir con la ley</li>
              <li>Para proteger nuestros derechos</li>
              <li>Con proveedores de servicios confiables</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-bold text-gray-800 mb-4">4. Tus Derechos</h3>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-blue-800 font-semibold mb-2">Tienes derecho a:</p>
              <ul className="text-blue-700 space-y-1 text-sm">
                <li>• Acceder a tu información personal</li>
                <li>• Corregir datos inexactos</li>
                <li>• Eliminar tu cuenta y datos</li>
                <li>• Portabilidad de datos</li>
                <li>• Oponerte al procesamiento</li>
              </ul>
            </div>
          </section>
        </div>
      )
    },
    {
      id: 'comunidad',
      title: 'Normas de la Comunidad',
      icon: <Users className="w-6 h-6" />,
      content: (
        <div className="space-y-6">
          <div className="bg-purple-50 border-l-4 border-purple-400 p-4">
            <h3 className="text-lg font-semibold text-purple-800 mb-2">Construyendo una Comunidad Positiva</h3>
            <p className="text-purple-700">Ayúdanos a mantener un ambiente seguro y respetuoso para todos.</p>
          </div>

          <section>
            <h3 className="text-xl font-bold text-gray-800 mb-4">1. Respeto y Tolerancia</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Trata a todos los miembros con respeto y amabilidad</li>
              <li>No toleramos el acoso, la intimidación o el discurso de odio</li>
              <li>Respeta las diferencias de opinión y experiencia</li>
              <li>Mantén un tono constructivo en las discusiones</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-bold text-gray-800 mb-4">2. Contenido Apropiado</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2">Contenido Apropiado</h4>
                <ul className="text-green-700 space-y-1 text-sm">
                  <li>• Fotos y videos de mascotas</li>
                  <li>• Consejos de cuidado animal</li>
                  <li>• Experiencias personales</li>
                  <li>• Preguntas educativas</li>
                  <li>• Contenido inspirador</li>
                </ul>
              </div>
              <div className="bg-red-50 p-4 rounded-lg">
                <h4 className="font-semibold text-red-800 mb-2">Contenido Prohibido</h4>
                <ul className="text-red-700 space-y-1 text-sm">
                  <li>• Contenido violento o gráfico</li>
                  <li>• Spam o publicidad no autorizada</li>
                  <li>• Información médica no verificada</li>
                  <li>• Contenido sexual o inapropiado</li>
                  <li>• Información personal de terceros</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-bold text-gray-800 mb-4">3. Moderación y Reportes</h3>
            <p className="text-gray-700 mb-4">
              Nuestro equipo de moderación revisa el contenido reportado y toma las siguientes acciones:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li><strong>Advertencia:</strong> Para violaciones menores</li>
              <li><strong>Eliminación:</strong> De contenido inapropiado</li>
              <li><strong>Suspensión temporal:</strong> Para violaciones repetidas</li>
              <li><strong>Baneo permanente:</strong> Para violaciones graves</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-bold text-gray-800 mb-4">4. Cómo Reportar</h3>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <p className="text-yellow-800 font-semibold mb-2">Si encuentras contenido inapropiado:</p>
              <ol className="text-yellow-700 space-y-1 text-sm list-decimal list-inside">
                <li>Haz clic en el botón de reporte (⚠️)</li>
                <li>Selecciona el tipo de violación</li>
                <li>Proporciona detalles adicionales si es necesario</li>
                <li>Nuestro equipo revisará el reporte</li>
              </ol>
            </div>
          </section>
        </div>
      )
    },
    {
      id: 'contenido',
      title: 'Política de Contenido',
      icon: <Camera className="w-6 h-6" />,
      content: (
        <div className="space-y-6">
          <div className="bg-orange-50 border-l-4 border-orange-400 p-4">
            <h3 className="text-lg font-semibold text-orange-800 mb-2">Directrices para Contenido</h3>
            <p className="text-orange-700">Guías específicas para crear y compartir contenido en Raízel.</p>
          </div>

          <section>
            <h3 className="text-xl font-bold text-gray-800 mb-4">1. Contenido de Mascotas</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Prioriza el bienestar y la seguridad de las mascotas</li>
              <li>No compartas contenido que muestre maltrato animal</li>
              <li>Respeta la privacidad de las mascotas y sus dueños</li>
              <li>Incluye descripciones útiles y educativas</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-bold text-gray-800 mb-4">2. Derechos de Autor</h3>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-blue-800 font-semibold mb-2">Solo comparte contenido que:</p>
              <ul className="text-blue-700 space-y-1 text-sm">
                <li>• Has creado tú mismo</li>
                <li>• Tienes permiso para usar</li>
                <li>• Está bajo licencia libre</li>
                <li>• No infringe derechos de terceros</li>
              </ul>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-bold text-gray-800 mb-4">3. Etiquetado y Hashtags</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Usa hashtags relevantes y descriptivos</li>
              <li>Evita el spam de hashtags</li>
              <li>Incluye información útil en las descripciones</li>
              <li>Etiqueta apropiadamente el tipo de mascota</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-bold text-gray-800 mb-4">4. Contenido Comercial</h3>
            <p className="text-gray-700 mb-4">
              Para contenido comercial o promocional:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Debe estar claramente marcado como promocional</li>
              <li>Debe cumplir con las regulaciones publicitarias</li>
              <li>No debe ser engañoso o falso</li>
              <li>Debe proporcionar valor a la comunidad</li>
            </ul>
          </section>
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Shield className="w-8 h-8 text-blue-600 mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Políticas de Uso</h1>
                <p className="text-gray-600">Términos, privacidad y normas de la comunidad</p>
              </div>
            </div>
            <div className="text-sm text-gray-500">
              Última actualización: {new Date().toLocaleDateString('es-ES')}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <nav className="space-y-2">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center space-x-3 ${
                    activeSection === section.id
                      ? 'bg-blue-100 text-blue-800 border-l-4 border-blue-500'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {section.icon}
                  <span className="font-medium">{section.title}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm p-8">
              {sections.find(s => s.id === activeSection)?.content}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
