document.addEventListener("DOMContentLoaded", function() {
    
    console.log("Script cargado correctamente");
    
    // ===============================
    // BOTÓN DE BIENVENIDA
    // ===============================
    const botonBienvenida = document.getElementById("btn-bienvenida");
    if (botonBienvenida) {
        botonBienvenida.addEventListener("click", function() {
            alert("¡Paz y bien! Gracias por visitar este sitio de Apologética. Espero que los recursos te ayuden a fortalecer tu fe.");
        });
    }

    // ===============================
    // SMOOTH SCROLLING
    // ===============================
    const allLinks = document.querySelectorAll('a[href^="#"]');
    allLinks.forEach(function(enlace) {
        enlace.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href && href.length > 1 && href !== '#') {
                e.preventDefault();
                const destino = document.querySelector(href);
                if (destino) {
                    destino.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // ===============================
    // RESALTAR TEMA ACTIVO
    // ===============================
    function updateActiveLink() {
        const sections = document.querySelectorAll('article.contenido-tema[id]');
        const allTemarioLinks = document.querySelectorAll('.temario a[href]');
        
        let currentSection = null;
        const scrollPos = window.scrollY + 150;

        sections.forEach(function(section) {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.id;

            if (scrollPos >= top && scrollPos < top + height) {
                currentSection = id;
            }
        });

        allTemarioLinks.forEach(function(link) {
            if (link.parentElement) {
                link.parentElement.classList.remove('activo');
            }
        });

        if (currentSection) {
            allTemarioLinks.forEach(function(link) {
                if (link.getAttribute('href') === '#' + currentSection && link.parentElement) {
                    link.parentElement.classList.add('activo');
                }
            });
        }
    }

    let scrollTimeout;
    window.addEventListener('scroll', function() {
        if (!scrollTimeout) {
            scrollTimeout = setTimeout(function() {
                updateActiveLink();
                scrollTimeout = null;
            }, 100);
        }
    });

    updateActiveLink();

    // ===============================
    // MODO OSCURO / CLARO
    // ===============================
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    
    console.log("Theme toggle encontrado:", !!themeToggle);
    
    // Efectos hover
    function addHoverEffect(btn) {
        if (btn) {
            btn.style.transition = 'transform 0.3s';
            btn.addEventListener('mouseenter', function() {
                btn.style.transform = 'scale(1.15)';
            });
            btn.addEventListener('mouseleave', function() {
                btn.style.transform = 'scale(1)';
            });
        }
    }
    
    addHoverEffect(themeToggle);
    
    // Cargar preferencia guardada
    const savedTheme = localStorage.getItem('theme');
    console.log("Tema guardado:", savedTheme);
    
    if (savedTheme === 'dark') {
        body.classList.add('dark-mode');
        if (themeToggle) themeToggle.textContent = '☀️';
    }
    
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            console.log("Click en modo oscuro");
            body.classList.toggle('dark-mode');
            
            if (body.classList.contains('dark-mode')) {
                themeToggle.textContent = '☀️';
                localStorage.setItem('theme', 'dark');
            } else {
                themeToggle.textContent = '🌙';
                localStorage.setItem('theme', 'light');
            }
        });
    }

    // ===============================
    // BOTÓN SUBIR ARRIBA
    // ===============================
    const scrollTopBtn = document.getElementById('scroll-top');
    
    console.log("Scroll top encontrado:", !!scrollTopBtn);
    
    addHoverEffect(scrollTopBtn);
    
    if (scrollTopBtn) {
        // Iniciar oculto
        scrollTopBtn.style.opacity = '0';
        scrollTopBtn.style.pointerEvents = 'none';
        
        // Mostrar/ocultar según scroll
        window.addEventListener('scroll', function() {
            if (window.scrollY > 300) {
                scrollTopBtn.style.opacity = '0.7';
                scrollTopBtn.style.pointerEvents = 'auto';
            } else {
                scrollTopBtn.style.opacity = '0';
                scrollTopBtn.style.pointerEvents = 'none';
            }
        });
        
        // Scroll al inicio
        scrollTopBtn.addEventListener('click', function() {
            console.log("Click en subir");
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // ===============================
    // REPRODUCIR AUDIO (TEXT-TO-SPEECH)
    // ===============================
    const audioToggle = document.getElementById('audio-toggle');
    let isPlaying = false;
    let currentUtterance = null;
    
    console.log("Audio toggle encontrado:", !!audioToggle);
    
    addHoverEffect(audioToggle);
    
    function getTextToRead() {
        // Obtener el contenido del tema visible actual
        const sections = document.querySelectorAll('article.contenido-tema[id]');
        let fullText = '';
        
        sections.forEach(function(article) {
            const rect = article.getBoundingClientRect();
            // Si el artículo está visible en pantalla
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                const title = article.querySelector('.tema-header h2');
                const content = article.querySelector('.contenido-tema');
                
                if (title) {
                    fullText += title.textContent + '. ';
                }
                
                if (content) {
                    const paragraphs = content.querySelectorAll('p, h3, h4, li, span');
                    paragraphs.forEach(function(p) {
                        fullText += p.textContent + '. ';
                    });
                }
            }
        });
        
        return fullText;
    }

    function stopSpeech() {
        if (window.speechSynthesis) {
            window.speechSynthesis.cancel();
        }
        isPlaying = false;
        audioToggle.style.background = 'linear-gradient(135deg, #6b0000, #8b0000)';
        audioToggle.textContent = '🔊';
    }
    
    if (audioToggle) {
        audioToggle.addEventListener('click', function() {
            console.log("Click en audio, isPlaying:", isPlaying);
            
            if (isPlaying) {
                stopSpeech();
                return;
            }
            
            // Obtener texto
            currentText = getTextToRead();
            console.log("Texto a leer:", currentText.substring(0, 100) + "...");
            
            if (!currentText || !currentText.trim()) {
                alert('No hay contenido para leer. Desplázate a un tema y prueba de nuevo.');
                return;
            }
            
            // Crear utterance
            currentUtterance = new SpeechSynthesisUtterance(currentText);
            currentUtterance.lang = 'es-ES';
            currentUtterance.rate = 0.9;
            currentUtterance.pitch = 1;
            currentUtterance.volume = 1;
            
            // Buscar voces en español
            const loadVoices = function() {
                const voices = window.speechSynthesis.getVoices();
                const spanishVoice = voices.find(function(voice) {
                    return voice.lang.includes('es');
                });
                if (spanishVoice) {
                    currentUtterance.voice = spanishVoice;
                }
            };
            
            // Cargar voces (algunas necesitan tiempo)
            if (window.speechSynthesis.getVoices().length > 0) {
                loadVoices();
            } else {
                window.speechSynthesis.addEventListener('voiceschanged', loadVoices);
            }
            
            currentUtterance.onstart = function() {
                console.log("Inicio de lectura");
                isPlaying = true;
                audioToggle.style.background = 'linear-gradient(135deg, #25D366, #20bf6b)';
                audioToggle.textContent = '⏸️';
            };
            
            currentUtterance.onend = function() {
                console.log("Fin de lectura");
                isPlaying = false;
                audioToggle.style.background = 'linear-gradient(135deg, #6b0000, #8b0000)';
                audioToggle.textContent = '🔊';
            };
            
            currentUtterance.onerror = function(event) {
                console.error("Error en speech:", event);
                isPlaying = false;
                audioToggle.style.background = 'linear-gradient(135deg, #6b0000, #8b0000)';
                audioToggle.textContent = '🔊';
            };
            
            window.speechSynthesis.speak(currentUtterance);
        });
    }

    // Detener audio al salir
    window.addEventListener('beforeunload', function() {
        if (isPlaying && window.speechSynthesis) {
            window.speechSynthesis.cancel();
        }
    });
    
    console.log("Todas las funciones inicializadas");
});