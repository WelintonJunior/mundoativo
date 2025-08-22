/**
 * Página de Registro
 * Sistema Personal App - Mundo Ativo
 */

window.Pages = window.Pages || {};

window.Pages['auth-register'] = {
    async render(container, context) {
        container.innerHTML = `
            <div class="auth-container">
                <div class="auth-card">
                    <div class="auth-header">
                        <h1>Criar sua conta</h1>
                        <p>Comece a gerenciar seus alunos hoje mesmo</p>
                    </div>
                    
                    <form class="auth-form" id="registerForm">
                        <div class="form-group">
                            <label class="form-label" for="name">Nome completo</label>
                            <input 
                                type="text" 
                                id="name" 
                                name="name" 
                                class="form-input" 
                                placeholder="Seu nome completo"
                                required
                                autocomplete="name"
                            >
                        </div>
                        
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
                                placeholder="Crie uma senha segura"
                                required
                                autocomplete="new-password"
                            >
                            <div id="password-feedback" class="password-feedback"></div>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label" for="confirmPassword">Confirmar senha</label>
                            <input 
                                type="password" 
                                id="confirmPassword" 
                                name="confirmPassword" 
                                class="form-input" 
                                placeholder="Digite a senha novamente"
                                required
                                autocomplete="new-password"
                            >
                        </div>
                        
                        <div class="form-group">
                            <label class="form-checkbox">
                                <input type="checkbox" name="terms" required>
                                <span class="checkmark"></span>
                                Aceito os <a href="#" class="auth-link">termos de uso</a> e 
                                <a href="#" class="auth-link">política de privacidade</a>
                            </label>
                        </div>
                        
                        <button type="submit" class="btn btn-primary w-full btn-lg">
                            <svg class="icon"><use href="#icon-add"></use></svg>
                            Criar conta grátis
                        </button>
                    </form>
                    
                    <div class="auth-footer">
                        <p>Já tem uma conta? 
                            <a href="#/login" class="auth-link">Fazer login</a>
                        </p>
                    </div>
                </div>
            </div>
        `;
    },

    mount(container) {
        const form = container.querySelector('#registerForm');
        
        // Configura formulário de registro
        Auth.setupRegisterForm(form, (trainer) => {
            Router.navigate('/dashboard');
        });
        
        // Foca no primeiro input
        const firstInput = form.querySelector('input');
        if (firstInput) {
            firstInput.focus();
        }
    }
};

// Adiciona estilos para checkbox customizado
const authRegisterStyle = document.createElement('style');
authRegisterStyle.textContent = `
    .password-feedback {
        margin-top: 0.5rem;
        font-size: 0.875rem;
    }
    
    .form-checkbox {
        display: flex;
        align-items: flex-start;
        gap: 0.75rem;
        cursor: pointer;
        font-size: 0.875rem;
        line-height: 1.4;
    }
    
    .form-checkbox input[type="checkbox"] {
        display: none;
    }
    
    .checkmark {
        width: 1.25rem;
        height: 1.25rem;
        border: 2px solid var(--glass-border);
        border-radius: var(--radius-sm);
        background: var(--glass-bg);
        display: flex;
        align-items: center;
        justify-content: center;
        transition: var(--transition);
        flex-shrink: 0;
        margin-top: 0.125rem;
    }
    
    .form-checkbox input[type="checkbox"]:checked + .checkmark {
        background: var(--primary);
        border-color: var(--primary);
    }
    
    .form-checkbox input[type="checkbox"]:checked + .checkmark::after {
        content: "✓";
        color: white;
        font-size: 0.875rem;
        font-weight: bold;
    }
    
    .form-checkbox:hover .checkmark {
        border-color: var(--primary);
    }
`;
document.head.appendChild(authRegisterStyle);
