const { defineConfig } = require("cypress");

module.exports = defineConfig({
  // component: {
  //   devServer: {
  //     framework: "next",
  //     bundler: "webpack",
  //   },
  //   viewportWidth: 1024,
  //   viewportHeight: 768
  // },

  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
