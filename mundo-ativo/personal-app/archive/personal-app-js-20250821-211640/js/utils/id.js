/**
 * Utilitários para geração de IDs e timestamps
 * Sistema Personal App - Mundo Ativo
 */

/**
 * Gera um ID único no formato hexadecimal
 * @param {number} length - Comprimento do ID (padrão: 8)
 * @returns {string} ID hexadecimal único
 */
function generateId(length = 8) {
    const chars = '0123456789abcdef';
    let result = '';
    
    // Adiciona timestamp para garantir unicidade
    const timestamp = Date.now().toString(16);
    result += timestamp.slice(-4);
    
    // Completa com caracteres aleatórios
    for (let i = result.length; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    return result;
}

/**
 * Gera um ID com prefixo específico
 * @param {string} prefix - Prefixo do ID (ex: 'user', 'exercise', 'workout')
 * @param {number} length - Comprimento da parte aleatória
 * @returns {string} ID com prefixo
 */
function generatePrefixedId(prefix, length = 8) {
    return `${prefix}-${generateId(length)}`;
}

/**
 * Gera timestamp ISO atual
 * @returns {string} Timestamp no formato ISO 8601
 */
function generateTimestamp() {
    return new Date().toISOString();
}

/**
 * Gera uma data formatada para exibição
 * @param {string|Date} date - Data para formatar
 * @returns {string} Data formatada (DD/MM/AAAA)
 */
function formatDate(date) {
    const d = new Date(date);
    const day = d.getDate().toString().padStart(2, '0');
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
}

/**
 * Gera uma data e hora formatada para exibição
 * @param {string|Date} date - Data para formatar
 * @returns {string} Data e hora formatada (DD/MM/AAAA HH:MM)
 */
function formatDateTime(date) {
    const d = new Date(date);
    const dateStr = formatDate(d);
    const hours = d.getHours().toString().padStart(2, '0');
    const minutes = d.getMinutes().toString().padStart(2, '0');
    return `${dateStr} ${hours}:${minutes}`;
}

/**
 * Calcula a diferença em dias entre duas datas
 * @param {string|Date} date1 - Data inicial
 * @param {string|Date} date2 - Data final (padrão: hoje)
 * @returns {number} Diferença em dias
 */
function daysDifference(date1, date2 = new Date()) {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    const diffTime = Math.abs(d2 - d1);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

// Exporta as funções para uso global
window.IdGenerator = {
    generateId,
    generatePrefixedId,
    generateTimestamp,
    formatDate,
    formatDateTime,
    daysDifference
};
