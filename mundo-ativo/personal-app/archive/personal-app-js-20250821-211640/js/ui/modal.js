/**
 * Sistema de modais
 * Sistema Personal App - Mundo Ativo
 */

/**
 * Cria e exibe modal
 * @param {object} options - Opções do modal
 * @returns {object} Instância do modal
 */
function createModal(options = {}) {
    const {
        title = 'Modal',
        content = '',
        size = 'medium', // small, medium, large
        closable = true,
        onClose = null
    } = options;
    
    // Container do modal
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-labelledby', 'modal-title');
    
    // Modal
    const modal = document.createElement('div');
    modal.className = `modal modal-${size}`;
    
    // Header
    const header = document.createElement('div');
    header.className = 'modal-header';
    
    const titleElement = document.createElement('h2');
    titleElement.className = 'modal-title';
    titleElement.id = 'modal-title';
    titleElement.textContent = title;
    
    header.appendChild(titleElement);
    
    if (closable) {
        const closeBtn = document.createElement('button');
        closeBtn.className = 'modal-close';
        closeBtn.setAttribute('aria-label', 'Fechar modal');
        closeBtn.innerHTML = '<svg class="icon"><use href="#icon-close"></use></svg>';
        
        closeBtn.addEventListener('click', () => {
            closeModal();
        });
        
        header.appendChild(closeBtn);
    }
    
    // Body
    const body = document.createElement('div');
    body.className = 'modal-body';
    
    if (typeof content === 'string') {
        body.innerHTML = content;
    } else if (content instanceof HTMLElement) {
        body.appendChild(content);
    }
    
    // Monta modal
    modal.appendChild(header);
    modal.appendChild(body);
    overlay.appendChild(modal);
    
    // Adiciona ao DOM
    const container = document.getElementById('modal-container');
    container.appendChild(overlay);
    
    // Focus trap
    const focusableElements = modal.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    // Foca primeiro elemento
    if (firstElement) {
        firstElement.focus();
    }
    
    // Trap focus
    function trapFocus(e) {
        if (e.key === 'Tab') {
            if (e.shiftKey) {
                if (document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement.focus();
                }
            } else {
                if (document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement.focus();
                }
            }
        }
    }
    
    // Event listeners
    function handleKeydown(e) {
        if (e.key === 'Escape' && closable) {
            closeModal();
        } else {
            trapFocus(e);
        }
    }
    
    function handleOverlayClick(e) {
        if (e.target === overlay && closable) {
            closeModal();
        }
    }
    
    overlay.addEventListener('keydown', handleKeydown);
    overlay.addEventListener('click', handleOverlayClick);
    
    // Função para fechar modal
    function closeModal() {
        // Remove event listeners
        overlay.removeEventListener('keydown', handleKeydown);
        overlay.removeEventListener('click', handleOverlayClick);
        
        // Remove do DOM
        container.removeChild(overlay);
        
        // Callback de fechamento
        if (onClose) {
            onClose();
        }
        
        // Restaura foco
        const lastFocused = document.querySelector('[data-last-focused]');
        if (lastFocused) {
            lastFocused.focus();
            lastFocused.removeAttribute('data-last-focused');
        }
    }
    
    // Salva elemento com foco atual
    const currentFocused = document.activeElement;
    if (currentFocused) {
        currentFocused.setAttribute('data-last-focused', 'true');
    }
    
    // Retorna instância do modal
    return {
        element: overlay,
        modal,
        body,
        close: closeModal,
        
        // Métodos utilitários
        setContent(newContent) {
            if (typeof newContent === 'string') {
                body.innerHTML = newContent;
            } else if (newContent instanceof HTMLElement) {
                body.innerHTML = '';
                body.appendChild(newContent);
            }
        },
        
        setTitle(newTitle) {
            titleElement.textContent = newTitle;
        },
        
        addFooter(footerContent) {
            let footer = modal.querySelector('.modal-footer');
            if (!footer) {
                footer = document.createElement('div');
                footer.className = 'modal-footer';
                modal.appendChild(footer);
            }
            
            if (typeof footerContent === 'string') {
                footer.innerHTML = footerContent;
            } else if (footerContent instanceof HTMLElement) {
                footer.appendChild(footerContent);
            }
            
            return footer;
        }
    };
}

/**
 * Cria modal de confirmação
 * @param {object} options - Opções do modal
 * @returns {Promise<boolean>} Resultado da confirmação
 */
function confirmModal(options = {}) {
    const {
        title = 'Confirmação',
        message = 'Tem certeza?',
        confirmText = 'Confirmar',
        cancelText = 'Cancelar',
        type = 'warning' // warning, danger, info
    } = options;
    
    return new Promise((resolve) => {
        const content = document.createElement('div');
        content.innerHTML = `
            <div class="text-center mb-4">
                <div class="icon-lg mb-3" style="color: var(--${type === 'danger' ? 'danger' : 'warning'});">
                    <svg class="icon icon-lg">
                        <use href="#icon-${type === 'danger' ? 'delete' : 'settings'}"></use>
                    </svg>
                </div>
                <p style="font-size: 1.1rem;">${message}</p>
            </div>
        `;
        
        const modal = createModal({
            title,
            content,
            closable: true,
            onClose: () => resolve(false)
        });
        
        // Footer com botões
        const footer = document.createElement('div');
        footer.className = 'flex gap-3 justify-center';
        
        const cancelBtn = document.createElement('button');
        cancelBtn.className = 'btn btn-secondary';
        cancelBtn.textContent = cancelText;
        cancelBtn.addEventListener('click', () => {
            modal.close();
            resolve(false);
        });
        
        const confirmBtn = document.createElement('button');
        confirmBtn.className = `btn ${type === 'danger' ? 'btn-danger' : 'btn-primary'}`;
        confirmBtn.textContent = confirmText;
        confirmBtn.addEventListener('click', () => {
            modal.close();
            resolve(true);
        });
        
        footer.appendChild(cancelBtn);
        footer.appendChild(confirmBtn);
        
        modal.addFooter(footer);
        
        // Foca botão de cancelar por padrão
        setTimeout(() => cancelBtn.focus(), 100);
    });
}

/**
 * Cria modal de alerta
 * @param {object} options - Opções do modal
 */
function alertModal(options = {}) {
    const {
        title = 'Aviso',
        message = '',
        type = 'info', // info, success, warning, error
        buttonText = 'OK'
    } = options;
    
    return new Promise((resolve) => {
        const iconMap = {
            info: 'settings',
            success: 'add',
            warning: 'settings',
            error: 'close'
        };
        
        const colorMap = {
            info: 'primary',
            success: 'success',
            warning: 'warning',
            error: 'danger'
        };
        
        const content = document.createElement('div');
        content.innerHTML = `
            <div class="text-center mb-4">
                <div class="icon-lg mb-3" style="color: var(--${colorMap[type]});">
                    <svg class="icon icon-lg">
                        <use href="#icon-${iconMap[type]}"></use>
                    </svg>
                </div>
                <p style="font-size: 1.1rem;">${message}</p>
            </div>
        `;
        
        const modal = createModal({
            title,
            content,
            closable: true,
            onClose: () => resolve()
        });
        
        // Footer com botão OK
        const footer = document.createElement('div');
        footer.className = 'text-center';
        
        const okBtn = document.createElement('button');
        okBtn.className = 'btn btn-primary';
        okBtn.textContent = buttonText;
        okBtn.addEventListener('click', () => {
            modal.close();
            resolve();
        });
        
        footer.appendChild(okBtn);
        modal.addFooter(footer);
        
        // Foca botão OK
        setTimeout(() => okBtn.focus(), 100);
    });
}

/**
 * Fecha todos os modais abertos
 */
function closeAllModals() {
    const container = document.getElementById('modal-container');
    container.innerHTML = '';
}

/**
 * Inicializa sistema de modais
 */
function initModalSystem() {
    let container = document.getElementById('modal-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'modal-container';
        document.body.appendChild(container);
    }
    return true;
}

// Exporta para uso global
window.UI = window.UI || {};
window.UI.Modal = {
    create: createModal,
    confirm: confirmModal,
    alert: alertModal,
    closeAll: closeAllModals,
    init: initModalSystem
};
