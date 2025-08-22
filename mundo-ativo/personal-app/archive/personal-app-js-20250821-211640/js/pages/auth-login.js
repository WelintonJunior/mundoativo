/**
 * Página de Login
 * Sistema Personal App - Mundo Ativo
 */

window.Pages = window.Pages || {};

window.Pages['auth-login'] = {
    async render(container, context) {
        container.innerHTML = `
            <div class="auth-container">
                <div class="auth-card">
                    <div class="auth-header">
                        <h1>Entrar na sua conta</h1>
                        <p>Acesse seu dashboard e gerencie seus alunos</p>
                    </div>
                    
                    <form class="auth-form" id="loginForm">
                        <div class="form-group">
                            <label class="form-label" for="email">Email</label>
                            <input 
                                type="email" 
                                id="email" 
                                name="email" 
                                class="form-input" 
                                placeholder="seu@email.com"
                                required
                                autocomplete="email"
                            >
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label" for="password">Senha</label>
                            <input 
                                type="password" 
                                id="password" 
                                name="password" 
                                class="form-input" 
                                placeholder="Sua senha"
                                required
                                autocomplete="current-password"
                            >
                        </div>
                        
                        <button type="submit" class="btn btn-primary w-full btn-lg">
                            <svg class="icon"><use href="#icon-login"></use></svg>
                            Entrar
                        </button>
                    </form>
                    
                    <div class="auth-divider">
                        <span>ou</span>
                    </div>
                    
                    <div class="auth-demo">
                        <h3>Conta de demonstração</h3>
                        <p>Use as credenciais abaixo para testar a plataforma:</p>
                        <div class="demo-credentials">
                            <div class="credential-item">
                                <strong>Email:</strong> admin@local
                            </div>
                            <div class="credential-item">
                                <strong>Senha:</strong> qualquer senha
                            </div>
                        </div>
                        <button type="button" class="btn btn-secondary w-full" id="demoLoginBtn">
                            Entrar com conta demo
                        </button>
                    </div>
                    
                    <div class="auth-footer">
                        <p>Não tem uma conta? 
                            <a href="#/register" class="auth-link">Criar conta grátis</a>
                        </p>
                    </div>
                </div>
            </div>
        `;
    },

    mount(container) {
        const form = container.querySelector('#loginForm');
        const demoBtn = container.querySelector('#demoLoginBtn');
        
        // Configura formulário de login
        Auth.setupLoginForm(form, (trainer) => {
            Router.navigate('/dashboard');
        });
        
        // Botão de login demo
        demoBtn.addEventListener('click', async () => {
            const emailInput = form.querySelector('[name="email"]');
            const passwordInput = form.querySelector('[name="password"]');
            
            emailInput.value = 'admin@local';
            passwordInput.value = 'demo';
            
            // Dispara submit do formulário
            form.dispatchEvent(new Event('submit'));
        });
        
        // Foca no primeiro input
        const firstInput = form.querySelector('input');
        if (firstInput) {
            firstInput.focus();
        }
    }
};

// Estilos específicos da página de auth
const authLoginStyle = document.createElement('style');
authLoginStyle.textContent = `
    .auth-container {
        min-height: calc(100vh - 200px);
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 2rem 1rem;
    }
    
    .auth-card {
        background: var(--glass-bg);
        border: 1px solid var(--glass-border);
        border-radius: var(--radius-xl);
        padding: 3rem;
        backdrop-filter: var(--glass-blur);
        box-shadow: var(--shadow-xl);
        width: 100%;
        max-width: 450px;
    }
    
    .auth-header {
        text-align: center;
        margin-bottom: 2rem;
    }
    
    .auth-header h1 {
        font-size: 1.75rem;
        font-weight: 700;
        margin: 0 0 0.5rem;
    }
    
    .auth-header p {
        color: var(--muted);
        margin: 0;
    }
    
    .auth-form {
        margin-bottom: 2rem;
    }
    
    .auth-divider {
        text-align: center;
        margin: 2rem 0;
        position: relative;
    }
    
    .auth-divider::before {
        content: '';
        position: absolute;
        top: 50%;
        left: 0;
        right: 0;
        height: 1px;
        background: var(--glass-border);
    }
    
    .auth-divider span {
        background: var(--bg);
        padding: 0 1rem;
        color: var(--muted);
        font-size: 0.875rem;
        position: relative;
    }
    
    .auth-demo {
        background: rgba(0, 190, 220, 0.05);
        border: 1px solid rgba(0, 190, 220, 0.2);
        border-radius: var(--radius-lg);
        padding: 1.5rem;
        margin-bottom: 2rem;
    }
    
    .auth-demo h3 {
        font-size: 1rem;
        font-weight: 600;
        margin: 0 0 0.5rem;
        color: var(--accent);
    }
    
    .auth-demo p {
        font-size: 0.875rem;
        color: var(--muted);
        margin: 0 0 1rem;
    }
    
    .demo-credentials {
        background: var(--glass-bg);
        border-radius: var(--radius-md);
        padding: 1rem;
        margin-bottom: 1rem;
        font-family: 'Courier New', monospace;
        font-size: 0.875rem;
    }
    
    .credential-item {
        margin-bottom: 0.5rem;
    }
    
    .credential-item:last-child {
        margin-bottom: 0;
    }
    
    .credential-item strong {
        color: var(--text);
        margin-right: 0.5rem;
    }
    
    .auth-footer {
        text-align: center;
        padding-top: 1.5rem;
        border-top: 1px solid var(--glass-border);
    }
    
    .auth-footer p {
        color: var(--muted);
        margin: 0;
    }
    
    .auth-link {
        color: var(--primary);
        text-decoration: none;
        font-weight: 600;
        transition: var(--transition);
    }
    
    .auth-link:hover {
        color: var(--primary-600);
        text-decoration: underline;
    }
    
    .form-error {
        color: var(--danger);
        font-size: 0.875rem;
        margin-top: 0.25rem;
    }
    
    @media (max-width: 480px) {
        .auth-card {
            padding: 2rem 1.5rem;
        }
        
        .auth-container {
            padding: 1rem;
        }
    }
`;
document.head.appendChild(authLoginStyle);
