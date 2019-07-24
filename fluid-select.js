"use strict";
var FluidSelect = /** @class */ (function () {
    function FluidSelect(initValues) {
        var _a, _b, _c;
        var _this = this;
        this.values = {};
        this.selectedValue = null;
        initValues.forEach(function (option) {
            _this.values[option.value] = option;
        });
        this.element = FluidSelect.createElement('div', (_a = {},
            _a['class'] = 'select__container',
            _a));
        this.displayContainer = FluidSelect.createElement('div', (_b = {},
            _b['class'] = 'select__display',
            _b));
        this.displayContainer.textContent = 'Choose a value';
        this.element.appendChild(this.displayContainer);
        this.optionContainer = FluidSelect.createElement('div');
        this.element.appendChild(this.optionContainer);
        this.searchInput = FluidSelect.createElement('input', (_c = {},
            _c['class'] = 'select__input',
            _c));
        this.optionContainer.appendChild(this.searchInput);
        var values = this.values;
        var _loop_1 = function (value) {
            var _a;
            var newDiv = FluidSelect.createElement('div', (_a = {},
                _a['class'] = 'select__option',
                _a), {
                click: function () {
                    if (_this.selectedValue) {
                        values[_this.selectedValue.value].selected = false;
                    }
                    values[value].selected = true;
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
        return element;
    };
    FluidSelect.prototype.showOptions = function () {
        this.optionContainer.classList.remove('hide');
    };
    FluidSelect.prototype.hideOptions = function () {
        this.optionContainer.classList.add('hide');
    };
    FluidSelect.prototype.setValue = function (value) {
        this.selectedValue = this.values[value];
    };
    return FluidSelect;
}());
