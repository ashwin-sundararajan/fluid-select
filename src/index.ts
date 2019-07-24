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
  private dropdown: HTMLDivElement;
  selectedValue: Option | null = null;
  private selectListeners: ((
    newVal: Option | null,
    oldVal: Option | null
  ) => void)[] = [];
  private optionsContainer: HTMLDivElement;

  constructor(initValues: Option[]) {
    initValues.forEach(
      (option: Option): void => {
        this.values[option.value] = option;
      }
    );

    this.element = FluidSelect.createElement('div', {
      class: 'select__container',
      tabindex: '0'
    }) as HTMLDivElement;

    this.displayContainer = FluidSelect.createElement('div', {
      class: 'select__display'
    }) as HTMLDivElement;

    this.displayContainer.textContent = 'Choose a value';

    this.element.appendChild(this.displayContainer);

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

    this.dropdown = FluidSelect.createElement('div', {
      class: 'select__options hide'
    }) as HTMLDivElement;
    this.element.appendChild(this.dropdown);

    const arrow = FluidSelect.createElement('span', {
      class: 'select__arrow'
    }) as HTMLSpanElement;
    this.element.appendChild(arrow);

    const resetBtn = FluidSelect.createElement('span', {
      class: 'select__reset'
    }) as HTMLSpanElement;
    this.element.appendChild(resetBtn);
    resetBtn.textContent = '×';
    resetBtn.addEventListener(
      'click',
      (): void => {
        this.setValue(null);
      }
    );

    this.searchInput = FluidSelect.createElement('input', {
      class: 'select__input'
    }) as HTMLInputElement;
    this.searchInput.addEventListener(
      'click',
      (event: Event): void => {
        event.stopPropagation();
      }
    );

    const inputContainer = FluidSelect.createElement('div', {
      class: 'select__input-container'
    }) as HTMLDivElement;
    inputContainer.appendChild(this.searchInput);

    this.dropdown.appendChild(inputContainer);

    this.optionsContainer = FluidSelect.createElement('div', {
      class: 'select__options-container'
    }) as HTMLDivElement;
    this.dropdown.appendChild(this.optionsContainer);

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

      this.optionsContainer.appendChild(newDiv);
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
    this.dropdown.classList.remove('hide');
  }

  hideOptions(): void {
    this.dropdown.classList.add('hide');
  }

  toggleOptions(): void {
    this.dropdown.classList.toggle('hide');
  }

  setValue(value: string | null): void {
    const oldVal = this.selectedValue;
    const newVal = value ? this.values[value] : null;

    if (oldVal === newVal) return;

    if (oldVal) {
      this.values[oldVal.value].selected = false;
    }

    if (value) {
      this.values[value].selected = true;
      this.displayContainer.textContent = this.values[value].label;
    } else {
      this.displayContainer.textContent = 'Choose a value';
    }

    this.selectedValue = newVal;

    for (let cb of this.selectListeners) {
      cb(newVal, oldVal);
    }
  }

  onSelect(fn: (newVal: Option | null, oldVal: Option | null) => void): void {
    this.selectListeners.push(fn);
  }
}
