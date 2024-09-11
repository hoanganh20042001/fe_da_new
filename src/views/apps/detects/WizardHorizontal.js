// ** React Imports
import { useRef, useState } from 'react'

// ** Custom Components
import Wizard from '@components/wizard'

import StepConfig from './step/stepConfig'
import StepEvent from './step/stepEvent'
import { CardTitle, Col, CardHeader, Card } from 'reactstrap'
const WizardHorizontal = () => {

  const ref = useRef(null)
  // ** State
  const [info, setInfo] = useState('')
  const [stepper, setStepper] = useState(null)
  const [status, setStatus] = useState(false)
  const [dataImg, setDataImg] = useState()
  const handleChangeInfo = (data) => {
    // console.log(data, pop)
    setInfo(data)
  }
  const handleChangeStatus = (data) => {
    setStatus(data)
  }
  const handleChangeData = (data) => {
    // console.log(data, pop)
    setDataImg(data)
  }
  const steps = [
    {
      id: 'step-config',
      title: 'Danh sách quân nhân',
      subtitle: 'Danh sách quân nhân',
      content: <StepConfig stepper={stepper} info={info} data={dataImg} status={status} changeInfo={handleChangeInfo} changeData={handleChangeData} changeStatus={handleChangeStatus} />
    },
    {
      id: 'step-event',
      title: 'Dự đoán bệnh',
      subtitle: 'Dự đoán bệnh',
      content: <StepEvent stepper={stepper} info={info} data={dataImg} status={status} changeInfo={handleChangeInfo} changeData={handleChangeData} changeStatus={handleChangeStatus}/>
    }
  ]

  return (
    <div className='vertical-wizard'>
      <Card>
      <CardHeader className='flex-md-row flex-column align-md-items-center align-items-start border-bottom'>
          <CardTitle tag='h4' style={{ fontWeight: 'bold', color: '#1203b1' }}>KHÁM BỆNH</CardTitle>
          {/* <div className='d-flex mt-md-0 mt-1'>
            {
              <Button className='ms-2' color='primary' onClick={() => setShowAdd(true)}> <Plus size={15} /> <span className='align-middle ms-50'>Thêm bộ dữ liệu</span> </Button>
            }
          </div> */}
        </CardHeader>
        <Wizard
        type='vertical'
        ref={ref}
        steps={steps}
        instance={el => {
          setStepper(el)
        }}
      />
        </Card>
    </div>
  )
}

export default WizardHorizontal
