import React from 'react'


class CustomerForm extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            name: props.name ? props.name : '',
            email: props.email ? props.email : '',
            mobile: props.mobile ? props.mobile : ''
        }
    }

    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    handleSubmit = (e) => {
        e.preventDefault()
        const formData = {
            name: this.state.name,
            email: this.state.email,
            mobile: this.state.mobile
        }
        this.props.handleSubmit(formData)
    }

    render() {
        return (
            <div>
                <h1>Form Editing Page</h1>
                <form onSubmit={this.handleSubmit}>
                    <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input type="text" value={this.state.name} id="name" name="name" className="form-control" onChange={this.handleChange} /> 

                    <label htmlFor="email">Email</label>
                    <input type="text" value={this.state.email} id="email" name="email" className="form-control" onChange={this.handleChange} /> 

                    <label htmlFor="mobile">Mobile</label>
                    <input type="text" value={this.state.mobile} id="mobile" name="mobile" className="form-control" onChange={this.handleChange} /> 

                    </div>
                   

                   
                    <input type="submit" />
                </form>
            </div>
        )
    }
}

export default CustomerForm
