// Efeitos Especiais Avançados
document.addEventListener('DOMContentLoaded', function() {
    // Sistema de Áudio Espacial
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    let isAudioEnabled = false;
    
    // Sons ambiente
    const ambientSounds = {
        portal: null,
        quantum: null,
        cosmic: null
    };
    
    // Inicializar sons
    function initAudio() {
        // Criar osciladores para sons ambiente
        createPortalSound();
        createQuantumSound();
        createCosmicSound();
    }
    
    function createPortalSound() {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(220, audioContext.currentTime);
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.5);
        
        ambientSounds.portal = { oscillator, gainNode };
        oscillator.start();
    }
    
    function createQuantumSound() {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.type = 'triangle';
        oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.05, audioContext.currentTime + 0.5);
        
        // Modulação de frequência
        const lfo = audioContext.createOscillator();
        const lfoGain = audioContext.createGain();
        
        lfo.type = 'sine';
        lfo.frequency.setValueAtTime(0.5, audioContext.currentTime);
        lfoGain.gain.setValueAtTime(10, audioContext.currentTime);
        
        lfo.connect(lfoGain);
        lfoGain.connect(oscillator.frequency);
        
        ambientSounds.quantum = { oscillator, gainNode, lfo };
        oscillator.start();
        lfo.start();
    }
    
    function createCosmicSound() {
        // Ruído cósmico
        const bufferSize = audioContext.sampleRate * 2;
        const noiseBuffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        
        for (let i = 0; i < bufferSize; i++) {
            output[i] = Math.random() * 2 - 1;
        }
        
        const whiteNoise = audioContext.createBufferSource();
        const filter = audioContext.createBiquadFilter();
        const gainNode = audioContext.createGain();
        
        whiteNoise.buffer = noiseBuffer;
        whiteNoise.loop = true;
        
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(800, audioContext.currentTime);
        filter.Q.setValueAtTime(1, audioContext.currentTime);
        
        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.02, audioContext.currentTime + 1);
        
        whiteNoise.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        ambientSounds.cosmic = { whiteNoise, gainNode };
        whiteNoise.start();
    }
    
    // Controlar volume baseado na seção visível
    function updateAmbientSound() {
        if (!isAudioEnabled) return;
        
        const scrollPos = window.scrollY;
        const windowHeight = window.innerHeight;
        const docHeight = document.documentElement.scrollHeight;
        
        // Calcular intensidade baseada na posição
        const intensity = Math.min(scrollPos / (docHeight - windowHeight), 1);
        
        // Ajustar volumes
        if (ambientSounds.portal && ambientSounds.portal.gainNode) {
            const portalVolume = 0.1 * (1 - intensity * 0.5);
            ambientSounds.portal.gainNode.gain.setValueAtTime(portalVolume, audioContext.currentTime);
        }
        
        if (ambientSounds.quantum && ambientSounds.quantum.gainNode) {
            const quantumVolume = 0.05 * intensity;
            ambientSounds.quantum.gainNode.gain.setValueAtTime(quantumVolume, audioContext.currentTime);
        }
    }
    
    // Inicializar áudio no primeiro clique
    document.body.addEventListener('click', function initAudioOnClick() {
        if (!isAudioEnabled && audioContext.state === 'suspended') {
            audioContext.resume().then(() => {
                isAudioEnabled = true;
                initAudio();
                updateAmbientSound();
            });
        }
        document.body.removeEventListener('click', initAudioOnClick);
    });
    
    // Sistema de Distorção Visual
    const distortionCanvas = document.createElement('canvas');
    const distortionCtx = distortionCanvas.getContext('2d');
    distortionCanvas.style.position = 'fixed';
    distortionCanvas.style.top = '0';
    distortionCanvas.style.left = '0';
    distortionCanvas.style.width = '100%';
    distortionCanvas.style.height = '100%';
    distortionCanvas.style.pointerEvents = 'none';
    distortionCanvas.style.zIndex = '1001';
    distortionCanvas.style.opacity = '0';
    document.body.appendChild(distortionCanvas);
    
    let isDistortionActive = false;
    let distortionTime = 0;
    
    function updateDistortion() {
        if (!isDistortionActive) return;
        
        distortionTime += 0.05;
        distortionCanvas.style.opacity = '0.1';
        
        // Limpar canvas
        distortionCtx.clearRect(0, 0, distortionCanvas.width, distortionCanvas.height);
        
        // Criar efeito de onda
        const centerX = distortionCanvas.width / 2;
        const centerY = distortionCanvas.height / 2;
        const maxRadius = Math.sqrt(centerX * centerX + centerY * centerY);
        
        // Desenhar anéis de distorção
        for (let i = 0; i < 5; i++) {
            const radius = (maxRadius * (i + 1) / 6) + Math.sin(distortionTime + i) * 20;
            const alpha = 0.1 * (1 - i / 5);
            
            distortionCtx.beginPath();
            distortionCtx.arc(centerX, centerY, radius, 0, Math.PI * 2);
            distortionCtx.strokeStyle = `rgba(0, 255, 247, ${alpha})`;
            distortionCtx.lineWidth = 2;
            distortionCtx.stroke();
        }
        
        requestAnimationFrame(updateDistortion);
    }
    
    // Ativar distorção em interações
    const distortionTriggers = document.querySelectorAll('.summon-btn, .transmission-btn, .quantum-toggle');
    
    distortionTriggers.forEach(trigger => {
        trigger.addEventListener('click', function() {
            isDistortionActive = true;
            distortionTime = 0;
            updateDistortion();
            
            setTimeout(() => {
                isDistortionActive = false;
                distortionCanvas.style.opacity = '0';
            }, 1000);
        });
    });
    
    // Sistema de Efeitos de Texto
    const hologramTexts = document.querySelectorAll('.hologram, .cosmic, .stellar, .nebula, .aurora');
    
    hologramTexts.forEach(text => {
        text.addEventListener('mouseenter', function() {
            const letters = this.textContent.split('');
            this.textContent = '';
            
            letters.forEach((letter, index) => {
                const span = document.createElement('span');
                span.textContent = letter;
                span.style.display = 'inline-block';
                span.style.transition = 'transform 0.3s ease';
                
                this.appendChild(span);
                
                setTimeout(() => {
                    span.style.transform = 'translateY(-10px)';
                    
                    setTimeout(() => {
                        span.style.transform = '';
                    }, 300);
                }, index * 50);
            });
        });
    });
    
    // Sistema de Previsão de Scroll
    let scrollDirection = 0;
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        scrollDirection = scrollTop > lastScrollTop ? 1 : -1;
        lastScrollTop = scrollTop;
        
        // Atualizar som ambiente baseado no scroll
        updateAmbientSound();
        
        // Efeito de parallax avançado
        updateAdvancedParallax(scrollTop);
    });
    
    function updateAdvancedParallax(scrollTop) {
        const elements = {
            '.portal-gate': 0.1,
            '.multiverse-core': 0.05,
            '.singularity-core': 0.08,
            '.constellation-container': 0.03
        };
        
        Object.entries(elements).forEach(([selector, speed]) => {
            const element = document.querySelector(selector);
            if (element) {
                const yPos = -(scrollTop * speed);
                element.style.transform = `translateY(${yPos}px)`;
            }
        });
    }
    
    // Sistema de Detecção de Performance
    let frameCount = 0;
    let lastTime = performance.now();
    let fps = 60;
    
    function measurePerformance() {
        frameCount++;
        const currentTime = performance.now();
        
        if (currentTime >= lastTime + 1000) {
            fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
            frameCount = 0;
            lastTime = currentTime;
            
            // Ajustar efeitos baseado na performance
            adjustEffectsForPerformance(fps);
        }
        
        requestAnimationFrame(measurePerformance);
    }
    
    function adjustEffectsForPerformance(currentFps) {
        const particleCount = document.querySelector('#particles-js canvas');
        
        if (currentFps < 30 && particleCount) {
            // Reduzir partículas se FPS baixo
            if (typeof particlesJS !== 'undefined') {
                particlesJS('particles-js', {
                    ...particlesConfig,
                    particles: {
                        ...particlesConfig.particles,
                        number: { value: 40 }
                    }
                });
            }
        } else if (currentFps > 50 && particleCount) {
            // Restaurar partículas se FPS bom
            if (typeof particlesJS !== 'undefined') {
                particlesJS('particles-js', particlesConfig);
            }
        }
    }
    
    // Iniciar medição de performance
    measurePerformance();
    
    // Sistema de Easter Eggs
    const konamiCode = [
        'ArrowUp', 'ArrowUp',
        'ArrowDown', 'ArrowDown',
        'ArrowLeft', 'ArrowRight',
        'ArrowLeft', 'ArrowRight',
        'b', 'a'
    ];
    let konamiIndex = 0;
    
    document.addEventListener('keydown', function(e) {
        if (e.key === konamiCode[konamiIndex]) {
            konamiIndex++;
            
            if (konamiIndex === konamiCode.length) {
                activateEasterEgg();
                konamiIndex = 0;
            }
        } else {
            konamiIndex = 0;
        }
    });
    
    function activateEasterEgg() {
        // Efeito especial do Easter Egg
        document.body.style.animation = 'rainbow 5s linear infinite';
        
        // Criar estilo para animação rainbow
        const style = document.createElement('style');
        style.textContent = `
            @keyframes rainbow {
                0% { filter: hue-rotate(0deg); }
                100% { filter: hue-rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
        
        // Sons especiais
        playEasterEggSound();
        
        // Mensagem secreta
        showSecretMessage();
        
        setTimeout(() => {
            document.body.style.animation = '';
            style.remove();
        }, 5000);
    }
    
    function playEasterEggSound() {
        if (audioContext && isAudioEnabled) {
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            // Tocar música secreta
            const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99];
            let time = audioContext.currentTime;
            
            notes.forEach((freq, index) => {
                oscillator.frequency.setValueAtTime(freq, time + index * 0.2);
                gainNode.gain.setValueAtTime(0.3, time + index * 0.2);
                gainNode.gain.exponentialRampToValueAtTime(0.01, time + index * 0.2 + 0.15);
            });
            
            oscillator.start();
            oscillator.stop(time + notes.length * 0.2);
        }
    }
    
    function showSecretMessage() {
        const message = document.createElement('div');
        message.innerHTML = `
            <div style="
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: rgba(0,0,0,0.9);
                color: #00fff7;
                padding: 30px;
                border-radius: 20px;
                border: 2px solid #00fff7;
                z-index: 2000;
                text-align: center;
                max-width: 500px;
                box-shadow: 0 0 50px #00fff7;
            ">
                <h3 style="margin-bottom: 20px;">🌟 DESCOBERTA CÓSMICA! 🌟</h3>
                <p>Você encontrou o Nexus Secreto do Dr. Lourival Oliveira!</p>
                <p style="margin-top: 15px; font-size: 0.9em; color: #aaa;">
                    A excelência jurídica está em todas as dimensões...
                </p>
            </div>
        `;
        
        document.body.appendChild(message);
        
        setTimeout(() => {
            message.remove();
        }, 3000);
    }
    
    // Sistema de Animações de Entrada
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                
                // Efeito especial para cada tipo de elemento
                if (entry.target.classList.contains('manifesto-card')) {
                    createCardEntranceEffect(entry.target);
                } else if (entry.target.classList.contains('orbit-planet')) {
                    createPlanetEntranceEffect(entry.target);
                } else if (entry.target.classList.contains('timeline-event')) {
                    createTimelineEntranceEffect(entry.target);
                }
            }
        });
    }, observerOptions);
    
    // Observar elementos para animação
    document.querySelectorAll('.manifesto-card, .orbit-planet, .timeline-event, .star-system').forEach(el => {
        observer.observe(el);
    });
    
    function createCardEntranceEffect(card) {
        card.style.opacity = '0';
        card.style.transform = 'translateY(50px) rotateX(45deg)';
        
        setTimeout(() => {
            card.style.transition = 'all 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0) rotateX(0)';
        }, 100);
    }
    
    function createPlanetEntranceEffect(planet) {
        const scale = 0.5 + Math.random() * 0.5;
        planet.style.transform = `scale(${scale})`;
        
        setTimeout(() => {
            planet.style.transition = 'transform 1s ease';
            planet.style.transform = 'scale(1)';
        }, 200);
    }
    
    function createTimelineEntranceEffect(event) {
        const portal = event.querySelector('.event-portal');
        if (portal) {
            portal.style.transform = 'scale(0)';
            
            setTimeout(() => {
                portal.style.transition = 'transform 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
                portal.style.transform = 'scale(1)';
            }, 300);
        }
    }
    
    // Sistema de Notificações Quânticas
    function showQuantumNotification(message, type = 'info') {
        const notification = document.createElement('div');
        const colors = {
            info: '#00a8ff',
            success: '#00ffaa',
            warning: '#ffaa00',
            error: '#ff0055'
        };
        
        notification.innerHTML = `
            <div style="
                position: fixed;
                top: 20px;
                right: 20px;
                background: rgba(13, 27, 42, 0.95);
                border: 1px solid ${colors[type]};
                border-radius: 10px;
                padding: 15px 20px;
                color: white;
                z-index: 2000;
                transform: translateX(150%);
                transition: transform 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
                max-width: 300px;
                box-shadow: 0 5px 20px rgba(0,0,0,0.3);
            ">
                <div style="display: flex; align-items: center; gap: 10px;">
                    <div style="
                        width: 10px;
                        height: 10px;
                        border-radius: 50%;
                        background: ${colors[type]};
                        box-shadow: 0 0 10px ${colors[type]};
                    "></div>
                    <div>${message}</div>
                </div>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.querySelector('div').style.transform = 'translateX(0)';
        }, 10);
        
        setTimeout(() => {
            notification.querySelector('div').style.transform = 'translateX(150%)';
            setTimeout(() => notification.remove(), 500);
        }, 3000);
    }
    
    // Exemplo de notificação de boas-vindas
    setTimeout(() => {
        showQuantumNotification('Sistema quântico ativado. Bem-vindo ao Nexus Jurídico.', 'success');
    }, 1000);
    
    // Sistema de Análise de Engajamento
    let timeOnSite = 0;
    let interactions = 0;
    const engagementThreshold = 30; // segundos
    
    setInterval(() => {
        timeOnSite++;
        
        if (timeOnSite === engagementThreshold) {
            showQuantumNotification('Você está explorando profundamente o multiverso jurídico!', 'info');
        }
    }, 1000);
    
    // Contar interações
    document.addEventListener('click', () => {
        interactions++;
        
        if (interactions === 5) {
            showQuantumNotification('Interação quântica detectada! O sistema está aprendendo com você.', 'warning');
        } else if (interactions === 10) {
            showQuantumNotification('Nível de engajamento máximo alcançado! Você está pronto para o próximo nível.', 'success');
        }
    });
    
    // Sistema de Detecção de Dispositivo
    function detectDevice() {
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        const isTablet = /iPad|Android(?!.*Mobile)/i.test(navigator.userAgent);
        
        if (isMobile || isTablet) {
            // Otimizar para dispositivos móveis
            optimizeForMobile();
        }
    }
    
    function optimizeForMobile() {
        // Reduzir complexidade de animações
        if (typeof particlesJS !== 'undefined') {
            particlesJS('particles-js', {
                ...particlesConfig,
                particles: {
                    ...particlesConfig.particles,
                    number: { value: 30 }
                }
            });
        }
        
        // Ajustar efeitos visuais
        document.querySelectorAll('.orbit-path').forEach(path => {
            path.style.animationDuration = '120s';
        });
        
        // Mostrar notificação
        showQuantumNotification('Modo móvel ativado. Experiência otimizada para seu dispositivo.', 'info');
    }
    
    detectDevice();
});
