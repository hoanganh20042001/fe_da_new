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
const getListLibs = (data) => {
  const url = process.env.REACT_APP_API_URL
  // console.log(data)
  
  return async dispatch => {
    if (data.search) {
      await axios.get(`${url}/expAIs/search_softwarelib/?page=${data.pageNumber}&keyword=${data.search}`).then(response => {
        dispatch({
          type: 'GET_LIBS',
          data: response.data
        })
      })
     
    } else {
      await axios.get(`${url}/expAIs/?page=${data.pageNumber}`).then(response => {
        // response.data.results.reverse()
        dispatch({
          type: 'GET_LIBS',
          data: response.data
        })
      })
    }
    
  }
}
const getListLibsBySoftID = (data) => {
  const url = process.env.REACT_APP_API_URL
  return async dispatch => {
    await axios.get(`${url}/expAIs/get-list-Libss/?page=${data.page}&pageSize=${data.pageSize}&id_softlib=${data.id_softlib}`).then(response => {
      dispatch({
        type: 'GET_LIBS_BYSOFTID',
        data: response.data
      })
    })
  }
}
// update identification
const updateLibs = (data) => {
  const url = process.env.REACT_APP_API_URL
  return async dispatch => {
    await axios.put(`${url}/expAIs/${data.softwarelibid}/`, data, {
      headers: {
        'content-type': 'application/json'
        // Authorization: `Bearer ${localStorage.getItem("accessToken")}`
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
const deleteLibs = (data) => {
  const url = process.env.REACT_APP_API_URL
  return async dispatch => {
    await axios.delete(`${url}/expAIs/${data}/`, {
      headers: {
        'content-type': 'application/json',
        // Authorization: `Bearer ${localStorage.getItem("accessToken")}`
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
const addLibs = (data) => {
  const url = process.env.REACT_APP_API_URL
  return async dispatch => {
    await axios.post(`${url}/expAIs/`, data, {
      headers: {
        'content-type': 'application/json'
        // Authorization: `Bearer ${localStorage.getItem("accessToken")}`
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
  getListLibs,
  getListLibsBySoftID,
  updateLibs,
  deleteLibs,
  addLibs
}