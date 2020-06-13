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
        //create the delay style animation
        let delay=0; //change this number to change the delay start
        this.state.dogList.forEach(element => {
            element.order = delay;
            delay += 0.3;
        });

        //creates a custom style based on the given delay (in seconds)
        function style(delay) {
            return {
                animationName: 'cardAppear',
                animationTimingFunction: 'ease-in-out',
                animationDuration: '0.3s',
                animationDelay: delay + 's',
                animationIterationCount: 1,
                animationDirection: 'normal',
                animationFillMode: 'forwards'
            }
        };



        this.setState({
            dogHolder: (
                <div>
                    <div className="home-image-holder">
                        {this.state.dogList.map((item) => {
                            let dogImage = "/images/default.jpg";
                            if (item.dogimageref !== "" && item.dogimageref !== null) {
                                dogImage = 
                                "/images/" + item.dogimageref
                            }
                            let age = item.dogage;
                            if(Number(item.dogage) <1)
                            {
                                age = "<1"
                            }
                            return (
                                <div key={item.dogid} className="dog-card mb-5" style={style(item.order)}>
                                    <div>
                                        <img src={dogImage} alt={item.dogname + "'s profile photo"} />
                                        <div className="mt-3">
                                            <div><strong>{item.dogname}</strong></div>
                                            <div>{item.doglocation}</div>
                                            <div>{age} year old {item.doggender} {item.dogbreed}</div>
                                            <Link to={"/dogs/details/" + item.dogid}>Details &#8594;</Link>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <div className="right pb-5">
                        <Link to="/dogs"><button className="btn btn-success">See All Dogs</button></Link>
                    </div>
                </div>
            )
        });
    }

    render() {
        return (
            <div className="home-content-holder">
                <div className="center pb-5">
                    <h1 style={{ textAlign: "center" }}>Find Your Next Furry Friend</h1>
                </div>
                <div className="home-image-holder mb-4">
                    <img className="img-responsive" src="dog2.jpg" alt="a nice dog" />
                    <img className="img-responsive" src="dog1.jpg" alt="another nice dog" />
                    <img className="img-responsive" src="dog3.jpg" alt="a third nice dog" />
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