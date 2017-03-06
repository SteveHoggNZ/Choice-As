import React from 'react'
import classes from './ChoiceAs.scss'

export const COLOURS = {
  frontColour: '#3f83b7',
  backColour: '#255175',
  underneathColour: '#5797c0'
}

const ChoiceKeyBox = (props) => {
  const underneath = props.underneath || undefined

  const style = {
    height: 180,
    width: 180,
    backgroundColor: COLOURS[underneath ? 'underneathColour' : 'frontColour'],
    textAlign: 'center',
    fontSize: 80,
    fontWeight: 'bold',
    cursor: 'pointer',
    position: underneath ? '' : 'relative',
    ...(props && props.style || {})
  }

  const instructionStyle = {
    position: 'absolute',
    bottom: 3,
    left: 0,
    right: 0,
    fontSize: '11px',
    fontWeight: 'normal',
    textTransform: 'uppercase',
    color: '#090909',
    opacity: 0.4
  }

  return <div style={{ margin: 10 }}>
    <div className={classes.choiceKeyBox} style={style}>
      {props.children}
      {props.instruction
        ? <div style={instructionStyle}>{props.instruction}</div> : null}
    </div>
  </div>
}

ChoiceKeyBox.propTypes = {
  children: React.PropTypes.any.isRequired,
  style: React.PropTypes.object,
  underneath: React.PropTypes.bool,
  instruction: React.PropTypes.string
}

export default ChoiceKeyBox
