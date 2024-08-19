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
const userData = JSON.parse(localStorage.getItem('userData'))
const getListFace = (data) => {
  const url = process.env.REACT_APP_API_URL
  return async dispatch => {
    await axios.get(`${url}/facerecog/?page=${data.page}&pageSize=${data.pageSize}`).then(response => {
      dispatch({
        type: 'GET_FACE',
        data: response.data
      })
    })
  }
}

const getObj = (data) => {
  const url = process.env.REACT_APP_API_URL
  return async dispatch => {
    await axios.get(`${url}/obj-detector/?web_URL=${data.web_Url}&conf=${data.conf}&iou=${data.iou}&dtViolence=${data.dtViolence}&dtWeapon=${data.dtWeapon}&dtAccident=${data.dtAccident}`, {
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`
      }
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

const searchFace = (data) => {
  const url = process.env.REACT_APP_API_URL
  return async dispatch => {
    await axios.get(`${url}/facerecog/search_by_face/?web_url=${data.url}&score=${data.score}`).then(response => {
      dispatch({
        type: 'SEARCH_FACE',
        data: response.data
      })
    })
  }
}
// update identification
const updateFace = (data) => {
  // console.log(data)
  const url = process.env.REACT_APP_API_URL
  return async dispatch => {
    await axios.put(`${url}/facerecog/${data.Face_id}/`, {
      name: data.name,
      creatorID: data.creatorID
    }, {
      headers: {
        'content-type': 'application/json'
        // Authorization: `Bearer ${localStorage.getItem("accessToken")}`
      }
    }).then(response => {
      dispatch(getListFace({
        page: 1,
        pageSize: 10
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
const deleteFace = (data) => {
  const url = process.env.REACT_APP_API_URL
  return async dispatch => {
    await axios.delete(`${url}/facerecog/${data}/`, {
      headers: {
        'content-type': 'application/json',
        // Authorization: `Bearer ${localStorage.getItem("accessToken")}`
      }
    }).then(response => {
      dispatch(getListFace({
        page: 1,
        pageSize: 10
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
      return (
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
      )
    }
    )
  }
}


const addFace = (data, file) => {
  const url = process.env.REACT_APP_API_URL
  const data1 = new FormData()
  data1.append('file', file)
  return async dispatch => {
    await axios.post(`${url}/upload-face/?name=${data.name}`, data1
      , {
        headers: {
          'Content-Type': 'multipart/form-data',
          // Authorization: `Bearer ${localStorage.getItem("accessToken")}`
        },

      })
      // .then(response => {
      //   const temp = response.data.data
      //   const data2 = {
      //     Face_id: temp.Face_id,
      //     image_path: temp.image_path,
      //     name: temp.name,
      //     infor: temp.infor,
      //     x1: temp.x1,
      //     y1: temp.y1,
      //     x2: temp.x2,
      //     y2: temp.y2,
      //     emb: temp.emb,
      //     time: temp.time,
      //     creatorID: temp.creatorID,

      //   }
      // axios.post(`${url}/facerecog/`, data2, {
      //   headers: {
      //     'content-type': 'application/json'
      //     // Authorization: `Bearer ${localStorage.getItem("accessToken")}`
      //   }
      // })

      .then(response => {
        console.log(response.data.code)
        if (response.data.code === 400) {
          return (
            toast(
              <div className='d-flex'>
                <div className='me-1'>
                  <Avatar size='sm' color='danger' icon={<X size={12} />} />
                </div>
                <div className='d-flex flex-column'>
                  <h6>Tên đối tượng đã tồn tại hoặc hình ảnh không có khuôn mặt!</h6>
                </div>
              </div>
            )
          )
        } else if (response.data.code === 200) {
          return (
            toast(
              <div className='d-flex'>
                <div className='me-1'>
                  <Avatar size='sm' color='danger' icon={<X size={12} />} />
                </div>
                <div className='d-flex flex-column'>
                  <h6>Hình ảnh đang có hơn một khuôn mặt!</h6>
                </div>
              </div>
            )
          )
        } else {
          dispatch(getListFace({
            page: 1,
            pageSize: 10
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
        }

      }).catch(err => {
        const mess = err.response.data.message
        console.log(err.response)
        return (
          toast(
            <div className='d-flex'>
              <div className='me-1'>
                <Avatar size='sm' color='danger' icon={<X size={12} />} />
              </div>
              <div className='d-flex flex-column'>
                {
                  mess ? <h6>{mess}</h6> : <h6>Có lỗi xảy ra!</h6>
                }
              </div>
            </div>
          )
        )
      })
  }
  // )
}
// }
export {
  getListFace,
  updateFace,
  deleteFace,
  addFace,
  searchFace,
  getObj
}