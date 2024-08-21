document.addEventListener('DOMContentLoaded', () => {
    const botaoEnviar = document.getElementById('enviar-receita');
    const botaoAtualizar = document.getElementById('atualizar-receita');
    let indiceEdicao = null;

    botaoEnviar.addEventListener('click', () => {
        const titulo = document.getElementById('titulo').value.trim();
        const ingredientes = document.getElementById('ingredientes').value.trim();
        const instrucoes = document.getElementById('instrucoes').value.trim();
        const categoria = document.getElementById('categoria').value.trim();
        const autor = document.getElementById('autor').value.trim();

        if (titulo && ingredientes && instrucoes && categoria && autor) {
            const receita = { titulo, ingredientes, instrucoes, categoria, autor };
            adicionarReceita(receita);
            carregarReceitas();
            limparFormulario();
        } else {
            alert('Por favor, preencha todos os campos corretamente.');
        }
    });

    botaoAtualizar.addEventListener('click', () => {
        const titulo = document.getElementById('titulo').value.trim();
        const ingredientes = document.getElementById('ingredientes').value.trim();
        const instrucoes = document.getElementById('instrucoes').value.trim();
        const categoria = document.getElementById('categoria').value.trim();
        const autor = document.getElementById('autor').value.trim();

        if (titulo && ingredientes && instrucoes && categoria && autor) {
            const receita = { titulo, ingredientes, instrucoes, categoria, autor };
            atualizarReceita(indiceEdicao, receita);
            carregarReceitas();
            limparFormulario();
            indiceEdicao = null;
            botaoEnviar.style.display = 'block';
            botaoAtualizar.style.display = 'none';
        } else {
            alert('Por favor, preencha todos os campos corretamente.');
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
                <button class="editar-receita" data-indice="${indice}">Editar Receita</button>
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

        const botoesEditar = document.querySelectorAll('.editar-receita');
        botoesEditar.forEach(botao => {
            botao.addEventListener('click', (evento) => {
                const indice = evento.target.getAttribute('data-indice');
                editarReceita(indice);
            });
        });
    }

    function excluirReceita(indice) {
        let receitas = obterReceitas();
        receitas.splice(indice, 1);
        localStorage.setItem('receitas', JSON.stringify(receitas));
    }

    function editarReceita(indice) {
        let receitas = obterReceitas();
        const receita = receitas[indice];

        document.getElementById('titulo').value = receita.titulo;
        document.getElementById('ingredientes').value = receita.ingredientes;
        document.getElementById('instrucoes').value = receita.instrucoes;
        document.getElementById('categoria').value = receita.categoria;
        document.getElementById('autor').value = receita.autor;

        indiceEdicao = indice;

        botaoEnviar.style.display = 'none';
        botaoAtualizar.style.display = 'block';
    }

    function atualizarReceita(indice, receitaAtualizada) {
        let receitas = obterReceitas();
        receitas[indice] = receitaAtualizada;
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