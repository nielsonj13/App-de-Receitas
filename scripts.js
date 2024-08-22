// Inicializando o Supabase
const SUPABASE_URL = 'https://hlnwrzmtwhqyjfekehqz.supabase.co'; // Substitua pelo URL do seu projeto
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhsbndyem10d2hxeWpmZWtlaHF6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjQyNDUwMzQsImV4cCI6MjAzOTgyMTAzNH0.Ek8lmWZNFQ-4aKb2Y_d_BI83fDRdJsDngTcNGRmDous'; // Substitua pela sua chave de API
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

document.addEventListener('DOMContentLoaded', () => {
    carregarReceitas();

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

    document.getElementById('pesquisar').addEventListener('input', carregarReceitas);
});

async function carregarReceitas() {
    const termoPesquisa = document.getElementById('pesquisar').value.trim().toLowerCase();

    const { data: receitas, error } = await supabase
        .from('receitas')
        .select('*');

    if (error) {
        console.error('Erro ao carregar receitas:', error);
        return;
    }

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
        .forEach((receita, indice) => {
            const divReceita = document.createElement('div');
            divReceita.classList.add('receita');
            divReceita.innerHTML = `
                <h2>${receita.titulo}</h2>
                <p><strong>Ingredientes:</strong> ${receita.ingredientes}</p>
                <p><strong>Instruções:</strong> ${receita.instrucoes}</p>
                <p><strong>Categoria:</strong> ${receita.categoria}</p>
                <p><strong>Autor:</strong> ${receita.autor}</p>
                <button onclick="editarReceita(${indice}, '${receita.id}')">Editar</button>
                <button onclick="deletarReceita('${receita.id}')">Excluir</button>
            `;
            containerReceitas.appendChild(divReceita);
        });
}

async function adicionarReceita(receita) {
    const { data, error } = await supabase
        .from('receitas')
        .insert([receita]);

    if (error) {
        console.error('Erro ao adicionar receita:', error);
    } else {
        console.log('Receita adicionada com sucesso:', data);
        carregarReceitas();
    }
}

async function editarReceita(indice, id) {
    const receitas = await obterReceitas();
    const receita = receitas[indice];

    document.getElementById('titulo').value = receita.titulo;
    document.getElementById('ingredientes').value = receita.ingredientes;
    document.getElementById('instrucoes').value = receita.instrucoes;
    document.getElementById('categoria').value = receita.categoria;
    document.getElementById('autor').value = receita.autor;

    const botaoEnviar = document.getElementById('enviar-receita');
    botaoEnviar.style.display = 'none';

    const botaoAtualizar = document.getElementById('atualizar-receita');
    botaoAtualizar.style.display = 'block';
    botaoAtualizar.onclick = () => {
        const receitaAtualizada = {
            titulo: document.getElementById('titulo').value.trim(),
            ingredientes: document.getElementById('ingredientes').value.trim(),
            instrucoes: document.getElementById('instrucoes').value.trim(),
            categoria: document.getElementById('categoria').value.trim(),
            autor: document.getElementById('autor').value.trim(),
        };
        atualizarReceita(id, receitaAtualizada);
        limparFormulario();
        botaoAtualizar.style.display = 'none';
        botaoEnviar.style.display = 'block';
    };
}

async function atualizarReceita(id, receitaAtualizada) {
    const { data, error } = await supabase
        .from('receitas')
        .update(receitaAtualizada)
        .eq('id', id);

    if (error) {
        console.error('Erro ao atualizar receita:', error);
    } else {
        console.log('Receita atualizada com sucesso:', data);
        carregarReceitas();
    }
}

async function deletarReceita(id) {
    const { data, error } = await supabase
        .from('receitas')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Erro ao excluir receita:', error);
    } else {
        console.log('Receita excluída com sucesso:', data);
        carregarReceitas();
    }
}

function limparFormulario() {
    document.getElementById('titulo').value = '';
    document.getElementById('ingredientes').value = '';
    document.getElementById('instrucoes').value = '';
    document.getElementById('categoria').value = '';
    document.getElementById('autor').value = '';
}

async function obterReceitas() {
    const { data: receitas, error } = await supabase
        .from('receitas')
        .select('*');

    if (error) {
        console.error('Erro ao obter receitas:', error);
        return [];
    }

    return receitas;
}
