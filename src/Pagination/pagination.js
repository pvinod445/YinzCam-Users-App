import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import './pagination.css';

class Pagination extends Component {
	render() {
		let paginationArr = [];
		let disableClass = this.props.currentPageNumber == 1 ? 'diabled-link' : '';

		paginationArr.push(
					<li key='prev'>
						<Link className={disableClass} to={{
							pathname: '/' + this.props.comp,
							search: '?page=' + ((+this.props.currentPageNumber) - 1)
						}}>Prev</Link>
					</li>
		);
		for(let i=+this.props.currentPageNumber; i < +(this.props.currentPageNumber) + 5; i++) {
			let styleClass = this.props.currentPageNumber == i ? 'active' : '';

			paginationArr.push(
							<li key={i}>
								<Link className={styleClass} to={{
									pathname: '/' + this.props.comp,
									search: '?page='+ i
								}}>{i}</Link>
							</li>
			);
		}
		paginationArr.push(
							<li key='next'>
								<Link to={{
									pathname: '/' + this.props.comp,
									search: '?page=' + ((+this.props.currentPageNumber) + 1)
								}}>Next</Link>
							</li>
		);
		let pagination = paginationArr.map(page => page)
		return (
			<ul className='paginationUl'>
				{pagination}
			</ul>
		)
	}
}

export default Pagination;