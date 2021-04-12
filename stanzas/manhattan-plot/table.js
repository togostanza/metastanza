export const pagination = async function (shadowRoot, params, overThreshArray) {
  // const root;
  const pageBtns = shadowRoot.querySelectorAll(".page-btn");
  const prevBtn = shadowRoot.querySelector("#prevBtn");
  const nextBtn = shadowRoot.querySelector("#nextBtn");
  const firstBtn = shadowRoot.querySelector("#firstBtn");
  const lastBtn = shadowRoot.querySelector("#lastBtn");

  let currentPage = 1;
  const recordsPerPage = params["recordsPerPage"];
  const totalPage = Math.ceil(overThreshArray.length / recordsPerPage);

  // this.init = function () {
  updateTable(1);
  addEventListeners();
  // };

  function surroundingPages() {
    let start, end;
    if (currentPage <= 3) {
      start = 1;
      end = Math.min(start + 4, totalPage);
    } else if (totalPage - currentPage <= 3) {
      end = totalPage;
      start = Math.max(end - 4, 1);
    } else {
      start = Math.max(currentPage - 2, 1);
      end = Math.min(currentPage + 2, totalPage);
    }
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }

  function addEventListeners() {
    prevBtn.addEventListener("click", () => {
      updateTable(currentPage - 1);
    });
    nextBtn.addEventListener("click", () => {
      updateTable(currentPage + 1);
    });
    firstBtn.addEventListener("click", () => {
      updateTable(1);
    });
    lastBtn.addEventListener("click", () => {
      updateTable(totalPage);
    });
  }

  function updateTable(page) {
    currentPage = page;
    const listingTable = shadowRoot.querySelector("#listingTable");
    listingTable.innerHTML = "";
    const tableHeadArray = [
      "gene_name",
      "rsId",
      "chr",
      "pos",
      "ref",
      "alt",
      "p-value",
    ];

    for (
      let i = (page - 1) * recordsPerPage;
      i < page * recordsPerPage && i < overThreshArray.length;
      i++
    ) {
      const tr = document.createElement("tr");
      for (let j = 0; j < tableHeadArray.length; j++) {
        const td = document.createElement("td");
        if (overThreshArray[i][`${tableHeadArray[j]}`]) {
          if (tableHeadArray[j] === "gene_name") {
            const displayedGeneName =
              overThreshArray[i][`${tableHeadArray[j]}`];
            td.innerHTML = `<a target="_blank" href="https://mgend.med.kyoto-u.ac.jp/gene/info/${overThreshArray[i].entrez_id}#locuszoom-link">${displayedGeneName}</a>`;
          } else {
            td.innerText = overThreshArray[i][`${tableHeadArray[j]}`];
          }
        } else {
          td.innerText = "";
        }
        tr.appendChild(td);
      }
      listingTable.appendChild(tr);
    }
    updatePagination();
  }

  function updatePagination() {
    const pageNumber = shadowRoot.querySelector("#pageNumber");
    pageNumber.innerHTML = "";
    const surroundingPage = surroundingPages();

    for (const i of surroundingPage) {
      const pageNumBtn = document.createElement("span");
      pageNumBtn.innerText = i;
      pageNumBtn.setAttribute("class", "page-btn");

      if (i === currentPage) {
        pageNumBtn.classList.add("current");
      }

      pageNumBtn.addEventListener("click", () => {
        updateTable(i);
      });
      pageNumber.append(pageNumBtn);
    }
    pageBtns.forEach((pageBtns) => (pageBtns.style.display = "flex"));

    if (currentPage === 1) {
      firstBtn.style.display = "none";
      prevBtn.style.display = "none";
    }

    if (currentPage === totalPage) {
      nextBtn.style.display = "none";
      lastBtn.style.display = "none";
    }
  }
};
