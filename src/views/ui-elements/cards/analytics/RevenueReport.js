// ** React Imports
import { useEffect, useState } from 'react'

// ** Third Party Components
import axios from 'axios'
import Chart from 'react-apexcharts'

// ** Reactstrap Imports
import {
  Row,
  Col,
  Card,
  Button,
  CardTitle,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
  UncontrolledButtonDropdown
} from 'reactstrap'

const RevenueReport = props => {
  // ** State
  const [revenueOptions, setOption] = useState({})
  const [data, setData] = useState([])
  const [list, setList] = useState([])
  const [cate, setCate] = useState([])
  // const [option, setOption] = useState({})

  // Fetch data from API
  useEffect(() => {
    const url = process.env.REACT_APP_API_URL
    axios.get(`${url}/statistical/disases/`).then(res => {
      setData(res.data) // Set fetched data
      console.log(res.data)
    })
  }, []) // Empty dependency ensures it only runs on mount

  // Update list and cate when `data` changes
  useEffect(() => {
    const newList = []
    const newCate = []
    data.forEach(item => {
      newList.push(item.disease_name)
      newCate.push(item.patient_count)
    })
    setList(newList) // Set list of disease names
    setCate(newCate) // Set list of patient counts
  }, [data]) // Dependency on `data` ensures it runs after `data` is updated

  // Update chart options when `list`, `cate`, or props change
  useEffect(() => {
    if (list.length > 0 && cate.length > 0) {
      setOption({
        chart: {
          stacked: true,
          type: 'bar',
          toolbar: { show: false }
        },
        grid: {
          padding: {
            top: -20,
            bottom: -10
          },
          yaxis: {
            lines: { show: false }
          }
        },
        xaxis: {
          categories: list, // Use `list` as categories (disease names)
          labels: {
            hideOverlappingLabels: true,
            style: {
              colors: '#b9b9c3',
              fontSize: '0.86rem'
            }
          },
          axisTicks: {
            show: false
          },
          axisBorder: {
            show: false
          }
        },
        legend: {
          show: false
        },
        dataLabels: {
          enabled: false
        },
        colors: [props.primary, props.warning],
        plotOptions: {
          bar: {
            columnWidth: '10%',
            borderRadius: [5]
          },
          distributed: true
        },
        yaxis: {
          labels: {
            style: {
              colors: '#b9b9c3',
              fontSize: '0.5rem'
            }
          }
        }
      })
    }
  }, [list, cate, props.primary, props.warning])

  return data !== null ? (
    <Card className='card-revenue-budget'>
      <Row className='mx-0'>
        <Col className='revenue-report-wrapper' md='12' xs='12'>
          <div className='d-sm-flex justify-content-between align-items-center mb-3'>
            <CardTitle className='mb-50 mb-sm-0'>Thống kê số bệnh hay gặp</CardTitle>
          </div>
          {
            data && <Chart id='revenue-report-chart' height='380' options={revenueOptions} series={[
              {
                name: 'Earning',
                data: cate
              }
            ]} />
          }

        </Col>
      </Row>
    </Card>
  ) : null
}

export default RevenueReport
