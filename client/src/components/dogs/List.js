import React from 'react';

import { Link } from 'react-router-dom';

//let tableHolder = <div>Loading...</div>;


export class List extends React.Component {

    //source https://dev.to/nburgess/creating-a-react-app-with-react-router-and-an-express-backend-33l3
    // Initialize the state
    constructor(props) {
        super(props);
        this.state = {
            isAdmin: parseInt(this.props.isAdmin),
            list: [],
            commandMessage: '',
            tableHolder: <div>Loading...</div>
        }
        this.handleDelete = this.handleDelete.bind(this);
        this.checkIfAdmin = this.checkIfAdmin.bind(this);
    }

    //prints the 
    checkIfAdmin() {
        console.log("is user admin - " + this.state.isAdmin);
        if (this.state.isAdmin === 1) {
            console.log("user is admin!");
            return <Link to={this.props.match.path + "/add"}><button className="btn btn-success">Add New Dog</button></Link>;
        }
        else return '';
    }

    //will call whenever new props are received
    componentDidUpdate(prevProps) {
        console.log("Dog List Page received new props!");
        // Typical usage (don't forget to compare props):
        if (this.props.isAdmin !== prevProps.isAdmin) {
            console.log("The new prop was different from the old one - new isAdmin: " + this.props.isAdmin)
            this.setState({ isAdmin: parseInt(this.props.isAdmin) });
        }
    }

    componentWillMount() {
        //checking if there are any command messages in the url params
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        if (urlParams.get('cmd') != null) {
            if (urlParams.get('cmd') === "added") {
                this.setState({ commandMessage: <div>Dog was successfully added! This should probably be put in the dog's details instead</div> });
            }
            if (urlParams.get('cmd') === "updated") {
                this.setState({ commandMessage: <div>Dog was successfully updated! This should probably be put in the dog's details instead</div> });
            }
        }
        //setting the table placeholder everytime the component loads
        this.setState({ tableHolder: <div>Loading...</div> });
    }

    // Fetch the list on first mount
    componentDidMount() {
        this.getList();
    }

    //deleting the command message when the page is changed
    componentWillUnmount() {
        this.setState({ commandMessage: "" });
    }

    //will delete 
    handleDelete(id) {
        //TODO: this should be put in details once that is done
        this.setState({ tableHolder: <div>Loading...</div> });
        console.log("deleting dog with id " + id);
        fetch("/api/dogs/delete/" + id, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' }
        }).then(function (response) {
            if (response.status >= 400) {
                this.setState({ commandMessage: <div>Database error - sorry!</div> });
                throw new Error("Bad response from server");
            }
            console.log(response);
        }).then(() => {
            console.log("successfully deleted dog with id: " + id);
            this.setState({ commandMessage: <div style={{ color: 'red' }}>Dog was successfully deleted.</div> });
            this.getList();
        })
            .catch(function (err) {
                console.log(err);
            });

    }


    getList = () => {
        //set timeout emulates the browser loading
        //setTimeout(() => {
        fetch('/api/dogs/list')
            .then(res => res.json())
            .then(list => this.setState({ list: list }))
            .then(() => {
                this.setState({
                    tableHolder: (
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Breed</th>
                                    <th>Gender</th>
                                    <th>Age</th>
                                    <th>Weight</th>
                                    <th>Color</th>
                                    <th>Update</th>
                                    <th>Delete</th>
                                </tr>
                            </thead>
                            <tbody>
                                {console.log(this.state.list)}
                                {/* Render the list of items */}
                                {this.state.list.map((item) => {
                                    console.log(item);
                                    return (
                                        <tr key={item.dogid}>
                                            <td>{item.dogid}</td>
                                            <td>{item.dogname}</td>
                                            <td>{item.dogbreed}</td>
                                            <td>{item.doggender}</td>
                                            <td>{item.dogage}</td>
                                            <td>{item.dogweight}</td>
                                            <td>{item.dogcolor}</td>
                                            <td><Link to={this.props.match.path + "/update/" + item.dogid}><button className="btn btn-primary">Update</button></Link></td>
                                            <td><button className="btn btn-primary" onClick={() => this.handleDelete(item.dogid)}>Delete</button></td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>)
                });
            });
        //}, 1000);
    }
    render() {

        return (
            <div>
                <h1>Dogs</h1>
                {this.state.commandMessage}
                <p>Here is a list of all the dogs in our system.</p>
                {this.checkIfAdmin()}

                {this.state.tableHolder}


            </div>
        );
    }
}