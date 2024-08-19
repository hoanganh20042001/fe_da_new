// ** React Imports
import { useRef, useState } from 'react'

// ** Custom Components
import Wizard from '@components/wizard'

import StepConfig from './step/stepConfig'
import StepEvent from './step/stepEvent'
import { CardTitle, Col } from 'reactstrap'
const WizardHorizontal = () => {

  const ref = useRef(null)
  // ** State
  const [infoDetect, setInfoDetect] = useState({
    web_Url: '',
    conf: 0.25,
    iou: 0.7,
    dtViolence: true,
    dtWeapon: true,
    dtAccident: true,
  })
  const [stepper, setStepper] = useState(null)
  const userData = JSON.parse(localStorage.getItem('userData'))
  const [dataImg, setDataImg] = useState()
  const handleChangeInfo = (data, pop) => {
    console.log(data, pop)
    setInfoDetect({ ...infoDetect, [pop]: data })
  }
  const handleChangeData = (data) => {
    // console.log(data, pop)
    setDataImg(data)
  }
  const steps = [
    {
      id: 'step-config',
      title: 'Chọn ngưỡng config',
      subtitle: 'Chọn ngưỡng config',
      content: <StepConfig stepper={stepper} infoDetect={infoDetect} data={dataImg} changeInfo={handleChangeInfo} changeData={handleChangeData} />
    },
    {
      id: 'step-event',
      title: 'Chọn sự kiện cần phát hiện',
      subtitle: 'Chọn sự kiện cần phát hiện',
      content: <StepEvent stepper={stepper} infoDetect={infoDetect} data={dataImg} changeInfo={handleChangeInfo} changeData={handleChangeData} />
    }
  ]

  return (
 <div className='vertical-wizard'>
   <Col lg='3' className='d-flex align-items-center px-0 px-lg-1'>

<CardTitle tag='h4' style={{ fontWeight: 'bold', color: '#1203b1' }}>
  SỰ KIỆN BẤT THƯỜNG
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
      </div>
  )
}

export default WizardHorizontal
