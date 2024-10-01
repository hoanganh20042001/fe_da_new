// ** React Imports
import { Fragment, useState, useEffect } from 'react'
// ** Custom Components
import { useNavigate } from 'react-router-dom'
import Avatar from '@components/avatar'
import { io } from 'socket.io-client'
// ** Third Party Components
import classnames from 'classnames'
import PerfectScrollbar from 'react-perfect-scrollbar'
import { Bell, AlertTriangle } from 'react-feather'
import axios from 'axios'
import { Badge, DropdownMenu, DropdownItem, DropdownToggle, UncontrolledDropdown } from 'reactstrap'

const NotificationDropdown = () => {
  const [notifications, setNotifications] = useState(0) // Khởi tạo số lượng thông báo là 0
  const [isConnected, setIsConnected] = useState(false)
  const wsUrl = 'ws://127.0.0.1:8000/ws/doctor' // Địa chỉ WebSocket của bạn
  const navigate = useNavigate()
  useEffect(() => {
    const url = process.env.REACT_APP_API_URL
    const fetchCheckCount = async () => {
      try {
        const response = await axios.get(`${url}/checks/checks/count`) // Thay đổi đường dẫn nếu cần
        setNotifications(response.data.count) // Cập nhật số lượng thông báo
      } catch (err) {
        console.error(err)
      }
    }

    fetchCheckCount()
  }, [])

  useEffect(() => {
    const socket = new WebSocket(wsUrl)

    // Khi WebSocket mở kết nối thành công
    socket.onopen = () => {
      console.log('Connected to WebSocket')
      setIsConnected(true)
    }

    // Khi nhận được tin nhắn từ server
    socket.onmessage = (event) => {
      const data = event.data
      console.log('Received notification:', data)
      setNotifications(data) // Cập nhật số lượng thông báo từ WebSocket
    }

    // Khi có lỗi trong kết nối WebSocket
    socket.onerror = (error) => {
      console.error('WebSocket error:', error)
    }

    // Khi kết nối WebSocket bị đóng
    socket.onclose = () => {
      console.log('Disconnected from WebSocket')
      setIsConnected(false)
    }

    // Đóng kết nối WebSocket khi component bị unmount
    return () => {
      socket.close()
    }
  }, [])

  // ** Notification Object
  const notification = {
    avatarIcon: <AlertTriangle size={14} />,
    color: 'light-warning',
    subtitle: 'Bệnh nhân cần được kết luận',
    title: (
      <p className='media-heading'>
        Có <span className='fw-bolder'>{notifications}</span>&nbsp; quân nhân chưa kết luận
      </p>
    )
  }

  // ** Function to render Notifications
  const renderNotificationItems = () => {
    return (
      <PerfectScrollbar
        component='li'
        className='media-list scrollable-container'
        options={{
          wheelPropagation: false
        }}
      >
        <a
          className='d-flex'
          href='/'
          onClick={(e) => {
            e.preventDefault()
            navigate('/apps/detects') // Chuyển hướng mà không reload
          }}
        >
          <div className={classnames('list-item d-flex align-items-start')}>
            <div className='me-1'>
              <Avatar
                icon={notification.avatarIcon}
                color={notification.color}
              />
            </div>
            <div className='list-item-body flex-grow-1'>
              {notification.title}
              <small className='notification-text'>{notification.subtitle}</small>
            </div>
          </div>
        </a>
      </PerfectScrollbar>
    )
  }

  return (
    <UncontrolledDropdown tag='li' className='dropdown-notification nav-item me-25'>
      <DropdownToggle tag='a' className='nav-link' href='/' onClick={(e) => e.preventDefault()}>
        <Bell size={21} />
        <Badge pill color='danger' className='badge-up'>
          {notifications}
        </Badge>
      </DropdownToggle>
      <DropdownMenu end tag='ul' className='dropdown-menu-media mt-0'>
        <li className='dropdown-menu-header'>
          <DropdownItem className='d-flex' tag='div' header>
            <h4 className='notification-title mb-0 me-auto'>Thông báo</h4>
            <Badge tag='div' color='light-primary' pill />
          </DropdownItem>
        </li>
        {renderNotificationItems()}
        <li className='dropdown-menu-footer'>
          {/* <Button color='primary' block>
            Read all notifications
          </Button> */}
        </li>
      </DropdownMenu>
    </UncontrolledDropdown>
  )
}

export default NotificationDropdown
