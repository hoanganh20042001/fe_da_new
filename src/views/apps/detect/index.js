// ** React Imports
import { Fragment } from 'react'

// ** Custom Components
import Breadcrumbs from '@components/breadcrumbs'

// ** Third Party Components
import { Row, Col } from 'reactstrap'

import WizardHorizontal from './WizardHorizontal'
// ** Styles
import '@styles/react/libs/tables/react-dataTable-component.scss'
import ManageDetect from './ManageDetect'

const Detect = () => {
  return (
    <Fragment>
      <Row>
        <Col sm='12'>
        <WizardHorizontal />
        </Col>
      </Row>
    </Fragment>
  )
}

export default Detect
