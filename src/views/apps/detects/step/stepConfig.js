// import { Link, } from 'react-router-dom'
import { Fragment, useState, forwardRef, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { useNavigate, Link } from 'react-router-dom'
import Select from 'react-select'
import { Controller, useForm } from 'react-hook-form'
import Avatar from '@components/avatar'
// ** Third Party Components
import ReactPaginate from 'react-paginate'
import DataTable from 'react-data-table-component'
import { Eye, ChevronDown, Share, Printer, FileText, File, Grid, Copy, Plus, Edit, Trash, Check, Clipboard, Search, MoreVertical, X, ArrowLeft, ArrowRight, User, Mail, Phone, Calendar, MapPin, Home, Droplet, Info, Briefcase, BarChart2, Activity, Clock, Shield, CreditCard } from 'react-feather'
import { useSelector, useDispatch } from 'react-redux'
import StatsHorizontal from '@components/widgets/stats/StatsHorizontal'
import { get, update, add, del } from '@store/action/patients'
import { toDateString } from '@utils'
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

const StepConfig = ({ stepper, info, status, changeInfo, changeData1, changeData2, changeStatus, changeName }) => {
    // ** States
    // const [modal, setModal] = useState(false)
    const [displaySelect, setDisplay] = useState(false)
    const dispatch = useDispatch()
    const [currentPage, setCurrentPage] = useState(0)
    const [isValid, setIsValid] = useState(true)
    // const [data, setData] = useState()
    const [object, setObject] = useState(true)
    const roleId = JSON.parse(localStorage.getItem('userData'))
    const [searchResults, setSearchResults] = useState([])
    const [KL, setIsKL] = useState(false)
    const [searchText, setSearchText] = useState('')
    const [patientss, setPatients] = useState({
        full_name: '',
        indentification: '',
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
    const [selectedOption, setSelectedOption] = useState('0')
    const [validationMessage, setValidationMessage] = useState('')
    const [showFullInfo, setShowFullInfo] = useState(false)
    const validateCccd = (value) => {
        const cccdRegex = /^[0-9]{12}$/ // Định dạng CCCD là 12 chữ số
        return cccdRegex.test(value)
    }

    const patients = useSelector((state) => state.patients.patients)

    // useEffect(() => {
    //     setPatients(patients.data)
    // }, [patients])
    const [valErrors, setValErrors] = useState({
        web_Url: '',
        conf: '',
        iou: ''
    })
    // const patientss = patients.data ? patients.data : {}
    const navigate = useNavigate()


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
    const handleSelectChange = (event) => {
        const value = event.target.value
        console.log(value)
        setSelectedOption(value)

    }
    const handleNext = (data) => {
        console.log(data.image_1)
        changeInfo(data.check_id)
        changeData1(data.image_1)
        changeData2(data.image_2)
        changeName(data.full_name)
        stepper.next()
        setIsKL(true)

    }
    useEffect(() => {
        dispatch(get({
            pageSize: 9,
            page: currentPage + 1,
            search_text: searchText,
            status: 2,
        }))
        if (KL) {
            setIsKL(false)
          }
          if (status) {
            changeStatus(false)
          }
    }, [dispatch, currentPage, searchText, status, selectedOption, KL])
   
    const columns = [
        {
            name: 'STT',
            sortable: true,
            minWidth: '50px',
            maxWidth: '100px',
            selector: (row, index) => index + 1,
        },
        {
            name: 'Tên quân nhân',
            sortable: true,
            minWidth: '200px',
            selector: row => row.full_name,
        },
        {
            name: 'CCCD',
            sortable: true,
            minWidth: '100px',
            selector: row => row.identification
        },
        {
            name: 'Ngày sinh',
            sortable: true,
            minWidth: '50px',
            selector: row => toDateString(row.date_birth)
        },
        {
            name: 'Giới tính',
            sortable: true,
            minWidth: '150px',
            cell: (row) => {
                return (
                    row.sex === true ? 'Nam' : 'Nữ'
                )
            }
        },

        {
            name: 'Đơn vị',
            sortable: true,
            minWidth: '150px',
            selector: row => row.unit_name
        },
        {
            name: 'Tác vụ',
            allowOverflow: true,
            cell: (row) => {
                return (
                    <div className='d-flex'>
                        {row.status === null && (
                            <span style={{ color: 'red' }}>Chưa có ảnh</span>
                        )}
                        {row.status === true && (
                            <span style={{ color: 'green' }}>Đã kết luận</span>
                        )}
                        {row.status === false && (
                            <Button
                                color="primary"
                                size="sm"
                                onClick={() => handleNext(row)}
                                style={{ cursor: 'pointer', marginLeft: '6px', padding: '4px 8px' }}
                            >
                                <span className='align-middle ms-50'>Kết luận</span>
                                <ArrowRight size={14} className='align-middle ms-sm-25 ms-0' />
                            </Button>
                        )}
                    </div>
                )
            }
        }
    ]
    const handleFilter = e => {
        setSearchText(e)
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
            pageCount={patients?.data?.metadata?.total_pages}
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
                {/* <CardHeader className='flex-md-row flex-column align-md-items-center align-items-start border-bottom'>
          <CardTitle tag='h4' style={{ fontWeight: 'bold', color: '#1203b1' }}>DANH SÁCH QUÂN NHÂN</CardTitle>
        </CardHeader> */}
                <Row className='justify-content-end mx-0'>
                    <Col className='d-flex align-items-center justify-content-end mt-1' md='6' sm='12'>
                        <div className='d-flex align-items-center'>
                            <label htmlFor='search-invoice'>Tìm kiếm</label>
                            <Input
                                id='search-invoice'
                                className='ms-50 me-2 w-100'
                                type='text'
                                // value={value}
                                onChange={e => handleFilter(e.target.value)}
                                placeholder='Tìm kiếm tên quân nhân'
                            />
                        </div>
                        {/* <Input className='w-auto ' type='select' value={selectedOption} onChange={handleSelectChange}>
                            <option value='0'>Tất cả</option>
                            <option value='1'>Quân nhân đã chẩn đoán</option>
                            <option value='2'>Quân nhân chưa chẩn đoán</option>
                            <option value='3'>Quân nhân bị bệnh</option>
                            <option value='4'>Quân nhân bình thường</option>
                        </Input> */}
                    </Col>
                </Row>
                <Row className='justify-content-end mx-0'>
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
                            data={Array.isArray(patients?.data?.data) ? patients.data.data : []}
                        />
                    </div></Row>
            </Card>

        </Fragment>
    )
}

export default StepConfig
