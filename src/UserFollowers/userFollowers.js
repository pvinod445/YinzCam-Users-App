import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import queryString from 'query-string'
import { Table, Tbody, Tr, Td } from 'react-super-responsive-table'
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css'

import './userFollowers.css';

class UserFollowers extends Component {
	state = {
		followers:[],
		repos: [],
		error: false,
		user: null,
		loadingText: '',
		currentPageNumber: ''
	}
	componentDidMount() {
		const queryParams = queryString.parse(this.props.location.search)
		this.setState({user: queryParams.login, currentPageNumber: queryParams.currentPage});
		this.setState({loadingText: 'Loading Followers for User ' + queryParams.login});

		axios.get('https://api.github.com/users/' + queryParams.login)
		.then(response => {
			const res = response.data;

			axios.get(res.followers_url)
			.then(followerResponse => {
				const followerRes = followerResponse.data;
				let followers = [];
				followerRes.forEach(follower => followers.push(follower.login));
				this.setState({followers: followers, loadingText: ''});
			})
			.catch(error => {
				this.setState({loadingText: ''});
			})

			axios.get(res.repos_url)
			.then(repoResponse => {
				const repoRes = repoResponse.data;
				let repos = [];
				repoRes.forEach(repo => repos.push(repo));
				this.setState({repos: repos});
			})
			.catch(error => {
			})
		})
		.catch(error => {
			this.setState({error: true, loadingText: ''});
		});
	}

	render() {
		const followers = this.state.followers;
		const repos = this.state.repos;
		let followersHtml = followers.map((follower, index) => {
			if(index %3 === 0) {
				const secondColumn = (index + 1) < followers.length ? <Td>{followers[index + 1]}</Td> : <Td></Td>;
				const thirdColumn = (index + 2) < followers.length ? <Td>{followers[index + 2]}</Td> : <Td></Td>;
				return (
					<Tr key={index}>
						<Td>{follower}</Td>
						{secondColumn}
						{thirdColumn}
					</Tr>
				)
			}
			else {
				return null;
			}
		});

		let reposHtml = repos.map((repo, index) => {
			if(index %3 === 0) {
				const secondColumn = (index + 1) < repos.length ? <Td><a href={repos[index + 1].owner.html_url + '/' + repos[index + 1].name} target="_blank" rel="noopener noreferrer">{repos[index + 1].name}</a></Td> : <Td></Td>;
				const thirdColumn = (index + 2) < repos.length ? <Td><a href={repos[index + 2].owner.html_url + '/' + repos[index + 2].name} target="_blank" rel="noopener noreferrer">{repos[index + 2].name}</a></Td> : <Td></Td>;
				return (
					<Tr key={index}>
						<Td>
							<a href={repo.owner.html_url + '/' + repo.name} target="_blank" rel="noopener noreferrer">{repo.name}</a>
						</Td>
						{secondColumn}
						{thirdColumn}
					</Tr>
				)
			}
			else {
				return null;
			}
		})

		if(followers.length === 0) {
			if(this.state.loadingText.length > 0) {
				return <h1 style={{color:'red'}}>{this.state.loadingText}</h1>;
			}
			else {
				return <h1 style={{color:'red'}}>No followers Found for user: {this.state.user}</h1>;
			}

		}
		else {
			const followersTable = (
					<Table align='center'>
						<Tbody>
							{followersHtml}
						</Tbody>
					</Table>
			);
			const reposTable = (
				<Table className='repoTable' align='center'>
					<Tbody>
						{reposHtml}
					</Tbody>
				</Table>
			);
			return (
				<div className='userFollowers'>
					<Link className='backButton' to={{
								pathname: '/users',
								search: '?currentPage='+ this.state.currentPageNumber
							}} >Back</Link>

					<h1>Repos: {this.state.user}</h1>
					{reposTable}
					<br />
					<br />
					<h1>Followers: {this.state.user}</h1>
					{followersTable}
					<br />
					<br />
				</div>
			);
		}

	}
}

export default UserFollowers;