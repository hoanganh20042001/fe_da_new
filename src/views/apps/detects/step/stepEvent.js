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
import { Eye, ChevronDown, Share, Printer, FileText, File, Grid, Copy, Plus, Edit, Trash, Check, Clipboard, Search, MoreVertical, X, ArrowLeft, Loader, Upload, CheckCircle } from 'react-feather'
import { useSelector, useDispatch } from 'react-redux'
import Viewer from 'react-viewer'
import { getById } from '@store/action/checks'
import StatsHorizontal from '@components/widgets/stats/StatsHorizontal'
// import loadingImage from '../../../../assets/images/loader/Curve-Loading.gif'
import classnames from 'classnames'
// ** Reactstrap Imports
import {
    Row, Col, Card, CardBody, CardHeader, CardTitle, Button, Form, FormGroup, Label, FormFeedback, Input, ListGroupItem, ListGroup, CardText, Nav,
    NavItem,
    NavLink,
    TabContent,
    TabPane,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader
} from 'reactstrap'
import diseases from '../../../../redux/reducers/diseases'

// ** Bootstrap Checkbox Component
const BootstrapCheckbox = forwardRef((props, ref) => (
    <div className='form-check'>
        <Input type='checkbox' ref={ref} {...props} />
    </div>
))

const StepEvent = ({ stepper, info, data1, data2, name, status, changeInfo, changeData, changeStatus }) => {
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
    const [infor, setInfor] = useState(false)
    const [selectionBox, setSelectionBox] = useState(null)
    const viewerRef = useRef(null)
    const [activeTab, setActiveTab] = useState('1')
    const [selectedOption, setSelectedOption] = useState(true)
    const [showDetail, setShowDetail] = useState(false)
    // const [isLoading, setIsLoading] = useState(false)
    const [download, setDownload] = useState('')
    const [doctorComment, setDoctorComment] = useState('')
    const [checkss, setCheckss] = useState(null)
    const [save, setSave] = useState(false)
    const toggle = (tab) => {
        if (activeTab !== tab) {
            setActiveTab(tab)
        }
    }
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

    console.log(data1)
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
    // console.log(status)
    // const checks = useSelector((state) => state.checks.checks)
    // const checkss = Array.isArray(checks.data) ? checks.data : []
    useEffect(() => {
        setImageArray([{ src: `http://127.0.0.1:8000/files/?file_path=${data1}` }, { src: `http://127.0.0.1:8000/files/?file_path=${data2}` }])
        // dispatch(getById(info))
        const url = process.env.REACT_APP_API_URL
        console.log(info)
        axios.get(`${url}/checks/${info}`, {
            headers: {
                'Content-Type': 'application/json',
                //   Authorization: `Bearer ${localStorage.getItem("accessToken")}`
            }
        }).then(res => {
            console.log(res.data)
            setCheckss(res.data.data)
        })
            .catch(err => {
                setCheckss(null)
            })
        setSave(false)
    }, [data1, data2])
    console.log(checkss)
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

    const [isTextVisible, setIsTextVisible] = useState(false)
    const handleClick = () => {
        setIsTextVisible(!isTextVisible)
    }
    const handleOptionChange = (e) => {
        setSelectedOption(e.target.value === 'true')
    }
    const handleDownloadReport = async () => {
        try {
            const url = process.env.REACT_APP_API_URL
            const response = await axios.get(`${url}/reports/${info}`, {
                headers: {
                    'Content-Type': 'application/json',
                    // Authorization: `Bearer ${localStorage.getItem("accessToken")}`
                },
            })

            // Đường dẫn tệp được trả về từ API
            const reportPath = response.data.report_path
            console.log(reportPath)
            if (reportPath) {
                // Tạo một liên kết ảo để tải xuống tệp
                const link = document.createElement('a')
                link.href = `http://localhost:8000/files/?file_path=${reportPath}`
                // link.setAttribute('download', '') // Có thể đặt tên file ở đây nếu cần
                document.body.appendChild(link)
                link.click()

                // Loại bỏ liên kết sau khi hoàn tất
                link.remove()
            } else {
                console.error('Không có đường dẫn tệp trong phản hồi API')
            }

        } catch (error) {
            console.error('Lỗi khi tải báo cáo:', error)
        }
    }
    const handleSave = async () => {
        try {
            const data = {
                description: doctorComment,
                result: selectedOption
            }
            console.log(data)
            const url = process.env.REACT_APP_API_URL
            // Gọi API với phương thức PUT hoặc POST tùy theo API của bạn
            const response = await axios.put(`${url}/checks/${info}`, data, {
                headers: {
                    'Content-Type': 'application/json',
                    // Authorization: `Bearer ${localStorage.getItem("accessToken")}`
                },
            })
            const status = response.data.code
            if (status === '000') {
                console.log('Cập nhật thành công!')
                // changeStatus(true)
                toast(
                    <div className='d-flex'>
                        <div className='me-1'>
                            <Avatar size='sm' color='success' icon={<Check size={14} />} />
                        </div>
                        <div className='d-flex flex-column'>
                            <h6>Lưu nhận xét thành công.</h6>
                        </div>
                    </div>
                )
                setSave(true)
                // setDoctorComment('')
                // setSelectedOption(true)

                // Thêm logic để xử lý sau khi cập nhật thành công (nếu cần)
            }
        } catch (error) {
            console.error('Lỗi khi cập nhật thông tin:', error)
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
        }
    }

    return (
        <Fragment>
            {/* <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(255, 255, 255, 0.3)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 9999
                }}>
                    <img
                        src={loadingImage}
                        alt="Loading..."
                        style={{ width: '1000px', height: '800px' }} // Kích thước hình ảnh tải
                    />
                </div> */}
            <Card>
                <CardHeader className='card_detect flex-md-row flex-column align-md-items-center align-items-start border-bottom' >
                    {/* <CardTitle tag='h4' style={{ fontWeight: 'bold', color: '#1203b1' }}>Tìm kiếm</CardTitle> */}
                    <div className='d-flex mt-md-0 mt-1'>
                        <Button type='button' color='primary' className='btn-prev'
                            onClick={() => {
                                stepper.previous()
                                // window.location.reload()
                                changeStatus(true)
                                setDoctorComment('')
                                setSelectedOption(true)
                            }
                            }>
                            <ArrowLeft size={14} className='align-middle me-sm-25 me-0'></ArrowLeft><span className='align-middle ms-50'>Quay lại</span>
                        </Button>
                    </div>


                    <Button className='ms-2' color='success' onClick={handleDownloadReport} >
                        <FileText size={16} className='me-2' />
                        <span className='align-middle ms-50'>Xuất báo cáo</span>
                    </Button>

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
                                scalable={true}
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

                            <Nav tabs>
                                <NavItem>
                                    <NavLink
                                        className={classnames({ active: activeTab === '1' })}
                                        onClick={() => toggle('1')}
                                    >
                                        Thông tin bệnh
                                    </NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink
                                        className={classnames({ active: activeTab === '2' })}
                                        onClick={() => toggle('2')}
                                    >
                                        Nhận xét của bác sĩ
                                    </NavLink>
                                </NavItem>
                            </Nav>

                            <TabContent activeTab={activeTab}>
                                <TabPane tabId="1">
                                    <Row>
                                        <CardTitle tag="h5" style={{ textAlign: 'center' }}>
                                            Quân nhân: {name}
                                        </CardTitle>
                                    </Row>
                                    <Row>
                                        {/* {infor && ( */}
                                        <Card style={{ maxWidth: '320px', margin: 'auto' }}>
                                            <CardBody>
                                                <CardTitle tag="h5" style={{ textAlign: 'center' }}>
                                                    Thông tin bệnh
                                                </CardTitle>
                                                <Card
                                                    className="user-info-card shadow-sm"
                                                    // style={{
                                                    //     maxHeight: '700px',
                                                    //     maxWidth: '300x',
                                                    //     overflowY: 'hidden',
                                                    // }}
                                                >
                                                    <CardBody style={{
                                                        maxHeight: '200px', // Set a maximum height for the card body
                                                        overflowY: 'auto',  // Enable vertical scrolling when content exceeds max height
                                                    }}>
                                                        <Row>
                                                            {checkss?.length > 0 ? (
                                                                <>
                                                                    <ul>
                                                                        {checkss.map((check, index) => {
                                                                            const accuracyPercent = (check.accuracy * 100).toFixed(2)
                                                                            const remainingPercent = (100 - accuracyPercent).toFixed(2)

                                                                            return (
                                                                                <li
                                                                                    key={index}
                                                                                    style={{
                                                                                        padding: '10px',
                                                                                        marginBottom: '5px',
                                                                                        borderRadius: '4px',
                                                                                    }}
                                                                                >
                                                                                    <strong>{check.name}</strong> - <strong>{check.name_E}</strong>
                                                                                    <div
                                                                                        style={{
                                                                                            display: 'flex',
                                                                                            alignItems: 'center',
                                                                                            marginTop: '5px',
                                                                                        }}
                                                                                    >
                                                                                        {/* Cột chính hiển thị phần trăm */}
                                                                                        <div
                                                                                            style={{
                                                                                                width: `${accuracyPercent}%`,
                                                                                                backgroundColor: '#007bff', // Màu của cột chính
                                                                                                height: '20px',
                                                                                                borderRadius: '4px 0 0 4px', // Góc bo chỉ bên trái
                                                                                            }}
                                                                                        ></div>

                                                                                        {/* Cột nền mờ hiển thị phần trăm còn lại */}
                                                                                        <div
                                                                                            style={{
                                                                                                width: `${remainingPercent}%`,
                                                                                                backgroundColor: 'rgba(0, 123, 255, 0.2)', // Màu nền mờ với độ trong suốt
                                                                                                height: '20px',
                                                                                                borderRadius: '0 4px 4px 0', // Góc bo chỉ bên phải
                                                                                            }}
                                                                                        ></div>

                                                                                        <span style={{ marginLeft: '10px' }}>{accuracyPercent}%</span>
                                                                                    </div>
                                                                                </li>
                                                                            )
                                                                        })}
                                                                    </ul>
                                                                </>
                                                            ) : (
                                                                <CardText>Không có thông tin bệnh.</CardText>
                                                            )}
                                                        </Row>


                                                    </CardBody>

                                                </Card>
                                            </CardBody>
                                            {checkss?.length > 0 ? (
                                                <Button
                                                    color="primary"
                                                    className="d-flex align-items-center mt-2"
                                                    style={{
                                                        width: '150px', // Giảm chiều rộng của nút
                                                        padding: '0.8rem', // Giữ nguyên padding để chiều cao không thay đổi
                                                        margin: '0 auto',  // Căn giữa nút theo chiều ngang
                                                        display: 'block',
                                                    }}
                                                    onClick={() => setShowDetail(true)}
                                                >
                                                    <Eye size={16} className="me-2" />
                                                    Xem chi tiết
                                                </Button>
                                            ) : (
                                                <></>
                                            )}
                                        </Card>
                                        {/* )} */}
                                    </Row>
                                </TabPane>

                                <TabPane tabId="2">

                                    <Row>
                                        <FormGroup>
                                            <Label for="doctorComment">
                                                <Edit size={24} /> Nhận xét của bác sĩ
                                            </Label>
                                            <Input
                                                type="textarea"
                                                name="doctorComment"
                                                id="doctorComment"
                                                rows="4"
                                                placeholder="Nhập nhận xét của bác sĩ tại đây..."
                                                value={doctorComment}
                                                onChange={(e) => setDoctorComment(e.target.value)}
                                            />
                                        </FormGroup>
                                    </Row>
                                    <Row>
                                        <FormGroup tag="fieldset">
                                            <Label >
                                                <CheckCircle size={20} color="green" className="me-2" />Kết quả chẩn đoán
                                            </Label>

                                            <FormGroup check>
                                                <Label check>
                                                    <Input
                                                        type="radio"
                                                        name="condition"
                                                        value={false}
                                                        checked={selectedOption === false}
                                                        onChange={handleOptionChange}
                                                    />
                                                    Bất thường
                                                </Label>
                                            </FormGroup>

                                            <FormGroup check>
                                                <Label check>
                                                    <Input
                                                        type="radio"
                                                        name="condition"
                                                        value={true}
                                                        checked={selectedOption === true}
                                                        onChange={handleOptionChange}
                                                    />
                                                    Bình thường
                                                </Label>
                                            </FormGroup>

                                            <Button
                                                color="primary"
                                                className="mt-2"
                                                onClick={handleSave} // Implement handleSave to manage saving the comment
                                            // disabled={save}
                                            >
                                                Lưu
                                            </Button>
                                        </FormGroup>
                                    </Row>
                                </TabPane>
                            </TabContent>
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
            <Modal isOpen={showDetail} zIndex={1100} toggle={() => setShowDetail(!showDetail)} className='modal-dialog-centered modal-lg'>
                <ModalHeader className='bg-transparent' toggle={() => setShowDetail(!showDetail)}></ModalHeader>
                <ModalBody className='px-sm-5 mx-50 pb-5'>
                    <div className='text-center mb-2'>
                        <h1 className='mb-1'>Thông tin chi tiết bệnh</h1>
                        {/* <p>Thêm chi tiết thông tin</p> */}
                    </div>
                    <Row tag='form' className='gy-1 pt-75'>
                        {/* <Col md={12} xs={12}>

                        </Col> */}
                        <ModalBody>
                            {checkss?.length > 0 ? (
                                checkss.map((disease, index) => (
                                    <Col key={index} md={12} xs={12} style={{ marginBottom: '20px' }}>
                                        <div>
                                            <h5>{disease.name} - {disease.name_E}</h5>
                                            <p><strong>Cách khắc phục:</strong>   {typeof disease.advice === 'string' ? (
                                                disease.advice.split('.').map((sentence, index) => (
                                                    <Fragment key={index}>
                                                        <br />
                                                        {sentence.trim()}

                                                    </Fragment>
                                                ))
                                            ) : (
                                                disease.advice
                                            )}</p>
                                            <hr />
                                        </div>
                                    </Col>
                                ))
                            ) : (
                                <p>Không có dữ liệu bệnh.</p>
                            )}
                        </ModalBody>
                    </Row>
                </ModalBody>
            </Modal>
        </Fragment >
    )
}

export default StepEvent
