// Define the template for the custom element
const template = document.createElement('template');
template.innerHTML = `
    <link rel="stylesheet" href="styles.css">
    <div class="container">
        <h2>Recipe Manager</h2>
        <input type="text" placeholder="Recipe Name" id="name" />
        <textarea placeholder="Ingredients" id="ingredients"></textarea>
        <textarea placeholder="Instructions" id="instructions"></textarea>
        <button id="addRecipe">Add Recipe</button>
        <input type="text" placeholder="Search Recipes" id="search" />
        <ul id="recipeList"></ul>
    </div>
`;

class RecipeManager extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' }).appendChild(template.content.cloneNode(true));
        this.recipeList = [];
        this.loadRecipes();
        this.nameInput = this.shadowRoot.querySelector('#name');
        this.ingredientsInput = this.shadowRoot.querySelector('#ingredients');
        this.instructionsInput = this.shadowRoot.querySelector('#instructions');
        this.addRecipeButton = this.shadowRoot.querySelector('#addRecipe');
        this.searchInput = this.shadowRoot.querySelector('#search');
        this.recipeListElement = this.shadowRoot.querySelector('#recipeList');
        this.addRecipeButton.addEventListener('click', () => this.addRecipe());
        this.searchInput.addEventListener('input', () => this.renderRecipes());
    }

    loadRecipes() {
        const savedRecipes = JSON.parse(localStorage.getItem('recipes'));
        if (savedRecipes) {
            this.recipeList = savedRecipes;
        }
    }

    saveRecipes() {
        localStorage.setItem('recipes', JSON.stringify(this.recipeList));
    }

    addRecipe() {
        const name = this.nameInput.value.trim();
        const ingredients = this.ingredientsInput.value.trim();
        const instructions = this.instructionsInput.value.trim();
        if (name && ingredients && instructions) {
            this.recipeList.push({ name, ingredients, instructions, favorite: false });
            this.saveRecipes();
            this.renderRecipes();
            this.clearInputs();
        }
    }

    clearInputs() {
        this.nameInput.value = '';
        this.ingredientsInput.value = '';
        this.instructionsInput.value = '';
    }

    renderRecipes() {
        const searchTerm = this.searchInput.value.toLowerCase();
        this.recipeListElement.innerHTML = '';
        this.recipeList
            .filter(recipe => recipe.name.toLowerCase().includes(searchTerm))
            .forEach((recipe, index) => {
                const recipeElement = document.createElement('li');
                recipeElement.classList.add('recipe');
                recipeElement.innerHTML = `
                    <header>
                        <span class="title ${recipe.favorite ? 'favorite' : ''}">${recipe.name}</span>
                        <div class="actions">
                            <button class="toggleFavorite">${recipe.favorite ? 'Unfavorite' : 'Favorite'}</button>
                            <button class="delete">Delete</button>
                        </div>
                    </header>
                    <p><strong>Ingredients:</strong> ${recipe.ingredients}</p>
                    <p><strong>Instructions:</strong> ${recipe.instructions}</p>
                `;
                recipeElement.querySelector('.delete').addEventListener('click', () => this.deleteRecipe(index));
                recipeElement.querySelector('.toggleFavorite').addEventListener('click', () => this.toggleFavorite(index));
                this.recipeListElement.appendChild(recipeElement);
            });
    }

    deleteRecipe(index) {
        this.recipeList.splice(index, 1);
        this.saveRecipes();
        this.renderRecipes();
    }

    toggleFavorite(index) {
        this.recipeList[index].favorite = !this.recipeList[index].favorite;
        this.saveRecipes();
        this.renderRecipes();
    }
}

customElements.define('recipe-manager', RecipeManager);
