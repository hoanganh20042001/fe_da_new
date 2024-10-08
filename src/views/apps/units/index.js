// ** React Imports
import { Fragment } from 'react'

// ** Custom Components
import Breadcrumbs from '@components/breadcrumbs'

// ** Third Party Components
import { Row, Col } from 'reactstrap'

// ** Demo Components
import ManageUnits from './ManageUnits'

// ** Styles
import '@styles/react/libs/tables/react-dataTable-component.scss'

const Units = () => {
  return (
    <Fragment>
      <Row>
        <Col sm='12'>
          <ManageUnits />
        </Col>
      </Row>
    </Fragment>
  )
}

export default Units
