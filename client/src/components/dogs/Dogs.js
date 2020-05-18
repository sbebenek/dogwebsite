import React from 'react';

//****** NESTED ROUTING WASN't WORKING SO THIS COMPONENT ISN'T USED *******/

//Route switching for all dog crud (ie. list, details, add/update/delete etc.) will need to be done in here.
//it will all be served to App.js as <Dogs />
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { withRouter } from 'react-router'
//import componenets
import { List } from './List';
import { Add } from './Add';
import { NoMatch } from '../NoMatch'



export class Dogs extends React.Component {



    componentWillMount() {
    }

    componentDidMount() {
    }


    render() {
        return (
            <Router>
                <Switch>
                    <Route exact strict path={this.props.match.path} component={withRouter(List)}>
                    </Route>
                    <Route exact strict path={this.props.match.path + "/add"} component={withRouter(Add)}>
                    </Route>
                    <Route component={NoMatch} />

                </Switch>
            </Router>
        );
    }
}