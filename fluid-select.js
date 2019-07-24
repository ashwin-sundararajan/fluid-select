"use strict";
var FluidSelect = /** @class */ (function () {
    function FluidSelect(initValues) {
        var _a, _b, _c, _d, _e;
        var _this = this;
        this.values = {};
        this.selectedValue = null;
        this.selectListeners = [];
        initValues.forEach(function (option) {
            _this.values[option.value] = option;
        });
        this.element = FluidSelect.createElement('div', (_a = {},
            _a['class'] = 'select__container',
            _a.tabindex = '0',
            _a));
        this.displayContainer = FluidSelect.createElement('div', (_b = {},
            _b['class'] = 'select__display',
            _b));
        this.displayContainer.textContent = 'Choose a value';
        this.element.appendChild(this.displayContainer);
        this.optionContainer = FluidSelect.createElement('div', (_c = {},
            _c['class'] = 'select__options hide',
            _c));
        this.element.appendChild(this.optionContainer);
        this.element.addEventListener('click', function (event) {
            event.stopPropagation();
            _this.toggleOptions();
            _this.element.focus();
        });
        document.body.addEventListener('click', function () {
            _this.hideOptions();
        });
        this.searchInput = FluidSelect.createElement('input', (_d = {},
            _d['class'] = 'select__input',
            _d));
        this.searchInput.addEventListener('click', function (event) {
            event.stopPropagation();
        });
        var inputContainer = FluidSelect.createElement('div', (_e = {},
            _e['class'] = 'select__input-container',
            _e));
        inputContainer.appendChild(this.searchInput);
        this.optionContainer.appendChild(inputContainer);
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
            this_1.optionContainer.appendChild(newDiv);
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
        this.optionContainer.classList.remove('hide');
    };
    FluidSelect.prototype.hideOptions = function () {
        this.optionContainer.classList.add('hide');
    };
    FluidSelect.prototype.toggleOptions = function () {
        this.optionContainer.classList.toggle('hide');
    };
    FluidSelect.prototype.setValue = function (value) {
        var oldVal = this.selectedValue;
        var newVal = this.values[value];
        if (oldVal === newVal)
            return;
        if (oldVal) {
            this.values[oldVal.value].selected = false;
        }
        this.values[value].selected = true;
        this.selectedValue = newVal;
        this.displayContainer.textContent = this.selectedValue.label;
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
