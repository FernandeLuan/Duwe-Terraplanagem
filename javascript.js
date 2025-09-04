let map;
let markers = [];

document.addEventListener("DOMContentLoaded", function () {
    // Animações de entrada
    const sections = document.querySelectorAll("section");
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
            }
        });
    }, { threshold: 0.1 });
    sections.forEach(section => observer.observe(section));

    // Mapa
    map = L.map('map').setView([-26.9185, -49.0653], 10);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    L.marker([-26.9185, -49.0653]).addTo(map)
        .bindPopup('Duwe Terraplanagem - Blumenau')
        .openPopup();

    L.circle([-26.9185, -49.0653], {
        color: '#2E7D32',
        fillColor: '#2E7D32',
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

    // Filtro de cidades no mapa
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

    // Formulário de contato
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

    // Carrossel de depoimentos
    const slider = document.querySelector(".depoimentos-slider");
    const depoimentos = document.querySelectorAll(".depoimento");
    let offset = 0;
    let isPaused = false;
    const slideWidth = 320; // 300px (largura do depoimento) + 20px (gap)
    const totalSlides = depoimentos.length;
    const maxOffset = -slideWidth * totalSlides;

    // Duplicar depoimentos para loop infinito
    depoimentos.forEach(depoimento => {
        const clone = depoimento.cloneNode(true);
        slider.appendChild(clone);
    });

    function updateSlider() {
        slider.style.transform = `translateX(${offset}px)`;
    }

    function animateSlider() {
        if (!isPaused) {
            offset -= 1; // Velocidade do deslizamento automático
            if (offset <= maxOffset) {
                offset = 0; // Resetar para o início
                slider.style.transition = "none";
                updateSlider();
                setTimeout(() => {
                    slider.style.transition = "transform 0.5s ease";
                }, 0);
            } else {
                slider.style.transition = "transform 0.5s ease";
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
        slider.style.transition = "transform 0.5s ease";
        updateSlider();
        setTimeout(() => isPaused = false, 2000);
    };

    window.prevDepoimento = function () {
        isPaused = true;
        offset += slideWidth;
        if (offset > 0) offset = maxOffset;
        slider.style.transition = "transform 0.5s ease";
        updateSlider();
        setTimeout(() => isPaused = false, 2000);
    };

    slider.addEventListener("transitionend", () => {
        if (offset <= maxOffset) {
            offset = 0;
            slider.style.transition = "none";
            updateSlider();
            setTimeout(() => slider.style.transition = "transform 0.5s ease", 0);
        } else if (offset > 0) {
            offset = maxOffset;
            slider.style.transition = "none";
            updateSlider();
            setTimeout(() => slider.style.transition = "transform 0.5s ease", 0);
        }
    });

    requestAnimationFrame(animateSlider);

    // Botão Voltar ao Topo
    const backToTop = document.getElementById("back-to-top");
    window.addEventListener("scroll", () => {
        if (window.scrollY > 300) backToTop.style.display = "block";
        else backToTop.style.display = "none";
    });
    backToTop.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });

    // Accordion FAQ
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
    const caption = document.getElementById("lightbox-caption");
    lightboxImg.src = src;
    caption.innerText = lightboxImg.alt;
    lightbox.style.display = "flex";

    let scale = 1;
    lightboxImg.addEventListener("wheel", (e) => {
        e.preventDefault();
        scale += e.deltaY * -0.001;
        scale = Math.min(Math.max(1, scale), 3);
        lightboxImg.style.transform = `scale(${scale})`;
    });
}

function closeLightbox() {
    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightbox-img");
    lightbox.style.display = "none";
    lightboxImg.style.transform = "scale(1)";
}