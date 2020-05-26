//import React
import React from 'react';
//import the react routing functionality - source: https://reacttraining.com/react-router/web/guides/quick-start
import { BrowserRouter as Router, Switch, Route, Redirect, useHistory } from 'react-router-dom';
import { withRouter } from 'react-router'


//import components
import { WebsiteHeader } from './WebsiteHeader';
import { Home } from './Home';
import { Dogs } from './dogs/Dogs';
import { List } from './dogs/List';
import { Add } from './dogs/Add';
import { Update } from './dogs/Update';

import { Contact } from './Contact';
import { SignIn } from './SignIn';
import { NoMatch } from './NoMatch';



/**
 * This class is the master layout of the website and will hold global states
 */
export class MasterPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: null,
            isAdmin: 0,
            redirectHome: '',
            jwtToken: '',
            refreshToken: '',
        }
        this.signOut = this.signOut.bind(this);
        this.deleteCookies = this.deleteCookies.bind(this);
        this.checkCookies = this.checkCookies.bind(this);

    }
    componentWillMount() {
        this.checkCookies();
    }

    //runs after rendering is done
    componentDidMount() {
        console.log("page is done rendering");
    }

    checkCookies() {
        //if a cookie exists and contains the correct values
        if (document.cookie !== null && getCookie("username") !== '' && getCookie("jwtToken") !== '' && getCookie("refreshToken") !== '') {
            console.log("username from cookie: " + getCookie("username"));
            console.log("isadmin from cookie: " + getCookie("isadmin"));
            console.log("jwttoken from cookie: " + getCookie("jwtToken")); //TODO: u should validate the jwt token on page load
            console.log("refreshtoken from cookie: " + getCookie("refreshToken"));
            this.setState({ username: getCookie("username"), isAdmin: getCookie("isadmin"), jwtToken: getCookie("jwtToken"), refreshToken: getCookie("refreshToken") });
        }
        else {
            console.log("no cookies with the correct values!");
            this.setState({ username: null });
        }

    }
    deleteCookies() {
        console.log("deleting cookies...")
        document.cookie = 'username=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        document.cookie = 'jwttoken=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        document.cookie = 'refreshtoken=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        document.cookie = 'isadmin=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    }


    signOut() {
        //do the logout api call to delete your refresh key
        //then delete the cookies
        //then erase the MasterPage's username state 
        //then redirect to the home page (done inside WebsiteHeader.js)
        this.setState({ username: null, isAdmin: 0, redirectHome: <Redirect to='/?signout=true' /> });
        console.log("You have signed out!");
        this.deleteCookies();
    }

    render() {
        return (
            <Router>

                <WebsiteHeader username={this.state.username} signout={this.signOut} />
                <div className="page-wrapper">
                    <Switch>
                        {/*<Route exact path="/dogs" component={withRouter(Dogs)}>
                    </Route>*/}
                        <Route exact path="/dogs" render={(props) => (
                            <List {...props} isAdmin={this.state.isAdmin} />
                        )}>
                        </Route>
                        <Route exact path="/dogs/add" render={(props) => (
                            <Add {...props} isAdmin={this.state.isAdmin} />
                        )}>
                        </Route>
                        <Route exact path="/dogs/update/:id" render={(props) => (
                            <Update {...props} isAdmin={this.state.isAdmin} />
                        )}>
                        </Route>
                        <Route exact path="/contact">
                            <Contact />
                        </Route>
                        <Route exact path="/signin" render={(props) => (
                            <SignIn {...props} signin={this.checkCookies} username={this.state.username} />
                        )} >
                        </Route>
                        <Route path="/" exact>
                            <Home />
                        </Route>
                        <Route component={NoMatch} />
                    </Switch>
                </div>

            </Router>
        )
    }

}

//TODO: move this outside into a helper class
function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}