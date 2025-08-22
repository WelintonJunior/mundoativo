/**
 * Utilitários de validação
 * Sistema Personal App - Mundo Ativo
 */

/**
 * Valida formato de email
 * @param {string} email - Email para validar
 * @returns {object} Resultado da validação
 */
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailRegex.test(email);
    
    return {
        valid: isValid,
        errors: isValid ? [] : ['Email deve ter um formato válido']
    };
}

/**
 * Valida política de senha
 * Mínimo 8 caracteres, pelo menos: 1 maiúscula, 1 minúscula, 1 número, 1 símbolo
 * @param {string} password - Senha para validar
 * @returns {object} Resultado da validação
 */
function validatePassword(password) {
    const errors = [];
    
    if (!password || password.length < 8) {
        errors.push('Senha deve ter pelo menos 8 caracteres');
    }
    
    if (!/[A-Z]/.test(password)) {
        errors.push('Senha deve conter pelo menos uma letra maiúscula');
    }
    
    if (!/[a-z]/.test(password)) {
        errors.push('Senha deve conter pelo menos uma letra minúscula');
    }
    
    if (!/\d/.test(password)) {
        errors.push('Senha deve conter pelo menos um número');
    }
    
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        errors.push('Senha deve conter pelo menos um símbolo (!@#$%^&*(),.?":{}|<>)');
    }
    
    return {
        valid: errors.length === 0,
        errors
    };
}

/**
 * Valida comprimento de texto
 * @param {string} text - Texto para validar
 * @param {number} minLength - Comprimento mínimo
 * @param {number} maxLength - Comprimento máximo
 * @param {string} fieldName - Nome do campo para mensagens de erro
 * @returns {object} Resultado da validação
 */
function validateTextLength(text, minLength = 1, maxLength = 255, fieldName = 'Campo') {
    const errors = [];
    
    if (!text || text.trim().length === 0) {
        errors.push(`${fieldName} é obrigatório`);
    } else {
        const trimmedLength = text.trim().length;
        
        if (trimmedLength < minLength) {
            errors.push(`${fieldName} deve ter pelo menos ${minLength} caracteres`);
        }
        
        if (trimmedLength > maxLength) {
            errors.push(`${fieldName} deve ter no máximo ${maxLength} caracteres`);
        }
    }
    
    return {
        valid: errors.length === 0,
        errors
    };
}

/**
 * Valida se um valor é obrigatório
 * @param {any} value - Valor para validar
 * @param {string} fieldName - Nome do campo
 * @returns {object} Resultado da validação
 */
function validateRequired(value, fieldName = 'Campo') {
    const isEmpty = value === null || 
                   value === undefined || 
                   (typeof value === 'string' && value.trim() === '') ||
                   (Array.isArray(value) && value.length === 0);
    
    return {
        valid: !isEmpty,
        errors: isEmpty ? [`${fieldName} é obrigatório`] : []
    };
}

/**
 * Valida número dentro de um intervalo
 * @param {number} value - Valor para validar
 * @param {number} min - Valor mínimo
 * @param {number} max - Valor máximo
 * @param {string} fieldName - Nome do campo
 * @returns {object} Resultado da validação
 */
function validateNumberRange(value, min = 0, max = Infinity, fieldName = 'Número') {
    const errors = [];
    const numValue = Number(value);
    
    if (isNaN(numValue)) {
        errors.push(`${fieldName} deve ser um número válido`);
    } else {
        if (numValue < min) {
            errors.push(`${fieldName} deve ser pelo menos ${min}`);
        }
        
        if (numValue > max) {
            errors.push(`${fieldName} deve ser no máximo ${max}`);
        }
    }
    
    return {
        valid: errors.length === 0,
        errors
    };
}

/**
 * Valida URL
 * @param {string} url - URL para validar
 * @returns {object} Resultado da validação
 */
function validateUrl(url) {
    try {
        new URL(url);
        return {
            valid: true,
            errors: []
        };
    } catch {
        return {
            valid: false,
            errors: ['URL deve ter um formato válido']
        };
    }
}

/**
 * Valida telefone brasileiro
 * @param {string} phone - Telefone para validar
 * @returns {object} Resultado da validação
 */
function validatePhone(phone) {
    // Remove caracteres não numéricos
    const cleanPhone = phone.replace(/\D/g, '');
    
    // Verifica se tem 10 ou 11 dígitos (com DDD)
    const isValid = /^(\d{10}|\d{11})$/.test(cleanPhone);
    
    return {
        valid: isValid,
        errors: isValid ? [] : ['Telefone deve ter 10 ou 11 dígitos (com DDD)']
    };
}

/**
 * Valida CPF brasileiro
 * @param {string} cpf - CPF para validar
 * @returns {object} Resultado da validação
 */
function validateCPF(cpf) {
    // Remove caracteres não numéricos
    const cleanCPF = cpf.replace(/\D/g, '');
    
    // Verifica se tem 11 dígitos
    if (cleanCPF.length !== 11) {
        return {
            valid: false,
            errors: ['CPF deve ter 11 dígitos']
        };
    }
    
    // Verifica se não são todos os dígitos iguais
    if (/^(\d)\1{10}$/.test(cleanCPF)) {
        return {
            valid: false,
            errors: ['CPF inválido']
        };
    }
    
    // Validação dos dígitos verificadores
    let sum = 0;
    for (let i = 0; i < 9; i++) {
        sum += parseInt(cleanCPF.charAt(i)) * (10 - i);
    }
    
    let remainder = 11 - (sum % 11);
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cleanCPF.charAt(9))) {
        return {
            valid: false,
            errors: ['CPF inválido']
        };
    }
    
    sum = 0;
    for (let i = 0; i < 10; i++) {
        sum += parseInt(cleanCPF.charAt(i)) * (11 - i);
    }
    
    remainder = 11 - (sum % 11);
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cleanCPF.charAt(10))) {
        return {
            valid: false,
            errors: ['CPF inválido']
        };
    }
    
    return {
        valid: true,
        errors: []
    };
}

/**
 * Valida múltiplos campos de uma vez
 * @param {object} data - Objeto com os dados para validar
 * @param {object} rules - Regras de validação
 * @returns {object} Resultado da validação
 */
function validateForm(data, rules) {
    const errors = {};
    let isValid = true;
    
    for (const [field, fieldRules] of Object.entries(rules)) {
        const value = data[field];
        const fieldErrors = [];
        
        for (const rule of fieldRules) {
            const result = rule.validator(value, ...rule.params || []);
            if (!result.valid) {
                fieldErrors.push(...result.errors);
                isValid = false;
            }
        }
        
        if (fieldErrors.length > 0) {
            errors[field] = fieldErrors;
        }
    }
    
    return {
        valid: isValid,
        errors
    };
}

/**
 * Formata CPF para exibição
 * @param {string} cpf - CPF para formatar
 * @returns {string} CPF formatado
 */
function formatCPF(cpf) {
    const cleanCPF = cpf.replace(/\D/g, '');
    return cleanCPF.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

/**
 * Formata telefone para exibição
 * @param {string} phone - Telefone para formatar
 * @returns {string} Telefone formatado
 */
function formatPhone(phone) {
    const cleanPhone = phone.replace(/\D/g, '');
    
    if (cleanPhone.length === 10) {
        return cleanPhone.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    } else if (cleanPhone.length === 11) {
        return cleanPhone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
    
    return phone;
}

// Exporta as funções para uso global
window.Validators = {
    validateEmail,
    validatePassword,
    validateTextLength,
    validateRequired,
    validateNumberRange,
    validateUrl,
    validatePhone,
    validateCPF,
    validateForm,
    formatCPF,
    formatPhone
};
