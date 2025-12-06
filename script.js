// Adicionar nova opção ao select do formulário
document.addEventListener('DOMContentLoaded', function() {
    // Configurar o formulário com a nova opção
    const subjectSelect = document.getElementById('subject');
    if (subjectSelect) {
        // A opção já foi adicionada no HTML
        console.log('Formulário atualizado com Direito do Consumidor');
    }
    
    // Efeito de digitação atualizado
    const typingText = document.querySelector('.typing-text');
    if (typingText) {
        const words = ['Justiça', 'Defesa', 'Direitos', 'Resultados', 'Excelência', 'Advocacia'];
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
                    
                    isPaused = true;
                    setTimeout(() => {
                        isPaused = false;
                        typeEffect();
                    }, 1500);
                }
            }
        }
        
        setTimeout(typeEffect, 1000);
    }
    
    // Formulário com validação melhorada
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validação dos campos
            const name = document.getElementById('name').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const email = document.getElementById('email').value.trim();
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value.trim();
            const consent = document.getElementById('consent').checked;
            
            if (!consent) {
                alert('Por favor, aceite os termos de consentimento para prosseguir.');
                return;
            }
            
            // Coletar dados
            const formData = {
                name: name,
                phone: phone,
                email: email,
                subject: subject,
                message: message,
                timestamp: new Date().toISOString()
            };
            
            // Simular envio
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
            submitBtn.disabled = true;
            
            // Simulação de API
            setTimeout(() => {
                console.log('Dados do formulário:', formData);
                
                // Sucesso
                alert(`Obrigado, ${formData.name}! Sua mensagem foi enviada com sucesso. Entraremos em contato em até 24 horas.`);
                
                // Resetar formulário
                contactForm.reset();
                
                // Restaurar botão
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                
                // Rolar para o topo
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }, 1500);
        });
    }
    
    // Newsletter
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const emailInput = this.querySelector('input[type="email"]');
            const button = this.querySelector('button');
            
            if (emailInput.value) {
                const originalText = button.textContent;
                button.textContent = 'Inscrito!';
                button.style.backgroundColor = 'var(--success)';
                
                setTimeout(() => {
                    button.textContent = originalText;
                    button.style.backgroundColor = '';
                    emailInput.value = '';
                }, 2000);
            }
        });
    }
});
