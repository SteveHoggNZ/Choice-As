import React, { PropTypes } from 'react'
import classNames from 'classnames'
import classes from './Spinner.scss'

const buildParentClassname = ({ center = false } = {}) => {
  return classNames({
    [classes.centered]: center
  })
}

const buildClassname = ({ size = null, visible = true } = {}) => {
  return classNames({
    'fa': true,
    'fa-spinner': true,
    'fa-spin': true,
    'fa-fw': true,
    'fa-1x': size === 1,
    'fa-2x': size === 2 || size === null,
    'invisible': !visible
  })
}

export const Spinner = ({ size, visible, center, children }) => (
  <span className={buildParentClassname({ center })}>
    <i className={buildClassname({ size, visible })} />
    &nbsp;
    {children}
  </span>
)

Spinner.PropTypes = {
  size: PropTypes.num,
  visible: PropTypes.bool,
  center: PropTypes.bool,
  children: PropTypes.elem
}

export default Spinner
