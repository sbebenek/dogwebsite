import React from 'react';
//import the react routing functionality - source: https://reacttraining.com/react-router/web/guides/quick-start
import { Link } from 'react-router-dom';

export class WebsiteHeader extends React.Component {
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
                        <Link to="/signin"><button className="btn btn-outline-light my-2 my-sm-0">Sign In</button></Link>

                    </div>
                </nav>
            </header>

        );
    }
}