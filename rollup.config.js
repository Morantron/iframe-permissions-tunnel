// rollup.config.js
import babel from "@rollup/plugin-babel";
import serve from "rollup-plugin-serve";
import resolve from "@rollup/plugin-node-resolve";

const plugins = () => [resolve(), babel({ babelHelpers: "bundled" })];

export default [
  {
    input: "main.js",
    output: {
      file: "main.dist.js",
      format: "umd",
      name: "PermissionsTunnel"
    },
    plugins: plugins()
  },
  {
    input: "demo.js",
    output: {
      file: "demo.dist.js",
      format: "umd",
      name: "PermissionsTunnel"
    },
    plugins: [...plugins(), serve(".")]
  }
];
