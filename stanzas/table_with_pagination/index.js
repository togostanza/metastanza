import metastanza from "@/lib/metastanza_utils.js";
import { span } from "vega";
import { filter, sort } from "d3";
import { forEach } from "vega-lite/build/src/encoding";

export default async function tableWithPagination(stanza, params) {
  stanza.render({
    template: "stanza.html.hbs",
  });

  const formBody = [];
  for (const key in params) {
    if (params[key] && key !== "table_data_api") {
      formBody.push(key + "=" + encodeURIComponent(params[key]));
    }
  }

  const api = params.table_data_api;
  const element = stanza.root.querySelector("#renderDiv");
  const data = await metastanza.getFormatedJson(
    api,
    element,
    formBody.join("&")
  );
  console.log('original_data', data);

  let data_for_table = {
    head: [],
    body: [],
    meta: {
      page: 1,
      total: 10,
    },
  };

  data.head.labels.forEach((label, index) => {
    if (label) {
      let vars = [];
      data.body.forEach(datam => {
        if (vars.indexOf(datam[data.head.vars[index]].value) === -1) {
          vars.push(datam[data.head.vars[index]].value);
        }
      });
      data_for_table.head.push({
        index: data.head.order[index],
        label: label,
        data: data.head.vars[index],
        vars: vars,
      });
    }
  });

  data.body.forEach(datam => {
    let body_datam = {
      value: {},
      display: "inline-table",
    };
    data.head.labels.forEach((label, index) => {
      const col = data.head.vars[index];
      const href = data.head.href[index];
      if (label) {
        body_datam.value[col] = datam[col];
      }
      if (href) {
        body_datam.value[col].href = datam[href].value;
      }
    });
    data_for_table.body.push(body_datam);
  });

  console.log("data for table", data_for_table);

  stanza.render({
    template: "stanza.html.hbs",
    parameters: data_for_table,
  });

  //download
  const blob = new Blob([JSON.stringify(data_for_table, null, "  ")], {type: "application/json"});
  const url = URL.createObjectURL(blob);
  stanza.select("#download-btn").setAttribute("href", url)

  let adjusted_data_for_table = {
    head: [...data_for_table.head],
    body: [...data_for_table.body],
    meta: {
      page: 1,
      total: 10,
    },
  };

  //filter

  //toggle window
  stanza.selectAll(".filter-icon").forEach(el => {
    el.addEventListener("click", e => {
      let col = e.path[0].getAttribute("data-type");
      stanza.select(`.filter-window[data-type="${col}"]`).classList.add("on");
      stanza.select("#modal-bg").classList.add("on");
    });
  });

  //toggle filter checkbox
  stanza.selectAll('input[type="checkbox"]').forEach(filter_elm => {
    filter_elm.addEventListener("click", e => {
      filterBody();
    });
  });

  //click Select All or Clear button at filter window
  stanza.selectAll("button.toggle_all_button").forEach(filter_elm => {
    filter_elm.addEventListener("click", e => {
      let select_all = false;
      if (e.path[0].getAttribute("class").indexOf("select_all") !== -1) {
        select_all = true;
      }
      let target_col = e.path[0].parentElement.getAttribute("data-type");
      stanza
        .selectAll(`input[type="checkbox"][data-type="${target_col}"]`)
        .forEach(filter_elm => {
          if (select_all) {
            filter_elm.checked = true;
          } else {
            filter_elm.checked = false;
          }
        });
      filterBody();
    });
  });

  const filterBody = () => {
    let remove_data = [];
    stanza.selectAll('input[type="checkbox"]').forEach(checkbox => {
      if (!checkbox.checked) {
        let col_to_remove = checkbox.getAttribute("data-type");
        let val_to_remove = stanza.select(
          `label[for="${checkbox.getAttribute("id")}"]`
        ).innerText;
        remove_data.push({ col: col_to_remove, val: val_to_remove });
      }
    });

    adjusted_data_for_table.body = data_for_table.body.filter(datam => {
      let is_checked = true;
      remove_data.forEach(remove_datam => {
        if (datam.value[remove_datam.col].value === remove_datam.val) {
          is_checked = false;
        }
      });
      return is_checked;
    });
    reRenderBody();
  };

  //sort
  let sort_state = {
    active_col: "",
    order: "asc",
  };

  stanza.select("#modal-bg").addEventListener("click", () => {
    stanza.selectAll(".filter-window").forEach(el => {
      el.classList.remove("on");
      stanza.select("#modal-bg").classList.remove("on");
    });
  });

  stanza.selectAll(".sort-icon").forEach(el => {
    el.addEventListener("click", e => {
      stanza
        .selectAll(".sort-icon")
        .forEach(el => el.classList.remove("asc", "desc"));
      let clicked_element = e.path[0];
      if (sort_state.active_col === clicked_element.getAttribute("data-type")) {
        sort_state.order = sort_state.order === "asc" ? "desc" : "asc";
      } else {
        sort_state.active_col = clicked_element.getAttribute("data-type");
        sort_state.order = "asc";
      }
      clicked_element.classList.add(sort_state.order);
      switch (sort_state.order) {
        case "desc":
          adjusted_data_for_table.body.sort((a, b) => {
            return a.value[sort_state.active_col].value.toLowerCase() <
              b.value[sort_state.active_col].value.toLowerCase()
              ? -1
              : 1;
          });
          break;
        case "asc":
          adjusted_data_for_table.body.sort((b, a) => {
            return a.value[sort_state.active_col].value.toLowerCase() <
              b.value[sort_state.active_col].value.toLowerCase()
              ? -1
              : 1;
          });
          break;
      }
      reRenderBody();
    });
  });

  //text search
  stanza.select("#search-btn").addEventListener("click", () => {
    searchByText();
  });

  stanza.select("#search-input").addEventListener("keypress", e => {
    const key = e.keyCode || e.charCode || 0;
    if (key == 13) {
      e.preventDefault();
      searchByText();
    }
  });

  const searchByText = () => {
    let text_for_search = stanza.select("#search-input").value;
    adjusted_data_for_table.body = data_for_table.body.filter(datam => {
      let is_shown = false;
      Object.keys(datam.value).forEach(col => {
        if(datam.value[col].value.indexOf(text_for_search) !== -1) {
          is_shown = true
        }
      })
      return is_shown
    });
    // highlight
    // adjusted_data_for_table.body = adjusted_data_for_table.body.map(datam => {
    //   Object.keys(datam.value).forEach(col => {
    //     datam.value[col].value = datam.value[col].value.replace(text_for_search, `<b>${text_for_search}</b>`)
    //   })
    //   return datam
    // })
    reRenderBody();
  };

  const reRenderBody = () => {
    stanza.render({
      template: "tbody.html.hbs",
      selector: "tbody",
      parameters: adjusted_data_for_table,
    });
  };
}
