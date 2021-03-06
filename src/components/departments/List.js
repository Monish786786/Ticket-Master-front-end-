import React from 'react'
import axios from 'axios'
import Swal from 'sweetalert2'

import DepartmentNew from './New'
import { Link } from 'react-router-dom'

class DepartmentList extends React.Component {
    constructor() {
        super() 
        this.state = {
            departments: [],
        }
    }

    componentDidMount() {
        axios.get('http://dct-ticket-master.herokuapp.com/departments',{
            headers: {
                'x-auth': localStorage.getItem('authToken')
            }
        })
            .then(response => {
                console.log(response.data)
                
                const departments = response.data
                this.setState({departments})
            })
    }


    handleSubmit = (input) => {
        
        // console.log(this.state.input)
        const department = {
            name: input
        }
        axios.post('http://dct-ticket-master.herokuapp.com/departments',department,{
            headers: {
                'x-auth': localStorage.getItem('authToken')
            }
        })
        // handle the validation here
            .then(response => {
                // console.log('hanldesubmit',response.data)
                const department = response.data
                if(response.data.hasOwnProperty('errors')) {
                    Swal.fire('Opp!!!','Form not submitted properly.', 'error' )
                    alert(response.data.message)
                }else {
                    this.setState(prevState => {
                        return (
                            {
                                departments: [].concat(prevState.departments,department),
                                input: ''
                            }
                        )
                    })
                    Swal.fire('Good Job', 'Succesfully added department', 'success' )
                }
            })
            .catch(err => {
                alert(err)
            })
    }

    handleRemove = (id) => {
        // console.log('removing')
        // axios.delete(`http://dct-ticket-master.herokuapp.com/departments/${id}`,{
        //         headers: {
        //             'x-auth': localStorage.getItem('authToken')
        //         }
        // })
        //     .then(response => {
        //         console.log(response.data)
        //     })
        //     .catch(err => {
        //         alert(err)
        //     }) 
        /*
        try this
        axios.get('/post/id')
            .then(posts => {
            return axios.get('/users/post.id')
            })  
            .then(users => {
                
            })
            .catch(err)
         */
        const confirmation = window.confirm("All the employees belong to this department will be moved to uncatagorized department")
            if(confirmation){
                const findingUncatdep = this.state.departments.find(dep => dep.name == 'uncatagorized')
                    if(findingUncatdep){
                        if(findingUncatdep._id == id){
                            alert('you cannot remove Uncatagorized Department')
                            window.location.reload()
                        }
                        const uncatId = findingUncatdep._id
                        axios.get('http://dct-ticket-master.herokuapp.com/employees', {
                            headers: {
                                'x-auth': localStorage.getItem('authToken')
                            }
                        })
                            .then(response => {
                                // console.log(response.data, 'under if')
                                const employees = response.data
                                console.log(employees)
                                const uncatagorizedEmp = employees.filter(emp => (emp.department && emp.department._id) == id)
                                console.log(uncatagorizedEmp)
                                const promises = []
                                uncatagorizedEmp.forEach(unc => {
                                    unc.department.name = 'uncatagorized'
                                    unc.department._id = `${uncatId}`
                                    console.log(unc)
                                    promises.push(axios.put(`http://dct-ticket-master.herokuapp.com/employees/${unc._id}`, unc, {
                                        headers: {
                                            'x-auth': localStorage.getItem('authToken')
                                        }
                                    }))
                                })                     
                                axios.all(promises)
                                    .then(response => {
                                        console.log(response)
                                        window.location.reload()
                                    })
                                    .catch(err => {
                                        alert(err)
                                    })
                            }) 
                               
                                axios.delete(`http://dct-ticket-master.herokuapp.com/departments/${id}`,{
                                        headers: {
                                            'x-auth': localStorage.getItem('authToken')
                                        }
                                })
                                    .then(response => {
                                        console.log(response.data)
                                    .catch(err => {
                                        alert(err)
                                    })   
                            })
                            .catch(err => {
                                alert(err)
                            })
                            
                    } else {
                        // console.log('didn\'t found uncat')
                        axios.get('http://dct-ticket-master.herokuapp.com/employees', {
                            headers: {
                                'x-auth': localStorage.getItem('authToken')
                            }
                        })
                            .then(response => {
                                const employees = response.data
                                console.log(employees)
                                const uncatagorizedEmp = employees.filter(emp => (emp.department && emp.department._id) == id)
                                console.log(uncatagorizedEmp)
                                if(uncatagorizedEmp.length == 0){
                                    alert('No emp in this dep')
                                    axios.delete(`http://dct-ticket-master.herokuapp.com/departments/${id}`,{
                                        headers: {
                                            'x-auth': localStorage.getItem('authToken')
                                        }
                                    })
                                        .then(response => {
                                            // console.log(response.data)
                                            this.setState(prevState => {
                                                return ({
                                                    departments: prevState.departments.filter(dep => dep._id !== id)
                                                })
                                            })
                                        })
                                        .catch(err => {
                                            alert(err)
                                        })
                                } else {
                                    const department = {
                                        name: 'uncatagorized'
                                    }
                                    axios.post('http://dct-ticket-master.herokuapp.com/departments', department, {
                                        headers: {
                                            'x-auth': localStorage.getItem('authToken')
                                        }
                                    })
                                        .then(response => {
                                            console.log(response.data, 'making ucat dep')
                                            const uncatId = response.data._id
                                            alert(`${uncatagorizedEmp.length} employee will move to uncatagorized department`)
                                            const promises = []
                                            console.log('moving')
                                            uncatagorizedEmp.forEach(unc => {
                                                unc.department.name = 'uncatagorized'
                                                unc.department._id = uncatId
                                                console.log(unc)
                                                promises.push(axios.put(`http://dct-ticket-master.herokuapp.com/employees/${unc._id}`, unc, {
                                                    headers: {
                                                        'x-auth': localStorage.getItem('authToken')
                                                    }
                                                }))
                                            })
                                            axios.all(promises)
                                                .then(response => {
                                                    console.log(response)
                                                    window.location.reload()
                                                })
                                                .catch(err => {
                                                    alert(err)
                                                })
                                        })
                                        .catch(err => {
                                            alert(err)
                                        })
                                }
                            })
                            .catch(err => {
                                alert(err)
                            })
                    }
            } else {
                alert('wise Choise')
            }
    }

    render() {
        return (
            
                <div className="row">
                    <div className="col-md-8">
                    <h2>Department Show Page - {this.state.departments.length}</h2>
                <ul className="list-group">
                    {
                        this.state.departments.map(dep => {
                            return <li className="list-group-items text-uppercase" key={dep._id}>{dep.name} <Link to={`/departments/${dep._id}`}>show</Link> <button className="btn btn-danger float-right btn-sm" onClick={() => {
                                this.handleRemove(dep._id)
                            }}>Remove</button></li>
                        })
                    }
                </ul>
                    </div>
                    <div className="col-md-4">
                        
                    <h2>Add Department</h2>

                <DepartmentNew handleSubmit={this.handleSubmit}/>
                        
                    
                </div>
                {/* {/* <h2>Department Show Page - {this.state.departments.length}</h2>
                <ul>
                    {
                        this.state.departments.map(dep => {
                            return <li key={dep._id}>{dep.name} <Link to={`/departments/${dep._id}`}>show</Link> <button onClick={() => {
                                this.handleRemove(dep._id)
                            }}>Remove</button></li>
                        })
                    }
                </ul> */}
                <hr/> 
{/* 
                <h2>Add Department</h2>

                <DepartmentNew handleSubmit={this.handleSubmit}/> */}
                  
            </div>
        )
    }
}

export default DepartmentList