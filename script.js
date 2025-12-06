// Inicialização quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    // Menu Mobile Toggle
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.innerHTML = navMenu.classList.contains('active') 
                ? '<i class="fas fa-times"></i>' 
                : '<i class="fas fa-bars"></i>';
        });
        
        // Fechar menu ao clicar em um link
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                navToggle.innerHTML = '<i class="fas fa-bars"></i>';
            });
        });
    }
    
    // Efeito de digitação no hero
    const typingText = document.querySelector('.typing-text');
    if (typingText) {
        const words = ['Justiça', 'Defesa', 'Direitos', 'Resultados', 'Excelência'];
        let wordIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let isPaused = false;
        
        function typeEffect() {
            const currentWord = words[wordIndex];
            
            if (!isPaused) {
                if (!isDeleting && charIndex <= currentWord.length) {
                    typingText.textContent = currentWord.substring(0, charIndex);
                    charIndex++;
                    setTimeout(typeEffect, 100);
                } else if (isDeleting && charIndex >= 0) {
                    typingText.textContent = currentWord.substring(0, charIndex);
                    charIndex--;
                    setTimeout(typeEffect, 50);
                } else {
                    isDeleting = !isDeleting;
                    
                    if (!isDeleting) {
                        wordIndex = (wordIndex + 1) % words.length;
                    }
                    
                    // Pausa antes de começar a digitar a próxima palavra
                    isPaused = true;
                    setTimeout(() => {
                        isPaused = false;
                        typeEffect();
                    }, 1500);
                }
            }
        }
        
        // Iniciar o efeito após um breve delay
        setTimeout(typeEffect, 1000);
    }
    
    // Scroll suave para links internos
    const smoothScrollLinks = document.querySelectorAll('a[href^="#"]');
    smoothScrollLinks.forEach(link => {
        link.addEventListener('click', function(e) {
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
    
    // Ativar link do menu conforme scroll
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    function highlightNavLink() {
        let scrollPosition = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    
    window.addEventListener('scroll', highlightNavLink);
    
    // Formulário de contato
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Aqui normalmente você enviaria os dados para um servidor
            // Por enquanto, vamos apenas simular o envio
            
            // Coletar dados do formulário
            const formData = {
                name: document.getElementById('name').value,
                phone: document.getElementById('phone').value,
                email: document.getElementById('email').value,
                subject: document.getElementById('subject').value,
                message: document.getElementById('message').value
            };
            
            // Exibir mensagem de sucesso
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
            submitBtn.disabled = true;
            
            // Simular envio
            setTimeout(() => {
                // Aqui você normalmente enviaria os dados para um servidor
                // Por exemplo: fetch('seu-endpoint', { method: 'POST', body: JSON.stringify(formData) })
                
                // Mostrar mensagem de sucesso
                alert(`Obrigado, ${formData.name}! Sua mensagem foi enviada com sucesso. Entraremos em contato em até 24 horas.`);
                
                // Resetar formulário
                contactForm.reset();
                
                // Restaurar botão
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }, 1500);
        });
    }
    
    // Animar elementos ao rolar a página
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.area-card, .feature, .info-card');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.2;
            
            if (elementPosition < screenPosition) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    };
    
    // Inicializar elementos com opacidade 0 para animação
    const animatedElements = document.querySelectorAll('.area-card, .feature, .info-card');
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });
    
    window.addEventListener('scroll', animateOnScroll);
    // Executar uma vez ao carregar a página
    setTimeout(animateOnScroll, 300);
    
    // Efeito parallax no hero
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        
        if (hero) {
            hero.style.backgroundPositionY = `${scrolled * 0.5}px`;
        }
    });
    
    // Mudar navbar ao rolar
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.style.padding = '15px 0';
            navbar.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.padding = '20px 0';
            navbar.style.boxShadow = 'none';
        }
    });
    
    // Inicializar contadores
    const stats = document.querySelectorAll('.stat h3');
    stats.forEach(stat => {
        const target = parseInt(stat.textContent);
        let current = 0;
        const increment = target / 100;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            stat.textContent = Math.floor(current) + (stat.textContent.includes('%') ? '%' : '+');
        }, 20);
    });
});
