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
import { ChevronDown, Share, Printer, FileText, File, Grid, Copy, Plus, Edit, Trash, Check, Clipboard, UserPlus, Upload, User, Shield, Home, CreditCard, X, Loader } from 'react-feather'
import { useSelector, useDispatch } from 'react-redux'
import { toDateString, toDateStringFormat1 } from '@utils'
import { get, update, add, delet } from '@store/action/patients'
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
  Table,
  Spinner
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
  const [searchValue, setSearchValue] = useState(' ')
  const [filteredData, setFilteredData] = useState([])
  const [showEdit, setShowEdit] = useState(false)
  const [showDelete, setShowDelete] = useState(false)
  const [showAdd, setShowAdd] = useState(false)
  const [infoData, setInfo] = useState({
  })
  const [uploadingRowId, setUploadingRowId] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFile, setSelectedFile] = useState(null)
  const [showUpload, setShowUpload] = useState(false)
  const [edit, setEdit] = useState(true)
  const [object, setObject] = useState(true)
  const roleId = JSON.parse(localStorage.getItem('userData'))
  const [img, setImg] = useState('')
  const [selectedOption, setSelectedOption] = useState('0')
  const [soldierInfo, setSoldierInfo] = useState({
  })
  const [id, setId] = useState(0)
  const [units, setUnits] = useState([])
  const [unitSearch, setUnitSearch] = useState('')
  const [isSaved, setIsSaved] = useState(false)
  const [infoAddData, setInfoAdd] = useState({
    full_name: '',
    email: '',
    phone_number: '',
    identification: '',
    date_birth: '',
    rank: '',
    position: '',
    resident: '',
    home_town: '',
    medical_history: '',
    blood_group: 'A',
    height: 1,
    weight: 1,
    unit_id: 1,
    unit_name: 'Tiểu đoàn 1',
    sex: true,
    is_activate: true,
    deleted: false
  })
  const [file, setFile] = useState()
  const [valErrors, setValErrors] = useState({
    datasetname: '',
    datasetsum: '',
  })
  const patients = useSelector((state) => {
    return state.patients.patients
  })
  const handleFilter = e => {
    setSearchValue(e)

  }
  const handleSelectChange = (event) => {
    const value = event.target.value
    console.log(value)
    setSelectedOption(value)

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
    setUploadingRowId(soldierInfo.cccd)
    axios.post(`${url}/result/${soldierInfo.cccd}`, data1,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`
        },

      }).then(response => {
        setIsSaved(true)
        setUploadingRowId(null) 
      })
      .catch(err => {
        dispatch(get({
          pageSize: 9,
          page: currentPage + 1,
        }))
      })

  }
  useEffect(() => {
    dispatch(get({
      pageSize: 7,
      page: currentPage + 1,
      search_text: searchValue,
      status: selectedOption,
    }))
    if (isSaved) {
      setIsSaved(false)
    }
  }, [dispatch, currentPage, searchValue, selectedOption, isSaved])
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
  const {
    control,
    setError,
    handleSubmit,
    formState: { errors }
  } = useForm()

  const navigate = useNavigate()

  const handleUpdate = () => {
    console.log(infoData)
    dispatch(update(infoData))
    setShowEdit(false)

  }
  const [diagnoses, setDiagnoses] = useState([])

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

  const handleUpload = async (data) => {
    setShowUpload(true)
    setSoldierInfo({
      id: data.id,
      full_name: data.full_name,
      rank: data.rank,
      unit_name: data.unit_name,
      cccd: data.identification
    })
    const url = process.env.REACT_APP_API_URL
    const response = await axios.get(`${url}/checks/get_by_patient_id/${data.id}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`
      }
    })

    console.log(response.data.data)
    setDiagnoses(response.data.data)
  }
  const handleAdd = () => {
    console.log(infoAddData)
    dispatch(add(infoAddData))
    setShowAdd(false)

  }
  const handleDelet = (data) => {
    setId(data.id)
    setShowDelete(true)
  }
  const handleDelete = () => {
    dispatch(delet(id))

    setShowDelete(false)
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
    console.log(data)
    setInfo({
      id: data.id,
      full_name: data.full_name,
      email: data.email,
      phone_number: data.phone_number,
      identification: data.identification,
      date_birth: data.date_birth,
      rank: data.rank,
      position: data.position,
      resident: data.resident,
      home_town: data.home_town,
      medical_history: data.medical_history,
      blood_group: data.blood_group,
      height: data.height,
      weight: data.weight,
      unit_name: data.unit_name,
      unit_id: data.unit_id,
      sex: data.sex,
      is_activate: true,
      deleted: false
    })
  }
  const handleOnChange = (data, pop) => {
    // console.log(data)
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
    setInfoAdd({ ...infoAddData, [pop]: data })
  }
  const handleFileUpload = (file) => {
    const formData = new FormData()
    console.log(file)
    formData.append('file', file)
    const url = process.env.REACT_APP_API_URL
    // Gửi file tới server
    axios.post(`${url}/excel/import_patients/`, formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          // Authorization: `Bearer ${localStorage.getItem("accessToken")}`
        },

      }).then(response => {
        toast(
          <div className='d-flex'>
            <div className='me-1'>
              <Avatar size='sm' color='success' icon={<Check size={14} />} />
            </div>
            <div className='d-flex flex-column'>
              <h6>Tải file thành công.</h6>
            </div>
          </div>
        )
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
  const onFileChange = (event) => {
    const file = event.target.files[0]
    console.log(file)
    if (file) {
      setSelectedFile(file)
      handleFileUpload(file)  // Gọi hàm upload ngay sau khi chọn file
    }
  }

  const handleAddFile = (e) => {
    document.getElementById('fileUpload').click()
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
            <Trash size={15} onClick={() => handleDelet(row)} style={{ cursor: 'pointer', marginLeft: '6px' }} />
            {row.status !== false && (
              <>
                {uploadingRowId === row.identification ? (
                  <Spinner size="sm" style={{ marginLeft: '6px' }} /> // Show Spinner if this row is uploading
                ) : (
                  <Upload
                    size={15}
                    onClick={() => handleUpload(row)}
                    style={{ cursor: 'pointer', marginLeft: '6px' }}
                  />
                )}
              </>
            )}
          </div>
        )
      }
    }
  ]
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

  // ** Function to handle Pagination
  const handlePagination = page => {
    setCurrentPage(page.selected)
    // dispatch(getListUser({
    //   pageSize: 1,
    //   pageNumber: page.selected + 1
    // }))
  }
  const filteredUnits = units
    .filter(unit => unit.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .map(unit => ({
      id: unit.id,
      name: unit.name
    }))
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
  const formatDate = (datetime) => {
    if (!datetime) return ''
    const date = new Date(datetime)
    return date.toISOString().split('T')[0] // Trả về 'YYYY-MM-DD'
  }
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
              onChange={onFileChange}
            />
            <Button color="success" onClick={() => handleAddFile()}>
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
            <Input className='w-auto ' type='select' value={selectedOption} onChange={handleSelectChange}>
              <option value='0'>Tất cả</option>
              <option value='1'>Quân nhân đã chẩn đoán</option>
              <option value='2'>Quân nhân chưa chẩn đoán</option>
              <option value='3'>Quân nhân bị bệnh</option>
              <option value='4'>Quân nhân bình thường</option>
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
              <Label className='form-label' for='full_name'>
                Tên người dùng
              </Label>
              <Input id='name' type='text' value={infoData.full_name} onChange={(e) => handleOnChange(e.target.value, "full_name")} />
              {/* <p style={{ fontSize: '10px', fontStyle: 'italic', color: 'red' }}>{valErrors.name}</p> */}
            </Col>
            <Col md={6} xs={12}>
              <Label className='form-label' for='home_town'>
                Quê quán
              </Label>
              <Input id='home_town' type='text' value={infoData.home_town} onChange={(e) => handleOnChange(e.target.value, "home_town")} />
              {/* <p style={{ fontSize: '10px', fontStyle: 'italic', color: 'red' }}>{valErrors.home_town}</p> */}
            </Col>
            <Col md={6} xs={12}>
              <Label className='form-label' for='resident'>
                Nơi ở hiện nay
              </Label>
              <Input id='resident' type='text' value={infoData.resident} onChange={(e) => handleOnChange(e.target.value, "resident")} />
              {/* <p style={{ fontSize: '10px', fontStyle: 'italic', color: 'red' }}>{valErrors.resident}</p> */}
            </Col>

            <Col md={6} xs={12}>
              <Label className='form-label' for='email'>
                Email
              </Label>
              <Input id='email' type='text' value={infoData.email} onChange={(e) => handleOnChange(e.target.value, "email")} />

            </Col>
            <Col md={6} xs={12}>
              <Label className='form-label' for='cccd'>
                Căn cước công dân
              </Label>
              <Input id='identification' type='text' value={infoData.identification} onChange={(e) => handleOnChange(e.target.value, "identification")} />

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
              <Label className='form-label' for='medical_history'>
                Lịch sử bệnh
              </Label>
              <Input id='name' type='text' value={infoData.medical_history} onChange={(e) => handleOnChange(e.target.value, "medical_history")} />

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
              {/* <p style={{ fontSize: '10px', fontStyle: 'italic', color: 'red' }}>{valErrors.position}</p> */}
            </Col>
            <Col md={3} xs={12}>
              <Label className='form-label' for='register-password'>
                Giới tính
              </Label>
              <Input type='select' name='sex' id='sex' value={infoData.sex} onChange={(e) => handleOnChange(e.target.value === 'true', "sex")}>
                <option value='true'>Nam</option>
                <option value='false'>Nữ</option>
              </Input>
            </Col>
            <Col md={3} xs={12}>
              <Label className='form-label' for='blood_group'>
                Nhóm máu
              </Label>
              <Input type='select' name='blood_group' id='blood_group' value={infoData.blood_group} onChange={(e) => handleOnChange(e.target.value, "blood_group")} >
                <option value='A'>A</option>
                <option value='B'>B</option>
                <option value='O'>O</option>
                <option value='AB'>AB</option>
              </Input>
            </Col>
            <Col md={3} xs={12}>
              <Label className='form-label' for='weight'>
                Cân nặng
              </Label>
              <Input id='weight' type='text' value={infoData.weight} onChange={(e) => handleOnChange(e.target.value, "weight")} />
              {/* <p style={{ fontSize: '10px', fontStyle: 'italic', color: 'red' }}>{valErrors.resident}</p> */}
            </Col>
            <Col md={3} xs={12}>
              <Label className='form-label' for='height'>
                Chiều cao
              </Label>
              <Input id='height' type='text' value={infoData.height} onChange={(e) => handleOnChange(e.target.value, "height")} />
              {/* <p style={{ fontSize: '10px', fontStyle: 'italic', color: 'red' }}>{valErrors.resident}</p> */}
            </Col>
            <Col md={6} xs={12}>
              <Label className='form-label' for='phone_number'>
                Số điện thoại
              </Label>
              <Input id='phone_number' type='text' value={infoData.phone_number} onChange={(e) => handleOnChange(e.target.value, "phone_number")} />
              {/* <p style={{ fontSize: '10px', fontStyle: 'italic', color: 'red' }}>{valErrors.phone_number}</p> */}
            </Col>
            <Col md={6} xs={12}>
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
                    handleOnChangeSelect(selectedUnit)
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
            <h1 className='mb-1'>Thêm quân nhân</h1>
            <p>Thêm chi tiết thông tin</p>
          </div>
          <Row tag='form' className='gy-1 pt-75' onSubmit={handleSubmit(onSubmit)}>
            <Col md={12} xs={12}>
              <Label className='form-label' for='full_name'>
                Tên người dùng
              </Label>
              <Input id='name' type='text' value={infoAddData.full_name} onChange={(e) => handleOnChangeAdd(e.target.value, "full_name")} />
              {/* <p style={{ fontSize: '10px', fontStyle: 'italic', color: 'red' }}>{valErrors.name}</p> */}
            </Col>
            <Col md={6} xs={12}>
              <Label className='form-label' for='home_town'>
                Quê quán
              </Label>
              <Input id='home_town' type='text' value={infoAddData.home_town} onChange={(e) => handleOnChangeAdd(e.target.value, "home_town")} />
              {/* <p style={{ fontSize: '10px', fontStyle: 'italic', color: 'red' }}>{valErrors.home_town}</p> */}
            </Col>
            <Col md={6} xs={12}>
              <Label className='form-label' for='resident'>
                Nơi ở hiện nay
              </Label>
              <Input id='resident' type='text' value={infoAddData.resident} onChange={(e) => handleOnChangeAdd(e.target.value, "resident")} />
              {/* <p style={{ fontSize: '10px', fontStyle: 'italic', color: 'red' }}>{valErrors.resident}</p> */}
            </Col>

            <Col md={6} xs={12}>
              <Label className='form-label' for='email'>
                Email
              </Label>
              <Input id='email' type='text' value={infoAddData.email} onChange={(e) => handleOnChangeAdd(e.target.value, "email")} />

            </Col>
            <Col md={6} xs={12}>
              <Label className='form-label' for='identification'>
                Căn cước công dân
              </Label>
              <Input id='identification' type='text' value={infoAddData.identification} onChange={(e) => handleOnChangeAdd(e.target.value, "identification")} />

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
              <Label className='form-label' for='medical_history'>
                Lịch sử bệnh
              </Label>
              <Input id='name' type='text' value={infoAddData.medical_history} onChange={(e) => handleOnChangeAdd(e.target.value, "medical_history")} />

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
              {/* <p style={{ fontSize: '10px', fontStyle: 'italic', color: 'red' }}>{valErrors.position}</p> */}
            </Col>
            <Col md={3} xs={12}>
              <Label className='form-label' for='register-password'>
                Giới tính
              </Label>
              <Input type='select' name='sex' id='sex' value={infoAddData.sex} onChange={(e) => handleOnChangeAdd(e.target.value, "sex")}>
                <option value='1'>Nam</option>
                <option value='0'>Nữ</option>
              </Input>
            </Col>
            <Col md={3} xs={12}>
              <Label className='form-label' for='blood_group'>
                Nhóm máu
              </Label>
              <Input type='select' name='blood_group' id='blood_group' defaultValue='A' onChange={(e) => handleOnChangeAdd(e.target.value, "blood_group")} >
                <option value='A'>A</option>
                <option value='B'>B</option>
                <option value='O'>O</option>
                <option value='AB'>AB</option>
              </Input>
            </Col>
            <Col md={3} xs={12}>
              <Label className='form-label' for='weight'>
                Cân nặng
              </Label>
              <Input id='weight' type='text' value={infoAddData.weight} onChange={(e) => handleOnChangeAdd(e.target.value, "weight")} />
              {/* <p style={{ fontSize: '10px', fontStyle: 'italic', color: 'red' }}>{valErrors.resident}</p> */}
            </Col>
            <Col md={3} xs={12}>
              <Label className='form-label' for='height'>
                Chiều cao
              </Label>
              <Input id='height' type='text' value={infoAddData.height} onChange={(e) => handleOnChangeAdd(e.target.value, "height")} />
              {/* <p style={{ fontSize: '10px', fontStyle: 'italic', color: 'red' }}>{valErrors.resident}</p> */}
            </Col>
            <Col md={6} xs={12}>
              <Label className='form-label' for='phone_number'>
                Số điện thoại
              </Label>
              <Input id='phone_number' type='text' value={infoAddData.phone_number} onChange={(e) => handleOnChangeAdd(e.target.value, "phone_number")} />
              {/* <p style={{ fontSize: '10px', fontStyle: 'italic', color: 'red' }}>{valErrors.phone_number}</p> */}
            </Col>
            <Col md={6} xs={12}>
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
              <Button type='submit' className='me-1' color='primary' onClick={handleAdd} >
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
            <h1 className='mb-1'>Xóa thông tin quân nhân</h1>
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
            <h1 className='mb-1'>Cập nhật thông tin ảnh X-quang</h1>
            <p>Cập nhật thông tin ảnh</p>
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
                <span style={{ fontSize: '16px' }}> Đơn vị: {soldierInfo.unit_name}</span>
              </div>
            </Col>
          </Row>
          <Row className="mb-2">
            <h5>Những lần chẩn đoán trước</h5>
            <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
              <Table striped>
                <thead>
                  <tr>
                    <th>Ngày</th>
                    <th>Nhận xét</th>
                    <th>Kết quả</th>
                  </tr>
                </thead>
                <tbody>
                  {diagnoses?.map((diagnosis, index) => (
                    <tr key={index}>
                      <td>{diagnosis.date}</td>
                      <td>{diagnosis.description}</td>
                      <td>{diagnosis.result === true ? 'Bình thường' : 'Bất thường'}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
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
