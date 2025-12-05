// Sistema de Navegação Quântica
document.addEventListener('DOMContentLoaded', function() {
    // Elementos principais
    const navPlanets = document.querySelectorAll('.nav-planet');
    const quantumToggle = document.getElementById('quantumToggle');
    const summonBtn = document.getElementById('summonBtn');
    const futureBtn = document.getElementById('futureBtn');
    const transmissionBtn = document.getElementById('transmissionBtn');
    const transmissionModal = document.getElementById('transmissionModal');
    const modalClose = document.getElementById('modalClose');
    const returnBtn = document.getElementById('returnBtn');
    const zoomInBtn = document.getElementById('zoomIn');
    const zoomOutBtn = document.getElementById('zoomOut');
    const rotateOrbitsBtn = document.getElementById('rotateOrbits');
    
    // Estado do sistema
    let quantumState = 'active';
    let universeScale = 1;
    let orbitsRotating = true;
    
    // Sistema de Navegação Orbital
    navPlanets.forEach(planet => {
        planet.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            // Remover classe active de todos os planetas
            navPlanets.forEach(p => p.classList.remove('active'));
            // Adicionar classe active ao planeta clicado
            this.classList.add('active');
            
            // Efeito de teletransporte
            document.body.style.opacity = '0.7';
            setTimeout(() => {
                targetSection.scrollIntoView({ behavior: 'smooth' });
                document.body.style.opacity = '1';
            }, 300);
            
            // Efeito de partículas
            createParticleBurst(this);
        });
    });
    
    // Alternar Estado Quântico
    quantumToggle.addEventListener('click', function() {
        const stateIndicator = document.querySelector('.state-indicator');
        const stateText = document.querySelector('.state-text');
        
        if (quantumState === 'active') {
            quantumState = 'standby';
            stateIndicator.style.background = '#ff9900';
            stateIndicator.style.boxShadow = '0 0 10px #ff9900';
            stateText.textContent = 'MODO ESPERA';
            
            // Efeito visual
            document.body.style.filter = 'grayscale(0.3)';
            document.querySelectorAll('.nav-planet').forEach(p => {
                p.style.opacity = '0.5';
            });
        } else {
            quantumState = 'active';
            stateIndicator.style.background = '#00ff00';
            stateIndicator.style.boxShadow = '0 0 10px #00ff00';
            stateText.textContent = 'CONEXÃO ATIVA';
            
            // Restaurar efeito visual
            document.body.style.filter = 'none';
            document.querySelectorAll('.nav-planet').forEach(p => {
                p.style.opacity = '1';
            });
        }
        
        // Efeito de rotação
        this.style.transform = `rotate(${quantumState === 'active' ? '180deg' : '0deg'})`;
    });
    
    // Ativar Jornada
    summonBtn.addEventListener('click', function() {
        const manifestoSection = document.getElementById('manifesto');
        manifestoSection.scrollIntoView({ behavior: 'smooth' });
        
        // Efeito especial
        createPortalEffect(this);
        
        // Atualizar navegação
        navPlanets.forEach(p => p.classList.remove('active'));
        document.querySelector('.nav-planet[href="#manifesto"]').classList.add('active');
    });
    
    // Iniciar Jornada do Futuro
    if (futureBtn) {
        futureBtn.addEventListener('click', function() {
            const contactSection = document.getElementById('constelacao');
            contactSection.scrollIntoView({ behavior: 'smooth' });
            
            // Efeito de brilho
            this.style.boxShadow = '0 0 30px var(--accent-gold)';
            setTimeout(() => {
                this.style.boxShadow = '';
            }, 1000);
        });
    }
    
    // Sistema de Transmissão Quântica
    transmissionBtn.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Validar formulário
        const form = document.querySelector('.wormhole-form');
        const inputs = form.querySelectorAll('input, select, textarea');
        let isValid = true;
        
        inputs.forEach(input => {
            if (!input.value.trim()) {
                isValid = false;
                input.style.borderBottomColor = 'var(--accent-red)';
            } else {
                input.style.borderBottomColor = '';
            }
        });
        
        if (isValid) {
            // Mostrar modal
            transmissionModal.style.display = 'flex';
            
            // Efeito de envio
            const progressFill = document.querySelector('.progress-fill');
            progressFill.style.animation = 'progressFill 3s linear infinite';
            
            // Simular envio
            setTimeout(() => {
                // Resetar formulário
                inputs.forEach(input => {
                    input.value = '';
                    const label = input.previousElementSibling;
                    if (label.tagName === 'LABEL') {
                        label.style.top = '15px';
                        label.style.fontSize = '1rem';
                        label.style.color = 'var(--accent-light)';
                    }
                });
            }, 3000);
        } else {
            // Efeito de erro
            createErrorPulse();
        }
    });
    
    // Fechar Modal
    modalClose.addEventListener('click', function() {
        transmissionModal.style.display = 'none';
    });
    
    // Retornar ao Início
    returnBtn.addEventListener('click', function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        // Atualizar navegação
        navPlanets.forEach(p => p.classList.remove('active'));
        document.querySelector('.nav-planet[href="#home"]').classList.add('active');
    });
    
    // Controles do Multiverso
    if (zoomInBtn && zoomOutBtn) {
        zoomInBtn.addEventListener('click', function() {
            if (universeScale < 2) {
                universeScale += 0.2;
                updateUniverseScale();
            }
        });
        
        zoomOutBtn.addEventListener('click', function() {
            if (universeScale > 0.5) {
                universeScale -= 0.2;
                updateUniverseScale();
            }
        });
    }
    
    // Rotação das Órbitas
    if (rotateOrbitsBtn) {
        rotateOrbitsBtn.addEventListener('click', function() {
            orbitsRotating = !orbitsRotating;
            const orbitPaths = document.querySelectorAll('.orbit-path');
            
            if (orbitsRotating) {
                orbitPaths.forEach(path => {
                    path.style.animationPlayState = 'running';
                });
                this.innerHTML = '<i class="fas fa-sync-alt"></i>';
            } else {
                orbitPaths.forEach(path => {
                    path.style.animationPlayState = 'paused';
                });
                this.innerHTML = '<i class="fas fa-play"></i>';
            }
        });
    }
    
    // Função para atualizar escala do universo
    function updateUniverseScale() {
        const multiverseCore = document.querySelector('.multiverse-core');
        if (multiverseCore) {
            multiverseCore.style.transform = `scale(${universeScale})`;
        }
    }
    
    // Função para criar efeito de partículas
    function createParticleBurst(element) {
        const rect = element.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;
        
        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.style.position = 'fixed';
            particle.style.width = '4px';
            particle.style.height = '4px';
            particle.style.background = 'var(--neon-cyan)';
            particle.style.borderRadius = '50%';
            particle.style.left = `${x}px`;
            particle.style.top = `${y}px`;
            particle.style.zIndex = '1000';
            particle.style.pointerEvents = 'none';
            
            document.body.appendChild(particle);
            
            // Animação
            const angle = Math.random() * Math.PI * 2;
            const velocity = 2 + Math.random() * 3;
            const vx = Math.cos(angle) * velocity;
            const vy = Math.sin(angle) * velocity;
            
            let opacity = 1;
            const animate = () => {
                opacity -= 0.03;
                particle.style.opacity = opacity;
                particle.style.left = `${parseFloat(particle.style.left) + vx}px`;
                particle.style.top = `${parseFloat(particle.style.top) + vy}px`;
                
                if (opacity > 0) {
                    requestAnimationFrame(animate);
                } else {
                    particle.remove();
                }
            };
            
            animate();
        }
    }
    
    // Função para criar efeito de portal
    function createPortalEffect(element) {
        const rect = element.getBoundingClientRect();
        const portal = document.createElement('div');
        
        portal.style.position = 'fixed';
        portal.style.left = `${rect.left + rect.width / 2}px`;
        portal.style.top = `${rect.top + rect.height / 2}px`;
        portal.style.width = '0';
        portal.style.height = '0';
        portal.style.borderRadius = '50%';
        portal.style.background = 'radial-gradient(circle, var(--neon-cyan), transparent)';
        portal.style.zIndex = '1000';
        portal.style.pointerEvents = 'none';
        portal.style.transform = 'translate(-50%, -50%)';
        
        document.body.appendChild(portal);
        
        // Animação de expansão
        let size = 0;
        const expand = () => {
            size += 20;
            portal.style.width = `${size}px`;
            portal.style.height = `${size}px`;
            portal.style.opacity = `${1 - size / 500}`;
            
            if (size < 500) {
                requestAnimationFrame(expand);
            } else {
                portal.remove();
            }
        };
        
        expand();
    }
    
    // Função para criar pulso de erro
    function createErrorPulse() {
        const form = document.querySelector('.wormhole-form');
        form.style.boxShadow = '0 0 30px var(--accent-red)';
        
        setTimeout(() => {
            form.style.boxShadow = '';
        }, 1000);
    }
    
    // Sistema de Constelação Interativa
    const starSystems = document.querySelectorAll('.star-system');
    starSystems.forEach(star => {
        star.addEventListener('click', function() {
            const value = this.getAttribute('data-value');
            const info = this.querySelector('.star-info');
            
            // Animação de destaque
            this.style.transform = 'scale(1.5)';
            info.style.opacity = '1';
            info.style.visibility = 'visible';
            
            // Criar conexões
            createConstellationConnection(this);
            
            setTimeout(() => {
                this.style.transform = '';
            }, 1000);
        });
    });
    
    // Função para criar conexões de constelação
    function createConstellationConnection(star) {
        const stars = document.querySelectorAll('.star-system');
        const constellationLine = document.getElementById('constellation');
        
        // Limpar conexões anteriores
        constellationLine.innerHTML = '';
        
        // Criar novas conexões
        stars.forEach(otherStar => {
            if (star !== otherStar) {
                const x1 = star.offsetLeft + star.offsetWidth / 2;
                const y1 = star.offsetTop + star.offsetHeight / 2;
                const x2 = otherStar.offsetLeft + otherStar.offsetWidth / 2;
                const y2 = otherStar.offsetTop + otherStar.offsetHeight / 2;
                
                // Calcular distância
                const distance = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
                
                // Apenas conectar estrelas próximas
                if (distance < 300) {
                    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                    line.setAttribute('x1', x1);
                    line.setAttribute('y1', y1);
                    line.setAttribute('x2', x2);
                    line.setAttribute('y2', y2);
                    line.setAttribute('stroke', 'var(--neon-cyan)');
                    line.setAttribute('stroke-width', '1');
                    line.setAttribute('stroke-dasharray', '5,5');
                    line.style.opacity = '0.3';
                    
                    constellationLine.appendChild(line);
                }
            }
        });
    }
    
    // Detectar seção visível para atualizar navegação
    function updateActiveSection() {
        const sections = document.querySelectorAll('section');
        const scrollPos = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navPlanets.forEach(planet => {
                    planet.classList.remove('active');
                    if (planet.getAttribute('href') === `#${sectionId}`) {
                        planet.classList.add('active');
                    }
                });
            }
        });
    }
    
    window.addEventListener('scroll', updateActiveSection);
    
    // Inicializar partículas
    initializeParticles();
    
    // Inicializar efeitos especiais
    initializeSpecialEffects();
});

// Inicializar sistema de partículas
function initializeParticles() {
    if (typeof particlesJS !== 'undefined') {
        particlesJS('particles-js', {
            particles: {
                number: { value: 80, density: { enable: true, value_area: 800 } },
                color: { value: ["#00a8ff", "#9c1aff", "#00fff7"] },
                shape: { type: "circle" },
                opacity: { value: 0.5, random: true },
                size: { value: 3, random: true },
                line_linked: {
                    enable: true,
                    distance: 150,
                    color: "#415a77",
                    opacity: 0.2,
                    width: 1
                },
                move: {
                    enable: true,
                    speed: 1,
                    direction: "none",
                    random: true,
                    straight: false,
                    out_mode: "out",
                    bounce: false
                }
            },
            interactivity: {
                detect_on: "canvas",
                events: {
                    onhover: { enable: true, mode: "repulse" },
                    onclick: { enable: true, mode: "push" }
                }
            }
        });
    }
}

// Inicializar efeitos especiais
function initializeSpecialEffects() {
    // Efeito de brilho nos títulos
    const titles = document.querySelectorAll('.section-title');
    titles.forEach(title => {
        title.addEventListener('mouseenter', function() {
            this.style.textShadow = '0 0 20px currentColor';
        });
        
        title.addEventListener('mouseleave', function() {
            this.style.textShadow = '';
        });
    });
    
    // Efeito de parallax suave
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const portal = document.querySelector('.portal-gate');
        const multiverse = document.querySelector('.multiverse-core');
        
        if (portal) {
            portal.style.transform = `translateY(${scrolled * 0.1}px)`;
        }
        
        if (multiverse) {
            multiverse.style.transform = `scale(${universeScale}) translateY(${scrolled * 0.05}px)`;
        }
    });
}
