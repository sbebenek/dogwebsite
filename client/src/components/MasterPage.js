//import React
import React from 'react';
//import the react routing functionality - source: https://reacttraining.com/react-router/web/guides/quick-start
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
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
            username: null
            //TODO: set to null on logout
        }
    }
    componentWillMount() {
        this.checkCookies();

        //TODO: check for a JWT authentication token, if it exists validate it using an api call, if it is still valid, set state variables (store the cookie as ssl)
    }

    //runs after rendering is done
    componentDidMount() {
        console.log("page is done rendering");
    }

    checkCookies() {
        //if a cookie exists and contains the correct values
        if (document.cookie !== null && getCookie("username") !== '' && getCookie("jwtToken") !== '' && getCookie("refreshToken") !== '') {
            console.log("username from cookie: " + getCookie("username"));
            console.log("jwttoken from cookie: " + getCookie("jwtToken"));
            console.log("refreshtoken from cookie: " + getCookie("refreshToken"));
            this.setState({username: getCookie("username")});
        }
        else console.log("no cookies with the correct values!");
    }

    render() {
        return (
            <Router>

                <WebsiteHeader username={this.state.username}/>
                <div className="page-wrapper">
                    <Switch>
                        {/*<Route exact path="/dogs" component={withRouter(Dogs)}>
                    </Route>*/}
                        <Route exact path="/dogs" component={withRouter(List)}>
                        </Route>
                        <Route exact path="/dogs/add" component={withRouter(Add)}>
                        </Route>
                        <Route exact path="/dogs/update/:id" component={withRouter(Update)}>
                        </Route>
                        <Route exact path="/contact">
                            <Contact />
                        </Route>
                        <Route exact path="/signin">
                            <SignIn />
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
    for(var i = 0; i <ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }