//import React
import React from 'react';
import { Link, Redirect } from 'react-router-dom';


export class Details extends React.Component {
    constructor(props) {
        super(props);

        //TODO: get dog information with given id

        this.state = {
            id: this.props.match.params.id,
            isAdmin: parseInt(this.props.isAdmin)
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

    //prints the update and delete buttons if admin
    checkIfAdmin() {
        console.log("is user admin - " + this.state.isAdmin);
        if (this.state.isAdmin === 1) {
            console.log("user is admin!");
            return (<div>
                <Link to={"/dogs/update/" + this.state.id}><button className="btn btn-primary">Update</button></Link>
                <button className="btn btn-primary" onClick={() => this.handleDelete(this.state.id)}>Delete</button>
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
                <div>This is the details page</div>
                {this.checkIfAdmin()}
            </div>
        );
    }
}
