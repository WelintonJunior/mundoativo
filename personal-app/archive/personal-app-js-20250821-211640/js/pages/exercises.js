/**
 * Página de Gerenciamento de Exercícios
 * Sistema Personal App - Mundo Ativo
 */

window.Pages = window.Pages || {};

window.Pages.exercises = {
    currentPage: 1,
    pageSize: 12,
    searchTerm: '',
    categoryFilter: '',
    muscleGroupFilter: '',
    sortBy: 'name',
    sortOrder: 'asc',

    async render(container, context) {
        // Verifica autenticação
        const trainer = await Auth.requireAuth();
        
        container.innerHTML = `
            <div class="exercises-container">
                <div class="container">
                    <div class="page-header">
                        <div class="header-content">
                            <h1>Biblioteca de Exercícios</h1>
                            <p>Crie e organize seus exercícios</p>
                        </div>
                        <div class="header-actions">
                            <button class="btn btn-secondary" id="importBtn">
                                <svg class="icon"><use href="#icon-upload"></use></svg>
                                Importar
                            </button>
                            <button class="btn btn-primary" id="addExerciseBtn">
                                <svg class="icon"><use href="#icon-add"></use></svg>
                                Novo Exercício
                            </button>
                        </div>
                    </div>
                    
                    <div class="exercises-filters">
                        <div class="search-box">
                            <input 
                                type="text" 
                                id="searchInput" 
                                class="form-input" 
                                placeholder="Buscar exercícios..."
                            >
                            <svg class="search-icon"><use href="#icon-search"></use></svg>
                        </div>
                        <div class="filter-controls">
                            <select id="categoryFilter" class="form-select">
                                <option value="">Todas as categorias</option>
                                <option value="strength">Força</option>
                                <option value="cardio">Cardio</option>
                                <option value="flexibility">Flexibilidade</option>
                                <option value="balance">Equilíbrio</option>
                            </select>
                            <select id="muscleGroupFilter" class="form-select">
                                <option value="">Todos os grupos</option>
                                <option value="chest">Peito</option>
                                <option value="back">Costas</option>
                                <option value="shoulders">Ombros</option>
                                <option value="arms">Braços</option>
                                <option value="legs">Pernas</option>
                                <option value="core">Core</option>
                                <option value="full_body">Corpo todo</option>
                            </select>
                            <button class="btn btn-ghost" id="sortOrderBtn" title="Alterar ordem">
                                <svg class="icon"><use href="#icon-sort-asc"></use></svg>
                            </button>
                        </div>
                    </div>
                    
                    <div class="exercises-content">
                        <div class="exercises-grid" id="exercisesGrid">
                            <!-- Exercícios serão carregados dinamicamente -->
                        </div>
                        
                        <div class="pagination-container" id="paginationContainer">
                            <!-- Paginação será carregada dinamicamente -->
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Modal de Exercício -->
            <div class="modal" id="exerciseModal">
                <div class="modal-content modal-lg">
                    <div class="modal-header">
                        <h2 id="modalTitle">Novo Exercício</h2>
                        <button class="modal-close" id="closeModal">
                            <svg class="icon"><use href="#icon-close"></use></svg>
                        </button>
                    </div>
                    <form class="modal-body" id="exerciseForm">
                        <div class="form-row">
                            <div class="form-group">
                                <label class="form-label" for="exerciseName">Nome do exercício</label>
                                <input type="text" id="exerciseName" name="name" class="form-input" required>
                            </div>
                            <div class="form-group">
                                <label class="form-label" for="exerciseCategory">Categoria</label>
                                <select id="exerciseCategory" name="category" class="form-select" required>
                                    <option value="">Selecione uma categoria</option>
                                    <option value="strength">Força</option>
                                    <option value="cardio">Cardio</option>
                                    <option value="flexibility">Flexibilidade</option>
                                    <option value="balance">Equilíbrio</option>
                                </select>
                            </div>
                        </div>
                        
                        <div class="form-row">
                            <div class="form-group">
                                <label class="form-label" for="exerciseMuscleGroup">Grupo muscular</label>
                                <select id="exerciseMuscleGroup" name="muscle_group" class="form-select" required>
                                    <option value="">Selecione o grupo</option>
                                    <option value="chest">Peito</option>
                                    <option value="back">Costas</option>
                                    <option value="shoulders">Ombros</option>
                                    <option value="arms">Braços</option>
                                    <option value="legs">Pernas</option>
                                    <option value="core">Core</option>
                                    <option value="full_body">Corpo todo</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label class="form-label" for="exerciseEquipment">Equipamento</label>
                                <input type="text" id="exerciseEquipment" name="equipment" class="form-input" placeholder="Ex: Halteres, Barra, Peso corporal">
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label" for="exerciseDescription">Descrição</label>
                            <textarea id="exerciseDescription" name="description" class="form-textarea" rows="4" placeholder="Descreva como executar o exercício..."></textarea>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label" for="exerciseInstructions">Instruções detalhadas</label>
                            <textarea id="exerciseInstructions" name="instructions" class="form-textarea" rows="6" placeholder="Passo a passo para execução correta..."></textarea>
                        </div>
                        
                        <div class="form-row">
                            <div class="form-group">
                                <label class="form-label" for="exerciseDifficulty">Dificuldade</label>
                                <select id="exerciseDifficulty" name="difficulty" class="form-select">
                                    <option value="beginner">Iniciante</option>
                                    <option value="intermediate">Intermediário</option>
                                    <option value="advanced">Avançado</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label class="form-label" for="exerciseDuration">Duração estimada (min)</label>
                                <input type="number" id="exerciseDuration" name="duration" class="form-input" min="1" step="1">
                            </div>
                        </div>
                        
                        <div class="image-upload-section">
                            <label class="form-label">Imagens do exercício</label>
                            <div id="exerciseImageUploader"></div>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label" for="exerciseVideoUrl">URL do vídeo (opcional)</label>
                            <input type="url" id="exerciseVideoUrl" name="video_url" class="form-input" placeholder="https://youtube.com/watch?v=...">
                        </div>
                    </form>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" id="cancelBtn">Cancelar</button>
                        <button type="submit" form="exerciseForm" class="btn btn-primary" id="saveBtn">Salvar</button>
                    </div>
                </div>
            </div>
        `;
        
        await this.loadExercises(trainer.id);
    },

    async loadExercises(trainerId) {
        try {
            UI.Components.showSkeleton('#exercisesGrid', 'grid');
            
            const response = await API.exercises.list(trainerId, {
                page: this.currentPage,
                limit: this.pageSize,
                search: this.searchTerm,
                category: this.categoryFilter,
                muscle_group: this.muscleGroupFilter,
                sort_by: this.sortBy,
                sort_order: this.sortOrder
            });
            
            this.renderExercises(response.exercises);
            this.renderPagination(response.pagination);
            
        } catch (error) {
            console.error('Erro ao carregar exercícios:', error);
            UI.Toast.error('Erro ao carregar exercícios');
        }
    },

    renderExercises(exercises) {
        const grid = document.getElementById('exercisesGrid');
        
        if (exercises.length === 0) {
            grid.innerHTML = `
                <div class="empty-state">
                    <svg class="empty-icon"><use href="#icon-exercise"></use></svg>
                    <h3>Nenhum exercício encontrado</h3>
                    <p>Comece criando seu primeiro exercício</p>
                    <button class="btn btn-primary" onclick="document.getElementById('addExerciseBtn').click()">
                        Criar Exercício
                    </button>
                </div>
            `;
            return;
        }
        
        grid.innerHTML = exercises.map(exercise => `
            <div class="exercise-card" data-id="${exercise.id}">
                <div class="exercise-image">
                    ${exercise.image_url ? 
                        `<img src="${exercise.image_url}" alt="${exercise.name}">` :
                        `<div class="image-placeholder">
                            <svg class="icon icon-lg"><use href="#icon-exercise"></use></svg>
                        </div>`
                    }
                    <div class="exercise-badges">
                        <span class="badge badge-${exercise.difficulty}">${this.getDifficultyLabel(exercise.difficulty)}</span>
                        <span class="badge badge-category">${this.getCategoryLabel(exercise.category)}</span>
                    </div>
                </div>
                <div class="exercise-content">
                    <h3>${exercise.name}</h3>
                    <p class="exercise-muscle-group">${this.getMuscleGroupLabel(exercise.muscle_group)}</p>
                    ${exercise.equipment ? `<p class="exercise-equipment"><strong>Equipamento:</strong> ${exercise.equipment}</p>` : ''}
                    ${exercise.description ? `<p class="exercise-description">${exercise.description}</p>` : ''}
                    ${exercise.duration ? `<p class="exercise-duration"><strong>Duração:</strong> ${exercise.duration} min</p>` : ''}
                </div>
                <div class="exercise-actions">
                    <button class="btn btn-ghost btn-sm view-exercise" data-id="${exercise.id}">
                        <svg class="icon"><use href="#icon-eye"></use></svg>
                        Ver
                    </button>
                    <button class="btn btn-ghost btn-sm edit-exercise" data-id="${exercise.id}">
                        <svg class="icon"><use href="#icon-edit"></use></svg>
                        Editar
                    </button>
                    <button class="btn btn-ghost btn-sm delete-exercise" data-id="${exercise.id}">
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
            this.loadExercises(Auth.getCurrentUser().id);
        });
    },

    getDifficultyLabel(difficulty) {
        const labels = {
            beginner: 'Iniciante',
            intermediate: 'Intermediário',
            advanced: 'Avançado'
        };
        return labels[difficulty] || difficulty;
    },

    getCategoryLabel(category) {
        const labels = {
            strength: 'Força',
            cardio: 'Cardio',
            flexibility: 'Flexibilidade',
            balance: 'Equilíbrio'
        };
        return labels[category] || category;
    },

    getMuscleGroupLabel(muscleGroup) {
        const labels = {
            chest: 'Peito',
            back: 'Costas',
            shoulders: 'Ombros',
            arms: 'Braços',
            legs: 'Pernas',
            core: 'Core',
            full_body: 'Corpo todo'
        };
        return labels[muscleGroup] || muscleGroup;
    },

    async openExerciseModal(exerciseId = null) {
        const modal = document.getElementById('exerciseModal');
        const form = document.getElementById('exerciseForm');
        const title = document.getElementById('modalTitle');
        
        // Limpa o formulário
        form.reset();
        
        if (exerciseId) {
            title.textContent = 'Editar Exercício';
            try {
                const exercise = await API.exercises.get(exerciseId);
                this.populateForm(form, exercise);
            } catch (error) {
                UI.Toast.error('Erro ao carregar dados do exercício');
                return;
            }
        } else {
            title.textContent = 'Novo Exercício';
        }
        
        // Inicializa uploader de imagem
        const uploaderContainer = document.getElementById('exerciseImageUploader');
        const uploader = new ImageUploader(uploaderContainer, {
            maxSize: 5 * 1024 * 1024, // 5MB
            accept: 'image/*',
            multiple: true
        });
        
        modal.dataset.exerciseId = exerciseId || '';
        UI.Modal.open(modal);
    },

    populateForm(form, exercise) {
        Object.keys(exercise).forEach(key => {
            const input = form.querySelector(`[name="${key}"]`);
            if (input && exercise[key] !== null) {
                input.value = exercise[key];
            }
        });
    },

    async saveExercise(formData, exerciseId = null) {
        try {
            const trainerId = Auth.getCurrentUser().id;
            
            if (exerciseId) {
                await API.exercises.update(exerciseId, formData);
                UI.Toast.success('Exercício atualizado com sucesso');
            } else {
                await API.exercises.create(trainerId, formData);
                UI.Toast.success('Exercício criado com sucesso');
            }
            
            UI.Modal.close();
            await this.loadExercises(trainerId);
            
        } catch (error) {
            console.error('Erro ao salvar exercício:', error);
            UI.Toast.error('Erro ao salvar exercício');
        }
    },

    async deleteExercise(exerciseId) {
        const confirmed = await UI.Modal.confirm({
            title: 'Excluir Exercício',
            message: 'Tem certeza que deseja excluir este exercício? Esta ação não pode ser desfeita.',
            confirmText: 'Excluir',
            cancelText: 'Cancelar'
        });
        
        if (confirmed) {
            try {
                await API.exercises.delete(exerciseId);
                UI.Toast.success('Exercício excluído com sucesso');
                await this.loadExercises(Auth.getCurrentUser().id);
            } catch (error) {
                console.error('Erro ao excluir exercício:', error);
                UI.Toast.error('Erro ao excluir exercício');
            }
        }
    },

    async viewExercise(exerciseId) {
        try {
            const exercise = await API.exercises.get(exerciseId);
            
            const content = `
                <div class="exercise-detail">
                    ${exercise.image_url ? `<img src="${exercise.image_url}" alt="${exercise.name}" class="exercise-detail-image">` : ''}
                    <h3>${exercise.name}</h3>
                    <div class="exercise-meta">
                        <span class="badge badge-${exercise.difficulty}">${this.getDifficultyLabel(exercise.difficulty)}</span>
                        <span class="badge badge-category">${this.getCategoryLabel(exercise.category)}</span>
                        <span class="badge">${this.getMuscleGroupLabel(exercise.muscle_group)}</span>
                    </div>
                    ${exercise.equipment ? `<p><strong>Equipamento:</strong> ${exercise.equipment}</p>` : ''}
                    ${exercise.duration ? `<p><strong>Duração:</strong> ${exercise.duration} min</p>` : ''}
                    ${exercise.description ? `<p><strong>Descrição:</strong><br>${exercise.description}</p>` : ''}
                    ${exercise.instructions ? `<p><strong>Instruções:</strong><br>${exercise.instructions.replace(/\n/g, '<br>')}</p>` : ''}
                    ${exercise.video_url ? `<p><strong>Vídeo:</strong> <a href="${exercise.video_url}" target="_blank">Assistir vídeo</a></p>` : ''}
                </div>
            `;
            
            await UI.Modal.alert({
                title: 'Detalhes do Exercício',
                message: content,
                confirmText: 'Fechar'
            });
            
        } catch (error) {
            UI.Toast.error('Erro ao carregar detalhes do exercício');
        }
    },

    mount(container) {
        // Botão adicionar exercício
        const addBtn = container.querySelector('#addExerciseBtn');
        addBtn.addEventListener('click', () => this.openExerciseModal());
        
        // Busca
        const searchInput = container.querySelector('#searchInput');
        let searchTimeout;
        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                this.searchTerm = e.target.value;
                this.currentPage = 1;
                this.loadExercises(Auth.getCurrentUser().id);
            }, 300);
        });
        
        // Filtros
        const categoryFilter = container.querySelector('#categoryFilter');
        categoryFilter.addEventListener('change', (e) => {
            this.categoryFilter = e.target.value;
            this.currentPage = 1;
            this.loadExercises(Auth.getCurrentUser().id);
        });
        
        const muscleGroupFilter = container.querySelector('#muscleGroupFilter');
        muscleGroupFilter.addEventListener('change', (e) => {
            this.muscleGroupFilter = e.target.value;
            this.currentPage = 1;
            this.loadExercises(Auth.getCurrentUser().id);
        });
        
        // Ordenação
        const sortOrderBtn = container.querySelector('#sortOrderBtn');
        sortOrderBtn.addEventListener('click', () => {
            this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
            const icon = sortOrderBtn.querySelector('use');
            icon.setAttribute('href', `#icon-sort-${this.sortOrder === 'asc' ? 'asc' : 'desc'}`);
            this.loadExercises(Auth.getCurrentUser().id);
        });
        
        // Importar
        const importBtn = container.querySelector('#importBtn');
        importBtn.addEventListener('click', () => {
            UI.Toast.info('Funcionalidade de importação em desenvolvimento');
        });
        
        // Event delegation para ações dos exercícios
        const exercisesGrid = container.querySelector('#exercisesGrid');
        exercisesGrid.addEventListener('click', (e) => {
            const viewBtn = e.target.closest('.view-exercise');
            const editBtn = e.target.closest('.edit-exercise');
            const deleteBtn = e.target.closest('.delete-exercise');
            
            if (viewBtn) {
                this.viewExercise(viewBtn.dataset.id);
            } else if (editBtn) {
                this.openExerciseModal(editBtn.dataset.id);
            } else if (deleteBtn) {
                this.deleteExercise(deleteBtn.dataset.id);
            }
        });
        
        // Modal de exercício
        const modal = container.querySelector('#exerciseModal');
        const closeBtn = modal.querySelector('#closeModal');
        const cancelBtn = modal.querySelector('#cancelBtn');
        const form = modal.querySelector('#exerciseForm');
        
        closeBtn.addEventListener('click', () => UI.Modal.close());
        cancelBtn.addEventListener('click', () => UI.Modal.close());
        
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = new FormData(form);
            const exerciseData = Object.fromEntries(formData.entries());
            
            // Validação
            if (!Validators.validateRequired(exerciseData.name)) {
                UI.Toast.error('Nome do exercício é obrigatório');
                return;
            }
            
            if (!exerciseData.category) {
                UI.Toast.error('Categoria é obrigatória');
                return;
            }
            
            if (!exerciseData.muscle_group) {
                UI.Toast.error('Grupo muscular é obrigatório');
                return;
            }
            
            const exerciseId = modal.dataset.exerciseId || null;
            await this.saveExercise(exerciseData, exerciseId);
        });
    }
};

// Estilos específicos da página de exercícios
const exercisesStyle = document.createElement('style');
exercisesStyle.textContent = `
    .exercises-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
        gap: 1.5rem;
        margin-bottom: 2rem;
    }
    
    .exercise-card {
        background: var(--glass-bg);
        border: 1px solid var(--glass-border);
        border-radius: var(--radius-lg);
        overflow: hidden;
        backdrop-filter: var(--glass-blur);
        transition: var(--transition);
    }
    
    .exercise-card:hover {
        transform: translateY(-2px);
        box-shadow: var(--shadow-lg);
        border-color: var(--primary);
    }
    
    .exercise-image {
        position: relative;
        height: 200px;
        background: var(--elev-2);
        overflow: hidden;
    }
    
    .exercise-image img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
    
    .image-placeholder {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--muted);
    }
    
    .exercise-badges {
        position: absolute;
        top: 0.75rem;
        right: 0.75rem;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }
    
    .badge {
        padding: 0.25rem 0.5rem;
        border-radius: var(--radius-sm);
        font-size: 0.75rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        backdrop-filter: blur(10px);
    }
    
    .badge-beginner {
        background: rgba(0, 200, 120, 0.2);
        color: var(--mint);
        border: 1px solid rgba(0, 200, 120, 0.3);
    }
    
    .badge-intermediate {
        background: rgba(255, 193, 7, 0.2);
        color: #ffc107;
        border: 1px solid rgba(255, 193, 7, 0.3);
    }
    
    .badge-advanced {
        background: rgba(240, 70, 40, 0.2);
        color: var(--danger);
        border: 1px solid rgba(240, 70, 40, 0.3);
    }
    
    .badge-category {
        background: rgba(0, 100, 255, 0.2);
        color: var(--primary);
        border: 1px solid rgba(0, 100, 255, 0.3);
    }
    
    .exercise-content {
        padding: 1.5rem;
    }
    
    .exercise-content h3 {
        font-size: 1.125rem;
        font-weight: 600;
        margin: 0 0 0.5rem;
    }
    
    .exercise-muscle-group {
        color: var(--accent);
        font-weight: 600;
        font-size: 0.875rem;
        margin: 0 0 0.75rem;
    }
    
    .exercise-equipment,
    .exercise-duration {
        font-size: 0.875rem;
        color: var(--muted);
        margin: 0 0 0.5rem;
    }
    
    .exercise-description {
        font-size: 0.875rem;
        color: var(--muted);
        margin: 0 0 1rem;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        overflow: hidden;
        line-height: 1.4;
    }
    
    .exercise-actions {
        padding: 0 1.5rem 1.5rem;
        display: flex;
        gap: 0.5rem;
        justify-content: flex-end;
    }
    
    .exercise-detail {
        text-align: left;
    }
    
    .exercise-detail-image {
        width: 100%;
        max-height: 300px;
        object-fit: cover;
        border-radius: var(--radius-md);
        margin-bottom: 1rem;
    }
    
    .exercise-detail h3 {
        font-size: 1.5rem;
        margin: 0 0 1rem;
    }
    
    .exercise-meta {
        display: flex;
        gap: 0.5rem;
        margin-bottom: 1rem;
        flex-wrap: wrap;
    }
    
    .exercise-detail p {
        margin-bottom: 1rem;
        line-height: 1.6;
    }
    
    .exercise-detail strong {
        color: var(--primary);
    }
    
    .modal-lg .modal-content {
        max-width: 800px;
    }
    
    @media (max-width: 768px) {
        .exercises-grid {
            grid-template-columns: 1fr;
        }
        
        .exercise-actions {
            justify-content: center;
        }
    }
`;
document.head.appendChild(exercisesStyle);
