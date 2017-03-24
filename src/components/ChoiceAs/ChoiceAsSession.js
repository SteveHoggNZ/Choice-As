import React from 'react'
import { Button } from 'reactstrap'
import './ChoiceAs.scss'
import ChoiceKey from './ChoiceKey'

const ChoiceAsSessionStartButton = (props) => {
  const startSessionHandler = () => {
    props.startClick()
  }

  return <Button
    type='submit'
    color='primary'
    onClick={startSessionHandler}>
    Start New Session
  </Button>
}

ChoiceAsSessionStartButton.propTypes = {
  startClick: React.PropTypes.func.isRequired
}

export const ChoiceAsSession = (props) => {
  // TODO, check for valid session and redirect if not?
  // const infoClickHandle = () => {
  //   console.warn('valid id?', props.session !== undefined)
  // }

  const buildLog = () => {
    if (props.session && props.session.log) {
      let i = 0
      return props.session.log
        .map((v) => <li key={i++}>{props.session.log.length + 1 - i} {v}</li>)
    }
  }

  const { cursor, trials } = props.session || {}
  const { correctCount } = props || {}

  const trial = cursor && trials && trials[cursor.trialCount] &&
    trials[cursor.trialCount][cursor.keyStageID] &&
      trials[cursor.trialCount][cursor.keyStageID] || undefined

  // props.router.push('/some/path')

  return <div>
    {props.session && props.sessionID &&
      <div>
        <div className='choice-as__container'>
          {props.entities.conditions[props.session.cursor.conditionID].keys[0]
            .map((k, i) => {
              const wasClicked = trial && trial.clickedKey &&
                trial.clickedKey === k
              const hasReinforcer = trial && trial.reinforcerKey &&
                trial.reinforcerKey === k
              return <ChoiceKey key={i} id={k}
                sessionID={props.sessionID}
                session={props.session}
                wasClicked={wasClicked}
                hasReinforcer={hasReinforcer}
                reveal={
                  wasClicked && trial && trial.reveal1 ||
                  !wasClicked && trial && trial.reveal2 && hasReinforcer
                }
                keyClick={props.keyClick} />
            }
          )}
        </div>
        <br />
        <h2>
          You {!props.session.finished && <span>have </span>}found {correctCount} duck{correctCount === 1 ? '' : 's'}
        </h2>
      </div>}
    {props.session.finished &&
      <h3 style={{ color: 'green' }}>Thank you! The session is now complete.</h3>}
    {(!props.sessionID || props.session.finished) &&
      <div>
        <ChoiceAsSessionStartButton startClick={props.startClick} />
      </div>}
    {props.session && props.sessionID &&
      <span>
        <br />
        <ul className='choice-as__log'>{buildLog()}</ul>
      </span>}
  </div>
}

ChoiceAsSession.propTypes = {
  sessionID: React.PropTypes.string,
  // sessionState: React.PropTypes.object.isRequired,
  session: React.PropTypes.object,
  correctCount: React.PropTypes.number.isRequired,
  entities: React.PropTypes.object.isRequired,
  startClick: React.PropTypes.func.isRequired,
  keyClick: React.PropTypes.func.isRequired
}

export default ChoiceAsSession
