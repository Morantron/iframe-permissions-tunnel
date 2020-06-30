// rollup.config.js
import babel from "@rollup/plugin-babel";

export default {
  input: "main.js",
  output: {
    file: "main.dist.js",
    format: "umd",
    name: "PermissionsTunnel"
  },
  plugins: [babel({ babelHelpers: "bundled" })]
};
