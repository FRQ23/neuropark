# NeuroParque: Sistema de Gestión y Seguimiento de Adecuación de Parques Inclusivos para Personas Neurodivergentes

Prototipo Frontend de alta fidelidad basado en el caso de estudio del **Parque Cooper (Ensenada, Baja California)** y su modelo replicable para otros estados de la República Mexicana (por ejemplo, Sonora/Hermosillo).

El sistema permite a un comité multidisciplinario (**Educación**, **Psicología**, **Finanzas** y **Administración/Gobierno**) dar seguimiento puntual, fase por fase, para asegurar que el parque cumpla todos los requisitos antes de abrir sus puertas al público de manera segura y regulada.

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

La aplicación se ejecutará localmente en **`http://localhost:3000/`**.

---

## 🔑 Credenciales de Acceso para Pruebas (Demo por Rol)

El sistema incluye autenticación simulada con control de acceso por roles (RBAC) y validación por especialidad técnica. En la pantalla de login o en la **barra superior interactiva** puedes alternar entre cualquiera de estos usuarios con un solo clic:

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
├── index.html                     # Entrada HTML con fuentes accesibles (Inter) y meta etiquetas
├── package.json                   # Dependencias: React 18, Vite, Tailwind CSS, TanStack Query, React Router, Lucide
├── tsconfig.json                  # Configuración TypeScript estricta con alias @/
├── tailwind.config.js             # Paleta de colores calmantes, tokens de bajo estímulo y modo alto contraste
├── postcss.config.js              # Pipeline PostCSS con Tailwind y Autoprefixer
├── src/
│   ├── types/
│   │   └── index.ts               # Modelos TypeScript: User, Park, Phase, Requirement, Area, Infrastructure, etc.
│   ├── services/
│   │   ├── mockData.ts            # Semilla con Parque Cooper Ensenada, 3 fases ordenadas y placeholders
│   │   ├── storage.ts             # Persistencia sincronizada en localStorage y botón de reinicio
│   │   └── api.ts                 # Capa de servicio simulada (interfaz reemplazable por backend real)
│   ├── context/
│   │   ├── AuthContext.tsx        # Control de sesión, conmutador rápido y validación por especialidad
│   │   ├── AccessibilityContext.tsx # Toggles de alto contraste, tamaño de texto (A, A+, A++) y bajo estímulo
│   │   └── ToastContext.tsx       # Notificaciones de feedback accesibles (ARIA live)
│   ├── components/
│   │   ├── common/                # Botones accesibles (mín. 44x44px), modales, confirm dialogs, badges, inputs
│   │   ├── layout/                # AppLayout, Navbar, Sidebar responsivo, RoleSwitcherBanner
│   │   ├── phases/                # RequirementItem, PhaseHeader, PhaseNavTabs, EvidenceGallery, Modals
│   │   ├── infrastructure/        # MatrixView (Áreas x Categorías), ListView filtrable, Modals de catálogos
│   │   ├── schedules/             # ScheduleCard y ScheduleModal con reglas ambientales
│   │   ├── associations/          # AssociationCard, AssociationFormModal con filtros y búsqueda
│   │   └── parks/                 # CloneTemplateModal para replicar modelo a nuevos estados
│   ├── pages/
│   │   ├── LoginPage.tsx          # Inicio de sesión con acceso rápido para evaluadores
│   │   ├── ProfilePage.tsx        # Perfil del usuario, desglose de permisos y botón para reiniciar demo
│   │   ├── UserManagementPage.tsx # CRUD de usuarios y asignación de roles/especialidades (Admin)
│   │   ├── DashboardPage.tsx      # Tablero general: Candado "Listo para abrir" bloqueado hasta 100%
│   │   ├── ParksPage.tsx          # Directorio multi-parque y clonación desde plantilla
│   │   ├── ParkDetailPage.tsx     # Fases secuenciales y comités responsables asignados
│   │   ├── Phase1PermitsPage.tsx  # Fase 1: Checklist de permisos y licencias gubernamentales
│   │   ├── Phase2InfrastructurePage.tsx # Fase 2: Matriz (Áreas x Categorías x Color) y validación física
│   │   ├── Phase3SignagePage.tsx  # Fase 3: Señalética inclusiva y señalética de emergencia
│   │   ├── SchedulesPage.tsx      # Horarios especiales (sin perros, sin ruido, colores mate)
│   │   ├── AssociationsPage.tsx   # CRUD de fundaciones aliadas con búsqueda y filtros
│   │   ├── TemplatesPage.tsx      # Biblioteca de plantillas estatales (Baja California vs. Sonora)
│   │   └── NotFoundPage.tsx       # Pantalla 404
│   ├── routes/
│   │   ├── AppRoutes.tsx          # Definición de rutas protegidas y públicas
│   │   └── ProtectedRoute.tsx     # Guardianes de ruta basados en roles
│   ├── App.tsx                    # Integración de Providers (QueryClient, Auth, Accessibility, Toast)
│   ├── main.tsx                   # Punto de montaje React
│   └── index.css                  # Estilos base, escala de tipografía accesible y modo alto contraste
```

---

## 🧩 Módulos y Funcionalidades Desarrolladas

1. **Dashboard y Estado "Listo para Abrir":**
   - Muestra el avance consolidado por fase de desarrollo (Fase 1, Fase 2, Fase 3).
   - **Candado de Seguridad:** El indicador *"Listo para abrir"* permanece en estatus **Bloqueado** con aviso preventivo hasta que el 100% de los requisitos cuenten con dictamen favorable de los comités.
   - Lista prioritaria de requisitos pendientes con acceso directo a dictamen.

2. **Fase 1 – Lineamientos y Permisos:**
   - Checklist de trámites oficiales (uso de suelo, dictamen de protección civil, suficiencia presupuestal).
   - Registro de notas de auditoría técnica y validación por especialista correspondiente.

3. **Fase 2 – Infraestructura y Equipamiento:**
   - **Vista de Matriz Cruzada:** Cruce bidimensional entre **Áreas del Parque** y **Categorías de Neurodivergencia**.
   - **Vista de Lista Detallada:** Filtros combinados por Área, Categoría y Estado del cambio.
   - **Verificación Física de Cambio:** Checkbox interactivo obligatorio (`¿Se realizó el cambio físico?`) tal como se acordó en la reunión (*"validar que sí o sí esté o que sí o sí haya cambiado"*).
   - Catálogo administrable de áreas, categorías técnicas, aparatos especiales y especificaciones cromáticas mate.

4. **Fase 3 – Señalética y Comunidad:**
   - Requerimientos de letreros en pictogramas, mapas táctiles hápticos y convenios comunitarios.
   - **Señalética de Emergencia para Neurodivergencias:** Protocolo visual para guiar hacia la zona de calma ante episodios de sobrecarga sensorial.

5. **Horarios Especiales (Ambiente Controlado):**
   - Configuración de franjas horarias prioritarias por parque.
   - Reglas ambientales obligatorias: prohibición de perros y mascotas, control de decibeles, cese de podadoras/maquinaria e iluminación cálida indirecta.

6. **Asociaciones y Contactos (CRUD Completo):**
   - Directorio de fundaciones afiliadas para expansión y respaldo institucional.
   - Búsqueda en tiempo real y filtrado por alcance geográfico (Local, Estatal, Nacional, Internacional).

7. **Evidencia Fotográfica (Antes y Después):**
   - Carga local de fotografías para constatar el estado previo ("Antes") frente a la adecuación realizada ("Después"), persistidas en base de datos local y visualizables en galería con vista ampliada (lightbox).

8. **Plantillas y Replicabilidad Estatal:**
   - Capacidad del Administrador para clonar una plantilla con fases y requisitos precargados a un nuevo parque (ej. Sonora / Hermosillo para parques construidos desde cero frente a Baja California para adaptación de parques preexistentes).

9. **Accesibilidad y Diseño Sensorial:**
   - Paleta de colores suaves (verde salvia, arena y pizarra) para evitar saturación visual y destellos.
   - Respeto a `prefers-reduced-motion` sin animaciones agresivas.
   - Controles visibles en el encabezado para **Alto Contraste** y **Escala de Texto (A, A+, A++)**.
   - Objetivos táctiles con altura mínima de 44px e indicadores de foco perceptibles (WCAG AA).

---

## 🛠️ Lista de Componentes y Capas Simuladas (Mock Data Layer)

- **Almacenamiento:** Todo el estado de la aplicación reside en una capa de servicios (`src/services/api.ts`) que lee y escribe de forma asíncrona sobre `localStorage`, garantizando persistencia entre recargas del navegador.
- **Evidencia fotográfica:** Se procesa en el cliente utilizando *Data URLs* (Base64) generadas con el API de `FileReader`, permitiendo adjuntar fotos reales desde la computadora del usuario y visualizarlas inmediatamente.
- **Autenticación:** Simulada en memoria/storage mediante `AuthContext`, con soporte para conmutación inmediata de roles sin necesidad de cerrar sesión repetidamente.
- **Restablecimiento de datos:** En la barra superior y en el perfil de usuario se incluye un botón para volver a la semilla original con un solo clic.

---

## ❓ Preguntas Abiertas para el Cliente

Con base en la revisión comparada entre la especificación general del SRS y la transcripción de la reunión con el cliente, se identificaron los siguientes puntos que requieren definición formal con los directivos:

1. **Nombres oficiales de las Categorías de Neurodivergencia:**
   - *Situación actual:* En la reunión se mencionó que *"debe haber categorías para saber qué aparato o qué color se necesita"*, pero no se especificó la taxonomía técnica que adoptará el Comité (ej. TEA Grado 1/2/3, TDAH, Sensibilidad Vestibular, Híper/Hipo-reactividad sensorial).
   - *Solución en prototipo:* Se dejaron placeholders claramente etiquetados como *"Categoría de ejemplo"* y se habilitó la creación y edición libre por parte del Administrador. ¿Cuál es el catálogo oficial o clasificación clínica/pedagógica que adoptará el parque?

2. **Catálogo real de requisitos normativos por fase:**
   - *Situación actual:* Ni en la reunión ni en el documento se proporcionaron las fracciones arancelarias, normas oficiales mexicanas (NOMs) o reglamentos municipales exactos para Ensenada.
   - *Pregunta:* ¿Existen normativas específicas de Protección Civil o de la Ley de Inclusión de B.C. que deban precargarse de forma fija en la plantilla de Baja California?

3. **Alcance del módulo de Finanzas (Presupuesto y Costos):**
   - *Situación actual:* El cliente mencionó al especialista de finanzas dentro del comité validador, y el SRS incluye campos de presupuesto planeado vs. ejercido.
   - *Pregunta:* ¿El especialista de Finanzas solo requiere un check de validación y notas de suficiencia presupuestaria, o necesita un desglose contable de partidas, cotizaciones y facturación dentro de este mismo software?

4. **Usuarios finales adicionales además del Administrador y el Comité:**
   - *Situación actual:* En la reunión se habló de guardaparques y familias que asisten en los horarios especiales, y en el SRS se menciona un formulario de retroalimentación con código QR.
   - *Pregunta:* ¿Se prevé una vista pública para que los ciudadanos consulten en vivo si hoy el parque está en horario sensorial sin perros, o el sistema permanecerá de uso estrictamente interno para el comité de obra?
