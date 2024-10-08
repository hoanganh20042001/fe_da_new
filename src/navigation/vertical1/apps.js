// ** Icons Import
import { Book, Box, Cpu, Monitor, BarChart2, Circle, ShoppingCart, User, Shield, Activity, Database, Users, Home, Clock, Heart } from 'react-feather'

export default [
  {
    id: 'stastic',
    title: 'Thống kê',
    icon: <BarChart2 size={20} />,
    navLink: '/dashboard/ecommerce'
  },
  // {
  //   id: 'invoiceApp',
  //   title: 'Bài thí nghiệm',
  //   icon: <Activity size={20} />,
  //   navLink: '/apps/invoice/list'
    // children: [
    //   {
    //     id: 'invoiceList',
    //     title: 'List',
    //     icon: <Circle size={12} />,
    //     navLink: '/apps/invoice/list'
    //   },
    //   {
    //     id: 'invoicePreview',
    //     title: 'Preview',
    //     icon: <Circle size={12} />,
    //     navLink: '/apps/invoice/preview'
    //   },
    //   {
    //     id: 'invoiceEdit',
    //     title: 'Edit',
    //     icon: <Circle size={12} />,
    //     navLink: '/apps/invoice/edit'
    //   },
    //   {
    //     id: 'invoiceAdd',
    //     title: 'Add',
    //     icon: <Circle size={12} />,
    //     navLink: '/apps/invoice/add'
    //   }
    // ]
  // },
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
  
  // {
  //   id: 'dataModel',
  //   title: 'Lịch sử khám bệnh',
  //   icon: <Clock size={20} />,
  //   navLink: '/apps/model'
  // },
  {
    id: 'adminurrl',
    title: 'Chẩn đoán',
    icon: <Heart size={20} />,
    // navLink: '/apps/detect',
    children: [
        {
          id: 'invoiceList',
          title: 'Chẩn đoán',
          icon: <Circle size={12} />,
          navLink: '/apps/detect'
        },
        {
          id: 'invoiceLists',
          title: 'Kết luận',
          icon: <Circle size={12} />,
          navLink: '/apps/detects'
        },
        {
          id: 'invoiceEdit',
          title: 'Lịch sử ',
          icon: <Clock size={12} />,
          navLink: '/apps/histories'
        },
        // {
        //   id: 'invoiceAdd',
        //   title: 'Add',
        //   icon: <Circle size={12} />,
        //   navLink: '/apps/invoice/add'
        // }
      ]
  },
  // {
  //   id: 'email',
  //   title: 'Email',
  //   icon: <Mail size={20} />,
  //   navLink: '/apps/email'
  // },
  // {
  //   id: 'chat',
  //   title: 'Chat',
  //   icon: <MessageSquare size={20} />,
  //   navLink: '/apps/chat'
  // },
  // {
  //   id: 'todo',
  //   title: 'Todo',
  //   icon: <CheckSquare size={20} />,
  //   navLink: '/apps/todo'
  // },
  // {
  //   id: 'calendar',
  //   title: 'Calendar',
  //   icon: <Calendar size={20} />,
  //   navLink: '/apps/calendar'
  // },
  // {
  //   id: 'kanban',
  //   title: 'Kanban',
  //   icon: <CheckSquare size={20} />,
  //   navLink: '/apps/kanban'
  // },
  

  // {
  //   id: 'roles-permissions',
  //   title: 'Roles & Permissions',
  //   icon: <Shield size={20} />,
  //   children: [
  //     {
  //       id: 'roles',
  //       title: 'Roles',
  //       icon: <Circle size={12} />,
  //       navLink: '/apps/roles'
  //     },
  //     {
  //       id: 'permissions',
  //       title: 'Permissions',
  //       icon: <Circle size={12} />,
  //       navLink: '/apps/permissions'
  //     }
  //   ]
  // },
  // {
  //   id: 'eCommerce',
  //   title: 'eCommerce',
  //   icon: <ShoppingCart size={20} />,
  //   children: [
  //     {
  //       id: 'shop',
  //       title: 'Shop',
  //       icon: <Circle size={12} />,
  //       navLink: '/apps/ecommerce/shop'
  //     },
  //     {
  //       id: 'detail',
  //       title: 'Details',
  //       icon: <Circle size={12} />,
  //       navLink: '/apps/ecommerce/product-detail'
  //     },
  //     {
  //       id: 'wishList',
  //       title: 'Wish List',
  //       icon: <Circle size={12} />,
  //       navLink: '/apps/ecommerce/wishlist'
  //     },
  //     {
  //       id: 'checkout',
  //       title: 'Checkout',
  //       icon: <Circle size={12} />,
  //       navLink: '/apps/ecommerce/checkout'
  //     }
  //   ]
  // },
  // {
  //   id: 'users',
  //   title: 'User',
  //   icon: <User size={20} />,
  //   children: [
  //     {
  //       id: 'list',
  //       title: 'List',
  //       icon: <Circle size={12} />,
  //       navLink: '/apps/user/list'
  //     },
  //     {
  //       id: 'view',
  //       title: 'View',
  //       icon: <Circle size={12} />,
  //       navLink: '/apps/user/view'
  //     }
  //   ]
  // }
]
