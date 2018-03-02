import React from 'react'
import axios from 'axios'

// We are using bootstrap as the UI library
import 'bootstrap/dist/css/bootstrap.css'

class App extends React.Component {
  constructor () {
    super(...arguments)

    this.client = axios.create({
      baseURL: '/api'
    })

    this.state = {
      about: 'loading',
      errorMessage: ''
    }
  }

  componentDidMount () {
    this.client.get('/about').then((response) => {
      this.setState({
        about: response.data
      })
    })
  }

  handleSubmit (event) {
    this.client.post('/student', {
      fname: event.target.firstName.value,
      lname: event.target.lastName.value,
      id: event.target.studentID.value,
      email: event.target.email.value
    }).then((response) => {
      window.alert('successful register')
    }).catch((error) => {
      this.setState({
        errorMessage: error.response.data['error']
      })
    })

    event.preventDefault()
  }

  render () {
    return (
      <div className='container'>
        <div className='py-5 text-center'>
          <h1>Welcome to CEIT Registerator</h1>
          <p className='lead'>
            Please fill the following form with your information
            currectly.
          </p>
        </div>
        { this.state.errorMessage !== '' &&
        <div className='alert alert-danger alert-dismissible fade show' role='alert'>
          <strong>Dear student!</strong> {this.state.errorMessage}
          <button type='button' className='close' data-dismiss='alert' aria-label='Close'>
            <span aria-hidden='true'>&times;</span>
          </button>
        </div>
        }
        <div className='row'>
          <div className='col-8'>
            <form className='needs-validation' onSubmit={(event) => this.handleSubmit(event)}>
              <div className='row'>
                <div className='col-6 mb-3'>
                  <label htmlFor='firstName'>First name</label>
                  <input type='text' className='form-control' name='firstName' id='firstName' placeholder='' required />
                  <div className='invalid-feedback' style={{width: '100%'}}>
                    Your First name is required.
                  </div>
                </div>
                <div className='col-6 mb-3'>
                  <label htmlFor='lastName'>Last name</label>
                  <input type='text' className='form-control' name='lastName' id='lastName' placeholder='' required />
                  <div className='invalid-feedback' style={{width: '100%'}}>
                    Your Last name is required.
                  </div>
                </div>
              </div>
              <div className='mb-3'>
                <label htmlFor='studentID'>StudentID</label>
                <input type='text' className='form-control' name='studentID' id='stduentID' placeholder='9231058' required />
                <div className='invalid-feedback' style={{width: '100%'}}>
                  Your StudentID is required.
                </div>
              </div>
              <div className='mb-3'>
                <label htmlFor='email'>Email</label>
                <input type='email' className='form-control' name='email' id='email' placeholder='you@example.com' required />
                <div className='invalid-feedback' style={{width: '100%'}}>
                  Your Email is required.
                </div>
              </div>
              <button className='btn btn-primary btn-lg btn-block' type='submit'>Submit</button>
            </form>
          </div>
          <div className='col-4' />
        </div>
        <hr className='mb-4' />
        <footer className='my-5 pt-5 text-muted text-center text-small'>
          <p className='mb-1'>&copy; 2018 AUT-CEIT</p>
          <ul className='list-inline'>
            <li className='list-inline-item'><a href='https://github.com/AUT-CEIT/Registerator'>Github</a></li>
            <li className='list-inline-item'><a href='mailto:parham.alvani@gmail.com'>Support</a></li>
          </ul>
        </footer>
      </div>
    )
  }
}

export default App
