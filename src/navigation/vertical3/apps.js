// ** Icons Import
import { Book, Box, Cpu, Monitor, BarChart2, Circle, ShoppingCart, User, Shield, Activity, Database, Users, Home, Clock, Heart } from 'react-feather'

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
    id: 'dataLibs',
    title: 'Bệnh lý',
    icon: <Activity size={20} />,
    navLink: '/apps/libs'
  },
  {
    id: 'dataApp',
    title: 'Quân nhân',
    icon: <Shield size={20} />,
    navLink: '/apps/data/list'
  },
  
  {
    id: 'invoiceEdit',
    title: 'Lịch sử chẩn đoán',
    icon: <Clock size={12} />,
    navLink: '/apps/histories'
  },
 

]
