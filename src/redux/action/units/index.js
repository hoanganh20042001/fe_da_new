import axios from 'axios'
import FormData from 'form-data'
axios.defaults.withCredentials = true
function getAuthToken() {
  return window.localStorage.getItem("access_token") ?? ""
}
import Avatar from '@components/avatar'
import { toast } from 'react-hot-toast'
import { X, Check } from 'react-feather'
// ** Get all Data
const get = (data) => {
    const url = process.env.REACT_APP_API_URL
    console.log(data)
    return async dispatch => {
      if (data.search_text) {
        await axios.get(`${url}/units/?page=${data.pageNumber}&pageSize=${data.pageSize}&search_text=${data.search_text}&sort_by=id&order=asc`,
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
        await axios(`${url}/units/?page=${data.pageNumber}&pageSize=${data.pageSize}&sort_by=id&order=asc`, { headers: {
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

const getById = (data) => async (dispatch) => {
    try {
        console.log(localStorage.getItem("accessToken"))
        const url = process.env.REACT_APP_API_URL
        const response = await axios.get(`${url}/units/${data}`, {
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
// update identification
const update = (data) => {
  const url = process.env.REACT_APP_API_URL
  return async dispatch => {
    await axios.put(`${url}/units/${data.id}/`, data, {
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`
      }
    }).then(response => {
      dispatch(getListLibs({
        pageNumber: 1
      }))
      toast(
        <div className='d-flex'>
          <div className='me-1'>
            <Avatar size='sm' color='success' icon={<Check size={12} />} />
          </div>
          <div className='d-flex flex-column'>
            <h6>Bạn đã cập nhật thông tin thành công!</h6>
          </div>
        </div>
      )
    }).catch(err => {
      toast(
        <div className='d-flex'>
          <div className='me-1'>
            <Avatar size='sm' color='danger' icon={<X size={12} />} />
          </div>
          <div className='d-flex flex-column'>
            <h6>Có lỗi xảy ra!</h6>
          </div>
        </div>
      )
    })
  }
}
const del = (data) => {
  const url = process.env.REACT_APP_API_URL
  return async dispatch => {
    await axios.delete(`${url}/units/${data}/`, {
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`
      }
    }).then(response => {
      dispatch(getListLibs({
        pageNumber: 1
      }))
      toast(
        <div className='d-flex'>
          <div className='me-1'>
            <Avatar size='sm' color='success' icon={<Check size={12} />} />
          </div>
          <div className='d-flex flex-column'>
            <h6>Bạn đã xóa thông tin thành công!</h6>
          </div>
        </div>
      )
    }).catch(err => {
      toast(
        <div className='d-flex'>
          <div className='me-1'>
            <Avatar size='sm' color='danger' icon={<X size={12} />} />
          </div>
          <div className='d-flex flex-column'>
            <h6>Có lỗi xảy ra!</h6>
          </div>
        </div>
      )
    })
  }
}
const create = (data) => {
  const url = process.env.REACT_APP_API_URL
  return async dispatch => {
    await axios.post(`${url}/units/`, data, {
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`
      }
    }).then(response => {
      dispatch(getListLibs({
        pageNumber: 1
      }))
      toast(
        <div className='d-flex'>
          <div className='me-1'>
            <Avatar size='sm' color='success' icon={<Check size={12} />} />
          </div>
          <div className='d-flex flex-column'>
            <h6>Bạn đã thêm thông tin thành công!</h6>
          </div>
        </div>
      )
    }).catch(err => {
      toast(
        <div className='d-flex'>
          <div className='me-1'>
            <Avatar size='sm' color='danger' icon={<X size={12} />} />
          </div>
          <div className='d-flex flex-column'>
            <h6>Có lỗi xảy ra!</h6>
          </div>
        </div>
      )
    })
  }
}
export {
  get,
  getById,
  update,
  del,
  create
}