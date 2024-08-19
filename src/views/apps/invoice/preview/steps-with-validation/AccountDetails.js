import { Fragment, useState, useEffect } from 'react'
// ** Third Party Components
import Select from 'react-select'
import { useSelector, useDispatch } from 'react-redux'
import { useForm, Controller } from 'react-hook-form'
import { ArrowLeft, ArrowRight } from 'react-feather'
import { Link } from 'react-router-dom'
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
  const [displaySelect, setDisplay] = useState(infoExp.expstatus !== 1)
  const [displayUpload, setDisplayUpload] = useState('none')
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
 
  const [display, setDisplayModal] = useState(false)
  const toggleModal = () => setDisplayModal(!display)
  // ** Hooks
  const {
    handleSubmit
  } = useForm({ defaultValues })
  const dataDataset = useSelector((state) => {
    return state.dataset.dataDataset
  })
  // const [infoModel, setModel] = useState(() => {
  //   if (dataDataset && infoExp) {
  //     return dataDataset.find(item => item.datasetid === infoExp.expdatasetid)
  //   }
  //   return null
  // })
  useEffect(() => {
    console.log(dataDataset)
    if (Array.isArray(dataDataset) && dataDataset.length !== 0 && infoExp) {
      const infoModel = dataDataset.find(item => item.datasetid === infoExp.expdatasetid)
      console.log(infoModel)
      if (infoModel) {
        setModel(infoModel)
      } else {
        console.warn('Không tìm thấy infoModel')
      }
    }
  }, [dataDataset, infoExp.expdatasetid])
  const ChangeLisData = (dataDataset) => {
    if (!dataDataset) {
      return [] // hoặc giá trị mặc định khác nếu cần
    }
    const list = []
    dataDataset.map(item => {
      list.push({
        value: JSON.stringify({
          id: item.datasetid,
          datasetdescription: item.datasetdescription,
          datasetfolderurl: item.datasetfolderurl,
          datasetname: item.datasetname,
          datasetowner: item.datasetowner,
          datasetsoftID: item.datasetsoftID,
          datasetsum: item.datasetsum,
          datasettype: item.datasettype,
        }),
        label: item.datasetname
      })
    })
    return list
  }

  useEffect(() => {
    console.log(infoExp)
    dispatch(getListDataBySoftID({
      pageSize: 10,
      page: 1,
      id_softlib: infoExp.expsoftwarelibid
    }))
    // const data = dataDataset.find(item => item.datasetid === infoExp.expdatasetid)
    // setModel(data)
  }, [dispatch, infoExp.expsoftwarelibid])
  useEffect(() => {
    if (Array.isArray(dataDataset) && dataDataset.length !== 0) {
      const data = dataDataset.find(item => item.datasetid === infoExp.expdatasetid)
      if (data) {
        setModel(data)
      }
    }
  }, [dataDataset, infoExp.expdatasetid])
  const setData = (dataDataset) => {
    // console.log(infoExp)

    if (Array.isArray(dataDataset) && dataDataset.length !== 0) {
      const data = dataDataset.find(item => item.datasetid === infoExp.expdatasetid)
      if (data) {
        const temp = {
          value: data.datasetid,
          label: data.datasetname
        }       
        return temp

      } else {
        const temp = {
          value: 0,
          label: "Bộ dữ lệu đã bị xóa"
        }
        return temp
      }
     
    }

  }
  const onSubmit = () => {
    // if (Object.values(data).every(field => field.length > 0)) {
    stepper.next()

  }
  const handleOnChange = (value, pop) => {
    changeInfo(value, pop)
  }
  const handleOnChangeData = (value, pop) => {
    const infoModel = JSON.parse(value)
    setModel(infoModel)
    changeInfo(infoModel.id, pop)
  }
  const HandleClick1 = () => {
    setCheckBox1(true)
    setCheckBox2(false)
    setDisplay(false)
    setDisplayUpload('none')
  }
  const HandleClick2 = () => {
    setCheckBox1(false)
    setCheckBox2(true)
    setDisplay(true)
    setDisplayUpload('block')
  }
  const handleSelect = (e) => {
    setModel(e.value)
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
              Tên bài thí nghiệm
            </Label><Input placeholder='Tên bài thí nghiệm' value={infoExp.expname} onChange={e => handleOnChange(e.target.value, 'expname')} readOnly={displaySelect} />
          </Col>

        </Row>
        <Row>
          <Col md='8' className='mb-1'>
            <Select
              isMulti={false}
              isClearable={false}
              placeholder={'Chọn bài toán'}
              theme={selectThemeColors}
              id={`language`}
              options={languageOptions}
              value={{ value: infoExp.expsoftwarelibid, label: infoExp.expsoftwarelibid === 1 ? 'Nhận diện khuôn mặt' : infoExp.expsoftwarelibid === 2 ? 'Nhận dạng sự kiện bất thường' : 'Phát hiện khuôn mặt' }}
              className='react-select'
              classNamePrefix='select'
              isDisabled={true}
              onChange={(e) => handleOnChange(e.value, "expsoftwarelibid")}
            />
          </Col>
        </Row>
        <Row>
          <Col md='8' className='mb-1'>
            <Select
              isMulti={false}
              isClearable={false}
              theme={selectThemeColors}
              placeholder={'Chọn bộ dữ liệu'}
              id={`language`}
              // options={ChangeLisData(dataDataset)}
              className='react-select'
              classNamePrefix='select'
              isDisabled={displaySelect}
              value={setData(dataDataset)}
              onChange={(e) => handleOnChangeData(e.value, "expdatasetid")}
            />
          </Col>
        </Row>
        <Row>
          <Col className='p-0' xl='4' style={{ marginLeft: '15px' }}>
            <h6 className='mb-2'>Thông tin bộ dữ liệu: {infoModel ? infoModel.datasetname : ''}</h6>
            {/* <CardText className='mb-25'>Loại: {infoModel ? infoModel.datasettype : ''}</CardText>
            <CardText className='mb-25'>Loại sự kiện: {infoModel ? infoModel.datasettype : ''}</CardText> */}
            <CardText className='mb-25'>Tổng số lượng mẫu: {infoModel ? infoModel.datasetsum : ''}</CardText>
            <CardText className='mb-25' style={{ color: 'blue', cursor: 'pointer' }} onClick={e => setDisplayModal(e)}>Mô tả</CardText>
          </Col>
        </Row>
        <div className='d-flex justify-content-between'>
        <Link to={'/apps/invoice/list'}>
        <Button type='button' color='primary' className='btn-prev'>
            <ArrowLeft size={14} className='align-middle me-sm-25 me-0'></ArrowLeft>
            <span className='align-middle d-sm-inline-block d-none'>Quay lại</span>
          </Button>
        </Link>
        
          <Button type='submit' color='primary' className='btn-next'>
            <span className='align-middle d-sm-inline-block d-none'>Tiếp theo</span>
            <ArrowRight size={14} className='align-middle ms-sm-25 ms-0'></ArrowRight>
          </Button>
        </div>
      </Form>
      <Modal isOpen={display} toggle={toggleModal} size='lg' backdrop="static">
      <ModalHeader className='bg-transparent' toggle={() => setDisplayModal(false)}>THÔNG TIN MÔ TẢ</ModalHeader>
        {/* <ModalHeader>THÔNG TIN MÔ TẢ</ModalHeader> */}
        <ModalBody>
          {infoModel ? infoModel.datasetdescription : ''}
        </ModalBody>
      </Modal>
    </Fragment>
  )
}

export default AccountDetails
