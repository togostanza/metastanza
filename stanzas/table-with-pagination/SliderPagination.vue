<template>
  <div v-if="totalPages > 0" ref="paginationWrapper" class="paginationWrapper">
    <div class="serialPagination">
      <div :class="['arrowWrapper', { show: state.currentPage !== 1 }]">
        <span class="arrow double left" @click="state.currentPage = 1"> </span>
        <span class="arrow left" @click="state.currentPage--"></span>
      </div>

      <ul ref="paginationNumList" class="paginationNumList">
        <li
          v-for="page in surroundingPages"
          :key="page"
          :class="['pagination', { currentBtn: state.currentPage === page }]"
          @click="state.currentPage = page"
        >
          {{ page }}
        </li>
      </ul>

      <div
        :class="['arrowWrapper', { show: state.currentPage !== totalPages }]"
      >
        <span class="arrow right" @click="state.currentPage++"></span>
        <span
          class="arrow double right"
          @click="state.currentPage = totalPages"
        ></span>
      </div>

      <form
        class="pageNumber"
        @submit.prevent="jumpToPage(state.jumpToNumberInput)"
      >
        Page
        <input
          v-model.number="state.jumpToNumberInput"
          type="text"
          class="jumpToNumberInput"
        />
        of {{ totalPages }}
        <button>Go</button>
      </form>
    </div>
    <canvas v-if="totalPages > 5" ref="canvas" class="canvas"></canvas>
    <Slider
      v-if="totalPages > 5"
      v-model="state.currentPage"
      :min="1"
      :max="totalPages"
      class="pageSlider"
    >
    </Slider>
  </div>
</template>

<script>
import { defineComponent, reactive, computed, onUpdated, ref } from "vue";

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
  },
  emits: ["updateCurrentPage"],
  setup(props, context) {
    const state = reactive({
      jumpToNumberInput: "",
      currentPage: props.currentPage,
    });
    const surroundingPages = computed(() => {
      const { totalPages } = props;
      const { currentPage } = props;
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

    function jumpToPage(num) {
      if (num < 1 || num > props.totalPages) {
        return;
      }
      state.currentPage = num ? num : 1;
      state.jumpToNumberInput = "";
    }

    const paginationWrapper = ref(null);
    const canvas = ref(null);
    const paginationNumList = ref(null);
    function drawKnobArrow() {
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
        paginationNumListX - paginationWrapper.value.offsetLeft + 111,
        0
      );
      ctx.lineTo(knobX, 50);
      ctx.closePath();
      ctx.fillStyle = "#dddddd";
      ctx.fill();
    }

    onUpdated(drawKnobArrow);
    onUpdated(() => {
      context.emit("updateCurrentPage", state.currentPage);
    });

    return {
      surroundingPages,
      jumpToPage,
      state,
      paginationWrapper,
      drawKnobArrow,
      canvas,
      paginationNumList,
    };
  },
});
</script>
