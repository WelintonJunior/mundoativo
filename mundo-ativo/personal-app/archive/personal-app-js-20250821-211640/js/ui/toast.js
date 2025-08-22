/**
 * Sistema de notificações toast
 * Sistema Personal App - Mundo Ativo
 */

/**
 * Exibe notificação toast
 * @param {string} message - Mensagem a exibir
 * @param {string} type - Tipo da notificação (success, error, warning, info)
 * @param {number} duration - Duração em ms (0 = não remove automaticamente)
 */
function showToast(message, type = 'info', duration = 4000) {
    const container = document.getElementById('toast-container');
    
    // Cria elemento toast
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'polite');
    
    // Ícones por tipo
    const icons = {
        success: 'add',
        error: 'close',
        warning: 'settings',
        info: 'settings'
    };
    
    toast.innerHTML = `
        <div class="flex items-center gap-3">
            <svg class="icon">
                <use href="#icon-${icons[type]}"></use>
            </svg>
            <span class="flex-1">${message}</span>
            <button class="toast-close" aria-label="Fechar notificação">
                <svg class="icon icon-sm">
                    <use href="#icon-close"></use>
                </svg>
            </button>
        </div>
    `;
    
    // Botão fechar
    const closeBtn = toast.querySelector('.toast-close');
    closeBtn.addEventListener('click', () => removeToast(toast));
    
    // Adiciona ao container
    container.appendChild(toast);
    
    // Remove automaticamente se duration > 0
    if (duration > 0) {
        setTimeout(() => removeToast(toast), duration);
    }
    
    return toast;
}

/**
 * Remove toast com animação
 * @param {HTMLElement} toast - Elemento toast
 */
function removeToast(toast) {
    if (!toast || !toast.parentNode) return;
    
    toast.style.animation = 'slideOut 0.3s ease forwards';
    
    setTimeout(() => {
        if (toast.parentNode) {
            toast.parentNode.removeChild(toast);
        }
    }, 300);
}

/**
 * Remove todos os toasts
 */
function clearAllToasts() {
    const container = document.getElementById('toast-container');
    container.innerHTML = '';
}

/**
 * Exibe toast de sucesso
 * @param {string} message - Mensagem
 * @param {number} duration - Duração
 */
function showSuccess(message, duration = 4000) {
    return showToast(message, 'success', duration);
}

/**
 * Exibe toast de erro
 * @param {string} message - Mensagem
 * @param {number} duration - Duração
 */
function showError(message, duration = 6000) {
    return showToast(message, 'error', duration);
}

/**
 * Exibe toast de aviso
 * @param {string} message - Mensagem
 * @param {number} duration - Duração
 */
function showWarning(message, duration = 5000) {
    return showToast(message, 'warning', duration);
}

/**
 * Exibe toast de informação
 * @param {string} message - Mensagem
 * @param {number} duration - Duração
 */
function showInfo(message, duration = 4000) {
    return showToast(message, 'info', duration);
}

/**
 * Inicializa sistema de toasts
 */
function initToasts() {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        document.body.appendChild(container);
    }
    return true;
}

// Adiciona animação de saída ao CSS
const toastStyle = document.createElement('style');
toastStyle.textContent = `
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .toast-close {
        background: none;
        border: none;
        color: inherit;
        cursor: pointer;
        padding: 0.25rem;
        border-radius: var(--radius-sm);
        transition: var(--transition);
        opacity: 0.7;
    }
    
    .toast-close:hover {
        opacity: 1;
        background: rgba(255, 255, 255, 0.1);
    }
`;
document.head.appendChild(toastStyle);

// Exporta para uso global
window.UI = window.UI || {};
window.UI.Toast = {
    show: showToast,
    success: showSuccess,
    error: showError,
    warning: showWarning,
    info: showInfo,
    remove: removeToast,
    clearAll: clearAllToasts,
    init: initToasts
};
