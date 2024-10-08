// ** Third Party Components
import Chart from 'react-apexcharts'
import axios from 'axios'
import { useState, useEffect } from 'react'
// ** Reactstrap Imports
import { Card, CardTitle, CardText, CardBody, Row, Col } from 'reactstrap'

const Earnings = ({ success }) => {
  const [list, setList] = useState([])
  const [data, setData] = useState([])

  useEffect(() => {
    const url = process.env.REACT_APP_API_URL
    axios.get(`${url}/statistical/checks/`)
      .then(responsive => {
        const list = []
        const temp = responsive?.data
        console.log(temp)
        setData(responsive?.data)
      })
  }, [])
  useEffect(() => {
    if (data.length > 0) {
      const list = data.map(item => item.number)
      setList(list)
    }
  }, [data])
  const options = {
    chart: {
      toolbar: {
        show: false
      }
    },
    dataLabels: {
      enabled: false
    },
    legend: { show: false },
    labels: ['Quân nhân bị bệnh', 'Quân nhân chưa được khám', 'Quân nhân bình thường'],
    stroke: { width: 0 },
    colors: ['#DC3545', '#FFC107', success],
    grid: {
      padding: {
        right: -20,
        bottom: -8,
        left: -20
      }
    },
    plotOptions: {
      pie: {
        startAngle: -10,
        donut: {
          labels: {
            show: true,
            name: {
              offsetY: 15
            },
            value: {
              offsetY: -15,
              formatter(val) {
                return `${parseInt(val)}`
              }
            },
          }
        }
      }
    },
    responsive: [
      {
        breakpoint: 1325,
        options: {
          chart: {
            height: 100
          }
        }
      },
      {
        breakpoint: 1200,
        options: {
          chart: {
            height: 120
          }
        }
      },
      {
        breakpoint: 1065,
        options: {
          chart: {
            height: 100
          }
        }
      },
      {
        breakpoint: 992,
        options: {
          chart: {
            height: 120
          }
        }
      }
    ]
  }

  return (
    <Card className='earnings-card'>
      <CardBody>
        <Row>
          <Col xs='12'>
            <CardTitle className='mb-1'>Số quân nhân khám bệnh</CardTitle>
            {/* <div className='font-small-2'>This Month</div> */}
            {/* <h5 className='mb-1'>$4055.56</h5> */}
            <CardText className='text-muted font-small-2'>
              {/* <span className='fw-bolder'>68.2%</span> */}
              {/* <span> more earnings than last month.</span> */}
            </CardText>
          </Col>
          <Col xs='12'>
            {
              console.log(list)
            }
            {
              list && <Chart options={options} series={list} type='donut' height={320} />
            }
          </Col>
        </Row>
      </CardBody>
    </Card>
  )
}

export default Earnings
