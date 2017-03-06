import React from 'react'

// FlowType annotations
type Props = {
  debug: boolean,
  test: number
}

export const ChoiceAs = (props: Props) => (
  <div>
    {props.children}
  </div>
)

ChoiceAs.propTypes = {
  children: React.PropTypes.object.isRequired
}

export default ChoiceAs
