// ** Reactstrap Imports
import { Card, CardHeader, CardTitle, CardBody, Form, Button, Badge } from 'reactstrap'
import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
// ** Third Party Components
import { ArrowLeft, ArrowRight, AlertCircle, ArrowDown, ArrowUp, Save } from 'react-feather'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import Chart from 'react-apexcharts'
import moment from 'moment'
import { addModelTrainded } from '../../../../../redux/action/model'
// ** Chart Data
const data = [
  {
    name: '7/12',
    pv: 280
  },
  {
    name: '8/12',
    pv: 200
  },
  {
    name: '9/12',
    pv: 220
  },
  {
    name: '10/12',
    pv: 180
  },
  {
    name: '11/12',
    pv: 270
  },
  {
    name: '12/12',
    pv: 250
  },
  {
    name: '13/12',
    pv: 70
  },
  {
    name: '14/12',
    pv: 90
  },
  {
    name: '15/12',
    pv: 200
  },
  {
    name: '16/12',
    pv: 150
  },
  {
    name: '17/12',
    pv: 160
  },
  {
    name: '18/12',
    pv: 100
  },
  {
    name: '19/12',
    pv: 150
  },
  {
    name: '20/12',
    pv: 100
  },
  {
    name: '21/12',
    pv: 50
  }
]
const RenderChart = ({ listTrain }) => {
  return (
    <Chart
      type="area"
      height={300}
      width='100%'
      series={[
        {
          name: "Accuracy",
          data: listTrain?.map(data => data.accuracy)
        },
        {
          name: "Loss value",
          data: listTrain?.map(data => data.lossvalue)
        }
      ]}
      options={{
        chart: {
          height: 350,
          type: 'line',
          animations: {
            enabled: true,
            easing: 'linear',
            dynamicAnimation: {
              speed: 1000
            }
          },
          toolbar: {
            show: false
          },
          zoom: {
            enabled: false
          }
        },

        colors: ['#0004f9', '#f70000'],
        stroke: { width: 1, curve: 'smooth' },
        dataLabels: { enabled: false },
        xaxis: {
          type: 'numeric',
          categories: listTrain?.map(data => data.epoch),
          title: 'epoch',
          labels: {
            hideOverlappingLabels: true,
          }
        },
        yaxis: {
          show: false,
        }
      }}
    />
  )
}

const SimpleLineChart = ({ warning, stepper, infoExp, info }) => {
  const {
    handleSubmit
  } = useForm({})
  const dispatch = useDispatch()
  const dataExp = useSelector((state) => {
    return state.experiment.dataExp
  })
  const onSubmit = () => {
    // if (Object.values(data).every(field => field.length > 0)) {
    stepper.next()
  }
  const [id_paramsconfigs, setId_paramsconfigs] = useState()
  const [statusTrain, setSatus] = useState('training')
  const [disable, setDisable] = useState(true)
  const [listTrain, setListTrain] = useState([])
  const [pretrain, setPreTrain] = useState({
    accuracy: 0,
    lossvalue: 0
  }
  )
  const [train, setTrain] = useState({
    accuracy: 0,
    lossvalue: 0
  }
  )
  const [counter, setCounter] = useState(0)
  const handleStop = () => {
    setCounter(100)
    setDisable(false)
    setSatus('stop')
  }
  const setColor = (color) => {
    switch (color) {
      case 'training': return 'warning'
      case 'done': return 'success'
      case 'stop': return 'danger'
    }
  }
  const setLabel = (label) => {
    switch (label) {
      case 'training': return 'Đang huấn luyện'
      case 'done': return 'Thành công'
      case 'stop': return 'Đã dừng'
    }
  }
  // ** Chart Series
const SaveModel = () => {
  const user = JSON.parse(localStorage.getItem('userData'))
  dispatch(addModelTrainded({
    modelid: infoExp.expmodelid,
    model_trainedcreatorid: user.id,
    model_trainedconfigid: id_paramsconfigs,
    model_trainedexpid: infoExp.expid,
  }))
  setCounter(100)
    setDisable(false)
    setSatus('stop')
}

  useEffect(() => {
    if (counter < 100 && statusTrain === 'training' && infoExp.expstatus !== 1) {
      const interval = setInterval(() => {
        setCounter((prevCounter) => prevCounter + 1)
        const url = process.env.REACT_APP_API_URL
        // console.log(infoExp)
        axios.get(`${url}/experiment/list-paramsconfigs/?id_exp=${infoExp.expid}`).then(response => {
  
          setId_paramsconfigs(response.data[0].configid)
          if (response.data && response.data.length > 0) {
            const id_paramsconfigs = response.data[0].configid

          // console.log(localStorage.getItem("accessToken")})
          axios.get(`${url}/experiment/get-all-traning-results/?id_paramsconfigs=${id_paramsconfigs}`
            , {
              headers: {
                'Content-Type': 'application/json',
                // Authorization: `Bearer ${localStorage.getItem("accessToken")}`
              },

            }).then(response => {
              const list = listTrain
              const data = response.data
              // console.log(response.data)
              // const obj = {
              //   time: moment(new Date()).format('HH:mm:ss'),
              //   accuracy: response.data.accuracy,
              //   lossvalue: response.data.lossvalue
              // }
              // if (response.data.data.status === '0') {
              //   setSatus('done')
              // }
              data.map(item => {
                setPreTrain(train)
                setTrain(item)
                list.push({
                  accuracy: item.accuracy,
                  lossvalue: item.lossvalue,
                  epoch: item.trainresultindex
                })
              })

              setListTrain(list)
              setDisable(false)

            })
          }
        }, 1000)
      })
      return () => clearInterval(interval)
    } else if (statusTrain === 'training') {
      setDisable(true)
    }
  }, [counter, dataExp, statusTrain])
  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Card>
        <CardHeader>
          <div className='d-flex align-items-center flex-wrap mt-sm-0 mt-1'>
            {train &&
              <>
                <h5 className='fw-bold mb-0 me-1'>Accuracy: </h5>
                <Badge className='badge-md' color='light-secondary'>
                  {
                    train.accuracy >= pretrain.accuracy ? <ArrowUp className='text-success me-50' size={15} /> : <ArrowDown className='text-danger me-50' size={15} />
                  }
                  {train.accuracy}
                </Badge>
                <h5 className='fw-bold mb-0 me-1'>Loss value: </h5>
                <Badge className='badge-md' color='light-secondary'>
                  {
                    train.lossvalue >= pretrain.lossvalue ? <ArrowUp className='text-success me-50' size={15} /> : <ArrowDown className='text-danger me-50' size={15} />
                  }
                  {train.lossvalue}
                </Badge>
                <h5 className='fw-bold mb-0 me-1'>Trạng thái: </h5>
                <Badge className='badge-md' color={setColor('done')}>
                  {/* {setLabel(statusTrain)} */}Đã huấn luyện
                </Badge>
              </>
            }

          </div>
        </CardHeader>

        <CardBody>
          <div className='recharts-wrapper'>
            <RenderChart listTrain={listTrain}></RenderChart>
          </div>
          <div className='d-flex justify-content-between'>
            <Button type='button' color='primary' className='btn-prev' onClick={() => stepper.previous()} disabled={disable}>
              <ArrowLeft size={14} className='align-middle me-sm-25 me-0'></ArrowLeft>
              <span className='align-middle d-sm-inline-block d-none'>Cấu hình lại</span>
            </Button>
            <Button type='button' color='danger' className='btn-next' onClick={handleStop} disabled={!disable}>
              <span className='align-middle d-sm-inline-block d-none'>Dừng huấn luyện</span>
              <AlertCircle size={14} className='align-middle ms-sm-25 ms-0'></AlertCircle>
            </Button>
            <Button type='button' color='success' className='btn-next' onClick={SaveModel} disabled={disable}>
              <span className='align-middle d-sm-inline-block d-none'>Lưu mô hình</span>
              <Save size={14} className='align-middle ms-sm-25 ms-0'></Save>
            </Button>
            <Button type='submit' color='primary' className='btn-next' disabled={disable}>
              <span className='align-middle d-sm-inline-block d-none'>Đánh giá</span>
              <ArrowRight size={14} className='align-middle ms-sm-25 ms-0'></ArrowRight>
            </Button>
          </div>
        </CardBody>
      </Card>
    </Form>

  )
}
export default SimpleLineChart
