import React, { Component } from 'react';

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            roomValue: ''
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({ roomValue: event.target.value });
    }

    handleSubmit(event) {
        this.props.onRoom(this.state.roomValue);
        event.preventDefault();
    }

    render() {
        return (
            <div className="Login">
                <h3>Choose or create a room</h3>
                <form onSubmit={this.handleSubmit}>
                    <label>
                        Room name:
                        <input type="text" value={this.state.roomValue} onChange={this.handleChange} />
                        <input type="submit" value="Submit" />
                    </label>
                </form>
            </div>
        );
    }
}

export default Login;
