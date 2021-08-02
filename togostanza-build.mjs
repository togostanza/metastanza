import vue from "rollup-plugin-vue";
import replace from "@rollup/plugin-replace";

export default function config(environment) {
  return {
    rollup: {
      plugins: [
        vue(),
        replace({
          values: {
            "process.env.NODE_ENV": JSON.stringify(environment),
            __VUE_OPTIONS_API__: "false",
            __VUE_PROD_DEVTOOLS__: "false",
          },
          preventAssignment: true,
        }),
      ],
    },
  };
}
