/** @type {import("snowpack").SnowpackUserConfig } */
const config = {
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

export default config;
