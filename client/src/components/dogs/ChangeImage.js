import React from 'react';
import { Redirect, Link } from 'react-router-dom';

export class ChangeImage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            errorMessage: "",
            isAdmin: parseInt(this.props.isAdmin),
            id: this.props.match.params.id,
            uploadedImage: null,
            imageSource: '/images/default.jpg',

            redirectToDetails: '',
            pageContent: <div>Loading...</div>
        }
        this.handleImageUpload = this.handleImageUpload.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    //TODO: redirect if not an admin



    /**
     * stores the image file to the state variable when an image is uploaded
     * @param {*} event 
     */
    handleImageUpload(event) {
        this.setState({
            uploadedImage: event.target.files[0],
            imageSource: window.URL.createObjectURL(event.target.files[0])
        });
        //window.URL.createObjectURL(this.files[0])
    }

    componentDidMount() {
        //get existing dog image
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
                    if (result[0].dogimageref !== null && result[0].dogimageref !== "") {
                        //if the dog has a reference image, use it
                        console.log("dog image ref found - " + result[0].dogimageref);
                        this.setState({ imageSource: '/images/' + result[0].dogimageref });
                    }
                    //setting the content of the page
                    //TODO: print image
                    this.setState({
                        pageContent: (
                            <div>

                                <div className="form-group files">
                                    <input type="file" id="image" name="image" className="form-control" multiple="" accept="image/*" onChange={this.handleImageUpload} />
                                    <label htmlFor="image">Image Upload: </label>
                                    <span id="nameError"></span>
                                </div>

                                <Link to={"/dogs/details/" + this.state.id}><button className="btn btn-light">Cancel</button></Link>
                                <button type="submit" className="btn btn-primary" onClick={this.handleSubmit}>Update Image</button>
                            </div>
                        )
                    })
                }
            }).catch(function (err) {
                console.log(err);
            });
    }

    handleSubmit() {
        console.log('upload image state...')
        console.log(this.state.uploadedImage);

        //TODO: image validation

        if (this.state.uploadedImage !== null) {
            const data = new FormData();
            const file = this.state.uploadedImage;
            data.append('id', this.state.id);
            data.append('file', file);
            console.log("data object's file field...");
            console.log(data.values());
            fetch("/api/upload", {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + this.props.jwtToken
                },
                body: data
            }).then((response) => {
                if (response.status === 403) {
                    //token is expired, sign out and redirect to login form
                    this.props.signOut();
                    this.setState({ redirectToLogin: true });
                    throw new Error("Bad response from server: token expired");
                }
                if (response.status >= 400) {
                    throw new Error("Bad response from server");
                    //TODO: redirect to an error page - currently still says it submits successfully on the front end
                }
                console.log(response.statusText);

                //if no errors, redirect to details
                //TODO: test this redirecting
                this.setState({ redirectToDetails: <Redirect to={"/dogs/details/" + this.state.id} /> });
            }).then((data) => {
                console.log(data);
            })
                .catch(function (err) {
                    console.log(err);
                });
        }
    }

    render() {
        return (
            <div>
                {this.state.redirectToDetails}

                <h2>Change Image</h2>
                <div>
                    <img src={this.state.imageSource} alt="dog profile picture" />
                </div>
                <div style={{ color: "red" }} id="errorMessage">{this.state.errorMessage}</div>

                {this.state.pageContent}


            </div>
        );
    }
}