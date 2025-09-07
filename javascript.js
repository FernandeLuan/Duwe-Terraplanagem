let map;
let markers = [];
let galleryOffset = 0;
let gallerySlides = [];
let isGalleryPaused = false;

document.addEventListener("DOMContentLoaded", function () {
    const sections = document.querySelectorAll("section");
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
            }
        });
    }, { threshold: 0.1 });
    sections.forEach(section => observer.observe(section));

    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('nav');
    menuToggle.addEventListener('click', () => {
        nav.classList.toggle('active');
        menuToggle.classList.toggle('active');
    });

    nav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 820) {
                nav.classList.remove('active');
                menuToggle.classList.remove('active');
            }
            const targetId = link.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        });
    });

    const logo = document.querySelector('.logo h1');
    logo.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    map = L.map('map').setView([-26.9185, -49.0653], 10);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    L.marker([-26.9185, -49.0653]).addTo(map)
        .bindPopup('Duwe Terraplanagem - Blumenau')
        .openPopup();

    L.circle([-26.9185, -49.0653], {
        color: '#1E3A8A',
        fillColor: '#1E3A8A',
        fillOpacity: 0.2,
        radius: 50000
    }).addTo(map).bindPopup("Cobertura de até 50 km");

    const cidadesCobertura = [
        { nome: "Gaspar", coords: [-26.9333, -48.9583] },
        { nome: "Indaial", coords: [-26.8978, -49.2439] },
        { nome: "Pomerode", coords: [-26.7383, -49.1767] },
        { nome: "Timbó", coords: [-26.8231, -49.2719] },
        { nome: "Brusque", coords: [-27.0977, -48.9106] },
        { nome: "Itajaí", coords: [-26.9101, -48.6705] },
        { nome: "Navegantes", coords: [-26.8946, -48.6546] },
        { nome: "Balneário Camboriú", coords: [-26.9927, -48.6352] },
        { nome: "Penha", coords: [-26.7754, -48.6469] },
        { nome: "São João Batista", coords: [-27.2777, -48.8472] },
        { nome: "Ibirama", coords: [-27.0544, -49.5194] },
        { nome: "Jaraguá do Sul", coords: [-26.4822, -49.0725] },
        { nome: "Itapema", coords: [-27.0861, -48.6167] },
        { nome: "Barra Velha", coords: [-26.6372, -48.6847] },
        { nome: "Guaramirim", coords: [-26.4689, -49.0028] }
    ];

    cidadesCobertura.forEach(cidade => {
        const marker = L.marker(cidade.coords).addTo(map)
            .bindPopup(`Atendemos em ${cidade.nome}`);
        markers.push(marker);
    });

    document.getElementById("cidade-filtro").addEventListener("change", function () {
        const filtro = this.value;
        markers.forEach(marker => {
            if (filtro === "all" || marker.getPopup().getContent().includes(filtro)) {
                marker.addTo(map);
            } else {
                map.removeLayer(marker);
            }
        });
    });

    const form = document.querySelector("#contato form");
    const mensagemEnviada = document.querySelector("#contato .mensagem-enviada");

    form.addEventListener("submit", function (event) {
        event.preventDefault();
        fetch(form.action, {
            method: "POST",
            body: new FormData(form),
            headers: {
                "Accept": "application/json"
            }
        })
        .then(response => {
            if (response.ok) {
                mensagemEnviada.innerText = "Mensagem enviada com sucesso!";
                mensagemEnviada.style.opacity = "1";
                form.reset();
                setTimeout(() => {
                    mensagemEnviada.style.opacity = "0";
                }, 3000);
            } else {
                mensagemEnviada.innerText = "Erro ao enviar a mensagem. Tente novamente.";
                mensagemEnviada.style.opacity = "1";
                setTimeout(() => {
                    mensagemEnviada.style.opacity = "0";
                }, 3000);
            }
        })
        .catch(() => {
            mensagemEnviada.innerText = "Erro ao enviar a mensagem. Tente novamente.";
            mensagemEnviada.style.opacity = "1";
            setTimeout(() => {
                mensagemEnviada.style.opacity = "0";
            }, 3000);
        });
    });

    const slider = document.querySelector(".depoimentos-slider");
    const depoimentos = document.querySelectorAll(".depoimento");
    let offset = 0;
    let isPaused = false;
    const slideWidth = 320;
    const totalSlides = depoimentos.length;
    const maxOffset = -slideWidth * (totalSlides - 1);

    depoimentos.forEach(depoimento => {
        const clone = depoimento.cloneNode(true);
        slider.appendChild(clone);
    });

    function updateSlider() {
        slider.style.transform = `translateX(${offset}px)`;
    }

    function animateSlider() {
        if (!isPaused) {
            offset -= 0.5;
            if (offset <= maxOffset) {
                offset = 0;
                slider.style.transition = "none";
                updateSlider();
                setTimeout(() => {
                    slider.style.transition = "transform 1.5s ease";
                }, 0);
            } else {
                slider.style.transition = "transform 1.5s ease";
                updateSlider();
            }
        }
        requestAnimationFrame(animateSlider);
    }

    slider.addEventListener("mouseenter", () => isPaused = true);
    slider.addEventListener("mouseleave", () => isPaused = false);

    window.nextDepoimento = function () {
        isPaused = true;
        offset -= slideWidth;
        if (offset < maxOffset) offset = 0;
        slider.style.transition = "transform 1.5s ease";
        updateSlider();
        setTimeout(() => isPaused = false, 2000);
    };

    window.prevDepoimento = function () {
        isPaused = true;
        offset += slideWidth;
        if (offset > 0) offset = maxOffset;
        slider.style.transition = "transform 1.5s ease";
        updateSlider();
        setTimeout(() => isPaused = false, 2000);
    };

    slider.addEventListener("transitionend", () => {
        if (offset <= maxOffset) {
            offset = 0;
            slider.style.transition = "none";
            updateSlider();
            setTimeout(() => slider.style.transition = "transform 1.5s ease", 0);
        } else if (offset > 0) {
            offset = maxOffset;
            slider.style.transition = "none";
            updateSlider();
            setTimeout(() => slider.style.transition = "transform 1.5s ease", 0);
        }
    });

    requestAnimationFrame(animateSlider);

    const faqQuestions = document.querySelectorAll(".faq-question");
    faqQuestions.forEach(question => {
        question.addEventListener("click", () => {
            const answer = question.nextElementSibling;
            const isOpen = answer.style.display === "block";
            faqQuestions.forEach(q => q.nextElementSibling.style.display = "none");
            if (!isOpen) {
                answer.style.display = "block";
            }
        });
    });

    document.querySelectorAll('.collapsible-section .collapsible-title').forEach(title => {
        title.addEventListener('click', () => {
            const section = title.closest('.collapsible-section');
            const content = title.nextElementSibling;
            const icon = title.querySelector('.toggle-icon');
            section.classList.toggle('collapsed');
            content.classList.toggle('collapsed');
            icon.style.transform = section.classList.contains('collapsed') ? 'rotate(180deg)' : 'rotate(0deg)';
        });
    });

    const carouselSlides = document.querySelectorAll('.carousel-slide');
    gallerySlides = Array.from(carouselSlides);
    const gallerySlideWidth = carouselSlides[0].offsetWidth;
    const totalGallerySlides = gallerySlides.length;
    const gallerySlidesContainer = document.querySelector('.carousel-slides');

    gallerySlides.forEach(slide => {
        const clone = slide.cloneNode(true);
        gallerySlidesContainer.appendChild(clone);
    });

    function updateGallery() {
        gallerySlidesContainer.style.transform = `translateX(${galleryOffset}px)`;
    }

    function animateGallery() {
        if (!isGalleryPaused) {
            galleryOffset -= 1;
            if (galleryOffset <= -gallerySlideWidth * (totalGallerySlides - 1)) {
                galleryOffset = 0;
                gallerySlidesContainer.style.transition = "none";
                updateGallery();
                setTimeout(() => {
                    gallerySlidesContainer.style.transition = "transform 0.5s ease";
                }, 0);
            } else {
                gallerySlidesContainer.style.transition = "transform 0.5s ease";
                updateGallery();
            }
        }
        requestAnimationFrame(animateGallery);
    }

    gallerySlidesContainer.addEventListener("mouseenter", () => isGalleryPaused = true);
    gallerySlidesContainer.addEventListener("mouseleave", () => isGalleryPaused = false);
    document.querySelector('.carousel-prev').addEventListener("click", () => isGalleryPaused = true);
    document.querySelector('.carousel-next').addEventListener("click", () => isGalleryPaused = true);

    window.nextGallerySlide = function () {
        isGalleryPaused = true;
        galleryOffset -= gallerySlideWidth;
        if (galleryOffset <= -gallerySlideWidth * totalGallerySlides) {
            galleryOffset = 0;
            gallerySlidesContainer.style.transition = "none";
            updateGallery();
            setTimeout(() => {
                gallerySlidesContainer.style.transition = "transform 0.5s ease";
            }, 0);
        }
        gallerySlidesContainer.style.transform = `translateX(${galleryOffset}px)`;
        setTimeout(() => isGalleryPaused = false, 2000);
    };

    window.prevGallerySlide = function () {
        isGalleryPaused = true;
        galleryOffset += gallerySlideWidth;
        if (galleryOffset >= 0) {
            galleryOffset = -gallerySlideWidth * (totalGallerySlides - 1);
            gallerySlidesContainer.style.transition = "none";
            updateGallery();
            setTimeout(() => {
                gallerySlidesContainer.style.transition = "transform 0.5s ease";
            }, 0);
        }
        gallerySlidesContainer.style.transform = `translateX(${galleryOffset}px)`;
        setTimeout(() => isGalleryPaused = false, 2000);
    };

    window.addEventListener('resize', () => {
        const newSlideWidth = carouselSlides[0].offsetWidth;
        const scale = newSlideWidth / gallerySlideWidth;
        galleryOffset = galleryOffset * scale;
        gallerySlidesContainer.style.transform = `translateX(${galleryOffset}px)`;
    });

    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightbox-img");
    const lightboxCaption = document.getElementById("lightbox-caption");
    document.querySelectorAll('.carousel-slide img').forEach(img => {
        img.addEventListener('click', () => {
            lightbox.style.display = "flex";
            lightboxImg.src = img.src;
            lightboxCaption.textContent = img.alt;
        });
    });

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    document.querySelector('.close-lightbox').addEventListener('click', closeLightbox);
});

function calcularOrcamento() {
    const area = parseFloat(document.getElementById("area").value);
    const tipoServico = document.getElementById("tipo-servico").value;
    const resultado = document.getElementById("resultado");
    const calcularBtn = document.getElementById("calcular-btn");
    const alerta = document.getElementById("alerta-simulador");

    if (!area || area <= 0) {
        resultado.innerText = "Por favor, insira uma área válida maior que 0.";
        return;
    }

    calcularBtn.disabled = true;
    resultado.innerText = "Calculando...";
    alerta.style.display = "block";
    setTimeout(() => alerta.style.display = "none", 6000);

    const precos = {
        terraplanagem: 15,
        escavacao: 20,
        compactacao: 18
    };

    setTimeout(() => {
        if (precos[tipoServico]) {
            const custoTotal = area * precos[tipoServico];
            resultado.innerText = `Serviço: ${tipoServico.charAt(0).toUpperCase() + tipoServico.slice(1)}\nÁrea: ${area} m²\nOrçamento estimado: R$ ${custoTotal.toFixed(2)}`;
        } else {
            resultado.innerText = "Selecione um serviço válido.";
        }
        calcularBtn.disabled = false;
    }, 1000);
}

function openLightbox(src) {
    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightbox-img");
    lightbox.style.display = "flex";
    lightboxImg.src = src;
}

function closeLightbox() {
    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightbox-img");
    lightbox.style.display = "none";
    lightboxImg.src = "";
    lightboxImg.style.transform = "scale(1)";
}

requestAnimationFrame(animateGallery)