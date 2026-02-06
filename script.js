/**
 * ElectroExpert Pro - Professional Maintenance Agenda
 * Comprehensive OOP Implementation
 */

// --- Models ---

class Task {
    constructor({ id, title, description, category, severity, solution, image, date, timestamp }) {
        this.id = id || Date.now().toString();
        this.title = title;
        this.description = description;
        this.category = category || 'otros';
        this.severity = severity || 'medium';
        this.solution = solution || '';
        this.image = image || null;
        this.date = date || new Date().toISOString().split('T')[0]; // YYYY-MM-DD
        this.timestamp = timestamp || new Date().toLocaleString();
    }
}

class Schematic {
    constructor({ id, title, category, img, description = "" }) {
        this.id = id || Date.now().toString() + Math.random().toString(36).substr(2, 5);
        this.title = title;
        this.category = category;
        this.img = img;
        this.description = description;
    }
}

// --- Persistence ---

class StorageService {
    static TASKS_KEY = 'ee_tasks';
    static SCHEMATICS_KEY = 'ee_user_schematics';
    static SETTINGS_KEY = 'ee_settings';

    static getTasks() {
        const data = localStorage.getItem(this.TASKS_KEY);
        return data ? JSON.parse(data).map(t => new Task(t)) : [];
    }

    static saveTasks(tasks) {
        localStorage.setItem(this.TASKS_KEY, JSON.stringify(tasks));
    }

    static getUserSchematics() {
        const data = localStorage.getItem(this.SCHEMATICS_KEY);
        return data ? JSON.parse(data).map(s => new Schematic(s)) : [];
    }

    static saveUserSchematics(schematics) {
        localStorage.setItem(this.SCHEMATICS_KEY, JSON.stringify(schematics));
    }
}

// --- Managers ---

class CalendarManager {
    constructor(onDateSelect) {
        this.currentDate = new Date();
        this.selectedDate = new Date();
        this.onDateSelect = onDateSelect;

        this.monthDisplay = document.getElementById('current-month-year');
        this.calendarBody = document.getElementById('calendar-body');

        this.init();
    }

    init() {
        document.getElementById('prevMonth').addEventListener('click', () => this.changeMonth(-1));
        document.getElementById('nextMonth').addEventListener('click', () => this.changeMonth(1));
        this.render();
    }

    changeMonth(delta) {
        this.currentDate.setMonth(this.currentDate.getMonth() + delta);
        this.render();
    }

    render() {
        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();

        const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
        this.monthDisplay.textContent = `${monthNames[month]} ${year}`;

        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        this.calendarBody.innerHTML = '';

        // Adjust for Monday start (0 is Sunday)
        let emptyDays = firstDay === 0 ? 6 : firstDay - 1;

        for (let i = 0; i < emptyDays; i++) {
            this.calendarBody.appendChild(document.createElement('div'));
        }

        const today = new Date();

        for (let d = 1; d <= daysInMonth; d++) {
            const dayEl = document.createElement('div');
            dayEl.className = 'cal-day';
            dayEl.textContent = d;

            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

            if (d === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
                dayEl.classList.add('today');
            }

            if (dateStr === this.selectedDate.toISOString().split('T')[0]) {
                dayEl.classList.add('selected');
            }

            dayEl.onclick = () => {
                this.selectedDate = new Date(year, month, d);
                this.render();
                this.onDateSelect(dateStr);
            };

            this.calendarBody.appendChild(dayEl);
        }
    }
}

class SchematicsManager {
    constructor() {
        this.container = document.getElementById('schematics-grid');
        this.allSchematics = this.initSchematics();
    }

    initSchematics() {
        let saved = StorageService.getUserSchematics();
        if (saved.length === 0) {
            // First run: migrate defaults to storage
            const defaults = [
                new Schematic({ title: "Cuadro Clima General (Chillers)", category: "clima-hvac", img: "https://circuitoelectrico.com/wp-content/uploads/esquema-cuadro-electrico-vivienda-basica.jpg" }),
                new Schematic({ title: "Grupo Presión ACS - Benidorm Center", category: "acs-calderas", img: "https://ventageneradores.net/blog/wp-content/uploads/2022/10/esquema-conexion-resistencias-trifasicas.jpg" }),
                new Schematic({ title: "Automatismo Piscina / SPA Cloro", category: "spa-piscina", img: "https://images.squarespace-cdn.com/content/v1/568972c7a12f442f4ec3d9e4/1495047863577-9ST3Q2X1G9Y6C4F1G9O1/Esquema+cuadro+piscina.png" }),
                new Schematic({ title: "Arranque Extractores Lavandería", category: "cocina-ind", img: "https://www.areatecnologia.com/electricidad/img/arranque_estrella_triangulo.jpg" }),
                new Schematic({ title: "Distribución Planta 1-5 (Cuadros)", category: "cuadros-gral", img: "https://luzmart.es/wp-content/uploads/cuadro-electrico-vivienda-esquema.jpg" }),
                new Schematic({ title: "Cuadro General SPA / Wellness", category: "spa-piscina", img: "https://descubre.tiendafotovoltaica.es/wp-content/uploads/2019/12/Esquema-Portero-Electronico.jpg" }),
                new Schematic({ title: "Instalación Bomba de Incendios", category: "emergencia", img: "https://luzmart.es/wp-content/uploads/esquema-luces-emergencia.jpg" }),
                new Schematic({ title: "Circuito Cocinas Planta Baja", category: "cocina-ind", img: "https://circuitoelectrico.com/wp-content/uploads/esquemas-instalaciones-enlace-unifilar.jpg" }),
                new Schematic({ title: "Control Clima Lobby & Recepción", category: "clima-hvac", img: "https://www.coolfy.net/wp-content/uploads/diagrama-conexion-aire-acondicionado-inverter.jpg" }),
                new Schematic({ title: "Cuadro Maquinaria Ascensores", category: "otros", img: "https://www.bibliocad.com/wp-content/uploads/2020/07/diagrama-electrico-unifilar-de-un-hotel-nuevo.jpg" })
            ];
            StorageService.saveUserSchematics(defaults);
            return defaults;
        }
        return saved;
    }

    render(filter = "") {
        this.container.innerHTML = '';
        const filtered = this.allSchematics.filter(s =>
            s.title.toLowerCase().includes(filter.toLowerCase()) ||
            s.category.toLowerCase().includes(filter.toLowerCase())
        );

        filtered.forEach(s => {
            const el = document.createElement('div');
            el.className = 'schema-card';
            el.innerHTML = `
                <div class="schema-img" onclick="window.open('${s.img}', '_blank')" title="Ver en grande">
                    <img src="${s.img}" alt="${s.title}" onerror="this.src='https://placehold.co/400x300?text=Sin+Imagen'">
                </div>
                <div class="schema-info">
                    <h4>${s.title}</h4>
                    <span class="badge ${s.category}">${s.category.replace('-', ' ').toUpperCase()}</span>
                </div>
                <div class="schema-actions">
                    <button class="btn btn-icon" onclick="app.editSchematic('${s.id}', true)" title="Sustituir con foto"><i data-lucide="camera"></i></button>
                    <button class="btn btn-icon" onclick="app.editSchematic('${s.id}')" title="Editar datos"><i data-lucide="edit-2"></i></button>
                    <button class="btn btn-icon" onclick="app.deleteSchematic('${s.id}')" title="Borrar"><i data-lucide="trash-2"></i></button>
                </div>
            `;
            this.container.appendChild(el);
        });
        lucide.createIcons();
    }

    addUserSchematic(data) {
        const id = data.id || null;
        if (id) {
            const idx = this.allSchematics.findIndex(s => s.id === id);
            this.allSchematics[idx] = new Schematic(data);
        } else {
            this.allSchematics.unshift(new Schematic(data));
        }
        StorageService.saveUserSchematics(this.allSchematics);
        this.render();
    }

    deleteUserSchematic(id) {
        this.allSchematics = this.allSchematics.filter(s => s.id !== id);
        StorageService.saveUserSchematics(this.allSchematics);
        this.render();
    }
}

class ManualManager {
    constructor() {
        this.navLinks = document.querySelectorAll('.nav-item[data-section]');
        this.articles = document.querySelectorAll('.manual-article');
        this.searchInput = document.getElementById('manual-search');
        this.init();
    }

    init() {
        this.navLinks.forEach(link => {
            link.onclick = () => {
                const section = link.dataset.section;
                this.switchSection(section);
            };
        });

        if (this.searchInput) {
            this.searchInput.oninput = (e) => this.handleSearch(e.target.value);
        }

        // Initial state: show whatever is marked as active or the first section
        const activeLink = document.querySelector('.manual-nav .nav-item.active') || this.navLinks[0];
        if (activeLink && activeLink.dataset.section) {
            this.switchSection(activeLink.dataset.section);
        }
    }

    switchSection(sectionId) {
        this.navLinks.forEach(l => l.classList.remove('active'));
        this.articles.forEach(a => {
            a.classList.remove('active');
            a.style.display = ''; // Reset display from search
        });

        const targetLink = document.querySelector(`.manual-nav [data-section="${sectionId}"]`);
        const targetArticle = document.getElementById(sectionId);

        if (targetLink) targetLink.classList.add('active');
        if (targetArticle) targetArticle.classList.add('active');

        lucide.createIcons(); // Ensure icons in manual are rendered
    }

    handleSearch(query) {
        query = query.toLowerCase();

        if (!query) {
            // Restore normal view if search is empty
            const activeLink = document.querySelector('.manual-nav .nav-item.active');
            if (activeLink) {
                this.switchSection(activeLink.dataset.section);
            }
            return;
        }

        this.articles.forEach(article => {
            const text = article.innerText.toLowerCase();
            if (text.includes(query)) {
                article.style.display = 'block';
                article.classList.add('active'); // Ensure classes match search results
            } else {
                article.style.display = 'none';
                article.classList.remove('active');
            }
        });
    }
}

class App {
    constructor() {
        this.tasks = StorageService.getTasks();
        if (this.tasks.length === 0) this.seedData();

        this.calendar = new CalendarManager((date) => this.filterDailyAgenda(date));
        this.schematics = new SchematicsManager();
        this.manual = new ManualManager();
        this.currentViewDate = new Date().toISOString().split('T')[0];

        this.init();
    }

    seedData() {
        const sampleTasks = [
            { title: "Hab 101 - Fuga Agua AC", description: "Bandeja condensador obstruida.", category: "clima", severity: "medium", solution: "Limpieza con nitrógeno a presión.", date: new Date().toISOString().split('T')[0] },
            { title: "Cocina - Revisión Hornos", description: "El horno 2 no calienta uniforme.", category: "cocina", severity: "high", solution: "Sustitución resistencia inferior defectuosa.", date: new Date().toISOString().split('T')[0] },
            { title: "Piscina - Ajuste pH/Cloro", description: "Niveles fuera de rango.", category: "piscina", severity: "low", solution: "Recalibración de sondas y adición de minorador.", date: new Date().toISOString().split('T')[0] },
            { title: "Calentador Central - Error E04", description: "Presostato no activa.", category: "calentador", severity: "critical", solution: "Limpieza de venturi y tubos de silicona.", date: new Date().toISOString().split('T')[0] },
            { title: "Hab 202 - Luces Led Parpadeo", description: "Driver en mal estado.", category: "iluminacion", severity: "low", solution: "Cambiado driver 12V 50W.", date: new Date().toISOString().split('T')[0] },
            { title: "Cuadro Garaje - Diferencial 01", description: "Disparo intempestivo.", category: "otros", severity: "medium", solution: "Localizada derivación en motor extractor.", date: new Date().toISOString().split('T')[0] },
            { title: "Recepción - Toma Datos", description: "Sin conexión internet.", category: "otros", severity: "medium", solution: "Crimpad@ de nuevo conector RJ45.", date: new Date().toISOString().split('T')[0] },
            { title: "Zonas Comunes - Farolas", description: "Vandalismo farola 4.", category: "iluminacion", severity: "medium", solution: "Reposición de cristal y lámpara sodio.", date: new Date().toISOString().split('T')[0] },
            { title: "Lavandería - Secadora 3", description: "No gira tambor.", category: "otros", severity: "high", solution: "Cambio de correa de transmisión.", date: new Date().toISOString().split('T')[0] },
            { title: "Gimnasio - Cinta Correr", description: "Error sobrecarga.", category: "otros", severity: "low", solution: "Lubricación de tapadera y ajuste tensión.", date: new Date().toISOString().split('T')[0] }
        ];

        this.tasks = sampleTasks.map(t => new Task(t));
        StorageService.saveTasks(this.tasks);
    }

    init() {
        this.renderAll();
        this.bindEvents();
        this.schematics.render();
        lucide.createIcons();

        // Dark mode default
        document.body.classList.add('dark-mode');
    }

    bindEvents() {
        // Tab system (scoped to top-nav)
        const navItems = document.querySelectorAll('.top-nav .nav-item');
        navItems.forEach(item => {
            item.onclick = (e) => {
                const tab = item.dataset.tab;
                document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
                document.querySelectorAll('.top-nav .nav-item').forEach(n => n.classList.remove('active'));

                document.getElementById(`tab-${tab}`).classList.add('active');
                item.classList.add('active');
            };
        });

        // Search tasks
        document.getElementById('search').oninput = (e) => {
            const val = e.target.value.toLowerCase();
            const filtered = this.tasks.filter(t =>
                t.title.toLowerCase().includes(val) ||
                t.description.toLowerCase().includes(val) ||
                t.category.toLowerCase().includes(val)
            );
            this.renderFaultsGrid(filtered);
        };

        // Search schematics
        const searchSchematics = document.getElementById('search-schematics');
        if (searchSchematics) {
            searchSchematics.oninput = (e) => {
                this.schematics.render(e.target.value);
            };
        }

        // Modal tasks
        document.getElementById('btn-add-fault').onclick = () => this.showModal();
        document.getElementById('btn-quick-task').onclick = () => this.showModal();
        document.querySelector('.btn-close-modal').onclick = () => this.hideModal();

        document.getElementById('fault-form').onsubmit = (e) => {
            e.preventDefault();
            this.handleSaveTask();
        };

        // Modal schematics
        const btnAddSchematic = document.getElementById('btn-add-schematic');
        if (btnAddSchematic) {
            btnAddSchematic.onclick = () => {
                document.getElementById('schematic-id').value = '';
                document.getElementById('schematic-modal-title').textContent = 'Capturar Nuevo Esquema';
                document.getElementById('modal-schematic').classList.remove('hidden');
                document.getElementById('schematic-form').reset();
                document.getElementById('schema-preview').classList.add('hidden');
            };
        }

        // Camera trigger helper
        const btnCamera = document.getElementById('btn-trigger-camera');
        if (btnCamera) {
            btnCamera.onclick = () => document.getElementById('schema-image').click();
        }

        const btnCloseSchematic = document.querySelector('.btn-close-schematic');
        if (btnCloseSchematic) {
            btnCloseSchematic.onclick = () => {
                document.getElementById('modal-schematic').classList.add('hidden');
            };
        }

        document.getElementById('schematic-form').onsubmit = (e) => {
            e.preventDefault();
            this.handleSaveSchematic();
        };

        // Image preview for schematic
        document.getElementById('schema-image').onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (ev) => {
                    const preview = document.getElementById('schema-preview');
                    preview.innerHTML = `<img src="${ev.target.result}">`;
                    preview.classList.remove('hidden');
                };
                reader.readAsDataURL(file);
            }
        };

        // Image preview for tasks
        document.getElementById('fault-image').onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (ev) => {
                    const preview = document.getElementById('image-preview');
                    preview.innerHTML = `<img src="${ev.target.result}">`;
                    preview.classList.remove('hidden');
                };
                reader.readAsDataURL(file);
            }
        };

        // Theme
        document.getElementById('theme-toggle').onclick = () => {
            const isDark = document.body.classList.toggle('dark-mode');
            const icon = document.getElementById('theme-icon');
            icon.setAttribute('data-lucide', isDark ? 'sun' : 'moon');
            lucide.createIcons();
        };

        // PDF
        document.getElementById('btn-export-pdf').onclick = () => this.exportPDF();
    }

    renderAll() {
        this.renderFaultsGrid(this.tasks);
        this.filterDailyAgenda(this.currentViewDate);
    }

    renderFaultsGrid(tasksToRender) {
        const grid = document.getElementById('faults-grid');
        grid.innerHTML = '';
        tasksToRender.forEach(t => {
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <div class="card-header">
                    <span class="badge sev-${t.severity}">${t.severity}</span>
                    <small>${t.date}</small>
                </div>
                <h3>${t.title}</h3>
                <p style="font-size: 0.85rem; margin: 0.5rem 0; opacity: 0.8;">${t.description}</p>
                ${t.image ? `<div class="card-img" style="margin: 0.5rem 0;"><img src="${t.image}" style="width:100%; border-radius:8px;"></div>` : ''}
                <div style="background: rgba(235, 168, 52, 0.1); padding: 0.75rem; border-radius: 8px; font-size: 0.85rem; border-left: 2px solid var(--primary);">
                    <strong>🔧 Solución:</strong> ${t.solution || 'Pendiente'}
                </div>
                <div style="display:flex; justify-content: flex-end; gap: 0.5rem; margin-top: 1rem;">
                    <button class="btn btn-icon" onclick="app.deleteTask('${t.id}')"><i data-lucide="trash-2"></i></button>
                    <button class="btn btn-icon" onclick="app.editTask('${t.id}')"><i data-lucide="edit-3"></i></button>
                </div>
            `;
            grid.appendChild(card);
        });
        lucide.createIcons();
    }

    filterDailyAgenda(dateStr) {
        this.currentViewDate = dateStr;
        document.getElementById('selected-date-text').textContent = dateStr;
        const dailyTasks = this.tasks.filter(t => t.date === dateStr);
        const listContainer = document.getElementById('daily-agenda-list');
        listContainer.innerHTML = '';

        if (dailyTasks.length === 0) {
            listContainer.innerHTML = '<p style="text-align:center; color:gray; font-size: 0.85rem;">No hay tareas programadas para este día.</p>';
            return;
        }

        dailyTasks.forEach(t => {
            const item = document.createElement('div');
            item.className = 'daily-task-item';
            item.innerHTML = `
                <div class="task-info">
                    <h4>${t.title}</h4>
                    <p>${t.category.toUpperCase()} • ${t.severity}</p>
                </div>
                <i data-lucide="${t.solution ? 'check-circle' : 'circle'}" style="color: ${t.solution ? 'var(--accent)' : 'gray'}"></i>
            `;
            listContainer.appendChild(item);
        });
        lucide.createIcons();
    }

    showModal(taskId = null) {
        const modal = document.getElementById('modal');
        const form = document.getElementById('fault-form');
        form.reset();
        document.getElementById('fault-id').value = '';
        document.getElementById('image-preview').classList.add('hidden');

        if (taskId) {
            const t = this.tasks.find(x => x.id === taskId);
            document.getElementById('fault-id').value = t.id;
            document.getElementById('title').value = t.title;
            document.getElementById('category').value = t.category;
            document.getElementById('severity').value = t.severity;
            document.getElementById('description').value = t.description;
            document.getElementById('solution').value = t.solution;
            if (t.image) {
                const preview = document.getElementById('image-preview');
                preview.innerHTML = `<img src="${t.image}">`;
                preview.classList.remove('hidden');
            }
            document.getElementById('modal-title').textContent = 'Editar Tarea';
        } else {
            document.getElementById('modal-title').textContent = 'Añadir Tarea';
        }

        modal.classList.remove('hidden');
    }

    hideModal() {
        document.getElementById('modal').classList.add('hidden');
    }

    handleSaveTask() {
        const id = document.getElementById('fault-id').value;
        const imgEl = document.querySelector('#image-preview img');

        const data = {
            id: id || null,
            title: document.getElementById('title').value,
            category: document.getElementById('category').value,
            severity: document.getElementById('severity').value,
            description: document.getElementById('description').value,
            solution: document.getElementById('solution').value,
            image: imgEl ? imgEl.src : null,
            date: this.currentViewDate
        };

        if (id) {
            const idx = this.tasks.findIndex(t => t.id === id);
            this.tasks[idx] = new Task(data);
        } else {
            this.tasks.unshift(new Task(data));
        }

        StorageService.saveTasks(this.tasks);
        this.renderAll();
        this.hideModal();
        this.showToast('Tarea guardada con éxito');
    }

    handleSaveSchematic() {
        const id = document.getElementById('schematic-id').value;
        const title = document.getElementById('schema-title').value;
        const category = document.getElementById('schema-category').value;
        const imgEl = document.querySelector('#schema-preview img');

        if (imgEl) {
            this.schematics.addUserSchematic({
                id: id || null,
                title,
                category,
                img: imgEl.src
            });
            document.getElementById('modal-schematic').classList.add('hidden');
            this.showToast(id ? 'Esquema actualizado' : 'Esquema guardado con éxito');
        } else {
            alert('Por favor, captura una foto o selecciona una imagen.');
        }
    }

    deleteSchematic(id) {
        if (confirm('¿Eliminar este esquema técnico?')) {
            this.schematics.deleteUserSchematic(id);
            this.showToast('Esquema eliminado');
        }
    }

    editSchematic(id, toggleCamera = false) {
        const s = this.schematics.allSchematics.find(x => x.id === id);
        if (s) {
            document.getElementById('schematic-id').value = s.id;
            document.getElementById('schema-title').value = s.title;
            document.getElementById('schema-category').value = s.category;

            const preview = document.getElementById('schema-preview');
            preview.innerHTML = `<img src="${s.img}">`;
            preview.classList.remove('hidden');

            document.getElementById('schematic-modal-title').textContent = 'Editar Esquema';
            document.getElementById('modal-schematic').classList.remove('hidden');

            if (toggleCamera) {
                setTimeout(() => {
                    document.getElementById('schema-image').click();
                }, 100);
            }
        }
    }

    deleteTask(id) {
        if (confirm('¿Eliminar este registro permanentemente?')) {
            this.tasks = this.tasks.filter(t => t.id !== id);
            StorageService.saveTasks(this.tasks);
            this.renderAll();
        }
    }

    editTask(id) {
        this.showModal(id);
    }

    showToast(msg) {
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerHTML = `<i data-lucide="info"></i> <span>${msg}</span>`;
        container.appendChild(toast);
        lucide.createIcons();
        setTimeout(() => toast.remove(), 3000);
    }

    exportPDF() {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        doc.setFontSize(22);
        doc.text('ElectroExpert Pro - Reporte Técnico', 20, 20);
        doc.setFontSize(12);
        doc.text(`Fecha de exportación: ${new Date().toLocaleDateString()}`, 20, 30);

        let y = 50;
        this.tasks.forEach((t, i) => {
            if (y > 270) { doc.addPage(); y = 20; }
            doc.setFontSize(14);
            doc.text(`${i + 1}. ${t.title} [${t.date}]`, 20, y);
            y += 7;
            doc.setFontSize(10);
            doc.text(`Categoría: ${t.category} | Severidad: ${t.severity}`, 25, y);
            y += 5;
            doc.text(`Diagnosis: ${t.description}`, 25, y);
            y += 5;
            doc.text(`Solución: ${t.solution}`, 25, y);
            y += 15;
        });

        doc.save(`Reporte_Mantenimiento_${new Date().getTime()}.pdf`);
    }
}

// Boot
window.app = null;
document.addEventListener('DOMContentLoaded', () => {
    window.app = new App();
});