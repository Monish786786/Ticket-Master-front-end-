import React from 'react'
import axios from '../../config/axios'
import { Link } from 'react-router-dom'

class CustomerList extends React.Component {
    constructor() {
        super() 
        this.state = {
            customers: []
        }
    }

    componentDidMount() {
        axios.get('/customers', {
            headers: {
                'x-auth' : localStorage.getItem('authToken')
            }
        })
        .then(response => {
            console.log(response.data)
            const customers = response.data
            this.setState({customers})
        })
    }

    handleRemove = (id) => {
        console.log(id)
        axios.delete(`/customers/${id}`,{
            headers: {
                'x-auth': localStorage.getItem('authToken')
            }
        })
            .then(response => {
                console.log(response.data)
                this.setState(prevState => {
                    return {
                        customers: prevState.customers.filter(cus => cus._id != id)
                    }
                })
            })
    }

    render() {
        console.log(this.state.customers)
        return (
            <div>
                <table className="table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>name</th>
                            <th>email</th>
                            <th>mobile</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.state.customers.map((customer,i)=>{
                                return(
                                <tr>
                                    <td>{i+1}</td>
                                <td>{customer.name}</td>
                                <td>{customer.email}</td>
                                <td>{customer.mobile}</td>
                                <button className="btn btn-primary" onClick={() => {
                            this.handleRemove(customer._id)
                        }}>Remove</button>
                        
                                    </tr>
                                )
                            
                                })
                            
                            }
                        
                    </tbody>
                   
                </table>
                {/* <h1>Listing Customers - {this.state.customers.length } </h1>
                <ul>
                    {
                        this.state.customers.map(customer => {
                        return <li key={customer._id} ><Link to={`/customers/${customer._id}`}>{customer.name}</Link> - {customer.email} - {customer.mobile} <Link to={`/customers/${customer._id}`}>show</Link> <button onClick={() => {
                            this.handleRemove(customer._id)
                        }}>Remove</button></li>
                        })
                    }
                </ul> */}

                <Link to="/customers/new" className="btn btn-secondary">Add customer</Link>
            </div>
        )
    }
}

export default CustomerList