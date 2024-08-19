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
const getListModel = (data) => {
  const url = process.env.REACT_APP_API_URL
  return async dispatch => {
    if (data.type) {
      await axios.get(`${url}/models/?page=${data.page}&type=${data.type}`).then(response => {
        dispatch({
          type: 'GET_MODEL',
          data: response.data
        })
      })
    } else if (data.search) {
      await axios.get(`${url}/models/?page=${data.page}&search=${data.search}`).then(response => {
        dispatch({
          type: 'GET_MODEL',
          data: response.data
        })
      })
    } else {
      await axios.get(`${url}/models/?page=${data.page}`).then(response => {
        dispatch({
          type: 'GET_MODEL',
          data: response.data
        })
      })
    }
  }
}
const getListModelBySoftID = (data) => {
  const url = process.env.REACT_APP_API_URL
  return async dispatch => {
    await axios.get(`${url}/experiment/get-list-models/?page=${data.page}&pageSize=${data.pageSize}&id_softlib=${data.id_softlib}`).then(response => {
      dispatch({
        type: 'GET_MODEL_BYSOFTID',
        data: response.data
      })
    })
  }
}
// update identification
const updateModel = (data) => {
  const url = process.env.REACT_APP_API_URL
  return async (dispatch) => {
    try {
      const response = await axios.put(`${url}/models/${data.modelid}/`, data, {
        headers: {
          'content-type': 'application/json'
          // Authorization: `Bearer ${localStorage.getItem("accessToken")}`
        }
      })
      
      dispatch(getListModel({
        page: 1
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

      return 1 // Thành công

    } catch (err) {
      const mess = err.response?.data?.non_field_errors?.[0]

      toast(
        <div className='d-flex'>
          <div className='me-1'>
            <Avatar size='sm' color='danger' icon={<X size={12} />} />
          </div>
          <div className='d-flex flex-column'>
            { mess ? <h6>Tên bộ mô hình đã tồn tại!</h6> : <h6>Có lỗi xảy ra!</h6> }
          </div>
        </div>
      )

      return 0 // Thất bại
    }
  }
}
const deleteModel = (data) => {
  const url = process.env.REACT_APP_API_URL
  return async dispatch => {
    await axios.delete(`${url}/models/${data}/`, {
      headers: {
        'content-type': 'application/json',
        // Authorization: `Bearer ${localStorage.getItem("accessToken")}`
      }
    }).then(response => {
      dispatch(getListModel({
        page: 1
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
    }
    )
  }
}
const addModelTrainded = (data) => {
  const url = process.env.REACT_APP_API_URL
  return async dispatch => {
    await axios.post(`${url}/model_trained/`, data, {
      headers: {
        'content-type': 'application/json'
        // Authorization: `Bearer ${localStorage.getItem("accessToken")}`
      }
    }).then(response => {
    
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
    }
    )
  }
}
const addModel = (data) => {
  const url = process.env.REACT_APP_API_URL
  return async dispatch => {
    await axios.post(`${url}/models/`, data, {
      headers: {
        'content-type': 'application/json'
        // Authorization: `Bearer ${localStorage.getItem("accessToken")}`
      }
    }).then(response => {
      dispatch(getListModel({
        page: 1
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

    }
    )
  }
}
export {
  getListModel,
  getListModelBySoftID,
  updateModel,
  deleteModel,
  addModel,
  addModelTrainded
}