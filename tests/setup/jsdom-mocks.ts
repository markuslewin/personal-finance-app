// https://jestjs.io/docs/manual-mocks#mocking-methods-which-are-not-implemented-in-jsdom
Object.defineProperty(window.Element.prototype, "hasPointerCapture", {
  value: jest.fn(() => {
    return false;
  }),
});
Object.defineProperty(window.Element.prototype, "scrollIntoView", {
  value: jest.fn(),
});
