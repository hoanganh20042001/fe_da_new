// ** React Imports
import { Fragment, useState, forwardRef, useEffect, useRef } from 'react'
import { toast } from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import Viewer from 'react-viewer'
// ** Table Data & Columns
import { Controller, useForm } from 'react-hook-form'
import Avatar from '@components/avatar'
// ** Third Party Components
import ReactPaginate from 'react-paginate'
import DataTable from 'react-data-table-component'
import { ChevronDown, Share, Printer, FileText, File, Grid, Copy, Plus, Edit, Trash, Check, Clipboard, Eye } from 'react-feather'
import { useSelector, useDispatch } from 'react-redux'
import { get, update, dels, add } from '@store/action/checks'
import { toDateStringFormat1, toDateString } from '@utils'

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
  CardBody
} from 'reactstrap'
import { format } from 'prettier'
import { getListUser } from '../../../redux/action/profile'

// ** Bootstrap Checkbox Component
const BootstrapCheckbox = forwardRef((props, ref) => (
  <div className='form-check'>
    <Input type='checkbox' ref={ref} {...props} />
  </div>
))

const ManageHistories = () => {
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

  const [picker, setPicker] = useState(new Date())
  const [object, setObject] = useState(true)
  const [edit, setEdit] = useState(true)
  const [infoaddData, setInfoadd] = useState({
    softwarelibname: '',
    softwareliburl: '',
    softwarelibdescription: '',
  })
  const [file, setFile] = useState()
  const [valErrors, setValErrors] = useState({
    softwarelibname: '',
    softwareliburl: '',
    softwarelibdescription: '',
  })
  const checks = useSelector((state) => {
    return state.checks.checks
  })
  useEffect(() => {
    dispatch(get({
      pageSize: 9,
      pageNumber: currentPage + 1
    }))
  }, [dispatch, currentPage])
  console.log(checks)
  const {
    control,
    setError,
    handleSubmit,
    formState: { errors }
  } = useForm()

  const navigate = useNavigate()
  const role = localStorage.getItem('role_id')
  
  const handleAdd = () => {
    if (infoaddData.softwarelibname.trim() !== '' && infoaddData.softwareliburl.trim() !== '') {
      // console.log(infoaddData)
      dispatch(addLibs(infoaddData))
      setShowAdd(false)
      setValErrors({
        softwarelibname: '',
        softwareliburl: '',
        softwarelibdescription: '',
      })
    } else {
      let temp = valErrors
      if (infoaddData.softwarelibname.trim() === '' || infoaddData.softwarelibname === undefined) { temp = { ...temp, softwarelibname: 'Không được để trống tên thư viện' } }
      if (infoaddData.softwareliburl.trim() === '' || infoaddData.softwareliburl === undefined) { temp = { ...temp, softwareliburl: 'Không được để trống đường dẫn' } }
      setValErrors(temp)
    }

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
    setInfo({
      image: data.image_2,
      full_name: data.full_name,
      unit: data.unit,
      date: data.date,
      time: data.time,
      result: data.result,
      description: data.description,
    })
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
    // console.log([pop])

    setInfoadd({ ...infoaddData, [pop]: data })
  }

  const columns = [
    {
      name: 'STT',
      sortable: true,
      minWidth: '200px',
      selector: row => row.id,
    },
    {
      name: 'Tên quân nhân',
      sortable: true,
      minWidth: '200px',
      selector: row => row.full_name,
    },
    {
      name: 'Thời gian khám',
      sortable: true,
      minWidth: '200px',
      selector: row => row.date,
    },
    {
      name: 'Lần khám',
      sortable: true,
      minWidth: '200px',
      selector: row => row.time,
    },
    {
      name: 'Đơn vị',
      sortable: true,
      minWidth: '200px',
      selector: row => row.unit,
    },
    {
      name: 'Người phụ trách',
      sortable: true,
      minWidth: '200px',
      selector: row => row.user,
    },
    {
      name: 'Tác vụ',
      allowOverflow: true,
      cell: (row) => {
        return (
          <div className='d-flex'>
            <Eye size={15} onClick={() => handleEdit(row)} style={{ cursor: 'pointer', marginLeft: '-18px' }} />
            {/* <Trash size={15} onClick={() => handleDelete(row)} style={{ cursor: 'pointer', marginLeft: '6px' }} /> */}

          </div>
        )
      }
    }
  ]

  // ** Function to handle filter
  const handleFilter = e => {
    const value = e.target.value
    // console.log(typeof (value))
    setSearchValue(value)

    const status = {
      1: { title: 'Current', color: 'light-primary' },
      2: { title: 'Professional', color: 'light-success' },
      3: { title: 'Rejected', color: 'light-danger' },
      4: { title: 'Resigned', color: 'light-warning' },
      5: { title: 'Applied', color: 'light-info' }
    }

    if (value.length) {
      dispatch(getListLibs({
        pageNumber: currentPage + 1,
        search: value.trim()
      }))
      setSearchValue(value)
    } else {
      dispatch(getListLibs({
        pageNumber: 1
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

  const [totalPages, setTotalPages] = useState(0)

  useEffect(() => {
    if (checks && checks.data && checks.data.metadata) {
      setTotalPages(checks.data.metadata.total_pages)
    }
    setCurrentPage(0)
  }, [checks?.data?.data?.count])

  const isFirstPage = currentPage === 0
  const isLastPage = currentPage === totalPages - 1

  const handlePreviousPage = () => {
    if (!isFirstPage) {
      setCurrentPage(currentPage - 1)
    }
  }

  const handleNextPage = () => {
    if (!isLastPage) {
      setCurrentPage(currentPage + 1)
    }
  }

  // ** Custom Pagination
  const CustomPagination = () => (
    <ReactPaginate
      previousLabel=''
      nextLabel=''
      forcePage={currentPage}
      onPageChange={handlePagination}
      pageCount={checks.data.metadata.total_pages}
      breakLabel='...'
      pageRangeDisplayed={1}
      marginPagesDisplayed={1}
      activeClassName='active'
      pageClassName='page-item'
      breakClassName='page-item'
      nextLinkClassName={`page-link ${isLastPage ? 'disabled' : ''}`}
      pageLinkClassName='page-link'
      breakLinkClassName='page-link'
      previousLinkClassName={`page-link ${isFirstPage ? 'disabled' : ''}`}
      nextClassName='page-item next-item'
      previousClassName='page-item prev-item'
      containerClassName='pagination react-paginate separated-pagination pagination-sm justify-content-end pe-1 mt-1'
    />
  )
  const containerRef = useRef(null)
  return (
    <Fragment>
      <Card>
        <CardHeader className='flex-md-row flex-column align-md-items-center align-items-start border-bottom'>
          <CardTitle tag='h4' style={{ fontWeight: 'bold', color: '#1203b1' }}>LỊCH SỬ</CardTitle>
          <div className='d-flex mt-md-0 mt-1'>
            {/* {
              role === 'A' ? <></> : <Button className='ms-2' color='primary' onClick={() => setShowAdd(true)}>
                <Plus size={15} />
                <span className='align-middle ms-50'>Thêm thư viện</span>
              </Button>
            } */}

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
            />
          </Col>
        </Row>
        <div className='react-dataTable react-dataTable-selectable-rows'>
          <DataTable
            noHeader
            pagination
            // selectableRows
            columns={columns}
            paginationPerPage={9}
            className='react-dataTable'
            sortIcon={<ChevronDown size={10} />}
            paginationComponent={CustomPagination}
            paginationDefaultPage={currentPage + 1}
            selectableRowsComponent={BootstrapCheckbox}
            data={checks?.data?.data}
          />
        </div>
      </Card>
      <Modal isOpen={showEdit} toggle={() => setShowEdit(!showEdit)} className='modal-dialog-centered modal-lg'>
        <ModalHeader className='bg-transparent' toggle={() => setShowEdit(!showEdit)}>
        <div className='text-center mb-2'>
            <h1 className='mb-1'>Thông tin chi tiết</h1>
            {/* <p>Thêm chi tiết thông tin</p> */}
          </div>
        </ModalHeader>
        <ModalBody className='px-sm-5 mx-50 pb-5'>
          <Row style={{ backgroundColor: '#f0f0f0', padding: '20px', borderRadius: '10px' }}>
            {/* Image Section */}
            <Col lg='5' className='d-flex justify-content-center mb-4'>
              <img
                src={`http://127.0.0.1:8000/files/?file_path=${infoData.image}`}
                alt='Patient Image'
                style={{
                  width: '300px', // Smaller width for the image
                  height: '300px', // Smaller height for the image
                  objectFit: 'cover', // Ensures the image is contained properly
                  borderRadius: '15px', // Rounded corners for smoother appearance
                }}
              />
            </Col>
            <Col lg='2'></Col>
            {/* Information Section */}
            <Col lg='5'>
              <div className='patient-info'>
                <h5><strong> {infoData.full_name}</strong></h5>
                <div style={{ marginTop: '20px' }}>
                  <p><strong>Đơn vị:</strong> {infoData.unit}</p>
                  <p><strong>Lượt khám:</strong> {infoData.time}</p>
                  <p><strong>Nhận xét:</strong> {infoData.description}</p>
                  <p><strong>Ngày:</strong> {infoData.date}</p>
                  <p><strong>Kết luận:</strong> {infoData.result}</p>
                  <p><strong>Bác sĩ:</strong> {infoData.user}</p>
                </div>
              </div>
            </Col>
          </Row>
        </ModalBody>

      </Modal>
      {/* 
      <style>
        {`
    .react-viewer-inline {
      min-height: 450px !important;
    }
  `}
      </style> */}

    </Fragment >
  )
}

export default ManageHistories
