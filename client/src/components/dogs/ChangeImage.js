import React from 'react';
import { Redirect, Link } from 'react-router-dom';

export class ChangeImage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            userIsAdmin: parseInt(this.props.isAdmin),

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
        this.checkIfSignedIn = this.checkIfSignedIn.bind(this);
    }

    //check if an admin is signed in on page load
    checkIfSignedIn() {
        if (this.state.userIsAdmin === 0) {
            //redirect if admin isnt signed in
            this.setState({ redirectToDetails: <Redirect to={"/dogs/details/" + this.state.id} /> });
        }
    }

    //will call whenever new props are received
    componentDidUpdate(prevProps) {
        console.log("Add Page received new props!");
        // Typical usage (don't forget to compare props):
        if (this.props.isAdmin !== prevProps.isAdmin) {
            console.log("The new prop was different from the old one - new isAdmin: " + this.props.username)
            this.setState({ userIsAdmin: parseInt(this.props.isAdmin) });
        }
    }




    /**
     * Validates the file that was just selected by the file input.
     * If correct size and file type, stores the image file to the state variable when an image is uploaded
     * @param {*} event 
     */
    handleImageUpload(event) {
        console.log("file size - " + event.target.files[0].size + ". megabytes - " + event.target.files[0].size / 1000000);

        //IMAGE VALIDATION
        //source - https://www.codexworld.com/file-type-extension-validation-javascript/ 
        var allowedExtensions = /(\.jpg|\.jpeg|\.png|\.gif)$/i;
        if (!allowedExtensions.exec(event.target.files[0].name)) {
            console.log("An invalid file type tried to be uploaded - " + event.target.files[0].name);
            this.setState({ errorMessage: 'Invalid filetype: jpg, jpeg, png, or gif only.' });
        }
        else if (event.target.files[0].size / 1000000 > 2.5) {
            console.log("Filesize > 2.5 mb - too large.");
            this.setState({ errorMessage: 'File size too large. Must be smaller than 2.5mb. Your file is approx. ' + event.target.files[0].size / 1000000 + "mb" });
        }
        else { //correct file type and file size. Save to local storage.
            this.setState({
                uploadedImage: event.target.files[0],
                imageSource: window.URL.createObjectURL(event.target.files[0]),
                errorMessage: ''
            });
        }
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
                    this.setState({
                        pageContent: (
                            <div>

                                <div className="form-group files">
                                    <label htmlFor="image">Image Upload: </label>
                                    <input type="file" id="image" name="image" className="form-control" multiple="" accept="image/*" onChange={this.handleImageUpload} />
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


        if (this.state.uploadedImage !== null) {
            const data = new FormData();
            const file = this.state.uploadedImage;
            data.append('id', this.state.id); //id is being sent
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
                this.setState({ redirectToDetails: <Redirect to={"/dogs/details/" + this.state.id + "?cmd=updated"} /> });
            }).then((data) => {
                console.log(data);
            })
                .catch(function (err) {
                    console.log(err);
                });
        }
        else {
            this.setState({ errorMessage: 'Please upload an image file.' });
        }
    }






    render() {
        return (
            <div>
                {this.checkIfSignedIn()}
                {this.state.redirectToDetails}

                <h2>Change Image</h2>
                <div>
                    <img src={this.state.imageSource} className="change-image-image mb-5 mx-auto d-block" alt="dog profile picture" />
                </div>
                <div style={{ color: "red" }} id="errorMessage">{this.state.errorMessage}</div>

                {this.state.pageContent}


            </div>
        );
    }
}