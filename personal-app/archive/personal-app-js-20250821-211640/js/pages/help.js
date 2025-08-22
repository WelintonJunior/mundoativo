/**
 * Página de Ajuda e Documentação
 * Sistema Personal App - Mundo Ativo
 */

window.Pages = window.Pages || {};

window.Pages.help = {
    async render(container, context) {
        container.innerHTML = `
            <div class="help-container">
                <div class="container">
                    <div class="page-header">
                        <h1>Ajuda e Documentação</h1>
                        <p>Guias e informações para usar a plataforma</p>
                    </div>
                    
                    <div class="help-content">
                        <div class="help-sidebar">
                            <nav class="help-nav">
                                <ul>
                                    <li><a href="#getting-started" class="help-link active">Primeiros Passos</a></li>
                                    <li><a href="#students" class="help-link">Gerenciar Alunos</a></li>
                                    <li><a href="#exercises" class="help-link">Biblioteca de Exercícios</a></li>
                                    <li><a href="#workouts" class="help-link">Criar Treinos</a></li>
                                    <li><a href="#tips" class="help-link">Dicas e Truques</a></li>
                                    <li><a href="#technical" class="help-link">Informações Técnicas</a></li>
                                </ul>
                            </nav>
                        </div>
                        
                        <div class="help-main">
                            <div class="help-section active" id="getting-started">
                                <h2>Primeiros Passos</h2>
                                <div class="help-card">
                                    <h3>Bem-vindo ao Personal App</h3>
                                    <p>Este sistema foi desenvolvido para ajudar personal trainers a gerenciar seus alunos, exercícios e treinos de forma eficiente.</p>
                                    
                                    <h4>Como começar:</h4>
                                    <ol>
                                        <li><strong>Cadastre seus alunos:</strong> Vá para "Gerenciar Alunos" e adicione as informações básicas</li>
                                        <li><strong>Crie exercícios:</strong> Monte sua biblioteca pessoal de exercícios</li>
                                        <li><strong>Monte treinos:</strong> Combine exercícios para criar treinos personalizados</li>
                                        <li><strong>Acompanhe o progresso:</strong> Use o dashboard para monitorar suas atividades</li>
                                    </ol>
                                </div>
                                
                                <div class="help-card">
                                    <h3>Navegação</h3>
                                    <p>Use o menu superior para navegar entre as diferentes seções:</p>
                                    <ul>
                                        <li><strong>Dashboard:</strong> Visão geral e estatísticas</li>
                                        <li><strong>Alunos:</strong> Cadastro e gerenciamento de alunos</li>
                                        <li><strong>Exercícios:</strong> Biblioteca de exercícios</li>
                                        <li><strong>Treinos:</strong> Criação e gerenciamento de treinos</li>
                                    </ul>
                                </div>
                            </div>
                            
                            <div class="help-section" id="students">
                                <h2>Gerenciar Alunos</h2>
                                <div class="help-card">
                                    <h3>Cadastro de Alunos</h3>
                                    <p>Para cadastrar um novo aluno:</p>
                                    <ol>
                                        <li>Clique em "Novo Aluno" na página de alunos</li>
                                        <li>Preencha as informações básicas (nome e email são obrigatórios)</li>
                                        <li>Adicione dados físicos como peso e altura</li>
                                        <li>Defina objetivos e observações importantes</li>
                                        <li>Opcionalmente, adicione uma foto</li>
                                    </ol>
                                </div>
                                
                                <div class="help-card">
                                    <h3>Funcionalidades</h3>
                                    <ul>
                                        <li><strong>Busca:</strong> Use a barra de busca para encontrar alunos rapidamente</li>
                                        <li><strong>Filtros:</strong> Ordene por nome, email ou data de cadastro</li>
                                        <li><strong>Exportação:</strong> Exporte dados dos alunos em formato CSV</li>
                                        <li><strong>Edição:</strong> Clique em "Editar" para atualizar informações</li>
                                    </ul>
                                </div>
                            </div>
                            
                            <div class="help-section" id="exercises">
                                <h2>Biblioteca de Exercícios</h2>
                                <div class="help-card">
                                    <h3>Criando Exercícios</h3>
                                    <p>Para criar um novo exercício:</p>
                                    <ol>
                                        <li>Clique em "Novo Exercício"</li>
                                        <li>Defina nome, categoria e grupo muscular</li>
                                        <li>Adicione descrição e instruções detalhadas</li>
                                        <li>Especifique equipamentos necessários</li>
                                        <li>Defina nível de dificuldade</li>
                                        <li>Adicione imagens ou vídeos explicativos</li>
                                    </ol>
                                </div>
                                
                                <div class="help-card">
                                    <h3>Organização</h3>
                                    <ul>
                                        <li><strong>Categorias:</strong> Força, Cardio, Flexibilidade, Equilíbrio</li>
                                        <li><strong>Grupos Musculares:</strong> Peito, Costas, Ombros, Braços, Pernas, Core</li>
                                        <li><strong>Filtros:</strong> Use os filtros para encontrar exercícios específicos</li>
                                        <li><strong>Busca:</strong> Procure por nome, grupo muscular ou equipamento</li>
                                    </ul>
                                </div>
                            </div>
                            
                            <div class="help-section" id="workouts">
                                <h2>Criar Treinos</h2>
                                <div class="help-card">
                                    <h3>Montando um Treino</h3>
                                    <p>Para criar um treino personalizado:</p>
                                    <ol>
                                        <li>Clique em "Novo Treino"</li>
                                        <li>Defina nome e selecione o aluno</li>
                                        <li>Adicione descrição e duração estimada</li>
                                        <li>Escolha o nível de dificuldade</li>
                                        <li>Adicione exercícios da sua biblioteca</li>
                                        <li>Configure séries, repetições e descanso</li>
                                    </ol>
                                </div>
                                
                                <div class="help-card">
                                    <h3>Dicas para Treinos Eficazes</h3>
                                    <ul>
                                        <li>Varie os grupos musculares trabalhados</li>
                                        <li>Ajuste a intensidade ao nível do aluno</li>
                                        <li>Inclua aquecimento e alongamento</li>
                                        <li>Defina tempos de descanso adequados</li>
                                        <li>Monitore o progresso regularmente</li>
                                    </ul>
                                </div>
                            </div>
                            
                            <div class="help-section" id="tips">
                                <h2>Dicas e Truques</h2>
                                <div class="help-card">
                                    <h3>Produtividade</h3>
                                    <ul>
                                        <li>Use atalhos de teclado quando disponíveis</li>
                                        <li>Aproveite os filtros para encontrar informações rapidamente</li>
                                        <li>Mantenha as informações dos alunos sempre atualizadas</li>
                                        <li>Crie templates de treinos para diferentes objetivos</li>
                                        <li>Use as funcionalidades de busca para economizar tempo</li>
                                    </ul>
                                </div>
                                
                                <div class="help-card">
                                    <h3>Melhores Práticas</h3>
                                    <ul>
                                        <li>Documente bem os exercícios com instruções claras</li>
                                        <li>Adicione fotos ou vídeos aos exercícios</li>
                                        <li>Mantenha backup regular dos dados importantes</li>
                                        <li>Revise e atualize treinos periodicamente</li>
                                        <li>Use as observações para registrar progressos</li>
                                    </ul>
                                </div>
                            </div>
                            
                            <div class="help-section" id="technical">
                                <h2>Informações Técnicas</h2>
                                <div class="help-card">
                                    <h3>Sobre o Sistema</h3>
                                    <p>Este é um sistema web estático (SPA) desenvolvido especificamente para personal trainers. Todas as informações são armazenadas localmente no seu navegador.</p>
                                    
                                    <h4>Características:</h4>
                                    <ul>
                                        <li><strong>Offline:</strong> Funciona sem conexão com internet</li>
                                        <li><strong>Seguro:</strong> Dados ficam apenas no seu dispositivo</li>
                                        <li><strong>Rápido:</strong> Interface responsiva e otimizada</li>
                                        <li><strong>Compatível:</strong> Funciona em qualquer navegador moderno</li>
                                    </ul>
                                </div>
                                
                                <div class="help-card">
                                    <h3>Armazenamento de Dados</h3>
                                    <p>Os dados são salvos no localStorage do navegador. Para fazer backup:</p>
                                    <ol>
                                        <li>Use as funcionalidades de exportação</li>
                                        <li>Salve os arquivos CSV em local seguro</li>
                                        <li>Para migração, importe os dados em outro dispositivo</li>
                                    </ol>
                                    
                                    <div class="warning-box">
                                        <p><strong>⚠️ Importante:</strong> Limpar dados do navegador apagará todas as informações. Sempre mantenha backups atualizados.</p>
                                    </div>
                                </div>
                                
                                <div class="help-card">
                                    <h3>Suporte e Desenvolvimento</h3>
                                    <p>Este sistema foi desenvolvido como parte do projeto Mundo Ativo, utilizando tecnologias web modernas para oferecer uma experiência completa e profissional.</p>
                                    
                                    <p><strong>Tecnologias utilizadas:</strong></p>
                                    <ul>
                                        <li>HTML5, CSS3, JavaScript (ES6+)</li>
                                        <li>LocalStorage para persistência</li>
                                        <li>Design responsivo e acessível</li>
                                        <li>Arquitetura SPA com roteamento</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    mount(container) {
        // Navegação entre seções
        const helpLinks = container.querySelectorAll('.help-link');
        const helpSections = container.querySelectorAll('.help-section');
        
        helpLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                
                const targetId = link.getAttribute('href').substring(1);
                
                // Remove active class from all links and sections
                helpLinks.forEach(l => l.classList.remove('active'));
                helpSections.forEach(s => s.classList.remove('active'));
                
                // Add active class to clicked link and target section
                link.classList.add('active');
                const targetSection = container.querySelector(`#${targetId}`);
                if (targetSection) {
                    targetSection.classList.add('active');
                }
            });
        });
    }
};

// Estilos específicos da página de ajuda
const helpStyle = document.createElement('style');
helpStyle.textContent = `
    .help-container {
        padding: 2rem 0;
    }
    
    .help-content {
        display: grid;
        grid-template-columns: 250px 1fr;
        gap: 3rem;
        margin-top: 2rem;
    }
    
    .help-sidebar {
        position: sticky;
        top: 2rem;
        height: fit-content;
    }
    
    .help-nav ul {
        list-style: none;
        padding: 0;
        margin: 0;
        background: var(--glass-bg);
        border: 1px solid var(--glass-border);
        border-radius: var(--radius-lg);
        backdrop-filter: var(--glass-blur);
        overflow: hidden;
    }
    
    .help-nav li {
        border-bottom: 1px solid var(--glass-border);
    }
    
    .help-nav li:last-child {
        border-bottom: none;
    }
    
    .help-link {
        display: block;
        padding: 1rem 1.5rem;
        color: var(--text);
        text-decoration: none;
        transition: var(--transition);
        font-weight: 500;
    }
    
    .help-link:hover {
        background: rgba(0, 100, 255, 0.1);
        color: var(--primary);
    }
    
    .help-link.active {
        background: var(--primary);
        color: white;
    }
    
    .help-main {
        position: relative;
    }
    
    .help-section {
        display: none;
    }
    
    .help-section.active {
        display: block;
    }
    
    .help-section h2 {
        font-size: 2rem;
        font-weight: 700;
        margin: 0 0 2rem;
        color: var(--primary);
    }
    
    .help-card {
        background: var(--glass-bg);
        border: 1px solid var(--glass-border);
        border-radius: var(--radius-lg);
        padding: 2rem;
        margin-bottom: 2rem;
        backdrop-filter: var(--glass-blur);
    }
    
    .help-card h3 {
        font-size: 1.5rem;
        font-weight: 600;
        margin: 0 0 1rem;
        color: var(--accent);
    }
    
    .help-card h4 {
        font-size: 1.125rem;
        font-weight: 600;
        margin: 1.5rem 0 0.75rem;
        color: var(--text);
    }
    
    .help-card p {
        line-height: 1.6;
        margin-bottom: 1rem;
        color: var(--muted);
    }
    
    .help-card ul,
    .help-card ol {
        line-height: 1.6;
        margin-bottom: 1rem;
        padding-left: 1.5rem;
    }
    
    .help-card li {
        margin-bottom: 0.5rem;
        color: var(--muted);
    }
    
    .help-card li strong {
        color: var(--text);
    }
    
    .warning-box {
        background: rgba(240, 70, 40, 0.1);
        border: 1px solid rgba(240, 70, 40, 0.3);
        border-radius: var(--radius-md);
        padding: 1rem;
        margin: 1rem 0;
    }
    
    .warning-box p {
        margin: 0;
        color: var(--danger);
    }
    
    @media (max-width: 1024px) {
        .help-content {
            grid-template-columns: 1fr;
            gap: 2rem;
        }
        
        .help-sidebar {
            position: static;
        }
        
        .help-nav ul {
            display: flex;
            overflow-x: auto;
            white-space: nowrap;
        }
        
        .help-nav li {
            border-bottom: none;
            border-right: 1px solid var(--glass-border);
            flex-shrink: 0;
        }
        
        .help-nav li:last-child {
            border-right: none;
        }
        
        .help-link {
            padding: 1rem;
            white-space: nowrap;
        }
    }
    
    @media (max-width: 768px) {
        .help-card {
            padding: 1.5rem;
        }
        
        .help-section h2 {
            font-size: 1.5rem;
        }
        
        .help-card h3 {
            font-size: 1.25rem;
        }
    }
`;
document.head.appendChild(helpStyle);
