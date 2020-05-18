import React from 'react';
//import the react routing functionality - source: https://reacttraining.com/react-router/web/guides/quick-start
import { Link } from 'react-router-dom';

export class WebsiteHeader extends React.Component {
    render() {
        return (
                <header>
                    <h2>Dog Website</h2>
                    <nav>
                        <ol className="headerNav">
                            <li><Link to="/">Home</Link></li>
                            <li><Link to="/dogs">Dogs</Link></li>
                            <li><Link to="/contact">Contact Us</Link></li>
                            <li><Link to="/signin">Sign In</Link></li>
                        </ol>
                    </nav>
                </header>

        );
    }
}