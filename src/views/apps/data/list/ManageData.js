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
import { toDateString } from '@utils'
import { getListData, updateData, addData, deleteData } from '@store/action/dataset'

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

const ManageData = () => {
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
  const [statusValue, setStatusValue] = useState('')
  const [object, setObject] = useState(true)
  const roleId = JSON.parse(localStorage.getItem('userData'))
  const [infoaddData, setInfoadd] = useState({
    datasetname: '',
    datasettype: 0,
    datasetfolderurl: '',
    datasetsoftID: 1,
    datasetsum: 1,
    datasetdescription: ''
  })
  const [file, setFile] = useState()
  const [valErrors, setValErrors] = useState({
    datasetname: '',
    datasetsum: '',
  })
  const dataDataset = useSelector((state) => {
    return state.dataset.dataDataset
  })
  // console.log(dataDataset)
  useEffect(() => {
    dispatch(getListData({
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
    dispatch(deleteData(infoData.datasetid))
    setShowDelete(false)
    setCurrentPage(0)
  }

  const handleUpdate = () => {
    if (infoData.datasetsum  > 0 && infoData.datasetsum !== undefined && infoData.datasetname.trim() !== '') {
      const result = dispatch(updateData(infoData, file))
      .then(result => {
        console.log(result)
        if (result === 1) {
          setShowEdit(false)
          // setEdit(true)
        } else {
          setShowEdit(true)
          // setEdit(false)
        }
      })
      // setShowEdit(false)
      setValErrors({
        datasetsum: '',
        datasetname: '',
      })
    } else {
      let temp = valErrors
      if (infoData.datasetname.trim() === '' || infoData.datasetname === undefined) { temp = { ...temp, datasetname: 'Không được để trống tên' } } 
      if (!file) {
        temp = { ...temp, salary: 'Bắt buộc phải upload file' }
      }
      if (infoaddData.datasetsum <= 0) {
        temp = { ...temp, datasetsum: 'Giá trị phải dương' }
      }
      setValErrors(temp)
    }
    setCurrentPage(0)
  }
  const handleAdd = () => {
    // if (!file) {
    //   setValErrors({ ...valErrors, salary: 'Bắt buộc phải upload file' })
    //   return
    // } 
    console.log('file: ', file)
    if (infoaddData.datasetsum > 0 && infoaddData.datasetsum !== undefined && infoaddData.datasetname.trim() !== '' && file) {
      dispatch(addData(infoaddData, file))
      .then(result => {
        console.log(result)
        if (result === 1) {
          setShowAdd(false)
          setInfoadd({
            datasetname: '',
            datasettype: 0,
            datasetfolderurl: '',
            datasetsoftID: 1,
            datasetsum: 0,
            datasetdescription: '',
            salary: null,
            
        })
        setFile(null)
        setValErrors({
            datasetsum: '',
            datasetname: '',
            salary: '',
        })
          // setEdit(true)
        } else {
          setShowAdd(true)
          // setEdit(false)
        }
      })
    
  } else {
      let temp = { ...valErrors }
      if (infoaddData.datasetname.trim() === '' || infoaddData.datasetname === undefined) {
          temp = { ...temp, datasetname: 'Không được để trống tên' }
      } 
      if (!file) {
          temp = { ...temp, salary: 'Bắt buộc phải upload file' }
      }
      if (infoaddData.datasetsum <= 0) {
        temp = { ...temp, datasetsum: 'Giá trị phải dương' }
      }
      setValErrors(temp)
  }
  
    
  }
  const handleDelet = (data) => {
    setInfo({
      datasetid: data.datasetid,
      datasetname: data.datasetname,
      datasettype: data.datasettype,
      datasetfolderurl: data.datasetfolderurl,
      datasetsoftID: data.datasetsoftID,
      datasetsum: data.datasetsum,
      datasetdescription: data.datasetdescription,
    })
    setShowDelete(true)
  }
  const handleCancel = () => {
    setInfoadd({
      datasetname: '',
      datasettype: 0,
      datasetfolderurl: '',
      datasetsoftID: 1,
      datasetsum: 0,
      datasetdescription: ''
    })
    setShowAdd(false)
  }
  const handleHistory = (data) => {
    navigate(`/managements/userHistory/${data}`)
  }
  
  const onSubmit = data => {
    // if (!file) {
    //   setValErrors({ ...valErrors, salary: 'Bắt buộc phải upload file' })
    //   return
    // } 
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
      datasetid: data.datasetid,
      datasetname: data.datasetname,
      datasettype: data.datasettype,
      datasetfolderurl: data.datasetfolderurl,
      datasetsoftID: data.datasetsoftID,
      datasetsum: data.datasetsum,
      datasetdescription: data.datasetdescription,
    })
   
  }

  const handleStatusValue = val => {
    setStatusValue(val)
    setSearchValue('')
    dispatch(getListData({
      pageSize: 10,
      page: currentPage + 1,
      type: val
    }))
  }
  const handleOnChange = (data, pop) => {
    if (data === null || data === undefined || data === "") {
      setValErrors(prevValErrors => ({ ...prevValErrors, [pop]: 'Không được để trống' }))
  } else if (parseFloat(data) <= 0) {
      setValErrors(prevValErrors => ({ ...prevValErrors, [pop]: 'Giá trị phải dương' }))
  } else {
      setValErrors(prevValErrors => ({ ...prevValErrors, [pop]: null }))
  }
    setInfo({ ...infoData, [pop]: data })
  }
  // function isDisable() {
  //   const o = Object.keys(valErrors)
  //     .filter((k) => valErrors[k] !== null)
  //     .reduce((a, k) => ({ ...a, [k]: valErrors[k] }), {})
  //   if (Object.entries(o).length !== 0) return true
  //   else return false
  // }
  function isDisable() {
    return Object.values(valErrors).some((error) => error !== null && error !== '')
  }

  // const handleOnChangeAdd = (data, pop) => {
  //   if (data === null || data === undefined || data === "") {
  //     setValErrors({ ...valErrors, [pop]: 'Không được để trống' })
  //   } else {
  //     setValErrors({ ...valErrors, [pop]: null })
  //   }
  //   setInfoadd({ ...infoaddData, [pop]: data })
  // }
  const handleOnChangeAdd = (data, pop) => {
    console.log("data: ", data)
    if (data === null || data === undefined || data === "") {
        setValErrors(prevValErrors => ({ ...prevValErrors, [pop]: 'Không được để trống' }))
    } else if (parseFloat(data) <= 0) {
        setValErrors(prevValErrors => ({ ...prevValErrors, [pop]: 'Giá trị phải dương' }))
    } else {
        setValErrors(prevValErrors => ({ ...prevValErrors, [pop]: null }))
    }

    setInfoadd(prevInfoaddData => ({ ...prevInfoaddData, [pop]: data }))
}

  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0]
    // console.log("uploadedFile: ", uploadedFile)
    if (!uploadedFile) {
        setValErrors({ ...valErrors, salary: 'Bắt buộc phải upload file' })
    } else {
        setValErrors({ ...valErrors, salary: null })
        setFile(uploadedFile)
    }
  }

  const columns = [
    {
      name: 'Tên bộ dữ liệu',
      sortable: true,
      minWidth: '200px',
      selector: row => row.datasetname,
    },
    {
      name: 'Ngày tạo',
      sortable: true,
      minWidth: '100px',
      selector: row => toDateString(row.datasetcreatedtime)
    },
    {
      name: 'Người tạo',
      sortable: true,
      minWidth: '50px',
      selector: row => row.datasetowner_name
    },
    {
      name: 'Bài toán',
      sortable: true,
      minWidth: '150px',
      cell: (row) => {
        return (
          row.datasetsoftID === 1 ? 'Nhận diện khuôn mặt' : row.datasetsoftID === 2 ? 'Nhận dạng sự kiện bất thường' : 'Phát hiện khuôn mặt'
        )
      }
    },
    {
      name: 'Loại dữ liệu',
      sortable: true,
      minWidth: '150px',
      cell: (row) => {
        return (
          row.datasettype === 0 ? 'Private' : 'Public'
        )
      }
    },

    {
      name: 'Số lượng mẫu',
      sortable: true,
      minWidth: '150px',
      selector: row => row.datasetsum
    },
    {
      name: 'Tác vụ',
      allowOverflow: true,
      cell: (row) => {
        return (
          <>
          { 
          JSON.parse(localStorage.getItem('userData')).roleid === 3 ? <></> : <div className='d-flex'>
            <Edit size={15} onClick={() => handleEdit(row)} style={{ cursor: 'pointer', marginLeft: '-18px' }} />
            <Trash size={15} onClick={() => handleDelet(row)} style={{ cursor: 'pointer', marginLeft: '6px' }} />
          </div>
          }
        </>
        )
      }
    }
  ]

  // ** Function to handle filter
  const handleFilter = e => {
    const value = e.target.value
    setSearchValue(value)

    const status = {
      1: { title: 'Nhận diện khuôn mặt', color: 'light-primary' },
      2: { title: 'Nhận dạng sự kiện bất thường', color: 'light-success' },
      3: { title: 'Phát hiện khuôn mặt', color: 'light-danger' }
    }

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
      pageCount={dataDataset.totalPages}
      breakLabel='...'
      pageRangeDisplayed={1}
      marginPagesDisplayed={1}
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
          <CardTitle tag='h4' style={{ fontWeight: 'bold', color: '#1203b1' }}>DANH SÁCH BỘ DỮ LIỆU</CardTitle>
          <div className='d-flex mt-md-0 mt-1'>
            {
               <Button className='ms-2' color='primary' onClick={() => setShowAdd(true)}> <Plus size={15} /> <span className='align-middle ms-50'>Thêm bộ dữ liệu</span> </Button> 
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
              placeholder='Tìm kiếm tên bộ dữ liệu'
              style={{ marginRight: '10px', height: '36px' }}
            />
             <Input type='select' value={statusValue} onChange={e => handleStatusValue(e.target.value)} className='dataTable-filter mb-50'>
            <option value=''>Tất cả</option>
            <option value='1'>Nhận diện khuôn mặt</option>
            <option value='2'>Nhận dạng sự kiện bất thường</option>
            <option value='3'>Phát hiện khuôn mặt</option>
          </Input>
          </Col>
          {/* <Col className='d-flex align-items-center justify-content-end mt-1' md='3' sm='12'> */}
          {/* <Input className='w-auto ' type='select' value={statusValue} onChange={e => handleStatusValue(e.target.value)}>
            <option value=''>Tất cả</option>
            <option value='1'>Nhận diện khuôn mặt</option>
            <option value='2'>Nhận dạng sự kiện bất thường</option>
            <option value='3'>Phát hiện khuôn mặt</option>
          </Input> */}
          {/* </Col> */}
        </Row>
        <div className='react-dataTable react-dataTable-selectable-rows'>
          <DataTable
            noHeader
            pagination
            columns={columns}
            paginationPerPage={10}
            className='react-dataTable'
            sortIcon={<ChevronDown size={10} />}
            paginationComponent={CustomPagination}
            paginationDefaultPage={currentPage + 1}
            selectableRowsComponent={BootstrapCheckbox}
            data={dataDataset.results}
          />
        </div>
      </Card>
      <Modal isOpen={showEdit} toggle={() => setShowEdit(!showEdit)} className='modal-dialog-centered modal-lg' backdrop="static">
        <ModalHeader className='bg-transparent' toggle={() => setShowEdit(!showEdit)}></ModalHeader>
        <ModalBody className='px-sm-5 mx-50 pb-5'>
          <div className='text-center mb-2'>
            <h1 className='mb-1'>Chi tiết bộ dữ liệu</h1>
            <p>Cập nhật chi tiết thông tin</p>
          </div>
          <Row tag='form' className='gy-1 pt-75' onSubmit={handleSubmit(onSubmit)}>
            <Col md={12} xs={12}>
              <Label className='form-label' for='datasetname'>
                Tên bộ dữ liệu <span style={{ color: 'red' }}>*</span>
              </Label>
              <Input id='datasetname' type='text' value={infoData.datasetname} onChange={(e) => handleOnChange(e.target.value, "datasetname")} />
              <p style={{ fontSize: '10px', fontStyle: 'italic', color: 'red' }}>{valErrors.datasetname}</p>

            </Col>
            <Col md={12} xs={12}>
              <Label className='form-label' for='datasetsum'>
                Số lượng mẫu <span style={{ color: 'red' }}>*</span>
              </Label>
              <Input id='datasetsum' type='number' value={infoData.datasetsum} onChange={(e) => handleOnChange(e.target.value, "datasetsum")} />
              <p style={{ fontSize: '10px', fontStyle: 'italic', color: 'red' }}>{valErrors.datasetsum}</p>
            </Col>
            <Col md={12} xs={12}>
              <Label className='form-label' for='datasetsoftID'>
                Loại bài toán <span style={{ color: 'red' }}>*</span>
              </Label>
              <Input type='select' name='datasetsoftID' id='datasetsoftID' value={infoData.datasetsoftID} onChange={(e) => handleOnChange(e.target.value, "datasetsoftID")}>
                <option value='1'>Nhận diện khuôn mặt</option>
                <option value='2'>Nhận dạng sự kiện bất thường</option>
                <option value='3'>Phát hiện khuôn mặt</option>
              </Input>
            </Col>
            <Col md={12} xs={12}>
              <Label className='form-label' for='datasetdescription'>
                Mô tả
              </Label>
              <Input id='datasetdescription' type='text' value={infoData.datasetdescription} onChange={(e) => handleOnChange(e.target.value, "datasetdescription")} />

            </Col>
            <Col md={12} xs={12}>
              <Label className='form-label' for='salary' >
                Chọn file zip bộ dữ liệu <span style={{ color: 'red' }}>*</span>
              </Label>
              <Input type='file' id='salary' onChange={(e) => setFile(e.target.files[0])} accept=".zip" />
            </Col>
            <Col md={12} xs={12}>
              {roleId.roleid === 2 && (
                <div className='demo-inline-spacing mb-1'>
                  <div className='form-check'>
                    <Input
                      type='radio'
                      id='ex1-active'
                      name='ex1'
                      checked={infoData.datasettype === 1}
                      onClick={(e) => handleOnChange(1, "datasettype")}
                    />
                    <Label className='form-check-label' for='ex1-active'>
                      Public
                    </Label>
                  </div>
                  <div className='form-check'>
                    <Input
                      type='radio'
                      name='ex1'
                      id='ex1-inactive'
                      checked={infoData.datasettype === 0}
                      onClick={(e) => handleOnChange(0, "datasettype")}
                    />
                    <Label className='form-check-label' for='ex1-inactive'>
                      Private
                    </Label>
                  </div>
                </div>
              )}
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
      <Modal isOpen={showAdd} toggle={() => setShowAdd(!showAdd)} className='modal-dialog-centered modal-lg' backdrop="static">
        <ModalHeader className='bg-transparent' toggle={handleCancel}></ModalHeader>
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
              <Input type='file' id='salary' onChange={handleFileChange} accept=".zip" />
              {valErrors.salary &&  <p style={{ fontSize: '10px', fontStyle: 'italic', color: 'red' }}>{valErrors.salary}</p>}
              {/* <Input
                  type='file'
                  id='salary'
                  onChange={handleFileChange}
                  accept=".zip"
              /> */}
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
              {/* <Button type='submit' className='me-1' color='primary' onClick={handleAdd} disabled={isDisable()}> */}
              <Button type='submit' className='me-1' color='primary' onClick={handleAdd}>
                Thêm mới
              </Button>
              <Button type='reset' color='secondary' outline onClick={handleCancel}>
                Hủy
              </Button>
            </Col>
          </Row>
        </ModalBody>
      </Modal>
      <Modal isOpen={showDelete} toggle={() => setShowDelete(!showDelete)} className='modal-dialog-centered modal-lg' backdrop="static">
        <ModalHeader className='bg-transparent' toggle={() => setShowDelete(!showDelete)}></ModalHeader>
        <ModalBody className='px-sm-5 mx-50 pb-5'>
          <div className='text-center mb-2'>
            <h1 className='mb-1'>Xóa bộ dữ liệu</h1>
            <p>Xóa bộ ảnh hưởng các mô hình đang dùng. Bạn có chắc muốn xóa không?</p>
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

export default ManageData
