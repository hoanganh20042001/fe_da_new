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
import { Eye, ChevronDown, Share, Printer, FileText, File, Grid, Copy, Plus, Edit, Trash, Check, Clipboard, Search, MoreVertical, X, ArrowLeft, ArrowRight, User, Mail, Phone, Calendar, MapPin, Home, Droplet, Info, Briefcase, BarChart2, Activity, Clock, Shield, CreditCard } from 'react-feather'
import { useSelector, useDispatch } from 'react-redux'
import StatsHorizontal from '@components/widgets/stats/StatsHorizontal'
import { getByCccd } from '@store/action/patients'

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
  Form,
  InputGroup,
  FormFeedback,
  FormGroup,
  CardBody,
  ListGroup,
  ListGroupItem,
  CardText
} from 'reactstrap'
import { useAbility } from '@casl/react'

// ** Bootstrap Checkbox Component
const BootstrapCheckbox = forwardRef((props, ref) => (
  <div className='form-check'>
    <Input type='checkbox' ref={ref} {...props} />
  </div>
))

const StepConfig = ({ stepper, cccd, status, data, changeInfo, changeData, changeStatus }) => {
  // ** States
  // const [modal, setModal] = useState(false)
  const [displaySelect, setDisplay] = useState(false)
  const dispatch = useDispatch()
  const [currentPage, setCurrentPage] = useState(0)
  const [isValid, setIsValid] = useState(true)
  // const [data, setData] = useState()
  const [object, setObject] = useState(true)
  const roleId = JSON.parse(localStorage.getItem('userData'))

  const [searchTerm, setSearchTerm] = useState('')
  const [patientss, setPatients] = useState({
    full_name: '',
    indentification:'',
    email: '',
    phone_number: '',
    date_birth: '',
    home_town: '',
    resident: '',
    medical_history: '',
    blood_group: '',
    sex: '',
    height: '',
    weight: '',
    rank: '',
    enlistment_date: ''
  })
  const [validationMessage, setValidationMessage] = useState('')
  const [showFullInfo, setShowFullInfo] = useState(false)
  const validateCccd = (value) => {
    const cccdRegex = /^[0-9]{12}$/ // Định dạng CCCD là 12 chữ số
    return cccdRegex.test(value)
  }
  const patients = useSelector((state) => state.patients.patients)
  const handleSearch = () => {
    if (validateCccd(searchTerm)) {
      setIsValid(true)
      // setValidationMessage('Số CCCD hợp lệ.')

      dispatch(getByCccd(searchTerm)) // Correctly dispatching the action
        .then(() => {
          setValidationMessage('')
          changeInfo(searchTerm)
          // setPatients(patients.data)
          // console.log(patients.data)
          setShowFullInfo(true)
          // setPatients(patients)
          // console.log(patients.data.data)
          // setPatients(patients.data)
          changeStatus(true)

        })
        .catch((error) => {
          console.error('Error fetching data:', error)
          setValidationMessage('Đã xảy ra lỗi khi lấy dữ liệu.')
        })
    } else {
      setIsValid(false)
      setValidationMessage('Số CCCD phải là 12 chữ số.')
    }
  }
  useEffect(() => {
    setPatients(patients.data)
  }, [patients])
  const [valErrors, setValErrors] = useState({
    web_Url: '',
    conf: '',
    iou: ''
  })
  // const patientss = patients.data ? patients.data : {}
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
    if (!showFullInfo) {
      toast(
        <div className='d-flex'>
          <div className='me-1'>
            <Avatar size='sm' color='danger' icon={<X size={12} />} />
          </div>
          <div className='d-flex flex-column'>
            <h6>Yêu cầu thông tin người bệnh!</h6>
          </div>
        </div>
      )
      return
    }
    // handleOnChange(response.data.configid, 'configid')
    stepper.next()
  }
  function isDisable() {
    const o = Object.keys(valErrors)
      .filter((k) => valErrors[k] !== null)
      .reduce((a, k) => ({ ...a, [k]: valErrors[k] }), {})
    if (Object.entries(o).length !== 0) return true
    else return false
  }

  const [isTextVisible, setIsTextVisible] = useState(false)
  const handleClick = () => {
    setIsTextVisible(!isTextVisible)
  }

  return (
    <Fragment>
      <Card>
        <CardHeader className='card_detect flex-md-row flex-column align-md-items-center align-items-start border-bottom' >
          <Col className='mb-1' md='6' sm='12'>
            <Label className='form-label' for='web_Url' style={{ color: '#1203b1', fontWeight: 'bold', fontSize: '14px' }}>
              Nhập căn cước công dân <span style={{ color: 'red' }}>*</span>
            </Label>
            {/* <Input id='web_Url' className=' mb-50' type='text' value={infoDetect.web_Url} onChange={(e) => handleOnChange(e.target.value, "web_Url")} /> */}
            <Form inline>
              <FormGroup className="mb-2 me-sm-2 mb-sm-0">
                <div className="d-flex align-items-center">
                  <Input
                    type="text"
                    placeholder="Nhập CCCD cần tìm kiếm..."
                    value={searchTerm}
                    invalid={!isValid}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <Button color="primary" onClick={handleSearch} className="ms-2">
                    <Search size={14} />
                  </Button>
                </div>
                <FormFeedback className="d-block">
                  {validationMessage}
                </FormFeedback>
              </FormGroup>
            </Form>

          </Col>
          <Col className='mb-1' md='2' sm='12'>

            <Button className='ms-2' color='primary' style={{ marginTop: '1.5em' }} onClick={() => handleNext()}><span className='align-middle ms-50'>Tiếp theo</span>
              <ArrowRight size={14} className='align-middle ms-sm-25 ms-0'></ArrowRight>
            </Button>

          </Col>
        </CardHeader>

        <Row style={{ marginTop: '20px', marginRight: '2px', marginLeft: '2px', marginBottom: '30px', }}>
          <Card style={{ maxWidth: '100%', margin: 'auto' }}>
            <CardBody >
              <CardTitle tag="h5" style={{ textAlign: 'center', marginTop: '12px' }}>Thông tin cá nhân</CardTitle>
              <ListGroup style={{ height: '250px' }}>
                {showFullInfo && (
                  <>

                    <Card className="user-info-card shadow-sm">
                      <CardBody>
                        <CardTitle tag="h5" className="text-primary">
                          <User size={20} /> {patientss.full_name }
                        </CardTitle>
                        <Row>
                          <Col md="6">
                            <CardText>
                              <CreditCard size={16} className="me-2 text-info" /> CCCD: {patientss ? patientss.full_name : ''}
                            </CardText>
                            <CardText>
                              <Mail size={16} className="me-2 text-info" /> Email: {patientss ? patientss.email : ''}
                            </CardText>
                            <CardText>
                              <Phone size={16} className="me-2 text-info" /> Số điện thoại: {patientss ? patientss.phone_number : ''}
                            </CardText>
                            <CardText>
                              <Calendar size={16} className="me-2 text-info" /> Ngày sinh: {patientss ? patientss.date_birth : ''}
                            </CardText>
                            <CardText>
                              <MapPin size={16} className="me-2 text-info" /> Quê quán: {patientss ? patientss.home_town : ''}
                            </CardText>
                            <CardText>
                              <Home size={16} className="me-2 text-info" /> Nơi ở hiện nay: {patientss ? patientss.resident : ''}
                            </CardText>
                            <CardText>
                              <Activity size={16} className="me-2 text-info" /> Lịch sử khám bệnh: {patientss ? patientss.medical_history : ''}
                            </CardText>
                          </Col>
                          <Col md="6">
                            <CardText>
                              <Droplet size={16} className="me-2 text-info" /> Nhóm máu: {patientss ? patientss.blood_group : ''}
                            </CardText>
                            <CardText>
                              <Info size={16} className="me-2 text-info" /> Giới tính: {patientss ? (patientss.sex ? 'Nam' : 'Nữ') : ''}
                            </CardText>
                            <CardText>
                              <Briefcase size={16} className="me-2 text-info" /> Đơn vị: c155
                            </CardText>
                            <CardText>
                              <BarChart2 size={16} className="me-2 text-info" /> Chiều cao: {patientss ? patientss.height : ''} cm
                            </CardText>
                            <CardText>
                              <BarChart2 size={16} className="me-2 text-info" /> Cân nặng: {patientss ? patientss.weight : ''} kg
                            </CardText>
                            <CardText>
                              <Shield size={16} className="me-2 text-info" /> Quân hàm: {patientss ? patientss.rank : ''}
                            </CardText>
                            <CardText>
                              <Clock size={16} className="me-2 text-info" /> Thời gian khám gần nhất: {patientss ? patientss.enlistment_date : ''}
                            </CardText>

                          </Col>
                        </Row>
                      </CardBody>
                    </Card>
                    <style>
                      {`
          .user-info-card {
            background-color: #f8f9fa; /* Màu nền nhẹ */
            border-radius: 10px; /* Bo góc nhẹ */
            border: 1px solid #ddd; /* Viền mỏng */
          }

          .user-info-card .text-info {
            color: #17a2b8 !important; /* Màu xanh nhạt cho icon */
          }

          .user-info-card .card-title {
            font-weight: bold;
          }

          .user-info-card .card-body {
            padding: 1.5rem;
          }

          .user-info-card .card-text {
            font-size: 0.95rem;
            color: #333;
          }

          .user-info-card .me-2 {
            margin-right: 0.5rem;
          }
        `}
                    </style>
                  </>
                )}
              </ListGroup>
            </CardBody>
          </Card>


        </Row>

      </Card>

    </Fragment>
  )
}

export default StepConfig
