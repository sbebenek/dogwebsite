import React from 'react';
import { Link } from 'react-router-dom';


//404 page
export const NoMatch = ({ location }) => (
    <div>
      <h3>No page for <code>{location.pathname}</code> found :(</h3>
      <Link to=""><p>Home</p></Link>
    </div>
  );