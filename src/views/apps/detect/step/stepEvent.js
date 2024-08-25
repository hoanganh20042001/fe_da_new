// import { Link, } from 'react-router-dom'
import { Fragment, useState, forwardRef, useEffect, useRef } from 'react'
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
import { Eye, ChevronDown, Share, Printer, FileText, File, Grid, Copy, Plus, Edit, Trash, Check, Clipboard, Search, MoreVertical, X, ArrowLeft, Loader, Upload, AlertCircle } from 'react-feather'
import { useSelector, useDispatch } from 'react-redux'
import Viewer from 'react-viewer'
import { getById } from '@store/action/checks'
import StatsHorizontal from '@components/widgets/stats/StatsHorizontal'


// ** Reactstrap Imports
import { Row, Col, Card, CardBody, CardHeader, CardTitle, Button, Form, FormGroup, Label, FormFeedback, Input, ListGroupItem, ListGroup, CardText } from 'reactstrap'
import diseases from '../../../../redux/reducers/diseases'

// ** Bootstrap Checkbox Component
const BootstrapCheckbox = forwardRef((props, ref) => (
  <div className='form-check'>
    <Input type='checkbox' ref={ref} {...props} />
  </div>
))

const StepEvent = ({ stepper, cccd, data, status, changeInfo, changeData, changeStatus }) => {
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
  const [showUpload, setShowUpload] = useState(true)
  const [showDetect, setShowDetect] = useState(true)
  const [showReport, setShowReport] = useState(false)
  const [imageArray, setImageArray] = useState([{ src: "" }, { src: "" }])
  const [check_id, setCheck_id] = useState(null)
  const [fileName, setFileName] = useState('')
  const [img, setImg] = useState('')
  const [info, setInfo] = useState(false)
  const [selectionBox, setSelectionBox] = useState(null)
  const viewerRef = useRef(null)
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
  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      console.log(file)
      setImg(file)
      const newImageUrl = URL.createObjectURL(file)
      setImageArray((prevImages) => {
        const newArray = [...prevImages]
        // if (!prevImages[0].src) {
        //   newArray[0] = { src: newImageUrl }
        // } else if (!prevImages[1].src) {
        //   newArray[1] = { src: newImageUrl }
        // } else {
        newArray[0] = { src: newImageUrl }
        // }
        return newArray
      })
    } else {
      setFileName('')
    }
  }
  const checks = useSelector((state) => state.checks.checks)
  const handleDetect = () => {
    // const detectedImage = "http://localhost:8000/files/?file_path=files%5Cimg%5Cloading.gif"// Replace this with your detection logic
    const url = process.env.REACT_APP_API_URL
    const data1 = new FormData()
    data1.append('file', img)
    axios.post(`${url}/result/${cccd}`, data1,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`
        },

      }).then(response => {
        setImageArray((prevImages) => {
          console.log(response)
          setCheck_id(response.data.check_id)
          console.log(response.data.data.check_id)
          dispatch(getById(response.data.data.check_id))
          setShowUpload(false)
          setShowDetect(false)
          setShowReport(true)
          setInfo(true)
          changeStatus(false)
          const newArray = [...prevImages]
          newArray[1] = { src: `http://localhost:8000/files/?file_path=${response.data.data.detected_image_path}` } // Giả định rằng response chứa URL ảnh mới
          return newArray
        })


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
  const checkss = Array.isArray(checks.data) ? checks.data : []
  console.log(checks)
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
  console.log(status)
  useEffect(() => {
    console.log(status)
    if (status) {
      setImageArray([{ src: "" }, { src: "" }])
      setInfo(false)
      setShowDetect(true)
      setShowUpload(true)
    }
  }, [status])
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

  const [isLoading, setIsLoading] = useState(false)

  const [isTextVisible, setIsTextVisible] = useState(false)
  const handleClick = () => {
    setIsTextVisible(!isTextVisible)
  }


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
          {showUpload &&
            <div style={{ position: 'relative', display: 'inline-block' }}>
              <input
                type="file"
                onChange={handleFileChange}
                accept=".png, .jpg, .jpeg"
                style={{
                  opacity: 0,
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  right: 0,
                  bottom: 0,
                  zIndex: 2,
                  cursor: 'pointer',
                  width: '100%',
                  height: '100%',
                }}
              />
              <button
                type="button"
                className="btn btn-primary"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '8px 16px',
                  // backgroundColor: '#007bff',
                  // color: '#fff',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  zIndex: 1,
                  position: 'relative',
                }}
              >
                <Upload size={24} style={{ marginRight: '8px' }} /> Tải ảnh lên
              </button>
            </div>
          }
          {showDetect ? (
            <div className='d-flex mt-md-0 mt-1'>
              <Button className='ms-2' color='primary' onClick={handleDetect}><Search size={15} /> <span className='align-middle ms-50'>Tìm kiếm</span> </Button>
              {isLoading ? <Loader size={40} style={{ animation: 'spin 1s linear infinite' }} /> : <div></div>}
            </div>
          ) : (
            <Button className='ms-2' color='success' onClick={() => console.log('Button khác')} >
              <FileText size={16} className='me-2' />
              <span className='align-middle ms-50'>Xuất báo cáo</span>
            </Button>
          )}
        </CardHeader>
        <CardBody>
          <Row style={{ backgroundColor: '#f0f0f0' }}>
            <Col lg='8' >
              <div id='container' className='container' style={{ height: '100%', width: '100%' }} />

              <Viewer
                noClose
                visible={true}  // Always keep the viewer visible
                images={imageArray}
                activeIndex={imageArray[1].src ? 1 : 0}
                noFooter={false}
                noNavbar={false}
                rotatable={true}
                noToolbar={false}
                changeable={true}
                attribute={true}
                scalable={false}
                noImgDetails={false}
                container={document.getElementById('container')}
                className="viewer-container"
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '15px', // Adds rounded corners
                  display: 'flex',       // Use flexbox to center the image
                  alignItems: 'center',  // Vertically centers the image
                  justifyContent: 'center', // Horizontally centers the image
                  overflow: 'hidden',    // Hides any part of the image that goes beyond the viewer bounds
                  zIndex: 1000,
                }}
                zIndex={1050}
              />

            </Col>
            <Col lg='4'>

              <Row>
                <FormGroup>
                  <Label for="doctorComment">
                    <Edit size={16} /> Nhận xét của bác sĩ
                  </Label>
                  <Input
                    type="textarea"
                    name="doctorComment"
                    id="doctorComment"
                    rows="3"
                    placeholder="Nhập nhận xét của bác sĩ tại đây..."
                  />
                  <Button
                    color="primary"
                    className="mt-2"
                  // onClick={handleSave}
                  >
                    Lưu
                  </Button>
                </FormGroup>
              </Row>
              <Row>
                {info && <Card style={{ maxWidth: '320px', margin: 'auto' }}>
                  <CardBody>
                    <CardTitle tag="h5" style={{ textAlign: 'center' }}>Thông tin bệnh</CardTitle>
                    <Card className="user-info-card shadow-sm" style={{ maxHeight: '130px', maxWidth: '300px', overflowY: 'auto' }}>
                      <CardBody>
                        <Row>
                          {checkss.length > 0 ? (
                            <>
                              <ul>
                                {checkss.map((check, index) => (
                                  <li key={index}>
                                    <strong>{check.name}</strong>
                                    <p>- Độ chính xác: {check.accuracy}%</p>
                                  </li>
                                ))}
                              </ul>
                              <Button color="primary" className="d-flex align-items-center mt-2">
                                <Eye size={16} className="me-2" />
                                Xem chi tiết
                              </Button>
                            </>

                          ) : (
                            <CardText>Không có thông tin bệnh.</CardText>
                          )}

                        </Row>

                      </CardBody>
                    </Card>

                  </CardBody>
                </Card>
                }
              </Row>

            </Col>
          </Row>
        </CardBody>
      </Card>

      <style>
        {`
          .react-viewer-inline {
            min-height: 450px !important;
          }
        `}
      </style>

    </Fragment>
  )
}

export default StepEvent
