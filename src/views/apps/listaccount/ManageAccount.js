// ** React Imports
import { Fragment, useState, forwardRef, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
// ** Table Data & Columns
import { data } from './data'
import { Controller, useForm } from 'react-hook-form'
import Avatar from '@components/avatar'
// ** Third Party Components
import ReactPaginate from 'react-paginate'
import DataTable from 'react-data-table-component'
import { ChevronDown, CheckCircle, Printer, FileText, File, Grid, Copy, Plus, Edit, Trash, Check, Slash, X, Lock } from 'react-feather'
import { useSelector, useDispatch } from 'react-redux'
import { getListUser, update, delet, add } from '@store/action/profile'
import { toDateStringFormat1, toDateString } from '@utils'
import style from './style.css'
import Flatpickr from 'react-flatpickr'
import axios from 'axios'
// ** Reactstrap Imports
import {
  Row,
  Col,
  Card,
  Input,
  Label,
  Button,
  CardTitle,
  CardHeader,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
  UncontrolledButtonDropdown,
  Modal,
  ModalBody,
  ModalHeader, ModalFooter,
  Badge,
  FormGroup
} from 'reactstrap'
import { format } from 'prettier'

// ** Bootstrap Checkbox Component
const BootstrapCheckbox = forwardRef((props, ref) => (
  <div className='form-check'>
    <Input type='checkbox' ref={ref} {...props} />
  </div>
))

const ManageAccount = () => {
  // ** States
  // const [modal, setModal] = useState(false)
  const dispatch = useDispatch()
  const [currentPage, setCurrentPage] = useState(0)
  const [searchValue, setSearchValue] = useState('')
  const [filteredData, setFilteredData] = useState([])
  const [showEdit, setShowEdit] = useState(false)
  const [showDelete, setShowDelete] = useState(false)
  const [showAdd, setShowAdd] = useState(false)
  const [showAccept, setShowAccept] = useState(false)
  const [infoData, setInfo] = useState({
  })
  const [searchTerm, setSearchTerm] = useState('')

  const [picker, setPicker] = useState(new Date())
  const [object, setObject] = useState(true)
  const [edit, setEdit] = useState(true)
  const [users, setUsers] = useState([])
  const [infoAddData, setInfoAdd] = useState({
    id: '',
    email: '',
    name: '',
    password: '',
    role_id: 'S',
    phone_number: '',
    date_birth: '',
    sex: 1,
    rank: '',
    position: '',
  })
  const [file, setFile] = useState()
  const [valErrors, setValErrors] = useState({
    email: '',
    name: '',
    password: '',
    usrfullname: '',
    usrdob: '',
    usrfaculty: ''
  })

  const [units, setUnits] = useState([])
  const dataUser = useSelector((state) => {
    return state.profile.dataUser
  })
  useEffect(() => {
    dispatch(getListUser({
      pageSize: 10,
      pageNumber: currentPage + 1,
      search:searchValue
    }))
  }, [dispatch, currentPage, searchValue])
  useEffect(() => {
    if (Array.isArray(dataUser.data)) {
      setUsers(dataUser.data)
    } else {
      console.error('Data is not in expected format:', dataUser.data)
    }
  }, [dataUser])

  const {
    control,
    setError,
    handleSubmit,
    formState: { errors }
  } = useForm()

  const navigate = useNavigate()

  const handleDelete = (data) => {
    setShowDelete(true)
    setInfo({
      id: data.id,
      email: data.email,
      name: data.name,
      password: data.password,
      phone_number: data.phone_number,
      roleid: data.roleid,
      usrfullname: data.usrfullname,
      usrdob: data.usrdob,
      usrfaculty: data.usrfaculty,
    })
  }

  const handleUpdate = () => {
    dispatch(updateUser(infoData))
    setEdit(true)
    setShowEdit(false)
  }
  const handleAcceptAccount = () => {
    const url = process.env.REACT_APP_API_URL
    axios.put(`${url}/confirm-user-request/`, {
      id_user: infoData.id,
      status: true
    })
      .then(res => {
        toast(
          <div className='d-flex'>
            <div className='me-1'>
              <Avatar size='sm' color='success' icon={<Check size={12} />} />
            </div>
            <div className='d-flex flex-column'>
              <h6>Bạn đã phê duyệt thành công!</h6>
            </div>
          </div>
        )
        setEdit(true)
        setShowAccept(false)
        dispatch(getListUser({
          pageSize: 10,
          pageNumber: currentPage + 1
        }))
      })
      .catch(err => {
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
  const handleAdd = () => {
    dispatch(addUser(infoaddData))
    setShowAdd(false)
  }
  const handleDelet = () => {
    dispatch(deleteUser(infoData.id))
    setEdit(true)
    setShowDelete(false)

  }
  const handleHistory = (data) => {
    navigate(`/managements/userHistory/${data}`)
  }
  useEffect(() => {
    const url = process.env.REACT_APP_API_URL
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${url}/units/?page_size=100&page=1&sort_by=id&order=desc`,
          {
            headers: {
              'content-type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        )
        console.log(response.data.data.data)
        setUnits(response.data.data.data) // Lưu dữ liệu vào state
      } catch (error) {
        console.error("Error fetching data", error)
      }
    }

    fetchData() // Gọi API khi component mount
  }, [])
  const filteredUnits = units
    .filter(unit => unit.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .map(unit => ({
      id: unit.id,
      name: unit.name
    }))
  const handleOnChangeSelect = (selectedUnit) => {
    setInfo({
      ...infoData,
      unit_id: selectedUnit?.id,  // Cập nhật unit_id
      unit_name: selectedUnit?.name  // Cập nhật unit_name
    })
  }
  const handleOnAddSelect = (selectedUnit) => {
    setInfoAdd({
      ...infoAddData,
      unit_id: selectedUnit?.id,  // Cập nhật unit_id
      unit_name: selectedUnit?.name  // Cập nhật unit_name
    })
  }
  const onSubmit = data => {
    if (Object.values(data)) {
      return null
    } else {
      for (const key in data) {
        if (data[key].length === 0) {
          setError(key, {
            type: 'manual'
          })
        }
      }
    }
  }
  const handleEdit = (data) => {
    setShowEdit(true)
    setInfo({
      id: data.id,
      email: data.email,
      full_name: data.full_name,
      password: data.password,
      phone_number:data.phone_number,
      role_id: data.role_id,
      sex: data.sex,
      rank: data.rank,
      position: data.position,
      unit: data.unit,
      date_birth:data.date_birth
    })
  }
  const handleAccept = (data) => {
    setShowAccept(true)
    setInfo({
      id: data.id,
      email: data.email,
      name: data.name,
      password: data.password,
      roleid: data.roleid,
      usrfullname: data.usrfullname,
      usrdob: data.usrdob,
      usrfaculty: data.usrfaculty,
    })
  }
  const handleOnChange = (data, pop) => {
    console.log(data)
    setInfo({ ...infoData, [pop]: data })
  }
  function isDisable() {
    const o = Object.keys(valErrors)
      .filter((k) => valErrors[k] !== null)
      .reduce((a, k) => ({ ...a, [k]: valErrors[k] }), {})
    if (Object.entries(o).length !== 0) return true
    else return false
  }
  const handleOnChangeAdd = (data, pop) => {
    if (data === null || data === undefined || data === "") {
      setValErrors({ ...valErrors, [pop]: 'Không được để trống' })
    } else {
      setValErrors({ ...valErrors, [pop]: null })
    }
    setInfoadd({ ...infoaddData, [pop]: data })
  }
  const handleOnChangeEmail = (data, pop) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (data === null || data === undefined || data === "" || !emailRegex.test(data)) {
      setValErrors({ ...valErrors, [pop]: 'Email không hợp lệ' })

    } else {
      setValErrors({ ...valErrors, [pop]: null })
    }
    setInfoadd({ ...infoaddData, [pop]: data })
  }

  const columns = [
    {
      name: 'STT',
      sortable: true,
      minWidth: '50px',
      maxWidth: '100px',
      selector: (row, index) => index + 1,
    },
    {
      name: 'Tên người dùng',
      sortable: true,
      minWidth: '200px',
      selector: row => row.full_name,
    },
    {
      name: 'Email',
      sortable: true,
      minWidth: '300px',
      selector: row => row.email,
    },
    {
      name: 'Ngày sinh',
      sortable: true,
      minWidth: '200px',
      selector: row => row.date_birth
    },
    {
      name: 'Trạng thái',
      sortable: true,
      minWidth: '150px',
      cell: (row) => {
        return (
          row.is_active === true ? 'Hoạt động' : 'Đã khoá'
        )
      },
      // center: true,
    },
    {
      name: 'Loại tài khoản',
      sortable: true,
      minWidth: '150px',
      cell: (row) => {
        return (
          row.role_id === 'A' ? 'Admin' : row.role_id === 'D' ? 'Bác sĩ' : 'Nhân viên'
        )
      },
      // center: true,
    },
    {
      name: 'Đăng nhập lần cuối',
      sortable: true,
      minWidth: '200px',
      selector: row => toDateString(row.last_login),
      // center: true,
    },

    {
      name: 'Tác vụ',
      allowOverflow: true,
      cell: (row) => {
        return (
          <div className='d-flex'>
            <Edit size={15} onClick={() => handleEdit(row)} style={{ cursor: 'pointer', marginLeft: '-18px' }} />        
            <Trash size={15} onClick={() => handleDelete(row)} style={{ cursor: 'pointer', marginLeft: '6px' }} />
            {
              row.is_active === false ? <CheckCircle size={15} onClick={() => handleAccept(row)} style={{ cursor: 'pointer', marginLeft: '6px' }} /> : <Lock size={15} onClick={() => handleAccept(row)} style={{ cursor: 'pointer', marginLeft: '6px' }} />
            }
          </div>
        )
      }
    }
  ]
  const StyledCell = styled.div`
  padding-left: 10px; /* Adjust padding as needed */`
  // ** Function to handle filter
  const handleFilter = e => {
    const value = e.target.value
    setSearchValue(value)

    // const status = {
    //   1: { title: 'Admin', color: 'light-primary' },
    //   2: { title: 'Bác sĩ', color: 'light-success' },
    //   3: { title: 'Nhân viên', color: 'light-danger' },
    // }
    // const role = {
    //   0: { title: 'Professional', color: 'light-success' },
    //   1: { title: 'Rejected', color: 'light-danger' },
    // }
    // if (value.length) {
    //   dispatch(getListUser({
    //     pageSize: 10,
    //     pageNumber: currentPage + 1,
    //     search: value.trim()
    //   }))
    //   setSearchValue(value)
    // }
  }

  // ** Function to handle Pagination
  const handlePagination = page => {
    setCurrentPage(page.selected)
    // dispatch(getListUser({
    //   pageSize: 1,
    //   pageNumber: page.selected + 1
    // }))
  }

  const customStyles = {
    headCells: {
      style: {
        justifyContent: 'center',
      },
    },
  }

  // ** Custom Pagination
  const CustomPagination = () => (
    <ReactPaginate
      previousLabel=''
      nextLabel=''
      forcePage={currentPage}
      onPageChange={page => handlePagination(page)}
      pageCount={dataUser.metadata.total_pages}
      breakLabel='...'
      pageRangeDisplayed={2}
      marginPagesDisplayed={2}
      activeClassName='active'
      pageClassName='page-item'
      breakClassName='page-item'
      nextLinkClassName='page-link'
      pageLinkClassName='page-link'
      breakLinkClassName='page-link'
      previousLinkClassName='page-link'
      nextClassName='page-item next-item'
      previousClassName='page-item prev-item'
      containerClassName='pagination react-paginate separated-pagination pagination-sm justify-content-end pe-1 mt-1'
    />
  )
  const formatDate = (datetime) => {
    if (!datetime) return ''
    const date = new Date(datetime)
    return date.toISOString().split('T')[0] // Trả về 'YYYY-MM-DD'
  }
  return (
    <Fragment>
      <Card>
        <CardHeader className='flex-md-row flex-column align-md-items-center align-items-start border-bottom'>
          <CardTitle tag='h4' style={{ fontWeight: 'bold', color: '#1203b1' }}>DANH SÁCH TÀI KHOẢN</CardTitle>
          <div className='d-flex mt-md-0 mt-1'>
            <Button className='ms-2' color='primary' onClick={() => setShowAdd(true)}>
              <Plus size={15} />
              <span className='align-middle ms-50'>Thêm người dùng</span>
            </Button>
          </div>
        </CardHeader>
        <Row className='justify-content-end mx-0'>
          <Col className='d-flex align-items-center justify-content-end mt-1' md='6' sm='12'>
            <Label className='me-1' for='search-input'>
              Tìm kiếm
            </Label>
            <Input
              className='dataTable-filter mb-50'
              type='text'
              bsSize='sm'
              id='search-input'
              placeholder='Tìm kiếm tên người dùng'
              value={searchValue}
              onChange={handleFilter}
            />
          </Col>
        </Row>
        <div className='react-dataTable react-dataTable-selectable-rows'>
          <DataTable
            noHeader
            pagination
            paginationServer
            // selectableRows
            columns={columns}
            paginationPerPage={10}
            className='react-dataTable'
            sortIcon={<ChevronDown size={10} />}
            paginationComponent={CustomPagination}
            paginationDefaultPage={currentPage + 1}
            selectableRowsComponent={BootstrapCheckbox}
            data={Array.isArray(users) ? users : []}
            customStyles={customStyles}
          />
        </div>
      </Card>
      <Modal isOpen={showEdit} toggle={() => setShowEdit(!showEdit)} className='modal-dialog-centered modal-lg'>
        <ModalHeader className='bg-transparent' toggle={() => setShowEdit(!showEdit)}></ModalHeader>
        <ModalBody className='px-sm-5 mx-50 pb-5'>
          <div className='text-center mb-2'>
            <h1 className='mb-1'>Sửa thông tin người dùng</h1>
            <p>Cập nhật chi tiết thông tin</p>
          </div>
            <Row tag='form' className='gy-1 pt-75' onSubmit={handleSubmit(onSubmit)}>
            <Col md={12} xs={12}>
              <Label className='form-label' for='email'>
                Email
              </Label>
              <Input id='email' type='text' value={infoAddData.email} onChange={(e) => handleOnChangeAdd(e.target.value, "email")} />
              
            </Col>
            <Col md={12} xs={12}>
              <Label className='form-label' for='full_name'>
                Tên người dùng
              </Label>
              <Input id='name' type='text' value={infoAddData.full_name} onChange={(e) => handleOnChangeAdd(e.target.value, "full_name")} />
            
            </Col>
            <Col md={6} xs={12}>
              <Label className='form-label' for='phone_number'>
                Số điện thoại
              </Label>
              <Input id='phone_number' type='text' value={infoAddData.phone_number} onChange={(e) => handleOnChangeAdd(e.target.value, "phone_number")} />
              
            </Col>
            <Col md={6} xs={12}>
              <Label className='form-label' for='register-password'>
                Loại tài khoản
              </Label>
              <Input type='select' name='role_id' id='role_id' value={infoAddData.role_id} onChange={(e) => handleOnChangeAdd(e.target.value, "role_id")}>
              
                <option value='N'>Nhân viên</option>
                <option value='A'>Admin</option>
                <option value='D'>Bác sĩ</option>
              </Input>
            </Col>
            <Col md={6} xs={12}>
              <Label className='form-label' for='register-password'>
                Giới tính
              </Label>
              <Input type='select' name='sex' id='sex' value={infoAddData.sex} onChange={(e) => handleOnChangeAdd(e.target.value, "roleid")}>
                <option value='1'>Nam</option>
                <option value='0'>Nữ</option>
              </Input>
            </Col>
            <Col md={6} xs={12}>
              <Label className='form-label' for='date_birth'>
                Ngày sinh
              </Label>
              <Input
                type="date" // Sử dụng input dạng date
                id="date_birth"
                className="form-control"
                value={formatDate(infoAddData.date_birth)} // Hiển thị ngày dưới dạng 'YYYY-MM-DD'
                onChange={(e) => handleOnChangeAdd(e.target.value, 'date_birth')} // Cập nhật giá trị khi thay đổi
              />
            </Col>
            <Col md={6} xs={12}>
              <Label className='form-label' for='rank'>
                Quân hàm
              </Label>
              <Input
                id='rank'
                type='text'
                value={infoAddData.rank}
                onChange={(e) => handleOnChangeAdd(e.target.value, 'rank')}
                
              />
              
            </Col>
            <Col md={6} xs={12}>
              <Label className='form-label' for='position'>
                Chức vụ
              </Label>
              <Input
                id='position'
                type='text'
                value={infoAddData.position}
                onChange={(e) => handleOnChangeAdd(e.target.value, 'position')}
              />
            </Col>
            <Col md={12} xs={12}>
              <FormGroup>
                <Label className='form-label' for='unit'>
                  Đơn vị
                </Label>
                <Input
                  id='unit'
                  type='select'
                  value={infoData.unit_name}
                  onChange={(e) => {
                    console.log(e.target.value)
                    const selectedUnit = filteredUnits.find(unit => unit.id === parseInt(e.target.value))  // Tìm đơn vị
                    console.log(selectedUnit)
                    handleOnAddSelect(selectedUnit)
                  }}
                >
                  {/* Hiển thị danh sách các đơn vị */}
                  {filteredUnits.map(unit => (
                    <option key={unit.id} value={unit.id}>
                      {unit.name}
                    </option>
                  ))}
                </Input>
              </FormGroup>
            </Col>
            <Col xs={12} className='text-center mt-2 pt-50'>
              <Button type='submit' className='me-1' color='primary' onClick={e => setEdit(false)} style={{ display: edit === true ? 'inline-block' : 'none' }}>
                Chỉnh sửa
              </Button>
              <Button type='submit' className='me-1' color='primary' onClick={handleUpdate} style={{ display: edit === true ? 'none' : 'inline-block' }}>
                Cập nhật
              </Button>
              <Button type='reset' color='secondary' outline onClick={() => {
                setEdit(true)
                setShowEdit(false)
              }
              }>
                Hủy
              </Button>
            </Col>
          </Row>
        </ModalBody>
      </Modal>
      <Modal isOpen={showAdd} toggle={() => setShowAdd(!showAdd)} className='modal-dialog-centered modal-lg'>
        <ModalHeader className='bg-transparent' toggle={() => setShowAdd(!showAdd)}></ModalHeader>
        <ModalBody className='px-sm-5 mx-50 pb-5'>
          <div className='text-center mb-2'>
            <h1 className='mb-1'>Thêm người dùng</h1>
            <p>Thêm chi tiết thông tin</p>
          </div>
          <Row tag='form' className='gy-1 pt-75' onSubmit={handleSubmit(onSubmit)}>
            <Col md={12} xs={12}>
              <Label className='form-label' for='email'>
                Email
              </Label>
              <Input id='email' type='text' value={infoData.email} onChange={(e) => handleOnChange(e.target.value, "email")} />
              
            </Col>
            <Col md={12} xs={12}>
              <Label className='form-label' for='full_name'>
                Tên người dùng
              </Label>
              <Input id='name' type='text' value={infoData.full_name} onChange={(e) => handleOnChange(e.target.value, "full_name")} />
            
            </Col>
            <Col md={6} xs={12}>
              <Label className='form-label' for='phone_number'>
                Số điện thoại
              </Label>
              <Input id='phone_number' type='text' value={infoData.phone_number} onChange={(e) => handleOnChange(e.target.value, "phone_number")} />
              
            </Col>
            <Col md={6} xs={12}>
              <Label className='form-label' for='register-password'>
                Loại tài khoản
              </Label>
              <Input type='select' name='role_id' id='role_id' value={infoData.role_id} onChange={(e) => handleOnChange(e.target.value, "role_id")}>
                <option value='A'>Admin</option>
                <option value='D'>Bác sĩ</option>
                <option value='N'>Nhân viên</option>
              </Input>
            </Col>
            <Col md={6} xs={12}>
              <Label className='form-label' for='register-password'>
                Giới tính
              </Label>
              <Input type='select' name='sex' id='sex' value={infoData.sex} onChange={(e) => handleOnChange(e.target.value, "roleid")} readOnly={edit}>
                <option value='1'>Nam</option>
                <option value='0'>Nữ</option>
              </Input>
            </Col>
            <Col md={6} xs={12}>
              <Label className='form-label' for='date_birth'>
                Ngày sinh
              </Label>
              <Input
                type="date" // Sử dụng input dạng date
                id="date_birth"
                className="form-control"
                value={formatDate(infoData.date_birth)} // Hiển thị ngày dưới dạng 'YYYY-MM-DD'
                onChange={(e) => handleOnChange(e.target.value, 'date_birth')} // Cập nhật giá trị khi thay đổi
              />
            </Col>
            <Col md={6} xs={12}>
              <Label className='form-label' for='rank'>
                Quân hàm
              </Label>
              <Input
                id='rank'
                type='text'
                value={infoData.rank}
                onChange={(e) => handleOnChange(e.target.value, 'rank')}
                
              />
              
            </Col>
            <Col md={6} xs={12}>
              <Label className='form-label' for='position'>
                Chức vụ
              </Label>
              <Input
                id='position'
                type='text'
                value={infoData.position}
                onChange={(e) => handleOnChange(e.target.value, 'position')}
              />
            </Col>
            <Col md={12} xs={12}>
              <FormGroup>
                <Label className='form-label' for='unit'>
                  Đơn vị
                </Label>
                <Input
                  id='unit'
                  type='select'
                  defaultValue={filteredUnits.length > 0 ? filteredUnits[0].name : ''}
                  onChange={(e) => {
                    console.log(e.target.value)
                    const selectedUnit = filteredUnits.find(unit => unit.id === parseInt(e.target.value))  // Tìm đơn vị
                    console.log(selectedUnit)
                    handleOnAddSelect(selectedUnit)
                  }}
                >
                  {/* Hiển thị danh sách các đơn vị */}
                  {filteredUnits.map(unit => (
                    <option key={unit.id} value={unit.id}>
                      {unit.name}
                    </option>
                  ))}
                </Input>
              </FormGroup>
            </Col>
            <Col xs={12} className='text-center mt-2 pt-50'>
              <Button type='submit' className='me-1' color='primary' onClick={handleAdd} disabled={isDisable()}>
                Thêm mới
              </Button>
              <Button type='reset' color='secondary' outline onClick={() => setShowAdd(false)}>
                Hủy
              </Button>
            </Col>
          </Row>
        </ModalBody>
      </Modal>
      <Modal isOpen={showAccept} toggle={() => setShowAccept(!showAccept)} className='modal-dialog-centered modal-lg'>
        <ModalHeader className='bg-transparent' toggle={() => setShowAccept(!showAccept)}></ModalHeader>
        <ModalBody className='px-sm-5 mx-50 pb-5'>
          <div className='text-center mb-2'>
            <h1 className='mb-1'>Phê duyệt người dùng</h1>
          </div>
          <Row tag='form' className='gy-1 pt-75' onSubmit={handleSubmit(onSubmit)}>

            <Col xs={12} className='text-center mt-2 pt-50'>
              <Button type='button' className='me-1' color='primary' onClick={handleAcceptAccount}>
                Phê duyệt
              </Button>
              <Button type='reset' color='secondary' outline onClick={() => setShowAccept(false)}>
                Hủy
              </Button>
            </Col>
          </Row>
        </ModalBody>
      </Modal>
      <Modal isOpen={showDelete} toggle={() => setShowDelete(!showDelete)} className='modal-dialog-centered modal-lg'>
        <ModalHeader className='bg-transparent' toggle={() => setShowDelete(!showDelete)}></ModalHeader>
        <ModalBody className='px-sm-5 mx-50 pb-5'>
          <div className='text-center mb-2'>
            <h1 className='mb-1'>Xóa  người dùng</h1>
            <p>Bạn có muốn Xóa  tài khoản ngay bây giờ không?</p>
          </div>
          <Row tag='form' className='gy-1 pt-75' onSubmit={handleSubmit(onSubmit)}>
            <Col xs={12} className='text-center mt-2 pt-50'>
              <Button type='reset' className='me-1' color='secondary' onClick={() => setShowDelete(false)}>
                Hủy
              </Button>
              <Button type='submit' color='danger' onClick={handleDelet}>
                Xóa
              </Button>
            </Col>
          </Row>
        </ModalBody>
      </Modal>
    </Fragment>
  )
}

export default ManageAccount
