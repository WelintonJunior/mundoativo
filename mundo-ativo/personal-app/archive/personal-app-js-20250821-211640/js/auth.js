/**
 * Sistema de autenticação
 * Sistema Personal App - Mundo Ativo
 */

/**
 * Define token de autenticação
 * @param {string} token - Token para armazenar
 */
function setToken(token) {
    localStorage.setItem('pa_auth_token', token);
}

/**
 * Obtém token de autenticação
 * @returns {string|null} Token armazenado
 */
function getToken() {
    return localStorage.getItem('pa_auth_token');
}

/**
 * Remove token e faz logout
 */
function logout() {
    localStorage.removeItem('pa_auth_token');
    window.location.hash = '#/';
}

/**
 * Verifica se usuário está autenticado e retorna dados
 * @returns {Promise<object>} Dados do trainer autenticado
 */
async function requireAuth() {
    const token = getToken();
    
    if (!token) {
        window.location.hash = '#/login';
        throw new Error('Token não encontrado');
    }
    
    try {
        const trainer = await API.auth.me(token);
        return trainer;
    } catch (error) {
        // Token inválido, remove e redireciona
        logout();
        throw error;
    }
}

/**
 * Verifica se usuário está autenticado (sem redirecionamento)
 * @returns {Promise<object|null>} Dados do trainer ou null
 */
async function checkAuth() {
    const token = getToken();
    
    if (!token) {
        return null;
    }
    
    try {
        const trainer = await API.auth.me(token);
        return trainer;
    } catch (error) {
        // Token inválido, remove
        localStorage.removeItem('pa_auth_token');
        return null;
    }
}

/**
 * Valida política de senha no cliente
 * @param {string} password - Senha para validar
 * @returns {object} Resultado da validação
 */
function validatePasswordPolicy(password) {
    return Validators.validatePassword(password);
}

/**
 * Mostra erros de validação inline em formulário
 * @param {object} errors - Objeto com erros por campo
 */
function showFormErrors(errors) {
    // Remove erros anteriores
    document.querySelectorAll('.form-error').forEach(el => el.remove());
    
    // Adiciona novos erros
    for (const [field, fieldErrors] of Object.entries(errors)) {
        const input = document.querySelector(`[name="${field}"]`);
        if (input && fieldErrors.length > 0) {
            const errorDiv = document.createElement('div');
            errorDiv.className = 'form-error';
            errorDiv.style.color = 'var(--danger)';
            errorDiv.style.fontSize = '0.875rem';
            errorDiv.style.marginTop = '0.25rem';
            errorDiv.textContent = fieldErrors[0];
            
            input.parentNode.appendChild(errorDiv);
            input.style.borderColor = 'var(--danger)';
        }
    }
}

/**
 * Limpa erros de formulário
 */
function clearFormErrors() {
    document.querySelectorAll('.form-error').forEach(el => el.remove());
    document.querySelectorAll('.form-input').forEach(input => {
        input.style.borderColor = '';
    });
}

/**
 * Configura validação em tempo real para senha
 * @param {HTMLInputElement} passwordInput - Input de senha
 * @param {HTMLElement} feedbackElement - Elemento para mostrar feedback
 */
function setupPasswordValidation(passwordInput, feedbackElement) {
    passwordInput.addEventListener('input', () => {
        const password = passwordInput.value;
        const validation = validatePasswordPolicy(password);
        
        if (password.length === 0) {
            feedbackElement.innerHTML = '';
            passwordInput.style.borderColor = '';
            return;
        }
        
        if (validation.valid) {
            feedbackElement.innerHTML = '<span style="color: var(--success);">✓ Senha válida</span>';
            passwordInput.style.borderColor = 'var(--success)';
        } else {
            const errorList = validation.errors.map(error => `<li>${error}</li>`).join('');
            feedbackElement.innerHTML = `
                <div style="color: var(--danger);">
                    <strong>Requisitos da senha:</strong>
                    <ul style="margin: 0.5rem 0; padding-left: 1.5rem;">
                        ${errorList}
                    </ul>
                </div>
            `;
            passwordInput.style.borderColor = 'var(--danger)';
        }
    });
}

/**
 * Configura formulário de login
 * @param {HTMLFormElement} form - Formulário de login
 * @param {Function} onSuccess - Callback de sucesso
 */
function setupLoginForm(form, onSuccess) {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(form);
        const data = {
            email: formData.get('email'),
            password: formData.get('password')
        };
        
        clearFormErrors();
        
        // Validação client-side
        const errors = {};
        
        const emailValidation = Validators.validateEmail(data.email);
        if (!emailValidation.valid) {
            errors.email = emailValidation.errors;
        }
        
        if (!data.password) {
            errors.password = ['Senha é obrigatória'];
        }
        
        if (Object.keys(errors).length > 0) {
            showFormErrors(errors);
            return;
        }
        
        // Desabilita botão durante requisição
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Entrando...';
        
        try {
            const result = await API.auth.login(data);
            setToken(result.token);
            
            UI.Toast.show('Login realizado com sucesso!', 'success');
            
            if (onSuccess) {
                onSuccess(result.trainer);
            }
        } catch (error) {
            UI.Toast.show(error.message, 'error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    });
}

/**
 * Configura formulário de registro
 * @param {HTMLFormElement} form - Formulário de registro
 * @param {Function} onSuccess - Callback de sucesso
 */
function setupRegisterForm(form, onSuccess) {
    const passwordInput = form.querySelector('[name="password"]');
    const passwordFeedback = form.querySelector('#password-feedback');
    
    if (passwordInput && passwordFeedback) {
        setupPasswordValidation(passwordInput, passwordFeedback);
    }
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(form);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            password: formData.get('password'),
            confirmPassword: formData.get('confirmPassword')
        };
        
        clearFormErrors();
        
        // Validação client-side
        const errors = {};
        
        const nameValidation = Validators.validateTextLength(data.name, 2, 100, 'Nome');
        if (!nameValidation.valid) {
            errors.name = nameValidation.errors;
        }
        
        const emailValidation = Validators.validateEmail(data.email);
        if (!emailValidation.valid) {
            errors.email = emailValidation.errors;
        }
        
        const passwordValidation = validatePasswordPolicy(data.password);
        if (!passwordValidation.valid) {
            errors.password = passwordValidation.errors;
        }
        
        if (data.password !== data.confirmPassword) {
            errors.confirmPassword = ['Senhas não coincidem'];
        }
        
        if (Object.keys(errors).length > 0) {
            showFormErrors(errors);
            return;
        }
        
        // Desabilita botão durante requisição
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Criando conta...';
        
        try {
            const result = await API.auth.register(data);
            setToken(result.token);
            
            UI.Toast.show('Conta criada com sucesso!', 'success');
            
            if (onSuccess) {
                onSuccess(result.trainer);
            }
        } catch (error) {
            UI.Toast.show(error.message, 'error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    });
}

// Exporta funções para uso global
window.Auth = {
    init() {
        // Inicialização do sistema de autenticação
        console.log('Auth system initialized');
        return true;
    },
    setToken,
    getToken,
    logout,
    requireAuth,
    checkAuth,
    validatePasswordPolicy,
    showFormErrors,
    clearFormErrors,
    setupPasswordValidation,
    setupLoginForm,
    setupRegisterForm
};
