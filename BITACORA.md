# 📜 Bitácora Técnica de Desarrollo - EcoTrack AI (Vibe Coding)

**Autor:** Tomas Felipe Ramirez Alvarez  
**Proyecto Integrador:** De la Idea a la Realidad con Vibe Coding  
**Aplicación:** EcoTrack AI - Calculadora de Huella de Carbono Inteligente  
**Enfoque:** Intent-First & AI-Orchestrated Development  
**Estado:** MVP Construido, Verificado y Listo para Despliegue  

---

## 🟢 Fase 1: Concepción e Intención (Prompt Studio)

### 1. Intent Clarification
El objetivo principal fue construir un Producto Mínimo Viable (MVP) que elimine la fricción en el cálculo de huella de carbono para PyMEs y negocios urbanos. En lugar de formularios complejos de decenas de campos, el usuario describe sus operaciones diarias en lenguaje natural.

### 2. Prompts Clave de Generación
- **UI & Design System:** *"Diseña una interfaz web React moderna con estética Premium Dark Mode, Glassmorphism, bordes sutiles y acentos en verde azulado (Teal/Emerald). Incluye orbes con gradientes flotantes y animaciones fluidas."*
- **Motor de Cálculo NLP:** *"Implementa una función en JavaScript que analice texto libre en español/inglés, identifique cantidades y categorías (electricidad en kWh, camionetas, diésel, gas natural, vuelos) y aplique factores de emisión del IPCC AR6."*
- **Componentes:** *"Crea componentes modulares (ChatInput, ResultCard con medidor circular y equivalencias, HistoryPanel con localStorage) limpios y accesibles."*

---

## 🟡 Fase 2: Construcción e Iteración (Vibe Coding Loop)

### Iteración 1: Estructura y Estilos Globales
- **Acción:** Creación de `package.json`, `vite.config.js`, `index.html` y `src/index.css`.
- **Decisión de Diseño:** Sistema de diseño basado en variables CSS nativas (`--bg-dark`, `--primary`, `--glass-bg`, etc.) sin dependencias de frameworks CSS pesados.

### Iteración 2: Motor NLP y Factores de Emisión
- **Archivo:** [carbonAnalysis.js](file:///C:/Users/Isabel/Downloads/ProyectoIntegradorDe-la-Idea-a-la-Realidad-con-Vibe-Coding/src/api/carbonAnalysis.js)
- **Factores IPCC AR6 Utilizados:**
  - Electricidad: `0.000233 tCO₂e / kWh`
  - Camioneta/Furgón: `0.025 tCO₂e / unidad`
  - Auto/Carro: `0.012 tCO₂e / unidad`
  - Gas Natural: `0.00202 tCO₂e / m³`
  - Diésel: `0.00268 tCO₂e / litro`
  - Gasolina: `0.00232 tCO₂e / litro`
  - Vuelos: `0.090 tCO₂e / hora`

### Iteración 3: Interfaz de Usuario y Componentes React
- **ChatInput:** Entradas multilínea con autosize, chips de ejemplo rápido, contador de caracteres y atajos de teclado (`Ctrl+Enter`).
- **ResultCard:** Indicador visual de nivel de emisión (Muy bajo, Bajo, Moderado, Alto, Muy alto), desglose interactivo y tarjetas de equivalencia práctica (árboles requeridos, km en auto, cargas de celular).
- **HistoryPanel:** Persistencia automática mediante `localStorage` para consultar análisis anteriores al instante.

---

## 🔴 Fase 3: Depuración y Registro de Errores (Debugging Log)

| Error Detectado | Causa Raíz | Solución Aplicada |
| :--- | :--- | :--- |
| `npm install` falló parcialmente en PowerShell por permisos de archivo en sandbox | Bloqueo sutil de ES Modules al escribir archivos mediante redirecciones de shell | Uso de escritura estructurada vía tool nativo `write_to_file` |
| Expresión regular no capturaba números escritos en palabras ("dos camionetas") | El parser solo procesaba dígitos numéricos | Expansión del mapa de palabras `WORD_NUMS` (`un`, `dos`, `tres`, `one`, `two`, etc.) |
| Pérdida de historial al recargar la página | Falta de sincronización de estado inicial | Implementación de `localStorage` con fallback seguro en `App.jsx` |

---

## 🔵 Fase 4: Verificación y Compilación

Ejecución del comando de compilación para producción:
```bash
npm run build
```

**Resultado:**
- **Transformación:** 39 módulos procesados sin errores ni advertencias.
- **Bundle Dist:**
  - `dist/index.html` (0.83 kB)
  - `dist/assets/index-CIcgnq6m.css` (14.43 kB)
  - `dist/assets/index-DcQ1caf_.js` (158.57 kB)
- **Tiempo de Build:** 4.95s.

---

## 🚀 Entregables y Pasos para Despliegue (Vercel / Netlify)

### 1. Repositorio de Código
El proyecto está completamente estructurado con la siguiente arquitectura:
- [src/App.jsx](file:///C:/Users/Isabel/Downloads/ProyectoIntegradorDe-la-Idea-a-la-Realidad-con-Vibe-Coding/src/App.jsx)
- [src/api/carbonAnalysis.js](file:///C:/Users/Isabel/Downloads/ProyectoIntegradorDe-la-Idea-a-la-Realidad-con-Vibe-Coding/src/api/carbonAnalysis.js)
- [src/components/ChatInput.jsx](file:///C:/Users/Isabel/Downloads/ProyectoIntegradorDe-la-Idea-a-la-Realidad-con-Vibe-Coding/src/components/ChatInput.jsx)
- [src/components/ResultCard.jsx](file:///C:/Users/Isabel/Downloads/ProyectoIntegradorDe-la-Idea-a-la-Realidad-con-Vibe-Coding/src/components/ResultCard.jsx)
- [src/components/HistoryPanel.jsx](file:///C:/Users/Isabel/Downloads/ProyectoIntegradorDe-la-Idea-a-la-Realidad-con-Vibe-Coding/src/components/HistoryPanel.jsx)
- [vercel.json](file:///C:/Users/Isabel/Downloads/ProyectoIntegradorDe-la-Idea-a-la-Realidad-con-Vibe-Coding/vercel.json)

### 2. Pasos para Publicar en Vercel
1. Subir la carpeta del proyecto a GitHub.
2. Ir a [Vercel.com](https://vercel.com) e importar el repositorio.
3. El comando de build (`npm run build`) y el directorio de salida (`dist`) se detectan automáticamente.
4. Presionar **Deploy**.

### 3. Guion Sugerido para la Grabación del Demo (Video / Loom)
1. **Introducción (15s):** Presentar **EcoTrack AI** y explicar el concepto de Vibe Coding (construcción basada en la intención mediante IA).
2. **Demostración Práctica (45s):**
   - Hacer clic en uno de los ejemplos (ej: *"5 camionetas de reparto y 200kWh de luz"*).
   - Presionar **Calcular huella**.
   - Mostrar cómo se renderiza el resultado con el nivel de impacto, el desglose en kg CO₂e y las equivalencias prácticas.
   - Probar una segunda consulta personalizada.
   - Mostrar cómo el historial guarda ambas consultas.
3. **Conclusión (15s):** Resumir cómo el flujo de Vibe Coding permitió pasar de la idea al MVP funcional en minutos.
