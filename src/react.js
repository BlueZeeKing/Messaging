class Button extends React.Component {
    constructor(props) {
        super(props)
        this.state = { clicked: false, class: '', text: props.name }
    }

    handleClick(e) {
        if (this.props.toggleable) {
            console.log(this.state)
            if (this.state.clicked) {
                this.setState({ clicked: false, class: '' }, () => { })
                if (this.props.pressedText) {
                    setTimeout(function () {
                        this.setState({ text: this.props.pressedText }, () => { })
                    }.bind(this), 250)
                }
            } else {
                console.log('hello')
                this.setState({ clicked: true, class: ' clicked' }, () => { })
                if (this.props.pressedText) {
                    setTimeout(function () {
                        this.setState({ text: this.props.name }, () => { })
                    }.bind(this), 250)
                }
            }
        } else {
            console.log(2)
            if (!this.state.clicked) {
                this.setState({ clicked: true, class: ' clicked' }, () => { })
                setTimeout(function () {
                    this.setState({ clicked: false, class: '' }, () => { })
                }.bind(this), 750)
            }
        }
    }

    render() {
        console.log(this.state.text)
        if (this.props.class) {
            return (
                <button className={this.props.class + this.state.class} onClick={this.handleClick.bind(this)}>{this.state.text}</button>
            )
        } else {
            return (
                <button className={this.state.class} onClick={this.handleClick.bind(this)}>{this.state.text}</button>
            )
        }
    }
}

class TextInput extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.placeholder = React.createRef();
        this.input = React.createRef();
    }

    handleChange(e) {
        if (e.target.value != '') {
            let moveover = (this.placeholder.current.offsetWidth - (this.placeholder.current.offsetWidth / 2)) / -2
            console.log(moveover)
            this.placeholder.current.style.transform = "translate("+moveover.toString()+"px, -1rem)  scale(0.5)"
            this.placeholder.current.style.color = '#a0aec0'
            console.log('moveup')
        } else if (e.target.value == '') {
            this.placeholder.current.style.transform = "translate(0, 0)  scale(1)"
            this.placeholder.current.style.color = '#4a5568'
            console.log('movedown')
        }
        this.setState({})
    }

    render() {
        try {
            if (this.input.current.value != '') {
                let moveover = (this.placeholder.current.offsetWidth - (this.placeholder.current.offsetWidth / 2)) / -2
                console.log(moveover)
                this.placeholder.current.style.transform = "translate("+moveover.toString()+"px, -1rem) scale(0.5)"
                this.placeholder.current.style.color = '#a0aec0'
                console.log('moveup')
            } else if (e.target.value == '') {
                this.placeholder.current.style.transform = "translate(0, 0) scale(1)"
                this.placeholder.current.style.color = '#4a5568'
                console.log('movedown')
            }
        } catch (e) { console.log(e) }

        return (
            <div className="relative m-2 mt-4">
                <input ref={this.input} className='text w-full' type="text" id={this.props.id} onChange={this.handleChange.bind(this)} />
                <span ref={this.placeholder} className='textPlaceholder'>{this.props.placeholder}</span>
            </div>
        );
    }
}