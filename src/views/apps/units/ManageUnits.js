// ** React Imports
import { Fragment, useState, forwardRef, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

// ** Table Data & Columns
import { data } from './data'
import { Controller, useForm } from 'react-hook-form'
import Avatar from '@components/avatar'
// ** Third Party Components
import ReactPaginate from 'react-paginate'
import DataTable from 'react-data-table-component'
import { ChevronDown, Share, Printer, FileText, File, Grid, Copy, Plus, Edit, Trash, Check, Clipboard } from 'react-feather'
import { useSelector, useDispatch } from 'react-redux'
import { get, update, dels, add } from '@store/action/units'
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
  Badge
} from 'reactstrap'
import { format } from 'prettier'
import { getListUser } from '../../../redux/action/profile'

// ** Bootstrap Checkbox Component
const BootstrapCheckbox = forwardRef((props, ref) => (
  <div className='form-check'>
    <Input type='checkbox' ref={ref} {...props} />
  </div>
))

const ManageUnits = () => {
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
  const units = useSelector((state) => {
    return state.units.units
  })
  useEffect(() => {
    dispatch(get({
      pageSize: 9,
      pageNumber: currentPage + 1
    }))
  }, [dispatch, currentPage])
// console.log(diseases)
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
      softwarelibid: data.softwarelibid,
      softwarelibname: data.softwarelibname,
      softwareliburl: data.softwareliburl,
      softwarelibdescription: data.softwarelibdescription,
    })
  }
  const role = localStorage.getItem('role_id')
  console.log(role)
  const handleUpdate = () => {
    if (infoData.softwarelibname.trim() !== '' && infoData.softwareliburl.trim() !== '') {
      dispatch(updateLibs(infoData))
      setEdit(true)
      setShowEdit(false)
      setValErrors({
        softwarelibname: '',
        softwareliburl: '',
        softwarelibdescription: '',
      })
    } else {
      let temp = valErrors

      if (infoData.softwarelibname.trim() === '' || infoaddData.softwarelibname === undefined) { temp = { ...temp, softwarelibname: 'Không được để trống tên thư viện' } } 
      if (infoData.softwareliburl.trim() === '' || infoaddData.softwareliburl === undefined) { temp = { ...temp, softwareliburl: 'Không được để trống đường dẫn' } } 
      setValErrors(temp)

    }

  }
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
  const handleDelet = () => {
    dispatch(deleteLibs(infoData.softwarelibid))
    setShowDelete(false)
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
    setShowEdit(true)
    setInfo({
      name: data.name,
      symbol: data.symbol,
      description: data.description,
      unit_father: data.unit_father,
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
      name: 'Tên đơn vị',
      sortable: true,
      minWidth: '200px',
      selector: row => row.name,
    },
    {
      name: 'Ký hiệu',
      sortable: true,
      minWidth: '200px',
      selector: row => row.symbol,
    },
    {
        name: 'Đơn vị cấp trên',
        sortable: true,
        minWidth: '200px',
        selector: row => row.unit_father,
      },
      
  ]
  if (role === 'A') {
    columns.push({
      name: 'Tác vụ',
      allowOverflow: true,
      cell: (row) => {
        return (
          <div className='d-flex'>
            <Edit size={15} onClick={() => handleEdit(row)} style={{ cursor: 'pointer', marginLeft: '-18px' }} />
            <Trash size={15} onClick={() => handleDelete(row)} style={{ cursor: 'pointer', marginLeft: '6px' }} />
          </div>
        )
      }
    })
  }
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
  console.log(role)
  const [totalPages, setTotalPages] = useState(0)

  useEffect(() => {
    if (units?.data?.metadata) {
    setTotalPages(units.data.metadata.total_pages)
  }
   
    setCurrentPage(0)
  }, [units.count])

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
    pageCount={units?.data?.metadata.total_pages}
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

  return (
    <Fragment>
      <Card>
        <CardHeader className='flex-md-row flex-column align-md-items-center align-items-start border-bottom'>
          <CardTitle tag='h4' style={{ fontWeight: 'bold', color: '#1203b1' }}>DANH SÁCH ĐƠN VỊ</CardTitle>
          <div className='d-flex mt-md-0 mt-1'>
            {
              role === 'A' ? <Button className='ms-2' color='primary' onClick={() => setShowAdd(true)}>
                <Plus size={15} />
                <span className='align-middle ms-50'>Thêm đơn vị</span>
              </Button> : <></>
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
            data={Array.isArray(units?.data?.data) ? units.data.data : []}
          />
        </div>
      </Card>
      <Modal isOpen={showEdit} toggle={() => setShowEdit(!showEdit)} className='modal-dialog-centered modal-lg'>
        <ModalHeader className='bg-transparent' toggle={() => setShowEdit(!showEdit)}></ModalHeader>
        <ModalBody className='px-sm-5 mx-50 pb-5'>
          <div className='text-center mb-2'>
            <h1 className='mb-1'>Thông tin chi tiết</h1>
            <p>Cập nhật chi tiết</p>
          </div>
          <Row tag='form' className='gy-1 pt-75' onSubmit={handleSubmit(onSubmit)}>
            <Col md={12} xs={12}>
              <Label className='form-label' for='softwarelibname'>

                Tên đơn vị  <span style={{ color: 'red' }}>*</span>
              </Label>
              <Input id='softwarelibname' type='text' value={infoData.name} onChange={(e) => handleOnChange(e.target.value, "softwarelibname")} readOnly={edit} />
              <p style={{ fontSize: '10px', fontStyle: 'italic', color: 'red' }}>{valErrors.softwarelibname}</p>
            </Col>
            <Col md={12} xs={12}>
              <Label className='form-label' for='symbol'>

                Ký hiệu  <span style={{ color: 'red' }}>*</span>
              </Label>
              <Input id='sumbol' type='text' value={infoData.symbol} onChange={(e) => handleOnChange(e.target.value, "softwarelibname")} readOnly={edit} />
              <p style={{ fontSize: '10px', fontStyle: 'italic', color: 'red' }}>{valErrors.softwarelibname}</p>
            </Col>
            <Col md={12} xs={12}>
              <Label className='form-label' for='softwarelibname'>

                Đơn vị cấp trên  <span style={{ color: 'red' }}>*</span>
              </Label>
              <Input id='softwarelibname' type='text' value={infoData.unit_father} onChange={(e) => handleOnChange(e.target.value, "softwarelibname")} readOnly={edit} />
              <p style={{ fontSize: '10px', fontStyle: 'italic', color: 'red' }}>{valErrors.softwarelibname}</p>
            </Col>
            <Col md={12} xs={12}>
              <Label className='form-label' for='softwarelibdescription'>
                Mô tả
              </Label>
              <Input id='softwarelibdescription' type='text' value={infoData.description} onChange={(e) => handleOnChange(e.target.value, "softwarelibdescription")} readOnly={edit} />
            </Col>
            <Col xs={12} className='text-center mt-2 pt-50'>
              {
                role === 'A' ? <></> : <Button type='submit' className='me-1' color='primary' onClick={e => setEdit(false)} style={{ display: edit === true ? 'inline-block' : 'none' }}>
                  Chỉnh sửa
                </Button>
              }

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
            <h1 className='mb-1'>Thêm đơn vị</h1>
          </div>
          <Row tag='form' className='gy-1 pt-75' onSubmit={handleSubmit(onSubmit)}>
            <Col md={12} xs={12}>
              <Label className='form-label' for='softwarelibname'>
                Tên đơn vị <span style={{ color: 'red' }}>*</span>
              </Label>
              <Input id='softwarelibname' type='text' value={infoaddData.softwarelibname} onChange={(e) => handleOnChangeAdd(e.target.value, "softwarelibname")} />
              <p style={{ fontSize: '10px', fontStyle: 'italic', color: 'red' }}>{valErrors.softwarelibname}</p>
            </Col>
            <Col md={12} xs={12}>
              <Label className='form-label' for='symbol'>
                Ký hiệu <span style={{ color: 'red' }}>*</span>
              </Label>
              <Input id='symbol' type='text' value={infoaddData.softwarelibname} onChange={(e) => handleOnChangeAdd(e.target.value, "softwarelibname")} />
              <p style={{ fontSize: '10px', fontStyle: 'italic', color: 'red' }}>{valErrors.softwarelibname}</p>
            </Col>
            <Col md={12} xs={12}>
              <Label className='form-label' for='softwarelibname'>

                Đơn vị cấp trên  <span style={{ color: 'red' }}>*</span>
              </Label>
              <Input id='softwarelibname' type='text' value={infoData.softwarelibname} onChange={(e) => handleOnChange(e.target.value, "softwarelibname")} readOnly={edit} />
              <p style={{ fontSize: '10px', fontStyle: 'italic', color: 'red' }}>{valErrors.softwarelibname}</p>
            </Col>
            <Col md={12} xs={12}>
              <Label className='form-label' for='softwarelibdescription'>
                Mô tả
              </Label>
              <Input id='softwarelibdescription' type='text' value={infoaddData.softwarelibdescription} onChange={(e) => handleOnChangeAdd(e.target.value, "softwarelibdescription")} />
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
            <h1 className='mb-1'>Xóa đơn vị</h1>
            <p>Bạn có muốn xóa thông tin ngay bây giờ không?</p>
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

export default ManageUnits
