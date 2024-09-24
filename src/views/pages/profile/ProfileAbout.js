// ** Reactstrap Imports
import { Fragment, useState, forwardRef, useEffect } from 'react'
import { Card, CardBody, CardText, Modal, ModalBody, ModalHeader, Input, Col, Row } from 'reactstrap'
import { getListUser, updateUser, deleteUser, addUser } from '@store/action/profile'
import { useSelector, useDispatch } from 'react-redux'
import { toDateStringFormat1, toDateString } from '@utils'

const ProfileAbout = ({ data }) => {

  return (
    <Card style={{ margin: 'auto', paddingLeft: '50px', paddingRight: '50px' }}>
      <CardBody >
        <Row tag='form' className='gy-1 pt-75'>
          <div className='mt-2'>
            <h5 className='mb-75'>Họ và tên: </h5>
            <Input value={data?.full_name} readOnly={true} style={{ opacity: '1' }}></Input>

          </div>
          <div className='mt-2'>
            <h5 className='mb-75'>Ngày sinh: </h5>
            <Input value={toDateStringFormat1(data?.date_birth)} readOnly={true} style={{ opacity: '1' }}></Input>

          </div>
          <div className='mt-2'>
            <h5 className='mb-75'>Giới tính: </h5>
            <Input value={data?.sex === true ? 'Nam' : 'Nữ'} readOnly={true} style={{ opacity: '1' }}></Input>

          </div>
          <Col md={12} xs={12}>
            <div className='mt-2'>
              <h5 className='mb-75'>Email: </h5>
              <Input value={data?.email} readOnly={true} style={{ opacity: '1' }}></Input>

            </div>
          </Col>
          <Col md={6} xs={12}>
            <div className='mt-2'>
              <h5 className='mb-75'>Quân hàm: </h5>
              <Input value={data?.rank} readOnly={true} style={{ opacity: '1' }}></Input>

            </div>
          </Col>
          <Col md={6} xs={12}>
            <div className='mt-2'>
              <h5 className='mb-75'>Chức vụ: </h5>
              <Input value={data?.position} readOnly={true} style={{ opacity: '1' }}></Input>

            </div>
          </Col>
          <Col md={6} xs={12}>
            <div className='mt-2'>
              <h5 className='mb-75'>Đơn vị: </h5>
              <Input value={data?.unit_id} readOnly={true} style={{ opacity: '1' }}></Input>

            </div>
          </Col>
          <Col md={6} xs={12}>
            <div className='mt-2'>
              <h5 className='mb-75'>Loại tài khoản: </h5>
              <Input value={data?.role_id === 'A' ? 'Admin' : data?.role_id === 'D' ? 'Bác sĩ' : 'Nhân viên'} readOnly={true} style={{ opacity: '1' }}></Input>

            </div>
          </Col>
        </Row>
      </CardBody>
    </Card>
  )
}

export default ProfileAbout
