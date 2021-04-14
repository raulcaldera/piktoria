import React, { useState } from 'react';
import { Popover, PopoverHeader, PopoverBody, Form, FormGroup, Label, Input } from 'reactstrap';
import styles from "./Pagination.module.css";

const Pagination = (props) => {
	const postsPerPage = props.postsPerPage;
	const totalPosts = props.totalPosts;
	const paginate = props.paginate;
	const currentPage = props.currentPage;
	const totalPages = Math.ceil(totalPosts/postsPerPage);

	const [leftPopoverOpen, setLeftPopoverOpen] = useState(false);
	const [rightPopoverOpen, setRightPopoverOpen] = useState(false);
	const [goToPage, setGoToPage] = useState(1);

	const toggleLeftPopover = () => setLeftPopoverOpen(!leftPopoverOpen);
	const toggleRightPopover = () => setRightPopoverOpen(!rightPopoverOpen);

	const pageNumbers = [];
	const totalPageNumbers = [];

	const handleGoToInputChange = (event) => {
		setGoToPage(parseInt(event.target.value));
	}     

	const handleGoTo = (event) => {
		event.preventDefault();
		console.log(goToPage);
		console.log(typeof(goToPage));
		setLeftPopoverOpen(false);
		setRightPopoverOpen(false);
		paginate(goToPage);
	}

	if (totalPages >= 5) {
		if (currentPage < 5 && totalPages >= (currentPage + 3)) {
			for (let i = 1; i <= currentPage + 3; i++)  {
				pageNumbers.push(i);
			}
		} else if (currentPage < 5 && totalPages < (currentPage + 3)) {
			for (let i = 1; i <= totalPages; i++)  {
				pageNumbers.push(i);
			}
		} else if (currentPage > (totalPages - 4) && currentPage > 4) {
			for (let i = (currentPage - 3); i <= totalPages; i++)  {
				pageNumbers.push(i);
			}   
		} else {
			for (let i = (currentPage - 3); i <= (currentPage + 3); i++)  {
				pageNumbers.push(i);
			}
		}
	} else {
		for (let i = 1; i <= totalPages; i++)  {
			pageNumbers.push(i);
		}
	}

	for (let i = 1; i <= totalPages; i++)  {
		totalPageNumbers.push(i);
	}

	if (totalPages >= 5 ) {
		if (currentPage === 1) {
			return (
				<div className={styles.paginationContainer}>
					<ul className="pagination">
						{pageNumbers.map(number =>
							(number === currentPage ? (
								<li key={number} className={styles.pageItem}>
									<button onClick={() => paginate(number)} className={`${styles.pageLink} ${styles.active}`}>
										{number}
									</button>
								</li>
							):(
								<li key={number} className={styles.pageItem}>
									<button onClick={() => paginate(number)} className={styles.pageLink}>
										{number}
									</button>
								</li>
							))
						)}
						<li className={styles.pageItem}>
							<button id="PopoverLegacy" className={styles.pageLink}>
								...
							</button>
							<Popover trigger="legacy" placement="top" isOpen={rightPopoverOpen} target="PopoverLegacy" toggle={toggleRightPopover}>
								<PopoverHeader>Go To</PopoverHeader>
								<PopoverBody>
									<Form onSubmit={handleGoTo}>
										<FormGroup>
											<Label htmlFor="page">Page</Label>
											<Input type="select" onChange={handleGoToInputChange} name="select">
												{totalPageNumbers.map(number => (
													<option key={number} value={number}>{number}</option>
												))}
											</Input>
										</FormGroup>
										<button type="submit" value="submit" color="primary">Go</button>
									</Form>
								</PopoverBody>
							</Popover>                    
						</li>
						<li className={styles.nextItem}>
							<button onClick={() => paginate(currentPage+1)} className={styles.pageLink}>
								<i className="fas fa-angle-right"></i>
							</button>                    
						</li>
						<li className={styles.lastItem}>
							<button onClick={() => paginate(totalPages)} className={styles.pageLink}>
								<i className="fas fa-angle-double-right"></i>
							</button>                    
						</li>
					</ul>
				</div>
			)
		} else if (currentPage > 1 && currentPage < 5 && totalPages > 5 && (currentPage + 3) < totalPages) {
			return (
				<div className={styles.paginationContainer}>
					<ul className="pagination">
						<li className={styles.firstItem}>
							<button onClick={() => paginate(1)} className={styles.pageLink}>
								<i className="fas fa-angle-double-left"></i>
							</button>                    
						</li>
						<li className={styles.prevItem}>
							<button onClick={() => paginate(currentPage-1)} className={styles.pageLink}>
								<i className="fas fa-angle-left"></i>
							</button>                    
						</li>
						{pageNumbers.map(number =>
							(number === currentPage ? (
								<li key={number} className={styles.pageItem}>
									<button onClick={() => paginate(number)} className={`${styles.pageLink} ${styles.active}`}>
										{number}
									</button>
								</li>
							):(
								<li key={number} className={styles.pageItem}>
									<button onClick={() => paginate(number)} className={styles.pageLink}>
										{number}
									</button>
								</li>
							))
						)}
						<li className={styles.pageItem}>
							<button id="PopoverLegacy" className={styles.pageLink}>
								...
							</button> 
							<Popover trigger="legacy" placement="top" isOpen={rightPopoverOpen} target="PopoverLegacy" toggle={toggleRightPopover}>
								<PopoverHeader>Go To</PopoverHeader>
								<PopoverBody>
									<Form onSubmit={handleGoTo}>
										<FormGroup>
											<Label htmlFor="page">Page</Label>
											<Input type="select" onChange={handleGoToInputChange} name="select">
												{totalPageNumbers.map(number => (
													<option key={number} value={number}>{number}</option>
												))}
											</Input>
										</FormGroup>
										<button type="submit" value="submit" color="primary">Go</button>
									</Form>
								</PopoverBody>
							</Popover>                                                
						</li>
						<li className={styles.nextItem}>
							<button onClick={() => paginate(currentPage+1)} className={styles.pageLink}>
								<i className="fas fa-angle-right"></i>
							</button>                    
						</li>
						<li className={styles.lastItem}>
							<button onClick={() => paginate(totalPages)} className={styles.pageLink}>
								<i className="fas fa-angle-double-right"></i>
							</button>                    
						</li>
					</ul>
				</div>
			)
		} else if (currentPage > 1 && currentPage < 5 && totalPages > 5 && (currentPage + 3) > totalPages) {
			return (
				<div className={styles.paginationContainer}>
					<ul className="pagination">
						<li className={styles.firstItem}>
							<button onClick={() => paginate(1)} className={styles.pageLink}>
								<i className="fas fa-angle-double-left"></i>
							</button>                    
						</li>
						<li className={styles.prevItem}>
							<button onClick={() => paginate(currentPage-1)} className={styles.pageLink}>
								<i className="fas fa-angle-left"></i>
							</button>                    
						</li>
						{pageNumbers.map(number =>
							(number === currentPage ? (
								<li key={number} className={styles.pageItem}>
									<button onClick={() => paginate(number)} className={`${styles.pageLink} ${styles.active}`}>
										{number}
									</button>
								</li>
							):(
								<li key={number} className={styles.pageItem}>
									<button onClick={() => paginate(number)} className={styles.pageLink}>
										{number}
									</button>
								</li>
							))
						)}
						<li className={styles.nextItem}>
							<button onClick={() => paginate(currentPage+1)} className={styles.pageLink}>
								<i className="fas fa-angle-right"></i>
							</button>                    
						</li>
						<li className={styles.lastItem}>
							<button onClick={() => paginate(totalPages)} className={styles.pageLink}>
								<i className="fas fa-angle-double-right"></i>
							</button>                    
						</li>
					</ul>
				</div>
			)        
		} else if (currentPage > 4 && currentPage < (totalPages - 3)) {
			return (
				<div className={styles.paginationContainer}>
					<ul className="pagination">
						<li className={styles.firstItem}>
							<button onClick={() => paginate(1)} className={styles.pageLink}>
								<i className="fas fa-angle-double-left"></i>
							</button>                    
						</li>
						<li className={styles.prevItem}>
							<button onClick={() => paginate(currentPage-1)} className={styles.pageLink}>
								<i className="fas fa-angle-left"></i>
							</button>                    
						</li>
						<li className={styles.pageItem}>
							<button id="PopoverLegacy" className={styles.pageLink}>
								...
							</button>  
							<Popover trigger="legacy" placement="top" isOpen={leftPopoverOpen} target="PopoverLegacy" toggle={toggleLeftPopover}>
								<PopoverHeader>Go To</PopoverHeader>
								<PopoverBody>
									<Form onSubmit={handleGoTo}>
										<FormGroup>
											<Label htmlFor="page">Page</Label>
											<Input type="select" onChange={handleGoToInputChange} name="select">
												{totalPageNumbers.map(number => (
													<option key={number} value={number}>{number}</option>
												))}
											</Input>
										</FormGroup>
										<button type="submit" value="submit" color="primary">Go</button>
									</Form>
								</PopoverBody>
							</Popover>                                               
						</li>
						{pageNumbers.map(number =>
							(number === currentPage ? (
								<li key={number} className={styles.pageItem}>
									<button onClick={() => paginate(number)} className={`${styles.pageLink} ${styles.active}`}>
										{number}
									</button>
								</li>
							):(
								<li key={number} className={styles.pageItem}>
									<button onClick={() => paginate(number)} className={styles.pageLink}>
										{number}
									</button>
								</li>
							))
						)}
						<li className={styles.pageItem}>
							<button id="PopoverLegacy" className={styles.pageLink}>
								...
							</button>  
							<Popover trigger="legacy" placement="top" isOpen={rightPopoverOpen} target="PopoverLegacy" toggle={toggleRightPopover}>
								<PopoverHeader>Go To</PopoverHeader>
								<PopoverBody>
									<Form onSubmit={handleGoTo}>
										<FormGroup>
											<Label htmlFor="page">Page</Label>
											<Input type="select" onChange={handleGoToInputChange} name="select">
												{totalPageNumbers.map(number => (
													<option key={number} value={number}>{number}</option>
												))}
											</Input>
										</FormGroup>
										<button type="submit" value="submit" color="primary">Go</button>
									</Form>
								</PopoverBody>
							</Popover>                                               
						</li>
						<li className={styles.nextItem}>
							<button onClick={() => paginate(currentPage+1)} className={styles.pageLink}>
								<i className="fas fa-angle-right"></i>
							</button>                    
						</li>
						<li className={styles.lastItem}>
							<button onClick={() => paginate(totalPages)} className={styles.pageLink}>
								<i className="fas fa-angle-double-right"></i>
							</button>                    
						</li>
					</ul>
				</div>
			) 
		} else if (currentPage > (totalPages - 4) && currentPage >= 5  && currentPage < totalPages) {   
			return (
				<div className={styles.paginationContainer}>
					<ul className="pagination">
						<li className={styles.firstItem}>
							<button onClick={() => paginate(1)} className={styles.pageLink}>
								<i className="fas fa-angle-double-left"></i>
							</button>                    
						</li>
						<li className={styles.prevItem}>
							<button onClick={() => paginate(currentPage-1)} className={styles.pageLink}>
								<i className="fas fa-angle-left"></i>
							</button>                    
						</li>
						<li className={styles.pageItem}>
							<button id="PopoverLegacy" className={styles.pageLink}>
								...
							</button>    
							<Popover trigger="legacy" placement="top" isOpen={leftPopoverOpen} target="PopoverLegacy" toggle={toggleLeftPopover}>
								<PopoverHeader>Go To</PopoverHeader>
								<PopoverBody>
									<Form onSubmit={handleGoTo}>
										<FormGroup>
											<Label htmlFor="page">Page</Label>
											<Input type="select" onChange={handleGoToInputChange} name="select">
												{totalPageNumbers.map(number => (
													<option key={number} value={number}>{number}</option>
												))}
											</Input>
										</FormGroup>
										<button type="submit" value="submit" color="primary">Go</button>
									</Form>
								</PopoverBody>
							</Popover>                                             
						</li>
						{pageNumbers.map(number =>
							(number === currentPage ? (
								<li key={number} className={styles.pageItem}>
									<button onClick={() => paginate(number)} className={`${styles.pageLink} ${styles.active}`}>
										{number}
									</button>
								</li>
							):(
								<li key={number} className={styles.pageItem}>
									<button onClick={() => paginate(number)} className={styles.pageLink}>
										{number}
									</button>
								</li>
							))
						)}
						<li className={styles.nextItem}>
							<button onClick={() => paginate(currentPage+1)} className={styles.pageLink}>
								<i className="fas fa-angle-right"></i>
							</button>                    
						</li>
						<li className={styles.lastItem}>
							<button onClick={() => paginate(totalPages)} className={styles.pageLink}>
								<i className="fas fa-angle-double-right"></i>
							</button>                    
						</li>
					</ul>
				</div>
			)                     
		} else if (currentPage > (totalPages - 4) && currentPage < 5  && currentPage < totalPages) {   
			return (
				<div className={styles.paginationContainer}>
					<ul className="pagination">
						<li className={styles.firstItem}>
							<button onClick={() => paginate(1)} className={styles.pageLink}>
								<i className="fas fa-angle-double-left"></i>
							</button>                    
						</li>
						<li className={styles.prevItem}>
							<button onClick={() => paginate(currentPage-1)} className={styles.pageLink}>
								<i className="fas fa-angle-left"></i>
							</button>                    
						</li>
						{pageNumbers.map(number =>
							(number === currentPage ? (
								<li key={number} className={styles.pageItem}>
									<button onClick={() => paginate(number)} className={`${styles.pageLink} ${styles.active}`}>
										{number}
									</button>
								</li>
							):(
								<li key={number} className={styles.pageItem}>
									<button onClick={() => paginate(number)} className={styles.pageLink}>
										{number}
									</button>
								</li>
							))
						)}
						<li className={styles.nextItem}>
							<button onClick={() => paginate(currentPage+1)} className={styles.pageLink}>
								<i className="fas fa-angle-right"></i>
							</button>                    
						</li>
						<li className={styles.lastItem}>
							<button onClick={() => paginate(totalPages)} className={styles.pageLink}>
								<i className="fas fa-angle-double-right"></i>
							</button>                    
						</li>
					</ul>
				</div>
			)                     
		} else if (currentPage === totalPages) {
			return (
				<div className={styles.paginationContainer}>
					<ul className="pagination">
						<li className={styles.firstItem}>
							<button onClick={() => paginate(1)} className={styles.pageLink}>
								<i className="fas fa-angle-double-left"></i>
							</button>                    
						</li>
						<li className={styles.prevItem}>
							<button onClick={() => paginate(currentPage-1)} className={styles.pageLink}>
								<i className="fas fa-angle-left"></i>
							</button>                    
						</li>
						<li className={styles.pageItem}>
							<button id="PopoverLegacy" className={styles.pageLink}>
								...
							</button>       
							<Popover trigger="legacy" placement="top" isOpen={leftPopoverOpen} target="PopoverLegacy" toggle={toggleLeftPopover}>
								<PopoverHeader>Go To</PopoverHeader>
								<PopoverBody>
									<Form onSubmit={handleGoTo}>
										<FormGroup>
											<Label htmlFor="page">Page</Label>
											<Input type="select" onChange={handleGoToInputChange} name="select">
												{totalPageNumbers.map(number => (
													<option key={number} value={number}>{number}</option>
												))}
											</Input>
										</FormGroup>
										<button type="submit" value="submit" color="primary">Go</button>
									</Form>
								</PopoverBody>
							</Popover>                                          
						</li>
						{pageNumbers.map(number =>
							(number === currentPage ? (
								<li key={number} className={styles.pageItem}>
									<button onClick={() => paginate(number)} className={`${styles.pageLink} ${styles.active}`}>
										{number}
									</button>
								</li>
							):(
								<li key={number} className={styles.pageItem}>
									<button onClick={() => paginate(number)} className={styles.pageLink}>
										{number}
									</button>
								</li>
							))
						)}
					</ul>
				</div> 
			)           
		} else {
			return (
				<div className={styles.paginationContainer}>
					<ul className="pagination">
						<li className={styles.firstItem}>
							<button onClick={() => paginate(1)} className={styles.pageLink}>
								<i className="fas fa-angle-double-left"></i>
							</button>                    
						</li>
						<li className={styles.prevItem}>
							<button onClick={() => paginate(currentPage-1)} className={styles.pageLink}>
								<i className="fas fa-angle-left"></i>
							</button>                    
						</li>
						{pageNumbers.map(number =>
							(number === currentPage ? (
								<li key={number} className={styles.pageItem}>
									<button onClick={() => paginate(number)} className={`${styles.pageLink} ${styles.active}`}>
										{number}
									</button>
								</li>
							):(
								<li key={number} className={styles.pageItem}>
									<button onClick={() => paginate(number)} className={styles.pageLink}>
										{number}
									</button>
								</li>
							))
						)}
						<li className={styles.nextItem}>
							<button onClick={() => paginate(currentPage+1)} className={styles.pageLink}>
								<i className="fas fa-angle-right"></i>
							</button>                    
						</li>
						<li className={styles.lastItem}>
							<button onClick={() => paginate(totalPages)} className={styles.pageLink}>
								<i className="fas fa-angle-double-right"></i>
							</button>                    
						</li>
					</ul>
				</div> 
			)             
		}
	} else if (totalPages < 5 && totalPages > 1) {
		if (currentPage === 1) {
			return (
				<div className={styles.paginationContainer}>
					<ul className="pagination">
						{pageNumbers.map(number =>
							(number === currentPage ? (
								<li key={number} className={styles.pageItem}>
									<button onClick={() => paginate(number)} className={`${styles.pageLink} ${styles.active}`}>
										{number}
									</button>
								</li>
							):(
								<li key={number} className={styles.pageItem}>
									<button onClick={() => paginate(number)} className={styles.pageLink}>
										{number}
									</button>
								</li>
							))
						)}
						<li className={styles.nextItem}>
							<button onClick={() => paginate(currentPage+1)} className={styles.pageLink}>
								<i className="fas fa-angle-right"></i>
							</button>                    
						</li>
						<li className={styles.lastItem}>
							<button onClick={() => paginate(totalPages)} className={styles.pageLink}>
								<i className="fas fa-angle-double-right"></i>
							</button>                    
						</li>
					</ul>
				</div>
			)
		} else if (currentPage === totalPages) {
			return (
				<div className={styles.paginationContainer}>
					<ul className="pagination">
						<li className={styles.firstItem}>
							<button onClick={() => paginate(1)} className={styles.pageLink}>
								<i className="fas fa-angle-double-left"></i>
							</button>                    
						</li>
						<li className={styles.prevItem}>
							<button onClick={() => paginate(currentPage-1)} className={styles.pageLink}>
								<i className="fas fa-angle-left"></i>
							</button>                    
						</li>
						{pageNumbers.map(number =>
							(number === currentPage ? (
								<li key={number} className={styles.pageItem}>
									<button onClick={() => paginate(number)} className={`${styles.pageLink} ${styles.active}`}>
										{number}
									</button>
								</li>
							):(
								<li key={number} className={styles.pageItem}>
									<button onClick={() => paginate(number)} className={styles.pageLink}>
										{number}
									</button>
								</li>
							))
						)}
					</ul>
				</div> 
			)           
		} else {
			return (
				<div className={styles.paginationContainer}>
					<ul className="pagination">
						<li className={styles.firstItem}>
							<button onClick={() => paginate(1)} className={styles.pageLink}>
								<i className="fas fa-angle-double-left"></i>
							</button>                    
						</li>
						<li className={styles.prevItem}>
							<button onClick={() => paginate(currentPage-1)} className={styles.pageLink}>
								<i className="fas fa-angle-left"></i> 
							</button>                    
						</li>
						{pageNumbers.map(number =>
							(number === currentPage ? (
								<li key={number} className={styles.pageItem}>
									<button onClick={() => paginate(number)} className={`${styles.pageLink} ${styles.active}`}>
										{number}
									</button>
								</li>
							):(
								<li key={number} className={styles.pageItem}>
									<button onClick={() => paginate(number)} className={styles.pageLink}>
										{number}
									</button>
								</li>
							))
						)}
						<li className={styles.nextItem}>
							<button onClick={() => paginate(currentPage+1)} className={styles.pageLink}>
								<i className="fas fa-angle-right"></i>
							</button>                    
						</li>
						<li className={styles.lastItem}>
							<button onClick={() => paginate(totalPages)} className={styles.pageLink}>
								<i className="fas fa-angle-double-right"></i>
							</button>                    
						</li>
					</ul>
				</div> 
			)             
		}
	} else return null;
}

export default Pagination;