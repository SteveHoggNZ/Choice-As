import React from 'react'
import './ChoiceAs.scss'
import ChoiceKey from './ChoiceKey'

const ChoiceAsSessionButton = (props) => {
  const startSessionHandler = () => {
    props.startClick(props.conditionID)
  }

  return <button onClick={startSessionHandler}>
    Start Session {props.conditionName}
  </button>
}

ChoiceAsSessionButton.propTypes = {
  conditionID: React.PropTypes.string.isRequired,
  conditionName: React.PropTypes.string.isRequired,
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

  const { cursor, trials, correctCount } = props.session || {}

  const trial = cursor && trials && trials[cursor.trialCount] &&
    trials[cursor.trialCount][cursor.keyStageID] &&
      trials[cursor.trialCount][cursor.keyStageID] || undefined

  // props.router.push('/some/path')

  return <div>
    {!props.sessionID &&
      <div>
        <ChoiceAsSessionButton startClick={props.startClick}
          conditionID='C1' conditionName='Condition 1' />
        <ChoiceAsSessionButton startClick={props.startClick}
          conditionID='C2' conditionName='Condition 2' />
        <ChoiceAsSessionButton startClick={props.startClick}
          conditionID='C3' conditionName='Condition 3' />
      </div>}
    {props.session && props.sessionID &&
      <div>
        <div className='choice-as__container'>
          {props.entities.conditions[props.session.conditionID].keys[0]
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
          You have found {correctCount} duck{correctCount === 1 ? '' : 's'}
        </h2>
        <br />
        <ul className='choice-as__log'>{buildLog()}</ul>
      </div>}
  </div>
}

ChoiceAsSession.propTypes = {
  sessionID: React.PropTypes.string,
  // sessionState: React.PropTypes.object.isRequired,
  session: React.PropTypes.object,
  entities: React.PropTypes.object.isRequired,
  startClick: React.PropTypes.func.isRequired,
  keyClick: React.PropTypes.func.isRequired
}

export default ChoiceAsSession
