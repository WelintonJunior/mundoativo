/**
 * Mock API para simulação de backend
 * Sistema Personal App - Mundo Ativo
 */

// Delay para simular latência de rede
const API_DELAY = 300;

// Dados iniciais (seed data)
let trainers = [
    {
        id: 't-admin001',
        name: 'Admin Local',
        email: 'admin@local',
        passwordHash: 'mock-hash',
        role: 'admin',
        avatar: null,
        phone: '(11) 99999-9999',
        created_at: '2025-01-01T00:00:00Z',
        updated_at: '2025-01-01T00:00:00Z'
    }
];

let students = [
    {
        id: 's-001',
        trainer_id: 't-admin001',
        name: 'João Silva',
        email: 'joao@email.com',
        phone: '(11) 98888-8888',
        birth_date: '1990-05-15',
        avatar: null,
        notes: 'Iniciante, foco em condicionamento físico',
        created_at: '2025-01-15T10:00:00Z',
        updated_at: '2025-01-15T10:00:00Z'
    },
    {
        id: 's-002',
        trainer_id: 't-admin001',
        name: 'Maria Santos',
        email: 'maria@email.com',
        phone: '(11) 97777-7777',
        birth_date: '1985-08-22',
        avatar: null,
        notes: 'Intermediário, quer ganhar massa muscular',
        created_at: '2025-01-16T14:30:00Z',
        updated_at: '2025-01-16T14:30:00Z'
    }
];

let exercises = [
    {
        id: 'e-001',
        trainer_id: 't-admin001',
        name: 'Agachamento',
        description: 'Exercício fundamental para pernas e glúteos',
        muscle_groups: ['Quadríceps', 'Glúteos', 'Core'],
        equipment: 'Peso corporal',
        difficulty: 'Iniciante',
        instructions: 'Pés na largura dos ombros, descer até 90 graus, subir controladamente',
        tags: ['pernas', 'funcional', 'peso-corporal'],
        images: [],
        created_at: '2025-01-10T09:00:00Z',
        updated_at: '2025-01-10T09:00:00Z'
    }
];

let workouts = [];
let testimonials = [
    {
        id: 'test-001',
        name: 'Carlos Mendes',
        role: 'Personal Trainer',
        content: 'O Personal App revolucionou minha forma de trabalhar.',
        rating: 5,
        avatar: null,
        created_at: '2025-01-01T12:00:00Z'
    }
];

let leads = [];
let mockFiles = new Map();
let systemLogs = [];
let authAttempts = new Map();

// Utilitários
function delay(ms = API_DELAY) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function log(level, message, meta = {}) {
    const logEntry = {
        timestamp: IdGenerator.generateTimestamp(),
        level,
        message,
        meta
    };
    systemLogs.push(logEntry);
    console.log(`[${level.toUpperCase()}] ${message}`, meta);
    persistLogs();
}

function persistData() {
    try {
        localStorage.setItem('pa_trainers', JSON.stringify(trainers));
        localStorage.setItem('pa_students', JSON.stringify(students));
        localStorage.setItem('pa_exercises', JSON.stringify(exercises));
        localStorage.setItem('pa_workouts', JSON.stringify(workouts));
        localStorage.setItem('pa_testimonials', JSON.stringify(testimonials));
        localStorage.setItem('pa_leads', JSON.stringify(leads));
        localStorage.setItem('pa_files', JSON.stringify(Array.from(mockFiles.entries())));
    } catch (error) {
        log('error', 'Erro ao persistir dados', { error: error.message });
    }
}

function persistLogs() {
    try {
        const recentLogs = systemLogs.slice(-100);
        localStorage.setItem('pa_logs', JSON.stringify(recentLogs));
    } catch (error) {
        console.error('Erro ao persistir logs:', error);
    }
}

function loadData() {
    try {
        const savedTrainers = localStorage.getItem('pa_trainers');
        const savedStudents = localStorage.getItem('pa_students');
        const savedExercises = localStorage.getItem('pa_exercises');
        const savedWorkouts = localStorage.getItem('pa_workouts');
        const savedTestimonials = localStorage.getItem('pa_testimonials');
        const savedLeads = localStorage.getItem('pa_leads');
        const savedFiles = localStorage.getItem('pa_files');
        const savedLogs = localStorage.getItem('pa_logs');
        
        if (savedTrainers) trainers = JSON.parse(savedTrainers);
        if (savedStudents) students = JSON.parse(savedStudents);
        if (savedExercises) exercises = JSON.parse(savedExercises);
        if (savedWorkouts) workouts = JSON.parse(savedWorkouts);
        if (savedTestimonials) testimonials = JSON.parse(savedTestimonials);
        if (savedLeads) leads = JSON.parse(savedLeads);
        if (savedLogs) systemLogs = JSON.parse(savedLogs);
        
        if (savedFiles) {
            const filesArray = JSON.parse(savedFiles);
            mockFiles = new Map(filesArray);
        }
        
        log('info', 'Dados carregados do localStorage');
    } catch (error) {
        log('error', 'Erro ao carregar dados do localStorage', { error: error.message });
    }
}

function checkRateLimit(email) {
    const now = Date.now();
    const attempts = authAttempts.get(email) || { count: 0, lastAttempt: 0 };
    
    if (now - attempts.lastAttempt > 30000) {
        attempts.count = 0;
    }
    
    if (attempts.count >= 5) {
        return false;
    }
    
    attempts.count++;
    attempts.lastAttempt = now;
    authAttempts.set(email, attempts);
    
    return true;
}

// API Mock Object
const API = {
    // Inicialização
    async init() {
        loadData();
        log('info', 'API Mock inicializada');
        return true;
    },
    // Autenticação
    auth: {
        async register(data) {
            await delay();
            
            const { name, email, password } = data;
            
            const emailValidation = Validators.validateEmail(email);
            if (!emailValidation.valid) {
                throw new Error(emailValidation.errors[0]);
            }
            
            const passwordValidation = Validators.validatePassword(password);
            if (!passwordValidation.valid) {
                throw new Error(passwordValidation.errors[0]);
            }
            
            if (trainers.find(t => t.email === email)) {
                throw new Error('Email já está em uso');
            }
            
            const trainer = {
                id: IdGenerator.generatePrefixedId('t'),
                name,
                email,
                passwordHash: 'mock-hash',
                role: 'trainer',
                avatar: null,
                phone: '',
                created_at: IdGenerator.generateTimestamp(),
                updated_at: IdGenerator.generateTimestamp()
            };
            
            trainers.push(trainer);
            persistData();
            
            const token = `mock-token:${trainer.id}`;
            log('info', 'Novo trainer registrado', { trainerId: trainer.id, email });
            
            return {
                token,
                trainer: { ...trainer, passwordHash: undefined }
            };
        },
        
        async login(data) {
            await delay();
            
            const { email, password } = data;
            
            if (!checkRateLimit(email)) {
                log('warn', 'Rate limit atingido para login', { email });
                throw new Error('Muitas tentativas. Tente novamente em 30 segundos.');
            }
            
            const trainer = trainers.find(t => t.email === email);
            
            if (!trainer) {
                log('warn', 'Tentativa de login com email inexistente', { email });
                throw new Error('Credenciais inválidas');
            }
            
            const validPassword = (email === 'admin@local') || (password === 'Senha@123');
            
            if (!validPassword) {
                log('warn', 'Tentativa de login com senha incorreta', { email });
                throw new Error('Credenciais inválidas');
            }
            
            const token = `mock-token:${trainer.id}`;
            log('info', 'Login realizado com sucesso', { trainerId: trainer.id, email });
            
            return {
                token,
                trainer: { ...trainer, passwordHash: undefined }
            };
        },
        
        async me(token) {
            await delay(100);
            
            if (!token || !token.startsWith('mock-token:')) {
                throw new Error('Token inválido');
            }
            
            const trainerId = token.replace('mock-token:', '');
            const trainer = trainers.find(t => t.id === trainerId);
            
            if (!trainer) {
                throw new Error('Trainer não encontrado');
            }
            
            return { ...trainer, passwordHash: undefined };
        }
    },
    
    // Dados para dashboard
    dashboard: {
        async getStats(trainerId) {
            await delay();
            
            const trainerStudents = students.filter(s => s.trainer_id === trainerId);
            const trainerExercises = exercises.filter(e => e.trainer_id === trainerId);
            const trainerWorkouts = workouts.filter(w => w.trainer_id === trainerId);
            
            return {
                students_count: trainerStudents.length,
                exercises_count: trainerExercises.length,
                workouts_count: trainerWorkouts.length,
                active_workouts: trainerWorkouts.filter(w => w.status === 'active').length
            };
        }
    },
    
    // Testimonials para landing
    testimonials: {
        async list() {
            await delay();
            return testimonials;
        }
    },
    
    // Leads
    leads: {
        async create(data) {
            await delay();
            
            const { name, email, message } = data;
            
            const emailValidation = Validators.validateEmail(email);
            if (!emailValidation.valid) {
                throw new Error(emailValidation.errors[0]);
            }
            
            const lead = {
                id: IdGenerator.generatePrefixedId('lead'),
                name,
                email,
                message: message || '',
                created_at: IdGenerator.generateTimestamp()
            };
            
            leads.push(lead);
            persistData();
            
            log('info', 'Lead criado', { leadId: lead.id, email });
            
            return lead;
        }
    },
    
    // Upload de arquivos
    uploads: {
        async uploadAvatar(file) {
            await delay();
            
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                
                reader.onload = function(e) {
                    const dataUrl = e.target.result;
                    const fileId = IdGenerator.generateId();
                    const url = `mock://avatars/${fileId}`;
                    
                    // Cria thumbnail usando canvas
                    const img = new Image();
                    img.onload = function() {
                        const canvas = document.createElement('canvas');
                        const ctx = canvas.getContext('2d');
                        
                        // Thumbnail 64x64
                        canvas.width = 64;
                        canvas.height = 64;
                        ctx.drawImage(img, 0, 0, 64, 64);
                        const thumbUrl = canvas.toDataURL();
                        
                        // Armazena arquivos
                        mockFiles.set(url, dataUrl);
                        mockFiles.set(`mock://avatars/thumb-${fileId}`, thumbUrl);
                        
                        persistData();
                        
                        resolve({
                            url,
                            thumb: `mock://avatars/thumb-${fileId}`
                        });
                    };
                    
                    img.src = dataUrl;
                };
                
                reader.onerror = () => reject(new Error('Erro ao processar arquivo'));
                reader.readAsDataURL(file);
            });
        }
    },
    
    // Exportar dados
    exportData() {
        return {
            trainers: trainers.map(t => ({ ...t, passwordHash: undefined })),
            students,
            exercises,
            workouts,
            testimonials,
            leads,
            logs: systemLogs,
            exported_at: IdGenerator.generateTimestamp()
        };
    },
    
    // Resetar para dados iniciais
    resetToSeed() {
        localStorage.clear();
        trainers.length = 0;
        students.length = 0;
        exercises.length = 0;
        workouts.length = 0;
        testimonials.length = 0;
        leads.length = 0;
        systemLogs.length = 0;
        mockFiles.clear();
        authAttempts.clear();
        
        // Recarrega dados iniciais
        trainers.push({
            id: 't-admin001',
            name: 'Admin Local',
            email: 'admin@local',
            passwordHash: 'mock-hash',
            role: 'admin',
            avatar: null,
            phone: '(11) 99999-9999',
            created_at: '2025-01-01T00:00:00Z',
            updated_at: '2025-01-01T00:00:00Z'
        });
        
        persistData();
        log('info', 'Dados resetados para seed inicial');
    }
};

// Carrega dados na inicialização
loadData();

// Exporta API para uso global
window.API = API;
