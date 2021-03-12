<template>
  <div v-if="totalPages > 1" ref="paginationWrapper" class="paginationWrapper">
    <div class="serialPagination">
      <div :class="['arrowWrapper', { show: currentPage !== 1 }]">
        <span class="arrow double left" @click="currentPage = 1"> </span>
        <span class="arrow left" @click="currentPage--"></span>
      </div>

      <ul ref="paginationNumList" class="paginationNumList">
        <li
          v-for="page in surroundingPages"
          :key="page"
          :class="['pagination', { currentBtn: currentPage === page }]"
          @click="currentPage = page"
        >
          {{ page }}
        </li>
      </ul>

      <div
        :class="['arrowWrapper', { show: currentPage !== totalPages }]"
      >
        <span class="arrow right" @click="currentPage++"></span>
        <span
          class="arrow double right"
          @click="currentPage = totalPages"
        ></span>
      </div>
      <div class="pageNumber">
        Page
        <input
          v-model.number="jumpToNumberInput"
          type="text"
          class="jumpToNumberInput"
          @keyup="jumpToPage()"
        />
        of {{ totalPages }}
      </div>
    </div>
    <template v-if="isSliderOn === '1' && totalPages > 5">
      <canvas ref="canvas" class="canvas"></canvas>
      <Slider
        v-model="currentPage"
        :min="1"
        :max="totalPages"
        class="pageSlider"
      >
      </Slider>
    </template>
  </div>
</template>

<script>
import { defineComponent, computed, onUpdated, ref } from "vue";

import Slider from "@vueform/slider";

export default defineComponent({
  components: {
    Slider,
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
      default: "1",
    },
  },
  emits: ["updateCurrentPage"],
  setup(props, context) {
    let currentPage = ref(props.currentPage)
    let jumpToNumberInput = ref(currentPage)

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

    function jumpToPage() {
      const num = jumpToNumberInput.value
      if (num < 1 || num > props.totalPages) {
        return;
      }

      currentPage.value = num;
    }

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
        const paginationNumListX = paginationNumList.value.offsetLeft;
        const knob = paginationWrapper.value.getElementsByClassName(
          "slider-origin"
        )[0];
        const knobTranslate = knob.style.transform
          .match(/translate\((.+)%,(.+)\)/)[1]
          .split(",")[0];
        const knobX =
          ((1000 + Number(knobTranslate)) / 1000) * canvas.value.clientWidth;
        const ctx = canvas.value.getContext("2d");
        ctx.beginPath();
        ctx.moveTo(paginationNumListX - paginationWrapper.value.offsetLeft, 0);
        ctx.lineTo(
          paginationNumListX -
            paginationWrapper.value.offsetLeft +
            paginationNumList.value.clientWidth,
          0
        );
        ctx.lineTo(knobX, 50);
        ctx.closePath();
        ctx.fillStyle = "#dddddd";
        ctx.fill();
      }, 0);
    }

    if(props.isSliderOn === '1') {
      onUpdated(drawKnobArrow);
    }
    onUpdated(() => {
      context.emit("updateCurrentPage", currentPage.value);
    });

    return {
      surroundingPages,
      jumpToPage,
      currentPage,
      jumpToNumberInput,
      paginationWrapper,
      drawKnobArrow,
      canvas,
      paginationNumList,
    };
  },
});
</script>
