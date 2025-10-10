const EMPTY_STATE_TEMPLATE =
  '<div class="empty-state">No hi ha funcions encara. Afegeix-ne una!</div>';

export const renderFunctionsList = (container, items, onDelete) => {
  if (items.length === 0) {
    container.innerHTML = EMPTY_STATE_TEMPLATE;
    return;
  }

  container.innerHTML = '';
  items.forEach((item, index) => {
    const wrapper = document.createElement('div');
    wrapper.className = 'function-item';

    const colorIndicator = document.createElement('div');
    colorIndicator.className = 'color-indicator';
    colorIndicator.style.background = item.color;

    const text = document.createElement('div');
    text.className = 'function-text';
    text.textContent = `y = ${item.expression}`;

    const deleteButton = document.createElement('button');
    deleteButton.type = 'button';
    deleteButton.className = 'delete-btn';
    deleteButton.textContent = '✕';
    deleteButton.addEventListener('click', () => onDelete(index));

    wrapper.append(colorIndicator, text, deleteButton);
    container.append(wrapper);
  });
};
