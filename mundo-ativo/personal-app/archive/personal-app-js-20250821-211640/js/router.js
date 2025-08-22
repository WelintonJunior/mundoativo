/**
 * Sistema de roteamento baseado em hash
 * Sistema Personal App - Mundo Ativo
 */

// Rotas da aplicação
const routes = {
    '/': 'landing',
    '/pricing': 'landing', // Mostra seção de preços na landing
    '/login': 'auth-login',
    '/register': 'auth-register',
    '/dashboard': 'dashboard',
    '/dashboard/students': 'students',
    '/dashboard/exercises': 'exercises',
    '/dashboard/workouts': 'workouts',
    '/dev': 'devops',
    '/help': 'help' // Página de ajuda/documentação
};

// Rotas protegidas (requerem autenticação)
const protectedRoutes = [
    '/dashboard',
    '/dashboard/students',
    '/dashboard/exercises',
    '/dashboard/workouts'
];

// Página atual
let currentPage = null;

/**
 * Navega para uma rota
 * @param {string} path - Caminho da rota
 */
function navigate(path) {
    window.location.hash = '#' + path;
}

/**
 * Obtém rota atual
 * @returns {string} Rota atual
 */
function getCurrentRoute() {
    const hash = window.location.hash.slice(1); // Remove #
    return hash || '/';
}

/**
 * Obtém parâmetros da URL
 * @returns {object} Parâmetros da URL
 */
function getRouteParams() {
    const params = new URLSearchParams(window.location.search);
    const result = {};
    
    for (const [key, value] of params) {
        result[key] = value;
    }
    
    return result;
}

/**
 * Carrega página
 * @param {string} pageName - Nome da página
 * @param {string} route - Rota atual
 */
async function loadPage(pageName, route) {
    const container = document.getElementById('app');
    
    // Verifica se página requer autenticação
    if (protectedRoutes.includes(route)) {
        try {
            await Auth.requireAuth();
        } catch (error) {
            return; // requireAuth já redireciona para login
        }
    }
    
    // Mostra loading
    container.innerHTML = UI.Components.createSpinner({
        text: 'Carregando...'
    }).outerHTML;
    
    try {
        // Carrega módulo da página
        const pageModule = window.Pages[pageName];
        
        if (!pageModule) {
            throw new Error(`Página ${pageName} não encontrada`);
        }
        
        // Renderiza página
        await pageModule.render(container, { route, params: getRouteParams() });
        
        // Monta página (event listeners, etc.)
        if (pageModule.mount) {
            pageModule.mount(container);
        }
        
        currentPage = pageName;
        
        // Atualiza navegação ativa
        updateActiveNavigation(route);
        
    } catch (error) {
        console.error('Erro ao carregar página:', error);
        container.innerHTML = `
            <div class="container">
                <div class="card" style="max-width: 500px; margin: 2rem auto;">
                    <div class="text-center">
                        <svg class="icon icon-lg mb-3" style="color: var(--danger);">
                            <use href="#icon-close"></use>
                        </svg>
                        <h2>Erro ao carregar página</h2>
                        <p style="color: var(--muted); margin: 1rem 0;">
                            ${error.message}
                        </p>
                        <button class="btn btn-primary" onclick="Router.navigate('/')">
                            Voltar ao início
                        </button>
                    </div>
                </div>
            </div>
        `;
    }
}

/**
 * Atualiza navegação ativa
 * @param {string} route - Rota atual
 */
function updateActiveNavigation(route) {
    // Remove classes ativas
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    // Adiciona classe ativa ao link correspondente
    const activeLink = document.querySelector(`[href="#${route}"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }
    
    // Atualiza título da página
    const pageTitles = {
        '/': 'Personal App - Mundo Ativo',
        '/login': 'Login - Personal App',
        '/register': 'Criar Conta - Personal App',
        '/dashboard': 'Dashboard - Personal App',
        '/dashboard/students': 'Alunos - Personal App',
        '/dashboard/exercises': 'Exercícios - Personal App',
        '/dashboard/workouts': 'Treinos - Personal App',
        '/dev': 'Dev Tools - Personal App',
        '/help': 'Ajuda - Personal App'
    };
    
    document.title = pageTitles[route] || 'Personal App - Mundo Ativo';
}

/**
 * Manipula mudança de rota
 */
function handleRouteChange() {
    const route = getCurrentRoute();
    const pageName = routes[route];
    
    if (pageName) {
        loadPage(pageName, route);
    } else {
        // Rota não encontrada, redireciona para home
        navigate('/');
    }
}

/**
 * Inicializa roteador
 */
function init() {
    // Escuta mudanças no hash
    window.addEventListener('hashchange', handleRouteChange);
    
    // Carrega rota inicial
    handleRouteChange();
    
    // Configura navegação mobile
    setupMobileNavigation();
}

/**
 * Configura navegação mobile
 */
function setupMobileNavigation() {
    const navToggle = document.getElementById('navToggle');
    const navMobile = document.getElementById('navMobile');
    
    if (navToggle && navMobile) {
        navToggle.addEventListener('click', () => {
            navMobile.classList.toggle('open');
            
            // Atualiza ícone
            const icon = navToggle.querySelector('use');
            if (navMobile.classList.contains('open')) {
                icon.setAttribute('href', '#icon-close');
            } else {
                icon.setAttribute('href', '#icon-menu');
            }
        });
        
        // Fecha menu ao clicar em link
        navMobile.addEventListener('click', (e) => {
            if (e.target.classList.contains('nav-link')) {
                navMobile.classList.remove('open');
                navToggle.querySelector('use').setAttribute('href', '#icon-menu');
            }
        });
        
        // Fecha menu ao clicar fora
        document.addEventListener('click', (e) => {
            if (!navToggle.contains(e.target) && !navMobile.contains(e.target)) {
                navMobile.classList.remove('open');
                navToggle.querySelector('use').setAttribute('href', '#icon-menu');
            }
        });
    }
}

/**
 * Middleware para verificar autenticação
 * @param {string} route - Rota a verificar
 * @returns {boolean} Se pode acessar a rota
 */
async function checkAuthMiddleware(route) {
    if (protectedRoutes.includes(route)) {
        const user = await Auth.checkAuth();
        return !!user;
    }
    return true;
}

/**
 * Adiciona classe CSS para navegação ativa
 */
const routerStyle = document.createElement('style');
routerStyle.textContent = `
    .nav-link.active {
        background: rgba(255, 255, 255, 0.2);
        color: var(--text-dark);
        font-weight: 700;
    }
    
    .nav-mobile.open {
        display: block !important;
    }
    
    @media (max-width: 768px) {
        .nav-mobile {
            display: none;
            position: fixed;
            top: 80px;
            left: 0;
            right: 0;
            background: var(--elev);
            border-top: 1px solid var(--glass-border);
            padding: 1rem;
            z-index: 999;
            box-shadow: var(--shadow-lg);
        }
        
        .nav-mobile .nav-link {
            display: block;
            padding: 1rem;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            color: var(--text);
            text-decoration: none;
            transition: var(--transition);
        }
        
        .nav-mobile .nav-link:hover {
            background: rgba(255, 255, 255, 0.1);
        }
        
        .nav-mobile .nav-link:last-child {
            border-bottom: none;
        }
    }
`;
document.head.appendChild(routerStyle);

// Exporta roteador para uso global
window.Router = {
    navigate,
    getCurrentRoute,
    getRouteParams,
    init,
    checkAuthMiddleware
};
