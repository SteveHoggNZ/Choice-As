import React from 'react'
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

const Spinner = ({ size, visible, center, children }) => (
  <span className={buildParentClassname({ center })}>
    <i className={buildClassname({ size, visible })} />
    &nbsp;
    {children}
  </span>
)

Spinner.propTypes = {
  size: React.PropTypes.number,
  visible: React.PropTypes.bool,
  center: React.PropTypes.bool,
  children: React.PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.element
  ])
}

export default Spinner
