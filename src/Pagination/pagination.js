import React, { Component } from 'react';
import { Route, Link, NavLink } from 'react-router-dom';

import './pagination.css';

class Pagination extends Component {
	render() {
		let paginationArr = [];
		paginationArr.push(
					<li>
						<NavLink to={{
							pathname: '/' + this.props.comp,
							search: '?page=' + ((+this.props.currentPageNumber) - 1)
						}} >Prev</NavLink>
					</li>
		);
		for(let i=+this.props.currentPageNumber; i < +(this.props.currentPageNumber) + 5; i++) {
			paginationArr.push(
							<li>
								<NavLink to={{
									pathname: '/' + this.props.comp,
									search: '?page='+ i
								}} >{i}</NavLink>
							</li>
			);
		}
		paginationArr.push(
							<li>
								<NavLink to={{
									pathname: '/' + this.props.comp,
									search: '?page=' + ((+this.props.currentPageNumber) + 1)
								}} >Next</NavLink>
							</li>
		);
		let pagination = paginationArr.map(page => page)
		return (
			<nav className='paginationUl'>
				<ul>
					{pagination}
				</ul>
			</nav>
		)
	}
}

export default Pagination;