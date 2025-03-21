function calcularOrcamento() {
    let area = document.getElementById("area").value;
    let precoPorMetro = 15; 
    
    if (area > 0) {
        let custoTotal = area * precoPorMetro;
        document.getElementById("resultado").innerText = `O orçamento estimado é de R$ ${custoTotal.toFixed(2)}`;
    } else {
        document.getElementById("resultado").innerText = "Por favor, insira um valor válido para a área.";
    }
}
document.addEventListener("DOMContentLoaded", function () {
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
});
document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector("#contato form");
    const mensagemEnviada = document.querySelector("#contato .mensagem-enviada");

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        setTimeout(() => {
            mensagemEnviada.innerText = "Mensagem enviada com sucesso!";
            mensagemEnviada.classList.add("mostrar");

            form.reset();

            setTimeout(() => {
                mensagemEnviada.classList.remove("mostrar");
            }, 3000);
        }, 1000);
    });
});