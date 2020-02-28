import React from 'react'
import { Link } from 'react-router-dom'

import axios from '../../config/axios'

class EmployeeList extends React.Component {
    constructor() {
        super()
        this.state = {
            employees: []
        }
    }

    componentDidMount() {
        axios.get('/employees',{
            headers: {
                'x-auth': localStorage.getItem('authToken')
            }
        })
            .then(response => {
                // console.log(response.data)
                const employees = response.data
                this.setState({employees})
            })
            .catch(err => {
                alert(err)
            })
    }

    handleRemove = (id) => {
        axios.delete(`/employees/${id}`,{
            headers: {
                'x-auth': localStorage.getItem('authToken')
            }
        })
            .then(response => {
                console.log('removing',response.data)
                this.setState(prevState => {
                    return {
                        employees: prevState.employees.filter(emp => emp._id !== id)
                    }
                })
            })
    }

    render() {
        console.log('emp',this.state.employees)
        return (
            <div>
                <h2>Employee List Page - {this.state.employees.length}</h2>
                {/* <table className="table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>name</th>
                            <th>email</th>
                            <th>mobile</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            {
                                this.state.employee.map((emp, i)=>{
                                    return(
                                        
                                    <td>{i+1}</td>
                                    <td>{emp.name}</td>
                                    <td>{emp.email}</td>
                                    <td>{emp.mobile}</td>
                                    <td>{emp.department ? emp.department.name : 'uncatagorized'} </td>
                                    
                                    )
                                })
                            }

                        </tr>
                    </tbody>
                </table> */}

                  <ul className="list-group">
                    {
                        this.state.employees.map(emp => {
                            return <li  className="list-group-items" key={emp._id}>{emp.name} - {emp.email} - {emp.mobile} - {emp.department ? emp.department.name : 'uncatagorized'} <Link to={`employees/${emp._id}`}>show</Link> <button className="btn btn-danger" onClick={() => {
                                this.handleRemove(emp._id)
                            }}>Remove</button>
                            </li>
                        })
                    }
                </ul>

                <Link className="btn btn-secondary" to="/employees/new">Add Employee</Link>
            </div>
        )
    }
}

export default EmployeeList