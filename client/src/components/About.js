import React from 'react';
export class About extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            buttonCount: 1
        }
        this.increaseCount = this.increaseCount.bind(this);
    }

    increaseCount() {
        this.setState({ buttonCount: this.state.buttonCount + 1 });
    }
    render() {
        return (
            <div>
                <h1>About Us</h1>
                <p>Dog Website is a website dedicated to connecting shelters and dog fosterers in the GTA to potential adopters.</p>

                <p>This website was developed as a passion project by Sam Bebenek in 2020 as a way to practice React and Express development. Dog Website is a single-page content
                management system that features
                React routing, authenticated logins, image uploading, and pagination. It is styled with a combination of Bootstrap and custom CSS. 
                The back-end is an Express RESTful API application that connects to a MySQL database.
                </p>

                <p>
                    With more time to develop this website, I'd liked to include personal user accounts, multiple images per dog, internal messaging, and shelter pages.
                </p>
                <p className="mb-5">Sam's portfolio website can be found <a href="http://sambebenek.com" target="_blank">here</a>.</p>
                <div className="d-flex justify-content-center">
                    <div>
                        <p className="text-center">Dedicated to Dodger</p>
                        <p className="text-center">2005-2018</p>
                        <img src="/dodger.jpg" alt="Dodger the dog" className="rounded" width="300" />
                    </div>
                </div>

                {/*this.state.buttonCount}
                <button onClick={this.increaseCount}>Click</button>*/}
            </div>
        );
    }
}