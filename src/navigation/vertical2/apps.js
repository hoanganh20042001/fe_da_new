// ** Icons Import
import { Book, Box, Cpu, Monitor, BarChart2, Circle, ShoppingCart, User, Shield, Activity, Database, Users, Home, Clock, Heart, Upload, UploadCloud } from 'react-feather'

export default [
  {
    id: 'stastic',
    title: 'Thống kê',
    icon: <BarChart2 size={20} />,
    navLink: '/dashboard/ecommerce'
  },
  {
    id: 'dataUnits',
    title: 'Đơn vị',
    icon: <Home size={20} />,
    navLink: '/apps/units'
  },
  {
    id: 'dataAcount',
    title: 'Người dùng',
    icon: <Users size={20} />,
    navLink: '/apps/account'
  },
  // {
  //   id: 'dataApp',
  //   title: 'Quân nhân',
  //   icon: <Shield size={20} />,
  //   navLink: '/apps/data/list'
  // },
  
  {
    id: 'dataModel',
    title: 'Lịch sử đăng nhập',
    icon: <Clock size={20} />,
    navLink: '/apps/test1'
  },
  {
    id: 'dataModel',
    title: 'Sao lưu dữ liệu',
    icon: <Database size={20} />,
    navLink: '/apps/test'
  },

]
