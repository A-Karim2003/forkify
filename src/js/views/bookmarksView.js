import View from "./View";
import previewView from "./previewView";
import icons from "../../img/icons.svg";

class BookmarksView extends View {
  _parentElement = document.querySelector(".bookmarks__list");
  _errorMessage = "Empty bookmarks";

  addHandlerRender(handler) {
    window.addEventListener("load", handler);
  }

  _generateHTML() {
    return this._data
      .map((bookmark) => previewView.render(bookmark, false))
      .join();
  }
}

export default new BookmarksView();
