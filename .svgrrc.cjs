const config = {
  // Hide icons from screen readers. Use attributes and additional elements to label interactive widgets
  svgProps: {
    focusable: "false",
    "aria-hidden": "true",
  },
  // We need `viewBox`es in order to scale icons with font size
  svgoConfig: {
    plugins: [
      {
        name: "preset-default",
        params: {
          overrides: {
            removeViewBox: false,
          },
        },
      },
    ],
  },
};
module.exports = config;
