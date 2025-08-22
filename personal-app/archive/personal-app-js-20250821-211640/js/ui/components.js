/**
 * Componentes UI reutilizáveis
 * Sistema Personal App - Mundo Ativo
 */

/**
 * Cria card básico
 * @param {object} options - Opções do card
 * @returns {HTMLElement} Elemento card
 */
function createCard(options = {}) {
    const {
        title = '',
        content = '',
        footer = '',
        className = '',
        clickable = false,
        onClick = null
    } = options;
    
    const card = document.createElement('div');
    card.className = `card ${className}`;
    
    if (clickable) {
        card.style.cursor = 'pointer';
        card.addEventListener('click', onClick);
    }
    
    if (title) {
        const header = document.createElement('div');
        header.className = 'card-header';
        header.innerHTML = `<h3>${title}</h3>`;
        card.appendChild(header);
    }
    
    if (content) {
        const body = document.createElement('div');
        body.className = 'card-body';
        
        if (typeof content === 'string') {
            body.innerHTML = content;
        } else if (content instanceof HTMLElement) {
            body.appendChild(content);
        }
        
        card.appendChild(body);
    }
    
    if (footer) {
        const footerEl = document.createElement('div');
        footerEl.className = 'card-footer';
        
        if (typeof footer === 'string') {
            footerEl.innerHTML = footer;
        } else if (footer instanceof HTMLElement) {
            footerEl.appendChild(footer);
        }
        
        card.appendChild(footerEl);
    }
    
    return card;
}

/**
 * Cria input com label
 * @param {object} options - Opções do input
 * @returns {HTMLElement} Container do input
 */
function createInput(options = {}) {
    const {
        type = 'text',
        name = '',
        label = '',
        placeholder = '',
        required = false,
        value = '',
        className = ''
    } = options;
    
    const container = document.createElement('div');
    container.className = 'form-group';
    
    if (label) {
        const labelEl = document.createElement('label');
        labelEl.className = 'form-label';
        labelEl.textContent = label;
        labelEl.setAttribute('for', name);
        container.appendChild(labelEl);
    }
    
    const input = document.createElement('input');
    input.type = type;
    input.name = name;
    input.id = name;
    input.className = `form-input ${className}`;
    input.placeholder = placeholder;
    input.required = required;
    input.value = value;
    
    container.appendChild(input);
    
    return container;
}

/**
 * Cria textarea com label
 * @param {object} options - Opções do textarea
 * @returns {HTMLElement} Container do textarea
 */
function createTextarea(options = {}) {
    const {
        name = '',
        label = '',
        placeholder = '',
        required = false,
        value = '',
        rows = 4,
        className = ''
    } = options;
    
    const container = document.createElement('div');
    container.className = 'form-group';
    
    if (label) {
        const labelEl = document.createElement('label');
        labelEl.className = 'form-label';
        labelEl.textContent = label;
        labelEl.setAttribute('for', name);
        container.appendChild(labelEl);
    }
    
    const textarea = document.createElement('textarea');
    textarea.name = name;
    textarea.id = name;
    textarea.className = `form-input form-textarea ${className}`;
    textarea.placeholder = placeholder;
    textarea.required = required;
    textarea.value = value;
    textarea.rows = rows;
    
    container.appendChild(textarea);
    
    return container;
}

/**
 * Cria select com label
 * @param {object} options - Opções do select
 * @returns {HTMLElement} Container do select
 */
function createSelect(options = {}) {
    const {
        name = '',
        label = '',
        options: selectOptions = [],
        required = false,
        value = '',
        className = ''
    } = options;
    
    const container = document.createElement('div');
    container.className = 'form-group';
    
    if (label) {
        const labelEl = document.createElement('label');
        labelEl.className = 'form-label';
        labelEl.textContent = label;
        labelEl.setAttribute('for', name);
        container.appendChild(labelEl);
    }
    
    const select = document.createElement('select');
    select.name = name;
    select.id = name;
    select.className = `form-input form-select ${className}`;
    select.required = required;
    
    selectOptions.forEach(option => {
        const optionEl = document.createElement('option');
        optionEl.value = option.value;
        optionEl.textContent = option.label;
        
        if (option.value === value) {
            optionEl.selected = true;
        }
        
        select.appendChild(optionEl);
    });
    
    container.appendChild(select);
    
    return container;
}

/**
 * Cria botão
 * @param {object} options - Opções do botão
 * @returns {HTMLElement} Elemento botão
 */
function createButton(options = {}) {
    const {
        text = 'Botão',
        type = 'button',
        variant = 'primary', // primary, secondary, success, danger
        size = 'medium', // small, medium, large
        icon = '',
        disabled = false,
        onClick = null,
        className = ''
    } = options;
    
    const button = document.createElement('button');
    button.type = type;
    button.className = `btn btn-${variant} btn-${size} ${className}`;
    button.disabled = disabled;
    
    if (onClick) {
        button.addEventListener('click', onClick);
    }
    
    let content = '';
    if (icon) {
        content += `<svg class="icon"><use href="#icon-${icon}"></use></svg>`;
    }
    content += text;
    
    button.innerHTML = content;
    
    return button;
}

/**
 * Cria skeleton loader
 * @param {object} options - Opções do skeleton
 * @returns {HTMLElement} Elemento skeleton
 */
function createSkeleton(options = {}) {
    const {
        width = '100%',
        height = '1rem',
        className = ''
    } = options;
    
    const skeleton = document.createElement('div');
    skeleton.className = `skeleton ${className}`;
    skeleton.style.width = width;
    skeleton.style.height = height;
    
    return skeleton;
}

/**
 * Cria loading spinner
 * @param {object} options - Opções do spinner
 * @returns {HTMLElement} Elemento spinner
 */
function createSpinner(options = {}) {
    const {
        size = 'medium', // small, medium, large
        text = '',
        className = ''
    } = options;
    
    const container = document.createElement('div');
    container.className = `spinner-container ${className}`;
    container.style.textAlign = 'center';
    container.style.padding = '2rem';
    
    const spinner = document.createElement('div');
    spinner.className = `spinner spinner-${size}`;
    spinner.innerHTML = `
        <svg class="icon" style="animation: spin 1s linear infinite;">
            <use href="#icon-settings"></use>
        </svg>
    `;
    
    container.appendChild(spinner);
    
    if (text) {
        const textEl = document.createElement('p');
        textEl.textContent = text;
        textEl.style.marginTop = '1rem';
        textEl.style.color = 'var(--muted)';
        container.appendChild(textEl);
    }
    
    return container;
}

/**
 * Cria badge
 * @param {object} options - Opções do badge
 * @returns {HTMLElement} Elemento badge
 */
function createBadge(options = {}) {
    const {
        text = '',
        variant = 'primary', // primary, secondary, success, warning, danger
        size = 'medium', // small, medium, large
        className = ''
    } = options;
    
    const badge = document.createElement('span');
    badge.className = `badge badge-${variant} badge-${size} ${className}`;
    badge.textContent = text;
    
    return badge;
}

/**
 * Cria tabela responsiva
 * @param {object} options - Opções da tabela
 * @returns {HTMLElement} Container da tabela
 */
function createTable(options = {}) {
    const {
        headers = [],
        rows = [],
        className = '',
        striped = true,
        hoverable = true
    } = options;
    
    const container = document.createElement('div');
    container.className = 'table-container';
    container.style.overflowX = 'auto';
    
    const table = document.createElement('table');
    table.className = `table ${className}`;
    
    if (striped) table.classList.add('table-striped');
    if (hoverable) table.classList.add('table-hover');
    
    // Header
    if (headers.length > 0) {
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        
        headers.forEach(header => {
            const th = document.createElement('th');
            th.textContent = header;
            headerRow.appendChild(th);
        });
        
        thead.appendChild(headerRow);
        table.appendChild(thead);
    }
    
    // Body
    const tbody = document.createElement('tbody');
    
    rows.forEach(row => {
        const tr = document.createElement('tr');
        
        row.forEach(cell => {
            const td = document.createElement('td');
            
            if (typeof cell === 'string') {
                td.textContent = cell;
            } else if (cell instanceof HTMLElement) {
                td.appendChild(cell);
            }
            
            tr.appendChild(td);
        });
        
        tbody.appendChild(tr);
    });
    
    table.appendChild(tbody);
    container.appendChild(table);
    
    return container;
}

/**
 * Cria pagination
 * @param {object} options - Opções da paginação
 * @returns {HTMLElement} Container da paginação
 */
function createPagination(options = {}) {
    const {
        currentPage = 1,
        totalPages = 1,
        onPageChange = null,
        className = ''
    } = options;
    
    const container = document.createElement('div');
    container.className = `pagination ${className}`;
    container.style.display = 'flex';
    container.style.gap = '0.5rem';
    container.style.justifyContent = 'center';
    container.style.alignItems = 'center';
    
    // Botão anterior
    const prevBtn = createButton({
        text: 'Anterior',
        variant: 'secondary',
        size: 'small',
        disabled: currentPage === 1,
        onClick: () => {
            if (onPageChange && currentPage > 1) {
                onPageChange(currentPage - 1);
            }
        }
    });
    
    container.appendChild(prevBtn);
    
    // Números das páginas
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, currentPage + 2);
    
    for (let i = startPage; i <= endPage; i++) {
        const pageBtn = createButton({
            text: i.toString(),
            variant: i === currentPage ? 'primary' : 'secondary',
            size: 'small',
            onClick: () => {
                if (onPageChange && i !== currentPage) {
                    onPageChange(i);
                }
            }
        });
        
        container.appendChild(pageBtn);
    }
    
    // Botão próximo
    const nextBtn = createButton({
        text: 'Próximo',
        variant: 'secondary',
        size: 'small',
        disabled: currentPage === totalPages,
        onClick: () => {
            if (onPageChange && currentPage < totalPages) {
                onPageChange(currentPage + 1);
            }
        }
    });
    
    container.appendChild(nextBtn);
    
    return container;
}

// Adiciona estilos para spinner e badges
const componentsStyle = document.createElement('style');
componentsStyle.textContent = `
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
    
    .badge {
        display: inline-flex;
        align-items: center;
        padding: 0.25rem 0.5rem;
        border-radius: var(--radius-sm);
        font-size: 0.75rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.025em;
    }
    
    .badge-small { padding: 0.125rem 0.375rem; font-size: 0.625rem; }
    .badge-large { padding: 0.375rem 0.75rem; font-size: 0.875rem; }
    
    .badge-primary { background: var(--primary); color: white; }
    .badge-secondary { background: var(--muted); color: white; }
    .badge-success { background: var(--success); color: white; }
    .badge-warning { background: var(--warning); color: white; }
    .badge-danger { background: var(--danger); color: white; }
    
    .card-header {
        padding-bottom: 1rem;
        border-bottom: 1px solid var(--glass-border);
        margin-bottom: 1rem;
    }
    
    .card-header h3 {
        margin: 0;
        font-size: 1.25rem;
        font-weight: 600;
    }
    
    .card-footer {
        padding-top: 1rem;
        border-top: 1px solid var(--glass-border);
        margin-top: 1rem;
    }
    
    .table-striped tbody tr:nth-child(even) {
        background: rgba(255, 255, 255, 0.02);
    }
    
    .table-hover tbody tr:hover {
        background: rgba(255, 255, 255, 0.05);
    }
`;
document.head.appendChild(componentsStyle);

// Exporta para uso global
window.UI = window.UI || {};
window.UI.Components = {
    createCard,
    createInput,
    createTextarea,
    createSelect,
    createButton,
    createSkeleton,
    createSpinner,
    createBadge,
    createTable,
    createPagination
};
