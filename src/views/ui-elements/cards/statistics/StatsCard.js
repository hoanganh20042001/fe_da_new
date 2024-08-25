// ** Third Party Components
import classnames from 'classnames'
import { User, Heart, Briefcase, Shield, Activity } from 'react-feather'
import { useState, useEffect } from 'react'
import axios from 'axios'
// ** Custom Components
import Avatar from '@components/avatar'

// ** Reactstrap Imports
import { Card, CardHeader, CardTitle, CardBody, CardText, Row, Col } from 'reactstrap'

const StatsCard = ({ cols }) => {
  const [data, setData] = useState([])
  useEffect(() => {
    const url = process.env.REACT_APP_API_URL
    axios.get(`${url}/statistical/users`).then(
      res => {
        const result = res.data.data
        console.log(res.data.data)
        if (Array.isArray(res.data.data)) {
          
          const temp = {
            admin: result.find(item => item.role === 'A')?.count || 0,
            bacsi: result.find(item => item.role === 'D')?.count || 0,
            nhanvien: result.find(item => item.role === 'S')?.count || 0,
            quannhan: result.find(item => item.role === 'P')?.count || 0,
          }
          console.log('Processed Data:', temp)
          setData([
            {
              title: temp.admin,
              subtitle: 'Số admin',
              color: 'light-primary',
              icon: <User size={24} />
            },
            {
              title: temp.bacsi,
              subtitle: 'Số bác sĩ',
              color: 'light-info',
              icon: <Heart size={24} />
            },
            {
              title: temp.nhanvien,
              subtitle: 'Số nhân viên',
              color: 'light-danger',
              icon: <Briefcase size={24} />
            },
             {
            title: temp.quannhan,
            subtitle: 'Số quân nhân',
            color: 'light-success',
            icon: <Shield size={24} />
          }
          ])
        }
      })
  }, [])

  const renderData = () => {
    return data.map((item, index) => {
      const colMargin = Object.keys(cols)
      const margin = index === 2 ? 'sm' : colMargin[0]
      return (
        <Col
          key={index}
          sm="3"
          // {...cols}
          className={classnames({
            [`mb-2 mb-${margin}-0`]: index !== data.length - 1
          })}
        >
          <div className='d-flex align-items-center'>
            <Avatar color={item.color} icon={item.icon} className='me-2' />
            <div className='my-auto'>
              <h4 className='fw-bolder mb-0'>{item.title}</h4>
              <CardText className='font-small-3 mb-0'>{item.subtitle}</CardText>
            </div>
          </div>
        </Col>
      )
    })
  }
  console.log(data)
  return (
    <Card className='card-statistics'>
      <CardHeader>
        <CardTitle tag='h4'>Thống kê</CardTitle>
        {/* <CardText className='card-text font-small-2 me-25 mb-0'>Updated 1 month ago</CardText> */}
      </CardHeader>
      <CardBody className='statistics-body'>
        {
          data && <Row>{renderData()}</Row>
        }
        
      </CardBody>
    </Card>
  )
}

export default StatsCard
