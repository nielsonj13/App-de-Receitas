document.addEventListener('DOMContentLoaded', () => {
    const submitButton = document.getElementById('submit-recipe');

    submitButton.addEventListener('click', () => {
        const title = document.getElementById('title').value;
        const ingredients = document.getElementById('ingredients').value;
        const instructions = document.getElementById('instructions').value;
        const category = document.getElementById('category').value;
        const author = document.getElementById('author').value;

        if (title && ingredients && instructions && category && author) {
            const recipe = { title, ingredients, instructions, category, author };
            addRecipe(recipe);
            loadRecipes();
            clearForm();
        } else {
            alert('Por favor preencha todos os campos.');
        }
    });

    function addRecipe(recipe) {
        let recipes = getRecipes();
        recipes.push(recipe);
        localStorage.setItem('recipes', JSON.stringify(recipes));
    }

    function getRecipes() {
        return localStorage.getItem('recipes') ? JSON.parse(localStorage.getItem('recipes')) : [];
    }

    function loadRecipes() {
        const recipes = getRecipes();
        const recipesContainer = document.getElementById('recipes');
        recipesContainer.innerHTML = '';
        recipes.forEach((recipe, index) => {
            const recipeDiv = document.createElement('div');
            recipeDiv.classList.add('recipe');
            recipeDiv.innerHTML = `
                <h2>${recipe.title}</h2>
                <p><strong>Ingredients:</strong> ${recipe.ingredients}</p>
                <p><strong>Instructions:</strong> ${recipe.instructions}</p>
                <p><strong>Category:</strong> ${recipe.category}</p>
                <p><strong>Author:</strong> ${recipe.author}</p>
                <button class="delete-recipe" data-index="${index}">Excluir</button>
            `;
            recipesContainer.appendChild(recipeDiv);
        });

        const deleteButtons = document.querySelectorAll('.delete-recipe');
        deleteButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                const index = event.target.getAttribute('data-index');
                deleteRecipe(index);
                loadRecipes();
            });
        });
    }

    function deleteRecipe(index) {
        let recipes = getRecipes();
        recipes.splice(index, 1);
        localStorage.setItem('recipes', JSON.stringify(recipes));
    }

    function clearForm() {
        document.getElementById('title').value = '';
        document.getElementById('ingredients').value = '';
        document.getElementById('instructions').value = '';
        document.getElementById('category').value = '';
        document.getElementById('author').value = '';
    }

    loadRecipes();
});
