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
  return async dispatch => {
    if (data.search_text || data.status) {
      await axios.get(`${url}/patients/?status=${data.status}&page=${data.page}&pageSize=${data.pageSize}&search_text=${data.search_text}&sort_by=id&order=asc`,
        {
          headers: {
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
      await axios(`${url}/patients/?page=${data.page}&pageSize=${data.pageSize}&sort_by=id&order=asc`, {
        headers: {
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
    const response = await axios.get(`${url}/patients/get_by_id/${data}`, {
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
const getByCccd = (data) => async (dispatch) => {
  try {
    console.log(localStorage.getItem("accessToken"))
    const url = process.env.REACT_APP_API_URL
    const response = await axios.get(`${url}/patients/get_by_cccd/${data}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`
      }
    })

    dispatch({
      type: 'GET_BY_CCCD',
      data: response.data
    })
    console.log(response)

  } catch (error) {
    console.error('Error fetching data:', error)
    // Optionally, you could dispatch an error action here
    // dispatch({ type: 'GET_BY_CCCD_ERROR', error })
  }
}

const update = (data) => async (dispatch) => {
  try {
    console.log(localStorage.getItem("accessToken"))
    const url = process.env.REACT_APP_API_URL
    const { id, unit_name, ...updateData } = data
    console.log(updateData)
    // Gửi yêu cầu cập nhật thông tin bệnh nhân
    const response = await axios.put(`${url}/patients/${data.id}`, updateData, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`
      }
    })

    // Dispatch hành động khi cập nhật thành công
    dispatch(get({
      page: 1,
      pageSize: 9
    }))
    // console.log(response)
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
  } catch (error) {
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
  }
}

const add = (data) => async (dispatch) => {
  try {
    console.log(localStorage.getItem("accessToken"))
    const url = process.env.REACT_APP_API_URL
    const {unit_name, ...addData } = data
    // Gửi yêu cầu cập nhật thông tin bệnh nhân
    const response = await axios.post(`${url}/patients`, addData, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`
      }
    })

    // Dispatch hành động khi cập nhật thành công
    dispatch(get({
      page: 1,
      pageSize: 9
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
  } catch (error) {
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
  }
}

const delet = (data) => async (dispatch) => {
  try {
    console.log(localStorage.getItem("accessToken"))
    const url = process.env.REACT_APP_API_URL
    const response = await axios.delete(`${url}/patients/${data}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`
      }
    })

    // Dispatch hành động khi cập nhật thành công
    dispatch(get({
      page: 1,
      pageSize: 9
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
  } catch (error) {
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
  }
}
export {
  get,
  getById,
  getByCccd,
  add,
  update,
  delet
}