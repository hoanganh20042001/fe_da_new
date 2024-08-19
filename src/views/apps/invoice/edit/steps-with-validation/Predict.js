

// ** React Imports
import { useState, Fragment } from 'react'
import { useSelector } from 'react-redux'
// ** Reactstrap Imports
import { Card, CardHeader, CardTitle, CardBody, Button, ListGroup, Label, Row, Col, Form, Input } from 'reactstrap'
import { useForm, Controller } from 'react-hook-form'

// ** Third Party Imports
import { useDropzone } from 'react-dropzone'
import { FileText, X, DownloadCloud, ArrowRight, ArrowLeft } from 'react-feather'
import axios from 'axios'
import FormData from 'form-data'
const Predict = ({ stepper, infoExp, info }) => {
  const {
    control,
    setError,
    handleSubmit,
    formState: { errors }
  } = useForm({})
  // ** State
  const [files, setFiles] = useState([])
  const [files1, setFiles1] = useState()
  const [displayOutput, setDisplayOutput] = useState(1)
  const [detail, setDetail] = useState('')
  const [acc, setAcc] = useState('')
  const [display, setDisplay] = useState('block')
  const [display1, setDisplay1] = useState('block')
  const [url, setUrl] = useState()
  const { getRootProps, getInputProps } = useDropzone({
    multiple: false,
    onDrop: acceptedFiles => {
      setFiles([...files, ...acceptedFiles.map(file => Object.assign(file))])
    }
  })
  const dataExp = useSelector((state) => {
    return state.experiment.dataExp
  })
  const DowLoadReport = () => {
    const url = process.env.REACT_APP_API_URL
    axios({
      url: `${url}/download-report/?configID=96`,
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
  const onSubmit = data => {
    // up anh
    const url = process.env.REACT_APP_API_URL
    const data1 = new FormData()
    data1.append('file', files)
    const data2 = new FormData()
    data2.append('file', files1)
    console.log(infoExp)
    if (infoExp.expsoftwarelibid === 1) {
      axios.post(`${url}/upload-file/`, data1
      , {
        headers: {
          'Content-Type': 'multipart/form-data',
          // Authorization: `Bearer ${localStorage.getItem("accessToken")}`
        },
      }).then(res => {
        const temp = res.data
        const inputpath1 = temp.data
        axios.post(`${url}/upload-file/`, data2
        , {
          headers: {
            'Content-Type': 'multipart/form-data',
            // Authorization: `Bearer ${localStorage.getItem("accessToken")}`
          },
        }).then(res => {
          const temp = res.data
          const inputpath2 = temp.data
          console.log(infoExp)
          axios.get(`${url}/experiment/predict/?id_paramsconfigs=${info.configid}&input_path1=${inputpath1}&input_path2=${inputpath2}&data_type=image`
          , {
            headers: {
              'Content-Type': 'application/json',
              // Authorization: `Bearer ${localStorage.getItem("accessToken")}`
            },

          }).then(response => {
            const temp = response.data
            const id = temp.predictid
            axios.get(`${url}/experiment/get_predict_result/?id_predict=${id}`
            , {
              headers: {
                'Content-Type': 'application/json',
                // Authorization: `Bearer ${localStorage.getItem("accessToken")}`
              },

            }).then(response => {
              const temp = response.data.data.data.outputpath

              if (temp === null) { 
                setDisplayOutput(2) 
              } else {
                setDisplayOutput(3) 

                const path = url + temp?.slice(1, temp.length) + response.data.data.result[0]
                setUrl(path)
              }
             
            })
          })
        })
      }).catch(err => console.log('loi'))
    } else if (infoExp.expsoftwarelibid === 2 || infoExp.expsoftwarelibid === 3) {
      axios.post(`${url}/upload-file/`, data1
      , {
        headers: {
          'Content-Type': 'multipart/form-data',
          // Authorization: `Bearer ${localStorage.getItem("accessToken")}`
        },
      }).then(res => {
        const temp = res.data
        const inputpath1 = temp.data
          axios.get(`${url}/experiment/predict/?id_paramsconfigs=${info.configid}&input_path1=${inputpath1}&data_type=image`
          , {
            headers: {
              'Content-Type': 'application/json',
              // Authorization: `Bearer ${localStorage.getItem("accessToken")}`
            },

          }).then(response => {
            const temp = response.data
            const id = temp.predictid
            setTimeout(() => {
              axios.get(`${url}/experiment/get_predict_result/?id_predict=${id}`
                , {
                  headers: {
                    'Content-Type': 'application/json',
                    // Authorization: `Bearer ${localStorage.getItem("accessToken")}`
                  },
    
                }).then(response => {
                  const temp = response.data.data.data.outputpath
                  if (temp === null) { 
                    setDisplayOutput(2) 
                  } else {
                    const temp = response.data.data.data.outputpath
                    const path = url + temp?.slice(1, temp.length) + response.data.data.result[0]
                    console.log(path)
                    setDetail(response.data.data.data.details)
      
                      setAcc(response.data.data.data.accuracy)
                  }
                 
                })
            }, 5000)
            
        })
      }).catch(err => console.log('loi'))
    }
  }
  const handleRemoveAllFiles = () => {
    setFiles([])
    setDisplay('block')
    setDisplay1('block')
  }
  if (infoExp.expsoftwarelibid === 1) {
    return (
      <Card>
        <div className='content-header'>
        <h5 className='mb-0'>Dự đoán</h5>
      </div>
        <CardHeader>
        </CardHeader>
        <CardBody>
            <Col md={12} xs={12}>
              <Label className='form-label' for='salary' >
                Chọn ảnh gốc <span style={{color: 'red'}}>*</span>
              </Label>
              <Input type='file' id='salary' onChange={(e) => setFiles(e.target.files[0])} />
            </Col>
            <Col md={12} xs={12}>
              <Label className='form-label' for='salary' >
                Chọn ảnh kiểm tra <span style={{color: 'red'}}>*</span>
              </Label>
              <Input type='file' id='salary' onChange={(e) => setFiles1(e.target.files[0])} />
            </Col>
                <Row>
                  <Col className='d-flex align-items-center justify-content-center mb-2 mb-md-0' md='6' xs='12'>

                    <div className='d-flex align-items-center justify-content-center'>
                      {
                        displayOutput === 1 ? <></> : displayOutput === 2 ? <p>Không có kết quả</p> :   <img className='img-fluid product-img' src={url} alt={'ảnh đầu ra'} />
                      }
                    
                    </div>
                  </Col>
                </Row>

              <div className='d-flex justify-content-end'>
                <Form onSubmit={handleSubmit(onSubmit)}>
                  <Button type='submit' color='primary' disabled={files === undefined || files1 === undefined}>Kiểm tra</Button>
                </Form>
              </div>
          <div className='d-flex justify-content-between' style={{ marginTop: '20px' }}>
            <Button type='button' color='primary' className='btn-prev' onClick={() => stepper.previous()}>
              <ArrowLeft size={14} className='align-middle me-sm-25 me-0'></ArrowLeft>
              <span className='align-middle d-sm-inline-block d-none'>Quay lại</span>
            </Button>
            <Button type='button' color='primary' className='btn-next' onClick={(e) => DowLoadReport()} disabled={files === undefined || files1 === undefined}>
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
        <Col md={12} xs={12}>
              <Label className='form-label' for='salary' >
                Chọn video <span style={{ color: 'red' }}>*</span>
              </Label>
              <Input type='file' id='salary' onChange={(e) => setFiles(e.target.files[0])} />
            </Col>
            <Row>
                  <Col className='d-flex align-items-center justify-content-center mb-2 mb-md-0' md='6' xs='12'>
                    <div className='d-flex align-items-center justify-content-center'>
                    </div>
                  </Col>
                  <p><a href={url} target='_blank'>Link download video kết quả</a> </p>

                  <p>Chi tiết: {detail} </p>
                  <p>confident score: {acc}</p>

                </Row>
          <div className='d-flex justify-content-between' style={{ marginTop: '20px' }}>
            <Button type='button' color='primary' className='btn-prev' onClick={() => stepper.previous()}>
              <ArrowLeft size={14} className='align-middle me-sm-25 me-0'></ArrowLeft>
              <span className='align-middle d-sm-inline-block d-none'>Quay lại</span>
            </Button>
          
            <div className='d-flex justify-content-end'>
                <Form onSubmit={handleSubmit(onSubmit)}>
                  <Button type='submit' color='primary' disabled={files === undefined}>Kiểm tra</Button>
                </Form>
              </div>
            <Button type='button' color='primary' className='btn-next' onClick={() => DowLoadReport()} disabled={files === undefined}>
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
        <Col md={12} xs={12}>
              <Label className='form-label' for='salary' >
                Chọn ảnh kiểm tra <span style={{ color: 'red' }}>*</span>
              </Label>
              <Input type='file' id='salary' onChange={(e) => setFiles(e.target.files[0])} accept=".png, .jpg, .jpeg"/>
            </Col>
                <Row>
                  <Col className='d-flex align-items-center justify-content-center mb-2 mb-md-0' md='6' xs='12'>
                    <div className='d-flex align-items-center justify-content-center'>
                      <img className='img-fluid product-img' src={url} alt={'ảnh đầu ra'} />
                    </div>
                  </Col>

                </Row>

              <div className='d-flex justify-content-end'>
                <Form onSubmit={handleSubmit(onSubmit)}>
                  <Button type='submit' color='primary' disabled={files === undefined}>Kiểm tra</Button>
                </Form>
              </div>
          <div className='d-flex justify-content-between' style={{ marginTop: '20px' }}>
            <Button type='button' color='primary' className='btn-prev' onClick={() => stepper.previous()}>
              <ArrowLeft size={14} className='align-middle me-sm-25 me-0'></ArrowLeft>
              <span className='align-middle d-sm-inline-block d-none'>Quay lại</span>
            </Button>
            <Button type='button' color='primary' className='btn-next' onClick={(e) => DowLoadReport()} disabled={files === undefined || files1 === undefined}>
              <span className='align-middle d-sm-inline-block d-none'>Xuất và Lưu báo cáo</span>
            </Button>
          </div>
        </CardBody>
      </Card>
    )
  }

}

export default Predict

