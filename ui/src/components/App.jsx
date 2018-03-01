import React from 'react'
import axios from 'axios'

// We are using bootstrap as the UI library
import 'bootstrap/dist/css/bootstrap.css'

class App extends React.Component {
  constructor () {
    super()

    this.client = axios.create({
      baseURL: `${window.location.href}api`
    })

    this.state = {
      about: 'loading'
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
    event.preventDefault();
  }

  render () {
    return (
      <div className="container">
        <div className="py-5 text-center">
          <h1>Welcome to CEIT Registerator</h1>
          <h2>{this.state.about}</h2>
          <p className="lead">
            Please fill the following form with your information
            currectly.
          </p>
        </div>
        <div className="row">
          <div className="col-8">
            <form className="needs-validation" onSubmit={this.handleSubmit}>
              <div className="row">
                <div className="col-6 mb-3">
                  <label htmlFor="firstName">First name</label>
                  <input type="text" className="form-control" id="firstName" placeholder="" value="" required></input>
                </div>
                <div className="col-6 mb-3">
                  <label htmlFor="lastName">Last name</label>
                  <input type="text" className="form-control" id="lastName" placeholder="" value="" required></input>
                </div>
              </div>
            </form>
          </div>
          <div className="col-4">
          </div>
        </div>
      </div>
    )
  }
}

export default App
