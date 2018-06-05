import _ from 'lodash'
import axios from 'axios'

function cleanResponse (response) {
  const { data } = response

  let ids

  if (data.results) {
    /**
     * `data.results` indicates a list of records has been returned
     *
     * NOTE: For this API there are no unique id keys in list results,
     * so we have to manually set ID keys which get used by redux-capacitor
     *
     */
    ids = data.results.map(result => result.url)
    data.results.map(result => result['id'] = result.url)
  } else {
    data['id'] = data.url
  }
  const modifiedResponse = _.pick(response, 'status', 'headers')

  return data
    ? { ids, ...modifiedResponse, data: data.results || data }
    : modifiedResponse
}

class ApiClient {
  constructor (options = {}) {
    this.axios = axios.create({
      baseURL: "https://swapi.co/api/",
    })

    const methods = ['get', 'post', 'put', 'patch', 'delete']

    methods.forEach((method) => {
      this[method] = (...args) => this._request(method, ...args)
    })
  }

  /**
   * Make a HTTP request using options passed in the call
   *
   * @param {string} method - HTTP method
   * @param {string} url - API endpoint
   * @param {object} [options] - Request options
   * @param {function} [options.onSuccess] - Callback for resolved promise
   * @param {function} [options.onError] - Callback for error handling
   *
   * @returns {Promise}
   */
  _request (method, url, options = {}) {
    const {
      onError,
      onSuccess,
      ...requestOptions
    } = options

    const requestPromise = this._makeRequest(method, url, requestOptions)

    return requestPromise
      .then((response) => {
        const modifiedResponse = cleanResponse(response)

        if (onSuccess) onSuccess(modifiedResponse)

        return modifiedResponse
      })
      .catch((error) => {
        if (!error.response) throw error

        error.response = cleanResponse(error.response)

        if (onError) {
          onError(error.response)
        }

        throw error
      })
  }

  _makeRequest (method, url, options) {
    const {
      data,
      ...requestOptions
    } = options

    if (data) {
      requestOptions.data = {
        data: data || {}
      }
    }

    return this.axios({
      ...requestOptions,
      method,
      url,
    })
  }
}

export default ApiClient
