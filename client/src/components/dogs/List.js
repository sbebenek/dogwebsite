import React from 'react';

import { Link, Redirect } from 'react-router-dom';

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
            tableHolder: (
                <div className="d-flex justify-content-center">
                    <div className="spinner-border text-success" role="status">
                        <span className="sr-only">Loading...</span>
                    </div>
                </div>
            ),
            redirectHolder: '',

            currentlySelectedDogs: [],

            currentPage: 1,
            pageCount: 1,
            pageLinks: [],
            elementsPerPage: 8
        }
        this.checkIfAdmin = this.checkIfAdmin.bind(this);
        this.redirect = this.redirect.bind(this);
        this.initialDrawCards = this.initialDrawCards.bind(this);
        this.drawPageButtons = this.drawPageButtons.bind(this);
    }

    //prints the add button if admin
    checkIfAdmin() {
        console.log("is user admin - " + this.state.isAdmin);
        if (this.state.isAdmin === 1) {
            console.log("user is admin!");
            return <Link to={"/dogs/add"}><button className="btn btn-success">Add New Dog</button></Link>;
        }
        else return '';
    }

    //will call whenever new props are received
    componentDidUpdate(prevProps) {
        console.log("Dog List Page updated and received new props!");
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
            if (urlParams.get('cmd') === "deleted") {
                this.setState({ commandMessage: <div className="alert alert-danger" role="alert">Dog was successfully deleted.</div> });
            }

        }

    }



    // Fetch the list on first mount
    componentDidMount() {
        this.getList();
    }

    //deleting the command message when the page is changed
    componentWillUnmount() {
        this.setState({ commandMessage: "" });
        console.log("Debug: list page is unmounting!");
    }





    getList = () => {
        //set timeout emulates the browser loading
        //setTimeout(() => {
        fetch('/api/dogs/list')
            .then(res => res.json())
            .then(list => this.setState({ list: list }))
            .then(() => {

                //setting the number of pages - the length of the list divided by the elements per page, then rounded up
                let numberOfPages = Math.ceil(this.state.list.length / this.state.elementsPerPage);
                console.log("number of pages: " + numberOfPages);
                this.setState({ pageCount: numberOfPages });

            })
            .then(() => {
                //put the dog entries in page elements
                console.log("URL page number param = " + this.props.match.params.page);
                this.initialDrawCards(1);
            });
        //}, 1000);
    }

    /**
     * Draws the cards to the page based on the current page number in the url
     */
    initialDrawCards() {
        let currentPage = this.props.match.params.page;
        let dogListIndex = 0;
        if (currentPage !== 1 && currentPage !== undefined) {
            dogListIndex = (currentPage - 1) * this.state.elementsPerPage;
        }
        const dogSubList = this.state.list.slice(dogListIndex, dogListIndex + this.state.elementsPerPage);
        this.setState({
            currentlySelectedDogs: dogSubList,
        });

    }


    /**
     * Draws the pagination number buttons, and sets which one is currently active
     * @param {Number} numberOfPages 
     */
    drawPageButtons() {
        let pageLinkElements = [];
        for (var i = 1; i <= this.state.pageCount; i++) {
            if (Number(this.props.match.params.page) === i || ((this.props.match.params.page === undefined) && i === 1)) {
                pageLinkElements.push(<li className="page-item active"><Link onClick={this.redrawCards} className="page-link" to={'/dogs/' + i}>{i}</Link></li>);
            }
            else {
                pageLinkElements.push(<li className="page-item"><Link onClick={this.redrawCards} className="page-link " to={'/dogs/' + i}>{i}</Link></li>);
            }
        }
        return pageLinkElements;
    }







    /**
     * Not actually a test, runs every render and draws dog cards to the screen based on the current page number in the URL
     * @param {int} currentPage 
     */
    testDrawCard(currentPage) {

        //dont draw anything until the holder is filled with db data
        if (this.state.list.length === 0) {
            return this.state.tableHolder;
        }

        let modCurrentPage = currentPage;



        //grab new cards based on url, and draw them
        let dogListIndex = 0;
        //if one page one or no page given, set the index to count the first 8 dogs
        if (currentPage !== 1 && currentPage !== undefined) {
            dogListIndex = (currentPage - 1) * this.state.elementsPerPage;
        }
        else {
            modCurrentPage = 1;
        }
        //create a sublist based on the current page and amount of cards allowed per page
        const dogSubList = this.state.list.slice(dogListIndex, dogListIndex + this.state.elementsPerPage);
        let delay = 0;
        dogSubList.forEach(element => {
            element.order = delay;
            delay += 0.1;
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


        if (dogSubList.length !== 0) {
            //this.disappearCards();
            return (
                <div>
                    <nav aria-label="Page navigation">
                        <ul className="pagination justify-content-center">
                            <li className="page-item">
                                <Link className="page-link" to={
                                    () => {
                                        if (Number(modCurrentPage) > 1) {
                                            return "/dogs/" + (Number(modCurrentPage) - 1)
                                        }
                                    }
                                }>&larr;</Link>
                            </li>
                            {this.drawPageButtons()}
                            <li className="page-item">
                                <Link className="page-link" to={
                                    () => {
                                        if (Number(modCurrentPage) < this.state.pageCount) {
                                            return "/dogs/" + (Number(modCurrentPage) + 1)
                                        }
                                    }

                                    //"/dogs/" + this.clampPage((Number(this.props.match.params.page) + 1), Number(this.state.pageCount))}
                                }>&rarr;</Link>

                            </li>
                        </ul>
                    </nav>
                    <div className="list-card-holder">
                        {dogSubList.map((item) => {
                            let dogImage = encodeURI("../public/images/default.jpg");
                            if (item.dogimageref !== "" && item.dogimageref !== null) {
                                dogImage = encodeURI("../public/images/" + String(item.dogimageref))
                            }
                            let age = item.dogage;
                            if (Number(item.dogage) < 1) {
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

                </div>
            )
        }
    }
    makeCardsAppear() {
        let cards = document.getElementsByClassName("dog-card");
        for (var i = 0; i < cards.length; i++) {
            cards.style.color = "blue";
        }
    }

    /**
     * Makes cards on screen disappear - TODO: have cards disppear on page change
     */
    disappearCards() {
        let existingCards = document.getElementsByClassName("dog-card");
        for (let element of existingCards) {
            element.setAttribute("color", "blue")
        }
    }







    redirect(id) {
        this.setState({ redirectHolder: <Redirect to={this.props.match.path + "/dogs/details/" + id} /> });
    }







    render() {
        let cards = this.state.tableHolder
        if (this.state.redirectToLogin === true) {
            return <Redirect to='/signin' />;
        }
        else
            return (
                <div>
                    {this.state.redirectHolder}
                    <h1>Dogs</h1>
                    {this.state.commandMessage}
                    <p>Here is a list of all the dogs currently available.</p>
                    {this.checkIfAdmin()}

                    {this.testDrawCard(this.props.match.params.page)}



                </div>
            );
    }

   
}