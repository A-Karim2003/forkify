import View from "./View";
import icons from "../../img/icons.svg";
import previewView from "./previewView";

class ResultsView extends View {
  _parentElement = document.querySelector(".results");
  _errorMessage = "Could not find recipe. PLease try another one";
  _successMessage = "";

  _generateHTML() {
    return this._data.map((result) => previewView.render(result, false)).join();
  }
}

export default new ResultsView();
