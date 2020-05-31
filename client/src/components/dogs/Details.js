//import React
import React from 'react';
import { Link, Redirect } from 'react-router-dom';


export class Details extends React.Component {
    constructor(props) {
        super(props);

        //TODO: get dog information with given id

        this.state = {
            id: this.props.match.params.id,
            isAdmin: parseInt(this.props.isAdmin),
            pageContent: <div>Loading...</div>,
            name: '',
            breed: '',
            gender: 'Male',
            age: '',
            weight: '',
            color: '',
            description: '',
            location: '',
            //imageref: ''
            imageSource: '/images/default.jpg'
        }
    }

    componentDidUpdate(prevProps) {
        console.log("Dog List Page received new props!");
        // Typical usage (don't forget to compare props):
        if (this.props.isAdmin !== prevProps.isAdmin) {
            console.log("The new prop was different from the old one - new isAdmin: " + this.props.isAdmin)
            this.setState({ isAdmin: parseInt(this.props.isAdmin) });
        }
    }

    componentDidMount() {
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
                    this.setState({
                        name: result[0].dogname,
                        breed: result[0].dogbreed,
                        gender: result[0].doggender,
                        age: result[0].dogage,
                        weight: result[0].dogweight,
                        color: result[0].dogcolor,
                        description: result[0].dogdescription,
                        location: result[0].doglocation
                    });
                    if (result[0].dogimageref !== null && result[0].dogimageref !== "") {
                        //if the dog has a reference image, use it
                        console.log("dog image ref found - " + result[0].dogimageref);
                        this.setState({ imageSource: '/images/' + result[0].dogimageref });
                    }
                    //setting the content of the page
                    //TODO: print image
                    this.setState({
                        pageContent: (
                            <div>
                                <div>
                                    <img src={this.state.imageSource} alt="dog profile picture" />
                                </div>
                                <div><strong>Name: </strong>{this.state.name}</div>
                                <div><strong>Location: </strong>{this.state.location}</div>
                                <div><strong>Breed: </strong>{this.state.breed}</div>
                                <div><strong>Age: </strong>{this.state.age}</div>
                                <div><strong>Weight (lbs): </strong>{this.state.weight}</div>
                                <div><strong>Color: </strong>{this.state.color}</div>
                                <br />
                                <div>{this.state.description}</div>

                                {this.checkIfAdmin()}
                            </div>
                        )
                    })
                }
            }).catch(function (err) {
                console.log(err);
            });
    }

    //prints the update and delete buttons if admin
    checkIfAdmin() {
        console.log("is user admin - " + this.state.isAdmin);
        if (this.state.isAdmin === 1) {
            console.log("user is admin!");
            return (<div>
                <Link to={"/dogs/update/" + this.state.id}><button className="btn btn-warning">Update</button></Link>
                <Link to={"/dogs/changeimage/" + this.state.id}><button className="btn btn-info">Change Image</button></Link>
                <button className="btn btn-danger" onClick={() => this.handleDelete(this.state.id)}>Delete</button>
            </div>);
        }
        else return '';
    }

    //TODO: get jwt token from props
    //move delete fuction from List to here
    //create a delete confirm modal window

    render() {
        return (
            <div>
                <Link to="/dogs"><button className="btn btn-sm btn-light">Go Back</button></Link>
                <h2>Details</h2>
                {this.state.pageContent}

            </div>
        );
    }
}
