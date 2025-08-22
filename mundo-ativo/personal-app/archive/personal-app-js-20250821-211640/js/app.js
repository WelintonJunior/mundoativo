/**
 * Aplicação Principal
 * Sistema Personal App - Mundo Ativo
 * 
 * Este arquivo inicializa e orquestra toda a aplicação SPA
 */

// Namespace global para a aplicação
window.App = {
    version: '1.0.0',
    initialized: false
};

// Namespace para páginas
window.Pages = window.Pages || {};

/**
 * Inicialização da aplicação
 */
async function initializeApp() {
    try {
        console.log('🚀 Inicializando Personal App - Mundo Ativo');
        
        // Inicializa componentes base
        await initializeComponents();
        
        // Configura roteamento
        Router.init();
        
        // Configura autenticação
        Auth.init();
        
        // Inicializa UI
        UI.Toast.init();
        UI.Modal.init();
        
        // Marca como inicializado
        App.initialized = true;
        
        console.log('✅ Aplicação inicializada com sucesso');
        
        // Navega para a rota inicial
        const currentHash = window.location.hash || '#/';
        Router.navigate(currentHash.substring(1));
        
    } catch (error) {
        console.error('❌ Erro ao inicializar aplicação:', error);
        
        // Exibe erro para o usuário
        document.body.innerHTML = `
            <div style="
                display: flex;
                align-items: center;
                justify-content: center;
                min-height: 100vh;
                background: var(--bg);
                color: var(--text);
                font-family: 'Cal Sans', sans-serif;
                text-align: center;
                padding: 2rem;
            ">
                <div>
                    <h1 style="color: var(--danger); margin-bottom: 1rem;">
                        Erro ao carregar aplicação
                    </h1>
                    <p style="color: var(--muted); margin-bottom: 2rem;">
                        Ocorreu um erro durante a inicialização. 
                        Tente recarregar a página.
                    </p>
                    <button 
                        onclick="window.location.reload()" 
                        style="
                            background: var(--primary);
                            color: white;
                            border: none;
                            padding: 0.75rem 1.5rem;
                            border-radius: 0.5rem;
                            cursor: pointer;
                            font-size: 1rem;
                        "
                    >
                        Recarregar Página
                    </button>
                </div>
            </div>
        `;
    }
}

/**
 * Inicializa componentes necessários
 */
async function initializeComponents() {
    // Verifica se todos os módulos necessários estão carregados
    const requiredModules = [
        'Router', 'Auth', 'API', 'UI', 'Validators', 'CSV', 'IdGenerator'
    ];
    
    const missingModules = requiredModules.filter(module => !window[module]);
    
    if (missingModules.length > 0) {
        throw new Error(`Módulos não carregados: ${missingModules.join(', ')}`);
    }
    
    // Inicializa dados mock se necessário
    await API.init();
    
    console.log('📦 Componentes carregados:', requiredModules.join(', '));
}

/**
 * Gerenciador de erros global
 */
window.addEventListener('error', (event) => {
    console.error('❌ Erro global capturado:', event.error);
    
    if (App.initialized && window.UI && UI.Toast) {
        UI.Toast.error('Ocorreu um erro inesperado. Tente novamente.');
    }
});

/**
 * Gerenciador de promises rejeitadas
 */
window.addEventListener('unhandledrejection', (event) => {
    console.error('❌ Promise rejeitada:', event.reason);
    
    if (App.initialized && window.UI && UI.Toast) {
        UI.Toast.error('Erro de conexão ou processamento.');
    }
    
    // Previne que o erro apareça no console
    event.preventDefault();
});

/**
 * Utilitários globais
 */
window.App.utils = {
    /**
     * Formata data para exibição
     */
    formatDate(date, options = {}) {
        const defaultOptions = {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            ...options
        };
        
        return new Date(date).toLocaleDateString('pt-BR', defaultOptions);
    },
    
    /**
     * Formata data e hora
     */
    formatDateTime(date) {
        return new Date(date).toLocaleString('pt-BR');
    },
    
    /**
     * Debounce para otimizar performance
     */
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    /**
     * Throttle para limitar execução
     */
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },
    
    /**
     * Gera cor baseada em string
     */
    stringToColor(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        
        const hue = hash % 360;
        return `hsl(${hue}, 70%, 60%)`;
    },
    
    /**
     * Copia texto para clipboard
     */
    async copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            if (UI.Toast) {
                UI.Toast.success('Copiado para a área de transferência');
            }
        } catch (error) {
            console.error('Erro ao copiar:', error);
            if (UI.Toast) {
                UI.Toast.error('Erro ao copiar texto');
            }
        }
    },
    
    /**
     * Sanitiza HTML para prevenir XSS
     */
    sanitizeHTML(str) {
        const temp = document.createElement('div');
        temp.textContent = str;
        return temp.innerHTML;
    }
};

/**
 * Configurações da aplicação
 */
window.App.config = {
    // Configurações de paginação
    pagination: {
        defaultPageSize: 10,
        maxPageSize: 100
    },
    
    // Configurações de upload
    upload: {
        maxFileSize: 5 * 1024 * 1024, // 5MB
        allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    },
    
    // Configurações de validação
    validation: {
        minPasswordLength: 6,
        maxNameLength: 100,
        maxDescriptionLength: 1000
    },
    
    // Configurações de UI
    ui: {
        toastDuration: 5000,
        animationDuration: 300,
        debounceDelay: 300
    }
};

/**
 * Estado global da aplicação
 */
window.App.state = {
    currentUser: null,
    currentPage: null,
    isLoading: false,
    
    // Getters e setters
    setLoading(loading) {
        this.isLoading = loading;
        document.body.classList.toggle('app-loading', loading);
    },
    
    setCurrentUser(user) {
        this.currentUser = user;
        document.body.classList.toggle('user-authenticated', !!user);
    },
    
    setCurrentPage(page) {
        this.currentPage = page;
        document.body.setAttribute('data-current-page', page || '');
    }
};

/**
 * Inicializa quando o DOM estiver pronto
 */
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}

/**
 * Exporta para uso global
 */
window.initializeApp = initializeApp;
