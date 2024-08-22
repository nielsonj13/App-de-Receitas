document.addEventListener('DOMContentLoaded', () => {
    const botaoEnviar = document.getElementById('enviar-receita');
    const botaoAtualizar = document.getElementById('atualizar-receita');
    const campoPesquisa = document.getElementById('pesquisar');
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

    campoPesquisa.addEventListener('input', () => {
        carregarReceitas();
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
        const termoPesquisa = campoPesquisa.value.trim().toLowerCase();
        const containerReceitas = document.getElementById('receitas');
        containerReceitas.innerHTML = '';
        const receitasFiltradas = receitas.filter(receita =>
            receita.titulo.toLowerCase().includes(termoPesquisa) ||
            receita.ingredientes.toLowerCase().includes(termoPesquisa) ||
            receita.instrucoes.toLowerCase().includes(termoPesquisa) ||
            receita.categoria.toLowerCase().includes(termoPesquisa) ||
            receita.autor.toLowerCase().includes(termoPesquisa)
        );
        receitasFiltradas.forEach((receita, indice) => {
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


// Inicializando o Supabase
const SUPABASE_URL = 'https://xyzcompany.supabase.co'; // substitua pelo URL do seu projeto
const SUPABASE_KEY = 'public-anon-key'; // substitua pela sua chave de API
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

async function carregarReceitas() {
    const { data: receitas, error } = await supabase
        .from('receitas')
        .select('*');

    if (error) {
        console.error('Erro ao carregar receitas:', error);
        return;
    }

    const termoPesquisa = document.getElementById('pesquisar').value.trim().toLowerCase();
    const containerReceitas = document.getElementById('receitas');
    containerReceitas.innerHTML = '';

    receitas
        .filter(receita =>
            receita.titulo.toLowerCase().includes(termoPesquisa) ||
            receita.ingredientes.toLowerCase().includes(termoPesquisa) ||
            receita.instrucoes.toLowerCase().includes(termoPesquisa) ||
            receita.categoria.toLowerCase().includes(termoPesquisa) ||
            receita.autor.toLowerCase().includes(termoPesquisa)
        )
        .forEach((receita) => {
            const divReceita = document.createElement('div');
            divReceita.classList.add('receita');
            divReceita.innerHTML = `
                <h2>${receita.titulo}</h2>
                <p><strong>Ingredientes:</strong> ${receita.ingredientes}</p>
                <p><strong>Instruções:</strong> ${receita.instrucoes}</p>
                <p><strong>Categoria:</strong> ${receita.categoria}</p>
                <p><strong>Autor:</strong> ${receita.autor}</p>
            `;
            containerReceitas.appendChild(divReceita);
        });
}

async function adicionarReceita(receita) {
    const { data, error } = await supabase
        .from('receitas')
        .insert([
            receita,
        ]);

    if (error) {
        console.error('Erro ao adicionar receita:', error);
    } else {
        console.log('Receita adicionada com sucesso:', data);
        carregarReceitas();
    }
}

document.getElementById('enviar-receita').addEventListener('click', () => {
    const titulo = document.getElementById('titulo').value.trim();
    const ingredientes = document.getElementById('ingredientes').value.trim();
    const instrucoes = document.getElementById('instrucoes').value.trim();
    const categoria = document.getElementById('categoria').value.trim();
    const autor = document.getElementById('autor').value.trim();

    if (titulo && ingredientes && instrucoes && categoria && autor) {
        const receita = {
            titulo,
            ingredientes,
            instrucoes,
            categoria,
            autor,
            criado_em: new Date().toISOString()
        };
        adicionarReceita(receita);
        limparFormulario();
    } else {
        alert('Por favor, preencha todos os campos corretamente.');
    }
});

function limparFormulario() {
    document.getElementById('titulo').value = '';
    document.getElementById('ingredientes').value = '';
    document.getElementById('instrucoes').value = '';
    document.getElementById('categoria').value = '';
    document.getElementById('autor').value = '';
}

// Carregar receitas ao iniciar
carregarReceitas();

