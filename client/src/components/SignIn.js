import React from 'react';
import { Redirect } from 'react-router-dom';

//global variables

export class SignIn extends React.Component {
    constructor(props) {
        //setting the state of this SignIn component to have username and password variables, which are empty by default and change whenever the input values change
        //the proper way to handle forms in react is save every form element as a state variable, change the states on input change, and handle validation on a onSubmit function
        super(props);
        this.state = {
            username: '',
            password: '',
            redirectToHome: '',
            errorMessage: ''
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

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
            //setting the data being posted to the server
            let data = {
                username: this.state.username,
                password: this.state.password
            }
            console.log(data);

            this.setState({errorMessage: "Loading..."});
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
                if (result.length === 0) {
                    console.log("no username/password combo found");
                    this.setState({errorMessage: "Invalid username/password."});
                }
                else {
                    console.log("Username/password combo found!");
                    this.setState({errorMessage: "Welcome, " + result.username + "!"});
                    //TODO: store the jwt token and refresh tokens as cookies, store the result fields as state variables in MasterPage.js, then redirect to home
                    document.cookie = "username="+result.username+";max-age=2592000";
                    document.cookie = "jwtToken="+result.jwtToken+";max-age=2592000";
                    document.cookie = "refreshToken="+result.refreshToken+";max-age=2592000";
                    console.log("Cookie from sign in: "+document.cookie);
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
                {this.state.redirectToHome}
                <h1>Sign In</h1>
                <p id="loginError"></p>
                {/*noValidate allows you to automatically check if form fields are empty*/}
                <form action="" onSubmit={this.handleSubmit} noValidate>
                    <div style={{ color: "red" }} id="errorMessage">{this.state.errorMessage}</div>
                    <div>
                        <label htmlFor="username">Username: </label>
                        <input type="text" name="username" id="username" value={this.state.username} onChange={this.handleChange} required />
                        <span id="usernameError"></span>
                    </div>
                    <div>
                        <label htmlFor="password">Password: </label>
                        <input type="password" name="password" id="password" onChange={this.handleChange} required></input>
                        <span id="passwordError"></span>
                    </div>
                    <button type="submit">Sign In</button>
                </form>
            </div>
        );
    }
}