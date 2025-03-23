const config = {
  // Hide icons from screen readers. Use attributes and additional elements to label interactive widgets
  svgProps: {
    focusable: "false",
    "aria-hidden": "true",
  },
  svgoConfig: {
    plugins: [
      {
        name: "preset-default",
        params: {
          overrides: {
            // Use custom config for plugin
            convertColors: false,
            // We need `viewBox`es in order to scale icons with font size
            removeViewBox: false,
          },
        },
      },
      {
        name: "convertColors",
        params: {
          currentColor: true,
        },
      },
    ],
  },
};
module.exports = config;
