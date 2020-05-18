import React from 'react';
import { Redirect, Link } from 'react-router-dom';

let errorMessage = "";

export class Update extends React.Component {
    constructor(props) {
        //setting the state of this SignIn component to have username and password variables, which are empty by default and change whenever the input values change
        //the proper way to handle forms in react is save every form element as a state variable, change the states on input change, and handle validation on a onSubmit function
        super(props);
        this.state = {
            id: '',
            name: '',
            breed: '',
            gender: 'Male',
            age: '',
            weight: '',
            color: '',
            //imageref: '',
            redirectToList: false,
            errorMessage: errorMessage,
            pageContent: (<div>
                <h1>Update Dog</h1>
                <p>Loading...</p>
            </div>
            ),
            loadForm: false,
            validId: true,
            maleCheck: "",
            femaleCheck: ""
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.successMessage = this.successMessage.bind(this);
        this.failureMessage = this.failureMessage.bind(this);

    }

    //check if a valid id is present before loading page
    componentWillMount() {
        const queryString = window.location.pathname;
        var id = queryString.substring(queryString.lastIndexOf('/') + 1);

        //if invalid id, redirect to the page
        if (id === null || isNaN(id) || id === 0) {
            this.setState({
                validId: false,
                pageContent: (<div>
                    <Redirect to='/dogs' />
                    <h1>Update Dog</h1>
                    <p>Sorry! Invalid ID</p>
                </div>
                )
            });
            //redirect to list if page is invalid
            return;
        }
        this.setState({
            id: id,
            pageContent: (<div>
                <h1>Update Dog</h1>
                <p>Loading...</p>
            </div>
            )
        });
    }

    //grab the entry with the given id from the database after the 
    componentDidMount() {
        if (this.state.validId !== true) {
            //dont bother loading the form if the id is invalid
            return;
        }
        //grab the id's content and set the state
        fetch('/api/dogs/' + this.state.id)
            .then(res =>
                res.json()
            )
            .then((result) => {
                //if an empty object was returned
                if (typeof result[0] == "undefined") {
                    console.log("result is null")
                    this.setState({
                        pageContent: <div>
                            <p>No entry with that ID found!</p>
                            <Link to=""><p>Home</p></Link>
                        </div>
                    });
                }
                else {

                    console.log(result[0]);
                    this.setState({
                        name: result[0].dogname,
                        breed: result[0].dogbreed,
                        gender: result[0].doggender,
                        age: result[0].dogage,
                        weight: result[0].dogweight,
                        color: result[0].dogcolor,
                        loadForm: true
                    });
                    console.log(this.state.name);
                    if (this.state.gender === "Male") {
                        //TODO: fix this system for the check because you need to click it twice to actually change
                        this.setState({
                            maleCheck: <input type="radio" id="male" name="gender" value="Male" onChange={this.handleChange} checked />,
                            femaleCheck: <input type="radio" id="female" name="gender" onChange={this.handleChange} value="Female" />
                        });

                    }
                    else {
                        this.setState({
                            maleCheck: <input type="radio" id="male" name="gender" value="Male" onChange={this.handleChange} />,
                            femaleCheck: <input type="radio" id="female" name="gender" onChange={this.handleChange} value="Female" checked />
                        });
                    }
                }

            });

        this.setState({
            pageContent: ''
        });
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
                id: this.state.id,
                name: this.state.name,
                breed: this.state.breed,
                gender: this.state.gender,
                age: this.state.age,
                weight: this.state.weight,
                color: this.state.color
            }
            console.log(data)
            fetch("/api/dogs/update/" + this.state.id, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            }).then(function (response) {
                if (response.status >= 400) {
                    throw new Error("Bad response from server");
                    //TODO: redirect to an error page - currently still says it submits successfully on the front end
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
            return <Redirect to='/dogs?cmd=updated' />
        }
        if (this.state.loadForm === true) {
            return (<div>
                <h2>Update Dog</h2>
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
                        {this.state.maleCheck}
                        <label htmlFor="male">Male</label><br />
                        {this.state.femaleCheck}
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
                    <button type="submit">Update Dog</button>
                </form>
                <Link to="/dogs">Cancel</Link>

            </div>);
        }
        else return (
            <div>{this.state.pageContent}</div>
        );
    };
}