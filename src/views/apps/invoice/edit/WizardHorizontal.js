// ** React Imports
import { useRef, useState } from 'react'

// ** Custom Components
import Wizard from '@components/wizard'

// ** Steps
import Address from './steps-with-validation/Address'
import PersonalInfo from './steps-with-validation/PersonalInfo'
import AccountDetails from './steps-with-validation/AccountDetails'
import StepTest from './steps-with-validation/StepTest'
import SimpleLineChart from './steps-with-validation/SimpleLineChart'
import Predict from './steps-with-validation/Predict'
import { CardTitle, Col } from 'reactstrap'
import { Link } from 'react-router-dom'
const WizardHorizontal = ({ exp }) => {
  // ** Ref
  const inf = exp
  const ref = useRef(null)
  // ** State
  const [stepper, setStepper] = useState(null)
  const userData = JSON.parse(localStorage.getItem('userData'))
  const [infoExp, setInfoExp] = useState({
    expname: "",
    expmodelid: 1,
    expdatasetid: 1,
    expcreatorid: parseInt(userData.id),
    expsoftwarelibid: 1,
    paramsconfigs_json: "",
    configid: 1
  })
  const handleChangeInfo = (data, pop) => {
    setInfoExp({ ...infoExp, [pop]: data })
  }
  const [configId, setconfigId] = useState(0)
  const [errorFields, setErrorFields] = useState({}) // State để theo dõi các trường bắt buộc bị lỗi
  const handleChangeConfigId = (data) => {
    // console.log(data, pop)
    setconfigId(data)
  }
  const steps = [
    {
      id: 'account-details',
      title: 'Chỉnh sửa bài thí nghiệm',
      subtitle: 'Chỉnh sửa bài thí nghiệm',
      content: <AccountDetails stepper={stepper} infoExp={exp} changeInfo={handleChangeInfo} />
    },
    {
      id: 'personal-info',
      title: 'Chọn mô hình',
      subtitle: 'Chọn mô hình huấn luyện',
      content: <PersonalInfo stepper={stepper} infoExp={exp} changeInfo={handleChangeInfo} />
    },
    {
      id: 'step-address',
      title: 'Cấu hình tham số',
      subtitle: 'Cấu hình các tham số để huấn luyện',
      content: <Address stepper={stepper} infoExp={exp} changeInfo={handleChangeInfo} configId={configId} handleChangeConfigId={handleChangeConfigId} />
    },
    {
      id: 'step-train',
      title: 'Huấn luyện',
      subtitle: 'Theo dõi quá trình huấn luyện',
      content: <SimpleLineChart warning={'red'} stepper={stepper} infoExp={exp} info={infoExp} configId={configId} />

    },
    {
      id: 'step-test',
      title: 'Đánh giá',
      subtitle: 'Đánh giá mô hình',
      content: <StepTest stepper={stepper} infoExp={exp} info={infoExp} changeInfo={handleChangeInfo} />
    },
    {
      id: 'step-predict',
      title: 'Dự đoán',
      subtitle: 'Tải hình ảnh lên để kiểm tra',
      content: <Predict stepper={stepper} infoExp={exp} info={infoExp} />
    }
  ]

  return (
    exp.expstatus === 1 ? <div className='vertical-wizard'>
      <Col lg='3' className='d-flex align-items-center px-0 px-lg-1'>

        <CardTitle tag='h4' style={{ fontWeight: 'bold', color: '#1203b1' }}>
          THÍ NGHIỆM LẠI
        </CardTitle>
      </Col>
      <Wizard
        type='vertical'
        ref={ref}
        steps={steps}
        instance={el => {
          setStepper(el)
        }}
      />
    </div> : <div className='vertical-wizard'>
      <Col lg='3' className='d-flex align-items-center px-0 px-lg-1'>

        <CardTitle tag='h4' style={{ fontWeight: 'bold', color: '#1203b1' }}>
          THÍ NGHIỆM LẠI

        </CardTitle>
      </Col>
      <Col lg='12' className='d-flex align-items-end justify-content-end j px-0 px-lg-1'>
        <Link to={'/apps/invoice/list'}> Quay lại</Link>
      </Col>
      <Wizard
        type='vertical'
        ref={ref}
        steps={steps}
        instance={el => {
          setStepper(el)
        }}
      />
    </div>
  )
}

export default WizardHorizontal
