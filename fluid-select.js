"use strict";
var FluidSelect = /** @class */ (function () {
    function FluidSelect(initValues) {
        var _this = this;
        this.values = {};
        this.selectedValue = null;
        this.selectListeners = [];
        initValues.forEach(function (option) {
            _this.values[option.value] = option;
        });
        this.element = FluidSelect.createElement('div', {
            class: 'select__container',
            tabindex: '0'
        });
        this.displayContainer = FluidSelect.createElement('div', {
            class: 'select__display'
        });
        this.displayContainer.textContent = 'Choose a value';
        this.element.appendChild(this.displayContainer);
        this.element.addEventListener('click', function (event) {
            event.stopPropagation();
            _this.toggleOptions();
            _this.element.focus();
        });
        document.body.addEventListener('click', function () {
            _this.hideOptions();
        });
        this.dropdown = FluidSelect.createElement('div', {
            class: 'select__options hide'
        });
        this.element.appendChild(this.dropdown);
        var arrow = FluidSelect.createElement('span', {
            class: 'select__arrow'
        });
        this.element.appendChild(arrow);
        var resetBtn = FluidSelect.createElement('span', {
            class: 'select__reset'
        });
        this.element.appendChild(resetBtn);
        resetBtn.textContent = '×';
        resetBtn.addEventListener('click', function () {
            _this.setValue(null);
        });
        this.searchInput = FluidSelect.createElement('input', {
            class: 'select__input'
        });
        this.searchInput.addEventListener('click', function (event) {
            event.stopPropagation();
        });
        var inputContainer = FluidSelect.createElement('div', {
            class: 'select__input-container'
        });
        inputContainer.appendChild(this.searchInput);
        this.dropdown.appendChild(inputContainer);
        this.optionsContainer = FluidSelect.createElement('div', {
            class: 'select__options-container'
        });
        this.dropdown.appendChild(this.optionsContainer);
        var values = this.values;
        var _loop_1 = function (value) {
            var _a;
            var newDiv = FluidSelect.createElement('div', (_a = {},
                _a['class'] = 'select__option',
                _a), {
                click: function () {
                    _this.setValue(value);
                }
            });
            newDiv.textContent = values[value].label;
            this_1.optionsContainer.appendChild(newDiv);
        };
        var this_1 = this;
        for (var value in values) {
            _loop_1(value);
        }
    }
    FluidSelect.createElement = function (type, attributes, eventListeners) {
        var element = document.createElement(type);
        if (attributes) {
            for (var key in attributes) {
                element.setAttribute(key, attributes[key]);
            }
        }
        if (eventListeners) {
            for (var event_1 in eventListeners) {
                element.addEventListener(event_1, eventListeners[event_1]);
            }
        }
        return element;
    };
    FluidSelect.prototype.showOptions = function () {
        this.dropdown.classList.remove('hide');
    };
    FluidSelect.prototype.hideOptions = function () {
        this.dropdown.classList.add('hide');
    };
    FluidSelect.prototype.toggleOptions = function () {
        this.dropdown.classList.toggle('hide');
    };
    FluidSelect.prototype.setValue = function (value) {
        var oldVal = this.selectedValue;
        var newVal = value ? this.values[value] : null;
        if (oldVal === newVal)
            return;
        if (oldVal) {
            this.values[oldVal.value].selected = false;
        }
        if (value) {
            this.values[value].selected = true;
            this.displayContainer.textContent = this.values[value].label;
        }
        else {
            this.displayContainer.textContent = 'Choose a value';
        }
        this.selectedValue = newVal;
        for (var _i = 0, _a = this.selectListeners; _i < _a.length; _i++) {
            var cb = _a[_i];
            cb(newVal, oldVal);
        }
    };
    FluidSelect.prototype.onSelect = function (fn) {
        this.selectListeners.push(fn);
    };
    return FluidSelect;
}());
