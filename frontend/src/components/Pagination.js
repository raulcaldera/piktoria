import React, { useState } from 'react';
import { Button, Popover, PopoverHeader, PopoverBody, Form, FormGroup, Label, Input } from 'reactstrap';

const Pagination = (props) => {
    let postsPerPage = props.postsPerPage;
    let totalPosts = props.totalPosts;
    let paginate = props.paginate;
    let currentPage = props.currentPage;
    let totalPages = Math.ceil(totalPosts/postsPerPage);

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
                <div>
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
                            <Button id="PopoverLegacy" className="page-link">
                                ...
                            </Button>
                            <Popover trigger="legacy" placement="bottom" isOpen={rightPopoverOpen} target="PopoverLegacy" toggle={toggleRightPopover}>
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
                                        <Button type="submit" value="submit" color="primary">Go</Button>
                                    </Form>
                                </PopoverBody>
                            </Popover>                    
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
                </div>
            )
        } else if (currentPage > 1 && currentPage < 5 && totalPages > 5 && (currentPage + 3) < totalPages) {
            return (
                <div>
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
                            <Button id="PopoverLegacy" className="page-link">
                                ...
                            </Button> 
                            <Popover trigger="legacy" placement="bottom" isOpen={rightPopoverOpen} target="PopoverLegacy" toggle={toggleRightPopover}>
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
                                        <Button type="submit" value="submit" color="primary">Go</Button>
                                    </Form>
                                </PopoverBody>
                            </Popover>                                                
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
                </div>
            )
        } else if (currentPage > 1 && currentPage < 5 && totalPages > 5 && (currentPage + 3) > totalPages) {
            return (
                <div>
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
                </div>
            )        
        } else if (currentPage > 4 && currentPage < (totalPages - 3)) {
            return (
                <div>
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
                            <Button id="PopoverLegacy" className="page-link">
                                ...
                            </Button>  
                            <Popover trigger="legacy" placement="bottom" isOpen={leftPopoverOpen} target="PopoverLegacy" toggle={toggleLeftPopover}>
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
                                        <Button type="submit" value="submit" color="primary">Go</Button>
                                    </Form>
                                </PopoverBody>
                            </Popover>                                               
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
                            <Button id="PopoverLegacy" className="page-link">
                                ...
                            </Button>  
                            <Popover trigger="legacy" placement="bottom" isOpen={rightPopoverOpen} target="PopoverLegacy" toggle={toggleRightPopover}>
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
                                        <Button type="submit" value="submit" color="primary">Go</Button>
                                    </Form>
                                </PopoverBody>
                            </Popover>                                               
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
                </div>
            ) 
        } else if (currentPage > (totalPages - 4) && currentPage >= 5  && currentPage < totalPages) {   
            return (
                <div>
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
                            <Button id="PopoverLegacy" className="page-link">
                                ...
                            </Button>    
                            <Popover trigger="legacy" placement="bottom" isOpen={leftPopoverOpen} target="PopoverLegacy" toggle={toggleLeftPopover}>
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
                                        <Button type="submit" value="submit" color="primary">Go</Button>
                                    </Form>
                                </PopoverBody>
                            </Popover>                                             
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
                </div>
            )                     
        } else if (currentPage > (totalPages - 4) && currentPage < 5  && currentPage < totalPages) {   
            return (
                <div>
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
                </div>
            )                     
        } else if (currentPage === totalPages) {
            return (
                <div>
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
                            <Button id="PopoverLegacy" className="page-link">
                                ...
                            </Button>       
                            <Popover trigger="legacy" placement="bottom" isOpen={leftPopoverOpen} target="PopoverLegacy" toggle={toggleLeftPopover}>
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
                                        <Button type="submit" value="submit" color="primary">Go</Button>
                                    </Form>
                                </PopoverBody>
                            </Popover>                                          
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
                </div> 
            )           
        } else {
            return (
                <div>
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
                </div> 
            )             
        }
    } else if (totalPages < 5 && totalPages > 1) {
        if (currentPage === 1) {
            return (
                <div>
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
                </div>
            )
        } else if (currentPage === totalPages) {
            return (
                <div>
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
                </div> 
            )           
        } else {
            return (
                <div>
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
                </div> 
            )             
        }
    } else return null;
}

export default Pagination;