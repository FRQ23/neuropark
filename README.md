# NeuroParque: Sistema de Gestión y Seguimiento de Adecuación de Parques Inclusivos para Personas Neurodivergentes

Prototipo Frontend de alta fidelidad basado en el caso de estudio del **Parque Cooper (Ensenada, Baja California)** y su modelo replicable para otros estados de la República Mexicana (por ejemplo, Sonora/Hermosillo).

El sistema integra de forma nativa la **plantilla de accesibilidad cognitiva (NeuroUX y W3C COGA)**, soporte para **dislexia (OpenDyslexic)**, **TDAH (regla de lectura visual y máscara de enfoque)**, y **sensibilidad sensorial (paleta de baja fatiga visual y reducción de estímulos)**.

---

## 🚀 Instrucciones de Ejecución Local

### Prerrequisitos
- Node.js (v18 o superior)
- npm (v9 o superior)

### Pasos para ejecutar:
```bash
# 1. Instalar dependencias
npm install

# 2. Iniciar el servidor de desarrollo Vite
npm run dev

# 3. Compilación para producción (validación TypeScript y CSS)
npm run build
```

La aplicación se ejecuta localmente en **`http://localhost:3000/`**.

---

## 🧠 Integración de Accesibilidad Cognitiva y NeuroUX (W3C COGA)

La interfaz cuenta con una implementación exhaustiva de directrices de accesibilidad cognitiva y del toolkit **NeuroUX**:

1. **Paleta Cromática de Baja Fatiga Visual:**
   - Evita el blanco puro (`#FFF`) y negro puro (`#000`) para mitigar el deslumbramiento y destellos.
   - Fondo en tono papel cálido (`--color-bg: #f8f7f4`), contenedores suaves (`#ffffff`), texto en grafito oscuro de alto contraste pero no agresivo (`--color-text: #22252a`) y acento azul accesible (`--color-accent: #1d6a96`).
   - Modo Oscuro Suave (`--color-bg: #181a1b`, `--color-surface: #222527`, `--color-text: #e1e3e6`).
   - Modo de Alto Contraste con refuerzo visual para baja visión.

2. **Soporte para Dislexia (OpenDyslexic):**
   - Integración de la tipografía **OpenDyslexic** con la base de las letras más pesada para evitar rotaciones y confusión en caracteres espejo (`b`, `d`, `p`, `q`).
   - Activación inmediata desde el botón en la barra superior o desde el panel NeuroAssist.

3. **Herramientas de Enfoque para TDAH y Dificultad de Seguimiento:**
   - **Regla de Lectura Visual (Reading Ruler):** Franja guía que acompaña suavemente la posición vertical del cursor del usuario para facilitar la lectura renglón por renglón sin perder la línea.
   - **Máscara de Enfoque (Focus Mask):** Atenúa las zonas superior e inferior de la pantalla, dejando una ventana nítida sobre el contenido de lectura activo.
   - **Chunking W3C COGA (Límite 65ch):** Control de amplitud que evita saltos de línea largos que desorientan al usuario.
   - **Texto Nunca Justificado:** Todo el texto está alineado a la izquierda (`text-align: left !important`) para prevenir los "ríos blancos" que confunden a personas con dislexia.

4. **Espaciado y Reducción Sensorial:**
   - Altura de línea generosa (`line-height: 1.7` base y `1.9` ampliada).
   - Separación entre letras (`letter-spacing: 0.03em` base / `0.06em` ampliada) y entre palabras (`word-spacing: 0.08em` base / `0.14em` ampliada).
   - Pausa total de animaciones y transiciones (`0.001ms`) respetando `prefers-reduced-motion` y con interruptor manual de bajo estímulo.
   - Foco visible reforzado con contorno evidente (`3px solid var(--color-focus)` con `offset: 3px`).

5. **Widget Interactivo NeuroAssist:**
   - Botón flotante accesible en la esquina inferior izquierda (`🧠 NeuroAssist (COGA)`) que despliega el panel de control con todos los interruptores adaptativos.

---

## 🔑 Credenciales de Acceso para Pruebas (Demo por Rol)

En la pantalla de login o en la **barra superior interactiva** puedes alternar entre cualquiera de estos usuarios con un solo clic:

| Rol | Usuario Demo | Correo | Especialidad / Alcance | Privilegios |
| :--- | :--- | :--- | :--- | :--- |
| **Administrador** | Ing. Laura Valenzuela | `admin@neuroparque.org` | Dirección de Obras | Control total: Crear/editar parques, áreas, categorías, requisitos, plantillas y usuarios. |
| **Administrador** | Arq. Roberto Méndez | `gestor@neuroparque.org` | Infraestructura Urbana | Control total de catálogos y vinculación en matriz. |
| **Comité (Educación)** | Mtra. Elena Gómez | `educacion@neuroparque.org` | Educación Especial (UABC) | Dictamen y validación de requisitos pedagógicos, motricidad y anticipación. |
| **Comité (Psicología)** | Dra. Carmen Solís | `psicologia@neuroparque.org` | Psicología Sensorial | Dictamen y validación de bienestar emocional, descompresión y señalética de crisis. |
| **Comité (Finanzas)** | Lic. Manuel Estrada | `finanzas@neuroparque.org` | Tesorería y Fondos | Dictamen y validación de presupuestos, compras de equipo y auditoría de egresos. |
| **Observador (Viewer)** | Sofía Navarro | `observador1@neuroparque.org` | Familias Neurodiversas | Solo lectura: Consulta de avances, tableros, fotos y horarios especiales. |
| **Observador (Viewer)** | Carlos Morales | `observador2@neuroparque.org` | Transparencia Ciudadana | Solo lectura: Supervisión de cumplimiento público. |

*Contraseña para todos los usuarios:* `password123` (o selecciona el usuario directamente en el banner superior).

---

## 📁 Estructura del Proyecto

```text
software/
├── index.html                           # Entrada HTML con fuentes Inter y OpenDyslexic (CDN)
├── package.json                         # Dependencias del proyecto
├── tsconfig.json                        # Configuración TypeScript estricta con alias @/
├── tailwind.config.js                   # Tokens de diseño y colores calmantes
├── postcss.config.js                    # PostCSS con Tailwind y Autoprefixer
├── src/
│   ├── types/
│   │   └── index.ts                     # Modelos TypeScript: User, Park, Phase, Requirement, etc.
│   ├── services/
│   │   ├── mockData.ts                  # Semilla de datos (Parque Cooper Ensenada, 3 fases, placeholders)
│   │   ├── storage.ts                   # Persistencia en localStorage y botón de reinicio
│   │   └── api.ts                       # Capa de servicio simulada con interfaces asíncronas
│   ├── context/
│   │   ├── AuthContext.tsx              # Autenticación, roles y validación por especialidad
│   │   ├── AccessibilityContext.tsx     # Contexto NeuroUX: OpenDyslexic, Reading Ruler, Focus Mask, Temas
│   │   └── ToastContext.tsx             # Feedback accesible (ARIA live regions)
│   ├── components/
│   │   ├── accessibility/
│   │   │   ├── ReadingRuler.tsx         # Regla visual que sigue el cursor para TDAH
│   │   │   ├── FocusMask.tsx            # Máscara atenuadora para evitar distracciones
│   │   │   └── NeuroAssistWidget.tsx    # Widget interactivo flotante de accesibilidad cognitiva
│   │   ├── common/                      # Button, Badge, Modal, ConfirmDialog, Input, Select, etc.
│   │   ├── layout/                      # AppLayout, Navbar, Sidebar responsivo, RoleSwitcherBanner
│   │   ├── phases/                      # RequirementItem, PhaseHeader, PhaseNavTabs, EvidenceGallery
│   │   ├── infrastructure/              # MatrixView (Áreas x Categorías), ListView filtrable, Modals
│   │   ├── schedules/                   # ScheduleModal con reglas y restricciones ambientales
│   │   ├── associations/                # AssociationCard, AssociationFormModal con filtros
│   │   └── parks/                       # CloneTemplateModal para replicar modelo a nuevos estados
│   ├── pages/
│   │   ├── LoginPage.tsx                # Inicio de sesión con acceso rápido para evaluadores
│   │   ├── ProfilePage.tsx              # Perfil de usuario y matriz de permisos por rol
│   │   ├── UserManagementPage.tsx       # Gestión y CRUD de usuarios y comités (Admin)
│   │   ├── DashboardPage.tsx            # Tablero: Estatus "Listo para abrir" bloqueado hasta el 100%
│   │   ├── ParksPage.tsx                # Directorio multi-parque y clonación desde plantilla
│   │   ├── ParkDetailPage.tsx           # Fases secuenciales y comités responsables asignados
│   │   ├── Phase1PermitsPage.tsx        # Fase 1: Checklist de permisos y licencias gubernamentales
│   │   ├── Phase2InfrastructurePage.tsx # Fase 2: Matriz (Áreas x Categorías x Color) y verificación física
│   │   ├── Phase3SignagePage.tsx        # Fase 3: Señalética inclusiva y señalética de emergencia
│   │   ├── SchedulesPage.tsx            # Horarios especiales (sin perros, sin ruido, colores mate)
│   │   ├── AssociationsPage.tsx         # CRUD de fundaciones aliadas con búsqueda y filtros
│   │   ├── TemplatesPage.tsx            # Biblioteca de plantillas estatales (B.C. vs. Sonora)
│   │   └── NotFoundPage.tsx             # Pantalla 404
│   ├── routes/
│   │   ├── AppRoutes.tsx                # Rutas y navegación protegida
│   │   └── ProtectedRoute.tsx           # Guardianes de ruta basados en roles
│   ├── App.tsx                          # Integración de Providers (QueryClient, Auth, Accessibility, Toast)
│   ├── main.tsx                         # Entrada React
│   └── index.css                        # CSS Boilerplate Neuroinclusivo COGA y NeuroUX
```

---

## ❓ Preguntas Abiertas para el Cliente

1. **Nombres oficiales de las Categorías de Neurodivergencia:**
   - *Situación actual:* En la reunión se mencionó que *"debe haber categorías para saber qué aparato o qué color se necesita"*, pero no se especificó la taxonomía técnica que adoptará el Comité (ej. TEA Grado 1/2/3, TDAH, Sensibilidad Vestibular, Híper/Hipo-reactividad sensorial).
   - *Solución en prototipo:* Se dejaron placeholders claramente etiquetados como *"Categoría de ejemplo"* y se habilitó la creación y edición libre por parte del Administrador. ¿Cuál es el catálogo oficial que adoptará el parque?

2. **Catálogo real de requisitos normativos por fase:**
   - *Situación actual:* Ni en la reunión ni en el documento se proporcionaron las fracciones arancelarias, normas oficiales mexicanas (NOMs) o reglamentos municipales exactos para Ensenada.
   - *Pregunta:* ¿Existen normativas específicas de Protección Civil o de la Ley de Inclusión de B.C. que deban precargarse de forma fija en la plantilla de Baja California?

3. **Alcance del módulo de Finanzas (Presupuesto y Costos):**
   - *Situación actual:* El cliente mencionó al especialista de finanzas dentro del comité validador, y el SRS incluye campos de presupuesto planeado vs. ejercido.
   - *Pregunta:* ¿El especialista de Finanzas solo requiere un check de validación y notas de suficiencia presupuestaria, o necesita un desglose contable de partidas, cotizaciones y facturación dentro de este mismo software?

4. **Usuarios finales adicionales además del Administrador y el Comité:**
   - *Situación actual:* En la reunión se habló de guardaparques y familias que asisten en los horarios especiales, y en el SRS se menciona un formulario de retroalimentación con código QR.
   - *Pregunta:* ¿Se prevé una vista pública para que los ciudadanos consulten en vivo si hoy el parque está en horario sensorial sin perros, o el sistema permanecerá de uso estrictamente interno para el comité de obra?
