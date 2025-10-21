import Fraction from 'fraction.js';
import icon from 'url:../img/icons.svg';

let servings = 4, currPage = 1;
let recipes = [], userRecipes = [], bookmarks = [], openedRecipe = {};

const MAX_RECIPES_PREVIEW = 12;
const APIKEY = "2652b474-48a8-454f-85bc-a403289d47d4";

const recipeContainer = document.querySelector('.recipe');
const initialMessage = recipeContainer.querySelector(".message");
const recipeNameGraphic = document.querySelector(".recipe__fig");
const recipeNameGraphicTitle = document.querySelector(".recipe__title").querySelector("span");
const recipeNameGraphicImage = document.querySelector(".recipe__img");
const recipeDetails = document.querySelector(".recipe__details");
const recipeCookingTime = document.querySelector(".recipe__info-data--minutes");
const recipeServings = document.querySelector(".recipe__info-data--people");
const recipeIngredients = document.querySelector(".recipe__ingredients");
const recipeIngredientList = recipeIngredients.querySelector(".recipe__ingredient-list");
const recipeDirections = document.querySelector(".recipe__directions");
const recipePublisher = document.querySelector(".recipe__publisher");
const originalRecipeDirectionButton = document.querySelector(".recipe__btn");
const increaseServingsButton = document.querySelector(".btn--increase-servings");
const decreaseServingsButton = document.querySelector(".btn--decrease-servings");
const searchInput = document.querySelector(".search__field");
const searchButton = document.querySelector(".search__btn");
const prevPageButton = document.querySelector(".pagination__btn--prev");
const nextPageButton = document.querySelector(".pagination__btn--next");
const recipePreviewContainer = document.querySelector(".results");
const searchResultsContainer = document.querySelector(".search-results");
const spinner = document.querySelector(".spinner");
const errorMessage = document.querySelector(".error");
const fullRecipeUserIcon = document.querySelector(".recipe__user-generated");
const fullRecipeBookmarkButton = document.querySelector(".recipe__btn--bookmarks");
const bookmarksList = document.querySelector(".bookmarks__list");
const addRecipeButton = document.querySelector(".nav__btn--add-recipe");
const overlay = document.querySelector(".overlay");
const addRecipeForm = document.querySelector(".add-recipe-window");
const recipeFormCloseButton = document.querySelector(".btn--close-modal");
const recipeUploadButton = document.querySelector(".upload__btn");

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(() => reject(new Error(`Request took too long! Timeout after ${s} second`)), s*1000);
  });
};

const capitalizeFirstLetter = str => str.split(" ").map((word) =>  word[0].toUpperCase() + word.slice(1)).join(" ");

const getFraction = function(frac) {
  const whole = (new Fraction(frac).n)/(new Fraction(frac).d);
  const rem = (new Fraction(frac)).sub(whole);
  return `${whole ? whole : ""} ${rem.n ? rem.n + "/" + rem.d : ""}`;
}
const callAPI = async function(url) {
  try {
    const res = await Promise.race([fetch(url), timeout(60)]);
    const json = await res.json();
    return json;
  } catch (err) {
    throw err;
  }
};


const addRecipePreview = function(recipe, addTo = recipePreviewContainer) {
  addTo.insertAdjacentHTML("beforeend", 
    `<li class="preview">
      <a class="preview__link preview__link--active" href="${recipe.id}" data-id="${recipe.id}">
        <figure class="preview__fig">
          <img src="${recipe.image_url}" alt="${recipe.title}" />
        </figure>
        <div class="preview__data">
          <h4 class="preview__title">${recipe.title}</h4>
          <p class="preview__publisher">${recipe.publisher}</p>
          ${recipe.id.includes(APIKEY) && addTo === recipePreviewContainer ? 
            `<div class="preview__user-generated">
              <svg>
                <use href="${icon}#icon-user"></use>
              </svg>
            </div>` : ""}
        </div>
      </a>
    </li>`);
}
const previewRecipes = function(curr_page) {
  recipePreviewContainer.innerHTML = "";
  if (curr_page === 1) {
      userRecipes.forEach(recipe => {
        addRecipePreview(recipe, recipePreviewContainer);
      });
  }
  for (let i = (curr_page-1)*MAX_RECIPES_PREVIEW; i < Math.min(recipes.length, curr_page*MAX_RECIPES_PREVIEW); i++) {
    addRecipePreview(recipes[i], recipePreviewContainer);
  }
}

const addIngredient = function(quantity, unit, description) {
  recipeIngredientList.insertAdjacentHTML("beforeend",   
    `<li class="recipe__ingredient">
      <svg class="recipe__icon">
<<<<<<< HEAD
        <use href="${icon}#icon-check"></use>
=======
        <use href="/icons.4c95ab8c.svg#icon-check"></use>
>>>>>>> b2209276c49dae5e3580717e4fa8f0b9c3d8c531
      </svg>
      <div class="recipe__quantity">${quantity}</div>
      <div class="recipe__description">
        <span class="recipe__unit">${unit}</span>
        ${capitalizeFirstLetter(description)}
      </div>
    </li>`);
}
const updateIngredients = function(recipe, servings) {
  recipeIngredientList.innerHTML = ""
  recipe.ingredients.forEach(ingredient => {
    addIngredient(getFraction((ingredient.quantity/recipe.servings)*servings), ingredient.unit, ingredient.description);
  });
}

const displayFullRecipe = function(recipe) {
  if (!recipe) return;

  initialMessage.classList.add("disp-none");
  spinner.classList.add("disp-none");
  errorMessage.classList.add("disp-none");
  recipeNameGraphic.classList.remove("hidden");
  recipeDetails.classList.remove("hidden");
  recipeIngredients.classList.remove("hidden");
  recipeDirections.classList.remove("hidden");

  if(recipe.id.includes(APIKEY)) {
    fullRecipeUserIcon.classList.remove("hidden");
  } else {
    fullRecipeUserIcon.classList.add("hidden");
  }
  fullRecipeBookmarkButton.querySelector("use").setAttribute("href", `${icon}#icon-bookmark${bookmarks.find(bookmark => bookmark.id === recipe.id) ? "-fill" : ""}`);

  recipeNameGraphicTitle.innerHTML = recipe.title;
  recipeNameGraphicImage.src = recipe.image_url;
  recipeCookingTime.textContent = recipe.cooking_time;
  recipeServings.textContent = servings = recipe.servings;
  recipePublisher.textContent = recipe.publisher;
  originalRecipeDirectionButton.href = recipe.source_url;

  updateIngredients(recipe, servings);

}

const searchDish = async function(dish) {
  try {
      spinner.classList.remove("disp-none");
      const allRecipies = await callAPI(`https://forkify-api.jonas.io/api/v2/recipes?search=${dish}&key=${APIKEY}`);
      spinner.classList.add("disp-none");
      return allRecipies.data.recipes;
  } catch(err) {
      errorMessage.classList.remove("disp-none");      
      spinner.classList.add("disp-none");
      throw err;
  }
}

const changePageButtons = function(curr_page) {

  if (curr_page <= 1)
    prevPageButton.classList.add("disp-none");
  
  if (curr_page > 1) {
    prevPageButton.classList.remove("disp-none");
    prevPageButton.querySelector("span").textContent = `Page ${curr_page-1}`;
  }

  if (curr_page*MAX_RECIPES_PREVIEW >= recipes.length) 
    nextPageButton.classList.add("disp-none");
  
  if (curr_page*MAX_RECIPES_PREVIEW < recipes.length) {
    nextPageButton.classList.remove("disp-none");
    nextPageButton.querySelector("span").textContent = `Page ${curr_page+1}`;
  }

}
const changePageTo = function(newPage) {
  currPage = newPage;
  changePageButtons(currPage);
  previewRecipes(currPage);
}


const validateRecipeForm = function() {

  const keys = ["title", "source_url", "image_url", "publisher", "cooking_time", "servings"];
  const newRecipe = {id: `${APIKEY}+${userRecipes.length}`};
  const inputs = addRecipeForm.querySelectorAll("input");

  for (let i = 0; i < 6; i++) {
    if (inputs[i].value === "") return null;
    newRecipe[keys[i]] = inputs[i].value;
  }
  newRecipe["ingredients"] = [];
  
  for (let i = 6; i < inputs.length; i++) {

    const ing = inputs[i].value.split(","); 
    const [quantity, unit, description] = ing.map(word => word.trim());

    if (ing.length === 3 && quantity !== "" && description !== "")
      newRecipe["ingredients"].push({quantity, unit, description});
  }

  return newRecipe["ingredients"].length === 0 ? null : newRecipe;
}
const closeUploadRecipeForm = function() {
  overlay.classList.add("hidden");
  addRecipeForm.classList.add("hidden");
}

const loadFullRecipe = async function(event) {
  const id = event.target.closest(".preview").querySelector(".preview__link").dataset.id;
  spinner.classList.remove("disp-none");
  
  if (id.includes(APIKEY)) {
    openedRecipe = userRecipes.find(rec => rec.id === id);
    if (!openedRecipe)
      throw new Error("Couldn't Find Full Recipe!");
  } else {
    const res = await callAPI(`https://forkify-api.jonas.io/api/v2/recipes/${id}?key=${APIKEY}`);
    openedRecipe = res.data.recipe;
  }
}

const renderRecipe = async function(event) {
  event.preventDefault();

  if (event.target.closest(".preview")) {
      try {
        await loadFullRecipe(event);
        displayFullRecipe(openedRecipe);
      } catch (err) {
        errorMessage.classList.remove("disp-none");
        console.error(err);
      }
      spinner.classList.add("disp-none");
  }
}

const updateBookmarks = function() {
  bookmarksList.innerHTML = "";
  bookmarks.forEach(book => {
    addRecipePreview(book, bookmarksList);
  });
  if (!bookmarks.length) {
    bookmarksList.innerHTML =   
    `<div class="message">
<<<<<<< HEAD
      <div><svg><use href="${icon}#icon-smile"></use></svg></div>
=======
      <div><svg><use href="/icons.4c95ab8c.svg#icon-smile"></use></svg></div>
>>>>>>> b2209276c49dae5e3580717e4fa8f0b9c3d8c531
      <p>No bookmarks yet. Find a nice recipe and bookmark it :)</p>
    </div>`;
  }
}
const saveItemsInLocalStorage = function() {
  localStorage.setItem("servings", JSON.stringify(servings));
  localStorage.setItem("currPage", JSON.stringify(currPage));
  localStorage.setItem("recipes", JSON.stringify(recipes));
  localStorage.setItem("openedRecipe", JSON.stringify(openedRecipe));
  localStorage.setItem("userRecipes", JSON.stringify(userRecipes));
  localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
}
const getItemsFromLocalStorage = function() {
  servings = JSON.parse(localStorage.getItem("servings")) ?? 4;
  currPage = JSON.parse(localStorage.getItem("currPage")) ?? 1;
  recipes = JSON.parse(localStorage.getItem("recipes")) ?? [];
  openedRecipe = JSON.parse(localStorage.getItem("openedRecipe")) ?? null;
  userRecipes = JSON.parse(localStorage.getItem("userRecipes")) ?? [];
  bookmarks = JSON.parse(localStorage.getItem("bookmarks")) ?? [];
}

const init = function() {
  getItemsFromLocalStorage();
  updateBookmarks();
  changePageTo(currPage);
  displayFullRecipe(openedRecipe);
};

document.querySelector("body").addEventListener("click", saveItemsInLocalStorage);

searchButton.addEventListener("click", async (e) => {
  e.preventDefault();
  try {    
    recipes = await searchDish(searchInput.value); 
  } catch (err) {
    console.error(err);
  }
  changePageTo(1);
});

fullRecipeBookmarkButton.addEventListener("click", () => {
  if (bookmarks.find(book => book.id === openedRecipe.id))
      bookmarks.splice(bookmarks.findIndex(book => book.id === openedRecipe.id), 1);
  else
      bookmarks.push(openedRecipe);
  fullRecipeBookmarkButton.querySelector("use").setAttribute("href", `${icon}#icon-bookmark${bookmarks.find(book => book.id === openedRecipe.id) ? "-fill" : ""}`);
  updateBookmarks();
});

nextPageButton.addEventListener("click", () => {
  if (currPage*MAX_RECIPES_PREVIEW < recipes.length)
    changePageTo(currPage+1);
});
prevPageButton.addEventListener("click", () => {
  if (currPage > 1)
    changePageTo(currPage-1);
});

increaseServingsButton.addEventListener("click", () => {
  if (!initialMessage.classList.contains("disp-none")) return;
  servings++;
  recipeServings.textContent = servings;
  updateIngredients(openedRecipe, servings);
});
decreaseServingsButton.addEventListener("click", () => {
  if (!initialMessage.classList.contains("disp-none") || servings <= 1) return;
  servings--;
  recipeServings.textContent = servings;
  updateIngredients(openedRecipe, servings);
});
addRecipeButton.addEventListener("click", () => {
  overlay.classList.remove("hidden");
  addRecipeForm.classList.remove("hidden");
});

recipeUploadButton.addEventListener("click", (e) => {
  e.preventDefault();

  const newRecipe = validateRecipeForm();
  if (!newRecipe) return;

  userRecipes.push(newRecipe);
  closeUploadRecipeForm();
  changePageTo(1);  
});

bookmarksList.addEventListener("click", renderRecipe);
searchResultsContainer.addEventListener("click", renderRecipe);
recipeFormCloseButton.addEventListener("click", closeUploadRecipeForm);

init();