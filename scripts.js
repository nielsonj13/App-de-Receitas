document.addEventListener('DOMContentLoaded', () => {
    const botaoEnviar = document.getElementById('enviar-receita');

    botaoEnviar.addEventListener('click', () => {
        const titulo = document.getElementById('titulo').value;
        const ingredientes = document.getElementById('ingredientes').value;
        const instrucoes = document.getElementById('instrucoes').value;
        const categoria = document.getElementById('categoria').value;
        const autor = document.getElementById('autor').value;

        if (titulo && ingredientes && instrucoes && categoria && autor) {
            const receita = { titulo, ingredientes, instrucoes, categoria, autor };
            adicionarReceita(receita);
            carregarReceitas();
            limparFormulario();
        } else {
            alert('Por favor, preencha todos os campos.');
        }
    });

    function adicionarReceita(receita) {
        let receitas = obterReceitas();
        receitas.push(receita);
        localStorage.setItem('receitas', JSON.stringify(receitas));
    }

    function obterReceitas() {
        return localStorage.getItem('receitas') ? JSON.parse(localStorage.getItem('receitas')) : [];
    }

    function carregarReceitas() {
        const receitas = obterReceitas();
        const containerReceitas = document.getElementById('receitas');
        containerReceitas.innerHTML = '';
        receitas.forEach((receita, indice) => {
            const divReceita = document.createElement('div');
            divReceita.classList.add('receita');
            divReceita.innerHTML = `
                <h2>${receita.titulo}</h2>
                <p><strong>Ingredientes:</strong> ${receita.ingredientes}</p>
                <p><strong>Instruções:</strong> ${receita.instrucoes}</p>
                <p><strong>Categoria:</strong> ${receita.categoria}</p>
                <p><strong>Autor:</strong> ${receita.autor}</p>
                <button class="excluir-receita" data-indice="${indice}">Excluir Receita</button>
            `;
            containerReceitas.appendChild(divReceita);
        });

        const botoesExcluir = document.querySelectorAll('.excluir-receita');
        botoesExcluir.forEach(botao => {
            botao.addEventListener('click', (evento) => {
                const indice = evento.target.getAttribute('data-indice');
                excluirReceita(indice);
                carregarReceitas();
            });
        });
    }

    function excluirReceita(indice) {
        let receitas = obterReceitas();
        receitas.splice(indice, 1);
        localStorage.setItem('receitas', JSON.stringify(receitas));
    }

    function limparFormulario() {
        document.getElementById('titulo').value = '';
        document.getElementById('ingredientes').value = '';
        document.getElementById('instrucoes').value = '';
        document.getElementById('categoria').value = '';
        document.getElementById('autor').value = '';
    }

    carregarReceitas();
});
