const data = [
  {
    title: "HAPPY PLACE",
    author: "Emily Henry",
    quantity: 10,
    unit_price: 9,
    total_value: null,
  },
  {
    title: "IT ENDS WITH US",
    author: "Colleen Hoover",
    quantity: null,
    unit_price: 10,
    total_value: 40,
  },
  {
    title: "FOURTH WING",
    author: "Rebecca Yarros",
    quantity: 8,
    unit_price: null,
    total_value: 96,
  },
  {
    title: "LESSONS IN CHEMISTRY",
    author: "Bonnie Garmus",
    quantity: 13,
    unit_price: 23,
    total_value: null,
  },
  {
    title: "THE WAGER",
    author: "David Grann",
    quantity: null,
    unit_price: 25,
    total_value: 50,
  },
  {
    title: "THE DADDY DIARIES",
    author: "Andy Cohen",
    quantity: 30,
    unit_price: null,
    total_value: 900,
  },
  {
    title: "THE LIGHT WE CARRY",
    author: "Graham Masterton",
    quantity: 3,
    unit_price: null,
    total_value: 300,
  },
  {
    title: "VERITY",
    author: "Colleen Hoover",
    quantity: null,
    unit_price: 20,
    total_value: 60,
  },
  {
    title: "THE ESCAPE ARTIST",
    author: "Jonathan Freedland",
    quantity: 10,
    unit_price: 16,
    total_value: null,
  },
];
const metadata = [
  {
    id: "title",
    type: "string",
    label: "Title",
  },
  {
    id: "author",
    type: "string",
    label: "Author",
  },
  {
    id: "quantity",
    type: "number",
    label: "Quantity",
  },
  {
    id: "unit_price",
    type: "number",
    label: "Unit price",
  },
  {
    id: "total_value",
    type: "number",
    label: "Total (Quantity * Unit price)",
  },
];

const additionalDataFromBooksDB = [
  {
    genre: "fantasy",
    pages: 378,
    rating: 3.81,
  },
  {
    genre: "fantasy",
    pages: 183,
    rating: 4.01,
  },
  {
    genre: "fantasy",
    pages: 343,
    rating: 4.26,
  },
  {
    genre: "fantasy",
    pages: 320,
    rating: 4.03,
  },
  {
    genre: "cyberpunk",
    pages: 364,
    rating: 3.89,
  },
  {
    genre: "post apocalyptic",
    pages: 186,
    rating: 4.55,
  },
  {
    genre: "horror",
    pages: 207,
    rating: 3.14,
  },
  {
    genre: "horror",
    pages: 123,
    rating: 3.61,
  },
  {
    genre: "horror",
    pages: 243,
    rating: "3.62",
  },
];
const additionalMetadataFromBooksDB = [
  {
    id: "genre",
    type: "string",
    label: "Genre",
  },
  {
    id: "pages",
    type: "number",
    label: "Pages",
  },
  {
    id: "rating",
    type: "number",
    label: "Rating",
  },
];

const searchInputElement = document.body.querySelector("input.search-input");
const searchButtonElement = document.body.querySelector("button.search-go");
const searchResetElement = document.body.querySelector("button.search-reset");

const columnHideElement = document.body.querySelector("button.column-hide");
const columnShowElement = document.body.querySelector("button.column-show");
const columnResetElement = document.body.querySelector("button.column-reset");

const markButtonElement = document.body.querySelector("button.function-mark");
const fillButtonElement = document.body.querySelector("button.function-fill");
const countButtonElement = document.body.querySelector("button.function-count");
const computeTotalsButtonElement = document.body.querySelector(
  "button.function-totals"
);
const resetFunctionButtonElement = document.body.querySelector(
  "button.function-reset"
);

class Grid {
  constructor() {
    const newData = data.map((item, index) => {
      return { ...item, ...additionalDataFromBooksDB[index] };
    });

    this.data = newData;
    this.metadata = metadata;

    // HINT: below map can be useful for view operations ;))
    this.dataViewRef = new Map();
    this.hiddenColIndex = 1;
    this.colToShowIndex = 1;
    Object.freeze(this.data);
    Object.freeze(this.metadata);

    this.render();
    this.live();
  }

  render() {
    this.table = document.createElement("table");

    this.head = this.table.createTHead();
    this.body = this.table.createTBody();

    this.renderHead();
    this.renderBody();

    document.body.append(this.table);
  }

  renderHead() {
    const row = this.head.insertRow();

    for (const column of this.metadata.concat(additionalMetadataFromBooksDB)) {
      const cell = row.insertCell();

      cell.innerText = column.label;
    }
  }

  renderBody(newData = this.data) {
    for (const dataRow of newData) {
      const row = this.body.insertRow();

      for (const column of this.metadata.concat(
        additionalMetadataFromBooksDB
      )) {
        const cell = row.insertCell();

        cell.classList.add(column.type);
        cell.innerText = dataRow[column.id];
      }

      // connect data row reference with view row reference
      this.dataViewRef.set(dataRow, row);
    }
  }

  live() {
    searchButtonElement.addEventListener(
      "click",
      this.onSearchChange.bind(this)
    );

    searchResetElement.addEventListener("click", this.onSearchReset.bind(this));

    columnHideElement.addEventListener(
      "click",
      this.onColumnHideClick.bind(this)
    );
    columnShowElement.addEventListener(
      "click",
      this.onColumnShowClick.bind(this)
    );
    columnResetElement.addEventListener("click", this.onColumnReset.bind(this));

    markButtonElement.addEventListener(
      "click",
      this.onMarkEmptyClick.bind(this)
    );
    fillButtonElement.addEventListener(
      "click",
      this.onFillTableClick.bind(this)
    );
    countButtonElement.addEventListener(
      "click",
      this.onCountEmptyClick.bind(this)
    );
    computeTotalsButtonElement.addEventListener(
      "click",
      this.onComputeTotalsClick.bind(this)
    );
    resetFunctionButtonElement.addEventListener(
      "click",
      this.onFunctionsResetClick.bind(this)
    );
  }

  onSearchChange() {
    const filteredData = this.data.filter((item) =>
      item.title.toLowerCase().includes(searchInputElement.value)
    );
    this.clearPreviousTableState();
    this.renderBody(filteredData);
    searchInputElement.value = "";
  }
  clearPreviousTableState() {
    const rows = document.querySelectorAll("tbody tr");
    this.rows;
    for (let i = rows.length - 1; i >= 0; i--) {
      let row = rows[i];
      if (row.parentNode) {
        row.parentNode.removeChild(row);
      }
    }
  }

  onSearchReset() {
    this.clearPreviousTableState();
    const header = document.querySelector("table thead > tr");
    header.remove();
    this.renderHead();
    this.renderBody();
  }

  onColumnHideClick() {
    const tableData = document.querySelectorAll(
      `table tr td:nth-child(${this.hiddenColIndex})`
    );
    for (let i = tableData.length - 1; i >= 0; i--) {
      let row = tableData[i];
      row.classList.add("hidden");
    }
    this.hiddenColIndex = this.hiddenColIndex + 1;
    this.colToShowIndex = 1;
  }

  onColumnShowClick() {
    const tableData = document.querySelectorAll(
      `table tr td:nth-child(${this.colToShowIndex})`
    );
    for (let i = tableData.length - 1; i >= 0; i--) {
      let row = tableData[i];
      row.classList.remove("hidden");
    }
    this.colToShowIndex = this.colToShowIndex + 1;
    this.hiddenColIndex = 1;
  }

  onColumnReset() {
    const tableElement = document.getElementsByTagName("table");
    tableElement[0].remove();
    this.hiddenColIndex = 1;
    this.colToShowIndex = 1;
    this.render();
  }

  onMarkEmptyClick() {
    const cells = document.querySelectorAll("td");
    cells.forEach((cell) => {
      if (!cell.textContent) {
        cell.classList.add("bordered");
      }
    });
  }

  onFillTableClick() {
    const tableRow = document.querySelectorAll("tbody tr");
    tableRow.forEach((row, index) => {
      let quaCell = document.querySelector(
        `tbody tr:nth-child(${index + 1}) td:nth-child(3)`
      );
      let priceCell = document.querySelector(
        `tbody tr:nth-child(${index + 1}) td:nth-child(4)`
      );
      let totalCell = document.querySelector(
        `tbody tr:nth-child(${index + 1}) td:nth-child(5)`
      );
      if (!totalCell.textContent) {
        totalCell.textContent = quaCell.textContent * priceCell.textContent;
        totalCell.classList.remove("bordered");
      } else if (!quaCell.textContent) {
        quaCell.textContent = totalCell.textContent / priceCell.textContent;
        quaCell.classList.remove("bordered");
      } else {
        priceCell.textContent = totalCell.textContent / quaCell.textContent;
        priceCell.classList.remove("bordered");
      }
    });
  }

  onCountEmptyClick() {
    let numberOfEmptyCells = 0;
    const cells = document.querySelectorAll("td");
    cells.forEach((cell) => {
      if (!cell.textContent) {
        numberOfEmptyCells += 1;
      }
    });
    alert(`Found ${numberOfEmptyCells} empty cells!`);
  }

  onComputeTotalsClick() {
    const totalAmount = document.querySelectorAll("tbody tr td:nth-child(5)");
    let total = 0;
    totalAmount.forEach((singleCell) => {
      if (singleCell.textContent) {
        total = total + Number(singleCell.textContent);
      }
    });
    alert(`Sum of "Total (Quantity * Unit price)" equals ${total}`);
  }

  onFunctionsResetClick() {
    this.onColumnReset();
    this.clearPreviousTableState();
    this.renderBody();
  }
}

new Grid();
