/**
 * Utilitários para manipulação de CSV
 * Sistema Personal App - Mundo Ativo
 */

/**
 * Exporta dados para CSV e força download
 * @param {string} filename - Nome do arquivo (sem extensão)
 * @param {Array} rows - Array de objetos para exportar
 * @param {Array} headers - Headers customizados (opcional)
 */
function exportCSV(filename, rows, headers = null) {
    if (!rows || rows.length === 0) {
        throw new Error('Dados não podem estar vazios');
    }
    
    // Gera headers automaticamente se não fornecidos
    const csvHeaders = headers || Object.keys(rows[0]);
    
    // Converte dados para CSV
    const csvContent = [
        // Header row
        csvHeaders.map(header => escapeCSVField(header)).join(','),
        // Data rows
        ...rows.map(row => 
            csvHeaders.map(header => escapeCSVField(row[header] || '')).join(',')
        )
    ].join('\n');
    
    // Adiciona BOM para UTF-8
    const blob = new Blob(['\ufeff' + csvContent], { 
        type: 'text/csv;charset=utf-8;' 
    });
    
    // Força download
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

/**
 * Escapa campo CSV (trata vírgulas, aspas e quebras de linha)
 * @param {any} field - Campo para escapar
 * @returns {string} Campo escapado
 */
function escapeCSVField(field) {
    if (field === null || field === undefined) {
        return '';
    }
    
    const stringField = String(field);
    
    // Se contém vírgula, aspas ou quebra de linha, precisa ser escapado
    if (stringField.includes(',') || stringField.includes('"') || stringField.includes('\n')) {
        // Duplica aspas internas e envolve em aspas
        return `"${stringField.replace(/"/g, '""')}"`;
    }
    
    return stringField;
}

/**
 * Faz parse de arquivo CSV
 * @param {File} file - Arquivo CSV
 * @param {object} options - Opções de parse
 * @returns {Promise<Array>} Array de objetos
 */
function parseCSV(file, options = {}) {
    return new Promise((resolve, reject) => {
        const {
            delimiter = ',',
            hasHeader = true,
            encoding = 'utf-8'
        } = options;
        
        const reader = new FileReader();
        
        reader.onload = function(e) {
            try {
                const text = e.target.result;
                const result = parseCSVText(text, { delimiter, hasHeader });
                resolve(result);
            } catch (error) {
                reject(new Error(`Erro ao processar CSV: ${error.message}`));
            }
        };
        
        reader.onerror = function() {
            reject(new Error('Erro ao ler arquivo'));
        };
        
        reader.readAsText(file, encoding);
    });
}

/**
 * Faz parse de texto CSV
 * @param {string} text - Texto CSV
 * @param {object} options - Opções de parse
 * @returns {Array} Array de objetos
 */
function parseCSVText(text, options = {}) {
    const {
        delimiter = ',',
        hasHeader = true
    } = options;
    
    const lines = [];
    let currentLine = '';
    let inQuotes = false;
    
    // Parse linha por linha, tratando aspas
    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        const nextChar = text[i + 1];
        
        if (char === '"') {
            if (inQuotes && nextChar === '"') {
                // Aspas duplas escapadas
                currentLine += '"';
                i++; // Pula próximo caractere
            } else {
                // Alterna estado das aspas
                inQuotes = !inQuotes;
            }
        } else if (char === '\n' && !inQuotes) {
            // Fim da linha (fora de aspas)
            if (currentLine.trim()) {
                lines.push(currentLine);
            }
            currentLine = '';
        } else {
            currentLine += char;
        }
    }
    
    // Adiciona última linha se não vazia
    if (currentLine.trim()) {
        lines.push(currentLine);
    }
    
    if (lines.length === 0) {
        return [];
    }
    
    // Parse das linhas
    const parsedLines = lines.map(line => parseCSVLine(line, delimiter));
    
    if (!hasHeader) {
        // Sem header, retorna arrays
        return parsedLines;
    }
    
    // Com header, retorna objetos
    const headers = parsedLines[0];
    const dataLines = parsedLines.slice(1);
    
    return dataLines.map(line => {
        const obj = {};
        headers.forEach((header, index) => {
            obj[header] = line[index] || '';
        });
        return obj;
    });
}

/**
 * Faz parse de uma linha CSV
 * @param {string} line - Linha CSV
 * @param {string} delimiter - Delimitador
 * @returns {Array} Array de campos
 */
function parseCSVLine(line, delimiter = ',') {
    const fields = [];
    let currentField = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        const nextChar = line[i + 1];
        
        if (char === '"') {
            if (inQuotes && nextChar === '"') {
                // Aspas duplas escapadas
                currentField += '"';
                i++; // Pula próximo caractere
            } else {
                // Alterna estado das aspas
                inQuotes = !inQuotes;
            }
        } else if (char === delimiter && !inQuotes) {
            // Fim do campo (fora de aspas)
            fields.push(currentField);
            currentField = '';
        } else {
            currentField += char;
        }
    }
    
    // Adiciona último campo
    fields.push(currentField);
    
    return fields;
}

/**
 * Valida estrutura de CSV
 * @param {Array} data - Dados do CSV
 * @param {Array} requiredFields - Campos obrigatórios
 * @returns {object} Resultado da validação
 */
function validateCSVStructure(data, requiredFields = []) {
    const errors = [];
    
    if (!Array.isArray(data) || data.length === 0) {
        errors.push('CSV não pode estar vazio');
        return { valid: false, errors };
    }
    
    // Verifica se é array de objetos
    if (typeof data[0] !== 'object') {
        errors.push('CSV deve ter cabeçalho');
        return { valid: false, errors };
    }
    
    // Verifica campos obrigatórios
    const headers = Object.keys(data[0]);
    const missingFields = requiredFields.filter(field => !headers.includes(field));
    
    if (missingFields.length > 0) {
        errors.push(`Campos obrigatórios ausentes: ${missingFields.join(', ')}`);
    }
    
    // Verifica consistência das linhas
    for (let i = 1; i < data.length; i++) {
        const currentHeaders = Object.keys(data[i]);
        if (currentHeaders.length !== headers.length) {
            errors.push(`Linha ${i + 1} tem número diferente de campos`);
        }
    }
    
    return {
        valid: errors.length === 0,
        errors
    };
}

/**
 * Converte array de objetos para formato de tabela HTML
 * @param {Array} data - Dados para converter
 * @param {Array} headers - Headers customizados (opcional)
 * @returns {string} HTML da tabela
 */
function arrayToHTMLTable(data, headers = null) {
    if (!data || data.length === 0) {
        return '<p>Nenhum dado disponível</p>';
    }
    
    const tableHeaders = headers || Object.keys(data[0]);
    
    let html = '<table class="table">';
    
    // Header
    html += '<thead><tr>';
    tableHeaders.forEach(header => {
        html += `<th>${escapeHTML(header)}</th>`;
    });
    html += '</tr></thead>';
    
    // Body
    html += '<tbody>';
    data.forEach(row => {
        html += '<tr>';
        tableHeaders.forEach(header => {
            const value = row[header] || '';
            html += `<td>${escapeHTML(String(value))}</td>`;
        });
        html += '</tr>';
    });
    html += '</tbody>';
    
    html += '</table>';
    
    return html;
}

/**
 * Escapa HTML para prevenir XSS
 * @param {string} text - Texto para escapar
 * @returns {string} Texto escapado
 */
function escapeHTML(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Gera template CSV para download
 * @param {string} filename - Nome do arquivo
 * @param {Array} headers - Headers do template
 * @param {Array} sampleData - Dados de exemplo (opcional)
 */
function downloadCSVTemplate(filename, headers, sampleData = []) {
    const templateData = sampleData.length > 0 ? sampleData : [
        headers.reduce((obj, header) => {
            obj[header] = `exemplo_${header.toLowerCase()}`;
            return obj;
        }, {})
    ];
    
    exportCSV(`template_${filename}`, templateData, headers);
}

/**
 * Exporta dados de alunos para CSV
 * @param {Array} students - Array de alunos
 */
function exportStudents(students) {
    const headers = ['Nome', 'Email', 'Telefone', 'Peso', 'Altura', 'Objetivos', 'Data de Cadastro'];
    const data = students.map(student => [
        student.name,
        student.email,
        student.phone || '',
        student.weight || '',
        student.height || '',
        student.goals || '',
        new Date(student.created_at).toLocaleDateString('pt-BR')
    ]);
    
    const csvContent = [headers.join(','), ...data.map(row => row.map(field => escapeCSVField(field)).join(','))].join('\n');
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'alunos.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

/**
 * Exporta dados de exercícios para CSV
 * @param {Array} exercises - Array de exercícios
 */
function exportExercises(exercises) {
    const headers = ['Nome', 'Categoria', 'Grupo Muscular', 'Equipamento', 'Dificuldade', 'Duração', 'Descrição'];
    const data = exercises.map(exercise => [
        exercise.name,
        exercise.category,
        exercise.muscle_group,
        exercise.equipment || '',
        exercise.difficulty,
        exercise.duration || '',
        exercise.description || ''
    ]);
    
    const csvContent = [headers.join(','), ...data.map(row => row.map(field => escapeCSVField(field)).join(','))].join('\n');
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'exercicios.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

/**
 * Exporta dados de treinos para CSV
 * @param {Array} workouts - Array de treinos
 */
function exportWorkouts(workouts) {
    const headers = ['Nome', 'Aluno', 'Descrição', 'Dificuldade', 'Duração', 'Exercícios', 'Data de Criação'];
    const data = workouts.map(workout => [
        workout.name,
        workout.student_name,
        workout.description || '',
        workout.difficulty,
        workout.duration || '',
        workout.exercises_count || 0,
        new Date(workout.created_at).toLocaleDateString('pt-BR')
    ]);
    
    const csvContent = [headers.join(','), ...data.map(row => row.map(field => escapeCSVField(field)).join(','))].join('\n');
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'treinos.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

// Exporta as funções para uso global
window.CSV = {
    exportCSV,
    parseCSV,
    parseCSVText,
    validateCSVStructure,
    arrayToHTMLTable,
    downloadCSVTemplate,
    escapeCSVField,
    escapeHTML,
    exportStudents,
    exportExercises,
    exportWorkouts
};
