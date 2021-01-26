import "@/stanzas/table-body";

export default function tablePaginationOnMemory(stanza, params) {
  let page_size_list = [10, 20, 50];
  if (params.page_opt) {
    page_size_list = params.page_opt.split(/,/);
  }
  for (const i in page_size_list) {
    page_size_list[i] = parseInt(page_size_list[i]);
  }
  let limit = page_size_list[0];
  let offset = 0;
  let max = 0;
  const click_pages = 5; // max page button (odd integer)
  let show_pages = click_pages;
  let max_page = 0;
  let current_page = 0;
  let knobX = 0;
  let dragF = false;
  let startX = 0;
  let button_display = undefined;
  if (
    params.slider ||
    (params.button_align !== "center" &&
      params.button_align !== "left" &&
      params.button_align !== "right")
  ) {
    params.button_align = "center";
  }

  stanza.render({
    template: "stanza.html.hbs",
    parameters: {
      button_align: params.button_align,
    },
  });

  const div = stanza.select("#tableBody");
  const table_stanza_name = params.table_stanza
    .replace(/\/$/, "")
    .split(/\//)
    .pop();
  div.innerHTML =
    "<togostanza-" +
    table_stanza_name +
    " " +
    params.table_stanza_params +
    ' togostanza-about-link-placement="none"></togostanza-' +
    table_stanza_name +
    ">";
  const togostanza = div.getElementsByTagName(
    "togostanza-" + table_stanza_name
  )[0];
  togostanza.style.display = "none";
  div.appendChild(togostanza);

  const displayTableTr = () => {
    const togostanza = stanza
      .select("#tableBody")
      .getElementsByTagName("togostanza-" + table_stanza_name)[0];
    const tbody = togostanza.shadowRoot.children[0].getElementsByTagName(
      "tbody"
    )[0];
    if (tbody) {
      const trs = tbody.getElementsByTagName("tr");
      for (let i = 0; i < trs.length; i++) {
        if (i >= offset && i < offset + limit) {
          trs[i].style.display = "";
        } else {
          trs[i].style.display = "none";
        }
      }
    }
  };

  const setListStartEnd = (start, end) => {
    stanza.select("#listStart").innerHTML = start;
    stanza.select("#listEnd").innerHTML = end;
  };
  setListStartEnd(1, page_size_list[0]);

  const select = stanza.select("#pageSizeSelect");
  for (const i in page_size_list) {
    const option = document.createElement("option");
    option.innerHTML = page_size_list[i];
    option.setAttribute("value", page_size_list[i]);
    if (i === 0) {
      option.setAttribute("selected", "selected");
    }
    select.appendChild(option);
  }
  select.addEventListener("change", (e) => {
    limit = parseInt(e.target.value);
    console.log(limit);
    current_page = Math.ceil(offset / limit);
    displayTableTr();
    setBothPagination();
  });

  const setBothPagination = () => {
    if (params.top_button) {
      setPagination(stanza.select("#paginationTop"));
    }
    if (params.bottom_button) {
      setPagination(stanza.select("#paginationBottom"));
    }
  };

  const setPagination = (div) => {
    if (!button_display) {
      button_display = document.defaultView.getComputedStyle(
        div.getElementsByClassName("0_button")[0],
        ""
      ).display;
    }
    for (let i = 0; i < click_pages; i++) {
      div.getElementsByClassName(
        i + "_button"
      )[0].style.display = button_display;
      if (i !== click_pages - 1) {
        div
          .getElementsByClassName(i + "_button")[0]
          .classList.remove("page_button_right");
      }
    }
    max_page = Math.ceil(max / limit);
    show_pages = click_pages;
    if (click_pages > max_page) {
      for (let i = max_page; i < click_pages; i++) {
        div.getElementsByClassName(i + "_button")[0].style.display = "none";
        show_pages -= 1;
      }
      div
        .getElementsByClassName(max_page - 1 + "_button")[0]
        .classList.add("page_button_right");
    }
    let start_page = current_page - Math.floor(click_pages / 2);
    if (start_page < 0) {
      start_page = 0;
    }
    if (start_page + show_pages > max_page) {
      start_page = max_page - show_pages;
    }
    const child = div.getElementsByClassName("page_button");
    for (let i = 0; i < click_pages; i++) {
      child[i + 2].innerHTML = start_page + i + 1;
      if (start_page + i === current_page) {
        child[i + 2].classList.add("current_button");
      } else {
        child[i + 2].classList.remove("current_button");
      }
    }
    div
      .getElementsByClassName("first_button")[0]
      .classList.remove("inactive_button");
    div
      .getElementsByClassName("prev_button")[0]
      .classList.remove("inactive_button");
    div
      .getElementsByClassName("last_button")[0]
      .classList.remove("inactive_button");
    div
      .getElementsByClassName("next_button")[0]
      .classList.remove("inactive_button");
    if (current_page === 0) {
      div
        .getElementsByClassName("first_button")[0]
        .classList.add("inactive_button");
      div
        .getElementsByClassName("prev_button")[0]
        .classList.add("inactive_button");
    } else if (current_page === max_page - 1) {
      div
        .getElementsByClassName("last_button")[0]
        .classList.add("inactive_button");
      div
        .getElementsByClassName("next_button")[0]
        .classList.add("inactive_button");
    }

    if (params.slider) {
      const slider = div.getElementsByClassName("page_slider_div")[0];
      const knob_ul = div.getElementsByClassName("page_slider_knob_ul")[0];
      const knob = div.getElementsByClassName("page_slider_knob")[0];
      knob.innerHTML = current_page + 1;
      knobX = Math.round(
        ((current_page + 1) * (slider.offsetWidth - knob.offsetWidth)) /
          max_page
      );
      knob_ul.style.transform = "translateX(" + knobX + "px)";
      setSliderRange(div, knobX);
    }

    let bottom = offset + limit;
    if (bottom > max) {
      bottom = max;
    }
    setListStartEnd(offset + 1, bottom);
  };

  const makeSlider = (div) => {
    const canvas = document.createElement("canvas");
    canvas.setAttribute("class", "slider_range");
    div.appendChild(canvas);
    const slider_range_color = document.createElement("div");
    slider_range_color.setAttribute("class", "slider_range_color");
    slider_range_color.innerHTML = "dummy";
    div.appendChild(slider_range_color);

    const slider = document.createElement("div");
    slider.setAttribute("class", "page_slider_div");
    div.appendChild(slider);
    const slider_bar = document.createElement("div");
    slider_bar.setAttribute("class", "page_slider_bar");
    slider.appendChild(slider_bar);
    const knob_ul = document.createElement("ul");
    knob_ul.setAttribute("class", "page_slider_knob_ul");
    slider.appendChild(knob_ul);
    const knob = document.createElement("li");
    knob.setAttribute("class", "page_slider_knob");
    knob.innerHTML = "1";
    knob_ul.appendChild(knob);
    knob.onmouseover = () => {
      knob.classList.add("onmouse_button");
    };
    knob.onmouseout = () => {
      knob.classList.remove("onmouse_button");
    };

    knob_ul.onmousedown = (e) => {
      dragF = true;
      startX = e.pageX;
    };
    div.onmousemove = (e) => {
      if (dragF) {
        const width = slider.offsetWidth - knob.offsetWidth;
        let dragX = knobX + e.pageX - startX;
        if (dragX < 0) {
          dragX = 0;
        }
        if (dragX > width) {
          dragX = width;
        }
        let page = Math.ceil((max_page * dragX) / width);
        if (page < 1) {
          page = 1;
        }

        if (params.top_button) {
          const div = stanza.select("#paginationTop");
          div.getElementsByClassName("page_slider_knob")[0].innerHTML = page;
          div.getElementsByClassName("page_slider_knob_ul")[0].style.transform =
            "translateX(" + dragX + "px)";
          setSliderRange(div, dragX);
        }
        if (params.bottom_button) {
          const div = stanza.select("#paginationBottom");
          div.getElementsByClassName("page_slider_knob")[0].innerHTML = page;
          div.getElementsByClassName("page_slider_knob_ul")[0].style.transform =
            "translateX(" + dragX + "px)";
          setSliderRange(div, dragX);
        }
      }
    };
    div.onmouseup = (e) => {
      if (dragF) {
        knobX += e.pageX - startX;
        current_page = parseInt(knob.innerHTML) - 1;
        offset = limit * current_page;
        if (offset < 0) {
          offset = 0;
        }
        if (offset > max) {
          offset = max - limit;
        }
        displayTableTr();
        setBothPagination();
        dragF = false;
      }
    };
  };

  const appendButton = (ul, text, tag) => {
    const li = document.createElement("li");
    li.innerHTML = text;
    li.setAttribute("class", tag + "_button page_button");
    ul.appendChild(li);
    li.addEventListener("click", (e) => {
      const text = e.target.innerHTML;
      const current_offset = offset;
      if (text === "&lt;&lt;") {
        offset = 0;
        current_page = 0;
      } else if (text === "&lt;") {
        offset -= limit;
        if (offset < 0) {
          offset = 0;
        }
        current_page -= 1;
        if (current_page < 0) {
          current_page = 0;
        }
      } else if (text === "&gt;") {
        offset += limit;
        if (offset > max) {
          offset = max - limit;
        }
        current_page += 1;
        if (current_page > max_page) {
          current_page = max_page - 1;
        }
      } else if (text === "&gt;&gt;") {
        offset = max - (max % limit);
        if (offset === max) {
          offset = max - limit;
        }
        current_page = max_page - 1;
      } else {
        current_page = parseInt(text) - 1;
        offset = limit * current_page;
        if (offset < 0) {
          offset = 0;
        }
        if (offset > max) {
          offset = max - limit;
        }
      }
      if (current_offset !== offset) {
        displayTableTr();
        setBothPagination();
      }
    });
    li.onmouseover = () => {
      li.classList.add("onmouse_button");
    };
    li.onmouseout = () => {
      li.classList.remove("onmouse_button");
    };
    if (tag === 0) {
      li.classList.add("page_button_left");
    }
    if (tag === click_pages - 1) {
      li.classList.add("page_button_right");
    }
  };

  const makeButtons = (div) => {
    const ul = document.createElement("ul");
    ul.setAttribute("class", "page_button_ul");
    div.appendChild(ul);
    appendButton(ul, "&lt;&lt;", "first");
    appendButton(ul, "&lt;", "prev");
    for (let i = 0; i < click_pages; i++) {
      appendButton(ul, i + 1, i);
    }
    appendButton(ul, "&gt;", "next");
    appendButton(ul, "&gt;&gt;", "last");
  };

  const setSliderRange = (div, knobX) => {
    const slider = div.getElementsByClassName("page_slider_div")[0];
    const knob = div.getElementsByClassName("page_slider_knob")[0];
    const canvas = div.getElementsByClassName("slider_range")[0];
    const canvas_width = slider.offsetWidth;
    canvas.setAttribute("width", canvas_width);
    if (canvas.getContext) {
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
      ctx.beginPath();
      ctx.moveTo(knobX + knob.offsetWidth - 10, 12);
      ctx.lineTo(knobX + 10, 10);
      ctx.lineTo(
        canvas_width / 2 -
          (div.getElementsByClassName("1_button")[0].offsetWidth * show_pages) /
            2,
        100
      );
      ctx.lineTo(
        canvas_width / 2 +
          (div.getElementsByClassName("1_button")[0].offsetWidth * show_pages) /
            2,
        100
      );
      ctx.closePath();
      ctx.fillStyle = document.defaultView.getComputedStyle(
        div.getElementsByClassName("slider_range_color")[0]
      ).backgroundColor;
      ctx.fill();
    }
  };

  if (params.slider) {
    if (params.top_button) {
      makeSlider(stanza.select("#paginationTop"));
    }
    if (params.bottom_button) {
      makeSlider(stanza.select("#paginationBottom"));
    }
  }
  if (params.top_button) {
    makeButtons(stanza.select("#paginationTop"));
  }
  if (params.bottom_button) {
    makeButtons(stanza.select("#paginationBottom"));
  }

  // total size
  const checkChildStanza = () => {
    const togostanza = stanza
      .select("#tableBody")
      .getElementsByTagName("togostanza-" + table_stanza_name)[0];
    const tbody = togostanza.shadowRoot.children[0].getElementsByTagName(
      "tbody"
    )[0];
    if (tbody) {
      clearInterval(waitingTimer);
      const trs = tbody.getElementsByTagName("tr");
      max = trs.length;
      max_page = Math.ceil(max / limit);
      stanza.select("#totalSize").innerHTML = max;
      setBothPagination();
      displayTableTr();
      togostanza.style.display = "inline";
    }
  };
  const waitingTimer = setInterval(checkChildStanza, 100);
}
