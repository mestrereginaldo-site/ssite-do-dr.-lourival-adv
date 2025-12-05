// Site Extraordinário para Dr. Lourival Oliveira
document.addEventListener('DOMContentLoaded', function() {
    // Elementos do DOM
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const floatingNav = document.querySelector('.floating-nav');
    const stats = document.querySelectorAll('.stat-number');
    const contactForm = document.getElementById('contactForm');
    const scrollIndicator = document.querySelector('.scroll-indicator');
    
    // Menu toggle para mobile
    menuToggle.addEventListener('click', function() {
        menuToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    
    // Fechar menu ao clicar em um link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            menuToggle.classList.remove('active');
            navMenu.classList.remove('active');
            
            // Atualizar link ativo
            navLinks.forEach(item => item.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            floatingNav.classList.add('scrolled');
            scrollIndicator.style.opacity = '0';
        } else {
            floatingNav.classList.remove('scrolled');
            scrollIndicator.style.opacity = '1';
        }
        
        // Atualizar link ativo baseado na seção visível
        const sections = document.querySelectorAll('section');
        const scrollPos = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });
    
    // Animação de contagem para estatísticas
    const animateStats = () => {
        stats.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-count'));
            const increment = target / 100;
            let current = 0;
            
            const updateCount = () => {
                if (current < target) {
                    current += increment;
                    stat.textContent = Math.floor(current);
                    setTimeout(updateCount, 20);
                } else {
                    stat.textContent = target;
                }
            };
            
            updateCount();
        });
    };
    
    // Observador de interseção para animar estatísticas quando visíveis
    const observerOptions = {
        threshold: 0.5
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateStats();
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    const aboutSection = document.querySelector('.about-section');
    if (aboutSection) {
        observer.observe(aboutSection);
    }
    
    // Animar elementos ao rolar
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.area-card, .story-card, .info-card');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.2;
            
            if (elementPosition < screenPosition) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    };
    
    // Configurar elementos para animação
    const setInitialState = () => {
        const elements = document.querySelectorAll('.area-card, .story-card, .info-card');
        
        elements.forEach(element => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        });
    };
    
    // Inicializar animações
    setInitialState();
    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll(); // Executar uma vez no carregamento
    
    // Formulário de contato
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Coletar dados do formulário
            const formData = {
                name: document.getElementById('name').value,
                phone: document.getElementById('phone').value,
                email: document.getElementById('email').value,
                subject: document.getElementById('subject').value,
                message: document.getElementById('message').value
            };
            
            // Aqui normalmente enviaríamos para um servidor
            // Por enquanto, apenas simularemos um envio bem-sucedido
            
            // Mostrar mensagem de sucesso
            const submitBtn = contactForm.querySelector('.submit-btn');
            const originalText = submitBtn.textContent;
            
            submitBtn.innerHTML = '<i class="fas fa-check"></i> Mensagem Enviada!';
            submitBtn.style.backgroundColor = '#28a745';
            
            // Resetar formulário após 3 segundos
            setTimeout(() => {
                contactForm.reset();
                submitBtn.textContent = originalText;
                submitBtn.style.backgroundColor = '';
                
                // Mostrar alerta de sucesso
                alert('Obrigado! Sua mensagem foi enviada com sucesso. O Dr. Lourival entrará em contato em breve.');
            }, 3000);
        });
    }
    
    // Animar elementos flutuantes
    const floatElements = document.querySelectorAll('.float-element');
    floatElements.forEach(el => {
        // Adicionar movimento aleatório
        const randomX = Math.random() * 20 - 10;
        const randomY = Math.random() * 20 - 10;
        const duration = 3 + Math.random() * 2;
        
        el.style.animation = `float ${duration}s ease-in-out infinite`;
        el.style.setProperty('--random-x', `${randomX}px`);
        el.style.setProperty('--random-y', `${randomY}px`);
    });
    
    // Efeito de digitação no título
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const text = "Excelência em Direito Previdenciário";
        let index = 0;
        
        // Esta função seria usada para efeito de digitação, mas vamos manter estático por simplicidade
        // function typeWriter() {
        //     if (index < text.length) {
        //         heroTitle.innerHTML += text.charAt(index);
        //         index++;
        //         setTimeout(typeWriter, 50);
        //     }
        // }
        // typeWriter();
    }
    
    // Smooth scroll para links âncora
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Efeito parallax no hero
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const heroSection = document.querySelector('.hero-section');
        const floatElements = document.querySelectorAll('.float-element');
        
        if (heroSection) {
            heroSection.style.transform = `translateY(${scrolled * 0.1}px)`;
        }
        
        floatElements.forEach(el => {
            const speed = el.dataset.speed || 0.05;
            el.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });
    
    // Inicializar tooltips (se necessário)
    const initTooltips = () => {
        const tooltipElements = document.querySelectorAll('[data-tooltip]');
        
        tooltipElements.forEach(el => {
            el.addEventListener('mouseenter', function() {
                const tooltipText = this.getAttribute('data-tooltip');
                const tooltip = document.createElement('div');
                tooltip.className = 'custom-tooltip';
                tooltip.textContent = tooltipText;
                document.body.appendChild(tooltip);
                
                const rect = this.getBoundingClientRect();
                tooltip.style.left = `${rect.left + rect.width / 2}px`;
                tooltip.style.top = `${rect.top - 10}px`;
                tooltip.style.transform = 'translate(-50%, -100%)';
                
                this.tooltip = tooltip;
            });
            
            el.addEventListener('mouseleave', function() {
                if (this.tooltip) {
                    this.tooltip.remove();
                    this.tooltip = null;
                }
            });
        });
    };
    
    // Adicionar estilo para tooltips
    const tooltipStyle = document.createElement('style');
    tooltipStyle.textContent = `
        .custom-tooltip {
            position: fixed;
            background-color: var(--dark-color);
            color: white;
            padding: 8px 15px;
            border-radius: 5px;
            font-size: 0.9rem;
            z-index: 9999;
            pointer-events: none;
            white-space: nowrap;
        }
        .custom-tooltip::after {
            content: '';
            position: absolute;
            top: 100%;
            left: 50%;
            transform: translateX(-50%);
            border-width: 5px;
            border-style: solid;
            border-color: var(--dark-color) transparent transparent transparent;
        }
    `;
    document.head.appendChild(tooltipStyle);
    
    // Chamar inicialização de tooltips
    initTooltips();
    
    // Efeito de brilho em elementos interativos
    const interactiveElements = document.querySelectorAll('.cta-btn, .area-card, .story-card');
    
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', function() {
            this.style.boxShadow = '0 15px 40px rgba(26, 60, 110, 0.2)';
        });
        
        el.addEventListener('mouseleave', function() {
            this.style.boxShadow = '';
        });
    });
    
    // Log de inicialização
    console.log('Site do Dr. Lourival Oliveira carregado com sucesso!');
});
