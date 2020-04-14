import React, { Component } from 'react';
import axios from 'axios';
import queryString from 'query-string'

import './users.css';
import Pagination from '../Pagination/pagination';

class Users extends Component {
	state = {
		users: [],
		error: false,
		currentPageNumber: 1,
		loadPage: false,
		searchText: '',
		filterLogins: []
	}

	constructor(props) {
		super(props);
	}

	componentDidMount() {
		this.loadUsers();
	}
	componentDidUpdate() {
		this.loadUsers();
	}

	loadUsers() {
		const queryParams = queryString.parse(this.props.location.search)

		if(!this.state.loadPage || ('page' in queryParams && queryParams.page != this.state.currentPageNumber)) {
			let page = this.state.currentPageNumber;
			if('page' in queryParams) {
				page = queryParams.page;
			}

			axios.get('https://api.github.com/users?since=' + page)
			.then(response => {
				const dat = response.data;
				let users = [];
				dat.forEach(eachUser => {
						return users[eachUser.login] = eachUser;
					});

				this.setState({users: users, loadPage: true});

				if('page' in queryParams) {
					this.setState({currentPageNumber: queryParams.page});
				}
			})
			.catch(error => {
				// this.setState({error: true});
			});
		}
	}

	searchHandler = (event) => {
		this.setState({searchText: event.target.value});

		let users = this.state.users;
		let userLogins = Object.keys(users);

		const results = userLogins.filter(login => {
			return login.indexOf(event.target.value) != -1
		});
		this.setState({filterLogins: results});
	}

	render() {
		let usersObj = Object.values(this.state.users);
		let users = usersObj.map(user => {

			if(this.state.filterLogins.length == 0 ||  (this.state.filterLogins.length > 0 && this.state.filterLogins.indexOf(user.login) > -1)) {
				return (
					<tr>
						<td>{user.login}</td>
						<td>
							<img src={user.avatar_url} className="avatar" />
						</td>
					</tr>
				)
			}
		});

		return (
			<div className="users">
				<h1>Total Users in page: {this.state.currentPageNumber}</h1>
				<table className='paginationTable' align='center'>
					<tr>
						<td className='searchTd'>
							<input type='text' placeholder='search' onChange={this.searchHandler.bind(this)} value={this.state.searchText} />
						</td>
						<td className='paginationTd'>
							<Pagination comp='users' currentPageNumber={this.state.currentPageNumber} />
						</td>
					</tr>
				</table>
				<table className='usersTable' align='center'>
					<tr>
						<th>User</th>
						<th>Avatar</th>
					</tr>
					{users}
				</table>
			</div>
		)
	}
}

export default Users;