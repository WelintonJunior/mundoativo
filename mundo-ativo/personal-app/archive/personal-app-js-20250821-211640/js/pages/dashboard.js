/**
 * Página Dashboard
 * Sistema Personal App - Mundo Ativo
 */

window.Pages = window.Pages || {};

window.Pages.dashboard = {
    async render(container, context) {
        // Verifica autenticação
        const trainer = await Auth.requireAuth();
        
        container.innerHTML = `
            <div class="dashboard-container">
                <div class="container">
                    <div class="dashboard-header">
                        <div class="welcome-section">
                            <h1>Bem-vindo, ${trainer.name}!</h1>
                            <p>Gerencie seus alunos e treinos de forma eficiente</p>
                        </div>
                        <div class="header-actions">
                            <button class="btn btn-secondary" id="profileBtn">
                                <svg class="icon"><use href="#icon-settings"></use></svg>
                                Perfil
                            </button>
                            <button class="btn btn-danger" id="logoutBtn">
                                <svg class="icon"><use href="#icon-logout"></use></svg>
                                Sair
                            </button>
                        </div>
                    </div>
                    
                    <div class="stats-grid" id="statsGrid">
                        <!-- Stats serão carregadas dinamicamente -->
                    </div>
                    
                    <div class="dashboard-grid">
                        <div class="dashboard-section">
                            <div class="section-header">
                                <h2>Ações rápidas</h2>
                            </div>
                            <div class="quick-actions">
                                <a href="#/dashboard/students" class="action-card">
                                    <div class="action-icon">
                                        <svg class="icon icon-lg"><use href="#icon-users"></use></svg>
                                    </div>
                                    <h3>Gerenciar Alunos</h3>
                                    <p>Cadastre e acompanhe seus alunos</p>
                                </a>
                                
                                <a href="#/dashboard/exercises" class="action-card">
                                    <div class="action-icon">
                                        <svg class="icon icon-lg"><use href="#icon-exercise"></use></svg>
                                    </div>
                                    <h3>Biblioteca de Exercícios</h3>
                                    <p>Crie e organize exercícios</p>
                                </a>
                                
                                <a href="#/dashboard/workouts" class="action-card">
                                    <div class="action-icon">
                                        <svg class="icon icon-lg"><use href="#icon-workout"></use></svg>
                                    </div>
                                    <h3>Criar Treinos</h3>
                                    <p>Monte treinos personalizados</p>
                                </a>
                            </div>
                        </div>
                        
                        <div class="dashboard-section">
                            <div class="section-header">
                                <h2>Atividade recente</h2>
                            </div>
                            <div class="activity-feed" id="activityFeed">
                                <!-- Atividades serão carregadas dinamicamente -->
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        await this.loadStats(trainer.id);
        await this.loadRecentActivity(trainer.id);
    },

    async loadStats(trainerId) {
        try {
            const stats = await API.dashboard.getStats(trainerId);
            
            const statsGrid = document.getElementById('statsGrid');
            statsGrid.innerHTML = `
                <div class="stat-card">
                    <div class="stat-icon">
                        <svg class="icon icon-lg"><use href="#icon-users"></use></svg>
                    </div>
                    <div class="stat-content">
                        <div class="stat-number">${stats.students_count}</div>
                        <div class="stat-label">Alunos</div>
                    </div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-icon">
                        <svg class="icon icon-lg"><use href="#icon-exercise"></use></svg>
                    </div>
                    <div class="stat-content">
                        <div class="stat-number">${stats.exercises_count}</div>
                        <div class="stat-label">Exercícios</div>
                    </div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-icon">
                        <svg class="icon icon-lg"><use href="#icon-workout"></use></svg>
                    </div>
                    <div class="stat-content">
                        <div class="stat-number">${stats.workouts_count}</div>
                        <div class="stat-label">Treinos</div>
                    </div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-icon">
                        <svg class="icon icon-lg"><use href="#icon-dashboard"></use></svg>
                    </div>
                    <div class="stat-content">
                        <div class="stat-number">${stats.active_workouts}</div>
                        <div class="stat-label">Ativos</div>
                    </div>
                </div>
            `;
        } catch (error) {
            console.error('Erro ao carregar estatísticas:', error);
        }
    },

    async loadRecentActivity(trainerId) {
        const activityFeed = document.getElementById('activityFeed');
        
        // Simula atividades recentes
        const activities = [
            {
                type: 'student',
                icon: 'users',
                title: 'Novo aluno cadastrado',
                description: 'João Silva foi adicionado à sua lista',
                time: '2 horas atrás'
            },
            {
                type: 'workout',
                icon: 'workout',
                title: 'Treino criado',
                description: 'Treino "Corpo Todo" para Maria Santos',
                time: '1 dia atrás'
            },
            {
                type: 'exercise',
                icon: 'exercise',
                title: 'Exercício adicionado',
                description: 'Agachamento foi adicionado à biblioteca',
                time: '2 dias atrás'
            }
        ];
        
        activityFeed.innerHTML = activities.map(activity => `
            <div class="activity-item">
                <div class="activity-icon">
                    <svg class="icon"><use href="#icon-${activity.icon}"></use></svg>
                </div>
                <div class="activity-content">
                    <h4>${activity.title}</h4>
                    <p>${activity.description}</p>
                    <span class="activity-time">${activity.time}</span>
                </div>
            </div>
        `).join('');
    },

    mount(container) {
        // Botão de logout
        const logoutBtn = container.querySelector('#logoutBtn');
        logoutBtn.addEventListener('click', async () => {
            const confirmed = await UI.Modal.confirm({
                title: 'Confirmar logout',
                message: 'Tem certeza que deseja sair?',
                confirmText: 'Sair',
                cancelText: 'Cancelar'
            });
            
            if (confirmed) {
                Auth.logout();
            }
        });
        
        // Botão de perfil (placeholder)
        const profileBtn = container.querySelector('#profileBtn');
        profileBtn.addEventListener('click', () => {
            UI.Toast.info('Funcionalidade em desenvolvimento');
        });
    }
};

// Estilos específicos do dashboard
const dashboardStyle = document.createElement('style');
dashboardStyle.textContent = `
    .dashboard-container {
        padding: 2rem 0;
    }
    
    .dashboard-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 3rem;
        gap: 2rem;
    }
    
    .welcome-section h1 {
        font-size: 2rem;
        font-weight: 700;
        margin: 0 0 0.5rem;
    }
    
    .welcome-section p {
        color: var(--muted);
        margin: 0;
        font-size: 1.125rem;
    }
    
    .header-actions {
        display: flex;
        gap: 1rem;
        flex-shrink: 0;
    }
    
    .stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1.5rem;
        margin-bottom: 3rem;
    }
    
    .stat-card {
        background: var(--glass-bg);
        border: 1px solid var(--glass-border);
        border-radius: var(--radius-lg);
        padding: 1.5rem;
        backdrop-filter: var(--glass-blur);
        display: flex;
        align-items: center;
        gap: 1rem;
        transition: var(--transition);
    }
    
    .stat-card:hover {
        transform: translateY(-2px);
        box-shadow: var(--shadow-lg);
        border-color: var(--primary);
    }
    
    .stat-icon {
        width: 3rem;
        height: 3rem;
        background: linear-gradient(135deg, var(--primary), var(--accent));
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        flex-shrink: 0;
    }
    
    .stat-content {
        flex: 1;
    }
    
    .stat-number {
        font-size: 2rem;
        font-weight: 800;
        color: var(--text);
        line-height: 1;
    }
    
    .stat-label {
        font-size: 0.875rem;
        color: var(--muted);
        text-transform: uppercase;
        letter-spacing: 0.05em;
        margin-top: 0.25rem;
    }
    
    .dashboard-grid {
        display: grid;
        grid-template-columns: 2fr 1fr;
        gap: 3rem;
    }
    
    .dashboard-section {
        background: var(--glass-bg);
        border: 1px solid var(--glass-border);
        border-radius: var(--radius-xl);
        padding: 2rem;
        backdrop-filter: var(--glass-blur);
    }
    
    .section-header {
        margin-bottom: 2rem;
    }
    
    .section-header h2 {
        font-size: 1.5rem;
        font-weight: 600;
        margin: 0;
    }
    
    .quick-actions {
        display: grid;
        gap: 1.5rem;
    }
    
    .action-card {
        background: var(--glass-bg);
        border: 1px solid var(--glass-border);
        border-radius: var(--radius-lg);
        padding: 1.5rem;
        text-decoration: none;
        color: inherit;
        transition: var(--transition);
        display: flex;
        align-items: center;
        gap: 1rem;
    }
    
    .action-card:hover {
        transform: translateY(-2px);
        box-shadow: var(--shadow-lg);
        border-color: var(--primary);
        background: linear-gradient(145deg, rgba(0,100,255,.05), rgba(0,190,220,.02));
    }
    
    .action-icon {
        width: 3rem;
        height: 3rem;
        background: linear-gradient(135deg, var(--primary), var(--accent));
        border-radius: var(--radius-md);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        flex-shrink: 0;
    }
    
    .action-card h3 {
        font-size: 1.125rem;
        font-weight: 600;
        margin: 0 0 0.25rem;
    }
    
    .action-card p {
        color: var(--muted);
        margin: 0;
        font-size: 0.875rem;
    }
    
    .activity-feed {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }
    
    .activity-item {
        display: flex;
        align-items: flex-start;
        gap: 1rem;
        padding: 1rem;
        background: var(--glass-bg);
        border: 1px solid var(--glass-border);
        border-radius: var(--radius-md);
        transition: var(--transition);
    }
    
    .activity-item:hover {
        background: rgba(255, 255, 255, 0.05);
    }
    
    .activity-icon {
        width: 2.5rem;
        height: 2.5rem;
        background: var(--elev-2);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--primary);
        flex-shrink: 0;
    }
    
    .activity-content {
        flex: 1;
    }
    
    .activity-content h4 {
        font-size: 0.875rem;
        font-weight: 600;
        margin: 0 0 0.25rem;
    }
    
    .activity-content p {
        font-size: 0.875rem;
        color: var(--muted);
        margin: 0 0 0.5rem;
        line-height: 1.4;
    }
    
    .activity-time {
        font-size: 0.75rem;
        color: var(--muted);
        opacity: 0.8;
    }
    
    @media (max-width: 1024px) {
        .dashboard-grid {
            grid-template-columns: 1fr;
            gap: 2rem;
        }
    }
    
    @media (max-width: 768px) {
        .dashboard-header {
            flex-direction: column;
            align-items: stretch;
        }
        
        .header-actions {
            justify-content: flex-end;
        }
        
        .stats-grid {
            grid-template-columns: repeat(2, 1fr);
        }
        
        .action-card {
            flex-direction: column;
            text-align: center;
        }
        
        .action-icon {
            align-self: center;
        }
    }
    
    @media (max-width: 480px) {
        .stats-grid {
            grid-template-columns: 1fr;
        }
        
        .header-actions {
            flex-direction: column;
        }
    }
`;
document.head.appendChild(dashboardStyle);
