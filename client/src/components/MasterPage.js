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
            isLoggedIn: false,
            userId: null,
            username: null 
            //TODO: set to null on logout
        }
    }
    //runs after rendering is done
    componentDidMount() {
        console.log("page is done rendering");
    }

    render() {
        return (
            <Router>

                <WebsiteHeader />
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

            </Router>
        )
    }

}