/**
 * Página Landing
 * Sistema Personal App - Mundo Ativo
 */

window.Pages = window.Pages || {};

window.Pages.landing = {
    async render(container, context) {
        const { route } = context;
        
        // Verifica se deve mostrar seção específica
        const showPricing = route === '/pricing';
        
        container.innerHTML = `
            <!-- Hero Section -->
            <section class="hero-section">
                <div class="container">
                    <div class="hero-content">
                        <div class="hero-text">
                            <span class="eyebrow">Sistema completo de gestão</span>
                            <h1 class="hero-title">Gerencie seus alunos com tecnologia de ponta</h1>
                            <p class="hero-subtitle">
                                Plataforma completa para personal trainers organizarem treinos, 
                                acompanharem alunos e otimizarem resultados com eficiência profissional.
                            </p>
                            <div class="hero-actions">
                                <button class="btn btn-primary btn-lg" id="registerBtn">
                                    <svg class="icon"><use href="#icon-add"></use></svg>
                                    Criar conta grátis
                                </button>
                                <button class="btn btn-secondary btn-lg" id="loginBtn">
                                    <svg class="icon"><use href="#icon-login"></use></svg>
                                    Fazer login
                                </button>
                            </div>
                        </div>
                        <div class="hero-visual">
                            <div class="hero-card">
                                <div class="card-header">
                                    <h3>Dashboard Personal</h3>
                                    <span class="badge badge-success">Online</span>
                                </div>
                                <div class="stats-grid">
                                    <div class="stat-item">
                                        <span class="stat-number">24</span>
                                        <span class="stat-label">Alunos</span>
                                    </div>
                                    <div class="stat-item">
                                        <span class="stat-number">156</span>
                                        <span class="stat-label">Exercícios</span>
                                    </div>
                                    <div class="stat-item">
                                        <span class="stat-number">89</span>
                                        <span class="stat-label">Treinos</span>
                                    </div>
                                    <div class="stat-item">
                                        <span class="stat-number">94%</span>
                                        <span class="stat-label">Satisfação</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Features Section -->
            <section class="features-section">
                <div class="container">
                    <div class="section-header">
                        <h2>Funcionalidades completas</h2>
                        <p>Tudo que você precisa para gerenciar seu negócio de personal training</p>
                    </div>
                    <div class="features-grid" id="featuresGrid">
                        <!-- Features serão carregadas dinamicamente -->
                    </div>
                </div>
            </section>

            <!-- Testimonials Section -->
            <section class="testimonials-section">
                <div class="container">
                    <div class="section-header">
                        <h2>O que dizem nossos usuários</h2>
                        <p>Personal trainers que transformaram seu trabalho com nossa plataforma</p>
                    </div>
                    <div class="testimonials-grid" id="testimonialsGrid">
                        <!-- Testimonials serão carregados dinamicamente -->
                    </div>
                </div>
            </section>

            <!-- Pricing Section -->
            <section class="pricing-section ${showPricing ? 'highlighted' : ''}">
                <div class="container">
                    <div class="section-header">
                        <h2>Planos que cabem no seu bolso</h2>
                        <p>Escolha o plano ideal para o seu negócio</p>
                    </div>
                    <div class="pricing-grid">
                        <div class="pricing-card">
                            <div class="pricing-header">
                                <h3>Starter</h3>
                                <div class="price">
                                    <span class="currency">R$</span>
                                    <span class="amount">29</span>
                                    <span class="period">/mês</span>
                                </div>
                            </div>
                            <ul class="features-list">
                                <li>Até 10 alunos</li>
                                <li>50 exercícios</li>
                                <li>Treinos básicos</li>
                                <li>Suporte por email</li>
                            </ul>
                            <button class="btn btn-secondary w-full">Começar grátis</button>
                        </div>
                        
                        <div class="pricing-card featured">
                            <div class="pricing-badge">Mais Popular</div>
                            <div class="pricing-header">
                                <h3>Professional</h3>
                                <div class="price">
                                    <span class="currency">R$</span>
                                    <span class="amount">59</span>
                                    <span class="period">/mês</span>
                                </div>
                            </div>
                            <ul class="features-list">
                                <li>Até 50 alunos</li>
                                <li>Exercícios ilimitados</li>
                                <li>Treinos avançados</li>
                                <li>Relatórios detalhados</li>
                                <li>Suporte prioritário</li>
                            </ul>
                            <button class="btn btn-primary w-full">Começar grátis</button>
                        </div>
                        
                        <div class="pricing-card">
                            <div class="pricing-header">
                                <h3>Enterprise</h3>
                                <div class="price">
                                    <span class="currency">R$</span>
                                    <span class="amount">99</span>
                                    <span class="period">/mês</span>
                                </div>
                            </div>
                            <ul class="features-list">
                                <li>Alunos ilimitados</li>
                                <li>Todas as funcionalidades</li>
                                <li>API personalizada</li>
                                <li>Treinamento dedicado</li>
                                <li>Suporte 24/7</li>
                            </ul>
                            <button class="btn btn-secondary w-full">Falar com vendas</button>
                        </div>
                    </div>
                </div>
            </section>

            <!-- CTA Section -->
            <section class="cta-section">
                <div class="container">
                    <div class="cta-content">
                        <h2>Pronto para transformar seu negócio?</h2>
                        <p>Junte-se a centenas de personal trainers que já usam nossa plataforma</p>
                        <div class="cta-form" id="ctaForm">
                            <form class="lead-form">
                                <div class="form-row">
                                    <input type="text" name="name" placeholder="Seu nome" class="form-input" required>
                                    <input type="email" name="email" placeholder="Seu email" class="form-input" required>
                                    <button type="submit" class="btn btn-primary">
                                        Começar agora
                                    </button>
                                </div>
                                <textarea name="message" placeholder="Conte-nos sobre seus objetivos (opcional)" class="form-input" rows="3"></textarea>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        `;

        // Carrega dados dinâmicos
        await this.loadFeatures();
        await this.loadTestimonials();
    },

    async loadFeatures() {
        const features = [
            {
                icon: 'users',
                title: 'Gestão de Alunos',
                description: 'Cadastre e acompanhe todos os seus alunos em um só lugar, com histórico completo e notas personalizadas.'
            },
            {
                icon: 'exercise',
                title: 'Biblioteca de Exercícios',
                description: 'Crie e organize exercícios com instruções detalhadas, imagens e categorização por grupos musculares.'
            },
            {
                icon: 'workout',
                title: 'Criação de Treinos',
                description: 'Monte treinos personalizados combinando exercícios, séries, repetições e tempo de descanso.'
            },
            {
                icon: 'dashboard',
                title: 'Dashboard Completo',
                description: 'Visualize estatísticas, acompanhe progresso e tenha insights sobre seu negócio em tempo real.'
            }
        ];

        const grid = document.getElementById('featuresGrid');
        if (!grid) {
            console.warn('Elemento #featuresGrid não encontrado; abortando loadFeatures.');
            return;
        }
        grid.innerHTML = features.map(feature => `
            <div class="feature-card">
                <div class="feature-icon">
                    <svg class="icon icon-lg">
                        <use href="#icon-${feature.icon}"></use>
                    </svg>
                </div>
                <h3>${feature.title}</h3>
                <p>${feature.description}</p>
            </div>
        `).join('');
    },

    async loadTestimonials() {
        try {
            const testimonials = await API.testimonials.list();
            
            const grid = document.getElementById('testimonialsGrid');
            if (!grid) {
                console.warn('Elemento #testimonialsGrid não encontrado; abortando loadTestimonials.');
                return;
            }
            grid.innerHTML = testimonials.map(testimonial => `
                <div class="testimonial-card">
                    <div class="testimonial-content">
                        <div class="testimonial-rating">
                            ${'★'.repeat(testimonial.rating)}
                        </div>
                        <p>"${testimonial.content}"</p>
                    </div>
                    <div class="testimonial-author">
                        <div class="author-avatar">
                            ${testimonial.avatar ? 
                                `<img src="${testimonial.avatar}" alt="${testimonial.name}">` :
                                `<div class="avatar-placeholder">${testimonial.name.charAt(0)}</div>`
                            }
                        </div>
                        <div class="author-info">
                            <strong>${testimonial.name}</strong>
                            <span>${testimonial.role}</span>
                        </div>
                    </div>
                </div>
            `).join('');
        } catch (error) {
            console.error('Erro ao carregar testimonials:', error);
        }
    },

    mount(container) {
        // Botões de ação do hero
        const registerBtn = container.querySelector('#registerBtn');
        const loginBtn = container.querySelector('#loginBtn');

        registerBtn?.addEventListener('click', () => {
            Router.navigate('/register');
        });

        loginBtn?.addEventListener('click', () => {
            Router.navigate('/login');
        });

        // Formulário de lead
        const leadForm = container.querySelector('.lead-form');
        leadForm?.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = new FormData(e.target);
            const data = {
                name: formData.get('name'),
                email: formData.get('email'),
                message: formData.get('message')
            };

            const submitBtn = e.target.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            
            try {
                submitBtn.disabled = true;
                submitBtn.textContent = 'Enviando...';
                
                await API.leads.create(data);
                
                UI.Toast.success('Obrigado! Entraremos em contato em breve.');
                e.target.reset();
                
            } catch (error) {
                UI.Toast.error(error.message);
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
            }
        });

        // Scroll suave para seção de preços se necessário
        if (Router.getCurrentRoute() === '/pricing') {
            setTimeout(() => {
                const pricingSection = container.querySelector('.pricing-section');
                pricingSection?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        }
    }
};

// Adiciona estilos específicos da landing
const landingStyle = document.createElement('style');
landingStyle.textContent = `
    .hero-section {
        padding: 4rem 0;
        background: linear-gradient(135deg, #000a20 0%, #001a40 100%);
        position: relative;
        overflow: hidden;
    }
    
    .hero-content {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 3rem;
        align-items: center;
    }
    
    .eyebrow {
        display: inline-block;
        font-size: 0.875rem;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        color: var(--accent);
        background: rgba(0,190,220,.12);
        border: 1px solid rgba(0,190,220,.28);
        padding: 0.5rem 1rem;
        border-radius: 999px;
        margin-bottom: 1rem;
    }
    
    .hero-title {
        font-size: clamp(2rem, 5vw, 3.5rem);
        line-height: 1.1;
        margin: 0 0 1rem;
        font-weight: 800;
    }
    
    .hero-subtitle {
        font-size: 1.25rem;
        color: var(--muted);
        margin: 0 0 2rem;
        line-height: 1.6;
    }
    
    .hero-actions {
        display: flex;
        gap: 1rem;
        flex-wrap: wrap;
    }
    
    .hero-visual {
        display: flex;
        justify-content: center;
    }
    
    .hero-card {
        background: var(--glass-bg);
        border: 1px solid var(--glass-border);
        border-radius: var(--radius-xl);
        padding: 2rem;
        backdrop-filter: var(--glass-blur);
        box-shadow: var(--shadow-xl);
        max-width: 400px;
        width: 100%;
    }
    
    .hero-card .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 2rem;
        padding-bottom: 1rem;
        border-bottom: 1px solid var(--glass-border);
    }
    
    .stats-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1.5rem;
    }
    
    .stat-item {
        text-align: center;
    }
    
    .stat-number {
        display: block;
        font-size: 2rem;
        font-weight: 800;
        color: var(--primary);
        line-height: 1;
    }
    
    .stat-label {
        font-size: 0.875rem;
        color: var(--muted);
        text-transform: uppercase;
        letter-spacing: 0.05em;
    }
    
    .section-header {
        text-align: center;
        margin-bottom: 3rem;
    }
    
    .section-header h2 {
        font-size: clamp(1.75rem, 4vw, 2.5rem);
        margin: 0 0 1rem;
        font-weight: 700;
    }
    
    .section-header p {
        font-size: 1.125rem;
        color: var(--muted);
        max-width: 600px;
        margin: 0 auto;
    }
    
    .features-section,
    .testimonials-section,
    .pricing-section {
        padding: 5rem 0;
    }
    
    .features-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 2rem;
    }
    
    .feature-card {
        text-align: center;
        padding: 2rem;
    }
    
    .feature-icon {
        width: 4rem;
        height: 4rem;
        background: linear-gradient(135deg, var(--primary), var(--accent));
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 1.5rem;
        color: white;
    }
    
    .feature-card h3 {
        font-size: 1.25rem;
        margin: 0 0 1rem;
        font-weight: 600;
    }
    
    .feature-card p {
        color: var(--muted);
        line-height: 1.6;
    }
    
    .testimonials-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 2rem;
    }
    
    .testimonial-card {
        background: var(--glass-bg);
        border: 1px solid var(--glass-border);
        border-radius: var(--radius-lg);
        padding: 1.5rem;
        backdrop-filter: var(--glass-blur);
    }
    
    .testimonial-rating {
        color: #ffd700;
        font-size: 1.25rem;
        margin-bottom: 1rem;
    }
    
    .testimonial-content p {
        font-style: italic;
        margin-bottom: 1.5rem;
        line-height: 1.6;
    }
    
    .testimonial-author {
        display: flex;
        align-items: center;
        gap: 1rem;
    }
    
    .author-avatar {
        width: 3rem;
        height: 3rem;
        border-radius: 50%;
        overflow: hidden;
    }
    
    .author-avatar img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
    
    .avatar-placeholder {
        width: 100%;
        height: 100%;
        background: var(--primary);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: 600;
        font-size: 1.25rem;
    }
    
    .author-info {
        display: flex;
        flex-direction: column;
    }
    
    .author-info strong {
        font-weight: 600;
        margin-bottom: 0.25rem;
    }
    
    .author-info span {
        font-size: 0.875rem;
        color: var(--muted);
    }
    
    .pricing-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 2rem;
        max-width: 900px;
        margin: 0 auto;
    }
    
    .pricing-card {
        background: var(--glass-bg);
        border: 1px solid var(--glass-border);
        border-radius: var(--radius-xl);
        padding: 2rem;
        backdrop-filter: var(--glass-blur);
        position: relative;
        transition: var(--transition);
    }
    
    .pricing-card:hover {
        transform: translateY(-4px);
        box-shadow: var(--shadow-xl);
    }
    
    .pricing-card.featured {
        border-color: var(--primary);
        background: linear-gradient(145deg, rgba(0,100,255,.1), rgba(0,190,220,.05));
    }
    
    .pricing-badge {
        position: absolute;
        top: -0.5rem;
        left: 50%;
        transform: translateX(-50%);
        background: var(--primary);
        color: white;
        padding: 0.5rem 1rem;
        border-radius: var(--radius-md);
        font-size: 0.875rem;
        font-weight: 600;
    }
    
    .pricing-header {
        text-align: center;
        margin-bottom: 2rem;
    }
    
    .pricing-header h3 {
        font-size: 1.5rem;
        margin: 0 0 1rem;
        font-weight: 600;
    }
    
    .price {
        display: flex;
        align-items: baseline;
        justify-content: center;
        gap: 0.25rem;
    }
    
    .currency {
        font-size: 1.25rem;
        color: var(--muted);
    }
    
    .amount {
        font-size: 3rem;
        font-weight: 800;
        color: var(--primary);
    }
    
    .period {
        font-size: 1rem;
        color: var(--muted);
    }
    
    .features-list {
        list-style: none;
        margin: 0 0 2rem;
        padding: 0;
    }
    
    .features-list li {
        padding: 0.75rem 0;
        border-bottom: 1px solid var(--glass-border);
        position: relative;
        padding-left: 2rem;
    }
    
    .features-list li:before {
        content: "✓";
        position: absolute;
        left: 0;
        color: var(--success);
        font-weight: bold;
    }
    
    .features-list li:last-child {
        border-bottom: none;
    }
    
    .cta-section {
        padding: 5rem 0;
        background: linear-gradient(135deg, var(--primary), var(--accent));
        text-align: center;
    }
    
    .cta-content h2 {
        font-size: clamp(1.75rem, 4vw, 2.5rem);
        margin: 0 0 1rem;
        font-weight: 700;
    }
    
    .cta-content p {
        font-size: 1.125rem;
        margin: 0 0 2rem;
        opacity: 0.9;
    }
    
    .lead-form {
        max-width: 600px;
        margin: 0 auto;
    }
    
    .form-row {
        display: grid;
        grid-template-columns: 1fr 1fr auto;
        gap: 1rem;
        margin-bottom: 1rem;
    }
    
    .pricing-section.highlighted {
        background: rgba(0, 100, 255, 0.02);
        border-top: 1px solid var(--primary);
        border-bottom: 1px solid var(--primary);
    }
    
    @media (max-width: 768px) {
        .hero-content {
            grid-template-columns: 1fr;
            text-align: center;
        }
        
        .hero-actions {
            justify-content: center;
        }
        
        .form-row {
            grid-template-columns: 1fr;
        }
        
        .stats-grid {
            grid-template-columns: 1fr 1fr;
        }
    }
`;
document.head.appendChild(landingStyle);
