import React from 'react';
import { Redirect, Link } from 'react-router-dom';

let errorMessage = "";

export class Add extends React.Component {
    constructor(props) {
        //setting the state of this SignIn component to have username and password variables, which are empty by default and change whenever the input values change
        //the proper way to handle forms in react is save every form element as a state variable, change the states on input change, and handle validation on a onSubmit function
        super(props);
        this.state = {
            name: '',
            breed: '',
            gender: 'Male',
            age: '',
            weight: '',
            color: '',
            //imageref: '',
            redirectToList: false,
            errorMessage: errorMessage
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.successMessage = this.successMessage.bind(this);
        this.failureMessage = this.failureMessage.bind(this);

    }

    handleChange(e) {
        const value = e.target.value;
        const name = e.target.name;

        this.setState({
            [name]: value
        });
    }
    //called when data is successfully added to the database
    successMessage(data) {
        console.log(data);
        this.setState({ errorMessage: "Successfully added to the database", redirectToList: true });
        if (data === "success") {
            console.log("data successfully sent to server");
        }
    }
    //called when there is an error adding data to the database
    failureMessage(err) {
        console.log("Error adding to the database");
        this.setState({ errorMessage: "Error adding to the database - sorry!" });
        console.log(err);
    }

    handleSubmit(e) {
        e.preventDefault();

        if (!e.target.checkValidity()) {
            //form is not valid, required fields are empty
            console.log("form invalid");
            this.setState({ errorMessage: "*Please fill all fields" });

            return;

        }
        else {
            console.log("form valid!");
            console.log(this.state);
            //source https://medium.com/@avanthikameenakshi/crud-react-express-99025f03f06e
            let data = {
                name: this.state.name,
                breed: this.state.breed,
                gender: this.state.gender,
                age: this.state.age,
                weight: this.state.weight,
                color: this.state.color
            }
            console.log(data)
            fetch("/api/dogs/add", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            }).then(function (response) {
                if (response.status >= 400) {
                    throw new Error("Bad response from server");
                }
                console.log(response);
            }).then(this.successMessage(data))
                .catch(function (err) {
                    console.log(err);
                });
        }
    }


    render() {
        if (this.state.redirectToList === true) {
            return <Redirect to='/dogs?cmd=added' />
        }
        return (
            <div>
                <h2>Add New Dog</h2>
                <form action="" onSubmit={this.handleSubmit} noValidate>
                    <div style={{ color: "red" }} id="errorMessage">{this.state.errorMessage}</div>
                    <div>
                        <label htmlFor="name">Name: </label>
                        <input type="text" name="name" id="name" value={this.state.name} onChange={this.handleChange} required />
                        <span id="nameError"></span>
                    </div>
                    <div>File upload will go here</div>
                    <div>
                        <label htmlFor="breed">Breed: </label>
                        <input type="text" name="breed" id="breed" value={this.state.breed} onChange={this.handleChange} required />
                        <span id="breedError"></span>
                    </div>
                    <div>
                        <label htmlFor="gender">Gender: </label> <br />
                        <input type="radio" id="male" name="gender" value="Male" onChange={this.handleChange} checked />
                        <label htmlFor="male">Male</label><br />
                        <input type="radio" id="female" name="gender" onChange={this.handleChange} value="Female" />
                        <label htmlFor="female">Female</label><br />
                        <span id="nameError"></span>
                    </div>
                    <div>
                        <label htmlFor="age">Age: </label>
                        <input type="number" name="age" id="age" value={this.state.age} onChange={this.handleChange} required />
                        <span id="ageError"></span>
                    </div>
                    <div>
                        <label htmlFor="weight">Weight: </label>
                        <input type="number" name="weight" id="weight" step="0.01" value={this.state.weight} onChange={this.handleChange} required />
                        <span id="weightError"></span>
                    </div>
                    <div>
                        <label htmlFor="color">Color: </label>
                        <input type="text" name="color" id="color" value={this.state.color} onChange={this.handleChange} required />
                        <span id="colorError"></span>
                    </div>
                    <button type="submit">Add Dog</button>
                </form>
                <Link to="/dogs">Cancel</Link>

            </div>
        );
    };
}