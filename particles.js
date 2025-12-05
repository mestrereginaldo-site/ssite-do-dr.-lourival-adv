// Configuração avançada de partículas
const particlesConfig = {
    particles: {
        number: {
            value: 100,
            density: {
                enable: true,
                value_area: 800
            }
        },
        color: {
            value: ["#00a8ff", "#9c1aff", "#00fff7", "#ff0055", "#ffd700"]
        },
        shape: {
            type: "circle",
            stroke: {
                width: 0,
                color: "#000000"
            }
        },
        opacity: {
            value: 0.5,
            random: true,
            anim: {
                enable: true,
                speed: 1,
                opacity_min: 0.1,
                sync: false
            }
        },
        size: {
            value: 3,
            random: true,
            anim: {
                enable: true,
                speed: 2,
                size_min: 0.1,
                sync: false
            }
        },
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
            bounce: false,
            attract: {
                enable: false,
                rotateX: 600,
                rotateY: 1200
            }
        }
    },
    interactivity: {
        detect_on: "canvas",
        events: {
            onhover: {
                enable: true,
                mode: "repulse"
            },
            onclick: {
                enable: true,
                mode: "push"
            },
            resize: true
        },
        modes: {
            grab: {
                distance: 400,
                line_linked: {
                    opacity: 0.5
                }
            },
            bubble: {
                distance: 400,
                size: 40,
                duration: 2,
                opacity: 8,
                speed: 3
            },
            repulse: {
                distance: 100,
                duration: 0.4
            },
            push: {
                particles_nb: 4
            },
            remove: {
                particles_nb: 2
            }
        }
    },
    retina_detect: true
};

// Inicializar partículas se a biblioteca estiver disponível
if (typeof particlesJS !== 'undefined') {
    particlesJS('particles-js', particlesConfig);
}

// Sistema de partículas customizado para efeitos especiais
class QuantumParticleSystem {
    constructor() {
        this.particles = [];
        this.canvas = null;
        this.ctx = null;
        this.init();
    }
    
    init() {
        this.canvas = document.createElement('canvas');
        this.canvas.id = 'quantum-particles';
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.zIndex = '999';
        document.body.appendChild(this.canvas);
        
        this.ctx = this.canvas.getContext('2d');
        this.resize();
        window.addEventListener('resize', () => this.resize());
        
        this.animate();
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    createBurst(x, y, count = 20, color = '#00fff7') {
        for (let i = 0; i < count; i++) {
            this.particles.push({
                x,
                y,
                vx: (Math.random() - 0.5) * 10,
                vy: (Math.random() - 0.5) * 10,
                radius: Math.random() * 3 + 1,
                color,
                life: 1,
                decay: 0.02 + Math.random() * 0.02
            });
        }
    }
    
    createTrail(x, y, color = '#00a8ff') {
        this.particles.push({
            x,
            y,
            vx: 0,
            vy: 0,
            radius: Math.random() * 2 + 1,
            color,
            life: 0.5,
            decay: 0.01
        });
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Atualizar e desenhar partículas
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            
            // Atualizar posição
            p.x += p.vx;
            p.y += p.vy;
            p.vx *= 0.98;
            p.vy *= 0.98;
            p.life -= p.decay;
            
            // Desenhar partícula
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = p.color;
            this.ctx.globalAlpha = p.life;
            this.ctx.fill();
            
            // Remover partículas mortas
            if (p.life <= 0) {
                this.particles.splice(i, 1);
            }
        }
        
        requestAnimationFrame(() => this.animate());
    }
}

// Inicializar sistema de partículas quânticas
let quantumParticles = null;
document.addEventListener('DOMContentLoaded', () => {
    quantumParticles = new QuantumParticleSystem();
    
    // Adicionar efeito de partículas aos elementos interativos
    const interactiveElements = document.querySelectorAll('.nav-planet, .summon-btn, .transmission-btn, .orbit-planet');
    
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', function(e) {
            const rect = this.getBoundingClientRect();
            const x = rect.left + rect.width / 2;
            const y = rect.top + rect.height / 2;
            
            if (quantumParticles) {
                quantumParticles.createBurst(x, y, 5, '#00fff7');
            }
        });
        
        element.addEventListener('click', function(e) {
            const rect = this.getBoundingClientRect();
            const x = rect.left + rect.width / 2;
            const y = rect.top + rect.height / 2;
            
            if (quantumParticles) {
                quantumParticles.createBurst(x, y, 15, this.classList.contains('summon-btn') ? '#00a8ff' : '#9c1aff');
            }
        });
    });
    
    // Efeito de partículas no scroll
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;
        const scrollDelta = currentScroll - lastScroll;
        
        if (Math.abs(scrollDelta) > 5 && quantumParticles) {
            const x = Math.random() * window.innerWidth;
            quantumParticles.createTrail(x, 0, '#415a77');
        }
        
        lastScroll = currentScroll;
    });
});
