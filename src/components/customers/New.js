import React from 'react' 
import axios from '../../config/axios'

import CustomerForm from './Form'

import Swal from 'sweetalert2'

class CustomerNew extends React.Component {
    handleSubmit = (formData) => {
        axios.post('/customers', formData, {
            headers: {
                'x-auth': localStorage.getItem('authToken')
            }
        })
        .then(response => {
            console.log(response.data)
            if(response.data.hasOwnProperty('errors')) {
                alert(response.data.message)
                Swal.fire('Opps!!!', 'Your data is not added successfully.', 'error')
            }else {
                this.props.history.push('/customers')
                Swal.fire('Good', 'Your data is successfully added.','success')
            }
        })
    }

    render() {
        return (
            <div> 
                <h1>Add Customer</h1>

                <CustomerForm className="btn btn-primary" handleSubmit={this.handleSubmit} />
                
            </div>
        )
    }
}

export default CustomerNew