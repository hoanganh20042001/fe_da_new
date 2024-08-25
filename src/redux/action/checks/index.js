import axios from 'axios'
import FormData from 'form-data'
axios.defaults.withCredentials = true
function getAuthToken() {
  return window.localStorage.getItem("access_token") ?? ""
}
import Avatar from '@components/avatar'
import { toast } from 'react-hot-toast'
import { X, Check } from 'react-feather'

const getById = (data) => async (dispatch) => {
    try {
        console.log(localStorage.getItem("accessToken"))
        const url = process.env.REACT_APP_API_URL
        const response = await axios.get(`${url}/checks/${data}`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`
          }
        })
    
        dispatch({
          type: 'GET_BY_ID',
          data: response.data
        })
        console.log(response)
      } catch (error) {
        console.error('Error fetching data:', error)
        // Optionally, you could dispatch an error action here
        // dispatch({ type: 'GET_BY_CCCD_ERROR', error })
      }
}
const get = (data) => {
  const url = process.env.REACT_APP_API_URL
  console.log(data)
  return async dispatch => {
    if (data.search_text) {
      await axios.get(`${url}/checks?page=${data.pageNumber}&pageSize=${data.pageSize}&search_text=${data.search_text}&sort_by=id&order=desc`,
         { headers: {
          'content-type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`
        }
      }).then(response => {
        dispatch({
          type: 'GET',
          data: response.data
        })
      })
    } else {
      await axios(`${url}/checks?page=${data.pageNumber}&pageSize=${data.pageSize}&sort_by=id&order=desc`, { headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`
      }
    }).then(response => {
        dispatch({
          type: 'GET',
          data: response.data
        })
      })
    }
   
  }
}
export {
  get,
  getById,

}