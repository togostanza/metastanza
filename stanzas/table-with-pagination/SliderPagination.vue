<template>
  <div ref="paginationWrapper" class="paginationWrapper">
    <div class="serialPagination">
      <div
        :class="['arrowWrapper', { show: state.pagination.currentPage !== 1 }]"
      >
        <span
          class="arrow double left"
          @click="state.pagination.currentPage = 1"
        >
        </span>
        <span class="arrow left" @click="state.pagination.currentPage--"></span>
      </div>

      <ul ref="paginationNumList" class="paginationNumList">
        <li
          v-for="page in surroundingPages"
          :key="page"
          :class="[
            'pagination',
            { currentBtn: state.pagination.currentPage === page },
          ]"
          @click="state.pagination.currentPage = page"
        >
          {{ page }}
        </li>
      </ul>

      <div
        :class="[
          'arrowWrapper',
          { show: state.pagination.currentPage !== totalPages },
        ]"
      >
        <span
          class="arrow right"
          @click="state.pagination.currentPage++"
        ></span>
        <span
          class="arrow double right"
          @click="state.pagination.currentPage = totalPages"
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
    <canvas ref="canvas" class="canvas"></canvas>
    <Slider
      v-if="totalPages > 5"
      v-model="state.pagination.currentPage"
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
    pagination: {
      type: Object,
      default: () => {},
    },
    totalPages: {
      type: Number,
      default: 0
    }
  },
  setup(props) {
    const state = reactive({
      jumpToNumberInput: "",
      pagination: props.pagination,
    });
    const surroundingPages = computed(() => {
      const { totalPages } = props;
      const { currentPage } = state.pagination;
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
      state.pagination.currentPage = num ? num : 1;
      state.jumpToNumberInput = "";
    }

    const paginationWrapper = ref(null);
    const canvas = ref(null);
    const paginationNumList = ref(null);
    function fillPaginaionRange() {
      canvas.value.width = paginationWrapper.value.clientWidth;
      canvas.value.height = 50;
      const { totalPages } = props;
      if (canvas.value.getContext && totalPages > 5) {
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
        ctx.moveTo(
          paginationNumListX - paginationNumList.value.parentNode.offsetLeft,
          0
        );
        ctx.lineTo(
          paginationNumListX -
            paginationNumList.value.parentNode.offsetLeft +
            111,
          0
        );
        ctx.lineTo(knobX, 50);
        ctx.closePath();
        ctx.fillStyle = "#dddddd";
        ctx.fill();
      }
    }

    onUpdated(fillPaginaionRange);

    return {
      surroundingPages,
      jumpToPage,
      state,
      paginationWrapper,
      fillPaginaionRange,
      canvas,
      paginationNumList,
    };
  },
});
</script>
