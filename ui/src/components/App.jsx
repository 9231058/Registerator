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

  render () {
    return (
      <div>
        <h1>Welcome to CEIT Registerator</h1>
        <h2>{this.state.about}</h2>
      </div>
    )
  }
}

export default App
