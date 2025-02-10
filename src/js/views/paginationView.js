import View from "./View";
import icons from "../../img/icons.svg";

class PaginationView extends View {
  _parentElement = document.querySelector(".pagination");

  addHandlerClick(handler) {
    // handler is going to be a function passed as an argument
    this._parentElement.addEventListener("click", (e) => {
      const btn = e.target.closest(".btn--inline");
      if (!btn) return;

      const gotoPage = Number(btn.dataset.goto);
      handler(gotoPage);
    });
  }
  _generateHTML() {
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );
    const lastPage = numPages;
    const currentPage = this._data.page;

    // Page 1, and there are other pages
    if (currentPage === 1 && numPages > 1) {
      return `
        <button data-goto="${
          currentPage + 1
        }" class="btn--inline pagination__btn--next">
            <span> Page ${currentPage + 1} </span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
        </button>
      `;
    }

    // Last page
    if (currentPage === lastPage && numPages > 1) {
      return `
        <button data-goto="${
          currentPage - 1
        }"  class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span> Page ${currentPage - 1} </span>
        </button>
    `;
    }

    // other page
    if (currentPage < numPages) {
      return `
        <button data-goto="${
          currentPage - 1
        }"  class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span> Page ${currentPage - 1} </span>
        </button>

        <button data-goto="${
          currentPage + 1
        }"  class="btn--inline pagination__btn--next">
            <span> Page ${currentPage + 1} </span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
        </button>
      `;
    }

    // Page 1, and there are no other pages
    return ``;
  }
}

export default new PaginationView();
