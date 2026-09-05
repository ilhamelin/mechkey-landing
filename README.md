# ✦ STRATA — Teclado Mecánico Modular

> **Experiencia web interactiva de hardware boutique** con *scrollytelling* 3D, síntesis de sonido en tiempo real y diseño editorial inspirado en los estándares de diseño de *Apple* y *Teenage Engineering*.

[![Next.js](https://img.shields.io/badge/Next.js-16.3-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61dafb?style=flat-square&logo=react)](https://react.dev/)
[![Three.js](https://img.shields.io/badge/Three.js-r180-black?style=flat-square&logo=three.js)](https://threejs.org/)
[![React Three Fiber](https://img.shields.io/badge/R3F-v9-white?style=flat-square)](https://r3f.docs.pmnd.rs/)
[![License](https://img.shields.io/badge/License-MIT-e8c97d?style=flat-square)](LICENSE)

---

## 🌟 Características Principales

### 1. 🌀 Scrollytelling 3D — Exploded View en Tiempo Real
- **Desensamble por Scroll**: El desplazamiento del usuario descompone el teclado en sus componentes internos capa a capa mediante curvas de aceleración cúbica suaves (`easeInOutCubic`).
- **PBR & Refracción Óptica**: Materiales físicos avanzados con transmisión de luz, dispersión e índice de refracción real (`MeshPhysicalMaterial`).
- **Partículas Cinemáticas (*Dust Motes*)**: Micro-destellos dorados y ambientales flotando en el espacio 3D para una atmósfera de render de estudio.
- **Rendimiento a 60 FPS**: Renderizado mediante mallas instanciadas (`InstancedMesh`) que agrupan docenas de teclas y switches en una sola llamada de dibujo (*draw call*).

### 2. ⌨️ Modelo 3D de Alta Fidelidad (Procedural Nativo)
- **Teclas Proporcionales (Layout 75%)**: Fila de funciones, teclas numéricas, alfanuméricas, barra espaciadora de 6.25u y Enter esculpido en acabado *Obsidian PBT* y acentos metálicos *Gold PVD*.
- **Switches Mecánicos Realistas (V2 Linear)**: Carcasa superior de policarbonato translúcido, vástago en cruz (`+` stem) rubí lineal y resorte helicoidal dorado visible en el interior.
- **Placa de Montaje (*Switch Plate*)**: Placa en latón anodizado con 8 pestañas de amortiguación *gasket mount* (aislamiento acústico).
- **PCB Audiófila con Puerto USB-C Real**: Sustrato verde oscuro con pistas doradas, microcontrolador central ARM Cortex MCU, matriz de LEDs SMD y conector hembra USB-C trasero.
- **Perilla Rotatoria CNC (*Rotary Encoder*)**: Perilla de volumen en la esquina superior derecha con cuerpo moleteado en diamante (*diamond-knurled*) y rotación continua.
- **Chasis Inferior con Barra de Peso de Latón**: Placa de contrapeso insertada en la base con acabado pulido reflectante (`metalness: 0.98`), emblema grabado láser y patas cónicas antideslizantes.

### 3. 🎧 Simulador Acústico con Web Audio API
- **Síntesis Procedural de Audio**: Sin archivos MP3 externos ni latencia de red. El sonido de cada switch se modela en vivo mediante transitorios de ruido filtrado y resonancias de frecuencia exponencial.
- **3 Perfiles Acústicos**:
  - **Thock**: Switch lineal V2 pre-lubricado (resonancia grave y profunda).
  - **Clack**: Switch táctil de 62g (impacto nítido y brillante).
  - **Creamy**: Amortiguación gasket con absorbente PORON.
- **Tipeo en Vivo**: Tipear cualquier tecla del teclado físico mientras se navega reproduce el sonido mecánico con micro-variaciones aleatorias de tono (±4%) para máxima autenticidad.
- **Widget Flotante**: Píldora con ecualizador animado, cambio de perfil y botón de prueba táctil.

### 4. 📱 Experiencia Móvil de Vanguardia (Responsive HUD)
- **HUD Flotante Glassmorphic**: En pantallas móviles, el modelo 3D toma el protagonismo a pantalla completa mientras la información de la capa activa se presenta en una elegante tarjeta flotante con desenfoque de fondo (*backdrop blur*).
- **Controlador de Cámara Adaptativo**: La cámara 3D aleja su distancia focal automáticamente en dispositivos móviles (`fov: 46, z: 7.8`) para asegurar que el teclado nunca se corte vertical ni horizontalmente.
- **Protección Anti-Overflow**: Arquitectura CSS con `overflow-x: clip` y meta-viewport optimizado que evita desbordamientos horizontales sin romper el comportamiento de `position: sticky`.

### 5. 📐 Micro-Detalles & Estética Técnica (*Teenage Engineering / Nothing*)
- **Badges Esquemáticos**: Cada especificación cuenta con su nomenclatura de laboratorio (ej. `[ 01 // ARCH ]`, `[ 02 // MECH ]`, `[ REV. 2.4 // HARDWARE SPEC ]`).
- **Cursor Dorado Magnético**: Cursor dual personalizado (punto + anillo lerp) con expansión dinámica al interactuar con botones y elementos interactivos.
- **Secuencia de Carga Cinemática**: Pantalla de presentación con barra de progreso y transición fluida.

---

## 🛠️ Stack Tecnológico

| Capa | Tecnología |
|---|---|
| **Framework** | [Next.js](https://nextjs.org/) (Pages Router) |
| **Librería UI** | [React](https://react.dev/) |
| **Gráficos 3D** | [Three.js](https://threejs.org/) & [React Three Fiber](https://r3f.docs.pmnd.rs/) |
| **Helpers 3D** | [@react-three/drei](https://github.com/pmndrs/drei) (RoundedBox, Sparkles, ContactShadows) |
| **Post-procesado** | [@react-three/postprocessing](https://github.com/pmndrs/react-postprocessing) (Bloom) |
| **Animaciones UI** | [Framer Motion](https://www.framer.com/motion/) |
| **Audio** | Web Audio API nativo (DSP procedural en tiempo real) |
| **Estilos** | Vanilla CSS modular con tokens de diseño y Glassmorphism |
| **Lenguaje** | TypeScript |

---

## 📂 Estructura del Proyecto

```
mechkey-landing/
├── public/
│   ├── favicon.ico
│   ├── models/            # Directorio preparado para modelos .glb externos
│   └── textures/          # Texturas y mapas HDR
├── src/
│   ├── components/
│   │   ├── 3d/
│   │   │   ├── KeyboardModel.tsx     # Modelo 3D procedural (teclas, switches, PCB, chasis)
│   │   │   └── KeyboardScene.tsx     # Escena R3F, iluminación, cámara y partículas
│   │   ├── sections/
│   │   │   ├── HeroSection.tsx       # Sección Hero con teclado CSS 3D y métricas
│   │   │   ├── ScrollytellingSection.tsx # Sticky viewport con desensamble por scroll
│   │   │   ├── SpecsSection.tsx      # Ficha técnica bento-grid con badges
│   │   │   └── CTASection.tsx        # Configurador de color y reserva anticipada
│   │   └── ui/
│   │       ├── CustomCursor.tsx      # Cursor magnético con retardo suave
│   │       ├── Navbar.tsx            # Barra de navegación con indicador activo
│   │       ├── PageLoader.tsx        # Intro cinemática de carga inicial
│   │       ├── Reveal.tsx            # Animaciones de entrada por intersección
│   │       └── SoundWidget.tsx       # Widget interactivo de perfil acústico
│   ├── lib/
│   │   ├── animation.ts              # Easing, interpolación y offsets de explosión 3D
│   │   └── sound.ts                  # Sintetizador procedural Web Audio API
│   ├── pages/
│   │   ├── _app.tsx                  # Viewport meta tags y estilos globales
│   │   ├── _document.tsx             # Fuentes tipográficas y metadatos SEO
│   │   └── index.tsx                 # Página principal
│   └── styles/
│       └── globals.css               # Sistema de diseño, paleta de colores y reset
├── package.json
└── tsconfig.json
```

---

## 🚀 Inicio Rápido

### Requisitos previos
- [Node.js](https://nodejs.org/) v18.0 o superior
- Gestor de paquetes `npm`, `yarn`, `pnpm` o `bun`

### Instalación

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/tu-usuario/strata-keyboard.git
   cd strata-keyboard
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Iniciar el servidor de desarrollo:**
   ```bash
   npm run dev
   ```

4. **Abrir en el navegador:**
   Accede a [http://localhost:3000](http://localhost:3000).

---

## 📦 Build de Producción

Para compilar y verificar el paquete optimizado para despliegue:

```bash
npm run build
npm run start
```

---

## 📄 Licencia

Este proyecto se distribuye bajo la licencia **MIT**. Consulta el archivo `LICENSE` para más detalles.

---

<div align="center">
  <sub>Diseñado con precisión e ingeniería sin compromisos • <strong>STRATA 2026</strong></sub>
</div>
