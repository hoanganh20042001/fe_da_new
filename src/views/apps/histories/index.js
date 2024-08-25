// ** React Imports
import { Fragment } from 'react'

// ** Custom Components
import Breadcrumbs from '@components/breadcrumbs'

// ** Third Party Components
import { Row, Col } from 'reactstrap'

// ** Demo Components
import ManageHistories from './ManageHistories'

// ** Styles
import '@styles/react/libs/tables/react-dataTable-component.scss'

const Histories = () => {
  return (
    <Fragment>
      <Row>
        <Col sm='12'>
          <ManageHistories />
        </Col>
      </Row>
    </Fragment>
  )
}

export default Histories