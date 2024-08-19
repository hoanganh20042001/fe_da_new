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
import { Eye, ChevronDown, Share, Printer, FileText, File, Grid, Copy, Plus, Edit, Trash, Check, Clipboard, Search, MoreVertical, X, ArrowLeft, Loader } from 'react-feather'
import { useSelector, useDispatch } from 'react-redux'

import StatsHorizontal from '@components/widgets/stats/StatsHorizontal'


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
} from 'reactstrap'


// ** Bootstrap Checkbox Component
const BootstrapCheckbox = forwardRef((props, ref) => (
  <div className='form-check'>
    <Input type='checkbox' ref={ref} {...props} />
  </div>
))

const StepEvent = ({ stepper, infoDetect, data, changeInfo, changeData }) => {
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
  const onSubmit1 = () => {
    // if (Object.values(data).every(field => field.length > 0)) {
    stepper.next()

  }
  // const [data, setData] = useState()
  const [valErrors, setValErrors] = useState({
    datasetname: '',
    datasetsum: '',
    datasetdescription: ''
  })


  const navigate = useNavigate()

  const handleDelete = () => {
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
  const languageOptions = [
    { value: 1, label: '0.25' },
    { value: 2, label: '0.5' },
    { value: 3, label: '0.75' },
  ]

  const handleOnChangeSelect = (value, pop) => {
    changeInfo(value, pop)
    // console.log(infoDetect)
  }

  function isDisable() {
    const o = Object.keys(valErrors)
      .filter((k) => valErrors[k] !== null)
      .reduce((a, k) => ({ ...a, [k]: valErrors[k] }), {})
    if (Object.entries(o).length !== 0) return true
    else return false
  }

  // Tạo cột cho mỗi nhóm ảnh
  const columns = [
    {
      name: 'Ảnh',
      sortable: true,
      minWidth: '200px',
      selector: (row) => {
        const url = process.env.REACT_APP_API_URL
        return (
          <div>
            <img src={`${row.imgraw_url}`} style={{ width: '100px' }}></img>
          </div>
        )
      },
    },
    {
      name: 'Nôi dung chi tiết',
      sortable: true,
      minWidth: '200px',
      selector: (row) => {
        const url = process.env.REACT_APP_API_URL
        return (
          <div>
            <p>{row.detail}</p>
          </div>
        )
      },
    }
  ]
  const [isLoading, setIsLoading] = useState(false)
  const handleSearch = (infoDetect) => {

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
        const data = response.data.data
        // const n = images.length
        // if (n % 2 === 0) {
        //   // Trường hợp n là số chẵn, chia đôi mảng ảnh
        //   for (let i = 0; i < n; i += 2) {
        //     const img1 = images[i].imgraw_url
        //     const img2 = images[i + 1].imgraw_url

        //     const imageObject = {
        //       img1: img1,
        //       img2: img2,
        //     }

        //     objectArray.push(imageObject)
        //   }
        // } else {
        //   // Trường hợp n là số lẻ, lấy n/2 phần tử đầu
        //   const halfLength = Math.floor(n / 2)
        //   for (let i = 0; i < halfLength; i++) {
        //     const img1 = images[i].imgraw_url
        //     const img2 = (i + halfLength < n) ? images[i + halfLength].imgraw_url : null

        //     const imageObject = {
        //       img1: img1,
        //       img2: img2,
        //     }

        //     objectArray.push(imageObject)
        //   }
        // }

        // console.log(objectArray)
        changeData(data)
        setIsLoading(false)
      })
      .catch(err => {
        setIsLoading(false)
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
  const [isTextVisible, setIsTextVisible] = useState(false)
  const handleClick = () => {
    setIsTextVisible(!isTextVisible)
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
      pageCount={data.totalPages}
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
          {/* <CardTitle tag='h4' style={{ fontWeight: 'bold', color: '#1203b1' }}>Tìm kiếm</CardTitle> */}
          <div className='d-flex mt-md-0 mt-1'>
            <Button type='button' color='primary' className='btn-prev' onClick={() => stepper.previous()}>
              <ArrowLeft size={14} className='align-middle me-sm-25 me-0'></ArrowLeft><span className='align-middle ms-50'>Quay lại</span>
            </Button>
          </div>
          <div className='d-flex mt-md-0 mt-1'>
            <Button className='justify-content-end cursor-pointer' size={17} color='primary' onClick={handleClick}>Mở hưỡng dẫn cấu hình</Button>

          </div>
          <div className='d-flex mt-md-0 mt-1'>
            <Button className='ms-2' color='primary' onClick={() => handleSearch(infoDetect)}><Search size={15} /> <span className='align-middle ms-50'>Tìm kiếm</span> </Button>
            {isLoading ? <Loader size={40} style={{ animation: 'spin 1s linear infinite' }} /> : <div></div>}
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
        <Row className='justify-content-end mx-0'>

          <Col className='mb-1' md='4' sm='12'>
            <Label className='form-label' for='city'>
              Bạo lực
            </Label>
            <Select
              isMulti={false}
              isClearable={false}
              theme={selectThemeColors}
              placeholder={'Có'}
              id={`language`}
              // value={{ value: infoDetect.dtViolence, label: 'Có' }}
              options={[{ value: true, label: 'Có' }, { value: false, label: 'Không' }]}
              className='react-select'
              classNamePrefix='select'
              isDisabled={displaySelect}
              onChange={(e) => handleOnChangeSelect(e.value, "dtViolence")}
            />
          </Col>
          <Col className='mb-1' md='4' sm='12'>
            <Label className='form-label' for='city'>
              Vũ khí
            </Label>
            <Select
              isMulti={false}
              isClearable={false}
              theme={selectThemeColors}
              placeholder={'Có'}
              id={`language`}
              // value={{ value: infoDetect.dtWeapon, label: 'Có' }}
              options={[{ value: true, label: 'Có' }, { value: false, label: 'Không' }]}
              className='react-select'
              classNamePrefix='select'
              isDisabled={displaySelect}
              onChange={(e) => handleOnChangeSelect(e.value, "dtWeapon")}
            />
          </Col>
          <Col className='mb-1' md='4' sm='12'>
            <Label className='form-label' for='city'>
              Tai nạn
            </Label>
            <Select
              isMulti={false}
              isClearable={false}
              theme={selectThemeColors}
              placeholder={'Có'}
              id={`language`}
              // value={{ value: infoDetect.dtAccident, label: 'Có' }}
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
            // selectableRows
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

export default StepEvent
