import icons from "../../img/icons.svg";

export default class View {
  _data;

  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0)) {
      return this.renderError();
    }

    this._data = data;
    const markup = this._generateHTML();

    if (!render) return markup;

    this._clear();
    this._parentElement.insertAdjacentHTML("beforeend", markup);
  }

  update(data) {
    this._data = data;
    const newMarkup = this._generateHTML();

    const newDOM = document.createRange().createContextualFragment(newMarkup);
    const newElements = Array.from(newDOM.querySelectorAll("*"));
    const curElements = Array.from(this._parentElement.querySelectorAll("*"));

    newElements.forEach((newElement, i) => {
      const curElement = curElements[i];
      // console.log(curElement, newElement.isEqualNode(curElement));

      //? updates changed text
      if (
        !newElement.isEqualNode(curElement) &&
        newElement.firstChild?.nodeValue.trim() !== ""
      ) {
        // curElement.innerHTML = newElement.innerHTML;
        curElement.textContent = newElement.textContent;
      }

      //? updates changed attributes
      if (!newElement.isEqualNode(curElement)) {
        // curElement.attributes.dataUpdateTo = newElement.attributes.dataUpdateTo;
        Array.from(newElement.attributes).forEach((attribute) => {
          curElement.setAttribute(attribute.name, attribute.value);
        });
      }
    });
  }

  _clear() {
    this._parentElement.innerHTML = "";
  }
  renderSpinner() {
    const markup = `
      <div class="spinner">
        <svg>
          <use href="${icons}#icon-loader"></use>
        </svg>
      </div>
    `;
    this._clear();
    this._parentElement.insertAdjacentHTML("afterbegin", markup);
  }

  renderError(message = this._errorMessage) {
    const html = `
        <div class="error">
            <div>
              <svg>
                <use href="${icons}#icon-alert-triangle"></use>
              </svg>
            </div>
            <p>${message}</p>
        </div>
    `;

    this._clear();
    this._parentElement.insertAdjacentHTML("afterbegin", html);
  }

  renderSuccess(message = this._successMessage) {
    const html = `
      <div class="message">
        <div>
          <svg>
            <use href="${icons}#icon-smile"></use>
          </svg>
        </div>
        <p>${message}</p>
      </div>
    `;

    this._clear();
    this._parentElement.insertAdjacentHTML("afterbegin", html);
  }
}
