// If the theme is in use, it's unavailable, unless it's the currently active theme of the pot
export const isUnavailable = (items: { id: string }[], id: string) => {
  return !items.every((i) => i.id === id);
};
