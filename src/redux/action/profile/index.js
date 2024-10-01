import axios from 'axios'
function getAuthToken() {
  return window.localStorage.getItem("access_token") ?? ""
}
import Avatar from '@components/avatar'
import { toast } from 'react-hot-toast'
import { X, Check } from 'react-feather'
// ** Get all Data
const getListUser = (data) => {
  const url = process.env.REACT_APP_API_URL
  return async dispatch => {
    if (data.search) {
      await axios.get(`${url}/users/?page_size=${data.pageSize}&page=${data.pageNumber}&search_text=${data.search}&sort_by=id&order=desc`, {
        headers: {
          'content-type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`
        }
      }).then(response => {
        dispatch({
          type: 'GET_LIST_USER',
          data: response.data
        })
      })
    } else {
    await axios.get(`${url}/users/?page_size=${data.pageSize}&page=${data.pageNumber}&sort_by=id&order=desc`, {
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`
      }
    }).then(response => {
      console.log(response)
      dispatch({
        type: 'GET_LIST_USER',
        data: response.data
      })
    })
    }
    }
   
}

const getMe = () => {
  const url = process.env.REACT_APP_API_URL
  console.log(localStorage.getItem("accessToken"))
  return async dispatch => {
      await axios.get(`${url}/users/me`, {
        headers: {
          'content-type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`
        }
      }).then(response => {
        dispatch({
          type: 'GET_INFO',
          data: response.data
        })
      })

    }
    }
   
const getListUserNoClass = (data) => {
  const url = process.env.REACT_APP_API_URL
  return async dispatch => {
    await axios.get(`${url}/ds-hv-chuacolop/?page=1&pageSize=1000`, {
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`
      }
    }).then(response => {
      dispatch({
        type: 'GET_USER_NOCLASS',
        data: response.data
      })
    })
  }
}
const searchUser = (data) => {
  const url = process.env.REACT_APP_API_URL
  return async dispatch => {
    await axios.get(`${url}/accounts/?pageSize=${data.pageSize}&page=${data.pageNumber}&search=${data.search}`, {
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`
      }
    }).then(response => {
      dispatch({
        type: 'SEARCH_USER',
        data: response.data
      })
    })
  }
}
// const getInfo = (data) => {
//   const url = process.env.REACT_APP_API_URL
//   return async dispatch => {
//     await axios.get(`${url}/accounts/${data}/`, { withCredentials: true }).then(response => {
//       dispatch({
//         type: 'GET_INFO',
//         data: response.data
//       })
//     })
//   }
// }
// update identification
const updatePass = (data) => {
  const url = process.env.REACT_APP_API_URL
  return async dispatch => {
    await axios.put(`${url}/change-password/`, {
      new_password: data.new_password,
      old_password: data.old_password
    }, {
      withCredentials: true

    }).then(response => {
      dispatch({
        type: 'UPDATE_PASS',
        data: response.data
      })
      //   console.log(response.data.data[0].data)
    })
  }
}
const updateUser = (data) => {
  const url = process.env.REACT_APP_API_URL
  return async dispatch => {
    await axios.put(`${url}/accounts/${data.id}/`, {
      email: data.email,
      name: data.name,
      usrfullname: data.usrfullname,
      usrdob: data.usrdob,
      roleid: data.roleid,
      usrfaculty: data.usrfaculty,
    }, {
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`
      }

    }).then(response => {
      dispatch(getInfo({
        data: data.id
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
    }
    )
  }
}
const deleteUser = (data) => {
  const url = process.env.REACT_APP_API_URL
  return async dispatch => {
    await axios.delete(`${url}/accounts/${data}/`, {
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`
      }

    }).then(response => {
      dispatch(getListUser({
        pageNumber: 1,
        pageSize: 10
      }))
      toast(
        <div className='d-flex'>
          <div className='me-1'>
            <Avatar size='sm' color='success' icon={<Check size={12} />} />
          </div>
          <div className='d-flex flex-column'>
            <h6>Bạn đã Xóa tài khoản thành công!</h6>
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
const addUser = (data) => {
  const url = process.env.REACT_APP_API_URL
  return async dispatch => {
    await axios.post(`${url}/accounts/`, data, {
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`
      }

    }).then(response => {
      dispatch(getListUser({
        pageNumber: 1,
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


const update = (data) => async (dispatch) => {
  try {
    console.log(localStorage.getItem("accessToken"))
    const url = process.env.REACT_APP_API_URL
    const { id, unit_name, ...updateData } = data
    console.log(updateData)
    // Gửi yêu cầu cập nhật thông tin bệnh nhân
    const response = await axios.put(`${url}/users/${data.id}`, updateData, {
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
    const response = await axios.post(`${url}/users`, addData, {
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
    const response = await axios.delete(`${url}/users/${data}`, {
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
  getListUser,
  updateUser,
  deleteUser,
  addUser,
  // getInfo,
  updatePass,
  searchUser,
  getListUserNoClass,
  getMe,
  update,
  add,
  delet
}