import React, { Component } from 'react';
import axios from 'axios';
import queryString from 'query-string'

import './userFollowers.css';

class UserFollowers extends Component {
	state = {
		followers:[],
		error: false,
		user: null,
		loadingText: ''
	}
	componentDidMount() {
		const queryParams = queryString.parse(this.props.location.search)
		this.setState({user: queryParams.login});
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
		})
		.catch(error => {
			this.setState({error: true, loadingText: ''});
		});
	}

	render() {
		const followers = this.state.followers;
		let followersHtml = followers.map((follower, index) => {
			if(index %3 == 0) {
				const secondColumn = (index + 1) < followers.length ? <td>{followers[index + 1]}</td> : '';
				const thirdColumn = (index + 2) < followers.length ? <td>{followers[index + 2]}</td> : '';
				return (
					<tr>
						<td>{follower}</td>
						{secondColumn}
						{thirdColumn}
					</tr>
				)
			}
		});

		if(followers.length == 0) {
			if(this.state.loadingText.length > 0) {
				return <h1 style={{color:'red'}}>{this.state.loadingText}</h1>;
			}
			else {
				return <h1 style={{color:'red'}}>No followers Found for user: {this.state.user}</h1>;
			}

		}
		else {
			return (
				<div className='userFollowers'>
					<h1>List of followers for user: {this.state.user}</h1>
					<table align='center'>
						{followersHtml}
					</table>
				</div>
			);
		}

	}
}

export default UserFollowers;