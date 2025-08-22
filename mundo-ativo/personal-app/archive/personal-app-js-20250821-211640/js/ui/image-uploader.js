/**
 * Componente de upload de imagens
 * Sistema Personal App - Mundo Ativo
 */

/**
 * Cria componente de upload de imagem
 * @param {object} options - Opções do uploader
 * @returns {HTMLElement} Container do uploader
 */
function createImageUploader(options = {}) {
    const {
        accept = 'image/*',
        maxSize = 5 * 1024 * 1024, // 5MB
        preview = true,
        multiple = false,
        onUpload = null,
        onError = null,
        className = ''
    } = options;
    
    const container = document.createElement('div');
    container.className = `image-uploader ${className}`;
    
    // Input file (hidden)
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = accept;
    fileInput.multiple = multiple;
    fileInput.style.display = 'none';
    
    // Drop zone
    const dropZone = document.createElement('div');
    dropZone.className = 'drop-zone';
    dropZone.innerHTML = `
        <div class="drop-zone-content">
            <svg class="icon icon-lg" style="color: var(--muted);">
                <use href="#icon-upload"></use>
            </svg>
            <p>Arraste imagens aqui ou <button type="button" class="upload-btn">clique para selecionar</button></p>
            <small style="color: var(--muted);">Máximo ${formatFileSize(maxSize)} por arquivo</small>
        </div>
    `;
    
    // Preview container
    const previewContainer = document.createElement('div');
    previewContainer.className = 'preview-container';
    previewContainer.style.display = 'none';
    
    // Progress bar
    const progressBar = document.createElement('div');
    progressBar.className = 'progress-bar';
    progressBar.style.display = 'none';
    progressBar.innerHTML = `
        <div class="progress-track">
            <div class="progress-fill"></div>
        </div>
        <span class="progress-text">0%</span>
    `;
    
    // Monta componente
    container.appendChild(fileInput);
    container.appendChild(dropZone);
    container.appendChild(progressBar);
    container.appendChild(previewContainer);
    
    // Event listeners
    const uploadBtn = dropZone.querySelector('.upload-btn');
    uploadBtn.addEventListener('click', () => fileInput.click());
    
    fileInput.addEventListener('change', handleFileSelect);
    
    // Drag and drop
    dropZone.addEventListener('dragover', handleDragOver);
    dropZone.addEventListener('dragleave', handleDragLeave);
    dropZone.addEventListener('drop', handleDrop);
    
    function handleDragOver(e) {
        e.preventDefault();
        dropZone.classList.add('drag-over');
    }
    
    function handleDragLeave(e) {
        e.preventDefault();
        dropZone.classList.remove('drag-over');
    }
    
    function handleDrop(e) {
        e.preventDefault();
        dropZone.classList.remove('drag-over');
        
        const files = Array.from(e.dataTransfer.files);
        processFiles(files);
    }
    
    function handleFileSelect(e) {
        const files = Array.from(e.target.files);
        processFiles(files);
    }
    
    function processFiles(files) {
        // Filtra apenas imagens
        const imageFiles = files.filter(file => file.type.startsWith('image/'));
        
        if (imageFiles.length === 0) {
            if (onError) onError('Nenhuma imagem válida selecionada');
            return;
        }
        
        // Verifica tamanho
        const oversizedFiles = imageFiles.filter(file => file.size > maxSize);
        if (oversizedFiles.length > 0) {
            if (onError) onError(`Arquivo(s) muito grande(s). Máximo: ${formatFileSize(maxSize)}`);
            return;
        }
        
        // Processa arquivos
        if (multiple) {
            imageFiles.forEach(file => uploadFile(file));
        } else {
            uploadFile(imageFiles[0]);
        }
    }
    
    async function uploadFile(file) {
        try {
            // Mostra preview se habilitado
            if (preview) {
                showPreview(file);
            }
            
            // Mostra progress bar
            showProgress(0);
            
            // Simula progresso de upload
            for (let i = 0; i <= 100; i += 10) {
                await new Promise(resolve => setTimeout(resolve, 50));
                showProgress(i);
            }
            
            // Faz upload via API
            const result = await API.uploads.uploadAvatar(file);
            
            // Esconde progress bar
            hideProgress();
            
            // Atualiza preview com resultado
            if (preview) {
                updatePreviewWithResult(file, result);
            }
            
            // Callback de sucesso
            if (onUpload) {
                onUpload(result, file);
            }
            
        } catch (error) {
            hideProgress();
            if (onError) onError(error.message);
        }
    }
    
    function showPreview(file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const previewItem = document.createElement('div');
            previewItem.className = 'preview-item';
            previewItem.innerHTML = `
                <img src="${e.target.result}" alt="Preview" class="preview-image">
                <div class="preview-info">
                    <span class="preview-name">${file.name}</span>
                    <span class="preview-size">${formatFileSize(file.size)}</span>
                </div>
                <button type="button" class="preview-remove" aria-label="Remover">
                    <svg class="icon icon-sm">
                        <use href="#icon-close"></use>
                    </svg>
                </button>
            `;
            
            // Botão remover
            const removeBtn = previewItem.querySelector('.preview-remove');
            removeBtn.addEventListener('click', () => {
                previewContainer.removeChild(previewItem);
                if (previewContainer.children.length === 0) {
                    previewContainer.style.display = 'none';
                }
            });
            
            previewContainer.appendChild(previewItem);
            previewContainer.style.display = 'block';
        };
        reader.readAsDataURL(file);
    }
    
    function updatePreviewWithResult(file, result) {
        const previewItems = previewContainer.querySelectorAll('.preview-item');
        const targetItem = Array.from(previewItems).find(item => 
            item.querySelector('.preview-name').textContent === file.name
        );
        
        if (targetItem) {
            // Adiciona indicador de sucesso
            const successIcon = document.createElement('div');
            successIcon.className = 'preview-success';
            successIcon.innerHTML = `
                <svg class="icon icon-sm" style="color: var(--success);">
                    <use href="#icon-add"></use>
                </svg>
            `;
            targetItem.appendChild(successIcon);
            
            // Armazena URL do resultado
            targetItem.dataset.uploadUrl = result.url;
            targetItem.dataset.thumbUrl = result.thumb;
        }
    }
    
    function showProgress(percent) {
        progressBar.style.display = 'block';
        const fill = progressBar.querySelector('.progress-fill');
        const text = progressBar.querySelector('.progress-text');
        
        fill.style.width = `${percent}%`;
        text.textContent = `${percent}%`;
    }
    
    function hideProgress() {
        progressBar.style.display = 'none';
    }
    
    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
    
    // Métodos públicos
    return {
        element: container,
        
        clear() {
            previewContainer.innerHTML = '';
            previewContainer.style.display = 'none';
            fileInput.value = '';
        },
        
        getUploadedFiles() {
            const previewItems = previewContainer.querySelectorAll('.preview-item');
            return Array.from(previewItems)
                .filter(item => item.dataset.uploadUrl)
                .map(item => ({
                    url: item.dataset.uploadUrl,
                    thumb: item.dataset.thumbUrl,
                    name: item.querySelector('.preview-name').textContent
                }));
        },
        
        setFiles(files) {
            this.clear();
            files.forEach(file => {
                const previewItem = document.createElement('div');
                previewItem.className = 'preview-item';
                previewItem.innerHTML = `
                    <img src="${file.url}" alt="Preview" class="preview-image">
                    <div class="preview-info">
                        <span class="preview-name">${file.name || 'Imagem'}</span>
                    </div>
                    <button type="button" class="preview-remove" aria-label="Remover">
                        <svg class="icon icon-sm">
                            <use href="#icon-close"></use>
                        </svg>
                    </button>
                `;
                
                previewItem.dataset.uploadUrl = file.url;
                previewItem.dataset.thumbUrl = file.thumb || file.url;
                
                const removeBtn = previewItem.querySelector('.preview-remove');
                removeBtn.addEventListener('click', () => {
                    previewContainer.removeChild(previewItem);
                    if (previewContainer.children.length === 0) {
                        previewContainer.style.display = 'none';
                    }
                });
                
                previewContainer.appendChild(previewItem);
                previewContainer.style.display = 'block';
            });
        }
    };
}

// Adiciona estilos CSS
const imageUploaderStyle = document.createElement('style');
imageUploaderStyle.textContent = `
    .image-uploader {
        width: 100%;
    }
    
    .drop-zone {
        border: 2px dashed var(--glass-border);
        border-radius: var(--radius-lg);
        padding: 2rem;
        text-align: center;
        background: var(--glass-bg);
        transition: var(--transition);
        cursor: pointer;
    }
    
    .drop-zone:hover,
    .drop-zone.drag-over {
        border-color: var(--primary);
        background: rgba(0, 100, 255, 0.05);
    }
    
    .drop-zone-content p {
        margin: 1rem 0 0.5rem;
        color: var(--text);
    }
    
    .upload-btn {
        background: none;
        border: none;
        color: var(--primary);
        text-decoration: underline;
        cursor: pointer;
        font-weight: 600;
    }
    
    .upload-btn:hover {
        color: var(--primary-600);
    }
    
    .progress-bar {
        margin: 1rem 0;
        display: flex;
        align-items: center;
        gap: 1rem;
    }
    
    .progress-track {
        flex: 1;
        height: 8px;
        background: var(--glass-bg);
        border-radius: 4px;
        overflow: hidden;
    }
    
    .progress-fill {
        height: 100%;
        background: linear-gradient(90deg, var(--primary), var(--accent));
        transition: width 0.3s ease;
        width: 0%;
    }
    
    .progress-text {
        font-size: 0.875rem;
        color: var(--muted);
        min-width: 3rem;
    }
    
    .preview-container {
        margin-top: 1rem;
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
        gap: 1rem;
    }
    
    .preview-item {
        position: relative;
        background: var(--glass-bg);
        border: 1px solid var(--glass-border);
        border-radius: var(--radius-md);
        padding: 0.5rem;
        transition: var(--transition);
    }
    
    .preview-item:hover {
        border-color: var(--primary);
    }
    
    .preview-image {
        width: 100%;
        height: 100px;
        object-fit: cover;
        border-radius: var(--radius-sm);
        margin-bottom: 0.5rem;
    }
    
    .preview-info {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
    }
    
    .preview-name {
        font-size: 0.875rem;
        font-weight: 600;
        color: var(--text);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    
    .preview-size {
        font-size: 0.75rem;
        color: var(--muted);
    }
    
    .preview-remove {
        position: absolute;
        top: 0.5rem;
        right: 0.5rem;
        background: rgba(0, 0, 0, 0.7);
        border: none;
        border-radius: 50%;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        cursor: pointer;
        transition: var(--transition);
    }
    
    .preview-remove:hover {
        background: var(--danger);
    }
    
    .preview-success {
        position: absolute;
        bottom: 0.5rem;
        right: 0.5rem;
        background: var(--success);
        border-radius: 50%;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
    }
`;
document.head.appendChild(imageUploaderStyle);

// Exporta para uso global
window.UI = window.UI || {};
window.UI.ImageUploader = {
    create: createImageUploader
};
