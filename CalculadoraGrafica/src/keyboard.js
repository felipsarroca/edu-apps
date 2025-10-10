const DEFAULT_LAYOUT = [
  [
    { label: 'x', insert: 'x' },
    { label: 'y', insert: 'y' },
    { label: 'z', insert: 'z' },
    { label: '=', insert: '=' },
    { label: '<', insert: '<' },
    { label: '>', insert: '>' },
    { label: '≤', insert: '≤', aria: 'insereix menor o igual' },
    { label: '≥', insert: '≥', aria: 'insereix major o igual' },
    { label: '≠', insert: '≠', aria: 'insereix diferent' },
  ],
  [
    { label: '+', insert: '+' },
    { label: '−', insert: '-' },
    { label: '×', insert: '*', aria: 'insereix multiplicació' },
    { label: '÷', insert: '/', aria: 'insereix divisió' },
    { label: '^', template: { before: '()^()', cursorOffset: 1 }, aria: 'insereix exponent' },
    { label: '²', insert: '^2', aria: 'insereix al quadrat' },
    { label: '³', insert: '^3', aria: 'insereix al cub' },
    { label: '√', template: { before: 'sqrt(', after: ')' }, aria: 'insereix arrel quadrada' },
    { label: '| |', template: { before: 'abs(', after: ')' }, aria: 'insereix valor absolut' },
  ],
  [
    { label: 'sin', template: { before: 'sin(', after: ')' }, aria: 'insereix sinus' },
    { label: 'cos', template: { before: 'cos(', after: ')' }, aria: 'insereix cosinus' },
    { label: 'tan', template: { before: 'tan(', after: ')' }, aria: 'insereix tangent' },
    { label: 'ln', template: { before: 'ln(', after: ')' } },
    { label: 'log', template: { before: 'log(', after: ')' } },
    { label: 'exp', template: { before: 'exp(', after: ')' } },
    { label: 'π', insert: 'pi', aria: 'insereix la constant pi' },
    { label: 'e', insert: 'e', aria: 'insereix la constant e' },
  ],
  [
    { label: '(', insert: '(' },
    { label: ')', insert: ')' },
    { label: '[', insert: '[' },
    { label: ']', insert: ']' },
    { label: '{', insert: '{' },
    { label: '}', insert: '}' },
    { label: ',', insert: ',' },
    { label: 'frac', template: { text: '() / ()', cursorOffset: 1 }, classes: 'is-utility' },
    { label: 'pow', template: { text: '()^()', cursorOffset: 1 }, classes: 'is-utility' },
  ],
  [
    { label: 'undo', action: 'undo', classes: 'is-utility' },
    { label: 'redo', action: 'redo', classes: 'is-utility' },
    { label: '⌫', action: 'backspace', classes: 'is-utility', aria: 'esborra' },
    { label: 'Enter', action: 'enter', classes: 'is-primary' },
  ],
];

const createEvent = (input) =>
  new Event('input', {
    bubbles: true,
    cancelable: true,
  });

const performUndoRedo = (command) => {
  try {
    document.execCommand(command);
  } catch (error) {
    // Ignore si el navegador no ho permet
  }
};

export const initKeyboard = ({
  container,
  inputElement,
  toggleButton,
  onEnter,
  onVisibilityChange,
  layout = DEFAULT_LAYOUT,
} = {}) => {
  if (!container) {
    return {
      show: () => {},
      hide: () => {},
      toggle: () => {},
      isVisible: () => false,
      setLayout: () => {},
      setTargetInput: () => {},
    };
  }

  let isVisible = false;
  let currentLayout = layout;
  let targetInput = inputElement ?? null;

  container.setAttribute('data-visible', 'false');
  container.setAttribute('role', 'group');
  container.setAttribute('aria-label', 'Teclat matemàtic virtual');

  const show = () => {
    if (isVisible) return;
    isVisible = true;
    container.classList.add('is-visible');
    container.setAttribute('data-visible', 'true');
    container.setAttribute('aria-hidden', 'false');
    onVisibilityChange?.(isVisible);
  };

  const hide = () => {
    if (!isVisible) return;
    isVisible = false;
    container.classList.remove('is-visible');
    container.setAttribute('data-visible', 'false');
    container.setAttribute('aria-hidden', 'true');
    onVisibilityChange?.(isVisible);
  };

  const toggle = () => {
    if (isVisible) {
      hide();
    } else {
      show();
    }
  };

  if (toggleButton) {
    toggleButton.addEventListener('click', toggle);
  }

  const triggerInput = () => {
    if (!targetInput) {
      return;
    }
    targetInput.dispatchEvent(createEvent(targetInput));
  };

  const focusInput = () => {
    targetInput?.focus({ preventScroll: true });
  };

  const setSelection = (start, end = start) => {
    if (!targetInput || typeof targetInput.setSelectionRange !== 'function') {
      return;
    }
    targetInput.setSelectionRange(start, end);
  };

  const insertContent = (content, cursorOffset = content.length, selectionLength = 0) => {
    if (!targetInput || typeof targetInput.setRangeText !== 'function') {
      return;
    }
    const start = targetInput.selectionStart ?? targetInput.value.length;
    const end = targetInput.selectionEnd ?? targetInput.value.length;
    targetInput.setRangeText(content, start, end, 'end');
    const cursorPosition = start + cursorOffset;
    setSelection(cursorPosition, cursorPosition + selectionLength);
    triggerInput();
  };

  const insertTemplate = (template) => {
    if (template.text) {
      insertContent(
        template.text,
        template.cursorOffset ?? template.text.length,
        template.selectionLength ?? 0,
      );
      return;
    }
    const before = template.before ?? '';
    const after = template.after ?? '';
    insertContent(before + after, before.length);
  };

  const handleBackspace = () => {
    if (!targetInput) {
      return;
    }
    const start = targetInput.selectionStart ?? 0;
    const end = targetInput.selectionEnd ?? 0;
    if (start === end && start > 0) {
      targetInput.setRangeText('', start - 1, end, 'end');
      setSelection(start - 1);
    } else if (start !== end) {
      targetInput.setRangeText('', start, end, 'end');
      setSelection(start);
    }
    triggerInput();
  };

  const handleKeyPress = (key) => {
    if (key.action) {
      switch (key.action) {
        case 'undo':
          performUndoRedo('undo');
          focusInput();
          break;
        case 'redo':
          performUndoRedo('redo');
          focusInput();
          break;
        case 'backspace':
          handleBackspace();
          focusInput();
          break;
        case 'enter':
          onEnter?.();
          break;
        default:
          break;
      }
      return;
    }

    if (key.template) {
      insertTemplate(key.template);
    } else if (typeof key.insert === 'string') {
      insertContent(key.insert, key.cursorOffset ?? key.insert.length);
    }
    focusInput();
  };

  const renderKeyboard = () => {
    container.innerHTML = '';
    currentLayout.forEach((row) => {
      const rowElement = document.createElement('div');
      rowElement.className = 'vk-row';

      row.forEach((key) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = `vk-key ${key.classes ?? ''}`.trim();
        button.textContent = key.label;
        if (key.aria) {
          button.setAttribute('aria-label', key.aria);
        }
        button.addEventListener('click', () => handleKeyPress(key));
        rowElement.append(button);
      });

      container.append(rowElement);
    });
  };

  const setLayout = (nextLayout) => {
    if (!Array.isArray(nextLayout)) {
      return;
    }
    currentLayout = nextLayout;
    renderKeyboard();
  };

  setLayout(layout);

  return {
    show,
    hide,
    toggle,
    isVisible: () => isVisible,
    setLayout,
    setTargetInput: (nextTarget) => {
      targetInput = nextTarget ?? null;
    },
  };
};
