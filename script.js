// --- LÓGICA DO TERMÔMETRO ---
function medirTemperatura() {
    const container = document.getElementById('resultado-container');
    const resultado = document.getElementById('resultado-temperatura');
    const btn = document.getElementById('btn-medir');
    
    // Configura o estado de carregamento
    container.classList.remove('oculto', 'normal', 'febre');
    container.classList.add('loading');
    resultado.innerHTML = "⏳ Conectando ao RTS...";
    btn.disabled = true;
    btn.style.opacity = "0.7";

    // Simula atraso de rede
    setTimeout(() => {
        const temp = (Math.random() * (38.5 - 36.0) + 36.0).toFixed(1);
        
        container.classList.remove('loading');
        
        if (temp >= 37.5) {
            resultado.innerHTML = `🌡️ ${temp}°C - Estado febril detectado!`;
            container.classList.add('febre');
        } else {
            resultado.innerHTML = `✅ ${temp}°C - Temperatura normal.`;
            container.classList.add('normal');
        }
        
        btn.disabled = false;
        btn.style.opacity = "1";
    }, 1500);
}

// --- INTEGRAÇÃO COM API DE CEP (ViaCEP) ---
document.getElementById('cep').addEventListener('blur', async function() {
    const cep = this.value.replace(/\D/g, ''); // Remove tudo que não for número

    if (cep.length === 8) {
        document.getElementById('rua').value = 'Buscando...';
        
        try {
            const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
            const data = await response.json();

            if (!data.erro) {
                document.getElementById('rua').value = data.logradouro;
                document.getElementById('bairro').value = data.bairro;
                document.getElementById('cidade').value = data.localidade;
                document.getElementById('estado').value = data.uf;
            } else {
                alert("CEP não encontrado!");
                limparCamposEndereco();
            }
        } catch (error) {
            alert("Erro ao buscar o CEP. Verifique sua conexão.");
            limparCamposEndereco();
        }
    } else if (cep.length > 0) {
        alert("CEP inválido. O CEP deve ter 8 dígitos.");
        limparCamposEndereco();
    }
});

function limparCamposEndereco() {
    document.getElementById('rua').value = '';
    document.getElementById('bairro').value = '';
    document.getElementById('cidade').value = '';
    document.getElementById('estado').value = '';
}

// --- LÓGICA DE VALIDAÇÃO DO FORMULÁRIO ---
document.getElementById('form-contato').addEventListener('submit', function(event) {
    event.preventDefault();

    const nome = document.getElementById('nome').value.trim();
    
    // Como os campos já têm o atributo 'required' no HTML, 
    // só precisamos dar a mensagem de sucesso se o formulário for disparado.
    exibirMensagemForm(`🎉 Obrigado pelo contato, ${nome.split(' ')[0]}! Mensagem enviada com sucesso.`, "sucesso-msg");
    
    // Limpa o formulário
    this.reset();
});

// Função auxiliar para exibir as mensagens na tela
function exibirMensagemForm(texto, classe) {
    const divMensagem = document.getElementById('mensagem-form');
    divMensagem.innerHTML = texto;
    divMensagem.className = "";
    divMensagem.classList.add(classe);
    
    setTimeout(() => {
        divMensagem.classList.add('oculto');
    }, 4000);
}