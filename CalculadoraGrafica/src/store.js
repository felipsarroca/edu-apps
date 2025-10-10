import { COLORS } from './config.js';

export const store = {
  items: [],
  colorIndex: 0,

  addFunction(expression) {
    const color = COLORS[this.colorIndex % COLORS.length];
    this.colorIndex += 1;
    const entry = { expression, color };
    this.items.push(entry);
    return entry;
  },

  removeFunction(index) {
    this.items.splice(index, 1);
  },

  clear() {
    this.items = [];
    this.colorIndex = 0;
  },

  isEmpty() {
    return this.items.length === 0;
  },
};
