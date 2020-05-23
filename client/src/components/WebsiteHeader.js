import React from 'react';
//import the react routing functionality - source: https://reacttraining.com/react-router/web/guides/quick-start
import { Link, Redirect } from 'react-router-dom';

export class WebsiteHeader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: this.props.username,
            redirectHome: '',
            signInHolder: <Link to="/signin"><button className="btn btn-outline-light my-2 my-sm-0">Sign In</button></Link>
        }
        this.updateSignInButtonArea = this.updateSignInButtonArea.bind(this);

    }


    componentDidMount() {
        console.log("header did mount - username: " + this.state.username);
        this.updateSignInButtonArea(this.props.username);

    }

    //will call whenever new props are received
    componentDidUpdate(prevProps) {
        console.log("WebsiteHeader received new props!");
        // Typical usage (don't forget to compare props):
        if (this.props.username !== prevProps.username) {
            console.log("The new prop was different from the old one - new username: " + this.props.username)
            this.setState({ username: this.props.username });
            this.updateSignInButtonArea(this.props.username);
        }
    }

    updateSignInButtonArea(newUsername) {
        console.log("drawing sign in button area based on state...")
        //if the username prop is empty, then no one is logged in - display sign in button 
        if (newUsername === null) {
            console.log("username is null. drawing sign in button...");
            this.setState({ signInHolder: <Link to="/signin"><button className="btn btn-outline-light my-2 my-sm-0">Sign In</button></Link> });
        }
        else {
            console.log("username is not null. drawing sign out button...");
            //TODO: set the username to be a dropdown menu instead of having the sign out button
            this.setState({
                signInHolder: (
                    <div className="form-inline">
                        <p className="nav-link custom-nav-item my-auto">{newUsername}</p>
                        <button onClick={this.props.signout} className="btn btn-outline-light my-2 my-sm-0 btn-sm">Sign Out</button>
                    </div>
                )
            });
        }
    }


    render() {
        return (
            <header>
                <nav className="navbar navbar-expand-lg header-background" >
                    <Link to="/"><span className="navbar-brand custom-nav-item">Dog Website</span></Link>
                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav mr-auto">
                            <li className="nav-item"> {/*use 'active' class next to 'nav-item' to set that page is active */}
                                <Link to="/" className="nav-link custom-nav-item"><span className="">Home</span></Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/dogs" className="nav-link custom-nav-item"><span className="">Dogs</span></Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/contact" className="nav-link custom-nav-item"><span className="">Contact</span></Link>
                            </li>


                        </ul>

                        {/* This is where it will check for props, and display username and a dropdown menu if signed in */}
                        {this.state.signInHolder}

                    </div>
                </nav>
            </header>

        );
    }
}


