export interface Product {
    id: string;
    name: string;
    description: string;
    image?: string;
    category: string;
    ingredients?: string[];
    benefits?: string[];
    price?: number; // Added for flat pricing if needed
    presentaciones: {
        peso: string;
        precio: number;
    }[];
}

export const PRODUCTS: Product[] = [
    {
        id: 'vital-barf-pollo',
        name: 'Vital BARF - Pollo',
        description: 'Alimento crudo biológicamente apropiado con vísceras y carne de pollo, coliflor, zanahoria, linaza, aceites naturales, sal marina y calcio.',
        category: 'BARF',
        ingredients: ['Vísceras de pollo', 'Carne de pollo', 'Coliflor', 'Zanahoria', 'Linaza', 'Aceites naturales', 'Sal marina', 'Calcio'],
        benefits: ['Alimento crudo natural', 'Mejora digestión', 'Pelo brillante', 'Energía natural', 'Huesos fuertes'],
        presentaciones: [
            { peso: '500g', precio: 8500 },
            { peso: '1kg', precio: 16000 }
        ]
    },
    {
        id: 'barf-res-2kg',
        name: 'Vital BARF Res (2kg)',
        category: 'BARF',
        description: 'Bandeja familiar de 2kg. Nutrición completa para perros grandes o familias multicaninas.',
        image: 'https://images.unsplash.com/photo-1589924691106-073b19f5538d?w=800&q=80',
        ingredients: ['Carne de res', 'Corazón', 'Hígado', 'Zanahoria', 'Espinaca'],
        benefits: ['Máxima energía', 'Desarrollo muscular', 'Ahorro familiar'],
        presentaciones: [
            { peso: '2kg', precio: 88000 }
        ]
    },
    // --- ACCESORIOS & BOUTIQUE (Tiendanube dropshipping) ---
    {
        id: 'acc-collar-led',
        name: 'Collar LED de Seguridad',
        category: 'Accesorios',
        description: 'Collar recargable con luz LED para paseos nocturnos seguros. Resistente al agua y ajustable.',
        image: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=800&q=80',
        ingredients: ['Nylon reforzado', 'Batería USB', 'LED alta visibilidad'],
        benefits: ['Seguridad nocturna', 'Resistente', 'Recargable'],
        presentaciones: [
            { peso: 'Talla Única', precio: 55000 }
        ]
    },
    {
        id: 'acc-juguete-dental',
        name: 'Juguete Dental Interactivo',
        category: 'Accesorios',
        description: 'Juguete de caucho natural que limpia los dientes mientras juegan. Se puede rellenar con snacks.',
        image: 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=800&q=80',
        ingredients: ['Caucho natural no tóxico'],
        benefits: ['Salud dental', 'Reduce ansiedad', 'Divertido'],
        presentaciones: [
            { peso: 'Estándar', precio: 42000 }
        ]
    },
    {
        id: 'acc-pechera-active',
        name: 'Pechera Ergonómica Active',
        category: 'Accesorios',
        description: 'Diseño ergonómico que evita tirones en el cuello. Material transpirable ideal para aventuras.',
        image: 'https://images.unsplash.com/photo-1544568100-847a948585b9?w=800&q=80',
        ingredients: ['Malla transpirable', 'Broches de seguridad', 'Anillas de acero'],
        benefits: ['Confort total', 'Control suave', 'Alta durabilidad'],
        presentaciones: [
            { peso: 'Ajustable S/M/L', precio: 125000 }
        ]
    },
    // --- DROPI WINNERS INTEGRATION ---
    {
        id: 'dropi-cepillo-vapor',
        name: 'Cepillo de Vapor 3 en 1 Pro',
        category: 'Accesorios',
        description: 'Limpia, masajea y elimina el pelo muerto con tecnología de vapor frío. Evita que el pelo vuele y deja el manto sedoso.',
        image: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=800&q=80',
        benefits: ['Elimina 99% pelo muerto', 'Masaje relajante', 'Sin mojar a la mascota'],
        presentaciones: [{ peso: 'Unidad', precio: 58000 }]
    },
    {
        id: 'dropi-fuente-sensor',
        name: 'Fuente de Agua Ultra-Silent con Sensor',
        category: 'Accesorios',
        description: 'Fuente transparente de alta tecnología. El sensor activa el flujo de agua cuando tu mascota se acerca, ahorrando energía y manteniendo el agua fresca.',
        image: 'https://images.unsplash.com/photo-1601758124510-52d02ddb7cbd?w=800&q=80',
        benefits: ['Agua siempre filtrada', 'Sensor de movimiento', 'Capacidad 2.5L'],
        presentaciones: [{ peso: 'Premium Kit', precio: 145000 }]
    },
    {
        id: 'dropi-cama-antifluido',
        name: 'Cama Ortopédica Antifluido',
        category: 'Accesorios',
        description: 'Base de lujo con bordes reforzados y tela resistente a líquidos. Fácil de limpiar y máxima comodidad para el descanso.',
        image: 'https://images.unsplash.com/photo-1591946614720-90a587da4a36?w=800&q=80',
        benefits: ['Tela repelente', 'Soporte articular', 'Cremallera lavable'],
        presentaciones: [
            { peso: 'Talla M', precio: 120000 },
            { peso: 'Talla L', precio: 165000 }
        ]
    },
    {
        id: 'dropi-maleta-viaje',
        name: 'Maleta Morral Explorer',
        category: 'Accesorios',
        description: 'Maleta panorámica para perros y gatos. Ventilación lateral y diseño ergonómico para viajar con estilo.',
        image: 'https://images.unsplash.com/photo-1583512603805-3cc6b41f3edb?w=800&q=80',
        benefits: ['Vista panorámica', 'Seguridad total', 'Apta para cabina avión'],
        presentaciones: [{ peso: 'Estándar', precio: 185000 }]
    },
    {
        id: 'dropi-chaleco-impermeable',
        name: 'Chaleco Impermeable Vital-Guard',
        category: 'Accesorios',
        description: 'Protección total contra lluvia y frío. Tallas grandes (XXL) disponibles para perros que no se detienen.',
        image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=800&q=80',
        benefits: ['100% Impermeable', 'Reflectivo nocturno', 'Fácil de poner'],
        presentaciones: [
            { peso: 'Talla XL', precio: 75000 },
            { peso: 'Talla XXL', precio: 85000 }
        ]
    },
    {
        id: 'dropi-dispensador-auto',
        name: 'Dispensador de Comida Programable',
        category: 'Accesorios',
        description: 'Alimentación automática y precisa. Controla las porciones incluso cuando no estás en casa.',
        image: 'https://images.unsplash.com/photo-1563460716884-18a8b27f7b30?w=800&q=80',
        benefits: ['Porciones exactas', 'Grabación de voz', 'Batería de respaldo'],
        presentaciones: [{ peso: 'Digital Pro', precio: 240000 }]
    },
    {
        id: 'vital-barf-res',
        name: 'Vital BARF - Res',
        description: 'Vísceras de res, coliflor, zanahoria, linaza, aceites naturales, sal marina, calcio y plantas digestivas.',
        category: 'BARF',
        ingredients: ['Vísceras de res', 'Coliflor', 'Zanahoria', 'Linaza', 'Aceites naturales', 'Sal marina', 'Calcio', 'Plantas digestivas'],
        benefits: ['Proteína de alta calidad', 'Digestión mejorada', 'Sistema inmune fuerte', 'Peso saludable', 'Minerales esenciales'],
        presentaciones: [
            { peso: '500g', precio: 9500 },
            { peso: '1kg', precio: 18000 }
        ]
    },
    {
        id: 'vital-barf-cordero',
        name: 'Vital BARF - Cordero',
        description: 'Alimento crudo con carne y vísceras de cordero, coliflor, zanahoria, linaza, aceites naturales, sal marina y calcio.',
        category: 'BARF',
        ingredients: ['Carne de cordero', 'Vísceras de cordero', 'Coliflor', 'Zanahoria', 'Linaza', 'Aceites naturales', 'Sal marina', 'Calcio'],
        benefits: ['Proteína de cordero', 'Fácil digestión', 'Rico en hierro', 'Ideal para perros sensibles', 'Sabor suave'],
        presentaciones: [
            { peso: '500g', precio: 12000 },
            { peso: '1kg', precio: 22000 }
        ]
    },
    {
        id: 'oat-meatballs',
        name: 'Albóndigas Oat-Crusted',
        description: 'Nuestra especialidad premium: albóndigas de carne seleccionada con una capa crujiente de avena orgánica.',
        category: 'Albóndigas',
        ingredients: ['Carne de res seleccionada', 'Avena orgánica en hojuelas', 'Zanahoria', 'Corazón de res', 'Aceite de coco'],
        benefits: ['Textura gourmet única', 'Rico en fibra natural', 'Energía de larga duración', 'Altamente palatable'],
        presentaciones: [
            { peso: 'Pack x6', precio: 15000 },
            { peso: 'Pack x12', precio: 28000 }
        ]
    },
    {
        id: 'choribarf',
        name: 'Choribarf',
        description: 'Chorizo BARF natural, ideal para premios y entrenamiento. Sin químicos ni conservantes.',
        category: 'Chorizos',
        ingredients: ['Vísceras frescas', 'Coliflor', 'Zanahoria', 'Linaza', 'Aceites naturales', 'Sal marina', 'Calcio'],
        benefits: ['Formato práctico', 'Digestión mejorada', 'Nutrición concentrada', 'Ingredientes naturales'],
        presentaciones: [
            { peso: 'Pack x4', precio: 12500 }
        ]
    },
    {
        id: 'helados-naturales',
        name: 'Helados para Mascotas',
        description: 'Refrescantes helados naturales con base de vísceras y frutas reales. Sin azúcar ni lácteos.',
        category: 'Helados',
        ingredients: ['Vísceras', 'Coliflor', 'Zanahoria', 'Frutas naturales (Plátano, Arándanos, Manzana)', 'Agua natural'],
        benefits: ['Refrescante', 'Sin químicos', 'Digestivo', 'Premio saludable'],
        presentaciones: [
            { peso: 'Individual', precio: 4500 },
            { peso: 'Pack x4', precio: 16000 }
        ]
    },
    {
        id: 'bandeja-higado',
        name: 'Bandeja Hígado de Res',
        description: 'Vísceras crudas de hígado de res en tajadas. Rico en hierro y vitaminas.',
        category: 'Vísceras',
        presentaciones: [
            { peso: '500g', precio: 7500 }
        ]
    }
];
