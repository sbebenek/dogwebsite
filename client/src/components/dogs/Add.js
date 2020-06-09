import React from 'react';
import { Redirect, Link } from 'react-router-dom';

let errorMessage = "";

export class Add extends React.Component {
    constructor(props) {
        //setting the state of this SignIn component to have username and password variables, which are empty by default and change whenever the input values change
        //the proper way to handle forms in react is save every form element as a state variable, change the states on input change, and handle validation on a onSubmit function
        super(props);
        this.state = {
            userIsAdmin: parseInt(this.props.isAdmin),
            name: '',
            breed: '',
            gender: 'Male',
            age: '',
            weight: '',
            color: '',
            description: '',
            location: '',
            //imageref: '',
            redirectToDetails: '',
            redirectToLogin: false,
            errorMessage: errorMessage
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.successMessage = this.successMessage.bind(this);
        this.failureMessage = this.failureMessage.bind(this);

    }

    //check if an admin is signed in on page load
    checkIfSignedIn() {
        if (this.state.userIsAdmin === 0) {
            //redirect if admin isnt signed in
            this.setState({ redirectToList: true });
        }
    }

    //will call whenever new props are received
    componentDidUpdate(prevProps) {
        console.log("Add Page received new props!");
        // Typical usage (don't forget to compare props):
        if (this.props.isAdmin !== prevProps.isAdmin) {
            console.log("The new prop was different from the old one - new isAdmin: " + this.props.username)
            this.setState({ userIsAdmin: parseInt(this.props.isAdmin) });
        }
    }

    handleChange(e) {
        const value = e.target.value;
        const name = e.target.name;

        this.setState({
            [name]: value
        });
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
                color: this.state.color,
                description: this.state.description,
                location: this.state.location
            }
            console.log("sending this data to the server...");
            console.log(data)
            fetch("/api/dogs/add", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + this.props.jwtToken
                },
                body: JSON.stringify(data)
            }).then(function (response) {
                if (response.status === 403) {
                    //token is expired, sign out and redirect to login form
                    console.log("403 - resquest sent with an expired token");
                    this.props.signOut();
                    this.setState({redirectToLogin: true});
                    throw new Error("Bad response from server: token expired");
                }
                if (response.status >= 400) {
                    throw new Error("Bad response from server");
                }
                console.log("printing server response...");
                console.log(response);
                console.log(response.body);
                return response.json();
            }).then(data => this.successMessage(data))
                .catch(function (err) {
                    console.log(err);
                });
        }
    }

     //called when data is successfully added to the database
     successMessage(data) {
        console.log("printing parsed data...");
        console.log(data);
        console.log("Dog successfully added to database");
        //TODO: redirect to this dogs details page
        this.setState({ errorMessage: "Successfully added to the database", redirectToDetails: <Redirect to={"/dogs/details/"+ data.id + "?cmd=added"} /> });

    }


    render() {
        if(this.state.redirectToLogin === true) {
            return <Redirect to='/signin' />
        }

        
        { this.checkIfSignedIn() }
        return (
            <div>
                {this.state.redirectToDetails}
                <h2>Add New Dog</h2>
                <form action="" onSubmit={this.handleSubmit} noValidate>
                    <div style={{ color: "red" }} id="errorMessage">{this.state.errorMessage}</div>
                    <div className="form-group">
                        <label htmlFor="name">Name: </label>
                        <input className="form-control" type="text" name="name" id="name" value={this.state.name} onChange={this.handleChange} required />
                        <span id="nameError"></span>
                    </div>
                    <div className="form-group">
                        <label htmlFor="breed">Breed: </label>
                        <input className="form-control" type="text" name="breed" id="breed" value={this.state.breed} onChange={this.handleChange} required />
                        <span id="breedError"></span>
                    </div>
                    <div className="form-group">

                        <label htmlFor="gender">Gender: </label> <br />
                        <div className="form-check">
                            <input className="form-check-input" type="radio" id="male" name="gender" value="Male" onChange={this.handleChange} checked />
                            <label className="form-check-label" htmlFor="male">Male</label>
                        </div>
                        <div className="form-check">
                            <input className="form-check-input" type="radio" id="female" name="gender" onChange={this.handleChange} value="Female" />
                            <label className="form-check-label" htmlFor="female">Female</label><br />
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="age">Age: </label>
                        <input className="form-control" type="number" name="age" id="age" value={this.state.age} onChange={this.handleChange} required />
                        <span id="ageError"></span>
                    </div>
                    <div className="form-group">
                        <label htmlFor="weight">Weight(lbs): </label>
                        <input className="form-control" type="number" name="weight" id="weight" step="0.01" value={this.state.weight} onChange={this.handleChange} required />
                        <span id="weightError"></span>
                    </div>
                    <div className="form-group">
                        <label htmlFor="color">Color: </label>
                        <input className="form-control" type="text" name="color" id="color" value={this.state.color} onChange={this.handleChange} required />
                        <span id="colorError"></span>
                    </div>
                    <div className="form-group">
                        <label htmlFor="location">Location: </label>
                        <input className="form-control" type="text" name="location" id="location" value={this.state.location} onChange={this.handleChange} required />
                        <span id="locationError"></span>
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">Description: </label>
                        <textarea className="form-control" name="description" id="description" onChange={this.handleChange} rows="4" value={this.state.description}></textarea>
                        <span id="descriptionError"></span>
                    </div>
                    <Link to="/dogs"><button className="btn btn-light" type="submit">Cancel</button></Link>
                    <button className="btn btn-primary" type="submit">Add Dog</button>
                </form>

            </div >
        );
    };
}