import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import queryString from 'query-string'

import './users.css';
import Pagination from '../Pagination/pagination';
import sortImage from '../sort.png';

class Users extends Component {
	state = {
		users: [],
		error: false,
		currentPageNumber: 1,
		loadPage: false,
		searchText: '',
		filterLogins: [],
		currentSort: ''
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

	sortHandler = () => {
		let users = this.state.users;
		let sortedUsers = [];
		let keys = Object.keys(users);

		if(this.state.currentSort == '' || this.state.currentSort == 'desc') {
			keys.sort((a, b) => {
				return a.toLowerCase().localeCompare(b.toLowerCase());
			});
			this.setState({currentSort:'asc'});
		}
		else {
			keys.sort((a, b) => {
				return b.toLowerCase().localeCompare(a.toLowerCase());
			});
			this.setState({currentSort:'desc'});
		}

		keys.forEach(user => {
			return sortedUsers[user] = users[user];
		})

		this.setState({users: sortedUsers});
	}

	render() {
		let usersObj = Object.values(this.state.users);
		let users = usersObj.map((user, index) => {

			if(this.state.filterLogins.length == 0 ||  (this.state.filterLogins.length > 0 && this.state.filterLogins.indexOf(user.login) > -1)) {
				return (
					<tr key={index}>
						<td>
							<Link className='userLink' to={{
								pathname: '/userFollowers',
								search: '?login=' + user.login
							}} >{user.login}</Link>
						</td>
						<td>
							<img src={user.avatar_url} className="avatar" />
						</td>
					</tr>
				)
			}
		});

		if(usersObj.length == 0) {
			return <h1 style={{color:'red'}}>No Users Found on Page {this.state.currentPageNumber}</h1>;
		}
		else {
			return (
				<div className="users">
					<h1>Total Users in page {this.state.currentPageNumber}</h1>
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
							<th onClick={this.sortHandler}>
								User
								<img src={sortImage} className='sortImage' />
							</th>
							<th>Avatar</th>
						</tr>
						{users}
					</table>
				</div>
			);
		}

	}
}

export default Users;