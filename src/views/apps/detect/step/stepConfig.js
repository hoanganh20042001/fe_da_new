// import { Link, } from 'react-router-dom'
import { Fragment, useState, forwardRef, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { useNavigate, Link } from 'react-router-dom'
import Select from 'react-select'
import { selectThemeColors } from '@utils'
import { Controller, useForm } from 'react-hook-form'
import Avatar from '@components/avatar'
// ** Third Party Components
import ReactPaginate from 'react-paginate'
import DataTable from 'react-data-table-component'
import { Eye, ChevronDown, Share, Printer, FileText, File, Grid, Copy, Plus, Edit, Trash, Check, Clipboard, Search, MoreVertical, X, ArrowLeft, ArrowRight  } from 'react-feather'
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
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
  UncontrolledButtonDropdown,
  UncontrolledDropdown,
  Modal,
  ModalBody,
  ModalHeader, ModalFooter,
  Badge,
  Form
} from 'reactstrap'
import { useAbility } from '@casl/react'

// ** Bootstrap Checkbox Component
const BootstrapCheckbox = forwardRef((props, ref) => (
  <div className='form-check'>
    <Input type='checkbox' ref={ref} {...props} />
  </div>
))

const StepConfig = ({ stepper, infoDetect, data, changeInfo, changeData }) => {
  // ** States
  // const [modal, setModal] = useState(false)
  const [displaySelect, setDisplay] = useState(false)
  const dispatch = useDispatch()
  const [currentPage, setCurrentPage] = useState(0)

  // const [data, setData] = useState()
  const [object, setObject] = useState(true)
  const roleId = JSON.parse(localStorage.getItem('userData'))

  const [valErrors, setValErrors] = useState({
    web_Url: '',
    conf: '',
    iou: ''
  })

  const navigate = useNavigate()

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

  const handleOnChange = (value, pop) => {
    if (value === null || value === undefined || value === "") {
      setValErrors({ ...valErrors, [pop]: 'Không được để trống' })
    } else {
      setValErrors({ ...valErrors, [pop]: null })
    }
    // setInfoDetect({ ...infoDetect, [pop]: value })
    changeInfo(value, pop)
  }
  const handleOnChangeSelect = (value, pop) => {
    setInfoDetect({ ...infoDetect, [pop]: value })
    // console.log(infoDetect)
  }
  const handleNext = () => {
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
    // handleOnChange(response.data.configid, 'configid')
    stepper.next()
    console.log(infoDetect)
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
            <img src={`${row.imgraw_url}`} style={{ width: '100px'}}></img>
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


  // ** Function to handle Pagination
  const handlePagination = page => {
    setCurrentPage(page.selected)
    // dispatch(getListUser({
    //   pageSize: 1,
    //   pageNumber: page.selected + 1
    // }))
  }
  const [isTextVisible, setIsTextVisible] = useState(false)
  const handleClick = () => {
    setIsTextVisible(!isTextVisible)
  }
  // ** Custom Pagination
  const CustomPagination = () => (
    <ReactPaginate
      previousLabel=''
      nextLabel=''
      forcePage={currentPage}
      onPageChange={page => handlePagination(page)}
    //   pageCount={dataFace.totalPages}
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
            <Button className='justify-content-end cursor-pointer' size={17} color='primary' onClick={handleClick}>Mở hưỡng dẫn cấu hình</Button>

          </div>
          <div className='d-flex mt-md-0 mt-1'>
            <Button className='ms-2' color='primary' onClick={() => handleNext()}><span className='align-middle ms-50'>Tiếp theo</span>
            <ArrowRight size={14} className='align-middle ms-sm-25 ms-0'></ArrowRight>
             </Button>
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
        {/* <Form onSubmit={onSubmit1}> */}
          <Col className='mb-1' md='4' sm='12'>
            <Label className='form-label' for='web_Url'>
              Đường dẫn trang web cần tìm kiếm <span style={{color: 'red'}}>*</span>
            </Label>
            <Input id='web_Url' className=' mb-50' type='text' value={infoDetect.web_Url} onChange={(e) => handleOnChange(e.target.value, "web_Url")} />
          </Col>
          <Col md='2' ></Col>
          <Col className='mb-1' md='3' sm='12'>
            <Label className='form-label' for='conf'>
              Ngưỡng confidence( Từ 0 đến 1 ) <span style={{color: 'red'}}>*</span>
            </Label>
            <Input id='conf' className='dataTable-filter mb-50' type='text' value={infoDetect.conf} onChange={(e) => handleOnChange(e.target.value, "conf")} />
          </Col>
          <Col className='mb-1' md='3' sm='12'>
            <Label className='form-label' for='iou'>
              Ngưỡng iou( Từ 0 đến 1 ) <span style={{color: 'red'}}>*</span>
            </Label>
            <Input id='iou' className='dataTable-filter mb-50' type='text' value={infoDetect.iou} onChange={(e) => handleOnChange(e.target.value, "iou")} />
          </Col>
{/* </Form> */}
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

export default StepConfig
