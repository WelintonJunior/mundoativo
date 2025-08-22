/**
 * Página de DevOps e Ferramentas de Desenvolvimento
 * Sistema Personal App - Mundo Ativo
 */

window.Pages = window.Pages || {};

window.Pages.devops = {
    async render(container, context) {
        container.innerHTML = `
            <div class="devops-container">
                <div class="container">
                    <div class="page-header">
                        <h1>🛠️ DevOps & Desenvolvimento</h1>
                        <p>Ferramentas para desenvolvimento e migração</p>
                    </div>
                    
                    <div class="devops-grid">
                        <div class="devops-section">
                            <h2>📊 Status do Sistema</h2>
                            <div class="status-grid" id="systemStatus">
                                <!-- Status será carregado dinamicamente -->
                            </div>
                        </div>
                        
                        <div class="devops-section">
                            <h2>💾 Gerenciamento de Dados</h2>
                            <div class="data-management">
                                <button class="btn btn-primary" id="exportAllBtn">
                                    <svg class="icon"><use href="#icon-download"></use></svg>
                                    Exportar Todos os Dados
                                </button>
                                <button class="btn btn-secondary" id="importDataBtn">
                                    <svg class="icon"><use href="#icon-upload"></use></svg>
                                    Importar Dados
                                </button>
                                <button class="btn btn-danger" id="clearDataBtn">
                                    <svg class="icon"><use href="#icon-delete"></use></svg>
                                    Limpar Todos os Dados
                                </button>
                            </div>
                        </div>
                        
                        <div class="devops-section">
                            <h2>🔧 Ferramentas de Debug</h2>
                            <div class="debug-tools">
                                <button class="btn btn-ghost" id="showLogsBtn">
                                    <svg class="icon"><use href="#icon-list"></use></svg>
                                    Ver Logs
                                </button>
                                <button class="btn btn-ghost" id="generateDataBtn">
                                    <svg class="icon"><use href="#icon-add"></use></svg>
                                    Gerar Dados de Teste
                                </button>
                                <button class="btn btn-ghost" id="validateDataBtn">
                                    <svg class="icon"><use href="#icon-check"></use></svg>
                                    Validar Integridade
                                </button>
                            </div>
                        </div>
                        
                        <div class="devops-section">
                            <h2>📈 Métricas</h2>
                            <div class="metrics-display" id="metricsDisplay">
                                <!-- Métricas serão carregadas dinamicamente -->
                            </div>
                        </div>
                    </div>
                    
                    <div class="devops-info">
                        <h2>ℹ️ Informações do Sistema</h2>
                        <div class="info-grid">
                            <div class="info-card">
                                <h3>Versão</h3>
                                <p>Personal App v1.0.0</p>
                            </div>
                            <div class="info-card">
                                <h3>Tecnologias</h3>
                                <p>HTML5, CSS3, JavaScript ES6+</p>
                            </div>
                            <div class="info-card">
                                <h3>Armazenamento</h3>
                                <p>LocalStorage (Client-side)</p>
                            </div>
                            <div class="info-card">
                                <h3>Arquitetura</h3>
                                <p>SPA com Hash Routing</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Modal de Logs -->
            <div class="modal" id="logsModal">
                <div class="modal-content modal-lg">
                    <div class="modal-header">
                        <h2>📋 Logs do Sistema</h2>
                        <button class="modal-close" id="closeLogsModal">
                            <svg class="icon"><use href="#icon-close"></use></svg>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="logs-container" id="logsContainer">
                            <!-- Logs serão carregados aqui -->
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-secondary" id="clearLogsBtn">Limpar Logs</button>
                        <button class="btn btn-primary" id="exportLogsBtn">Exportar Logs</button>
                    </div>
                </div>
            </div>
        `;
        
        await this.loadSystemStatus();
        await this.loadMetrics();
    },

    async loadSystemStatus() {
        const statusContainer = document.getElementById('systemStatus');
        
        const status = {
            localStorage: this.checkLocalStorage(),
            dataIntegrity: await this.checkDataIntegrity(),
            apiMock: this.checkApiMock(),
            routing: this.checkRouting()
        };
        
        statusContainer.innerHTML = Object.entries(status).map(([key, value]) => `
            <div class="status-item ${value.status}">
                <div class="status-icon">
                    <svg class="icon"><use href="#icon-${value.status === 'ok' ? 'check' : 'alert'}"></use></svg>
                </div>
                <div class="status-content">
                    <h4>${value.name}</h4>
                    <p>${value.message}</p>
                </div>
            </div>
        `).join('');
    },

    async loadMetrics() {
        const metricsContainer = document.getElementById('metricsDisplay');
        
        const metrics = await this.getSystemMetrics();
        
        metricsContainer.innerHTML = `
            <div class="metrics-grid">
                <div class="metric-item">
                    <h4>Uso do LocalStorage</h4>
                    <p>${metrics.storageUsage}</p>
                </div>
                <div class="metric-item">
                    <h4>Total de Registros</h4>
                    <p>${metrics.totalRecords}</p>
                </div>
                <div class="metric-item">
                    <h4>Última Atividade</h4>
                    <p>${metrics.lastActivity}</p>
                </div>
                <div class="metric-item">
                    <h4>Tempo de Sessão</h4>
                    <p>${metrics.sessionTime}</p>
                </div>
            </div>
        `;
    },

    checkLocalStorage() {
        try {
            const testKey = 'test-storage';
            localStorage.setItem(testKey, 'test');
            localStorage.removeItem(testKey);
            return {
                status: 'ok',
                name: 'LocalStorage',
                message: 'Funcionando corretamente'
            };
        } catch (error) {
            return {
                status: 'error',
                name: 'LocalStorage',
                message: 'Erro de acesso'
            };
        }
    },

    async checkDataIntegrity() {
        try {
            const data = {
                trainers: JSON.parse(localStorage.getItem('personal_app_trainers') || '[]'),
                students: JSON.parse(localStorage.getItem('personal_app_students') || '[]'),
                exercises: JSON.parse(localStorage.getItem('personal_app_exercises') || '[]'),
                workouts: JSON.parse(localStorage.getItem('personal_app_workouts') || '[]')
            };
            
            const issues = [];
            
            // Verifica estrutura básica
            Object.entries(data).forEach(([key, items]) => {
                if (!Array.isArray(items)) {
                    issues.push(`${key} não é um array válido`);
                }
            });
            
            return {
                status: issues.length === 0 ? 'ok' : 'warning',
                name: 'Integridade dos Dados',
                message: issues.length === 0 ? 'Dados íntegros' : `${issues.length} problemas encontrados`
            };
        } catch (error) {
            return {
                status: 'error',
                name: 'Integridade dos Dados',
                message: 'Erro ao verificar dados'
            };
        }
    },

    checkApiMock() {
        try {
            const hasAPI = window.API && typeof window.API.init === 'function';
            return {
                status: hasAPI ? 'ok' : 'error',
                name: 'Mock API',
                message: hasAPI ? 'API carregada' : 'API não encontrada'
            };
        } catch (error) {
            return {
                status: 'error',
                name: 'Mock API',
                message: 'Erro na API'
            };
        }
    },

    checkRouting() {
        try {
            const hasRouter = window.Router && typeof window.Router.navigate === 'function';
            return {
                status: hasRouter ? 'ok' : 'error',
                name: 'Sistema de Rotas',
                message: hasRouter ? 'Router funcionando' : 'Router não encontrado'
            };
        } catch (error) {
            return {
                status: 'error',
                name: 'Sistema de Rotas',
                message: 'Erro no router'
            };
        }
    },

    async getSystemMetrics() {
        const storageKeys = Object.keys(localStorage).filter(key => key.startsWith('personal_app_'));
        const totalSize = storageKeys.reduce((size, key) => {
            return size + localStorage.getItem(key).length;
        }, 0);
        
        const data = {
            trainers: JSON.parse(localStorage.getItem('personal_app_trainers') || '[]'),
            students: JSON.parse(localStorage.getItem('personal_app_students') || '[]'),
            exercises: JSON.parse(localStorage.getItem('personal_app_exercises') || '[]'),
            workouts: JSON.parse(localStorage.getItem('personal_app_workouts') || '[]')
        };
        
        const totalRecords = Object.values(data).reduce((total, items) => total + items.length, 0);
        
        return {
            storageUsage: `${(totalSize / 1024).toFixed(2)} KB`,
            totalRecords: totalRecords.toString(),
            lastActivity: new Date().toLocaleString('pt-BR'),
            sessionTime: this.getSessionTime()
        };
    },

    getSessionTime() {
        const sessionStart = sessionStorage.getItem('session_start');
        if (!sessionStart) {
            sessionStorage.setItem('session_start', Date.now().toString());
            return '0 min';
        }
        
        const elapsed = Date.now() - parseInt(sessionStart);
        const minutes = Math.floor(elapsed / 60000);
        return `${minutes} min`;
    },

    async exportAllData() {
        try {
            const data = {
                version: '1.0.0',
                exported_at: new Date().toISOString(),
                trainers: JSON.parse(localStorage.getItem('personal_app_trainers') || '[]'),
                students: JSON.parse(localStorage.getItem('personal_app_students') || '[]'),
                exercises: JSON.parse(localStorage.getItem('personal_app_exercises') || '[]'),
                workouts: JSON.parse(localStorage.getItem('personal_app_workouts') || '[]'),
                testimonials: JSON.parse(localStorage.getItem('personal_app_testimonials') || '[]'),
                leads: JSON.parse(localStorage.getItem('personal_app_leads') || '[]')
            };
            
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `personal-app-backup-${new Date().toISOString().split('T')[0]}.json`;
            link.click();
            URL.revokeObjectURL(url);
            
            UI.Toast.success('Backup exportado com sucesso');
        } catch (error) {
            UI.Toast.error('Erro ao exportar dados');
        }
    },

    async generateTestData() {
        try {
            // Gera dados de teste
            const testTrainer = {
                id: IdGenerator.generate('trainer'),
                name: 'João Silva',
                email: 'joao@teste.com',
                passwordHash: 'mock-hash',
                role: 'trainer',
                created_at: IdGenerator.generateTimestamp()
            };
            
            const testStudents = [
                {
                    id: IdGenerator.generate('student'),
                    trainer_id: testTrainer.id,
                    name: 'Maria Santos',
                    email: 'maria@teste.com',
                    phone: '(11) 99999-9999',
                    weight: 65,
                    height: 165,
                    goals: 'Perder peso e ganhar condicionamento',
                    created_at: IdGenerator.generateTimestamp()
                },
                {
                    id: IdGenerator.generate('student'),
                    trainer_id: testTrainer.id,
                    name: 'Pedro Oliveira',
                    email: 'pedro@teste.com',
                    phone: '(11) 88888-8888',
                    weight: 80,
                    height: 180,
                    goals: 'Ganhar massa muscular',
                    created_at: IdGenerator.generateTimestamp()
                }
            ];
            
            const testExercises = [
                {
                    id: IdGenerator.generate('exercise'),
                    trainer_id: testTrainer.id,
                    name: 'Agachamento',
                    category: 'strength',
                    muscle_group: 'legs',
                    equipment: 'Peso corporal',
                    difficulty: 'beginner',
                    duration: 30,
                    description: 'Exercício fundamental para pernas',
                    created_at: IdGenerator.generateTimestamp()
                },
                {
                    id: IdGenerator.generate('exercise'),
                    trainer_id: testTrainer.id,
                    name: 'Flexão de braço',
                    category: 'strength',
                    muscle_group: 'chest',
                    equipment: 'Peso corporal',
                    difficulty: 'intermediate',
                    duration: 20,
                    description: 'Exercício para peito e braços',
                    created_at: IdGenerator.generateTimestamp()
                }
            ];
            
            // Salva dados de teste
            await API.auth.register({
                name: testTrainer.name,
                email: testTrainer.email,
                password: 'teste123'
            });
            
            for (const student of testStudents) {
                await API.students.create(testTrainer.id, student);
            }
            
            for (const exercise of testExercises) {
                await API.exercises.create(testTrainer.id, exercise);
            }
            
            UI.Toast.success('Dados de teste gerados com sucesso');
            await this.loadSystemStatus();
            await this.loadMetrics();
        } catch (error) {
            UI.Toast.error('Erro ao gerar dados de teste');
        }
    },

    mount(container) {
        // Exportar todos os dados
        const exportAllBtn = container.querySelector('#exportAllBtn');
        exportAllBtn.addEventListener('click', () => this.exportAllData());
        
        // Limpar dados
        const clearDataBtn = container.querySelector('#clearDataBtn');
        clearDataBtn.addEventListener('click', async () => {
            const confirmed = await UI.Modal.confirm({
                title: 'Limpar Todos os Dados',
                message: 'Esta ação irá remover TODOS os dados do sistema. Esta ação não pode ser desfeita!',
                confirmText: 'Limpar Tudo',
                cancelText: 'Cancelar'
            });
            
            if (confirmed) {
                Object.keys(localStorage).forEach(key => {
                    if (key.startsWith('personal_app_')) {
                        localStorage.removeItem(key);
                    }
                });
                UI.Toast.success('Todos os dados foram removidos');
                setTimeout(() => window.location.reload(), 1000);
            }
        });
        
        // Gerar dados de teste
        const generateDataBtn = container.querySelector('#generateDataBtn');
        generateDataBtn.addEventListener('click', () => this.generateTestData());
        
        // Ver logs
        const showLogsBtn = container.querySelector('#showLogsBtn');
        showLogsBtn.addEventListener('click', () => {
            const modal = container.querySelector('#logsModal');
            const logsContainer = modal.querySelector('#logsContainer');
            
            const logs = JSON.parse(localStorage.getItem('personal_app_logs') || '[]');
            
            if (logs.length === 0) {
                logsContainer.innerHTML = '<p>Nenhum log disponível</p>';
            } else {
                logsContainer.innerHTML = logs.map(log => `
                    <div class="log-entry log-${log.level}">
                        <span class="log-time">${new Date(log.timestamp).toLocaleString('pt-BR')}</span>
                        <span class="log-level">[${log.level.toUpperCase()}]</span>
                        <span class="log-message">${log.message}</span>
                        ${log.data ? `<pre class="log-data">${JSON.stringify(log.data, null, 2)}</pre>` : ''}
                    </div>
                `).join('');
            }
            
            UI.Modal.open(modal);
        });
        
        // Modal de logs
        const logsModal = container.querySelector('#logsModal');
        const closeLogsBtn = logsModal.querySelector('#closeLogsModal');
        closeLogsBtn.addEventListener('click', () => UI.Modal.close());
        
        // Validar dados
        const validateDataBtn = container.querySelector('#validateDataBtn');
        validateDataBtn.addEventListener('click', async () => {
            await this.loadSystemStatus();
            UI.Toast.info('Validação de dados concluída');
        });
    }
};

// Estilos específicos da página DevOps
const devopsStyle = document.createElement('style');
devopsStyle.textContent = `
    .devops-container { padding: 2rem 0; }
    .devops-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; margin-bottom: 3rem; }
    .devops-section { background: var(--glass-bg); border: 1px solid var(--glass-border); border-radius: var(--radius-lg); padding: 2rem; backdrop-filter: var(--glass-blur); }
    .devops-section h2 { margin: 0 0 1.5rem; font-size: 1.25rem; }
    .status-grid { display: grid; gap: 1rem; }
    .status-item { display: flex; align-items: center; gap: 1rem; padding: 1rem; border-radius: var(--radius-md); }
    .status-item.ok { background: rgba(0, 200, 120, 0.1); border: 1px solid rgba(0, 200, 120, 0.3); }
    .status-item.warning { background: rgba(255, 193, 7, 0.1); border: 1px solid rgba(255, 193, 7, 0.3); }
    .status-item.error { background: rgba(240, 70, 40, 0.1); border: 1px solid rgba(240, 70, 40, 0.3); }
    .status-icon { width: 2rem; height: 2rem; display: flex; align-items: center; justify-content: center; border-radius: 50%; }
    .status-item.ok .status-icon { background: var(--mint); color: white; }
    .status-item.warning .status-icon { background: #ffc107; color: white; }
    .status-item.error .status-icon { background: var(--danger); color: white; }
    .status-content h4 { margin: 0 0 0.25rem; font-size: 0.875rem; font-weight: 600; }
    .status-content p { margin: 0; font-size: 0.75rem; color: var(--muted); }
    .data-management, .debug-tools { display: flex; flex-direction: column; gap: 1rem; }
    .metrics-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; }
    .metric-item { text-align: center; padding: 1rem; background: var(--elev-2); border-radius: var(--radius-md); }
    .metric-item h4 { margin: 0 0 0.5rem; font-size: 0.875rem; color: var(--muted); }
    .metric-item p { margin: 0; font-size: 1.25rem; font-weight: 600; }
    .info-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; }
    .info-card { padding: 1.5rem; background: var(--glass-bg); border: 1px solid var(--glass-border); border-radius: var(--radius-md); text-align: center; }
    .info-card h3 { margin: 0 0 0.5rem; font-size: 1rem; color: var(--primary); }
    .info-card p { margin: 0; font-size: 0.875rem; color: var(--muted); }
    .logs-container { max-height: 400px; overflow-y: auto; }
    .log-entry { padding: 0.75rem; margin-bottom: 0.5rem; border-radius: var(--radius-sm); font-family: monospace; font-size: 0.875rem; }
    .log-entry.log-info { background: rgba(0, 100, 255, 0.1); }
    .log-entry.log-warn { background: rgba(255, 193, 7, 0.1); }
    .log-entry.log-error { background: rgba(240, 70, 40, 0.1); }
    .log-time { color: var(--muted); margin-right: 0.5rem; }
    .log-level { font-weight: 600; margin-right: 0.5rem; }
    .log-data { margin-top: 0.5rem; padding: 0.5rem; background: var(--elev-2); border-radius: var(--radius-sm); overflow-x: auto; }
    @media (max-width: 768px) { .devops-grid { grid-template-columns: 1fr; } .metrics-grid { grid-template-columns: 1fr; } }
`;
document.head.appendChild(devopsStyle);
