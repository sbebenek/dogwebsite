import React from 'react';
import { Redirect } from 'react-router-dom';
const bcrypt = require('bcryptjs');

//global variables

export class SignIn extends React.Component {
    constructor(props) {
        //setting the state of this SignIn component to have username and password variables, which are empty by default and change whenever the input values change
        //the proper way to handle forms in react is save every form element as a state variable, change the states on input change, and handle validation on a onSubmit function
        super(props);
        this.state = {
            signedInUsername: this.props.username,
            username: '',
            password: '',
            redirectToHome: '',
            errorMessage: ''
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.checkIfSignedIn = this.checkIfSignedIn.bind(this);

    }

    //if a user is signed in, signedInUsername will not be null
    checkIfSignedIn() {
        if (this.state.signedInUsername !== null) {
            this.setState({ redirectToHome: <Redirect to='/' /> });
        }
    }

    //will call whenever new props are received
    componentDidUpdate(prevProps) {
        console.log("SignIn Page received new props!");
        // Typical usage (don't forget to compare props):
        if (this.props.username !== prevProps.username) {
            console.log("The new prop was different from the old one - new username: " + this.props.username)
            this.setState({ signedInUsername: this.props.username });
        }
    }

    handleChange(e) {
        const value = e.target.value;
        const name = e.target.name;

        this.setState({
            [name]: value
        });
    }

    /**
     * Handles form submission and front end validation. Should also do back end validation
     */
    handleSubmit(e) {
        e.preventDefault();

        if (!e.target.checkValidity()) {
            //form is not valid, required fields are empty
            console.log("form invalid");
            this.setState({ errorMessage: "*Username/password required" });
            document.getElementById("errorMessage").innerHTML = "*Username/password required";
            return;

        }
        else {
            console.log("form valid!");

            //Bcrypt states that best hashing password is sending password over with SSL and hashing there
            /*let hashedPassword = bcrypt.hash(this.state.password, 8)
            console.log(hashedPassword);*/

            //setting the data being posted to the server
            let data = {
                username: this.state.username,
                password: this.state.password
            }
            //console.log(data);

            this.setState({ errorMessage: "Loading..." });
            fetch("/api/accounts/signin", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            }).then(function (response) {
                if (response.status >= 400) {
                    throw new Error("Bad response from server");
                }
                //important below - converts the response to a readable JSON object
                return response.json();
            }).then((result) => {
                console.log(result);
                if(result === null) {
                    //not the best way to do 2 if statements that do the same thing
                    console.log("no username/password combo found");
                    this.setState({ errorMessage: "Invalid username/password." });
                }
                else if (result.length === 0) {
                    console.log("no username/password combo found");
                    this.setState({ errorMessage: "Invalid username/password." });
                }
                else {
                    console.log("Username/password combo found!");
                    console.log("Result: " + result)
                    this.setState({ errorMessage: "Welcome, " + result.username + "!" });
                    document.cookie = "username=" + result.username + ";max-age=3600"; //cookie expires in one hour
                    document.cookie = "isadmin=" + result.isadmin + ";max-age=3600";
                    document.cookie = "jwtToken=" + result.jwtToken + ";max-age=3600";
                    document.cookie = "refreshToken=" + result.refreshToken + ";max-age=3600";
                    console.log("Cookie from sign in: " + document.cookie);
                    this.props.signin();
                    this.setState({ redirectToHome: <Redirect to='/' /> });
                }
            }).catch(function (err) {
                console.log(err);
            });
        }

    }

    render() {

        return (
            <div>
                {this.checkIfSignedIn()}
                {this.state.redirectToHome}
                <h1>Sign In</h1>
                <p id="loginError"></p>
                {/*noValidate allows you to automatically check if form fields are empty*/}
                <form className="dog-form" action="" onSubmit={this.handleSubmit} noValidate>
                    <div style={{ color: "red" }} id="errorMessage">{this.state.errorMessage}</div>
                    <div className="form-group">
                        <label htmlFor="username">Username: </label>
                        <input className="form-control" type="text" name="username" id="username" value={this.state.username} onChange={this.handleChange} required />
                        <span id="usernameError"></span>
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password: </label>
                        <input className="form-control" type="password" name="password" id="password" onChange={this.handleChange} required></input>
                        <span id="passwordError"></span>
                    </div>
                    <button className="btn btn-primary" type="submit">Sign In</button>
                </form>
            </div>
        );
    }
}