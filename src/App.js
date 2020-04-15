import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';

import './App.css';
import Users from './Users/users';
import UserFollowers from './UserFollowers/userFollowers';

function App() {
  return (
	<BrowserRouter>
		<div className="App">
			<Route path='/' exact component={Users} />
			<Route path='/users' component={Users} />
			<Route path='/userFollowers' component={UserFollowers} />
		</div>
	</BrowserRouter>
  );
}

export default App;
