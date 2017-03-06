import React from 'react'
import { VelocityComponent, velocityHelpers } from 'velocity-react'
require('velocity-animate/velocity.ui')
import './ChoiceAs.scss'
import ChoiceKeyBox, { COLOURS } from './ChoiceKeyBox'
import DuckImage from './assets/Duck.jpg'

// FlowType annotations
type Props = {
  id: string
}

let flipAnimations = {
  // Brings the box from flipped up to down. Also the default state that the box starts in. When
  // this animates, includes a little swing at the end so it feels more like a flap.
  down: velocityHelpers.registerEffect({
    // longer due to spring timing
    defaultDuration: 1100,
    calls: [
      [{
        transformPerspective: [ 800, 800 ],
        transformOriginX: [ '50%', '50%' ],
        transformOriginY: [ 0, 0 ],
        rotateX: [0, 'spring'],
        // We step this back immediately; you don't notice and it means we're not fading in as
        // the spring swings rotateX back and forth.
        backgroundColor: [COLOURS.frontColor, COLOURS.frontColor]
      }, 1, {
        delay: 100,
        easing: 'ease-in'
      }]
    ]
  }),

  // Flips the box up nearly 180°.
  up: velocityHelpers.registerEffect({
    defaultDuration: 200,
    calls: [
      [{
        transformPerspective: [ 800, 800 ],
        transformOriginX: [ '50%', '50%' ],
        transformOriginY: [ 0, 0 ],
        rotateX: 160,
        backgroundColor: COLOURS.backColor
      }]
    ]
  })
}

// Animations to blur the the box for when it's flipped up.
//
// Blur animations each have a delay to make them change roughly when the flip is halfway up,
// to capture the transition from front to back (and vice versa). They flip over their values
// immediately with no tweening, since that doesn't make sense for the effect. We're using
// Velocity here only to co-ordinate the timing of the change.
let blurAnimations = {
  blur: velocityHelpers.registerEffect({
    defaultDuration: 200,
    calls: [
      [{ blur: [3, 3], opacity: [0.4, 0.4] }, 1, { delay: 50 }]
    ]
  }),

  unblur: velocityHelpers.registerEffect({
    defaultDuration: 200,
    calls: [
      [{ blur: [0, 0], opacity: [1, 1] }, 1, { delay: 150 }]
    ]
  })
}

export const ChoiceKey = (props: Props) => {
  const keyClickHandler = () => {
    if (!props.session || props.session.locked === false) {
      props.keyClick(props.sessionID, props.id)
    }
  }

  const renderTop = () => {
    const flipAnimation = props.reveal ? flipAnimations.up : flipAnimations.down
    const contentAnimation = props.reveal
      ? blurAnimations.blur : blurAnimations.unblur

    const boxStyle = { position: 'absolute' }

    return (
      <VelocityComponent animation={flipAnimation}>
        <ChoiceKeyBox style={boxStyle} instruction='Click'>
          <VelocityComponent animation={contentAnimation}>
            <div>?</div>
          </VelocityComponent>
        </ChoiceKeyBox>
      </VelocityComponent>
    )
  }

  const renderUnderneath = () => {
    return (<ChoiceKeyBox underneath>
      <div>{props.hasReinforcer
        ? <img
          alt='This is a duck, because Redux!'
          className='choice-as__duck'
          src={DuckImage} />
        : ''}
      </div>
    </ChoiceKeyBox>)
  }

  return <div onClick={keyClickHandler}>
    {renderTop()}
    {renderUnderneath()}
  </div>
}

ChoiceKey.propTypes = {
  id: React.PropTypes.string.isRequired,
  sessionID: React.PropTypes.string.isRequired,
  session: React.PropTypes.object,
  wasClicked: React.PropTypes.bool,
  hasReinforcer: React.PropTypes.bool,
  reveal: React.PropTypes.bool,
  keyClick: React.PropTypes.func.isRequired
}

export default ChoiceKey
