import { MODE_IDS } from './modes.js';

const EMPTY_STATE_TEMPLATE =
  '<div class="empty-state">No hi ha entrades encara. Afegeix-ne una!</div>';

export const renderFunctionsList = (container, items, onDelete) => {
  if (items.length === 0) {
    container.innerHTML = EMPTY_STATE_TEMPLATE;
    return;
  }

  container.innerHTML = '';
  items.forEach((item, index) => {
    const wrapper = document.createElement('div');
    wrapper.className = 'function-item';
    if (item?.id) {
      wrapper.dataset.entryId = item.id;
    }
    wrapper.tabIndex = 0;

    const header = document.createElement('div');
    header.className = 'function-header';

    const infoGroup = document.createElement('div');
    infoGroup.className = 'function-info';

    const badge = document.createElement('span');
    badge.className = 'mode-badge';
    badge.textContent = getModeBadgeLabel(item.mode);

    const colorIndicator = document.createElement('div');
    colorIndicator.className = 'color-indicator';
    colorIndicator.style.background = item.color;

    const text = document.createElement('div');
    text.className = 'function-text';
    text.textContent = item.label ?? item.expression;

    infoGroup.append(badge, colorIndicator, text);

    const actions = document.createElement('div');
    actions.className = 'function-actions';

    const deleteButton = document.createElement('button');
    deleteButton.type = 'button';
    deleteButton.className = 'delete-btn';
    deleteButton.textContent = '✕';
    deleteButton.addEventListener('click', () => onDelete(index));

    actions.append(deleteButton);
    header.append(infoGroup, actions);

    const meta = document.createElement('div');
    meta.className = 'function-meta';

    const summary = item.metadata?.summary;
    const results = Array.isArray(item.metadata?.results)
      ? item.metadata.results
      : [];

    let hasContent = false;

    if (summary) {
      const summaryBlock = document.createElement('div');
      summaryBlock.className = 'function-meta-summary';
      summaryBlock.textContent = summary;
      meta.append(summaryBlock);
      hasContent = true;
    }

    if (results.length > 0) {
      const list = document.createElement('ul');
      list.className = 'function-meta-list';

      results.forEach((result) => {
        const itemElement = document.createElement('li');
        if (result?.label) {
          itemElement.textContent = `${result.label}: ${result.description ?? ''}`;
        } else {
          itemElement.textContent = result?.description ?? '';
        }
        list.append(itemElement);
      });

      meta.append(list);
      hasContent = true;
    }

    if (!hasContent) {
      meta.textContent = 'Resultats encara no disponibles.';
      meta.classList.add('is-placeholder');
    }

    if (
      item.mode === MODE_IDS.SYSTEM ||
      item.mode === 'system' ||
      (Array.isArray(item.expressions) && item.expressions.length > 0)
    ) {
      const expressions = Array.isArray(item.expressions)
        ? item.expressions.filter(Boolean)
        : [];
      if (expressions.length > 0) {
        const expressionsHeader = document.createElement('div');
        expressionsHeader.className = 'function-meta-subtitle';
        expressionsHeader.textContent = 'Expressions del sistema:';

        const exprList = document.createElement('ul');
        exprList.className = 'function-meta-list';

        expressions.forEach((expression, exprIndex) => {
          const expressionElement = document.createElement('li');
          expressionElement.textContent = `${exprIndex + 1}. ${expression}`;
          exprList.append(expressionElement);
        });

        meta.append(expressionsHeader, exprList);
      }
    }

    wrapper.append(header, meta);
    container.append(wrapper);
  });
};

const getModeBadgeLabel = (mode) => {
  switch (mode) {
    case 'inequality':
      return 'Ineq';
    case 'system':
      return 'Sist';
    case 'function':
    default:
      return 'Func';
  }
};
