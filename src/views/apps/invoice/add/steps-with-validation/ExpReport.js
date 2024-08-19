// ** React Imports
import { Fragment, useState, useEffect } from 'react'

// ** Third Party Components
import { useForm } from 'react-hook-form'
import { ArrowRight } from 'react-feather'
import axios from 'axios'

// ** Reactstrap Imports
import { Row, Col, Button, Form } from 'reactstrap'

// ** Styles
import '@styles/react/libs/react-select/_react-select.scss'

const ExpReport = ({ stepper }) => {
  // ** State
  const [report, setReport] = useState(null)
  // const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  // ** Fetch report data
  useEffect(() => {
    const url = process.env.REACT_APP_API_URL
    axios({
      url: `${url}/experiment/get_inforview/`,
      method: 'GET',
      responseType: 'json', // Assuming the API returns JSON data
    })
      .then((response) => {
        console.log('Report: ', response.data)
        setReport(response.data)
        // console.log("Report: ", typeof response, response)
        // setLoading(false)
      })
      .catch((error) => {
        console.error('Error fetching report:', error)
        setError(error)
        // setLoading(false)
      })
  }, [])
  // ** Form handling
  const { handleSubmit } = useForm()
  const onSubmit = () => {
    stepper.next()
  }

  // ** Render loading, error, and report content
  return (
    <Fragment>
      <div>
        <Row>
          <Col className='p-0' xl='8'>
            <div className='content-header'>
              <h5 className='mb-0'>Tổng quan bài thí nghiệm</h5>
            </div>
          </Col>
        </Row>
      </div>

      {/* {loading && <p>Loading...</p>} */}
      {/* {error && <p>Error: {error.message}</p>} */}
      {report && (
        <div>
          <p>Tên bài thí nghiệm: {report.configexpid__expname}</p>
          <p>ID bài thí nghiệm: {report.configexpid__expid}</p>
          <p>Thời gian tạo: {report.configexpid__expcreatedtime}</p>
          <p>Người tạo : {report.configexpid__expcreatorid__name}</p>
          <p>Bộ dữ liệu được sử dụng: {report.configexpid__expdatasetid__datasetname}</p>
          {/* <p>Testing Dataset Name: {report.testingresult.resulttestingdataset__datasetname}</p> */}
          {/* <p>Testing Dataset Accuracy: {report.testingresult.resultaccuracy}</p> */}
          {/* <h2>Training Results:</h2> */}
          {/* <ul>
            {report.trainresult.map((result, index) => (
              <li key={index}>
                Index: {result.trainresultindex}, Loss: {result.lossvalue}, Accuracy: {result.accuracy}
              </li>
            ))}
          </ul> */}
        </div>
      )}

      <Form onSubmit={handleSubmit(onSubmit)}>
        <div className='d-flex justify-content-end'>
          <Button type='submit' color='primary' className='btn-next'>
            <span className='align-middle d-sm-inline-block d-none'>Tiếp theo</span>
            <ArrowRight size={14} className='align-middle ms-sm-25 ms-0' />
          </Button>
        </div>
      </Form>
    </Fragment>
  )
}

export default ExpReport
