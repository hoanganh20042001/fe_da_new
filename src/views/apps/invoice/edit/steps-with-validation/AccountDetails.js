import { Fragment, useState, useEffect } from 'react'
// ** Third Party Components
import Select from 'react-select'
import { useSelector, useDispatch } from 'react-redux'
import { useForm, Controller } from 'react-hook-form'
import { ArrowLeft, ArrowRight } from 'react-feather'

// ** Utils
import { selectThemeColors } from '@utils'

// ** Reactstrap Imports
import { Label, Row, Col, Button, Form, Input, FormFeedback, CardText, Modal, ModalBody, ModalHeader } from 'reactstrap'
import FileUploaderSingle from './FileUploaderSingle'
import { getListDataBySoftID } from '@store/action/dataset'
// ** Styles
import '@styles/react/libs/react-select/_react-select.scss'
import { data } from 'jquery'

const defaultValues = {
  lastName: '',
  firstName: ''
}

const AccountDetails = ({ stepper, infoExp, changeInfo }) => {
  const dispatch = useDispatch()
  const [checkbox1, setCheckBox1] = useState(true)
  const [checkbox2, setCheckBox2] = useState(false)
  const [displaySelect, setDisplay] = useState(false)
  const [displayUpload, setDisplayUpload] = useState('none')
  const [enable, setEnable] = useState(true)
  const [infoModel, setModel] = useState({
    id: 1,
    datasetdescription: '',
    datasetfolderurl: '',
    datasetname: '',
    datasetowner: 1,
    datasetsoftID: 1,
    datasetsum: 1,
    datasettype: 1,
  })
  const [selectedOption, setSelectedOption] = useState({
    value: infoExp.expsoftwarelibid,
    label: infoExp.expsoftwarelibid === 1 ? 'Nhận diện khuôn mặt' : infoExp.expsoftwarelibid === 2 ? 'Nhận dạng sự kiện bất thường' : 'Phát hiện khuôn mặt'
  })

  const [valErrors, setValErrors] = useState({
    expname: '',
    expsoftwarelibid: '',
    expdatasetid: '',
  })
  const [display, setDisplayModal] = useState(false)
  const toggleModal = () => setDisplayModal(!display)
  // ** Hooks
  const {
    handleSubmit
  } = useForm({ defaultValues })
  const dataDataset = useSelector((state) => {
    return state.dataset.dataDataset
  })
  const ChangeLisData = (dataDataset) => {
    if (!Array.isArray(dataDataset)) {
      return [] // hoặc giá trị mặc định khác nếu cần
    }
    
    return dataDataset.map(item => ({
      value: item.datasetid,
      label: item.datasetname
    }))
  }
  const [showAccept, setShowAccept] = useState(false)

  useEffect(() => {
    dispatch(getListDataBySoftID({
      pageSize: 10,
      page: 1,
      id_softlib: infoExp.expsoftwarelibid
    }))

  }, [dispatch, infoExp.expsoftwarelibid])
  useEffect(() => {
    if (Array.isArray(dataDataset) && dataDataset.length !== 0) {
      const data = dataDataset.find(item => item.datasetid === infoExp.expdatasetid)
      if (data) {
        setModel(data)
      }
    }

  }, [dataDataset])
  const onSubmit = () => {
    // if (Object.values(data).every(field => field.length > 0)) {
    stepper.next()

  }
  // const handleOnChange = (value, pop) => {
  //   if (value === null || value === undefined || value === "") {
  //     setValErrors({ ...valErrors, [pop]: 'Không được để trống' })
  //   } else {
  //     setValErrors({ ...valErrors, [pop]: null })
  //   }
  //   if (pop === 'expsoftwarelibid') {
  //     setModel({datasetid: null})
  //     setEnable(false)
  //     changeInfo(value, pop)

  //   } else {
  //     changeInfo(value, pop)
  //   }
  // }
  const handleOnChange = (selectedOption, pop) => {
    const value = selectedOption ? selectedOption.value : null
  
    if (value === null || value === undefined || value === "") {
      setValErrors({ ...valErrors, [pop]: 'Không được để trống' })
    } else {
      setValErrors({ ...valErrors, [pop]: null })
    }
  
    if (pop === 'expsoftwarelibid') {
      setModel({ datasetid: null })
      setEnable(false)
    }
  
    changeInfo(value, pop)
  }
  const handleOnChangeData = (value, pop) => {
    const infoModel = dataDataset.find((item) => item.datasetid === value)
    setModel(infoModel)
    changeInfo(value, pop)
    setEnable(false)
  }
  const languageOptions = [
    { value: 1, label: 'Nhận diện khuôn mặt' },
    { value: 2, label: 'Nhận dạng sự kiện bất thường' },
    { value: 3, label: 'Phát hiện khuôn mặt' },
  ]

  return (
    <Fragment>

      <div>
        <Row>
          <Col className='p-0' xl='8'>
            <div className='content-header'>
              <h5 className='mb-0'>Chọn bộ dữ liệu</h5>
            </div>
          </Col>
        </Row>
      </div>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Row>
          <Col md='8' className='mb-1'>
            <Label className='form-label' for='city'>
              Tên bài thí nghiệm <span style={{ color: 'red' }}>*</span>
            </Label><Input placeholder='Tên bài thí nghiệm' value={infoExp.expname} disabled onChange={e => handleOnChange(e.target.value, 'expname')} />
          </Col>

        </Row>
        <Row>
          <Col md='8' className='mb-1'>
            <Label className='form-label' for='city'>
              Chọn bài toán <span style={{ color: 'red' }}>*</span>
            </Label>
            <Select
              // disabled={true}
               isMulti={false}
               isClearable={false}
               placeholder={'Chọn bài toán'}
               theme={selectThemeColors}
               id={`language`}
              //  options={languageOptions}
               value={{ value: infoExp.expsoftwarelibid, label: infoExp.expsoftwarelibid === 1 ? 'Nhận diện khuôn mặt' : infoExp.expsoftwarelibid === 2 ? 'Nhận dạng sự kiện bất thường' : 'Phát hiện khuôn mặt' }}
               className='react-select'
               classNamePrefix='select'
               isDisabled={true}
              //  onChange={(e) => handleOnChange(e.value, "expsoftwarelibid")}
            />
          </Col>
        </Row>
        <Row>
          <Col md='8' className='mb-1'>
            <Label className='form-label' for='city'>
              Chọn bộ dữ liệu <span style={{ color: 'red' }}>*</span>
            </Label>
            <Select
              isMulti={false}
              isClearable={false}
              theme={selectThemeColors}
              placeholder={'Chọn bộ dữ liệu'}
              id={`language`}
              value={infoModel.datasetid === null ? {value: null, label :'Chọn bộ dữ liệu'} : {
                value: infoModel.datasetid,
                label: infoModel.datasetname
              }}
              options={ChangeLisData(dataDataset)}
              className='react-select'
              classNamePrefix='select'
              isDisabled={displaySelect}
              onChange={(e) => handleOnChangeData(e.value, "expdatasetid")}
            />
          </Col>
        </Row>
        <Row>
          <Col className='p-0' xl='4' style={{ marginLeft: '15px' }}>
            <h6 className='mb-2'>Thông tin bộ dữ liệu: {infoModel.datasetname}</h6>
            <CardText className='mb-25'>Tổng số lượng mẫu: {infoModel.datasetsum}</CardText>
            <CardText className='mb-25' style={{ color: 'blue', cursor: 'pointer' }} onClick={e => setShowAccept(!showAccept)}>Mô tả</CardText>
          </Col>
        </Row>
        <div className='d-flex justify-content-end'>
          <Button className='btn' style={{ marginRight: '15px' }} onClick={(e) => history.back()}>
            <span className='align-middle d-sm-inline-block d-none'>Hủy</span>
          </Button>
          <Button type='submit' color='primary' className='btn-next' >
            <span className='align-middle d-sm-inline-block d-none'>Tiếp theo</span>
            <ArrowRight size={14} className='align-middle ms-sm-25 ms-0'></ArrowRight>
          </Button>
        </div>
      </Form>
      <Modal isOpen={showAccept} toggle={() => setShowAccept(!showAccept)} size='lg' className='modal-dialog-centered modal-lg' backdrop="static">
        <ModalHeader className='bg-transparent' toggle={() => setShowAccept(!showAccept)} >THÔNG TIN MÔ TẢ</ModalHeader>
        <ModalBody>
          {infoModel.datasetdescription}
        </ModalBody>
      </Modal>
    </Fragment>
  )
}

export default AccountDetails
