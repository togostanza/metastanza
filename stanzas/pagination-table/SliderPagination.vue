<template>
  <div v-if="totalPages > 1" ref="paginationWrapper" class="paginationWrapper">
    <div class="serialPagination">
      <div :class="['arrowWrapper', { show: currentPage !== 1 }]">
        <font-awesome-icon
          class="arrow double left"
          icon="angle-double-left"
          @click="updateCurrentPage(1)"
        />
        <font-awesome-icon
          class="arrow left"
          icon="angle-left"
          @click="updateCurrentPage(currentPage - 1)"
        />
      </div>

      <ul ref="paginationNumList" class="paginationNumList">
        <li
          v-for="page in surroundingPages"
          :key="page"
          :class="['pagination', { currentBtn: currentPage === page }]"
          @click="updateCurrentPage(page)"
        >
          {{ page }}
        </li>
      </ul>

      <div :class="['arrowWrapper', { show: currentPage !== totalPages }]">
        <font-awesome-icon
          class="arrow right"
          icon="angle-right"
          @click="updateCurrentPage(currentPage + 1)"
        />
        <font-awesome-icon
          class="arrow double right"
          icon="angle-double-right"
          @click="updateCurrentPage(totalPages)"
        />
      </div>
      <div class="pageNumber">
        Page
        <input
          :value="currentPage"
          type="text"
          class="jumpToNumberInput"
          @input="updateCurrentPage(Number($event.target.value))"
        />
        of {{ totalPages }}
      </div>
    </div>
    <template v-if="isSliderOn === 'true' && totalPages > 5">
      <canvas ref="canvas" class="canvas"></canvas>
      <Slider
        v-model="inputtingCurrentPage"
        :min="1"
        :max="totalPages"
        class="pageSlider"
        @update="updateCurrentPage(inputtingCurrentPage)"
      >
      </Slider>
    </template>
  </div>
</template>

<script>
import { defineComponent, computed, onUpdated, ref } from "vue";

import Slider from "@vueform/slider";

import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faAngleRight,
  faAngleDoubleRight,
  faAngleLeft,
  faAngleDoubleLeft,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(faAngleRight, faAngleDoubleRight, faAngleLeft, faAngleDoubleLeft);

export default defineComponent({
  components: {
    Slider,
    FontAwesomeIcon,
  },
  props: {
    currentPage: {
      type: Number,
      default: 1,
    },
    totalPages: {
      type: Number,
      default: 1,
    },
    isSliderOn: {
      type: String,
      default: "true",
    },
  },
  emits: ["updateCurrentPage"],
  setup(props, context) {
    const inputtingCurrentPage = ref(1);

    const surroundingPages = computed(() => {
      const totalPages = props.totalPages;
      const currentPage = props.currentPage;
      let start, end;
      if (currentPage <= 3) {
        start = 1;
        end = Math.min(start + 4, totalPages);
      } else if (totalPages - currentPage <= 3) {
        end = totalPages;
        start = Math.max(end - 4, 1);
      } else {
        start = Math.max(currentPage - 2, 1);
        end = Math.min(currentPage + 2, totalPages);
      }
      return Array.from({ length: end - start + 1 }, (_, i) => start + i);
    });

    const paginationWrapper = ref(null);
    const canvas = ref(null);
    const paginationNumList = ref(null);
    function drawKnobArrow() {
      setTimeout(() => {
        const totalPages = props.totalPages;
        if (totalPages <= 5) {
          return;
        }

        canvas.value.width = paginationWrapper.value.clientWidth;
        canvas.value.height = 50;

        const sliderY =
          paginationWrapper.value.getElementsByClassName("pageSlider")[0]
            .offsetTop;
        const tablePaginationOrder =
          paginationNumList.value.offsetTop < sliderY
            ? "column"
            : "column-reverse";

        const paginationNumListX = paginationNumList.value.offsetLeft;
        const paginationNumListY = tablePaginationOrder === "column" ? 0 : 50;

        const knob =
          paginationWrapper.value.getElementsByClassName("slider-origin")[0];
        const knobTranslate = knob.style.transform
          .match(/translate\((.+)%,(.+)\)/)[1]
          .split(",")[0];
        const knobX =
          ((1000 + Number(knobTranslate)) / 1000) * canvas.value.clientWidth;
        const knobY = tablePaginationOrder === "column" ? 50 : 0;

        const ctx = canvas.value.getContext("2d");
        ctx.beginPath();
        ctx.moveTo(
          paginationNumListX - paginationWrapper.value.offsetLeft,
          paginationNumListY
        );
        ctx.lineTo(
          paginationNumListX -
            paginationWrapper.value.offsetLeft +
            paginationNumList.value.clientWidth,
          paginationNumListY
        );
        ctx.lineTo(knobX, knobY);
        ctx.closePath();
        ctx.fillStyle = "#dddddd";
        ctx.fill();
      }, 0);
    }

    function updateCurrentPage(num) {
      inputtingCurrentPage.value = num;
      context.emit("updateCurrentPage", num);
    }

    if (props.isSliderOn === "true") {
      onUpdated(drawKnobArrow);
    }

    return {
      inputtingCurrentPage,
      surroundingPages,
      paginationWrapper,
      drawKnobArrow,
      updateCurrentPage,
      canvas,
      paginationNumList,
    };
  },
});
</script>
