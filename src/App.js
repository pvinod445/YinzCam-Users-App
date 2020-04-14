import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';

import './App.css';
import Users from './Users/users';

function App() {
  return (
	<BrowserRouter>
		<div className="App">
			{/* <Users /> */}
			<Route path='/' exact component={Users} />
			<Route path='/users' component={Users} />
		</div>
	</BrowserRouter>
  );
}

export default App;
