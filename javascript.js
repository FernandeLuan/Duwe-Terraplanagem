let map;

document.addEventListener("DOMContentLoaded", function () {
    map = L.map('map').setView([-26.9185, -49.0653], 10);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    L.marker([-26.9185, -49.0653]).addTo(map)
        .bindPopup('Duwe Terraplanagem - Blumenau')
        .openPopup();

    L.circle([-26.9185, -49.0653], {
        color: '#25d366',
        fillColor: '#25d366',
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
        L.marker(cidade.coords).addTo(map)
            .bindPopup(`Atendemos em ${cidade.nome}`);
    });

    const form = document.querySelector("form");
    const mensagemEnviada = document.querySelector(".mensagem-enviada");

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
                mensagemEnviada.style.color = "#2ecc71";
                form.reset();
            } else {
                mensagemEnviada.innerText = "Ocorreu um erro ao enviar a mensagem. Tente novamente.";
                mensagemEnviada.style.color = "#e74c3c";
            }
        })
        .catch(() => {
            mensagemEnviada.innerText = "Ocorreu um erro ao enviar a mensagem. Tente novamente.";
            mensagemEnviada.style.color = "#e74c3c";
        });
    });

    const contatoForm = document.querySelector("#contato form");
    const contatoMensagem = document.querySelector("#contato .mensagem-enviada");

    contatoForm.addEventListener("submit", function (event) {
        event.preventDefault();

        setTimeout(() => {
            contatoMensagem.innerText = "Mensagem enviada com sucesso!";
            contatoMensagem.classList.add("mostrar");

            contatoForm.reset();

            setTimeout(() => {
                contatoMensagem.classList.remove("mostrar");
            }, 3000);
        }, 1000);
    });
});
document.addEventListener("DOMContentLoaded", function () {
    const depoimentos = document.querySelectorAll(".depoimento");
    let index = 0;

    setInterval(() => {
        depoimentos[index].classList.remove("ativo");
        index = (index + 1) % depoimentos.length;
        depoimentos[index].classList.add("ativo");
    }, 4000);
});

function calcularOrcamento() {
    const area = parseFloat(document.getElementById("area").value);
    const tipoServico = document.getElementById("tipo-servico").value;

    const precos = {
        terraplanagem: 15,
        escavacao: 20,
        compactacao: 18
    };

    if (area > 0 && precos[tipoServico]) {
        const custoTotal = area * precos[tipoServico];
        document.getElementById("resultado").innerText =
            `Serviço: ${tipoServico.charAt(0).toUpperCase() + tipoServico.slice(1)}\nÁrea: ${area} m²\nOrçamento estimado: R$ ${custoTotal.toFixed(2)}`;
    } else {
        document.getElementById("resultado").innerText = "Por favor, insira uma área válida e selecione um serviço.";
    }
}
