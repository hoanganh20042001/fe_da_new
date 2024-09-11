// ** React Imports
import { Fragment, useState, forwardRef, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
// ** Table Data & Columns
import { data } from './data'
import { Controller, useForm } from 'react-hook-form'
import Avatar from '@components/avatar'
// ** Third Party Components
import ReactPaginate from 'react-paginate'
import DataTable from 'react-data-table-component'
import { ChevronDown, Share, Printer, FileText, File, Grid, Copy, Plus, Edit, Trash, Check, Clipboard, UserPlus, Upload, User, Shield, Home, CreditCard, X } from 'react-feather'
import { useSelector, useDispatch } from 'react-redux'
import { toDateString } from '@utils'
import { get, update, add, del } from '@store/action/patients'
import Flatpickr from 'react-flatpickr'
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
  Form,
  FormGroup,
  Table
} from 'reactstrap'

// ** Bootstrap Checkbox Component
const BootstrapCheckbox = forwardRef((props, ref) => (
  <div className='form-check'>
    <Input type='checkbox' ref={ref} {...props} />
  </div>
))

const ManageData = () => {
  const role = localStorage.getItem('role_id')
  // ** States
  // const [modal, setModal] = useState(false)
  const dispatch = useDispatch()
  const [currentPage, setCurrentPage] = useState(0)
  const [searchValue, setSearchValue] = useState('')
  const [filteredData, setFilteredData] = useState([])
  const [showEdit, setShowEdit] = useState(false)
  const [showDelete, setShowDelete] = useState(false)
  const [showAdd, setShowAdd] = useState(false)
  const [infoData, setInfo] = useState({
  })
  const [showUpload, setShowUpload] = useState(false)
  const [edit, setEdit] = useState(true)
  const [object, setObject] = useState(true)
  const roleId = JSON.parse(localStorage.getItem('userData'))
  const [img, setImg] = useState('')
  const [infoaddData, setInfoadd] = useState({
    datasetname: '',
    datasettype: 0,
    datasetfolderurl: '',
    datasetsoftID: 1,
    datasetsum: 0,
    datasetdescription: ''
  })
  const [file, setFile] = useState()
  const [valErrors, setValErrors] = useState({
    datasetname: '',
    datasetsum: '',
  })
  const patients = useSelector((state) => {
    return state.patients.patients
  })
  // console.log(dataDataset)
  useEffect(() => {
    dispatch(get({
      pageSize: 7,
      page: currentPage + 1
    }))
  }, [dispatch, currentPage])

  const {
    control,
    setError,
    handleSubmit,
    formState: { errors }
  } = useForm()

  const navigate = useNavigate()

  const handleDelete = () => {
    dispatch(deleteData(infoData.datasetid))
    setShowDelete(false)
  }

  const handleUpdate = () => {
    if (infoData.datasetsum !== undefined && infoData.datasetname.trim() !== '') {
      dispatch(updateData(infoData, file))
      setShowEdit(false)
      setValErrors({
        datasetsum: '',
        datasetname: '',
      })
    } else {
      let temp = valErrors
      if (infoData.datasetname.trim() === '' || infoData.datasetname === undefined) { temp = { ...temp, datasetname: 'Không được để trống tên' } }
      setValErrors(temp)
    }

  }
  const [diagnoses, setDiagnoses] = useState([
    { date: '2023-08-01', result: 'Viêm phổi' },
    { date: '2023-06-15', result: 'Không có vấn đề' },
  ])

  const [nextImage, setNextImage] = useState(null)

  const handleFileChange = (e) => {
    const fileInput = e.target
    const fileName = fileInput.files.length > 0 ? fileInput.files[0].name : ''

    // Hiển thị tên tệp
    const fileNameDisplay = document.getElementById('file-name')
    if (fileNameDisplay) {
      fileNameDisplay.textContent = fileName
    }
    const file = e.target.files[0]
    if (file) {
      setImg(file)
    }
  }
  const [soldierInfo, setSoldierInfo] = useState({
  })
  const handleUpload = (data) => {
    setShowUpload(true)
    setSoldierInfo({
      id: data.id,
      full_name: data.full_name,
      rank: data.rank,
      unit: data.unit,
      cccd: data.identification
    })
  }
  const handleAdd = () => {
    if (infoaddData.datasetsum !== undefined && infoaddData.datasetname.trim() !== '') {
      dispatch(addData(infoaddData, file))
      setShowAdd(false)
      setValErrors({
        datasetsum: '',
        datasetname: '',
      })
      setInfoadd({
        datasetname: '',
        datasettype: 0,
        datasetfolderurl: '',
        datasetsoftID: 1,
        datasetsum: 0,
        datasetdescription: ''
      })
    } else {
      let temp = valErrors
      if (infoaddData.datasetname.trim() === '' || infoaddData.datasetname === undefined) { temp = { ...temp, datasetname: 'Không được để trống tên' } }
      setValErrors(temp)
    }

  }
  const handleDelet = (data) => {
    setInfo({
      id: data.id,
      full_name: data.full_name,
      email: data.email,
      phone_number: data.phone_number,
      identification: data.identification,
      rank: data.rank,
      position: data.position,
    })
    setShowDelete(true)
  }
  const handleHistory = (data) => {
    navigate(`/managements/userHistory/${data}`)
  }
  const handleSave = async () => {
    const url = process.env.REACT_APP_API_URL
    const data1 = new FormData()
    data1.append('file', img)
    console.log(img)
    if (data1) {
      toast(
        <div className='d-flex'>
          <div className='me-1'>
            <Avatar size='sm' color='success' icon={<Check size={14} />} />
          </div>
          <div className='d-flex flex-column'>
            <h6>Tải ảnh lên thành công.</h6>
          </div>
        </div>
      )
      setShowUpload(false)
    }
    axios.post(`${url}/result/${soldierInfo.cccd}`, data1,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`
        },

      }).then(response => {
      })
      .catch(err => {

        // toast(
        //   <div className='d-flex'>
        //     <div className='me-1'>
        //       <Avatar size='sm' color='danger' icon={<X size={12} />} />
        //     </div>
        //     <div className='d-flex flex-column'>
        //       <h6>Có lỗi xảy ra!</h6>
        //     </div>
        //   </div>
        // )
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
    setFile()
    setInfo({
      id: data.id,
      full_name: data.full_name,
      email: data.email,
      phone_number: data.phone_number,
      identification: data.identification,
      rank: data.rank,
      position: data.position,
      resident: data.resident,
      home_town: data.home_town,
      medical_history: data.medical_history,
      blood_group: data.blood_group,
      height: data.height,
      weight: data.weight,
      unit: data.unit
    })
  }
  const handleOnChange = (data, pop) => {
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

  const columns = [
    {
      name: 'STT',
      sortable: true,
      minWidth: '50px',
      maxWidth: '100px',
      selector: (row, index) => index + 1,
    },
    {
      name: 'Tên quân nhân',
      sortable: true,
      minWidth: '200px',
      selector: row => row.full_name,
    },
    {
      name: 'CCCD',
      sortable: true,
      minWidth: '100px',
      selector: row => row.identification
    },
    {
      name: 'Ngày sinh',
      sortable: true,
      minWidth: '50px',
      selector: row => toDateString(row.date_birth)
    },
    {
      name: 'Giới tính',
      sortable: true,
      minWidth: '150px',
      cell: (row) => {
        return (
          row.sex === true ? 'Nam' : 'Nữ'
        )
      }
    },
    {
      name: 'Số điện thoại',
      sortable: true,
      minWidth: '150px',
      selector: row => row.phone_number
    },

    {
      name: 'Đơn vị',
      sortable: true,
      minWidth: '150px',
      selector: row => row.unit_name
    },
    {
      name: 'Tác vụ',
      allowOverflow: true,
      cell: (row) => {
        return (
          <div className='d-flex'>
            <Edit size={15} onClick={() => handleEdit(row)} style={{ cursor: 'pointer', marginLeft: '-18px' }} />

            <Upload size={15} onClick={() => handleUpload(row)} style={{ cursor: 'pointer', marginLeft: '6px' }} />
            <Trash size={15} onClick={() => handleDelet(row)} style={{ cursor: 'pointer', marginLeft: '6px' }} />
          </div>
        )
      }
    }
  ]

  // ** Function to handle filter
  const handleFilter = e => {
    const value = e.target.value
    setSearchValue(value)

    if (value.length) {
      dispatch(getListData({
        pageSize: 10,
        page: currentPage + 1,
        datasetName: value.trim()
      }))
      setSearchValue(value)
    } else {
      dispatch(getListData({
        pageSize: 10,
        page: 1
      }))
    }
  }

  // ** Function to handle Pagination
  const handlePagination = page => {
    setCurrentPage(page.selected)
    // dispatch(getListUser({
    //   pageSize: 1,
    //   pageNumber: page.selected + 1
    // }))
  }

  // ** Custom Pagination
  const CustomPagination = () => (
    <ReactPaginate
      previousLabel=''
      nextLabel=''
      forcePage={currentPage}
      onPageChange={page => handlePagination(page)}
      pageCount={patients?.data?.metadata?.total_pages}
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

  return (
    <Fragment>
      <Card>
        <CardHeader className='flex-md-row flex-column align-md-items-center align-items-start border-bottom'>
          <CardTitle tag='h4' style={{ fontWeight: 'bold', color: '#1203b1' }}>DANH SÁCH QUÂN NHÂN</CardTitle>
          <div>
            <Input
              type="file"
              id="fileUpload"
              style={{ display: 'none' }}
            // onChange={onFileChange}
            />
            <Button color="success" onClick={() => document.getElementById('fileUpload').click()}>
              <UserPlus size={15} style={{ marginRight: '8px' }} />
              Thêm danh sách quân nhân
            </Button>
          </div>
          <div className='d-flex mt-md-0 mt-1'>

            <Button className='ms-2' color='primary' onClick={() => setShowAdd(true)}> <Plus size={15} /> <span className='align-middle ms-50'>Thêm quân nhân</span> </Button>

          </div>
        </CardHeader>
        <Row className='justify-content-end mx-0'>
          <Col className='d-flex align-items-center justify-content-end mt-1' md='6' sm='12'>
            <div className='d-flex align-items-center'>
              <label htmlFor='search-invoice'>Tìm kiếm</label>
              <Input
                id='search-invoice'
                className='ms-50 me-2 w-100'
                type='text'
                // value={value}
                onChange={e => handleFilter(e.target.value)}
                placeholder='Tìm kiếm tên quân nhân'
              />
            </div>
            <Input className='w-auto ' type='select' >
              <option value=''>Tất cả</option>
              <option value='1'>Quân nhân đã chẩn đoán</option>
              <option value='2'>Quân nhân chưa chẩn đoán</option>
              <option value='3'>Quân nhân bị bệnh</option>
              <option value='3'>Quân nhân bình thường</option>
            </Input>
          </Col>
        </Row>
        <Row className='justify-content-end mx-0'>
          <div className='react-dataTable react-dataTable-selectable-rows'>
            <DataTable
              noHeader
              pagination
              // selectableRows
              columns={columns}
              paginationPerPage={10}
              className='react-dataTable'
              sortIcon={<ChevronDown size={10} />}
              paginationComponent={CustomPagination}
              paginationDefaultPage={currentPage + 1}
              selectableRowsComponent={BootstrapCheckbox}
              data={Array.isArray(patients?.data?.data) ? patients.data.data : []}
            />
          </div></Row>
      </Card>
      <Modal isOpen={showEdit} toggle={() => setShowEdit(!showEdit)} className='modal-dialog-centered modal-lg'>
        <ModalHeader className='bg-transparent' toggle={() => setShowEdit(!showEdit)}></ModalHeader>
        <ModalBody className='px-sm-5 mx-50 pb-5'>
          <div className='text-center mb-2'>
            <h1 className='mb-1'>Chỉnh sửa thông tin quân nhân</h1>
            <p>Cập nhật chi tiết thông tin</p>
          </div>
          <Row tag='form' className='gy-1 pt-75' onSubmit={handleSubmit(onSubmit)}>
            <Col md={12} xs={12}>
              <Label className='form-label' for='email'>
                Email
              </Label>
              <Input id='email' type='text' value={infoData.email} onChange={(e) => handleOnChange(e.target.value, "email")} readOnly={edit} />
              <p style={{ fontSize: '10px', fontStyle: 'italic', color: 'red' }}>{valErrors.email}</p>
            </Col>
            <Col md={12} xs={12}>
              <Label className='form-label' for='full_name'>
                Tên người dùng
              </Label>
              <Input id='name' type='text' value={infoData.full_name} onChange={(e) => handleOnChange(e.target.value, "name")} readOnly={edit} />
              <p style={{ fontSize: '10px', fontStyle: 'italic', color: 'red' }}>{valErrors.name}</p>
            </Col>
            <Col md={6} xs={12}>
              <Label className='form-label' for='home_town'>
                Quê quán
              </Label>
              <Input id='home_town' type='text' value={infoData.home_town} onChange={(e) => handleOnChange(e.target.value, "home_town")} readOnly={edit} />
              <p style={{ fontSize: '10px', fontStyle: 'italic', color: 'red' }}>{valErrors.home_town}</p>
            </Col>
            <Col md={6} xs={12}>
              <Label className='form-label' for='resident'>
                Nơi ở hiện nay
              </Label>
              <Input id='resident' type='text' value={infoData.resident} onChange={(e) => handleOnChange(e.target.value, "resident")} readOnly={edit} />
              <p style={{ fontSize: '10px', fontStyle: 'italic', color: 'red' }}>{valErrors.resident}</p>
            </Col>
            <Col md={6} xs={12}>
              <Label className='form-label' for='phone_number'>
                Số điện thoại
              </Label>
              <Input id='phone_number' type='text' value={infoData.phone_number} onChange={(e) => handleOnChange(e.target.value, "phone_number")} readOnly={edit} />
              <p style={{ fontSize: '10px', fontStyle: 'italic', color: 'red' }}>{valErrors.phone_number}</p>
            </Col>
            <Col md={6} xs={12}>
              <Label className='form-label' for='cccd'>
                Căn cước công dân
              </Label>
              <Input id='identification' type='text' value={infoData.identification} onChange={(e) => handleOnChange(e.target.value, "phone_number")} readOnly={edit} />
              <p style={{ fontSize: '10px', fontStyle: 'italic', color: 'red' }}>{valErrors.phone_number}</p>
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
              <Label className='form-label' for='usrdob' >
                Ngày sinh
              </Label>
              <Flatpickr
                value={infoData.date_birth}
                id='date-time-picker'
                className='form-control'
                options={{
                  dateFormat: "Y-m-d",
                  readOnly: edit
                }
                }
                onChange={date => handleOnChange(toDateStringFormat1(date.toString()), "usrdob")}
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
                readOnly={edit}
              />
              <p style={{ fontSize: '10px', fontStyle: 'italic', color: 'red' }}>{valErrors.rank}</p>
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
                readOnly={edit}
              />
              <p style={{ fontSize: '10px', fontStyle: 'italic', color: 'red' }}>{valErrors.position}</p>
            </Col>
            <Col md={12} xs={12}>
              <Label className='form-label' for='usrfaculty'>
                Đơn vị
              </Label>
              <Input id='usrfaculty' type='text' value={infoData.usrfaculty} onChange={(e) => handleOnChange(e.target.value, "usrfaculty")} readOnly={edit} />
              <p style={{ fontSize: '10px', fontStyle: 'italic', color: 'red' }}>{valErrors.usrfaculty}</p>
            </Col>
            <Col xs={12} className='text-center mt-2 pt-50'>
              <Button type='submit' className='me-1' color='primary' onClick={handleUpdate}>
                Cập nhật
              </Button>
              <Button type='reset' color='secondary' outline onClick={() => setShowEdit(false)}>
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
            <h1 className='mb-1'>Thêm bộ dữ liệu</h1>
            <p>Thêm chi tiết thông tin</p>
          </div>
          <Row tag='form' className='gy-1 pt-75' onSubmit={handleSubmit(onSubmit)}>
            <Col md={12} xs={12}>
              <Label className='form-label' for='datasetname'>
                Tên bộ dữ liệu <span style={{ color: 'red' }}>*</span>
              </Label>
              <Input id='datasetname' type='text' value={infoaddData.datasetname} onChange={(e) => handleOnChangeAdd(e.target.value, "datasetname")} />
              <p style={{ fontSize: '10px', fontStyle: 'italic', color: 'red' }}>{valErrors.datasetname}</p>
            </Col>
            <Col md={12} xs={12}>
              <Label className='form-label' for='datasetsum'>
                Số lượng mẫu <span style={{ color: 'red' }}>*</span>
              </Label>
              <Input id='datasetsum' type='number' value={infoaddData.datasetsum} onChange={(e) => handleOnChangeAdd(e.target.value, "datasetsum")} />
              <p style={{ fontSize: '10px', fontStyle: 'italic', color: 'red' }}>{valErrors.datasetsum}</p>
            </Col>
            <Col md={12} xs={12}>
              <Label className='form-label' for='datasetsoftID'>
                Loại bài toán <span style={{ color: 'red' }}>*</span>
              </Label>
              <Input type='select' name='datasetsoftID' id='datasetsoftID' value={infoaddData.datasetsoftID} onChange={(e) => handleOnChangeAdd(e.target.value, "datasetsoftID")}>
                <option value='1'>Nhận diện khuôn mặt</option>
                <option value='2'>Nhận dạng sự kiện bất thường</option>
                <option value='3'>Phát hiện khuôn mặt</option>
              </Input>
            </Col>
            <Col md={12} xs={12}>
              <Label className='form-label' for='datasetdescription'>
                Mô tả
              </Label>
              <Input id='datasetdescription' type='textarea' value={infoaddData.datasetdescription} onChange={(e) => handleOnChangeAdd(e.target.value, "datasetdescription")} />
            </Col>
            <Col md={12} xs={12}>
              <Label className='form-label' for='salary' >
                Chọn file zip bộ dữ liệu <span style={{ color: 'red' }}>*</span>
              </Label>
              <Input type='file' id='salary' onChange={(e) => setFile(e.target.files[0])} accept=".zip" />
            </Col>
            <Col md={12} xs={12}>
              <div className='demo-inline-spacing mb-1'>
                <div className='form-check'>
                  <Input type='radio' id='ex1-active' name='ex1' checked={infoaddData.datasettype === 1} onClick={(e) => handleOnChangeAdd(1, "datasettype")} />
                  <Label className='form-check-label' for='ex1-active'>
                    Public
                  </Label>
                </div>
                <div className='form-check'>
                  <Input type='radio' name='ex1' id='ex1-inactive' checked={infoaddData.datasettype === 0} onClick={(e) => handleOnChangeAdd(0, "datasettype")} />
                  <Label className='form-check-label' for='ex1-inactive'>
                    Private
                  </Label>
                </div>
              </div>
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
      <Modal isOpen={showDelete} toggle={() => setShowDelete(!showDelete)} className='modal-dialog-centered modal-lg'>
        <ModalHeader className='bg-transparent' toggle={() => setShowDelete(!showDelete)}></ModalHeader>
        <ModalBody className='px-sm-5 mx-50 pb-5'>
          <div className='text-center mb-2'>
            <h1 className='mb-1'>Xóa bộ dữ liệu</h1>
            <p>Bạn có muốn xóa thông tin ngay bây giờ không?</p>
          </div>
          <Row tag='form' className='gy-1 pt-75' onSubmit={handleSubmit(onSubmit)}>
            <Col xs={12} className='text-center mt-2 pt-50'>
              <Button type='reset' className='me-1' color='secondary' onClick={() => setShowDelete(false)}>
                Hủy
              </Button>
              <Button type='submit' color='danger' onClick={handleDelete}>
                Xóa
              </Button>
            </Col>
          </Row>
        </ModalBody>
      </Modal>
      <Modal isOpen={showUpload} toggle={() => setShowUpload(!showUpload)} className='modal-dialog-centered modal-lg'>
        <ModalHeader className='bg-transparent' toggle={() => setShowUpload(!showUpload)}></ModalHeader>
        <ModalBody>
          <div className='text-center mb-2'>
            <h1 className='mb-1'>Chỉnh sửa thông tin quân nhân</h1>
            <p>Cập nhật chi tiết thông tin</p>
          </div>
          <Row className="mb-2">
            <Col md={12} xs={12}>
              <h5 className="mb-2" style={{ fontWeight: 'bold' }}>
                Thông tin quân nhân
              </h5>
            </Col>
            <Col md={6} xs={12}>
              <div className="d-flex align-items-center mb-1">
                <User style={{ marginRight: '10px' }} className="mr-3" size={20} color="#007bff" />
                <span style={{ fontSize: '16px' }}> Họ và tên: {soldierInfo.full_name}</span>
              </div>
            </Col>
            <Col md={6} xs={12}>
              <div className="d-flex align-items-center mb-1">
                <CreditCard style={{ marginRight: '10px' }} className="mr-3" size={20} color="#ffc107" />
                <span style={{ fontSize: '16px' }}> CCCD: {soldierInfo.cccd}</span>
              </div>
            </Col>
            <Col md={6} xs={12}>
              <div className="d-flex align-items-center mb-1">
                <Shield style={{ marginRight: '10px' }} className="mr-3" size={20} color="#28a745" />
                <span style={{ fontSize: '16px' }}> Cấp bậc: {soldierInfo.rank}</span>
              </div>
            </Col>
            <Col md={6} xs={12}>
              <div className="d-flex align-items-center mb-1">
                <Home style={{ marginRight: '10px' }} className="mr-3" size={20} color="#17a2b8" />
                <span style={{ fontSize: '16px' }}> Đơn vị: {soldierInfo.unit}</span>
              </div>
            </Col>
          </Row>
          <Row className="mb-2">
            <h5>Những lần chẩn đoán trước</h5>
            <Table striped>
              <thead>
                <tr>
                  <th>Ngày</th>
                  <th>Kết quả</th>
                </tr>
              </thead>
              <tbody>
                {diagnoses.map((diagnosis, index) => (
                  <tr key={index}>
                    <td>{diagnosis.date}</td>
                    <td>{diagnosis.result}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Row>
          <Form>
            <h5>Tải ảnh cho lần khám tiếp theo</h5>
            <FormGroup>
              <div className="d-flex align-items-center">
                <Input
                  type="file"
                  id="xrayUpload"
                  accept="image/*"
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                />

                <label htmlFor="xrayUpload" className="btn btn-primary">
                  <Upload className="mr-2" size={18} />
                  Tải ảnh lên
                </label>
                <span id="file-name" className="ml-3" style={{ fontSize: '14px' }}></span>
              </div>
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="primary"
            onClick={handleSave}
          >
            Lưu
          </Button>
          <Button color="secondary"
            onClick={() => showUpload(false)}
          >
            Hủy
          </Button>
        </ModalFooter>
      </Modal>
    </Fragment>
  )
}

export default ManageData
