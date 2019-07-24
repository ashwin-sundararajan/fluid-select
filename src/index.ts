interface Option {
  value: string;
  label: string;
  selected?: boolean;
}

interface SelectOptions {
  [index: string]: Option;
}

interface AttributeDescriptor {
  [index: string]: string;
}

interface EventDescriptor {
  [index: string]: (event: Event) => void;
}

class FluidSelect {
  values: SelectOptions = {};
  element: HTMLDivElement;
  displayContainer: HTMLDivElement;
  searchInput: HTMLInputElement;
  private optionContainer: HTMLDivElement;
  selectedValue: Option | null = null;
  selectListeners: ((newVal: Option, oldVal: Option | null) => void)[] = [];

  constructor(initValues: Option[]) {
    initValues.forEach(
      (option: Option): void => {
        this.values[option.value] = option;
      }
    );

    this.element = FluidSelect.createElement('div', {
      ['class']: 'select__container',
      tabindex: '0'
    }) as HTMLDivElement;

    this.displayContainer = FluidSelect.createElement('div', {
      ['class']: 'select__display'
    }) as HTMLDivElement;

    this.displayContainer.textContent = 'Choose a value';

    this.element.appendChild(this.displayContainer);

    this.optionContainer = FluidSelect.createElement('div', {
      ['class']: 'select__options hide'
    }) as HTMLDivElement;

    this.element.appendChild(this.optionContainer);
    this.element.addEventListener(
      'click',
      (event: Event): void => {
        event.stopPropagation();
        this.toggleOptions();
        this.element.focus();
      }
    );
    document.body.addEventListener(
      'click',
      (): void => {
        this.hideOptions();
      }
    );

    this.searchInput = FluidSelect.createElement('input', {
      ['class']: 'select__input'
    }) as HTMLInputElement;
    this.searchInput.addEventListener(
      'click',
      (event: Event): void => {
        event.stopPropagation();
      }
    );

    const inputContainer = FluidSelect.createElement('div', {
      ['class']: 'select__input-container'
    }) as HTMLDivElement;
    inputContainer.appendChild(this.searchInput);

    this.optionContainer.appendChild(inputContainer);

    const { values } = this;

    for (let value in values) {
      const newDiv = FluidSelect.createElement(
        'div',
        {
          ['class']: 'select__option'
        },
        {
          click: () => {
            this.setValue(value);
          }
        }
      );

      newDiv.textContent = values[value].label;

      this.optionContainer.appendChild(newDiv);
    }
  }

  static createElement(
    type: string,
    attributes?: AttributeDescriptor,
    eventListeners?: EventDescriptor
  ): HTMLElement {
    const element = document.createElement(type);

    if (attributes) {
      for (let key in attributes) {
        element.setAttribute(key, attributes[key]);
      }
    }

    if (eventListeners) {
      for (let event in eventListeners) {
        element.addEventListener(event, eventListeners[event]);
      }
    }

    return element;
  }

  showOptions(): void {
    this.optionContainer.classList.remove('hide');
  }

  hideOptions(): void {
    this.optionContainer.classList.add('hide');
  }

  toggleOptions(): void {
    this.optionContainer.classList.toggle('hide');
  }

  setValue(value: string): void {
    const oldVal = this.selectedValue;
    const newVal = this.values[value];

    if (oldVal === newVal) return;

    if (oldVal) {
      this.values[oldVal.value].selected = false;
    }

    this.values[value].selected = true;
    this.selectedValue = newVal;
    this.displayContainer.textContent = this.selectedValue.label;

    for (let cb of this.selectListeners) {
      cb(newVal, oldVal);
    }
  }

  onSelect(fn: (newVal: Option, oldVal: Option | null) => void): void {
    this.selectListeners.push(fn);
  }
}
