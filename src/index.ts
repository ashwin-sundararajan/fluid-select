namespace fluid {
  interface Option {
    value: string;
    label: string;
    selected?: boolean;
  }

  interface AttributeDescriptor {
    [index: string]: string;
  }

  interface EventDescriptor {
    [index: string]: (event: Event) => void;
  }

  class Helpers {
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

    static findOption(options: Option[], value: string | null): Option | null {
      if (!value) return null;

      for (let option of options) {
        if (option.value === value) {
          return option;
        }
      }
      return null;
    }

    static emptyElement(el: HTMLElement) {
      while (el.firstChild) {
        el.removeChild(el.firstChild);
      }
    }

    static hideAllElements(selector: string, except?: HTMLElement) {
      document.querySelectorAll(selector).forEach(
        (element): void => {
          if (element !== except) {
            element.classList.add('hide');
          }
        }
      );
    }
  }

  export class FluidSelect {
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

    constructor(public values: Option[]) {
      this.element = Helpers.createElement('div', {
        class: 'select__container',
        tabindex: '0'
      }) as HTMLDivElement;

      this.displayContainer = Helpers.createElement('div', {
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
          Helpers.hideAllElements('.select__options', this.dropdown);
        }
      );
      document.addEventListener(
        'click',
        (): void => {
          this.hideOptions();
        }
      );

      this.dropdown = Helpers.createElement('div', {
        class: 'select__options hide'
      }) as HTMLDivElement;
      this.element.appendChild(this.dropdown);

      const arrow = Helpers.createElement('span', {
        class: 'select__arrow'
      }) as HTMLSpanElement;
      this.element.appendChild(arrow);

      const resetBtn = Helpers.createElement('span', {
        class: 'select__reset'
      }) as HTMLSpanElement;
      this.element.appendChild(resetBtn);
      resetBtn.textContent = '×';
      resetBtn.addEventListener(
        'click',
        (): void => {
          this.setSelectedValue(null);
        }
      );

      this.searchInput = Helpers.createElement('input', {
        class: 'select__input'
      }) as HTMLInputElement;
      this.searchInput.addEventListener(
        'click',
        (event: Event): void => {
          event.stopPropagation();
        }
      );
      this.searchInput.addEventListener(
        'input',
        (): void => {
          const searchString = this.searchInput.value;

          const valuesToDisplay = this.values.filter(
            (option): boolean => {
              return (
                option.label
                  .toLowerCase()
                  .indexOf(searchString.toLowerCase()) !== -1
              );
            }
          );
          this.setOptions(valuesToDisplay);
        }
      );

      const inputContainer = Helpers.createElement('div', {
        class: 'select__input-container'
      }) as HTMLDivElement;
      inputContainer.appendChild(this.searchInput);

      this.dropdown.appendChild(inputContainer);

      this.optionsContainer = Helpers.createElement('div', {
        class: 'select__options-container'
      }) as HTMLDivElement;
      this.dropdown.appendChild(this.optionsContainer);

      this.setOptions(this.values);
    }

    setOptions(options: Option[]) {
      Helpers.emptyElement(this.optionsContainer);
      const fragment = document.createDocumentFragment();
      for (let option of options) {
        if (option.selected) continue;
        const newDiv = Helpers.createElement(
          'div',
          {
            ['class']: 'select__option'
          },
          {
            click: () => {
              this.setSelectedValue(option.value);
            }
          }
        );

        newDiv.textContent = option.label;

        fragment.appendChild(newDiv);
      }
      this.optionsContainer.appendChild(fragment);
    }

    showOptions(): void {
      this.dropdown.classList.remove('hide');
      this.setOptions(this.values);
    }

    hideOptions(): void {
      this.dropdown.classList.add('hide');
    }

    toggleOptions(): void {
      if (this.dropdown.classList.contains('hide')) {
        this.showOptions();
      } else {
        this.hideOptions();
      }
    }

    setSelectedValue(value: string | null): void {
      const oldVal = this.selectedValue;
      let newVal: Option | null = Helpers.findOption(this.values, value);

      if (oldVal === value) return;

      if (oldVal) {
        oldVal.selected = false;
      }

      if (newVal) {
        newVal.selected = true;
        this.displayContainer.textContent = newVal.label;
        this.element.dataset.value = newVal.value;
      } else {
        this.displayContainer.textContent = 'Choose a value';
        delete this.element.dataset.value;
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
}
