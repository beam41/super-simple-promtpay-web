/** @type {import("snowpack").SnowpackUserConfig } */
export default {
  mount: {
    public: { url: "/", static: true },
    src: { url: "/dist" },
  },
  packageOptions: {
    polyfillNode: true,
  },
  optimize: {
    bundle: true,
    minify: true,
    treeshake: true,
    target: "es2018",
    sourcemap: false,
  },
};
