import * as model from "./model";
import recipeView from "./views/recipeView";
import searchView from "./views/searchView";
import resultsView from "./views/resultsView";
import bookmarksView from "./views/bookmarksView";
import paginationView from "./views/paginationView";
import addRecipeView from "./views/addRecipeView";

import "core-js/stable";
import "regenerator-runtime/runtime";
//*===========================================================================*//

// https://forkify-api.herokuapp.com/v2

//*===========================================================================*//

// if (module.hot) {
//   module.hot.accept();
// }

async function controlRecipes() {
  try {
    const id = window.location.hash.slice(1) || "664c8f193e7aa067e94e863f";
    if (!id) recipeView.renderSpinner();

    //? 0) updates results view to mark selected search result
    resultsView.update(model.getSearchResultsPage());
    //? 1) Load recipe
    await model.loadRecipe(id); //* async function that loads recipe details into state object
    const recipe = model.state.recipe;

    //? 2) Render recipe
    recipeView.render(recipe); //* This renders the recipe details
  } catch (error) {
    console.log(error);
    recipeView.renderError();
  }
}

async function controlSearchResults() {
  try {
    resultsView.renderSpinner();

    //? 1) Get search query
    const query = searchView.getQuery();
    if (!query) return;

    //* This doesnt return anything, it just manupilates the state
    //? 2) Load search results
    await model.loadSearchResults(query);

    //? 3) Render results
    // resultsView.render(model.state.search.results);
    resultsView.render(model.getSearchResultsPage());

    //? 4) Render  initial pagination buttons
    paginationView.render(model.state.search);
  } catch (error) {
    console.log(error);
  }
}

function controlPagination(gotoPage) {
  //? 1) Render new results
  resultsView.render(model.getSearchResultsPage(gotoPage));

  //? 2) Render new pagination buttons
  paginationView.render(model.state.search);
}

function controlServings(newServings) {
  //? update recipe servings (in state)
  model.updateServings(newServings);

  //? update recipe view
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
}

function controlAddBookmark() {
  // 1) Add/remove bookmark
  if (!model.state.recipe.bookmarked) {
    model.addBookmark(model.state.recipe);
  } else {
    model.deleteBookmark(model.state.recipe.id);
  }

  //update recipe view
  recipeView.update(model.state.recipe);

  // 3) Render bookmarks
  bookmarksView.render(model.state.bookmarks);
}

function controlBookmarks() {
  bookmarksView.addHandlerRender(model.state.bookmarks);
}

async function controlAddRecipe(newRecipe) {
  try {
    // show loading spinner
    addRecipeView.renderSpinner();
    // upload new recipe data
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    //render recipe
    recipeView.render(model.state.recipe);

    // render success message
    addRecipeView.renderSuccess();

    bookmarksView.render(model.state.bookmarks);

    // close form window
    window.history.pushState(null, "", `#${model.state.recipe.id}`);
    setTimeout(() => {
      addRecipeView.toggleWindow();
    }, 2500);
  } catch (error) {
    console.log(error);
    addRecipeView.renderError(error.message);
  }
}

//*******************************************************/
function init() {
  bookmarksView.addHandlerRender(controlBookmarks);

  recipeView.addHandlerRender(controlRecipes);

  recipeView.addhandlerUpdateServings(controlServings);

  recipeView.addHandlerAddBookmark(controlAddBookmark);

  searchView.addHandlerSearch(controlSearchResults);

  paginationView.addHandlerClick(controlPagination);

  addRecipeView.addHandlerUpload(controlAddRecipe);
}
init();
//*******************************************************/
