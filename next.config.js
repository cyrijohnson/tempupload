const removeImports = require("next-remove-imports")();
module.exports = removeImports({
  devIndicators: {
    autoPrerender: false,
  },
  publicRuntimeConfig: {
    // Will be available on both server and client
    theme: "DEFAULT",
  },
  images: {
    domains: ["localhost"],
  },
});
