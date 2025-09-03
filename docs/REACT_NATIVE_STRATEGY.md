# 🚀 Estrategia React Native para ManadaBook

## 📋 Resumen Ejecutivo

Este documento describe la estrategia para crear una aplicación React Native que consuma la API existente de ManadaBook, reutilizando la lógica de negocio y manteniendo sincronía entre la web y la app móvil.

## 🎯 Objetivos

1. **Reutilización de Lógica**: Aprovechar hooks, utils y API calls existentes
2. **Sincronía UI/UX**: Mantener consistencia entre web y móvil
3. **Desarrollo Eficiente**: Evitar duplicación de código
4. **Escalabilidad**: Arquitectura que permita crecimiento futuro

## 🏗️ Arquitectura Propuesta

### **Estructura del Proyecto React Native**

```
manadabook-mobile/
├── src/
│   ├── components/          # Componentes reutilizables
│   │   ├── common/         # Componentes base (Button, Input, etc.)
│   │   ├── pets/           # Componentes específicos de mascotas
│   │   ├── marketplace/    # Componentes del marketplace
│   │   └── moments/        # Componentes de momentos
│   ├── screens/            # Pantallas de la app
│   │   ├── auth/           # Login, Register
│   │   ├── feed/           # Feed principal
│   │   ├── pets/           # Gestión de mascotas
│   │   ├── marketplace/    # Tienda
│   │   ├── circles/        # Círculos/grupos
│   │   └── profile/        # Perfil de usuario
│   ├── hooks/              # Hooks reutilizables (desde web)
│   ├── services/           # API calls y lógica de negocio
│   ├── utils/              # Utilidades compartidas
│   ├── navigation/         # Configuración de navegación
│   ├── store/              # Estado global (Redux/Zustand)
│   └── types/              # Tipos TypeScript
├── assets/                 # Imágenes, iconos, fuentes
└── __tests__/             # Tests unitarios
```

## 🔄 Reutilización de Código

### **1. Hooks Reutilizables**

Los siguientes hooks del proyecto web pueden reutilizarse directamente:

```typescript
// ✅ REUTILIZABLES (con mínimas modificaciones)
- useAuth()           // Autenticación
- usePets()           // Gestión de mascotas
- useMoments()        // Momentos efímeros
- useCircles()        // Círculos/grupos
- useMarketplace()    // Marketplace
- useConversations()  // Mensajería
- useAds()            // Gestión de anuncios

// 🔧 REQUIEREN ADAPTACIÓN
- useResponsive()     // Adaptar para React Native
- useLocalStorage()   // Cambiar por AsyncStorage
```

### **2. Servicios API**

```typescript
// src/services/api.ts
// Reutilizar completamente la lógica de API calls
export class ManadaBookAPI {
  // Métodos existentes del proyecto web
  async getPets(filters?: PetFilters): Promise<Pet[]>
  async createMoment(data: MomentData): Promise<string>
  async joinCircle(circleId: string): Promise<void>
  // ... etc
}
```

### **3. Utilidades**

```typescript
// src/utils/
// Reutilizar completamente
- dateUtils.ts        // Formateo de fechas
- validation.ts       // Validaciones
- constants.ts        // Constantes de la app
- formatters.ts       // Formateo de datos
```

## 📱 Componentes Móviles

### **Componentes Base Reutilizables**

```typescript
// src/components/common/
export const Button = ({ title, onPress, variant }) => {
  // Lógica similar al web, pero con TouchableOpacity
};

export const Input = ({ placeholder, value, onChangeText }) => {
  // Lógica similar al web, pero con TextInput
};

export const Card = ({ children, style }) => {
  // Lógica similar al web, pero con View
};
```

### **Componentes Específicos**

```typescript
// src/components/pets/PetCard.tsx
export const PetCard = ({ pet, onPress }) => {
  // Reutilizar lógica del web, adaptar UI para móvil
  return (
    <TouchableOpacity onPress={onPress}>
      <Image source={{ uri: pet.avatar_url }} />
      <Text>{pet.name}</Text>
      <Text>{pet.species}</Text>
    </TouchableOpacity>
  );
};
```

## 🗂️ Estado Global

### **Redux Toolkit (Recomendado)**

```typescript
// src/store/slices/
export const petsSlice = createSlice({
  name: 'pets',
  initialState: {
    pets: [],
    loading: false,
    error: null
  },
  reducers: {
    setPets: (state, action) => {
      state.pets = action.payload;
    },
    // ... otros reducers
  }
});

// Reutilizar la misma lógica de estado del web
```

## 🧭 Navegación

### **React Navigation v6**

```typescript
// src/navigation/AppNavigator.tsx
const Stack = createNativeStackNavigator();

export const AppNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Feed" component={FeedScreen} />
      <Stack.Screen name="Pets" component={PetsScreen} />
      <Stack.Screen name="Marketplace" component={MarketplaceScreen} />
      <Stack.Screen name="Circles" component={CirclesScreen} />
      <Stack.Screen name="Moments" component={MomentsScreen} />
    </Stack.Navigator>
  );
};
```

## 🔧 Configuración Técnica

### **Dependencias Principales**

```json
{
  "dependencies": {
    "@react-navigation/native": "^6.1.0",
    "@react-navigation/stack": "^6.3.0",
    "@reduxjs/toolkit": "^1.9.0",
    "react-redux": "^8.0.0",
    "expo": "~49.0.0",
    "expo-image": "~1.3.0",
    "expo-camera": "~13.4.0",
    "expo-media-library": "~15.4.0",
    "expo-notifications": "~0.20.0",
    "@react-native-async-storage/async-storage": "1.18.0",
    "react-native-safe-area-context": "4.6.0"
  }
}
```

### **Configuración Expo**

```json
// app.json
{
  "expo": {
    "name": "ManadaBook",
    "slug": "manadabook-mobile",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#3b82f6"
    },
    "platforms": ["ios", "android"],
    "plugins": [
      "expo-camera",
      "expo-media-library",
      "expo-notifications"
    ]
  }
}
```

## 🔄 Sincronización Web-Móvil

### **1. API Unificada**

```typescript
// Mantener la misma API REST
// El proyecto web ya tiene todas las rutas necesarias:
// - /api/pets
// - /api/moments
// - /api/circles
// - /api/marketplace
// - /api/conversations
```

### **2. Estado Compartido**

```typescript
// Usar la misma estructura de datos
interface Pet {
  id: string;
  name: string;
  species: string;
  // ... mismos campos que el web
}

// Mismos tipos TypeScript en ambos proyectos
```

### **3. Funcionalidades Nativas**

```typescript
// src/services/native/
export class NativeFeatures {
  // Cámara para fotos de mascotas
  static async takePhoto(): Promise<string>
  
  // Notificaciones push
  static async requestPermissions(): Promise<boolean>
  
  // Geolocalización
  static async getCurrentLocation(): Promise<Location>
  
  // Compartir contenido
  static async shareContent(content: string): Promise<void>
}
```

## 📊 Plan de Migración

### **Fase 1: Setup y Autenticación (2 semanas)**
- [ ] Configurar proyecto Expo
- [ ] Implementar navegación básica
- [ ] Migrar sistema de autenticación
- [ ] Configurar estado global

### **Fase 2: Funcionalidades Core (4 semanas)**
- [ ] Migrar hooks de pets, moments, circles
- [ ] Implementar pantallas principales
- [ ] Integrar cámara y galería
- [ ] Configurar notificaciones push

### **Fase 3: Marketplace y Social (3 semanas)**
- [ ] Implementar marketplace
- [ ] Sistema de mensajería
- [ ] Gestión de anuncios
- [ ] Funcionalidades sociales

### **Fase 4: Pulimiento y Deploy (2 semanas)**
- [ ] Testing y debugging
- [ ] Optimización de rendimiento
- [ ] Preparación para stores
- [ ] Deploy a TestFlight/Play Console

## 🎨 Consideraciones de UI/UX

### **Diferencias Web vs Móvil**

```typescript
// Web: Hover states, click
// Móvil: Touch feedback, haptic feedback

// Web: Scroll infinito
// Móvil: Pull-to-refresh, infinite scroll optimizado

// Web: Modales
// Móvil: Bottom sheets, full screen modales

// Web: Sidebar navigation
// Móvil: Tab navigation, drawer
```

### **Componentes Adaptativos**

```typescript
// src/components/adaptive/
export const AdaptiveCard = ({ children, webProps, mobileProps }) => {
  const isWeb = Platform.OS === 'web';
  
  if (isWeb) {
    return <div {...webProps}>{children}</div>;
  }
  
  return <View {...mobileProps}>{children}</View>;
};
```

## 🚀 Ventajas de esta Estrategia

1. **Reutilización Máxima**: 70% del código de lógica reutilizable
2. **Consistencia**: Misma API, mismos tipos, misma lógica
3. **Mantenimiento**: Cambios en API se reflejan en ambas plataformas
4. **Escalabilidad**: Fácil agregar nuevas funcionalidades
5. **Performance**: Aprovecha capacidades nativas del móvil

## 📝 Próximos Pasos

1. **Crear repositorio** `manadabook-mobile`
2. **Configurar Expo** con las dependencias necesarias
3. **Migrar hooks** uno por uno, empezando por `useAuth`
4. **Implementar navegación** básica
5. **Crear componentes** base reutilizables
6. **Integrar API** existente
7. **Testing** en dispositivos reales

## 🔗 Enlaces Útiles

- [Expo Documentation](https://docs.expo.dev/)
- [React Navigation](https://reactnavigation.org/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [React Native Performance](https://reactnative.dev/docs/performance)

---

**Nota**: Esta estrategia permite mantener la sincronía entre web y móvil mientras aprovecha las capacidades nativas de cada plataforma. El proyecto web actual sirve como base sólida para la app móvil.
