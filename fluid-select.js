"use strict";
var fluid;
(function (fluid) {
    var Helpers = /** @class */ (function () {
        function Helpers() {
        }
        Helpers.createElement = function (type, attributes, eventListeners) {
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
        Helpers.findOption = function (options, value) {
            if (!value)
                return null;
            for (var _i = 0, options_1 = options; _i < options_1.length; _i++) {
                var option = options_1[_i];
                if (option.value === value) {
                    return option;
                }
            }
            return null;
        };
        Helpers.emptyElement = function (el) {
            while (el.firstChild) {
                el.removeChild(el.firstChild);
            }
        };
        return Helpers;
    }());
    var FluidSelect = /** @class */ (function () {
        function FluidSelect(values) {
            var _this = this;
            this.values = values;
            this.selectedValue = null;
            this.selectListeners = [];
            this.element = Helpers.createElement('div', {
                class: 'select__container',
                tabindex: '0'
            });
            this.displayContainer = Helpers.createElement('div', {
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
            this.dropdown = Helpers.createElement('div', {
                class: 'select__options hide'
            });
            this.element.appendChild(this.dropdown);
            var arrow = Helpers.createElement('span', {
                class: 'select__arrow'
            });
            this.element.appendChild(arrow);
            var resetBtn = Helpers.createElement('span', {
                class: 'select__reset'
            });
            this.element.appendChild(resetBtn);
            resetBtn.textContent = '×';
            resetBtn.addEventListener('click', function () {
                _this.setSelectedValue(null);
            });
            this.searchInput = Helpers.createElement('input', {
                class: 'select__input'
            });
            this.searchInput.addEventListener('click', function (event) {
                event.stopPropagation();
            });
            var inputContainer = Helpers.createElement('div', {
                class: 'select__input-container'
            });
            inputContainer.appendChild(this.searchInput);
            this.dropdown.appendChild(inputContainer);
            this.optionsContainer = Helpers.createElement('div', {
                class: 'select__options-container'
            });
            this.dropdown.appendChild(this.optionsContainer);
            this.setOptions(this.values);
        }
        FluidSelect.prototype.setOptions = function (options) {
            var _this = this;
            Helpers.emptyElement(this.optionsContainer);
            var _loop_1 = function (option) {
                var _a;
                var newDiv = Helpers.createElement('div', (_a = {},
                    _a['class'] = 'select__option',
                    _a), {
                    click: function () {
                        _this.setSelectedValue(option.value);
                    }
                });
                newDiv.textContent = option.label;
                this_1.optionsContainer.appendChild(newDiv);
            };
            var this_1 = this;
            for (var _i = 0, options_2 = options; _i < options_2.length; _i++) {
                var option = options_2[_i];
                _loop_1(option);
            }
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
        FluidSelect.prototype.setSelectedValue = function (value) {
            var oldVal = this.selectedValue;
            var newVal = Helpers.findOption(this.values, value);
            if (oldVal === value)
                return;
            if (oldVal) {
                oldVal.selected = false;
            }
            if (newVal) {
                newVal.selected = true;
                this.displayContainer.textContent = newVal.label;
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
    fluid.FluidSelect = FluidSelect;
})(fluid || (fluid = {}));
