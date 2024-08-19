

// ** React Imports
import { useState, Fragment } from 'react'

// ** Reactstrap Imports
import { Card, CardHeader, CardTitle, CardBody, Button, ListGroup, ListGroupItem, Row, Col, Form } from 'reactstrap'
import { useForm, Controller } from 'react-hook-form'

// ** Third Party Imports
import { useDropzone } from 'react-dropzone'
import { FileText, X, DownloadCloud, ArrowRight, ArrowLeft } from 'react-feather'
import axios from 'axios'

const Predict = ({ stepper, infoExp, info }) => {
  const {
    control,
    setError,
    handleSubmit,
    formState: { errors }
  } = useForm({})
  // ** State
  const [files, setFiles] = useState([])
  const [files1, setFiles1] = useState([])
  const [display, setDisplay] = useState('block')
  const [display1, setDisplay1] = useState('block')
  const [displayOutput, setDisplayOutput] = useState(1)
  const [result, setResult] = useState(null)
  const [url, setUrl] = useState()
  const { getRootProps, getInputProps } = useDropzone({
    multiple: false,
    onDrop: acceptedFiles => {
      setFiles([...files, ...acceptedFiles.map(file => Object.assign(file))])
    }
  })
  // const DowLoadReport = () => {
    
  //   const url = process.env.REACT_APP_API_URL
  //   axios({
  //     url: `${url}/download-report/?configID=96`,
  //     method: 'GET',
  //     responseType: 'blob', // important
  //   }).then((response) => {
  //     // console.log('response.data: ', response.data)
  //     const url = window.URL.createObjectURL(new Blob([response.data]))
  //     const link = document.createElement('a')
  //     link.href = url
  //     link.setAttribute('download', 'report.docx')
  //     document.body.appendChild(link)
  //     link.click()
  //   })

  // }
  const DowLoadReport = () => {
    const url = process.env.REACT_APP_API_URL
    axios({
      url: `${url}/download-report/?configID=${info.configid}`,
      method: 'GET',
      responseType: 'blob', // important
    }).then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', 'report.docx')
      document.body.appendChild(link)
      link.click()
    })
    
  }

const handlePredict = async () => {
  const url0 = process.env.REACT_APP_API_URL

  // Ensure files variable is defined and has at least one element
  if (!files || files.length === 0) {
    console.error('No files available')
    return
  }

  try {
    const file = files[0]
    console.log(file)

    // Create FormData to handle file upload
    const formData = new FormData()
    formData.append('file', file)

    // First axios call to upload file
    const uploadResponse = await axios.post(`${url0}/upload-file/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'X-CSRFToken': 'ok8R4BzmhzHioGaA4DIRbsnHbG8tBnPeYUHFk8NFNx5Pbd3oi5l5hyNvhLU8mHOp',
      },
    })

    const input_path = uploadResponse.data.data// Assuming response0.data is the input path string
    console.log('input', info.configid)

    // Second axios call to get predicted_id
    const response = await axios({
      url: `${url0}/experiment/predict/?id_paramsconfigs=${info.configid}&input_path1=${input_path}&data_type=image`,
      method: 'GET',
      //responseType: 'blob', // important
    })

    const predicted_id = response.data["predictid"] // Assuming response.data is an object with predictid property
    console.log('predicted_id', predicted_id)

    // Third axios call to get prediction result
    // const response2 = await axios({
    //   url: `${url}/experiment/get_predict_result/?id_predict=${predicted_id}`,
    //   method: 'GET',
    //   // responseType: 'blob', // important
    // })

    // console.log("response2: ", response2)
    // setResult(response2.data)
    setTimeout(() => {
      axios.get(`${url0}/experiment/get_predict_result/?id_predict=${predicted_id}`
        , {
          headers: {
            'Content-Type': 'application/json',
            // Authorization: `Bearer ${localStorage.getItem("accessToken")}`
          },
  
        }).then(response => {
          // console.log(response.data.data.data)
          const temp = response.data.data.data.outputpath
          // setResult(temp)
          // console.log(response.data.message)
          if (temp === null) {
            setDisplayOutput(2)
            console.log(displayOutput)
          } else {
            setDisplayOutput(3)
            const path = url0 + temp?.slice(1, temp.length) + response.data.data.result[0]
            setUrl(path)
            // console.log(path)
            // console.log(url)
          }
        })

    }, 5000)
    
  } catch (error) {
    console.error('There was an error fetching the prediction data!', error)
  }
}

  const renderFilePreview = file => {
    if (file.type.startsWith('image')) {
      return (
        <Row className='my-2'>
          <Col className='d-flex align-items-center justify-content-center mb-2 mb-md-0' md='6' xs='6'>
            <div className='d-flex align-items-center justify-content-center'>
              <img className='img-fluid product-img' src={URL.createObjectURL(file)} alt={'ảnh test'} />
            </div>
          </Col>
        </Row>
      )
    } else {
      return <FileText size='28' />
    }
  }

  const fileList = files.map((file, index) => (
    <ListGroupItem key={`${file.name}-${index}`} className='d-flex align-items-center justify-content-between'>
      <div className='file-details d-flex align-items-center'>
        <div className='file-preview me-1'>{renderFilePreview(file)}</div>
      </div>
    </ListGroupItem>
  ))
  const onSubmit = data => {
    const url = process.env.REACT_APP_API_URL
    axios.get(`${url}/experiment/get_predict_result/?id_predict=6`
      , {
        headers: {
          'Content-Type': 'application/json',
          // Authorization: `Bearer ${localStorage.getItem("accessToken")}`
        },

      }).then(response => {
        
        const temp = response.data.data.data.outputpath

        if (response.data.message === "Output is Null") {
          setDisplayOutput(2)
          // setResult(response.data.message)
        } else {
          setDisplayOutput(3)
          setResult(temp)
          const path = url + temp?.slice(1, temp.length) + response.data.data.result[0]
          setUrl(path)
          
        }
      })

  }
  const handleRemoveAllFiles = () => {
    setFiles([])
    setDisplay('block')
    setDisplay1('block')
  }
  if (infoExp.expsoftwarelibid === 1) {
    return (
      <Card>
        <CardHeader>
        </CardHeader>
        <CardBody>
          <div {...getRootProps({ className: 'dropzone' })} style={{ display: display }}>
            <input {...getInputProps()} />
            <div className='d-flex align-items-center justify-content-center flex-column'>
              <DownloadCloud size={64} />
              <h5>Chọn ảnh khuôn mặt</h5>
              <p className='text-secondary'>
                Drop files here or click{' '}
                <a href='/' onClick={e => {
                  e.preventDefault()
                  setDisplay('none')
                }}>
                  browse
                </a>{' '}
                thorough your machine
              </p>
            </div>
          </div>
          
          <div {...getRootProps({ className: 'dropzone' })} style={{ display: display1 }}>
            <input {...getInputProps()} />
            <div className='d-flex align-items-center justify-content-center flex-column'>
              <DownloadCloud size={64} />
              <h5>Chọn ảnh phát hiện khuôn mặt</h5>
              <p className='text-secondary'>
                Drop files here or click{' '}
                <a href='/' onClick={e => {
                  e.preventDefault()
                  setDisplay1('none')
                }}>
                  browse
                </a>{' '}
                thorough your machine
              </p>
            </div>
          </div>
          
          {files.length ? (
            <Fragment>
              <ListGroup className='my-2'>{fileList}</ListGroup>
              {
                
                <Row>
                  <Col className='d-flex align-items-center justify-content-center mb-2 mb-md-0' md='6' xs='12'>
                    <div className='d-flex align-items-center justify-content-center'>
                      {
                        displayOutput === 1 ? <></> : displayOutput === 2 ? <p>Không có kết quả</p> : <img className='img-fluid product-img' src={url} alt={'ảnh đầu ra'} />
                      }
                      
                    </div>
                  </Col>
                </Row>
              }

              <div className='d-flex justify-content-end'>
                <Form onSubmit={handleSubmit(onSubmit)}>
                  <Button className='me-1' color='danger' outline onClick={handleRemoveAllFiles}>
                    Xoá tất cả
                  </Button>
                </Form>
              </div>
            </Fragment>
          ) : null}
          
          <div className='d-flex justify-content-between' style={{ marginTop: '20px' }}>
            <Button type='button' color='primary' className='btn-prev' onClick={() => stepper.previous()}>
              <ArrowLeft size={14} className='align-middle me-sm-25 me-0'></ArrowLeft>
              <span className='align-middle d-sm-inline-block d-none'>Quay lại</span>
            </Button>
            <Button type='button' color='primary' className='btn-prev' onClick={handlePredict}>
              <span className='align-middle d-sm-inline-block d-none'>Dự đoán</span>
            </Button>
            <Button type='button' color='primary' className='btn-next' onClick={() => DowLoadReport()}>
              <span className='align-middle d-sm-inline-block d-none'>Xuất và Lưu báo cáo</span>
            </Button>
          </div>
        </CardBody>
      </Card >
    )
  } else if (infoExp.expsoftwarelibid === 2) {
    return (
      <Card>
        <CardHeader>
        </CardHeader>
        <CardBody>
          <div {...getRootProps({ className: 'dropzone' })} style={{ display: display }}>
            <input {...getInputProps()} />
            <div className='d-flex align-items-center justify-content-center flex-column'>
              <DownloadCloud size={64} />
              <h5>Chọn video phát hiện hành động</h5>
              <p className='text-secondary'>
                Drop files here or click{' '}
                <a href='/' onClick={e => e.preventDefault()}>
                  browse
                </a>{' '}
                thorough your machine
              </p>
            </div>
          </div>
          {files.length ? (
            <Fragment>
              <ListGroup className='my-2'>{fileList}</ListGroup>
              {
                 
                <Row>
                  <Col className='d-flex align-items-center justify-content-center mb-2 mb-md-0' md='6' xs='12'>
                    <div className='d-flex align-items-center justify-content-center'>
                      {
                        displayOutput === 1 ? <></> : displayOutput === 2 ? <p>Không có kết quả</p> : <img className='img-fluid product-img' src={url} alt={'ảnh đầu ra'} />
                      }
                    </div>
                  </Col>
                </Row>
              }
              <div className='d-flex justify-content-end'>
                <Form onSubmit={handleSubmit(onSubmit)}>
                  <Button className='me-1' color='danger' outline onClick={handleRemoveAllFiles}>
                    Xoá tất cả
                  </Button>
                </Form>
              </div>
            </Fragment>
          ) : null}
          
          <div className='d-flex justify-content-between' style={{ marginTop: '20px' }}>
            <Button type='button' color='primary' className='btn-prev' onClick={() => stepper.previous()}>
              <ArrowLeft size={14} className='align-middle me-sm-25 me-0'></ArrowLeft>
              <span className='align-middle d-sm-inline-block d-none'>Quay lại</span>
            </Button>
            <Button type='button' color='primary' className='btn-prev' onClick={handlePredict}>
              <span className='align-middle d-sm-inline-block d-none'>Dự đoán</span>
            </Button>
            <Button type='button' color='primary' className='btn-next' onClick={() => DowLoadReport()}>
              <span className='align-middle d-sm-inline-block d-none'>Xuất và Lưu báo cáo</span>
            </Button>
          </div>
        </CardBody>
      </Card>
    )
  } else {
    return (
      <Card>
        <CardHeader>
        </CardHeader>
        <CardBody>
          <div {...getRootProps({ className: 'dropzone' })} style={{ display: display }}>
            <input {...getInputProps()} />
            <div className='d-flex align-items-center justify-content-center flex-column'>
              <DownloadCloud size={64} />
              <h5>Chọn ảnh phát hiện khuôn mặt</h5>
              <p className='text-secondary'>
                Drop files here or click{' '}
                <a href='/' onClick={e => e.preventDefault()}>
                  browse
                </a>{' '}
                thorough your machine
              </p>
            </div>
          </div>
          {files?.length ? (
            <Fragment>
              <ListGroup className='my-2'>{fileList}</ListGroup>
              <Row>
                  <Col className='d-flex align-items-center justify-content-center mb-2 mb-md-0' md='6' xs='12'>
                    <div className='d-flex align-items-center justify-content-center'>
                      {
                        displayOutput === 1 ? <></> : displayOutput === 2 ? <p>Không có kết quả</p> : <img className='img-fluid product-img' src={url} alt={'ảnh đầu ra'} />
                      }
                    </div>
                    
                  </Col>
              </Row>
              {/* {
                url &&
                <Row>
                  <Col className='d-flex align-items-center justify-content-center mb-2 mb-md-0' md='6' xs='12'>
                    <div className='d-flex align-items-center justify-content-center'>
                      {
                        displayOutput === 1 ? <></> : displayOutput === 2 ? <p>Không có kết quả</p> : <img className='img-fluid product-img' src={url} alt={'ảnh đầu ra'} />
                      }
                    </div>
                  </Col>
                </Row>
              } */}
              <div className='d-flex justify-content-end'>
                <Form onSubmit={handleSubmit(onSubmit)}>
                  <Button className='me-1' color='danger' outline onClick={handleRemoveAllFiles}>
                    Xoá tất cả
                  </Button>
                </Form>
              </div>
            </Fragment>
          ) : null}
          
          <div className='d-flex justify-content-between' style={{ marginTop: '20px' }}>
            <Button type='button' color='primary' className='btn-prev' onClick={() => stepper.previous()}>
              <ArrowLeft size={14} className='align-middle me-sm-25 me-0'></ArrowLeft>
              <span className='align-middle d-sm-inline-block d-none'>Quay lại</span>
            </Button>
            <Button type='button' color='primary' className='btn-prev' onClick={handlePredict}>
              <span className='align-middle d-sm-inline-block d-none'>Dự đoán</span>
            </Button>
            <Button type='button' color='primary' className='btn-next' onClick={() => DowLoadReport()}>
              <span className='align-middle d-sm-inline-block d-none'>Xuất và Lưu báo cáo</span>
            </Button>
          </div>
        </CardBody>
      </Card>
    )
  }

}

export default Predict

