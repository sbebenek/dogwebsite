//import React
import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import Modal from "react-bootstrap/Modal";


export class Details extends React.Component {
    constructor(props) {
        super(props);


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
            imageSource: '/images/default.jpg',
            show: false, //whether or not the modal is showing
            deleteButtonHolder: '',
            redirectHolder: '',

            commandPanel: '' //stores the html for the panel that confirms if something was just added or updated
        }

        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleDelete = this.handleDelete.bind(this);

    }

    componentWillMount() {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        if (urlParams.get('cmd') != null) {
            if (urlParams.get('cmd') === "added") {
                this.setState({ commandPanel: <div className="alert alert-success" role="alert">Dog was successfully added!</div> });
            }
            if (urlParams.get('cmd') === "updated") {
                this.setState({ commandPanel: <div className="alert alert-info" role="alert">Dog was successfully updated!</div> });
            }
        }
    }

    componentDidUpdate(prevProps) {
        console.log("Dog Details Page received new props!");
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
                    this.setState({
                        pageContent: (
                            <div>
                                <div>
                                    <img src={this.state.imageSource} alt="dog profile picture" />
                                </div>
                                <div><strong>Name: </strong>{this.state.name}</div>
                                <div><strong>Gender: </strong>{this.state.gender}</div>
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
            this.setState({deleteButtonHolder: <button className="btn btn-danger" onClick={() => {this.handleDelete(this.state.id)}}>
            Delete
        </button>});
            return (<div>
                <Link to={"/dogs/update/" + this.state.id}><button className="btn btn-warning">Update</button></Link>
                <Link to={"/dogs/changeimage/" + this.state.id}><button className="btn btn-info">Change Image</button></Link>
                <button className="btn btn-danger" onClick={this.handleShow}>Delete</button>

                

            </div>);
        }
        else return '';
    }

    
    handleDelete(id) {
        //TODO: this should be put in details once that is done
        this.setState({ tableHolder: <div>Loading...</div> });
        console.log("deleting dog with id " + id);
        fetch("/api/dogs/delete/" + id, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.props.jwtToken
            }
        }).then(function (response) {
            if (response.status === 403) {
                //token is expired, sign out and redirect to login form
                this.props.signOut();
                this.setState({ redirectToLogin: true });
                throw new Error("Bad response from server: token expired");
            }
            if (response.status >= 400) {
                this.setState({ commandMessage: <div>Database error - sorry!</div> });
                throw new Error("Bad response from server");
            }
            console.log(response);
        }).then(() => {
            console.log("successfully deleted dog with id: " + id);
            this.setState({ redirectHolder: <Redirect to={"/dogs?cmd=deleted"} /> });
            this.getList();
        })
            .catch(function (err) {
                console.log(err);
            });

    }

    //MODAL METHODS
    handleClose() {
        console.log("hiding modal...");
        this.setState({ show: false });
    }

    handleShow() {
        console.log("showing modal...");
        this.setState({ show: true });
    }

    render() {
        return (
            <div>
                {this.state.redirectHolder}
                <Link to="/dogs"><button className="btn btn-sm btn-light">Go Back</button></Link>
                {this.state.commandPanel}
                <h2>Details</h2>
                {this.state.pageContent}
                {/*<!-- Modal --> https://bit.dev/react-bootstrap/react-bootstrap/modal*/}
                <Modal show={this.state.show} onHide={this.handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title></Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Are you sure you want to delete this Dog from the database?</Modal.Body>
                    <Modal.Footer>
                        <button className="btn btn-light" onClick={this.handleClose}>
                            Close
                        </button>
                        {this.state.deleteButtonHolder}
                    </Modal.Footer>
                </Modal>

            </div>
        );
    }
}
