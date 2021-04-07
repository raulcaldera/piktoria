import React from 'react';
import { Button } from 'reactstrap';

const Pagination = (props) => {
    let postsPerPage = props.postsPerPage;
    let totalPosts = props.totalPosts;
    let paginate = props.paginate;
    let currentPage = props.currentPage;
    let totalPages = Math.ceil(totalPosts/postsPerPage);

    const pageNumbers = [];

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
        for (let i = 1; i <= Math.ceil(totalPosts/postsPerPage); i++)  {
            pageNumbers.push(i);
        }
    }

    if (totalPages >= 5 ) {
        if (currentPage === 1) {
            return (
                <nav>
                    <ul className="pagination">
                        {pageNumbers.map(number =>
                            (number === currentPage ? (
                                <li key={number} className="page-item">
                                    <Button onClick={() => paginate(number)} className="page-link active">
                                        {number}
                                    </Button>
                                </li>
                            ):(
                                <li key={number} className="page-item">
                                    <Button onClick={() => paginate(number)} className="page-link">
                                        {number}
                                    </Button>
                                </li>
                            ))
                        )}
                        <li className="goTo">
                            <Button className="page-link">
                                ...
                            </Button>                    
                        </li>
                        <li className="nextItem">
                            <Button onClick={() => paginate(currentPage+1)} className="page-link">
                                +
                            </Button>                    
                        </li>
                        <li className="lastItem">
                            <Button onClick={() => paginate(totalPages)} className="page-link">
                                ++
                            </Button>                    
                        </li>
                    </ul>
                </nav>
            )
        } else if (currentPage > 1 && currentPage < 5 && totalPages > 5 && (currentPage + 3) < totalPages) {
            return (
                <nav>
                    <ul className="pagination">
                        <li className="lastItem">
                            <Button onClick={() => paginate(1)} className="page-link">
                                --
                            </Button>                    
                        </li>
                        <li className="prevItem">
                            <Button onClick={() => paginate(currentPage-1)} className="page-link">
                                -
                            </Button>                    
                        </li>
                        {pageNumbers.map(number =>
                            (number === currentPage ? (
                                <li key={number} className="page-item">
                                    <Button onClick={() => paginate(number)} className="page-link active">
                                        {number}
                                    </Button>
                                </li>
                            ):(
                                <li key={number} className="page-item">
                                    <Button onClick={() => paginate(number)} className="page-link">
                                        {number}
                                    </Button>
                                </li>
                            ))
                        )}
                        <li className="goTo">
                            <Button className="page-link">
                                ...
                            </Button>                    
                        </li>
                        <li className="nextItem">
                            <Button onClick={() => paginate(currentPage+1)} className="page-link">
                                +
                            </Button>                    
                        </li>
                        <li className="lastItem">
                            <Button onClick={() => paginate(totalPages)} className="page-link">
                                ++
                            </Button>                    
                        </li>
                    </ul>
                </nav>
            )
        } else if (currentPage > 1 && currentPage < 5 && totalPages > 5 && (currentPage + 3) > totalPages) {
            return (
                <nav>
                    <ul className="pagination">
                        <li className="lastItem">
                            <Button onClick={() => paginate(1)} className="page-link">
                                --
                            </Button>                    
                        </li>
                        <li className="prevItem">
                            <Button onClick={() => paginate(currentPage-1)} className="page-link">
                                -
                            </Button>                    
                        </li>
                        {pageNumbers.map(number =>
                            (number === currentPage ? (
                                <li key={number} className="page-item">
                                    <Button onClick={() => paginate(number)} className="page-link active">
                                        {number}
                                    </Button>
                                </li>
                            ):(
                                <li key={number} className="page-item">
                                    <Button onClick={() => paginate(number)} className="page-link">
                                        {number}
                                    </Button>
                                </li>
                            ))
                        )}
                        <li className="nextItem">
                            <Button onClick={() => paginate(currentPage+1)} className="page-link">
                                +
                            </Button>                    
                        </li>
                        <li className="lastItem">
                            <Button onClick={() => paginate(totalPages)} className="page-link">
                                ++
                            </Button>                    
                        </li>
                    </ul>
                </nav>
            )        
        } else if (currentPage > 4 && currentPage < (totalPages - 3)) {
            return (
                <nav>
                    <ul className="pagination">
                        <li className="lastItem">
                            <Button onClick={() => paginate(1)} className="page-link">
                                --
                            </Button>                    
                        </li>
                        <li className="prevItem">
                            <Button onClick={() => paginate(currentPage-1)} className="page-link">
                                -
                            </Button>                    
                        </li>
                        <li className="goTo">
                            <Button className="page-link">
                                ...
                            </Button>                    
                        </li>
                        {pageNumbers.map(number =>
                            (number === currentPage ? (
                                <li key={number} className="page-item">
                                    <Button onClick={() => paginate(number)} className="page-link active">
                                        {number}
                                    </Button>
                                </li>
                            ):(
                                <li key={number} className="page-item">
                                    <Button onClick={() => paginate(number)} className="page-link">
                                        {number}
                                    </Button>
                                </li>
                            ))
                        )}
                        <li className="goTo">
                            <Button className="page-link">
                                ...
                            </Button>                    
                        </li>
                        <li className="nextItem">
                            <Button onClick={() => paginate(currentPage+1)} className="page-link">
                                +
                            </Button>                    
                        </li>
                        <li className="lastItem">
                            <Button onClick={() => paginate(totalPages)} className="page-link">
                                ++
                            </Button>                    
                        </li>
                    </ul>
                </nav>
            ) 
        } else if (currentPage > (totalPages - 4) && currentPage >= 5  && currentPage < totalPages) {   
            return (
                <nav>
                    <ul className="pagination">
                        <li className="lastItem">
                            <Button onClick={() => paginate(1)} className="page-link">
                                --
                            </Button>                    
                        </li>
                        <li className="prevItem">
                            <Button onClick={() => paginate(currentPage-1)} className="page-link">
                                -
                            </Button>                    
                        </li>
                        <li className="goTo">
                            <Button className="page-link">
                                ...
                            </Button>                    
                        </li>
                        {pageNumbers.map(number =>
                            (number === currentPage ? (
                                <li key={number} className="page-item">
                                    <Button onClick={() => paginate(number)} className="page-link active">
                                        {number}
                                    </Button>
                                </li>
                            ):(
                                <li key={number} className="page-item">
                                    <Button onClick={() => paginate(number)} className="page-link">
                                        {number}
                                    </Button>
                                </li>
                            ))
                        )}
                        <li className="nextItem">
                            <Button onClick={() => paginate(currentPage+1)} className="page-link">
                                +
                            </Button>                    
                        </li>
                        <li className="lastItem">
                            <Button onClick={() => paginate(totalPages)} className="page-link">
                                ++
                            </Button>                    
                        </li>
                    </ul>
                </nav>
            )                     
        } else if (currentPage > (totalPages - 4) && currentPage < 5  && currentPage < totalPages) {   
            return (
                <nav>
                    <ul className="pagination">
                        <li className="lastItem">
                            <Button onClick={() => paginate(1)} className="page-link">
                                --
                            </Button>                    
                        </li>
                        <li className="prevItem">
                            <Button onClick={() => paginate(currentPage-1)} className="page-link">
                                -
                            </Button>                    
                        </li>
                        {pageNumbers.map(number =>
                            (number === currentPage ? (
                                <li key={number} className="page-item">
                                    <Button onClick={() => paginate(number)} className="page-link active">
                                        {number}
                                    </Button>
                                </li>
                            ):(
                                <li key={number} className="page-item">
                                    <Button onClick={() => paginate(number)} className="page-link">
                                        {number}
                                    </Button>
                                </li>
                            ))
                        )}
                        <li className="nextItem">
                            <Button onClick={() => paginate(currentPage+1)} className="page-link">
                                +
                            </Button>                    
                        </li>
                        <li className="lastItem">
                            <Button onClick={() => paginate(totalPages)} className="page-link">
                                ++
                            </Button>                    
                        </li>
                    </ul>
                </nav>
            )                     
        } else if (currentPage === totalPages) {
            return (
                <nav>
                    <ul className="pagination">
                        <li className="lastItem">
                            <Button onClick={() => paginate(1)} className="page-link">
                                --
                            </Button>                    
                        </li>
                        <li className="prevItem">
                            <Button onClick={() => paginate(currentPage-1)} className="page-link">
                                -
                            </Button>                    
                        </li>
                        <li className="goTo">
                            <Button className="page-link">
                                ...
                            </Button>                    
                        </li>
                        {pageNumbers.map(number =>
                            (number === currentPage ? (
                                <li key={number} className="page-item">
                                    <Button onClick={() => paginate(number)} className="page-link active">
                                        {number}
                                    </Button>
                                </li>
                            ):(
                                <li key={number} className="page-item">
                                    <Button onClick={() => paginate(number)} className="page-link">
                                        {number}
                                    </Button>
                                </li>
                            ))
                        )}
                    </ul>
                </nav> 
            )           
        } else {
            return (
                <nav>
                    <ul className="pagination">
                        <li className="lastItem">
                            <Button onClick={() => paginate(1)} className="page-link">
                                --
                            </Button>                    
                        </li>
                        <li className="prevItem">
                            <Button onClick={() => paginate(currentPage-1)} className="page-link">
                                -
                            </Button>                    
                        </li>
                        {pageNumbers.map(number =>
                            (number === currentPage ? (
                                <li key={number} className="page-item">
                                    <Button onClick={() => paginate(number)} className="page-link active">
                                        {number}
                                    </Button>
                                </li>
                            ):(
                                <li key={number} className="page-item">
                                    <Button onClick={() => paginate(number)} className="page-link">
                                        {number}
                                    </Button>
                                </li>
                            ))
                        )}
                        <li className="nextItem">
                            <Button onClick={() => paginate(currentPage+1)} className="page-link">
                                +
                            </Button>                    
                        </li>
                        <li className="lastItem">
                            <Button onClick={() => paginate(totalPages)} className="page-link">
                                ++
                            </Button>                    
                        </li>
                    </ul>
                </nav> 
            )             
        }
    } else if (totalPages < 5 && totalPages > 1) {
        if (currentPage === 1) {
            return (
                <nav>
                    <ul className="pagination">
                        {pageNumbers.map(number =>
                            (number === currentPage ? (
                                <li key={number} className="page-item">
                                    <Button onClick={() => paginate(number)} className="page-link active">
                                        {number}
                                    </Button>
                                </li>
                            ):(
                                <li key={number} className="page-item">
                                    <Button onClick={() => paginate(number)} className="page-link">
                                        {number}
                                    </Button>
                                </li>
                            ))
                        )}
                        <li className="nextItem">
                            <Button onClick={() => paginate(currentPage+1)} className="page-link">
                                +
                            </Button>                    
                        </li>
                        <li className="lastItem">
                            <Button onClick={() => paginate(totalPages)} className="page-link">
                                ++
                            </Button>                    
                        </li>
                    </ul>
                </nav>
            )
        } else if (currentPage === totalPages) {
            return (
                <nav>
                    <ul className="pagination">
                        <li className="lastItem">
                            <Button onClick={() => paginate(1)} className="page-link">
                                --
                            </Button>                    
                        </li>
                        <li className="prevItem">
                            <Button onClick={() => paginate(currentPage-1)} className="page-link">
                                -
                            </Button>                    
                        </li>
                        {pageNumbers.map(number =>
                            (number === currentPage ? (
                                <li key={number} className="page-item">
                                    <Button onClick={() => paginate(number)} className="page-link active">
                                        {number}
                                    </Button>
                                </li>
                            ):(
                                <li key={number} className="page-item">
                                    <Button onClick={() => paginate(number)} className="page-link">
                                        {number}
                                    </Button>
                                </li>
                            ))
                        )}
                    </ul>
                </nav> 
            )           
        } else {
            return (
                <nav>
                    <ul className="pagination">
                        <li className="lastItem">
                            <Button onClick={() => paginate(1)} className="page-link">
                                --
                            </Button>                    
                        </li>
                        <li className="prevItem">
                            <Button onClick={() => paginate(currentPage-1)} className="page-link">
                                -
                            </Button>                    
                        </li>
                        {pageNumbers.map(number =>
                            (number === currentPage ? (
                                <li key={number} className="page-item">
                                    <Button onClick={() => paginate(number)} className="page-link active">
                                        {number}
                                    </Button>
                                </li>
                            ):(
                                <li key={number} className="page-item">
                                    <Button onClick={() => paginate(number)} className="page-link">
                                        {number}
                                    </Button>
                                </li>
                            ))
                        )}
                        <li className="nextItem">
                            <Button onClick={() => paginate(currentPage+1)} className="page-link">
                                +
                            </Button>                    
                        </li>
                        <li className="lastItem">
                            <Button onClick={() => paginate(totalPages)} className="page-link">
                                ++
                            </Button>                    
                        </li>
                    </ul>
                </nav> 
            )             
        }
    } else return null;
}

export default Pagination;