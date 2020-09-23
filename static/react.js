'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Button = function (_React$Component) {
    _inherits(Button, _React$Component);

    function Button(props) {
        _classCallCheck(this, Button);

        var _this = _possibleConstructorReturn(this, (Button.__proto__ || Object.getPrototypeOf(Button)).call(this, props));

        _this.state = { clicked: false, class: '', text: props.name };
        return _this;
    }

    _createClass(Button, [{
        key: 'handleClick',
        value: function handleClick(e) {
            if (this.props.toggleable) {
                console.log(this.state);
                if (this.state.clicked) {
                    this.setState({ clicked: false, class: '' }, function () {});
                    if (this.props.pressedText) {
                        setTimeout(function () {
                            this.setState({ text: this.props.pressedText }, function () {});
                        }.bind(this), 250);
                    }
                } else {
                    console.log('hello');
                    this.setState({ clicked: true, class: ' clicked' }, function () {});
                    if (this.props.pressedText) {
                        setTimeout(function () {
                            this.setState({ text: this.props.name }, function () {});
                        }.bind(this), 250);
                    }
                }
            } else {
                console.log(2);
                if (!this.state.clicked) {
                    this.setState({ clicked: true, class: ' clicked' }, function () {});
                    setTimeout(function () {
                        this.setState({ clicked: false, class: '' }, function () {});
                    }.bind(this), 750);
                }
            }
        }
    }, {
        key: 'render',
        value: function render() {
            console.log(this.state.text);
            if (this.props.class) {
                return React.createElement(
                    'button',
                    { className: this.props.class + this.state.class, onClick: this.handleClick.bind(this) },
                    this.state.text
                );
            } else {
                return React.createElement(
                    'button',
                    { className: this.state.class, onClick: this.handleClick.bind(this) },
                    this.state.text
                );
            }
        }
    }]);

    return Button;
}(React.Component);

var TextInput = function (_React$Component2) {
    _inherits(TextInput, _React$Component2);

    function TextInput(props) {
        _classCallCheck(this, TextInput);

        var _this2 = _possibleConstructorReturn(this, (TextInput.__proto__ || Object.getPrototypeOf(TextInput)).call(this, props));

        _this2.state = {};
        _this2.placeholder = React.createRef();
        _this2.input = React.createRef();
        return _this2;
    }

    _createClass(TextInput, [{
        key: 'handleChange',
        value: function handleChange(e) {
            if (e.target.value != '') {
                var moveover = (this.placeholder.current.offsetWidth - this.placeholder.current.offsetWidth / 2) / -2;
                console.log(moveover);
                this.placeholder.current.style.transform = "translate(" + moveover.toString() + "px, -1rem)  scale(0.5)";
                this.placeholder.current.style.color = '#a0aec0';
                console.log('moveup');
            } else if (e.target.value == '') {
                this.placeholder.current.style.transform = "translate(0, 0)  scale(1)";
                this.placeholder.current.style.color = '#4a5568';
                console.log('movedown');
            }
            this.setState({});
        }
    }, {
        key: 'render',
        value: function render() {
            try {
                if (this.input.current.value != '') {
                    var moveover = (this.placeholder.current.offsetWidth - this.placeholder.current.offsetWidth / 2) / -2;
                    console.log(moveover);
                    this.placeholder.current.style.transform = "translate(" + moveover.toString() + "px, -1rem) scale(0.5)";
                    this.placeholder.current.style.color = '#a0aec0';
                    console.log('moveup');
                } else if (e.target.value == '') {
                    this.placeholder.current.style.transform = "translate(0, 0) scale(1)";
                    this.placeholder.current.style.color = '#4a5568';
                    console.log('movedown');
                }
            } catch (e) {
                console.log(e);
            }

            return React.createElement(
                'div',
                { className: 'relative m-2 mt-4' },
                React.createElement('input', { ref: this.input, className: 'text w-full', type: 'text', id: this.props.id, onChange: this.handleChange.bind(this) }),
                React.createElement(
                    'span',
                    { ref: this.placeholder, className: 'textPlaceholder' },
                    this.props.placeholder
                )
            );
        }
    }]);

    return TextInput;
}(React.Component);