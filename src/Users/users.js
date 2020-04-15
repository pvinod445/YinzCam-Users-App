import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import queryString from 'query-string'
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table'
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css'

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

	componentDidMount() {
		this.loadUsers();
	}
	componentDidUpdate() {
		this.loadUsers();
	}

	loadUsers() {
		const queryParams = queryString.parse(this.props.location.search)

		if(!this.state.loadPage || ('page' in queryParams && (+queryParams.page) !== (+this.state.currentPageNumber))) {
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
			return login.indexOf(event.target.value) !== -1
		});
		this.setState({filterLogins: results});
	}

	sortHandler = () => {
		let users = this.state.users;
		let sortedUsers = [];
		let keys = Object.keys(users);

		if(this.state.currentSort === '' || this.state.currentSort === 'desc') {
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
			if(this.state.filterLogins.length === 0 ||  (this.state.filterLogins.length > 0 && this.state.filterLogins.indexOf(user.login) > -1)) {
				return (
					<Tr key={index}>
						<Td>
							<Link className='userLink' to={{
								pathname: '/userFollowers',
								search: '?login=' + user.login + '&currentPage='+ this.state.currentPageNumber
							}} >{user.login}</Link>
						</Td>
						<Td>
							<img src={user.avatar_url} className="avatar" alt="avatar" />
						</Td>
					</Tr>
				)
			}
			else {
				return null;
			}
		});

		if(usersObj.length === 0) {
			return <h1 style={{color:'red'}}>No Users Found on Page {this.state.currentPageNumber}</h1>;
		}
		else {
			return (
				<div className="users">
					<h1>Total Users in page {this.state.currentPageNumber}</h1>
					<Table className='paginationTable' align='center'>
						<Tbody>
							<Tr>
								<Td className='searchTd'>
									<input type='text' placeholder='search' onChange={this.searchHandler.bind(this)} value={this.state.searchText} />
								</Td>
								<Td className='paginationTd'>
									<Pagination comp='users' currentPageNumber={this.state.currentPageNumber} />
								</Td>
							</Tr>
						</Tbody>
					</Table>
					<Table className='usersTable' align='center'>
						<Thead>
							<Tr>
								<Th onClick={this.sortHandler}>
									User
									<img src={sortImage} className='sortImage' alt='Sort' />
								</Th>
								<Th>Avatar</Th>
							</Tr>
						</Thead>
						<Tbody>
							{users}
						</Tbody>
					</Table>
					<br />
					<br />
				</div>
			);
		}

	}
}

export default Users;