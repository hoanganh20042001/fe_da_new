// ** React Imports
import { Fragment, useState, forwardRef, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

// ** Table Data & Columns
import { data } from './list/data'
import { Controller, useForm } from 'react-hook-form'
import Avatar from '@components/avatar'
// ** Third Party Components
import ReactPaginate from 'react-paginate'
import DataTable from 'react-data-table-component'
import { ChevronDown, Share, Printer, FileText, File, Grid, Copy, Plus, Edit, Trash, Check, Clipboard } from 'react-feather'
import { useSelector, useDispatch } from 'react-redux'
import { toDateString } from '@utils'
import { getListFace, updateFace, addFace, deleteFace } from '@store/action/face'

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
  Badge
} from 'reactstrap'

// ** Bootstrap Checkbox Component
const BootstrapCheckbox = forwardRef((props, ref) => (
  <div className='form-check'>
    <Input type='checkbox' ref={ref} {...props} />
  </div>
))

const ManageFace = () => {
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
    Face_id:1,
    name:'',
    creatorID:1,
  })
  const [object, setObject] = useState(true)
  const roleId = JSON.parse(localStorage.getItem('userData'))
  const [infoaddData, setInfoadd] = useState({
    name: ''
  })
  const [file, setFile] = useState()
  const [faceId, setFaceId] = useState()
  const [valErrors, setValErrors] = useState({
    name: '',
    file: '',
  })
  const dataFace = useSelector((state) => {
    return state.face.dataFace
  })
  useEffect(() => {
    dispatch(getListFace({
      pageSize: 10,
      page: currentPage + 1
    }))
  }, [dispatch, currentPage])
  // const status = {
  //   1: { title: 'Current', color: 'light-primary' },
  //   2: { title: 'Professional', color: 'light-success' },
  //   3: { title: 'Rejected', color: 'light-danger' },
  //   4: { title: 'Resigned', color: 'light-warning' },
  //   5: { title: 'Applied', color: 'light-info' }
  // }
  const {
    control,
    setError,
    handleSubmit,
    formState: { errors }
  } = useForm()

  const navigate = useNavigate()

  const handleDelete = () => {
    dispatch(deleteFace(faceId))
    setShowDelete(false)
  }

  const handleUpdate = () => {
    // console.log(infoData)
    if (infoData.name.trim() === '') {
      if (infoData.name.trim() === '') setValErrors({ ...valErrors, name: 'Không được để trống' })

    } else {
      dispatch(updateFace(infoData))
      setShowEdit(false)
    }
    
  }
  const handleAdd = () => {
    if (infoaddData.name.trim() === '' || file === undefined) {
      if (infoaddData.name.trim() === '') setValErrors({ ...valErrors, name: 'Không được để trống' })
      if (file === undefined) setValErrors({ ...valErrors, file: 'Không được để trống' })

    } else {
      dispatch(addFace(infoaddData, file))
      setShowAdd(false)
    }
    
  }
  const handleDelet = (data) => {
    // dispatch(deleteFace(data.Face_id))
    setFaceId(data.Face_id)
    setShowDelete(true)
  }
  const handleHistory = (data) => {
    navigate(`/managements/userHistory/${data}`)
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
    console.log(data)
    setShowEdit(true)
    setFile()
    setInfo({
      Face_id: data.Face_id,
      name: data.name,
      creatorID: data.creatorID
    })
  }
  const handleOnChange = (data, pop) => {
    if (data === null || data === undefined || data === "") {
      setValErrors({ ...valErrors, [pop]: 'Không được để trống' })
    } else {
      setValErrors({ ...valErrors, [pop]: null })
    }
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
      setInfoadd({ ...infoaddData, [pop]: data })
    }
    // setInfoadd({ ...infoaddData, [pop]: data })
  }

  const columns = [
    {
      name: 'Ảnh',
      sortable: true,
      minWidth: '200px',
      selector: (row) => {
        const url = process.env.REACT_APP_API_URL
        return (
          <div>
            <img src={`${url}/${row.image_path}`} style={{ width: '100px'}}></img>
          </div>
        )
      },
    },
    {
      name: 'Tên đối tượng',
      sortable: true,
      minWidth: '200px',
      selector: row => row.name,
    },
    {
      name: 'Tác vụ',
      allowOverflow: true,
      cell: (row) => {
        return (
          <div className='d-flex'>
            <Edit size={15} onClick={() => handleEdit(row)} style={{ cursor: 'pointer', marginLeft: '-18px' }} />
            <Trash size={15} onClick={() => handleDelet(row)} style={{ cursor: 'pointer', marginLeft: '6px' }} />
          </div>
        )
      }
    }
  ]

  // ** Function to handle filter
  const handleFilter = e => {
    const value = e.target.value.toLowerCase() // Convert value to lowercase once
    // console.log(typeof value)
    setSearchValue(value)
  
    const status = {
      1: { title: 'Nhận diện khuôn mặt', color: 'light-primary' },
      2: { title: 'Nhận dạng sự kiện bất thường', color: 'light-success' },
      3: { title: 'Phát hiện khuôn mặt', color: 'light-danger' }
    }
  
    if (value.length) {
      const updatedData = dataFace.results.filter(item => {
        const name = (item.name || '').toLowerCase() // Check if item.name is defined
  
        // Check if any property starts with the search value
        const startsWith =
        
          name.startsWith(value.trim())
  
        // Check if any property includes the search value
        const includes =
          name.includes(value.trim())
  
        return startsWith || includes // Return true if any property matches
      })
      setFilteredData(updatedData)
      setSearchValue(value)
    } else {
      setFilteredData([]) // If search value is empty, clear filtered data
    }
  }
  
  
  // const handleFilter = e => {
  //   const value = e.target.value
  //   console.log(typeof value)
  //   let updatedData = []
  //   setSearchValue(value)

  //   const status = {
  //     1: { title: 'Nhận diện khuôn mặt', color: 'light-primary' },
  //     2: { title: 'Nhận dạng sự kiện bất thường', color: 'light-success' },
  //     3: { title: 'Phát hiện khuôn mặt', color: 'light-danger' }
  //   }

  //   if (value.length) {
  //     updatedData = dataFace.results.filter(item => {
  //       const startsWith =
  //         item.datasetname.toLowerCase().startsWith(value.toLowerCase()) ||
  //         toDateString(item.datasetcreatedtime).toLowerCase().startsWith(value.toLowerCase()) ||
  //         item.datasetowner.toLowerCase().startsWith(value.toLowerCase()) ||
  //         status[item.datasetsoftID].title.toLowerCase().startsWith(value.toLowerCase())

  //       const includes =
  //         item.datasetname.toLowerCase().startsWith(value.toLowerCase()) ||
  //         toDateString(item.datasetcreatedtime).toLowerCase().startsWith(value.toLowerCase()) ||
  //         item.datasetowner.toLowerCase().startsWith(value.toLowerCase()) ||
  //         status[item.datasetsoftID].title.toLowerCase().startsWith(value.toLowerCase())

  //       if (startsWith) {
  //         return startsWith
  //       } else if (!startsWith && includes) {
  //         return includes
  //       } else return null
  //     })
  //     setFilteredData(updatedData)
  //     setSearchValue(value)
  //   }
  // }

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
      pageCount={dataFace.totalPages}
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
          <CardTitle tag='h4' style={{ fontWeight: 'bold', color: '#1203b1' }}>DANH SÁCH ĐỐi TƯỢNG</CardTitle>
          <div className='d-flex mt-md-0 mt-1'>
            {
              roleId.roleid === 3 ? <Button className='ms-2' color='primary' onClick={() => setShowAdd(true)}> <Plus size={15} /> <span className='align-middle ms-50'>Thêm đối tượng</span> </Button> : <></>
            }
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
              value={searchValue}
              onChange={handleFilter}
              placeholder='Tìm kiếm đối tượng'
            />
          </Col>
        </Row>
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
            data={searchValue.length ? filteredData : dataFace.results}
            customStyles={{
              rows: {
                style: {
                  minHeight: '150px',
                  display:'flex',
                  alignItems:'center'
                }
              }
            }}
          />
        </div>
      </Card>
      <Modal isOpen={showEdit}  className='modal-dialog-centered modal-lg'>
        <ModalHeader className='bg-transparent' toggle={() => setShowEdit(!showEdit)}></ModalHeader>
        <ModalBody className='px-sm-5 mx-50 pb-5'>
          <div className='text-center mb-2'>
            <h1 className='mb-1'>Chi tiết đối tượng</h1>
            <p>Cập nhật chi tiết thông tin</p>
          </div>
          <Row tag='form' className='gy-1 pt-75' onSubmit={handleSubmit(onSubmit)}>
            <Col md={12} xs={12}>
              <Label className='form-label' for='name'>
                Tên đối tượng <span style={{ fontSize: '10px', fontStyle: 'italic', color: 'red' }}>*</span>
              </Label>
              <Input id='name' type='text' value={infoData.name} onChange={(e) => handleOnChange(e.target.value, "name")} />
              <p style={{ fontSize: '10px', fontStyle: 'italic', color: 'red' }}>{valErrors.name}</p>

            </Col>
            <Col xs={12} className='text-center mt-2 pt-50'>
              <Button type='submit' className='me-1' color='primary' onClick={e => handleUpdate()}>
                Cập nhật
              </Button>
              <Button type='reset' color='secondary' outline onClick={() => setShowEdit(false)}>
                Hủy
              </Button>
            </Col>
          </Row>
        </ModalBody>
      </Modal>
      <Modal isOpen={showAdd} className='modal-dialog-centered modal-lg'>
        <ModalHeader className='bg-transparent' toggle={() => setShowAdd(!showAdd)}></ModalHeader>
        <ModalBody className='px-sm-5 mx-50 pb-5'>
          <div className='text-center mb-2'>
            <h1 className='mb-1'>Thêm đối tượng</h1>
            <p>Thêm chi tiết thông tin</p>
          </div>
          <Row tag='form' className='gy-1 pt-75' onSubmit={handleSubmit(onSubmit)}>
            <Col md={12} xs={12}>
              <Label className='form-label' for='name'>
                Tên đối tượng <span style={{ fontSize: '10px', fontStyle: 'italic', color: 'red' }}>*</span>
              </Label>
              <Input id='name' type='text' value={infoaddData.name} onChange={(e) => handleOnChangeAdd(e.target.value, "name")} placeholder='Tên đối tượng'/>
              <p style={{ fontSize: '10px', fontStyle: 'italic', color: 'red' }}>{valErrors.name}</p>
            </Col>

            <Col md={12} xs={12}>
              <Label className='form-label' for='salary' >
                Chọn ảnh (Chọn file ảnh chỉ có một khuôn mặt) <span style={{ fontSize: '10px', fontStyle: 'italic', color: 'red' }}>*</span>
              </Label>
              <Input type='file' id='salary' onChange={(e) => setFile(e.target.files[0])} accept=".png, .jpg, .jpeg"/>
              <p style={{ fontSize: '10px', fontStyle: 'italic', color: 'red' }}>{valErrors.file}</p>

            </Col>
            <Col xs={12} className='text-center mt-2 pt-50'>
              <Button type='submit' className='me-1' color='primary' onClick={handleAdd}>
                Thêm mới và trích xuất embedding
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
            <h1 className='mb-1'>Xóa đối tượng</h1>
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
    </Fragment>
  )
}

export default ManageFace
