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
import { ChevronDown, Share, Printer, FileText, File, Grid, Copy, Plus, Edit, Trash, Check, Clipboard } from 'react-feather'
import { useSelector, useDispatch } from 'react-redux'
import { getListUser, updateUser, deleteUser, addUser } from '@store/action/profile'
import { getListModel, updateModel, deleteModel, addModel } from '@store/action/model'
import { toDateStringFormat1, toDateString } from '@utils'
import style from './style.css'
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
  Badge
} from 'reactstrap'
import { format } from 'prettier'

// ** Bootstrap Checkbox Component
const BootstrapCheckbox = forwardRef((props, ref) => (
  <div className='form-check'>
    <Input type='checkbox' ref={ref} {...props} />
  </div>
))

const ManageModel = () => {
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
  const [listTrain, setList] = useState([])

  const [infoaddData, setInfoadd] = useState({
    modelname: '',
    modelfiletutorial: '',
    modelfiledescription: '',
    modeldescription: '',
    modeleventtype: '',
    modelcreator: '',
    modelcreatedtime: new Date(),
    modelsoftlibid: 1,
    pretrainpath: '',
    default_json_Paramsconfigs: '',
    modeltype: 1,
  })
  const [file, setFile] = useState()
  const [valErrors, setValErrors] = useState({
    modelname: '',
    modeleventtype: '',
    modelcreatedtime: '',
    pretrainpath: '',
    default_json_Paramsconfigs: '',
    modelfiletutorial: '',
    modelfiledescription: '',
    modeldescription: '',
  })
  const dataModel = useSelector((state) => {
    return state.model.dataModel
  })
  // console.log(dataModel)

  const roleID = JSON.parse(localStorage.getItem('userData'))
  useEffect(() => {
    dispatch(getListModel({
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

  const handleDelete = (data) => {
    setShowDelete(true)
    setInfo({
      modelid: data.modelid,
      modelname: data.modelname,
      modelfiletutorial: data.modelfiletutorial,
      modelfiledescription: data.modelfiledescription,
      modeldescription: data.modeldescription,
      modeleventtype: data.modeleventtype,
      modelcreator: data.modelcreator,
      modelcreatedtime: data.modelcreatedtime,
      modelsoftlibid: data.modemodelsoftlibidlid,
      pretrainpath: data.pretrainpath,
      default_json_Paramsconfigs: data.default_json_Paramsconfigs,
      modeltype: data.modeltype,
    })
  }

  const handleUpdate = () => {
    const emptyFields = []

    // Iterate over keys and values of infoaddData to find empty fields
    Object.entries(infoData).forEach(([key, value]) => {
      // console.log('dict:', key, ": ", typeof value)
      if (typeof value === 'string' && (value.trim() === '' || value === null || value === undefined)) {
        emptyFields.push(key) // Push the key of the empty field to the emptyFields array
      }
    })

    // Set validation errors for empty fields
    const valErrorsCopy = { ...valErrors }
    emptyFields.forEach(field => {
      valErrorsCopy[field] = 'Không được để trống'
    })
    setValErrors(valErrorsCopy)

    // If there are no empty fields, proceed to add the model
    if (emptyFields.length === 0) {
      const result = dispatch(updateModel(infoData))
  .then(result => {
    if (result === 1) {
      setShowEdit(false)
      setEdit(true)
    } else {
      setShowEdit(true)
      setEdit(false)
    }
    return result // Trả về kết quả nếu promise được resolved
  })
  .catch(error => {
    console.log('Promise rejected with error:', error)
    setShowEdit(true)
    setEdit(false)
    return error // Trả về lỗi nếu promise bị rejected
  })

    }

  }
  // const handleAdd = () => {
  //   dispatch(addModel(infoaddData))
  //   setInfoadd({
  //     modelname: '',
  //     modelfiletutorial: '',
  //     modelfiledescription: '',
  //     modeldescription: '',
  //     modeleventtype: '',
  //     modelcreator: '',
  //     modelcreatedtime: new Date(),
  //     modelsoftlibid: 1,
  //     pretrainpath: '',
  //     default_json_Paramsconfigs: '',
  //     modeltype: 1,
  //   })
  //   setShowAdd(false)
  // }
  const handleAdd = () => {
    const emptyFields = []

    // Iterate over keys and values of infoaddData to find empty fields
    Object.entries(infoaddData).forEach(([key, value]) => {
      console.log('dict:', key, ": ", typeof value)
      if (typeof value === 'string' && (value.trim() === '' || value === null || value === undefined)) {
        emptyFields.push(key) // Push the key of the empty field to the emptyFields array
      }
    })

    // Set validation errors for empty fields
    const valErrorsCopy = { ...valErrors }
    emptyFields.forEach(field => {
      valErrorsCopy[field] = 'Không được để trống'
    })
    setValErrors(valErrorsCopy)

    // If there are no empty fields, proceed to add the model
    if (emptyFields.length === 0) {
      dispatch(addModel(infoaddData))
      setInfoadd({
        modelname: '',
        modelfiletutorial: '',
        modelfiledescription: '',
        modeldescription: '',
        modeleventtype: '',
        modelcreator: '',
        modelcreatedtime: new Date(),
        modelsoftlibid: 1,
        pretrainpath: '',
        default_json_Paramsconfigs: '',
        modeltype: 1,
      })
      setShowAdd(false)
    }
  }

  const handleDelet = () => {
    dispatch(deleteModel(infoData.modelid))
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
    setEdit(false)
    setShowEdit(true)
    setInfo({
      modelid: data.modelid,
      modelname: data.modelname,
      modelfiletutorial: data.modelfiletutorial,
      modelfiledescription: data.modelfiledescription,
      modeldescription: data.modeldescription,
      modeleventtype: data.modeleventtype,
      modelcreator: data.modelcreator,
      modelcreatedtime: data.modelcreatedtime,
      modelsoftlibid: data.modelsoftlibid,
      pretrainpath: data.pretrainpath,
      default_json_Paramsconfigs: data.default_json_Paramsconfigs,
      modeltype: data.modeltype,
    })
  }
  const handleOnChange = (data, pop) => {

    if (data.trim() === null || data.trim() === undefined || data.trim() === "") {
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
    console.log(typeof (data.trim()))
    if (data.trim() === null || data.trim() === undefined || data.trim() === "") {
      setValErrors({ ...valErrors, [pop]: 'Không được để trống' })
    } else {
      setValErrors({ ...valErrors, [pop]: null })
    }
    setInfoadd({ ...infoaddData, [pop]: data })
  }
  // Sau khi thêm mới thành công, đặt lại giá trị của infoaddData thành rỗng
  // const handleAddSuccess = () => {

  // }
  const columns = [
    {
      name: 'Tên mô hình',
      sortable: true,
      width: '300px',
      selector: row => row.modelname,
    },
    {
      name: 'Chuỗi config mặc định',
      sortable: true,
      width: '400px',
      selector: row => row.default_json_Paramsconfigs,
    },
    {
      name: 'Ngày tạo',
      sortable: true,
      width: '200px',
      selector: row => toDateString(row.modelcreatedtime)
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
                <Trash size={15} onClick={() => handleDelete(row)} style={{ cursor: 'pointer', marginLeft: '6px' }} />
              </div>
            }
          </>
        )
      }
    }
  ]
  const columns1 = [
    {
      name: 'Mô hình gốc',
      sortable: true,
      minWidth: '100px',
      selector: row => row.modelid.modelname,
    },
    {
      name: 'Chuỗi config',
      sortable: true,
      minWidth: '300px',
      selector: row => row.model_trainedconfigid.jsonstringparams,
    },
    {
      name: 'Ngày tạo',
      sortable: true,
      minWidth: '50px',
      selector: row => toDateString(row.model_trainedcreatedtime)
    },
    {
      name: 'Người tạo',
      sortable: true,
      minWidth: '50px',
      selector: row => row.model_trainedcreatorid.usrfullname
    },
    // {
    //   name: 'Tác vụ',
    //   allowOverflow: true,
    //   cell: (row) => {
    //     return (
    //       <div className='d-flex'>
    //         <Edit size={15} onClick={() => handleEdit(row)} style={{ cursor: 'pointer', marginLeft: '-18px' }} />
    //         <Trash size={15} onClick={() => handleDelete(row)} style={{ cursor: 'pointer', marginLeft: '6px' }} />
    //       </div>
    //     )
    //   }
    // }
  ]
  const [statusValue, setStatusValue] = useState('')

  // ** Function to handle filter
  const handleFilter = e => {
    const value = e.target.value
    setSearchValue(value)
    setStatusValue('')
    const status = {
      1: { title: 'Current', color: 'light-primary' },
      2: { title: 'Professional', color: 'light-success' },
      3: { title: 'Rejected', color: 'light-danger' },
      4: { title: 'Resigned', color: 'light-warning' },
      5: { title: 'Applied', color: 'light-info' }
    }

    if (value.length) {
      dispatch(getListModel({
        page: currentPage + 1,
        search: value.trim()
      }))
      setSearchValue(value)
    } else {
      dispatch(getListModel({
        page: currentPage + 1,
      }))
    }
  }

  const handleStatusValue = val => {
    setStatusValue(val)
    setSearchValue('')
    dispatch(getListModel({
      page: currentPage + 1,
      type: val
    }))
  }
  // ** Function to handle Pagination
  const handlePagination = page => {
    setCurrentPage(page.selected)
    // dispatch(getListUser({
    //   pageSize: 1,
    //   pageNumber: page.selected + 1
    // }))
  }
  useEffect(() => {
    const url = process.env.REACT_APP_API_URL
    axios.get(`${url}/model_trained/?page=1`).then(response => {
      setList(response.data)
    })
  }, [])
  // ** Custom Pagination
  const isFirstPage = currentPage === 0
  const isLastPage = currentPage === dataModel.totalPages - 1
  // console.log('Total pages: ', dataModel.totalPages)
  const CustomPagination = () => (
    <ReactPaginate
      previousLabel=''
      nextLabel=''
      forcePage={currentPage}
      onPageChange={handlePagination}
      pageCount={dataModel.count % 10 === 0 ? dataModel.count / 10 : Math.floor(dataModel.count / 10) + 1}
      breakLabel='...'
      pageRangeDisplayed={2}
      marginPagesDisplayed={2}
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
          <CardTitle tag='h4' style={{ fontWeight: 'bold', color: '#1203b1' }}>DANH SÁCH MÔ HÌNH PUBLIC</CardTitle>
          {/* <div className='d-flex mt-md-0 mt-1'>
            {
              roleID.roleid === 3 ? <></> : <Button className='ms-2' color='primary' onClick={() => setShowAdd(true)}>
                <Plus size={15} />
                <span className='align-middle ms-50'>Thêm mô hình</span>
              </Button>
            }
          </div> */}
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
              placeholder='Tìm kiếm tên  mô hình'
              style={{ marginRight: '10px', height: '36px' }}
            />
            <Input type='select' value={statusValue} onChange={e => handleStatusValue(e.target.value)} className='dataTable-filter mb-50' >
              <option value=''>Tất cả</option>
              <option value='1'>Nhận diện khuôn mặt</option>
              <option value='2'>Nhận dạng sự kiện bất thường</option>
              <option value='3'>Phát hiện khuôn mặt</option>
            </Input>
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
            data={dataModel.results}
          />
        </div>
      </Card>
      <Card>
        <CardHeader className='flex-md-row flex-column align-md-items-center align-items-start border-bottom'>
          <CardTitle tag='h4' style={{ fontWeight: 'bold', color: '#1203b1' }}>DANH SÁCH MÔ HÌNH ĐÃ HUẤN LUYỆN</CardTitle>
        </CardHeader>
        <div className='react-dataTable react-dataTable-selectable-rows'>
          <DataTable
            noHeader
            pagination
            // selectableRows
            columns={columns1}
            paginationPerPage={10}
            className='react-dataTable'
            sortIcon={<ChevronDown size={10} />}
            paginationComponent={CustomPagination}
            paginationDefaultPage={currentPage + 1}
            selectableRowsComponent={BootstrapCheckbox}
            data={listTrain.results}
          />
        </div>
      </Card>
      <Modal isOpen={showEdit} toggle={() => setShowEdit(!showEdit)} className='modal-dialog-centered modal-lg' backdrop="static">
        <ModalHeader className='bg-transparent' toggle={() => setShowEdit(!showEdit)}></ModalHeader>
        <ModalBody className='px-sm-5 mx-50 pb-5'>
          <div className='text-center mb-2'>
            <h1 className='mb-1'>Thông tin mô hình</h1>
            <p>Cập nhật chi tiết thông tin</p>
          </div>
          <Row tag='form' className='gy-1 pt-75' onSubmit={handleSubmit(onSubmit)}>
            <Col md={12} xs={12}>
              <Label className='form-label' for='modelname'>
                Tên mô hình <span style={{ color: 'red' }}>*</span>
              </Label>
              <Input id='modelname' type='text' value={infoData.modelname} onChange={(e) => handleOnChange(e.target.value, "modelname")} readOnly={edit} />
              <p style={{ fontSize: '10px', fontStyle: 'italic', color: 'red' }}>{valErrors.modelname}</p>
            </Col>
            <Col md={12} xs={12}>
              <Label className='form-label' for='modelfiletutorial'>
                Hướng dẫn <span style={{ color: 'red' }}>*</span>
              </Label>
              <Input id='modelfiletutorial' type='text' value={infoData.modelfiletutorial} onChange={(e) => handleOnChange(e.target.value, "modelfiletutorial")} readOnly={edit} />
              <p style={{ fontSize: '10px', fontStyle: 'italic', color: 'red' }}>{valErrors.modelfiletutorial}</p>
            </Col>
            <Col md={12} xs={12}>
              <Label className='form-label' for='modelfiledescription'>
                File mô tả <span style={{ color: 'red' }}>*</span>
              </Label>
              <Input id='modelfiledescription' type='text' value={infoData.modelfiledescription} onChange={(e) => handleOnChange(e.target.value, "modelfiledescription")} readOnly={edit} />
              <p style={{ fontSize: '10px', fontStyle: 'italic', color: 'red' }}>{valErrors.modelfiledescription}</p>
            </Col>
            <Col md={12} xs={12}>
              <Label className='form-label' for='modeldescription'>
                Mô tả <span style={{ color: 'red' }}>*</span>
              </Label>
              <Input id='modeldescription' type='text' value={infoData.modeldescription} onChange={(e) => handleOnChange(e.target.value, "modeldescription")} readOnly={edit} />
              <p style={{ fontSize: '10px', fontStyle: 'italic', color: 'red' }}>{valErrors.modeldescription}</p>
            </Col>
            <Col md={12} xs={12}>
              <Label className='form-label' for='modeleventtype'>
                Loại sự kiện  <span style={{ color: 'red' }}>*</span>
              </Label>
              <Input id='modeleventtype' type='text' value={infoData.modeleventtype} onChange={(e) => handleOnChange(e.target.value, "modeleventtype")} readOnly={edit} />
              <p style={{ fontSize: '10px', fontStyle: 'italic', color: 'red' }}>{valErrors.modeleventtype}</p>
            </Col>
            <Col md={12} xs={12}>
              <Label className='form-label' for='modelcreator'>
                Người tạo <span style={{ color: 'red' }}>*</span>
              </Label>
              <Input id='modelcreator' type='text' value={infoData.modelcreator} onChange={(e) => handleOnChange(e.target.value, "modelcreator")} readOnly={edit} />
              <p style={{ fontSize: '10px', fontStyle: 'italic', color: 'red' }}>{valErrors.modelcreator}</p>
            </Col>
            <Col md={12} xs={12}>
              <Label className='form-label' for='modelsoftlibid'>
                Loại bài toán <span style={{ color: 'red' }}>*</span>
              </Label>
              <Input type='select' name='modelsoftlibid' id='modelsoftlibid' value={infoData.modelsoftlibid} onChange={(e) => handleOnChange(e.target.value, "modelsoftlibid")} readOnly={edit} >
                <option value='1'>Nhận diện khuôn mặt</option>
                <option value='2'>Nhận diện hành vi</option>
                <option value='3'>Phát hiện khuôn mặt</option>
              </Input>
            </Col>
            <Col md={12} xs={12}>
              <Label className='form-label' for='pretrainpath'>
                Pretrainpath <span style={{ color: 'red' }}>*</span>
              </Label>
              <Input id='pretrainpath' type='text' value={infoData.pretrainpath} onChange={(e) => handleOnChange(e.target.value, "pretrainpath")} readOnly={edit} />
              <p style={{ fontSize: '10px', fontStyle: 'italic', color: 'red' }}>{valErrors.pretrainpath}</p>
            </Col>
            <Col md={12} xs={12}>
              <Label className='form-label' for='default_json_Paramsconfigs'>
                default_json_Paramsconfigs  <span style={{ color: 'red' }}>*</span>
              </Label>
              <Input id='default_json_Paramsconfigs' type='text' value={infoData.default_json_Paramsconfigs} onChange={(e) => handleOnChange(e.target.value, "default_json_Paramsconfigs")} readOnly={edit} />
              <p style={{ fontSize: '10px', fontStyle: 'italic', color: 'red' }}>{valErrors.default_json_Paramsconfigs}</p>
            </Col>
            <Col md={12} xs={12}>
              <Label className='form-label' for='default_json_Paramsconfigs'>
                Loại model <span style={{ color: 'red' }}>*</span>
              </Label>
              <Input id='modeltype' type='text' value={infoData.modeltype} onChange={(e) => handleOnChange(e.target.value, "modeltype")} readOnly={edit} />
              <p style={{ fontSize: '10px', fontStyle: 'italic', color: 'red' }}>{valErrors.modeltype}</p>
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
      <Modal isOpen={showAdd} toggle={() => setShowAdd(!showAdd)} className='modal-dialog-centered modal-lg' backdrop="static">
        <ModalHeader className='bg-transparent' toggle={() => setShowAdd(!showAdd)}></ModalHeader>
        <ModalBody className='px-sm-5 mx-50 pb-5'>
          <div className='text-center mb-2'>
            <h1 className='mb-1'>Thêm mô hình</h1>
            <p>Thêm chi tiết thông tin</p>
          </div>
          <Row tag='form' className='gy-1 pt-75' onSubmit={handleSubmit(onSubmit)}>
            <Col md={12} xs={12}>
              <Label className='form-label' for='modelname'>
                Tên mô hình  <span style={{ color: 'red' }}>*</span>
              </Label>
              <Input id='modelname' type='text' value={infoaddData.modelname} onChange={(e) => handleOnChangeAdd(e.target.value, "modelname")} />
              <p style={{ fontSize: '10px', fontStyle: 'italic', color: 'red' }}>{valErrors.modelname}</p>
            </Col>
            <Col md={12} xs={12}>
              <Label className='form-label' for='modelfiletutorial'>
                Hướng dẫn <span style={{ color: 'red' }}>*</span>
              </Label>
              <Input id='modelfiletutorial' type='text' value={infoaddData.modelfiletutorial} onChange={(e) => handleOnChangeAdd(e.target.value, "modelfiletutorial")} />
              <p style={{ fontSize: '10px', fontStyle: 'italic', color: 'red' }}>{valErrors.modelfiletutorial}</p>
            </Col>
            <Col md={12} xs={12}>
              <Label className='form-label' for='modelfiledescription'>
                File mô tả <span style={{ color: 'red' }}>*</span>
              </Label>
              <Input id='modelfiledescription' type='text' value={infoaddData.modelfiledescription} onChange={(e) => handleOnChangeAdd(e.target.value, "modelfiledescription")} />
              <p style={{ fontSize: '10px', fontStyle: 'italic', color: 'red' }}>{valErrors.modelfiledescription}</p>
            </Col>
            <Col md={12} xs={12}>
              <Label className='form-label' for='modeldescription'>
                Mô tả <span style={{ color: 'red' }}>*</span>
              </Label>
              <Input id='modeldescription' type='text' value={infoaddData.modeldescription} onChange={(e) => handleOnChangeAdd(e.target.value, "modeldescription")} />
              <p style={{ fontSize: '10px', fontStyle: 'italic', color: 'red' }}>{valErrors.modeldescription}</p>
            </Col>
            <Col md={12} xs={12}>
              <Label className='form-label' for='modeleventtype'>
                Loại sự kiện  <span style={{ color: 'red' }}>*</span>
              </Label>
              <Input id='modeleventtype' type='text' value={infoaddData.modeleventtype} onChange={(e) => handleOnChangeAdd(e.target.value, "modeleventtype")} />
              <p style={{ fontSize: '10px', fontStyle: 'italic', color: 'red' }}>{valErrors.modeleventtype}</p>
            </Col>
            <Col md={12} xs={12}>
              <Label className='form-label' for='modelcreator'>
                Người tạo  <span style={{ color: 'red' }}>*</span>
              </Label>
              <Input id='modelcreator' type='text' value={infoaddData.modelcreator} onChange={(e) => handleOnChangeAdd(e.target.value, "modelcreator")} />
              <p style={{ fontSize: '10px', fontStyle: 'italic', color: 'red' }}>{valErrors.modelcreator}</p>
            </Col>
            <Col md={12} xs={12}>
              <Label className='form-label' for='modelsoftlibid'>
                Loại bài toán  <span style={{ color: 'red' }}>*</span>
              </Label>
              <Input type='select' name='modelsoftlibid' id='modelsoftlibid' value={infoaddData.modelsoftlibid} onChange={(e) => handleOnChangeAdd(e.target.value, "modelsoftlibid")}>
                <option value='1'>Nhận diện khuôn mặt</option>
                <option value='2'>Nhận diện hành vi</option>
                <option value='3'>Phát hiện khuôn mặt</option>
              </Input>
            </Col>
            <Col md={12} xs={12}>
              <Label className='form-label' for='pretrainpath'>
                Pretrainpath  <span style={{ color: 'red' }}>*</span>
              </Label>
              <Input id='pretrainpath' type='text' value={infoaddData.pretrainpath} onChange={(e) => handleOnChangeAdd(e.target.value, "pretrainpath")} />
              <p style={{ fontSize: '10px', fontStyle: 'italic', color: 'red' }}>{valErrors.pretrainpath}</p>
            </Col>
            <Col md={12} xs={12}>
              <Label className='form-label' for='default_json_Paramsconfigs'>
                default_json_Paramsconfigs  <span style={{ color: 'red' }}>*</span>
              </Label>
              <Input id='default_json_Paramsconfigs' type='text' value={infoaddData.default_json_Paramsconfigs} onChange={(e) => handleOnChangeAdd(e.target.value, "default_json_Paramsconfigs")} />
              <p style={{ fontSize: '10px', fontStyle: 'italic', color: 'red' }}>{valErrors.default_json_Paramsconfigs}</p>
            </Col>
            <Col md={12} xs={12}>
              <Label className='form-label' for='default_json_Paramsconfigs'>
                Loại model  <span style={{ color: 'red' }}>*</span>
              </Label>
              <Input id='modeltype' type='text' value={infoaddData.modeltype} onChange={(e) => handleOnChangeAdd(e.target.value, "modeltype")} />
              <p style={{ fontSize: '10px', fontStyle: 'italic', color: 'red' }}>{valErrors.modeltype}</p>
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
      <Modal isOpen={showDelete} toggle={() => setShowDelete(!showDelete)} className='modal-dialog-centered modal-lg' backdrop="static">
        <ModalHeader className='bg-transparent' toggle={() => setShowDelete(!showDelete)}></ModalHeader>
        <ModalBody className='px-sm-5 mx-50 pb-5'>
          <div className='text-center mb-2'>
            <h1 className='mb-1'>Xóa mô hình</h1>
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

export default ManageModel
