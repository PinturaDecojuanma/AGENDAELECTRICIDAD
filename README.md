# ElectroExpert Pro - Agenda Técnica de Mantenimiento

**ElectroExpert Pro** es una aplicación web progresiva (PWA) diseñada para facilitar la gestión diaria de técnicos electricistas y personal de mantenimiento en entornos hoteleros e industriales. Funciona como una herramienta integral que combina una agenda de trabajo, un registro de averías, una biblioteca de esquemas y un manual técnico de consulta.

## 🚀 Funcionalidades Principales

### 1. Agenda y Planificación
- **Calendario Mensual:** Visualización interactiva para navegar entre fechas.
- **Plan Diario:** Muestra las tareas específicas asignadas o registradas para el día seleccionado.
- **Seguridad:** Recordatorio visual permanente de las "5 Reglas de Oro" de la seguridad eléctrica.

### 2. Gestión de Averías (Tareas)
- **Registro de Incidencias:** Permite crear, editar y eliminar tareas de mantenimiento.
- **Detalles Técnicos:** Cada tarea incluye título, categoría (Clima, ACS, Iluminación, etc.), nivel de severidad, descripción del problema y solución aplicada.
- **Evidencia Fotográfica:** Capacidad para adjuntar imágenes a las tareas para documentar el antes/después.
- **Búsqueda Inteligente:** Filtrado en tiempo real por texto (título, zona o diagnóstico).
- **Exportación:** Generación de reportes en PDF (`jspdf`) con el historial de intervenciones.

### 3. Biblioteca de Esquemas
- **Repositorio Digital:** Almacenamiento de esquemas eléctricos y planos de maquinaria.
- **Captura In-Situ:** Integración con la cámara del dispositivo para digitalizar esquemas físicos al momento.
- **Categorización:** Organización por tipos de sistema (HVAC, Bombas, Cuadros Generales, etc.).

### 4. Manual Técnico Integrado
- **Consulta Normativa:** Versión digital interactiva basada en el REBT (Reglamento Electrotécnico para Baja Tensión).
- **Herramientas de Cálculo:** Tablas de secciones de cable, amperajes máximos y fórmulas de potencia.
- **Guía de Diagnóstico:** "Flashcards" con soluciones rápidas a problemas comunes (saltos de diferencial, fallos de motores, etc.).

### 5. Interfaz y Usabilidad
- **Modo Oscuro:** Activado por defecto para mejorar la visibilidad en entornos técnicos (cuadros eléctricos, salas de máquinas).
- **Diseño Responsivo:** Adaptado para funcionar fluidamente en móviles, tablets y escritorio.

---

## 🛠️ Aspectos Técnicos

La aplicación está construida utilizando tecnologías web estándar sin necesidad de backend, lo que permite su funcionamiento offline una vez cargada.

### Estructura del Código (JavaScript OOP)
El código (`script.js`) está organizado mediante Programación Orientada a Objetos:

- **Modelos:**
  - `Task`: Define la estructura de una tarea de mantenimiento.
  - `Schematic`: Define la estructura de un esquema técnico.

- **Servicios:**
  - `StorageService`: Gestiona la persistencia de datos utilizando `localStorage` del navegador.

- **Gestores (Managers):**
  - `CalendarManager`: Controla la lógica del calendario y la selección de fechas.
  - `SchematicsManager`: Gestiona la visualización y el filtrado de la galería de esquemas.
  - `ManualManager`: Controla la navegación y búsqueda dentro del manual técnico.

- **Controlador Principal:**
  - `App`: Clase central que inicializa la aplicación, gestiona los eventos del DOM, modales y la coordinación entre los distintos gestores.

### Tecnologías
- **HTML5 / CSS3:** Estructura semántica y estilos modernos con variables CSS.
- **JavaScript (ES6+):** Lógica del cliente.
- **Librerías:**
  - `Lucide`: Para la iconografía vectorial.
  - `jsPDF`: Para la generación de reportes en PDF.

## 📦 Instalación y Uso

1. **Ejecución:** No requiere instalación de servidor. Basta con abrir el archivo `index.html` en un navegador web moderno.
2. **Datos Iniciales:** La primera vez que se abre, la aplicación genera automáticamente un conjunto de datos de prueba (Seed Data) para demostrar su funcionalidad.
3. **Persistencia:** Todos los datos creados (tareas, esquemas) se guardan en el navegador del usuario, por lo que no se pierden al recargar la página.

---
*Desarrollado para optimizar el flujo de trabajo del mantenimiento técnico.*