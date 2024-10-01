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
import { get, update, delet, add } from '@store/action/units'
import { toDateStringFormat1, toDateString } from '@utils'
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
  const [searchTerm, setSearchTerm] = useState('')
  const [showEdit, setShowEdit] = useState(false)
  const [showDelete, setShowDelete] = useState(false)
  const [showAdd, setShowAdd] = useState(false)
  const [infoData, setInfo] = useState({
  })
  const [id, setId] = useState(0)
  const [unitFather, setUnitFather] = useState([])
  const [picker, setPicker] = useState(new Date())
  const [object, setObject] = useState(true)
  const [edit, setEdit] = useState(true)
  const [infoAddData, setInfoAdd] = useState({
    name: '',
    symbol: '',
    description: '',
    unit_father_id: 1,
  })
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
        setUnitFather(response.data.data.data) // Lưu dữ liệu vào state
      } catch (error) {
        console.error("Error fetching data", error)
      }
    }

    fetchData() // Gọi API khi component mount
  }, [])
  const handleOnChangeSelect = (selectedUnit) => {
    setInfo({
      ...infoData,
      unit_father_id: selectedUnit?.id,  // Cập nhật unit_id
      unit_father: selectedUnit?.name  // Cập nhật unit_name
    })
  }
  const filteredUnits = unitFather
    .filter(unit => unit.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .map(unit => ({
      id: unit.id,
      name: unit.name
    }))
  const units = useSelector((state) => {
    return state.units.units
  })
  useEffect(() => {
    dispatch(get({
      pageSize: 9,
      pageNumber: currentPage + 1,
      search_text: searchValue
    }))
  }, [dispatch, currentPage, searchValue])
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
    setId(data.id)
  }
  const role = localStorage.getItem('role_id')

  const handleUpdate = () => {
    dispatch(update(infoData))
    setEdit(true)
    setShowEdit(false)

  }
  const handleAdd = () => {

    dispatch(add(infoAddData))
    setShowAdd(false)

  }
  const handleDelet = () => {
    dispatch(delet(id))
    setShowDelete(false)
  }
  const handleHistory = (data) => {
    navigate(`/managements/userHistory/${data}`)
  }
  const handleOnAddSelect = (selectedUnit) => {
    setInfoAdd({
      ...infoAddData,
      unit_id: selectedUnit?.id,  // Cập nhật unit_id
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
      name: data.name,
      symbol: data.symbol,
      description: data.description ? data.description : "",
      unit_father: data.unit_father,
      unit_father_id: data.unit_father_id
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
    setInfoAdd({ ...infoAddData, [pop]: data })
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
              placeholder='Tìm kiếm tên đơn vị'
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
              <Input id='softwarelibname' type='text' value={infoData.name} onChange={(e) => handleOnChange(e.target.value, "name")} />

            </Col>
            <Col md={12} xs={12}>
              <Label className='form-label' for='symbol'>

                Ký hiệu  <span style={{ color: 'red' }}>*</span>
              </Label>
              <Input id='sumbol' type='text' value={infoData.symbol} onChange={(e) => handleOnChange(e.target.value, "symbol")} />

            </Col>
            <Col md={12} xs={12}>
              <Label className='form-label' for='softwarelibdescription'>
                Mô tả
              </Label>
              <Input id='softwarelibdescription' type='text' value={infoData.description} onChange={(e) => handleOnChange(e.target.value, "description")} />
            </Col>
            <Col md={12} xs={12}>
              <FormGroup>
                <Label className='form-label' for='unit'>
                  Đơn vị cấp trên
                </Label>
                <Input
                  id='unit'
                  type='select'
                  value={infoData.unit_father}
                  onChange={(e) => {
                    console.log(e.target.value)
                    const selectedUnit = filteredUnits.find(unit => unit.id === parseInt(e.target.value))  // Tìm đơn vị
                    console.log(selectedUnit)
                    handleOnChange(selectedUnit.name, "unit_father")
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
              <Button type='submit' className='me-1' color='primary' onClick={handleUpdate} style={{ display: 'inline-block' }}>
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
              <Input id='softwarelibname' type='text' value={infoAddData.name} onChange={(e) => handleOnChangeAdd(e.target.value, "name")} />

            </Col>
            <Col md={12} xs={12}>
              <Label className='form-label' for='symbol'>
                Ký hiệu <span style={{ color: 'red' }}>*</span>
              </Label>
              <Input id='symbol' type='text' value={infoAddData.symbol} onChange={(e) => handleOnChangeAdd(e.target.value, "symbol")} />

            </Col>
            <Col md={12} xs={12}>
              <Label className='form-label' for='softwarelibdescription'>
                Mô tả
              </Label>
              <Input id='softwarelibdescription' type='text' value={infoAddData.description} onChange={(e) => handleOnChangeAdd(e.target.value, "description")} />
            </Col>
            <Col md={12} xs={12}>
              <FormGroup>
                <Label className='form-label' for='unit'>
                  Đơn vị cấp trên
                </Label>
                <Input
                  id='unit'
                  type='select'
                  // defaultValue={filteredUnits.length > 0 ? filteredUnits[0].name : ''}
                  onChange={(e) => {
                    console.log(e.target.value)
                    const selectedUnit = filteredUnits.find(unit => unit.id === parseInt(e.target.value))  // Tìm đơn vị
                    console.log(selectedUnit)
                    handleOnAddSelect(selectedUnit)
                  }}
                >
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
