/**
 * Página de Gerenciamento de Treinos
 * Sistema Personal App - Mundo Ativo
 */

window.Pages = window.Pages || {};

window.Pages.workouts = {
    currentPage: 1,
    pageSize: 10,
    searchTerm: '',
    studentFilter: '',
    sortBy: 'name',
    sortOrder: 'asc',

    async render(container, context) {
        const trainer = await Auth.requireAuth();
        
        container.innerHTML = `
            <div class="workouts-container">
                <div class="container">
                    <div class="page-header">
                        <div class="header-content">
                            <h1>Gerenciar Treinos</h1>
                            <p>Crie treinos personalizados para seus alunos</p>
                        </div>
                        <div class="header-actions">
                            <button class="btn btn-primary" id="addWorkoutBtn">
                                <svg class="icon"><use href="#icon-add"></use></svg>
                                Novo Treino
                            </button>
                        </div>
                    </div>
                    
                    <div class="workouts-filters">
                        <div class="search-box">
                            <input type="text" id="searchInput" class="form-input" placeholder="Buscar treinos...">
                            <svg class="search-icon"><use href="#icon-search"></use></svg>
                        </div>
                        <div class="filter-controls">
                            <select id="studentFilter" class="form-select">
                                <option value="">Todos os alunos</option>
                            </select>
                            <button class="btn btn-ghost" id="sortOrderBtn">
                                <svg class="icon"><use href="#icon-sort-asc"></use></svg>
                            </button>
                        </div>
                    </div>
                    
                    <div class="workouts-grid" id="workoutsGrid"></div>
                    <div class="pagination-container" id="paginationContainer"></div>
                </div>
            </div>
            
            <!-- Modal de Treino -->
            <div class="modal" id="workoutModal">
                <div class="modal-content modal-lg">
                    <div class="modal-header">
                        <h2 id="modalTitle">Novo Treino</h2>
                        <button class="modal-close" id="closeModal">
                            <svg class="icon"><use href="#icon-close"></use></svg>
                        </button>
                    </div>
                    <form class="modal-body" id="workoutForm">
                        <div class="form-row">
                            <div class="form-group">
                                <label class="form-label" for="workoutName">Nome do treino</label>
                                <input type="text" id="workoutName" name="name" class="form-input" required>
                            </div>
                            <div class="form-group">
                                <label class="form-label" for="workoutStudent">Aluno</label>
                                <select id="workoutStudent" name="student_id" class="form-select" required>
                                    <option value="">Selecione um aluno</option>
                                </select>
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label" for="workoutDescription">Descrição</label>
                            <textarea id="workoutDescription" name="description" class="form-textarea" rows="3"></textarea>
                        </div>
                        
                        <div class="form-row">
                            <div class="form-group">
                                <label class="form-label" for="workoutDuration">Duração (min)</label>
                                <input type="number" id="workoutDuration" name="duration" class="form-input" min="1">
                            </div>
                            <div class="form-group">
                                <label class="form-label" for="workoutDifficulty">Dificuldade</label>
                                <select id="workoutDifficulty" name="difficulty" class="form-select">
                                    <option value="beginner">Iniciante</option>
                                    <option value="intermediate">Intermediário</option>
                                    <option value="advanced">Avançado</option>
                                </select>
                            </div>
                        </div>
                    </form>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" id="cancelBtn">Cancelar</button>
                        <button type="submit" form="workoutForm" class="btn btn-primary">Salvar</button>
                    </div>
                </div>
            </div>
        `;
        
        await this.loadWorkouts(trainer.id);
        await this.loadStudentsForFilter(trainer.id);
    },

    async loadWorkouts(trainerId) {
        try {
            const response = await API.workouts.list(trainerId, {
                page: this.currentPage,
                limit: this.pageSize,
                search: this.searchTerm,
                student_id: this.studentFilter,
                sort_by: this.sortBy,
                sort_order: this.sortOrder
            });
            
            this.renderWorkouts(response.workouts);
            this.renderPagination(response.pagination);
        } catch (error) {
            UI.Toast.error('Erro ao carregar treinos');
        }
    },

    async loadStudentsForFilter(trainerId) {
        try {
            const response = await API.students.list(trainerId, { limit: 1000 });
            const studentFilter = document.getElementById('studentFilter');
            const workoutStudent = document.getElementById('workoutStudent');
            
            const options = response.students.map(s => `<option value="${s.id}">${s.name}</option>`).join('');
            
            if (studentFilter) studentFilter.innerHTML = '<option value="">Todos os alunos</option>' + options;
            if (workoutStudent) workoutStudent.innerHTML = '<option value="">Selecione um aluno</option>' + options;
        } catch (error) {
            console.error('Erro ao carregar alunos:', error);
        }
    },

    renderWorkouts(workouts) {
        const grid = document.getElementById('workoutsGrid');
        
        if (workouts.length === 0) {
            grid.innerHTML = `
                <div class="empty-state">
                    <svg class="empty-icon"><use href="#icon-workout"></use></svg>
                    <h3>Nenhum treino encontrado</h3>
                    <p>Comece criando seu primeiro treino</p>
                    <button class="btn btn-primary" onclick="document.getElementById('addWorkoutBtn').click()">
                        Criar Treino
                    </button>
                </div>
            `;
            return;
        }
        
        grid.innerHTML = workouts.map(workout => `
            <div class="workout-card">
                <div class="workout-header">
                    <h3>${workout.name}</h3>
                    <span class="badge badge-${workout.difficulty}">${this.getDifficultyLabel(workout.difficulty)}</span>
                </div>
                <div class="workout-info">
                    <p><svg class="icon"><use href="#icon-user"></use></svg> ${workout.student_name}</p>
                    ${workout.description ? `<p class="workout-description">${workout.description}</p>` : ''}
                    ${workout.duration ? `<p><svg class="icon"><use href="#icon-clock"></use></svg> ${workout.duration} min</p>` : ''}
                </div>
                <div class="workout-actions">
                    <button class="btn btn-ghost btn-sm edit-workout" data-id="${workout.id}">
                        <svg class="icon"><use href="#icon-edit"></use></svg> Editar
                    </button>
                    <button class="btn btn-ghost btn-sm delete-workout" data-id="${workout.id}">
                        <svg class="icon"><use href="#icon-delete"></use></svg> Excluir
                    </button>
                </div>
            </div>
        `).join('');
    },

    renderPagination(pagination) {
        const container = document.getElementById('paginationContainer');
        container.innerHTML = UI.Components.createPagination(pagination, (page) => {
            this.currentPage = page;
            this.loadWorkouts(Auth.getCurrentUser().id);
        });
    },

    getDifficultyLabel(difficulty) {
        const labels = { beginner: 'Iniciante', intermediate: 'Intermediário', advanced: 'Avançado' };
        return labels[difficulty] || difficulty;
    },

    async openWorkoutModal(workoutId = null) {
        const modal = document.getElementById('workoutModal');
        const form = document.getElementById('workoutForm');
        const title = document.getElementById('modalTitle');
        
        form.reset();
        
        if (workoutId) {
            title.textContent = 'Editar Treino';
            try {
                const workout = await API.workouts.get(workoutId);
                Object.keys(workout).forEach(key => {
                    const input = form.querySelector(`[name="${key}"]`);
                    if (input && workout[key] !== null) input.value = workout[key];
                });
            } catch (error) {
                UI.Toast.error('Erro ao carregar treino');
                return;
            }
        } else {
            title.textContent = 'Novo Treino';
        }
        
        modal.dataset.workoutId = workoutId || '';
        UI.Modal.open(modal);
    },

    async saveWorkout(formData, workoutId = null) {
        try {
            const trainerId = Auth.getCurrentUser().id;
            
            if (workoutId) {
                await API.workouts.update(workoutId, formData);
                UI.Toast.success('Treino atualizado');
            } else {
                await API.workouts.create(trainerId, formData);
                UI.Toast.success('Treino criado');
            }
            
            UI.Modal.close();
            await this.loadWorkouts(trainerId);
        } catch (error) {
            UI.Toast.error('Erro ao salvar treino');
        }
    },

    async deleteWorkout(workoutId) {
        const confirmed = await UI.Modal.confirm({
            title: 'Excluir Treino',
            message: 'Tem certeza que deseja excluir este treino?',
            confirmText: 'Excluir',
            cancelText: 'Cancelar'
        });
        
        if (confirmed) {
            try {
                await API.workouts.delete(workoutId);
                UI.Toast.success('Treino excluído');
                await this.loadWorkouts(Auth.getCurrentUser().id);
            } catch (error) {
                UI.Toast.error('Erro ao excluir treino');
            }
        }
    },

    mount(container) {
        // Botão adicionar
        container.querySelector('#addWorkoutBtn').addEventListener('click', () => this.openWorkoutModal());
        
        // Busca
        const searchInput = container.querySelector('#searchInput');
        let searchTimeout;
        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                this.searchTerm = e.target.value;
                this.currentPage = 1;
                this.loadWorkouts(Auth.getCurrentUser().id);
            }, 300);
        });
        
        // Filtro de aluno
        container.querySelector('#studentFilter').addEventListener('change', (e) => {
            this.studentFilter = e.target.value;
            this.currentPage = 1;
            this.loadWorkouts(Auth.getCurrentUser().id);
        });
        
        // Ordenação
        container.querySelector('#sortOrderBtn').addEventListener('click', () => {
            this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
            const icon = container.querySelector('#sortOrderBtn use');
            icon.setAttribute('href', `#icon-sort-${this.sortOrder === 'asc' ? 'asc' : 'desc'}`);
            this.loadWorkouts(Auth.getCurrentUser().id);
        });
        
        // Event delegation para ações
        container.querySelector('#workoutsGrid').addEventListener('click', (e) => {
            const editBtn = e.target.closest('.edit-workout');
            const deleteBtn = e.target.closest('.delete-workout');
            
            if (editBtn) this.openWorkoutModal(editBtn.dataset.id);
            else if (deleteBtn) this.deleteWorkout(deleteBtn.dataset.id);
        });
        
        // Modal
        const modal = container.querySelector('#workoutModal');
        modal.querySelector('#closeModal').addEventListener('click', () => UI.Modal.close());
        modal.querySelector('#cancelBtn').addEventListener('click', () => UI.Modal.close());
        
        modal.querySelector('#workoutForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = new FormData(e.target);
            const workoutData = Object.fromEntries(formData.entries());
            
            if (!workoutData.name) {
                UI.Toast.error('Nome é obrigatório');
                return;
            }
            
            if (!workoutData.student_id) {
                UI.Toast.error('Selecione um aluno');
                return;
            }
            
            await this.saveWorkout(workoutData, modal.dataset.workoutId || null);
        });
    }
};

// Estilos
const workoutsStyle = document.createElement('style');
workoutsStyle.textContent = `
    .workouts-container { padding: 2rem 0; }
    .workouts-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap: 1.5rem; margin-bottom: 2rem; }
    .workout-card { background: var(--glass-bg); border: 1px solid var(--glass-border); border-radius: var(--radius-lg); padding: 1.5rem; backdrop-filter: var(--glass-blur); transition: var(--transition); }
    .workout-card:hover { transform: translateY(-2px); box-shadow: var(--shadow-lg); border-color: var(--primary); }
    .workout-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
    .workout-header h3 { margin: 0; font-size: 1.125rem; font-weight: 600; }
    .workout-info { margin-bottom: 1rem; }
    .workout-info p { margin: 0 0 0.5rem; font-size: 0.875rem; color: var(--muted); display: flex; align-items: center; gap: 0.5rem; }
    .workout-description { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
    .workout-actions { display: flex; gap: 0.5rem; justify-content: flex-end; }
    .empty-state { grid-column: 1 / -1; text-align: center; padding: 4rem 2rem; color: var(--muted); }
    .empty-icon { width: 4rem; height: 4rem; margin: 0 auto 1rem; opacity: 0.5; }
    @media (max-width: 768px) { .workouts-grid { grid-template-columns: 1fr; } }
`;
document.head.appendChild(workoutsStyle);
