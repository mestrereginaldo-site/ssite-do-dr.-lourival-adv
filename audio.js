// SISTEMA DE ÁUDIO ESPACIAL 3D
// MOTOR DE IMERSÃO SONORA DO SISTEMA NEURAL

class AudioEngine {
    constructor() {
        this.context = null;
        this.sources = new Map();
        this.nodes = new Map();
        this.spatialEnabled = false;
        this.volume = 0.5;
        this.effects = new Map();
        
        this.initialize();
    }
    
    async initialize() {
        console.log('🎵 INICIALIZANDO MOTOR DE ÁUDIO...');
        
        try {
            // Criar contexto de áudio
            this.context = new (window.AudioContext || window.webkitAudioContext)();
            
            if (this.context.state === 'suspended') {
                await this.context.resume();
            }
            
            // Configurar processamento principal
            this.setupMasterProcessing();
            
            // Carregar sons do sistema
            await this.loadSystemSounds();
            
            // Configurar áudio espacial
            this.setupSpatialAudio();
            
            // Configurar efeitos sonoros
            this.setupAudioEffects();
            
            console.log('✅ MOTOR DE ÁUDIO INICIALIZADO');
            
        } catch (error) {
            console.error('❌ ERRO NO MOTOR DE ÁUDIO:', error);
            this.createFallbackSystem();
        }
    }
    
    setupMasterProcessing() {
        // Criar nós principais de processamento
        this.masterGain = this.context.createGain();
        this.compressor = this.context.createDynamicsCompressor();
        this.analyser = this.context.createAnalyser();
        
        // Configurar compressor
        this.compressor.threshold.value = -24;
        this.compressor.knee.value = 30;
        this.compressor.ratio.value = 12;
        this.compressor.attack.value = 0.003;
        this.compressor.release.value = 0.25;
        
        // Conectar nós
        this.masterGain.connect(this.compressor);
        this.compressor.connect(this.analyser);
        this.analyser.connect(this.context.destination);
        
        // Configurar volume inicial
        this.masterGain.gain.value = this.volume;
        
        // Configurar análise para visualização
        this.analyser.fftSize = 2048;
        this.bufferLength = this.analyser.frequencyBinCount;
        this.dataArray = new Uint8Array(this.bufferLength);
    }
    
    async loadSystemSounds() {
        console.log('📥 CARREGANDO SONS DO SISTEMA...');
        
        const soundLibrary = {
            // Sons de interface
            click: { 
                url: 'https://assets.mixkit.co/sfx/preview/mixkit-select-click-1109.mp3',
                type: 'interface'
            },
            hover: {
                url: 'https://assets.mixkit.co/sfx/preview/mixkit-hover-sci-fi-mouse-902.mp3',
                type: 'interface'
            },
            activate: {
                url: 'https://assets.mixkit.co/sfx/preview/mixkit-unlock-game-notification-253.mp3',
                type: 'system'
            },
            success: {
                url: 'https://assets.mixkit.co/sfx/preview/mixkit-winning-chimes-2015.mp3',
                type: 'feedback'
            },
            error: {
                url: 'https://assets.mixkit.co/sfx/preview/mixkit-wrong-answer-fail-notification-946.mp3',
                type: 'feedback'
            },
            
            // Sons ambientais
            ambient_neural: {
                url: 'https://assets.mixkit.co/music/preview/mixkit-tech-house-vibes-130.mp3',
                type: 'ambient',
                loop: true
            },
            ambient_quantum: {
                url: 'https://assets.mixkit.co/music/preview/mixkit-deep-urban-623.mp3',
                type: 'ambient',
                loop: true
            },
            ambient_matrix: {
                url: 'https://assets.mixkit.co/music/preview/mixkit-futuristic-robotic-303.mp3',
                type: 'ambient',
                loop: true
            }
        };
        
        // Carregar cada som
        for (const [key, sound] of Object.entries(soundLibrary)) {
            await this.loadSound(key, sound);
        }
        
        console.log(`✅ ${Object.keys(soundLibrary).length} SONS CARREGADOS`);
    }
    
    async loadSound(key, sound) {
        try {
            const response = await fetch(sound.url);
            const arrayBuffer = await response.arrayBuffer();
            
            // Decodificar áudio
            const audioBuffer = await this.context.decodeAudioData(arrayBuffer);
            
            // Armazenar no sistema
            this.sources.set(key, {
                buffer: audioBuffer,
                config: sound
            });
            
        } catch (error) {
            console.warn(`⚠️ Não foi possível carregar o som: ${key}`, error);
            // Criar som sintético como fallback
            this.createSyntheticSound(key, sound.type);
        }
    }
    
    setupSpatialAudio() {
        console.log('🎧 CONFIGURANDO ÁUDIO ESPACIAL...');
        
        // Verificar suporte a PannerNode
        if (!this.context.createPanner && !this.context.createStereoPanner) {
            console.warn('⚠️ Navegador não suporta áudio espacial completo');
            this.spatialEnabled = false;
            return;
        }
        
        this.spatialEnabled = true;
        
        // Configurar listener 3D
        this.listener = this.context.listener;
        
        // Posição do listener (centro da tela)
        this.listener.positionX.value = 0;
        this.listener.positionY.value = 0;
        this.listener.positionZ.value = 1;
        
        // Configurar orientação
        this.listener.forwardX.value = 0;
        this.listener.forwardY.value = 0;
        this.listener.forwardZ.value = -1;
        this.listener.upX.value = 0;
        this.listener.upY.value = 1;
        this.listener.upZ.value = 0;
        
        // Rastrear posição do cursor para áudio espacial
        this.setupCursorTracking();
    }
    
    setupCursorTracking() {
        if (!this.spatialEnabled) return;
        
        document.addEventListener('mousemove', (e) => {
            this.updateSpatialAudio(e.clientX, e.clientY);
        });
        
        // Atualizar também em dispositivos touch
        document.addEventListener('touchmove', (e) => {
            if (e.touches.length > 0) {
                this.updateSpatialAudio(e.touches[0].clientX, e.touches[0].clientY);
            }
        });
    }
    
    setupAudioEffects() {
        console.log('🎛️ CONFIGURANDO EFEITOS DE ÁUDIO...');
        
        // Criar efeitos disponíveis
        this.effects.set('reverb', this.createReverb());
        this.effects.set('delay', this.createDelay());
        this.effects.set('filter', this.createFilter());
        this.effects.set('distortion', this.createDistortion());
        this.effects.set('chorus', this.createChorus());
        
        // Conectar efeitos à cadeia principal
        this.connectEffectsChain();
    }
    
    // ========== CONTROLES PRINCIPAIS ==========
    
    play(key, options = {}) {
        if (!this.sources.has(key)) {
            console.warn(`⚠️ Som não encontrado: ${key}`);
            return null;
        }
        
        const source = this.sources.get(key);
        const soundConfig = source.config;
        
        // Criar source node
        const soundSource = this.context.createBufferSource();
        soundSource.buffer = source.buffer;
        
        // Criar chain de processamento
        const chain = this.createProcessingChain(options);
        
        // Conectar
        soundSource.connect(chain.input);
        chain.output.connect(this.masterGain);
        
        // Configurar
        if (soundConfig.loop) {
            soundSource.loop = true;
        }
        
        if (options.volume !== undefined) {
            chain.gain.gain.value = options.volume;
        }
        
        if (options.playbackRate !== undefined) {
            soundSource.playbackRate.value = options.playbackRate;
        }
        
        // Iniciar reprodução
        const startTime = options.when || this.context.currentTime;
        const offset = options.offset || 0;
        
        soundSource.start(startTime, offset);
        
        // Armazenar para controle
        const soundInstance = {
            source: soundSource,
            chain: chain,
            stop: (when = 0) => {
                soundSource.stop(this.context.currentTime + when);
            },
            fadeOut: (duration = 1) => {
                chain.gain.gain.linearRampToValueAtTime(0.001, this.context.currentTime + duration);
                setTimeout(() => {
                    soundSource.stop();
                }, duration * 1000);
            }
        };
        
        // Adicionar à lista de instâncias ativas
        if (!this.activeInstances) this.activeInstances = new Set();
        this.activeInstances.add(soundInstance);
        
        // Limpar após conclusão
        soundSource.onended = () => {
            this.activeInstances.delete(soundInstance);
        };
        
        return soundInstance;
    }
    
    stopAll() {
        if (this.activeInstances) {
            this.activeInstances.forEach(instance => {
                try {
                    instance.source.stop();
                } catch (e) {
                    // Já parado
                }
            });
            this.activeInstances.clear();
        }
    }
    
    setVolume(level) {
        this.volume = Math.max(0, Math.min(1, level));
        
        if (this.masterGain) {
            this.masterGain.gain.value = this.volume;
        }
    }
    
    toggleMute() {
        this.setVolume(this.volume > 0 ? 0 : 0.5);
        return this.volume > 0;
    }
    
    // ========== ÁUDIO ESPACIAL ==========
    
    updateSpatialAudio(x, y) {
        if (!this.spatialEnabled || !this.spatialSources) return;
        
        // Converter coordenadas da tela para coordenadas 3D
        const normalizedX = (x / window.innerWidth) * 2 - 1; // -1 a 1
        const normalizedY = (y / window.innerHeight) * 2 - 1; // -1 a 1
        
        // Atualizar fontes espaciais ativas
        this.spatialSources.forEach((source, key) => {
            if (source.panner) {
                // Posicionar baseado no cursor
                source.panner.positionX.value = normalizedX * 10;
                source.panner.positionY.value = normalizedY * 10;
                source.panner.positionZ.value = -5;
            }
        });
    }
    
    playSpatial(key, x, y, options = {}) {
        const instance = this.play(key, options);
        
        if (!instance || !this.spatialEnabled) return instance;
        
        // Criar panner para áudio espacial
        const panner = this.context.createPanner();
        panner.panningModel = 'HRTF';
        panner.distanceModel = 'inverse';
        panner.refDistance = 1;
        panner.maxDistance = 10000;
        panner.rolloffFactor = 1;
        panner.coneInnerAngle = 360;
        panner.coneOuterAngle = 0;
        panner.coneOuterGain = 0;
        
        // Posicionar
        const normalizedX = (x / window.innerWidth) * 2 - 1;
        const normalizedY = (y / window.innerHeight) * 2 - 1;
        
        panner.positionX.value = normalizedX * 10;
        panner.positionY.value = normalizedY * 10;
        panner.positionZ.value = -5;
        
        // Reconectar chain com panner
        instance.chain.output.disconnect();
        instance.chain.output.connect(panner);
        panner.connect(this.masterGain);
        
        // Armazenar panner
        instance.panner = panner;
        
        // Adicionar às fontes espaciais
        if (!this.spatialSources) this.spatialSources = new Map();
        this.spatialSources.set(instance, panner);
        
        // Limpar quando terminar
        instance.source.onended = () => {
            this.spatialSources.delete(instance);
            if (this.activeInstances) {
                this.activeInstances.delete(instance);
            }
        };
        
        return instance;
    }
    
    // ========== EFEITOS DE ÁUDIO ==========
    
    createProcessingChain(options = {}) {
        const chain = {
            input: null,
            output: null,
            gain: null,
            nodes: {}
        };
        
        // Criar gain node para volume
        chain.gain = this.context.createGain();
        chain.gain.gain.value = options.volume || 1;
        
        // Conectar ganho como entrada da chain
        chain.input = chain.gain;
        chain.output = chain.gain;
        
        // Aplicar efeitos solicitados
        if (options.effects) {
            options.effects.forEach(effectName => {
                const effect = this.effects.get(effectName);
                if (effect) {
                    // Conectar efeito à chain
                    chain.output.connect(effect.input);
                    chain.output = effect.output;
                    chain.nodes[effectName] = effect;
                }
            });
        }
        
        // Aplicar filtros
        if (options.filter) {
            const filter = this.createFilter(options.filter);
            chain.output.connect(filter);
            chain.output = filter;
            chain.nodes.filter = filter;
        }
        
        return chain;
    }
    
    createReverb() {
        const convolver = this.context.createConvolver();
        const gain = this.context.createGain();
        
        // Criar resposta ao impulso para reverb
        const sampleRate = this.context.sampleRate;
        const length = sampleRate * 2;
        const impulse = this.context.createBuffer(2, length, sampleRate);
        const left = impulse.getChannelData(0);
        const right = impulse.getChannelData(1);
        
        for (let i = 0; i < length; i++) {
            left[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 3);
            right[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 3);
        }
        
        convolver.buffer = impulse;
        
        // Configurar ganho do reverb
        gain.gain.value = 0.5;
        
        // Conectar
        convolver.connect(gain);
        
        return {
            input: convolver,
            output: gain,
            setWet: (value) => {
                gain.gain.value = value;
            }
        };
    }
    
    createDelay() {
        const delay = this.context.createDelay();
        const feedback = this.context.createGain();
        const wet = this.context.createGain();
        
        // Configurar
        delay.delayTime.value = 0.3;
        feedback.gain.value = 0.5;
        wet.gain.value = 0.3;
        
        // Criar feedback loop
        delay.connect(feedback);
        feedback.connect(delay);
        delay.connect(wet);
        
        return {
            input: delay,
            output: wet,
            setTime: (value) => {
                delay.delayTime.value = value;
            },
            setFeedback: (value) => {
                feedback.gain.value = value;
            }
        };
    }
    
    createFilter() {
        const filter = this.context.createBiquadFilter();
        
        // Configurar como filtro passa-baixa
        filter.type = 'lowpass';
        filter.frequency.value = 20000;
        filter.Q.value = 1;
        
        return {
            input: filter,
            output: filter,
            setFrequency: (value) => {
                filter.frequency.value = value;
            },
            setQ: (value) => {
                filter.Q.value = value;
            },
            setType: (type) => {
                filter.type = type;
            }
        };
    }
    
    createDistortion() {
        const waveShaper = this.context.createWaveShaper();
        
        // Criar curva de distorção
        function makeDistortionCurve(amount) {
            const k = typeof amount === 'number' ? amount : 50;
            const n_samples = 44100;
            const curve = new Float32Array(n_samples);
            const deg = Math.PI / 180;
            
            for (let i = 0; i < n_samples; ++i) {
                const x = i * 2 / n_samples - 1;
                curve[i] = (3 + k) * x * 20 * deg / (Math.PI + k * Math.abs(x));
            }
            return curve;
        }
        
        waveShaper.curve = makeDistortionCurve(50);
        waveShaper.oversample = '4x';
        
        return {
            input: waveShaper,
            output: waveShaper,
            setAmount: (value) => {
                waveShaper.curve = makeDistortionCurve(value);
            }
        };
    }
    
    createChorus() {
        const splitter = this.context.createChannelSplitter(2);
        const merger = this.context.createChannelMerger(2);
        const delayL = this.context.createDelay();
        const delayR = this.context.createDelay();
        const oscL = this.context.createOscillator();
        const oscR = this.context.createOscillator();
        const gainL = this.context.createGain();
        const gainR = this.context.createGain();
        const wetL = this.context.createGain();
        const wetR = this.context.createGain();
        
        // Configurar
        delayL.delayTime.value = 0.03;
        delayR.delayTime.value = 0.03;
        
        oscL.frequency.value = 0.5;
        oscR.frequency.value = 0.5;
        
        gainL.gain.value = 0.004;
        gainR.gain.value = 0.004;
        
        wetL.gain.value = 0.5;
        wetR.gain.value = 0.5;
        
        // Conectar
        splitter.connect(delayL, 0);
        splitter.connect(delayR, 1);
        
        oscL.connect(gainL);
        oscR.connect(gainR);
        
        gainL.connect(delayL.delayTime);
        gainR.connect(delayR.delayTime);
        
        delayL.connect(wetL);
        delayR.connect(wetR);
        
        splitter.connect(merger, 0, 0);
        splitter.connect(merger, 1, 1);
        wetL.connect(merger, 0, 0);
        wetR.connect(merger, 0, 1);
        
        // Iniciar osciladores
        oscL.start();
        oscR.start();
        
        return {
            input: splitter,
            output: merger,
            setRate: (value) => {
                oscL.frequency.value = value;
                oscR.frequency.value = value;
            },
            setDepth: (value) => {
                gainL.gain.value = value * 0.004;
                gainR.gain.value = value * 0.004;
            },
            setWet: (value) => {
                wetL.gain.value = value;
                wetR.gain.value = value;
            }
        };
    }
    
    connectEffectsChain() {
        // Conectar efeitos em série paralela para master chain
        const wetGain = this.context.createGain();
        const dryGain = this.context.createGain();
        const merger = this.context.createChannelMerger(2);
        
        wetGain.gain.value = 0.3;
        dryGain.gain.value = 0.7;
        
        // Conexão básica - pode ser expandida
        this.masterGain.connect(dryGain);
        dryGain.connect(merger, 0, 0);
        
        // Adicionar alguns efeitos à chain master
        const reverb = this.effects.get('reverb');
        if (reverb) {
            this.masterGain.connect(reverb.input);
            reverb.output.connect(wetGain);
            wetGain.connect(merger, 0, 1);
        }
        
        merger.connect(this.compressor);
    }
    
    // ========== SONS SINTÉTICOS ==========
    
    createSyntheticSound(key, type) {
        console.log(`🔧 CRIANDO SOM SINTÉTICO: ${key}`);
        
        let buffer;
        
        switch (type) {
            case 'interface':
                buffer = this.createBeep(800, 0.1);
                break;
            case 'system':
                buffer = this.createSweep(200, 1000, 0.3);
                break;
            case 'feedback':
                buffer = this.createChord([523.25, 659.25, 783.99], 0.5);
                break;
            case 'ambient':
                buffer = this.createNoise(10);
                break;
            default:
                buffer = this.createBeep(440, 0.2);
        }
        
        this.sources.set(key, {
            buffer: buffer,
            config: { type, synthetic: true }
        });
    }
    
    createBeep(frequency, duration) {
        const sampleRate = this.context.sampleRate;
        const buffer = this.context.createBuffer(1, sampleRate * duration, sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < data.length; i++) {
            data[i] = Math.sin(2 * Math.PI * frequency * i / sampleRate) * 
                     Math.pow(1 - i / data.length, 2);
        }
        
        return buffer;
    }
    
    createSweep(startFreq, endFreq, duration) {
        const sampleRate = this.context.sampleRate;
        const buffer = this.context.createBuffer(1, sampleRate * duration, sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < data.length; i++) {
            const progress = i / data.length;
            const frequency = startFreq + (endFreq - startFreq) * progress;
            data[i] = Math.sin(2 * Math.PI * frequency * i / sampleRate) * 
                     (1 - progress);
        }
        
        return buffer;
    }
    
    createChord(frequencies, duration) {
        const sampleRate = this.context.sampleRate;
        const buffer = this.context.createBuffer(1, sampleRate * duration, sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < data.length; i++) {
            let sample = 0;
            frequencies.forEach(freq => {
                sample += Math.sin(2 * Math.PI * freq * i / sampleRate) / frequencies.length;
            });
            data[i] = sample * Math.pow(1 - i / data.length, 2);
        }
        
        return buffer;
    }
    
    createNoise(duration) {
        const sampleRate = this.context.sampleRate;
        const buffer = this.context.createBuffer(1, sampleRate * duration, sampleRate);
        const data = buffer.getChannelData(0);
        
        // Ruído rosa (filtrado)
        let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
        
        for (let i = 0; i < data.length; i++) {
            const white = Math.random() * 2 - 1;
            
            // Filtro para ruído rosa
            b0 = 0.99886 * b0 + white * 0.0555179;
            b1 = 0.99332 * b1 + white * 0.0750759;
            b2 = 0.96900 * b2 + white * 0.1538520;
            b3 = 0.86650 * b3 + white * 0.3104856;
            b4 = 0.55000 * b4 + white * 0.5329522;
            b5 = -0.7616 * b5 - white * 0.0168980;
            
            const pink = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
            b6 = white * 0.115926;
            
            data[i] = pink * 0.11;
        }
        
        return buffer;
    }
    
    // ========== VISUALIZAÇÃO DE ÁUDIO ==========
    
    getAudioData() {
        if (!this.analyser) return null;
        
        this.analyser.getByteFrequencyData(this.dataArray);
        return Array.from(this.dataArray);
    }
    
    getWaveformData() {
        if (!this.analyser) return null;
        
        const waveformArray = new Uint8Array(this.bufferLength);
        this.analyser.getByteTimeDomainData(waveformArray);
        return Array.from(waveformArray);
    }
    
    // ========== SISTEMA DE FALLBACK ==========
    
    createFallbackSystem() {
        console.log('🔄 CRIANDO SISTEMA DE FALLBACK...');
        
        // Sistema básico sem Web Audio API
        this.fallbackMode = true;
        
        // Usar elementos de áudio HTML5
        this.html5Audios = new Map();
        
        // Sons básicos com data URLs
        const fallbackSounds = {
            click: `data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEAQB8AAEAfAAABAAgAZGF0YQ...`,
            // ... mais sons base64
        };
        
        Object.entries(fallbackSounds).forEach(([key, dataUrl]) => {
            const audio = new Audio();
            audio.src = dataUrl;
            this.html5Audios.set(key, audio);
        });
    }
    
    playFallback(key) {
        if (!this.fallbackMode || !this.html5Audios.has(key)) return;
        
        const audio = this.html5Audios.get(key).cloneNode();
        audio.volume = this.volume;
        audio.play().catch(() => {
            // Silenciar erro se autoplay não permitido
        });
    }
}

// ========== INTEGRAÇÃO COM O SISTEMA NEURAL ==========

// Criar instância global do motor de áudio
window.audioEngine = new AudioEngine();

// Exportar para uso em outros módulos
export { AudioEngine };
