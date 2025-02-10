import { async } from "regenerator-runtime";
import { API_URL, RES_PER_PAGE, KEY } from "./config";
import { AJAX } from "./helpers";

export const state = {
  recipe: {},
  search: {
    query: "",
    results: [],
    resultsPerPage: RES_PER_PAGE,
    page: 1,
  },

  bookmarks: [],
};

function createRecipeObject(data) {
  //? Format data
  const { recipe } = data.data;
  return {
    id: recipe.id,
    title: recipe.title,
    ingredients: recipe.ingredients,
    publisher: recipe.publisher,
    servings: recipe.servings,
    sourceUrl: recipe.source_url,
    cookingTime: recipe.cooking_time,
    image: recipe.image_url,
    ...(recipe.key && { key: recipe.key }),
  };
}

//* This function will not return anything. It only modifies the state object.
/* The function loads recipe data into the state object above  */
export async function loadRecipe(id) {
  try {
    const data = await AJAX(`${API_URL}/${id}`);

    //? Format data
    state.recipe = createRecipeObject(data);

    if (state.bookmarks.some((bookmark) => bookmark.id === id)) {
      state.recipe.bookmarked = true;
    } else {
      state.recipe.bookmarked = false;
    }
  } catch (error) {
    throw error;
  }
}

//* This function will not return anything. It only modifies the state object.
/* The function loads recipe data into the state object above  */
export async function loadSearchResults(query) {
  try {
    state.search.page = 1;

    state.search.query = query;
    const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);

    state.search.results = data.data.recipes.map((recipe) => {
      return {
        id: recipe.id,
        title: recipe.title,
        publisher: recipe.publisher,
        image: recipe.image_url,
        ...(recipe.key && { key: recipe.key }),
      };
    });
  } catch (error) {
    throw error;
  }
}

/* 
page: This argument represents the page number you want to retrieve
(e.g., page 1, page 2, etc.).
*/
// resultsPerPage = 10
export function getSearchResultsPage(page = state.search.page) {
  state.search.page = page;

  const start = (page - 1) * state.search.resultsPerPage;
  const end = page * state.search.resultsPerPage;

  return state.search.results.slice(start, end);
}

export function updateServings(newServings) {
  console.log(state.recipe.ingredients);

  state.recipe.ingredients.forEach((ingredient) => {
    // New Quantity = (Original Quantity / Original Servings) * New Servings

    ingredient.quantity =
      (ingredient.quantity / state.recipe.servings) * newServings;
  });
  state.recipe.servings = newServings;
}

function persistBookmarks() {
  localStorage.setItem("bookmarks", JSON.stringify(state.bookmarks));
}

export function addBookmark(recipe) {
  //? Add bookmark
  state.bookmarks.push(recipe);

  //? Mark current recipe as bookmarked
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;
  persistBookmarks();
}

export function deleteBookmark(id) {
  const index = state.bookmarks.findIndex((el) => el.id === id);
  state.bookmarks.splice(index, 1);

  if (id === state.recipe.id) state.recipe.bookmarked = false;
  persistBookmarks();
}

function init() {
  const storage = localStorage.getItem("bookmarks");
  if (storage) state.bookmarks = JSON.parse(storage);
}
init();

console.log(state.bookmarks);

export async function uploadRecipe(newRecipe) {
  try {
    console.log(Object.entries(newRecipe));

    const ingredients = Object.entries(newRecipe)
      .filter((entry) => {
        return entry[0].slice(0, -2) === "ingredient" && entry[1].length != 0;
      })
      .map((ing) => {
        const ingArr = ing.toString().split(",").splice(1);

        if (ingArr.length !== 3)
          throw new Error("Please enter the correct format 🚨");

        const [quantity, unit, description] = ingArr;

        return {
          quantity: quantity ? Number(quantity) : null,
          unit,
          description,
        };
      });

    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      publisher: newRecipe.publisher,
      servings: Number(newRecipe.servings),
      cooking_time: Number(newRecipe.cookingTime),
      image_url: newRecipe.image,
      ingredients,
    };
    console.log(recipe);
    const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);
    state.recipe = createRecipeObject(data);
    addBookmark(state.recipe);
  } catch (error) {
    throw error;
  }
}
