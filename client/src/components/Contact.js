import React from 'react';
import { Link } from 'react-router-dom';

export class Contact extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            subject: '',
            message: ''
        }

        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(e) {
        const value = e.target.value;
        const name = e.target.name;

        this.setState({
            [name]: value
        });
    }

    render() {
        return (
            <div>
                <h1>Contact Us</h1>
                <p>If you are a shelter representative or private dog fosterer and want to get in contact with us, please fill out the form below. Any other questions or concerns are also
                welcome. One of our team members will get back to you as soon as possible!
                </p>
                <p><em>Note: this form is for demonstration purposes only, and messages will not be sent or read by anyone. For more information, see the <Link to="/">About Us</Link> page.</em></p>
                <div className="dog-form">
                    <div className="form-group">
                        <label htmlFor="email">Your Email Adress: <span className="text-danger">*</span> </label>
                        <input className="form-control" type="text" name="email" id="email" value={this.state.email} onChange={this.handleChange} required />
                        <span id="emailError"></span>
                    </div>
                    <div className="form-group">
                        <label htmlFor="subject">Subject: <span className="text-danger">*</span></label>
                        <input className="form-control" type="text" name="subject" id="subject" value={this.state.subject} onChange={this.handleChange} required />
                        <span id="subjectError"></span>
                    </div>
                    <div className="form-group">
                        <label htmlFor="message">Message: <span className="text-danger">*</span></label>
                        <textarea className="form-control" name="message" id="message" onChange={this.handleChange} rows="4" value={this.state.message}></textarea>
                        <span id="descriptionError"></span>
                    </div>

                    <Link to="/"><button className="btn btn-primary float-right" type="submit">Send</button></Link>

                </div>
            </div>
        );
    }
}