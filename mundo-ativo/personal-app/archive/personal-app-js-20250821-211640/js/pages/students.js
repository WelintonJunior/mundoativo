/**
 * Página de Gerenciamento de Alunos
 * Sistema Personal App - Mundo Ativo
 */

window.Pages = window.Pages || {};

window.Pages.students = {
    currentPage: 1,
    pageSize: 10,
    searchTerm: '',
    sortBy: 'name',
    sortOrder: 'asc',

    async render(container, context) {
        // Verifica autenticação
        const trainer = await Auth.requireAuth();
        
        container.innerHTML = `
            <div class="students-container">
                <div class="container">
                    <div class="page-header">
                        <div class="header-content">
                            <h1>Gerenciar Alunos</h1>
                            <p>Cadastre e acompanhe seus alunos</p>
                        </div>
                        <div class="header-actions">
                            <button class="btn btn-secondary" id="exportBtn">
                                <svg class="icon"><use href="#icon-download"></use></svg>
                                Exportar
                            </button>
                            <button class="btn btn-primary" id="addStudentBtn">
                                <svg class="icon"><use href="#icon-add"></use></svg>
                                Novo Aluno
                            </button>
                        </div>
                    </div>
                    
                    <div class="students-filters">
                        <div class="search-box">
                            <input 
                                type="text" 
                                id="searchInput" 
                                class="form-input" 
                                placeholder="Buscar alunos..."
                            >
                            <svg class="search-icon"><use href="#icon-search"></use></svg>
                        </div>
                        <div class="filter-controls">
                            <select id="sortSelect" class="form-select">
                                <option value="name">Ordenar por Nome</option>
                                <option value="email">Ordenar por Email</option>
                                <option value="created_at">Ordenar por Data</option>
                            </select>
                            <button class="btn btn-ghost" id="sortOrderBtn" title="Alterar ordem">
                                <svg class="icon"><use href="#icon-sort-asc"></use></svg>
                            </button>
                        </div>
                    </div>
                    
                    <div class="students-content">
                        <div class="students-grid" id="studentsGrid">
                            <!-- Alunos serão carregados dinamicamente -->
                        </div>
                        
                        <div class="pagination-container" id="paginationContainer">
                            <!-- Paginação será carregada dinamicamente -->
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Modal de Aluno -->
            <div class="modal" id="studentModal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h2 id="modalTitle">Novo Aluno</h2>
                        <button class="modal-close" id="closeModal">
                            <svg class="icon"><use href="#icon-close"></use></svg>
                        </button>
                    </div>
                    <form class="modal-body" id="studentForm">
                        <div class="form-row">
                            <div class="form-group">
                                <label class="form-label" for="studentName">Nome completo</label>
                                <input type="text" id="studentName" name="name" class="form-input" required>
                            </div>
                            <div class="form-group">
                                <label class="form-label" for="studentEmail">Email</label>
                                <input type="email" id="studentEmail" name="email" class="form-input" required>
                            </div>
                        </div>
                        
                        <div class="form-row">
                            <div class="form-group">
                                <label class="form-label" for="studentPhone">Telefone</label>
                                <input type="tel" id="studentPhone" name="phone" class="form-input">
                            </div>
                            <div class="form-group">
                                <label class="form-label" for="studentBirth">Data de nascimento</label>
                                <input type="date" id="studentBirth" name="birth_date" class="form-input">
                            </div>
                        </div>
                        
                        <div class="form-row">
                            <div class="form-group">
                                <label class="form-label" for="studentWeight">Peso (kg)</label>
                                <input type="number" id="studentWeight" name="weight" class="form-input" step="0.1" min="0">
                            </div>
                            <div class="form-group">
                                <label class="form-label" for="studentHeight">Altura (cm)</label>
                                <input type="number" id="studentHeight" name="height" class="form-input" min="0">
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label" for="studentGoals">Objetivos</label>
                            <textarea id="studentGoals" name="goals" class="form-textarea" rows="3" placeholder="Descreva os objetivos do aluno..."></textarea>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label" for="studentNotes">Observações</label>
                            <textarea id="studentNotes" name="notes" class="form-textarea" rows="3" placeholder="Observações médicas, restrições, etc..."></textarea>
                        </div>
                        
                        <div class="image-upload-section">
                            <label class="form-label">Foto do aluno</label>
                            <div id="studentImageUploader"></div>
                        </div>
                    </form>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" id="cancelBtn">Cancelar</button>
                        <button type="submit" form="studentForm" class="btn btn-primary" id="saveBtn">Salvar</button>
                    </div>
                </div>
            </div>
        `;
        
        await this.loadStudents(trainer.id);
    },

    async loadStudents(trainerId) {
        try {
            UI.Components.showSkeleton('#studentsGrid', 'grid');
            
            const response = await API.students.list(trainerId, {
                page: this.currentPage,
                limit: this.pageSize,
                search: this.searchTerm,
                sort_by: this.sortBy,
                sort_order: this.sortOrder
            });
            
            this.renderStudents(response.students);
            this.renderPagination(response.pagination);
            
        } catch (error) {
            console.error('Erro ao carregar alunos:', error);
            UI.Toast.error('Erro ao carregar alunos');
        }
    },

    renderStudents(students) {
        const grid = document.getElementById('studentsGrid');
        
        if (students.length === 0) {
            grid.innerHTML = `
                <div class="empty-state">
                    <svg class="empty-icon"><use href="#icon-users"></use></svg>
                    <h3>Nenhum aluno encontrado</h3>
                    <p>Comece cadastrando seu primeiro aluno</p>
                    <button class="btn btn-primary" onclick="document.getElementById('addStudentBtn').click()">
                        Cadastrar Aluno
                    </button>
                </div>
            `;
            return;
        }
        
        grid.innerHTML = students.map(student => `
            <div class="student-card" data-id="${student.id}">
                <div class="student-avatar">
                    ${student.photo_url ? 
                        `<img src="${student.photo_url}" alt="${student.name}">` :
                        `<div class="avatar-placeholder">${student.name.charAt(0).toUpperCase()}</div>`
                    }
                </div>
                <div class="student-info">
                    <h3>${student.name}</h3>
                    <p class="student-email">${student.email}</p>
                    ${student.phone ? `<p class="student-phone">${student.phone}</p>` : ''}
                    ${student.goals ? `<p class="student-goals">${student.goals}</p>` : ''}
                </div>
                <div class="student-stats">
                    ${student.weight ? `<div class="stat"><span>Peso:</span> ${student.weight}kg</div>` : ''}
                    ${student.height ? `<div class="stat"><span>Altura:</span> ${student.height}cm</div>` : ''}
                    ${student.weight && student.height ? 
                        `<div class="stat"><span>IMC:</span> ${this.calculateBMI(student.weight, student.height)}</div>` : ''
                    }
                </div>
                <div class="student-actions">
                    <button class="btn btn-ghost btn-sm edit-student" data-id="${student.id}">
                        <svg class="icon"><use href="#icon-edit"></use></svg>
                        Editar
                    </button>
                    <button class="btn btn-ghost btn-sm delete-student" data-id="${student.id}">
                        <svg class="icon"><use href="#icon-delete"></use></svg>
                        Excluir
                    </button>
                </div>
            </div>
        `).join('');
    },

    renderPagination(pagination) {
        const container = document.getElementById('paginationContainer');
        container.innerHTML = UI.Components.createPagination(pagination, (page) => {
            this.currentPage = page;
            this.loadStudents(Auth.getCurrentUser().id);
        });
    },

    calculateBMI(weight, height) {
        const heightInMeters = height / 100;
        const bmi = weight / (heightInMeters * heightInMeters);
        return bmi.toFixed(1);
    },

    async openStudentModal(studentId = null) {
        const modal = document.getElementById('studentModal');
        const form = document.getElementById('studentForm');
        const title = document.getElementById('modalTitle');
        
        // Limpa o formulário
        form.reset();
        
        if (studentId) {
            title.textContent = 'Editar Aluno';
            try {
                const student = await API.students.get(studentId);
                this.populateForm(form, student);
            } catch (error) {
                UI.Toast.error('Erro ao carregar dados do aluno');
                return;
            }
        } else {
            title.textContent = 'Novo Aluno';
        }
        
        // Inicializa uploader de imagem
        const uploaderContainer = document.getElementById('studentImageUploader');
        const uploader = new ImageUploader(uploaderContainer, {
            maxSize: 5 * 1024 * 1024, // 5MB
            accept: 'image/*'
        });
        
        modal.dataset.studentId = studentId || '';
        modal.dataset.uploader = JSON.stringify(uploader);
        UI.Modal.open(modal);
    },

    populateForm(form, student) {
        Object.keys(student).forEach(key => {
            const input = form.querySelector(`[name="${key}"]`);
            if (input && student[key] !== null) {
                input.value = student[key];
            }
        });
    },

    async saveStudent(formData, studentId = null) {
        try {
            const trainerId = Auth.getCurrentUser().id;
            
            if (studentId) {
                await API.students.update(studentId, formData);
                UI.Toast.success('Aluno atualizado com sucesso');
            } else {
                await API.students.create(trainerId, formData);
                UI.Toast.success('Aluno cadastrado com sucesso');
            }
            
            UI.Modal.close();
            await this.loadStudents(trainerId);
            
        } catch (error) {
            console.error('Erro ao salvar aluno:', error);
            UI.Toast.error('Erro ao salvar aluno');
        }
    },

    async deleteStudent(studentId) {
        const confirmed = await UI.Modal.confirm({
            title: 'Excluir Aluno',
            message: 'Tem certeza que deseja excluir este aluno? Esta ação não pode ser desfeita.',
            confirmText: 'Excluir',
            cancelText: 'Cancelar'
        });
        
        if (confirmed) {
            try {
                await API.students.delete(studentId);
                UI.Toast.success('Aluno excluído com sucesso');
                await this.loadStudents(Auth.getCurrentUser().id);
            } catch (error) {
                console.error('Erro ao excluir aluno:', error);
                UI.Toast.error('Erro ao excluir aluno');
            }
        }
    },

    mount(container) {
        // Botão adicionar aluno
        const addBtn = container.querySelector('#addStudentBtn');
        addBtn.addEventListener('click', () => this.openStudentModal());
        
        // Busca
        const searchInput = container.querySelector('#searchInput');
        let searchTimeout;
        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                this.searchTerm = e.target.value;
                this.currentPage = 1;
                this.loadStudents(Auth.getCurrentUser().id);
            }, 300);
        });
        
        // Ordenação
        const sortSelect = container.querySelector('#sortSelect');
        sortSelect.addEventListener('change', (e) => {
            this.sortBy = e.target.value;
            this.loadStudents(Auth.getCurrentUser().id);
        });
        
        const sortOrderBtn = container.querySelector('#sortOrderBtn');
        sortOrderBtn.addEventListener('click', () => {
            this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
            const icon = sortOrderBtn.querySelector('use');
            icon.setAttribute('href', `#icon-sort-${this.sortOrder === 'asc' ? 'asc' : 'desc'}`);
            this.loadStudents(Auth.getCurrentUser().id);
        });
        
        // Exportar
        const exportBtn = container.querySelector('#exportBtn');
        exportBtn.addEventListener('click', async () => {
            try {
                const response = await API.students.list(Auth.getCurrentUser().id, { limit: 1000 });
                CSV.exportStudents(response.students);
                UI.Toast.success('Dados exportados com sucesso');
            } catch (error) {
                UI.Toast.error('Erro ao exportar dados');
            }
        });
        
        // Event delegation para ações dos alunos
        const studentsGrid = container.querySelector('#studentsGrid');
        studentsGrid.addEventListener('click', (e) => {
            const editBtn = e.target.closest('.edit-student');
            const deleteBtn = e.target.closest('.delete-student');
            
            if (editBtn) {
                this.openStudentModal(editBtn.dataset.id);
            } else if (deleteBtn) {
                this.deleteStudent(deleteBtn.dataset.id);
            }
        });
        
        // Modal de aluno
        const modal = container.querySelector('#studentModal');
        const closeBtn = modal.querySelector('#closeModal');
        const cancelBtn = modal.querySelector('#cancelBtn');
        const form = modal.querySelector('#studentForm');
        
        closeBtn.addEventListener('click', () => UI.Modal.close());
        cancelBtn.addEventListener('click', () => UI.Modal.close());
        
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = new FormData(form);
            const studentData = Object.fromEntries(formData.entries());
            
            // Validação
            if (!Validators.validateRequired(studentData.name)) {
                UI.Toast.error('Nome é obrigatório');
                return;
            }
            
            if (!Validators.validateEmail(studentData.email)) {
                UI.Toast.error('Email inválido');
                return;
            }
            
            const studentId = modal.dataset.studentId || null;
            await this.saveStudent(studentData, studentId);
        });
    }
};

// Estilos específicos da página de alunos
const studentsStyle = document.createElement('style');
studentsStyle.textContent = `
    .students-container {
        padding: 2rem 0;
    }
    
    .page-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 2rem;
        gap: 2rem;
    }
    
    .header-content h1 {
        font-size: 2rem;
        font-weight: 700;
        margin: 0 0 0.5rem;
    }
    
    .header-content p {
        color: var(--muted);
        margin: 0;
    }
    
    .header-actions {
        display: flex;
        gap: 1rem;
        flex-shrink: 0;
    }
    
    .students-filters {
        background: var(--glass-bg);
        border: 1px solid var(--glass-border);
        border-radius: var(--radius-lg);
        padding: 1.5rem;
        margin-bottom: 2rem;
        backdrop-filter: var(--glass-blur);
        display: flex;
        gap: 1.5rem;
        align-items: center;
        flex-wrap: wrap;
    }
    
    .search-box {
        position: relative;
        flex: 1;
        min-width: 300px;
    }
    
    .search-icon {
        position: absolute;
        left: 1rem;
        top: 50%;
        transform: translateY(-50%);
        color: var(--muted);
        pointer-events: none;
    }
    
    .search-box .form-input {
        padding-left: 3rem;
    }
    
    .filter-controls {
        display: flex;
        gap: 0.5rem;
        align-items: center;
    }
    
    .students-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
        gap: 1.5rem;
        margin-bottom: 2rem;
    }
    
    .student-card {
        background: var(--glass-bg);
        border: 1px solid var(--glass-border);
        border-radius: var(--radius-lg);
        padding: 1.5rem;
        backdrop-filter: var(--glass-blur);
        transition: var(--transition);
    }
    
    .student-card:hover {
        transform: translateY(-2px);
        box-shadow: var(--shadow-lg);
        border-color: var(--primary);
    }
    
    .student-avatar {
        width: 4rem;
        height: 4rem;
        border-radius: 50%;
        margin: 0 auto 1rem;
        overflow: hidden;
        background: var(--elev-2);
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .student-avatar img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
    
    .avatar-placeholder {
        font-size: 1.5rem;
        font-weight: 700;
        color: var(--primary);
    }
    
    .student-info {
        text-align: center;
        margin-bottom: 1rem;
    }
    
    .student-info h3 {
        font-size: 1.125rem;
        font-weight: 600;
        margin: 0 0 0.5rem;
    }
    
    .student-email {
        color: var(--muted);
        font-size: 0.875rem;
        margin: 0 0 0.25rem;
    }
    
    .student-phone {
        color: var(--muted);
        font-size: 0.875rem;
        margin: 0 0 0.25rem;
    }
    
    .student-goals {
        color: var(--muted);
        font-size: 0.875rem;
        margin: 0;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }
    
    .student-stats {
        background: var(--elev-2);
        border-radius: var(--radius-md);
        padding: 1rem;
        margin-bottom: 1rem;
    }
    
    .stat {
        display: flex;
        justify-content: space-between;
        font-size: 0.875rem;
        margin-bottom: 0.25rem;
    }
    
    .stat:last-child {
        margin-bottom: 0;
    }
    
    .stat span {
        color: var(--muted);
    }
    
    .student-actions {
        display: flex;
        gap: 0.5rem;
        justify-content: center;
    }
    
    .empty-state {
        grid-column: 1 / -1;
        text-align: center;
        padding: 4rem 2rem;
        color: var(--muted);
    }
    
    .empty-icon {
        width: 4rem;
        height: 4rem;
        margin: 0 auto 1rem;
        opacity: 0.5;
    }
    
    .empty-state h3 {
        font-size: 1.5rem;
        margin: 0 0 0.5rem;
        color: var(--text);
    }
    
    .empty-state p {
        margin: 0 0 2rem;
    }
    
    .form-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
    }
    
    .image-upload-section {
        margin-top: 1rem;
        padding-top: 1rem;
        border-top: 1px solid var(--glass-border);
    }
    
    @media (max-width: 768px) {
        .page-header {
            flex-direction: column;
            align-items: stretch;
        }
        
        .header-actions {
            justify-content: flex-end;
        }
        
        .students-filters {
            flex-direction: column;
            align-items: stretch;
        }
        
        .search-box {
            min-width: auto;
        }
        
        .filter-controls {
            justify-content: space-between;
        }
        
        .students-grid {
            grid-template-columns: 1fr;
        }
        
        .form-row {
            grid-template-columns: 1fr;
        }
    }
`;
document.head.appendChild(studentsStyle);
