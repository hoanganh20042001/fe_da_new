// import { Link, } from 'react-router-dom'
import { Fragment, useState, forwardRef, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { useNavigate, Link } from 'react-router-dom'
import Select from 'react-select'
// ** Table Data & Columns
// import { data } from './list/data'
import { selectThemeColors } from '@utils'
import { Controller, useForm } from 'react-hook-form'
import Avatar from '@components/avatar'
// ** Third Party Components
import ReactPaginate from 'react-paginate'
import DataTable from 'react-data-table-component'
import { Eye, ChevronDown, Share, Printer, FileText, File, Grid, Copy, Plus, Edit, Trash, Check, Clipboard, Search, MoreVertical, X, Loader } from 'react-feather'
import { useSelector, useDispatch } from 'react-redux'
// import { toDateString } from '@utils'
// import { getListFace, searchFace, updateFace, addFace, deleteFace } from '@store/action/face'
import StatsHorizontal from '@components/widgets/stats/StatsHorizontal'
import './detect.css'

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
  UncontrolledDropdown,
  Modal,
  ModalBody,
  ModalHeader, ModalFooter,
  Badge
} from 'reactstrap'
import { useAbility } from '@casl/react'
import { getObj } from '../../../redux/action/face'

// ** Bootstrap Checkbox Component
const BootstrapCheckbox = forwardRef((props, ref) => (
  <div className='form-check'>
    <Input type='checkbox' ref={ref} {...props} />
  </div>
))

const ManageDetect = () => {
  // ** States
  // const [modal, setModal] = useState(false)
  const [displaySelect, setDisplay] = useState(false)
  const dispatch = useDispatch()
  const [currentPage, setCurrentPage] = useState(0)
  const [searchValue, setSearchValue] = useState('')
  const [score, setScore] = useState(0.9)
  const [filteredData, setFilteredData] = useState([])
  const [showEdit, setShowEdit] = useState(false)
  const [showDelete, setShowDelete] = useState(false)
  const [showAdd, setShowAdd] = useState(false)
  const [infoData, setInfo] = useState({
  })
  const [data, setData] = useState()
  const [object, setObject] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const roleId = JSON.parse(localStorage.getItem('userData'))
  const [infoDetect, setInfoDetect] = useState({
    web_Url: '',
    conf: 0.25,
    iou: 0.7,
    dtViolence: true,
    dtWeapon: true,
    dtAccident: false,
  })
  const [file, setFile] = useState()
  const [valErrors, setValErrors] = useState({
    datasetname: '',
    datasetsum: '',
    datasetdescription: ''
  })
  const dataFace = useSelector((state) => {
    return state.face.dataFace
  })
  const [isTextVisible, setIsTextVisible] = useState(false)

  const handleClick = () => {
    setIsTextVisible(!isTextVisible)
  }
  // const {
  //   control,
  //   setError,
  //   handleSubmit,
  //   formState: { errors }
  // } = useForm()

  const navigate = useNavigate()

  const handleDelete = () => {
    setShowDelete(false)
  }

  const handleUpdate = () => {
    dispatch(updateFace(infoData))
    setShowEdit(false)
  }
  const handleAdd = () => {
    dispatch(addFace(infoaddData, file))
    setShowAdd(false)
  }
  const handleDelet = (data) => {
    dispatch(deleteFace(data.Face_id))
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
  const languageOptions = [
    { value: 1, label: '0.25' },
    { value: 2, label: '0.5' },
    { value: 3, label: '0.75' },
  ]
  const handleEdit = (data) => {
    setShowEdit(true)
    setFile()
    setInfo({
      Face_id: data.Face_id,
      name: data.name,
      creatorID: data.creatorID
    })
  }
  const handleOnChange = (e, pop) => {
    const { value } = e.target
    setInfoDetect({ ...infoDetect, [pop]: value })
    // console.log(infoDetect)
  }
  const handleOnChangeSelect = (value, pop) => {
    setInfoDetect({ ...infoDetect, [pop]: value })
    console.log(infoDetect)
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


  // Tạo cột cho mỗi nhóm ảnh
  const columns = [
    {
      name: 'Ảnh',
      sortable: true,
      minWidth: '250px',
      selector: (row) => {
        const url = process.env.REACT_APP_API_URL
        return (
          <div>
            <img src={`${row.img1}`} style={{ width: '100px' }}></img>
          </div>
        )
      },
    },
    {
      name: 'Ảnh',
      sortable: true,
      minWidth: '250px',
      selector: (row) => {
        const url = process.env.REACT_APP_API_URL
        return (
          <div>
            <img src={`${row.img2}`} style={{ width: '100px' }}></img>
          </div>
        )
      },
    }
  ]

  const handleSearch = (infoDetect) => {
    if (infoDetect.web_Url === '' || infoDetect.conf === '' || infoDetect.iou === '') {
      toast(
        <div className='d-flex'>
          <div className='me-1'>
            <Avatar size='sm' color='danger' icon={<X size={12} />} />
          </div>
          <div className='d-flex flex-column'>
            <h6>Không được để trống!</h6>
          </div>
        </div>
      )
      return
    }
    setIsLoading(true)
    console.log(infoDetect)
    const url = process.env.REACT_APP_API_URL
    axios.post(`${url}/obj-detector/?web_URL=${infoDetect.web_Url}&conf=${infoDetect.conf}&iou=${infoDetect.iou}&dtViolence=${infoDetect.dtViolence}&dtWeapon=${infoDetect.dtWeapon}&dtAccident=${infoDetect.dtAccident}`
      , {
        headers: {
          'Content-Type': 'application/json',
          // Authorization: `Bearer ${localStorage.getItem("accessToken")}`
        },

      }).then(response => {
        console.log(infoDetect)
        console.log(response.data.data)
        const objectArray = []
        const images = response.data.data
        const n = images.length
        setIsLoading(false)
        if (n % 2 === 0) {
          // Trường hợp n là số chẵn, chia đôi mảng ảnh
          for (let i = 0; i < n; i += 2) {
            const img1 = images[i].imgraw_url
            const img2 = images[i + 1].imgraw_url

            const imageObject = {
              img1: img1,
              img2: img2,
            }

            objectArray.push(imageObject)
          }
        } else {
          // Trường hợp n là số lẻ, lấy n/2 phần tử đầu
          const halfLength = Math.floor(n / 2)
          for (let i = 0; i < halfLength; i++) {
            const img1 = images[i].imgraw_url
            const img2 = (i + halfLength < n) ? images[i + halfLength].imgraw_url : null

            const imageObject = {
              img1: img1,
              img2: img2,
            }

            objectArray.push(imageObject)
          }
        }

        console.log(objectArray)
        console.log(objectArray)
        setData(objectArray)
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
    // dispatch(getObj(infoDetect))
    // console.log(dispatch)
  }
  // ** Function to handle filter
  const handleFilter = e => {
    dispatch(searchFace(
      {
        url: searchValue,
        score: score
      }
    ))
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
        <CardHeader className='card_detect flex-md-row flex-column align-md-items-center align-items-start border-bottom' >
          <div className='d-flex mt-md-0 mt-1'>
            <Button className='justify-content-end cursor-pointer' size={17} color='primary' onClick={handleClick}>Mở hưỡng dẫn cấu hình</Button>

          </div>

          <div className='d-flex mt-md-0 mt-1'>
            <Button className='ms-2' color='primary' onClick={() => handleSearch(infoDetect)}><Search size={15} /> <span className='align-middle ms-50'>Tìm kiếm</span> </Button> {isLoading ? <Loader size={40} style={{ animation: 'spin 1s linear infinite' }} /> : <div></div>}
          </div>


        </CardHeader>
        <Row className=' mx-0'>
          <div >
            {isTextVisible && (
              <div >
                <i>Bước 1: Nhập URL trang web mà bạn cần quét tìm.</i><br />
                <i>Bước 2: Nhập ngưỡng confidence và ngưỡng iou. (Giá trị từ 0-1)</i><br />
                <i>Bước 3: Chọn các đối tượng/sự kiện cần quét.</i><br />
                <i>Bước 4: Nhấn tìm kiếm và chờ đợi.</i><br /><br />
              </div>
            )}
          </div>
        </Row>
        <Row className=' mx-0'>
          <Col className='mb-1' md='4' sm='12'>
            <Label className='form-label' for='web_Url'>
              Đường dẫn trang web cần tìm kiếm <span style={{ color: 'red' }}>*</span>
            </Label>
            <Input id='web_Url' className=' mb-50' type='text' value={infoDetect.web_Url} onChange={(e) => handleOnChange(e, "web_Url")} />
          </Col>
          <Col md='2' ></Col>
          <Col className='mb-1' md='3' sm='12'>
            <Label className='form-label' for='conf'>
              Ngưỡng confidence( Từ 0 đến 1 ) <span style={{ color: 'red' }}>*</span>
            </Label>
            <Input id='conf' className='dataTable-filter mb-50' type='text' value={infoDetect.conf} onChange={(e) => handleOnChange(e, "conf")} />
          </Col>
          <Col className='mb-1' md='3' sm='12'>
            <Label className='form-label' for='iou'>
              Ngưỡng iou( Từ 0 đến 1 ) <span style={{ color: 'red' }}>*</span>
            </Label>
            <Input id='iou' className='dataTable-filter mb-50' type='text' value={infoDetect.iou} onChange={(e) => handleOnChange(e, "iou")} />
          </Col>

        </Row>
        <Row className='justify-content-end mx-0'>

          <Col className='d-flex align-items-center justify-content-end mt-1' md='6' sm='12'>
            <Label className='me-1' for='search-input'>
              Sự kiện cần phát hiện
            </Label></Col>
          <Col md='2' className='mb-1'>
            <Label className='form-label' for='city'>
              Bạo lực
            </Label>
            <Select
              isMulti={false}
              isClearable={false}
              theme={selectThemeColors}
              placeholder={'Có'}
              id={`language`}
              // value={{ value: infoDetect.dtViolence, label: 'true' }}
              options={[{ value: true, label: 'Có' }, { value: false, label: 'Không' }]}
              className='react-select'
              classNamePrefix='select'
              isDisabled={displaySelect}
              onChange={(e) => handleOnChangeSelect(e.value, "dtViolence")}
            />
          </Col>
          <Col md='2' className='mb-1'>
            <Label className='form-label' for='city'>
              Vũ khí
            </Label>
            <Select
              isMulti={false}
              isClearable={false}
              theme={selectThemeColors}
              placeholder={'Có'}
              id={`language`}
              // value={{ value: infoDetect.dtWeapon, label: 'true' }}
              options={[{ value: true, label: 'Có' }, { value: false, label: 'Không' }]}
              className='react-select'
              classNamePrefix='select'
              isDisabled={displaySelect}
              onChange={(e) => handleOnChangeSelect(e.value, "dtWeapon")}
            />
          </Col>
          <Col md='2' className='mb-1'>
            <Label className='form-label' for='city'>
              Tai nạn
            </Label>
            <Select
              isMulti={false}
              isClearable={false}
              theme={selectThemeColors}
              placeholder={'Có'}
              id={`language`}
              // value={{ value: infoDetect.dtAccident, label: 'true' }}
              options={[{ value: true, label: 'Có' }, { value: false, label: 'Không' }]}
              className='react-select'
              classNamePrefix='select'
              isDisabled={displaySelect}
              onChange={(e) => handleOnChangeSelect(e.value, "dtAccident")}
            />
          </Col>
        </Row>
        <div className='react-dataTable react-dataTable-selectable-rows'>
          <DataTable
            noHeader
            pagination
            selectableRows
            columns={columns}
            paginationPerPage={10}
            className='react-dataTable'
            sortIcon={<ChevronDown size={10} />}
            paginationComponent={CustomPagination}
            paginationDefaultPage={currentPage + 1}
            selectableRowsComponent={BootstrapCheckbox}
            data={data}
            customStyles={{
              rows: {
                style: {
                  minHeight: '150px',
                  display: 'flex',
                  alignItems: 'center'
                }
              }
            }}
          />
        </div>
      </Card>

    </Fragment>
  )
}

export default ManageDetect
