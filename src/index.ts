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

  constructor(initValues: Option[]) {
    initValues.forEach(
      (option: Option): void => {
        this.values[option.value] = option;
      }
    );

    this.element = FluidSelect.createElement('div', {
      ['class']: 'select__container'
    }) as HTMLDivElement;

    this.displayContainer = FluidSelect.createElement('div', {
      ['class']: 'select__display'
    }) as HTMLDivElement;

    this.displayContainer.textContent = 'Choose a value';

    this.element.appendChild(this.displayContainer);

    this.optionContainer = FluidSelect.createElement('div') as HTMLDivElement;
    this.element.appendChild(this.optionContainer);

    this.searchInput = FluidSelect.createElement('input', {
      ['class']: 'select__input'
    }) as HTMLInputElement;

    this.optionContainer.appendChild(this.searchInput);

    const { values } = this;

    for (let value in values) {
      const newDiv = FluidSelect.createElement(
        'div',
        {
          ['class']: 'select__option'
        },
        {
          click: () => {
            if (this.selectedValue) {
              values[this.selectedValue.value].selected = false;
            }

            values[value].selected = true;
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

    return element;
  }

  showOptions() {
    this.optionContainer.classList.remove('hide');
  }

  hideOptions() {
    this.optionContainer.classList.add('hide');
  }

  setValue(value: string) {
    this.selectedValue = this.values[value];
  }
}
