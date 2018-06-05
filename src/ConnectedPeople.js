import React from 'react'
import { entities } from './api/config'

const idFromUrl = url => url.split('/')[5]

class ConnectedPeople extends React.Component {
  state = {
    selectedPersonId: null
  }

  handleSearch = (e) => {
    const { people: { updateFilters } } = this.props
    updateFilters({filters: {search: e.target.value}})
  }

  handleGetPerson = (url) => {
    this.props.people.performAction('fetch', {
      itemId: idFromUrl(url),
      responseStrategy: 'ignore',
      onSuccess: ({data}) => {
        this.setState({selectedPersonId: data.id})
        this.fetchPlanet(data.homeworld)
      }
    })
  }

  fetchPlanet = planetUrl => {
    this.props.planet.performAction('fetch', {
      itemId: idFromUrl(planetUrl)
    })
  }

  renderSelectedPerson = () => {
    const { selectedPersonId } = this.state
    const { people } = this.props
    const person = people.items.find(person => person.id === selectedPersonId)

    if (!person) return null

    return (
      <div>
        <h3>Name: {person.name}</h3>
        <p>Planet: {person.homeworld && person.homeworld.name}</p>
      </div>
    )
  }

  renderPeople = () => {
    return this.props.people.items.map(
      person => (
        <div key={person.id}>
          <p>{person.name}</p>
          <button onClick={() => this.handleGetPerson(person.url)}>
            View Info
          </button>
        </div>
      )
    )
  }

  render () {
    const { people } = this.props
    return (
      <div>
        <h1>Star Wars People</h1>
        {
          this.state.selectedPersonId &&
          this.renderSelectedPerson()
        }
        <input type='text' placeholder='Search characters...' onChange={this.handleSearch} />
        {
          people.isLoading ? <p>Loading...</p> : this.renderPeople()
        }
      </div>
    )
  }
}

export default entities({
  people: {type: 'people'},
  planet: {type: 'planet', autoload: false}
})(ConnectedPeople)
