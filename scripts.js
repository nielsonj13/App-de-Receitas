const apiUrl = 'https://hlnwrzmtwhqyjfekehqz.supabase.co/rest/v1/receitas';
const apiKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhsbndyem10d2hxeWpmZWtlaHF6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjQyNDUwMzQsImV4cCI6MjAzOTgyMTAzNH0.Ek8lmWZNFQ-4aKb2Y_d_BI83fDRdJsDngTcNGRmDous';

const headers = {
    'Content-Type': 'application/json',
    'apikey': apiKey,
    'Authorization': `Bearer ${apiKey}`
};

// Função para adicionar ou atualizar uma receita
document.getElementById('formulario-receita').addEventListener('submit', async function (e) {
    e.preventDefault();

    const id = document.getElementById('recipe-id').value;
    const titulo = document.getElementById('titulo').value;
    const ingredientes = document.getElementById('ingredientes').value;
    const instrucoes = document.getElementById('instrucoes').value;
    const categoria = document.getElementById('categoria').value;

    if (!titulo || !ingredientes || !instrucoes || !categoria) {
        alert('Por favor, preencha todos os campos.');
        return;
    }

    const recipe = { titulo, ingredientes, instrucoes, categoria };

    try {
        if (id) {
            await updateRecipe(id, recipe);
        } else {
            await saveRecipe(recipe);
        }

        document.getElementById('formulario-receita').reset();
        document.getElementById('enviar-receita').style.display = 'inline-block';
        document.getElementById('atualizar-receita').style.display = 'none';
        fetchRecipes();
    } catch (error) {
        console.error('Erro ao salvar receita:', error);
        alert('Erro ao salvar receita. Veja o console para mais detalhes.');
    }
});

// Função para salvar uma nova receita
async function saveRecipe(recipe) {
    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(recipe)
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(`Erro ao adicionar receita: ${error}`);
        }

        console.log('Receita salva com sucesso');
    } catch (error) {
        console.error('Erro ao salvar receita:', error);
    }
}

// Função para atualizar uma receita
async function updateRecipe(id, recipe) {
    try {
        const response = await fetch(`${apiUrl}?id=eq.${id}`, {
            method: 'PATCH',
            headers: headers,
            body: JSON.stringify(recipe)
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(`Erro ao atualizar receita: ${error}`);
        }

        console.log('Receita atualizada com sucesso');
    } catch (error) {
        console.error('Erro ao atualizar receita:', error);
    }
}

// Função para buscar receitas
async function fetchRecipes() {
    try {
        const response = await fetch(apiUrl, {
            headers: headers
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(`Erro ao buscar receitas: ${error}`);
        }

        const recipes = await response.json();
        console.log('Receitas buscadas:', recipes);
        updateRecipesList(recipes);
    } catch (error) {
        console.error('Erro ao buscar receitas:', error);
    }
}

// Função para atualizar a lista de receitas
function updateRecipesList(recipes) {
    const recipesList = document.getElementById('recipes');
    recipesList.innerHTML = '';
    recipes.forEach(recipe => {
        const li = document.createElement('li');
        li.className = 'receita';
        li.innerHTML = `
            <strong>Título:</strong> ${recipe.titulo}<br>
            <strong>Ingredientes:</strong> ${recipe.ingredientes}<br>
            <strong>Instruções:</strong> ${recipe.instrucoes}<br>
            <strong>Categoria:</strong> ${recipe.categoria}<br>
        `;
        li.appendChild(createEditButton(recipe));
        li.appendChild(createDeleteButton(recipe.id));
        recipesList.appendChild(li);
    });
}

function createEditButton(recipe) {
    const button = document.createElement('button');
    button.textContent = 'Editar';
    button.className = 'editar-receita';
    button.onclick = () => {
        document.getElementById('recipe-id').value = recipe.id;
        document.getElementById('titulo').value = recipe.titulo;
        document.getElementById('ingredientes').value = recipe.ingredientes;
        document.getElementById('instrucoes').value = recipe.instrucoes;
        document.getElementById('categoria').value = recipe.categoria;
        document.getElementById('enviar-receita').style.display = 'none';
        document.getElementById('atualizar-receita').style.display = 'inline-block';
    };
    return button;
}

function createDeleteButton(id) {
    const button = document.createElement('button');
    button.textContent = 'Remover';
    button.className = 'excluir-receita';
    button.onclick = async () => {
        await deleteRecipe(id);
        fetchRecipes();
    };
    return button;
}

async function deleteRecipe(id) {
    try {
        const response = await fetch(`${apiUrl}?id=eq.${id}`, {
            method: 'DELETE',
            headers: headers
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(`Erro ao deletar receita: ${error}`);
        }

        console.log('Receita deletada com sucesso');
    } catch (error) {
        console.error('Erro ao deletar receita:', error);
    }
}

// Carregar receitas ao iniciar a página
window.onload = fetchRecipes;
