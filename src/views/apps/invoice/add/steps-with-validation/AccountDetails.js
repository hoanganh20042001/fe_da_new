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
  const [displaySelect, setDisplay] = useState(false)
  const [enable, setEnable] = useState(true)
  const [valueModel, setValueModel] = useState('')

  const [infoModel, setModel] = useState({
    datasetid: null,
    datasetdescription: '',
    datasetfolderurl: '',
    datasetname: '',
    datasetowner: 1,
    datasetsoftID: 1,
    datasetsum: null,
    datasettype: 1,
  })
  // ** Hooks
  const {
    handleSubmit
  } = useForm({ defaultValues })
  const dataDataset = useSelector((state) => {
    return state.dataset.dataDataset
  })
  const ChangeLisData = (dataDataset) => {
    // if (!Array.isArray(dataDataset)) {
    //   console.error("Expected dataDataset to be an array but got", typeof dataDataset)
    //   return []
    // }
    // console.log("dataDataset: ", dataDataset)
    if (!dataDataset) {
      return [] // hoặc giá trị mặc định khác nếu cần
    }
    if (Array.isArray(dataDataset) && dataDataset.length !== 0) {
    return dataDataset.map(item => ({
      value: item.datasetid,
      label: item.datasetname
    }))
  }
  }
  const [showAccept, setShowAccept] = useState(false)
  useEffect(() => {
    dispatch(getListDataBySoftID({
      pageSize: 10,
      page: 1,
      id_softlib: infoExp.expsoftwarelibid
    }))

  }, [dispatch, infoExp.expsoftwarelibid])
  const [valErrors, setValErrors] = useState({
    expname: '',
    expsoftwarelibid: '',
    expdatasetid: '',
  })
  const onSubmit = () => {
    if (infoExp.expname.trim() !== "") {
      stepper.next()
    } else {
      setValErrors({ ...valErrors, expname: 'Không được để trống' })
    }
    // if (Object.values(data).every(field => field.length > 0)) {

  }

  const handleOnChange = (value, pop) => {
    // console.log("value: ", value)
    if (value === null || value === undefined || value === "") {
      setValErrors({ ...valErrors, [pop]: 'Không được để trống' })
    } else {
      setValErrors({ ...valErrors, [pop]: null })
    }
    if (pop === 'expsoftwarelibid') {
      setModel({datasetid: null})
      setEnable(true)
      changeInfo(value, pop)

    } else {
      changeInfo(value, pop)
    }
  }
  const handleInputClick = () => {
    // Khi click vào ô input, hiển thị thông báo bằng cách set state showMessage thành true
    setValErrors({ ...valErrors, expname: 'Không được để trống' })
  }
  const handleOnChangeData = (value, pop) => {
    if (Array.isArray(dataDataset) && dataDataset.length !== 0) {
    const infoModel = dataDataset.find((item) => item.datasetid === value)
    setModel(infoModel)
    changeInfo(value, pop)
    setEnable(false)
    }
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
              <h5 className='mb-0'>Chọn bộ dữ liệu <span style={{ color: 'red' }}>*</span></h5>
            </div>
          </Col>
        </Row>
      </div>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Row>
          <Col md='8' className='mb-1'>
            <Label className='form-label' for='city'>
              Tên bài thí nghiệm <span style={{ color: 'red' }}>*</span>
            </Label><Input placeholder='Tên bài thí nghiệm' value={infoExp.expname} onChange={e => handleOnChange(e.target.value, 'expname')} onClick={handleInputClick} />

            <p style={{ fontSize: '10px', fontStyle: 'italic', color: 'red' }}>{valErrors.expname}</p>


          </Col>

        </Row>
        <Row>
          <Col md='8' className='mb-1'>
            <Label className='form-label' for='city'>
              Chọn bài toán <span style={{ color: 'red' }}>*</span>
            </Label>
            <Select
              isMulti={false}
              isClearable={false}
              placeholder={'Chọn bài toán'}
              theme={selectThemeColors}
              id={`language`}
              options={languageOptions}
              className='react-select'
              classNamePrefix='select'
              isDisabled={displaySelect}
              onChange={(e) => {
                handleOnChange(e.value, "expsoftwarelibid")
              }}
            />
            <p style={{ fontSize: '10px', fontStyle: 'italic', color: 'red' }}>{valErrors.expsoftwarelibid}</p>

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
            <p style={{ fontSize: '10px', fontStyle: 'italic', color: 'red' }}>{valErrors.expdatasetid}</p>

          </Col>
        </Row>
        <Row>
          <Col className='p-0' xl='4' style={{ marginLeft: '15px' }}>
            <h6 className='mb-2'>Thông tin bộ dữ liệu: {infoModel.datasetname}</h6>
            <CardText className='mb-25'>Tổng số lượng mẫu: {infoModel.datasetsum}</CardText>
            <CardText className='mb-25' style={{ color: 'blue', cursor: infoModel.datasetsum !== null ? 'pointer' : 'none' }} onClick={e => { if (infoModel.datasetsum !== null) { setShowAccept(!showAccept) } }} >Mô tả</CardText>
          </Col>
        </Row>
        <div className='d-flex justify-content-end'>
          <Button className='btn' style={{ marginRight: '15px' }} onClick={(e) => history.back()}>
            <span className='align-middle d-sm-inline-block d-none'>Hủy</span>
          </Button>
          <Button type='submit' color='primary' className='btn-next' disabled={enable || infoExp.expname.length === 0}>
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
