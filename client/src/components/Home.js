import React from 'react';
import { Link } from 'react-router-dom';

export class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dogList: [],
            dogHolder: (
                <div className="center">
                    <div class="spinner-border text-success" role="status">
                        <span class="sr-only">Loading...</span>
                    </div>
                </div>
            )
        }

        this.drawDogList = this.drawDogList.bind(this);
    }
    componentWillMount() {
        fetch('/api/dogs/new')
            .then(res => res.json())
            .then((list) => {
                console.log(list);
                this.setState({ dogList: list });
            })
            .then(() => this.drawDogList());
    }

    //this function draws the dogs in this.state.dogList to the this.state.dogHolder as JSX elements
    drawDogList() {
        this.setState({
            dogHolder: (
                <div>
                    <div className="home-image-holder">
                        {this.state.dogList.map((item) => {
                            let dogImage = "/images/default.jpg";
                            if (item.dogimageref !== "" && item.dogimageref !== null) {
                                dogImage = "/images/" + item.dogimageref
                            }
                            return (
                                <div key={item.dogid} className="dog-card">
                                    <div>
                                        <img src={dogImage} alt={item.dogname + "'s profile photo"} />
                                        <strong>{item.dogname}</strong>
                                        {item.doggender}
                                        {item.doglocation}
                                        <Link to={"/dogs/details/" + item.dogid}>Details &#8594;</Link>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <div className="float-right">
                        <Link to="/dogs">See More &#8594;</Link>
                    </div>
                </div>
            )
        });
    }

    render() {
        return (
            <div className="home-content-holder">
                <div className="center mb-5">
                    <h1 style={{ textAlign: "center" }}>Find Your Next Furry Friend</h1>
                </div>
                <div className="home-image-holder mb-4">
                    <img src="dog2.jpg" alt="a nice dog" />
                    <img src="dog1.jpg" alt="another nice dog" />
                    <img src="dog3.jpg" alt="a third nice dog" />
                </div>
                <div className="center" style={{ textAlign: "center" }}>
                    <p>Owning a dog can be one of the most rewarding experiences someone can have. All around the GTA, many dogs are looking for homes to call their own.
                    here at Dog Website, we want to clear shelters and fill people's live with the joy of having a dog.
                    </p>
                    <p>Dog Website is an organization dedicated to connecting shelters and private dog fosterers in the GTA with anyone interested in adopting a new dog.
                    Please browse all the pets we have available, and we hope you find a new friend!
                    </p>
                    <h2>Our Newest Dogs:</h2>
                </div>
                {this.state.dogHolder}
            </div>
        );
    }
}