# NeuroParque: Sistema de Gestión y Adecuación de Parques Inclusivos

Prototipo Frontend de alta fidelidad para la gestión y seguimiento del proceso de adecuación de parques públicos para personas neurodivergentes. Basado en el caso piloto del **Parque Cooper (Ensenada, Baja California)** y su modelo replicable para otros municipios y estados.

Repositorio oficial: [https://github.com/FRQ23/neuropark](https://github.com/FRQ23/neuropark)

---

## ⚡ Ejecución Rápida en Windows (1 Clic)

Para correr el proyecto en cualquier computadora con Windows:

1. **Doble clic en el archivo:**
   ```text
   iniciar.bat
   ```
2. El script detecta automáticamente Node.js, instala las dependencias de `npm` si es la primera vez que se ejecuta, abre tu navegador web predeterminado en **`http://localhost:3000`** e inicia el servidor de desarrollo Vite.

> **Requisito previo:** Tener instalado [Node.js](https://nodejs.org/) (versión 18 o superior). Si no lo tienes instalado, el script te avisará y te proporcionará el enlace de descarga gratuita.

También puedes ejecutarlo mediante PowerShell con:
```powershell
.\iniciar.ps1
```

---

## 💻 Ejecución Manual por Consola

Si prefieres usar la terminal de comandos:

```bash
# 1. Instalar dependencias
npm install

# 2. Iniciar el servidor local
npm run dev

# 3. Compilar y verificar TypeScript para producción
npm run build
```

La aplicación estará disponible en: **`http://localhost:3000/`**.

---

## 🔑 Credenciales de Prueba (Demo por Rol)

En la pantalla de inicio de sesión o utilizando la **barra de cambio rápido de rol** en la parte superior, puedes alternar entre cualquiera de los perfiles:

| Rol | Usuario Demo | Correo | Especialidad / Comité | Privilegios |
| :--- | :--- | :--- | :--- | :--- |
| **Administrador** | Ing. Laura Valenzuela | `admin@neuroparque.org` | Obras y Parques Públicos | Control total: Crear/editar parques, requisitos, catálogo de infraestructura y usuarios. |
| **Administrador** | Arq. Roberto Méndez | `gestor@neuroparque.org` | Infraestructura Urbana | Gestión de catálogos y vinculación de matriz. |
| **Comité (Educación)** | Mtra. Elena Gómez | `educacion@neuroparque.org` | Educación Especial (UABC) | Dictamen y validación de requisitos pedagógicos y motricidad. |
| **Comité (Psicología)** | Dra. Carmen Solís | `psicologia@neuroparque.org` | Psicología Sensorial | Dictamen y validación de bienestar emocional y señalética de crisis. |
| **Comité (Finanzas)** | Lic. Manuel Estrada | `finanzas@neuroparque.org` | Tesorería Municipal | Dictamen y validación de viabilidad presupuestal. |
| **Observador** | Sofía Navarro | `observador1@neuroparque.org` | Familias Neurodiversas | Solo lectura: Consulta de avances, tableros y horarios especiales. |
| **Observador** | Carlos Morales | `observador2@neuroparque.org` | Transparencia Ciudadana | Solo lectura: Supervisión ciudadana del cumplimiento. |

*Contraseña para todos los usuarios:* `password123` (o selecciona el usuario directamente en el banner superior).

---

## 🎨 Diseño y Arquitectura

- **Framework:** React 18 + Vite + TypeScript.
- **Estilos:** W3.CSS oficial, diseño completamente plano (sin tarjetas flotantes artificiales), bordes limpios de 1px (`#e5e7eb`), tipografía Raleway y biblioteca de iconos Font Awesome 4.7.
- **Tablas:** Estructura oficial W3Schools (`w3-table-all`, `w3-striped`, `w3-hoverable`) con celdas alineadas y centradas.
- **Persistencia:** Capa de datos mock desacoplada con persistencia en `localStorage` y botón de restauración a semilla inicial en *Mi Perfil*.
- **Navegación:** Barra superior responsiva con logo protegido anti-colisión, menú agrupado de Fases (`FASES ▾`) y botón de perfil anclado a la derecha.

---

## 📁 Estructura del Código

```text
software/
├── iniciar.bat                          # Script de 1 clic para Windows
├── start.bat                            # Alias de inicio para Windows
├── iniciar.ps1                          # Script para Windows PowerShell
├── index.html                           # Estructura base con W3.CSS, Raleway y Font Awesome
├── package.json                         # Dependencias y scripts
├── tsconfig.json                        # Configuración estricta de TypeScript
├── src/
│   ├── types/
│   │   └── index.ts                     # Definiciones de tipos (Park, Phase, Requirement, etc.)
│   ├── services/
│   │   ├── mockData.ts                  # Semilla inicial de datos (Parque Cooper, Ensenada)
│   │   ├── storage.ts                   # Persistencia en localStorage y reset
│   │   └── api.ts                       # Capa de servicio asíncrona simulada
│   ├── context/
│   │   ├── AuthContext.tsx              # Autenticación, roles y validación por especialidad
│   │   └── ToastContext.tsx             # Notificaciones toast accesibles
│   ├── components/
│   │   ├── layout/                      # AppLayout (navbar responsiva), RoleSwitcherBanner
│   │   ├── common/                      # Button, Badge, ProgressBar, Modal, Breadcrumbs
│   │   ├── phases/                      # PhaseHeader, RequirementItem, Modales de validación
│   │   ├── infrastructure/              # MatrixView (Áreas x Categorías) y ListView
│   │   └── schedules/                   # Módulo y modal de horarios adaptativos
│   ├── pages/
│   │   ├── LoginPage.tsx                # Acceso con selección rápida de rol
│   │   ├── ProfilePage.tsx              # Perfil de usuario y botón de restablecer datos
│   │   ├── DashboardPage.tsx            # Tablero con avance general y requisitos pendientes
│   │   ├── ParksPage.tsx                # Directorio de parques y clonación de plantillas
│   │   ├── ParkDetailPage.tsx           # Detalle del parque y fases secuenciales
│   │   ├── Phase1PermitsPage.tsx        # Fase 1: Permisos de gobierno y dictámenes
│   │   ├── Phase2InfrastructurePage.tsx # Fase 2: Matriz de equipamiento, áreas y colores mate
│   │   ├── Phase3SignagePage.tsx        # Fase 3: Señalética con pictogramas y acuerdos
│   │   ├── SchedulesPage.tsx            # Horarios especiales de baja estimulación
│   │   ├── AssociationsPage.tsx         # Red de asociaciones civiles aliadas
│   │   ├── TemplatesPage.tsx            # Plantillas replicables (Baja California vs. Sonora)
│   │   └── UserManagementPage.tsx       # Directorio de usuarios y comités (Admin)
│   ├── App.tsx                          # Enrutador principal
│   └── main.tsx                         # Punto de entrada de React
```
