// ** React Imports
import { Outlet } from 'react-router-dom'

// ** Core Layout Import
// !Do not remove the Layout import
import Layout from '@layouts/VerticalLayout'

// ** Menu Items Array
import navigation1 from '@src/navigation/vertical1'
import navigation2 from '@src/navigation/vertical2'
import navigation3 from '@src/navigation/vertical3'


const VerticalLayout = props => {
  // const [menuData, setMenuData] = useState([])

  // ** For ServerSide navigation
  // useEffect(() => {
  //   axios.get(URL).then(response => setMenuData(response.data))
  // }, [])
  const role_id = localStorage.getItem('role_id')
  console.log(role_id)
  if (role_id === 'D') {
    return (
      <Layout menuData={navigation1} {...props}>
        <Outlet />
      </Layout>
    )
  } else if (role_id === 'A') {
    return (
      <Layout menuData={navigation2} {...props}>
        <Outlet />
      </Layout>
    )
  } else if (role_id === 'S') {
    return (
      <Layout menuData={navigation3} {...props}>
        <Outlet />
      </Layout>
    )
  }

}

export default VerticalLayout
