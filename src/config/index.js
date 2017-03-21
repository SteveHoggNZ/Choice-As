// Conditions have sessions which have trials
export default {
  session: [
    'C1', 'C2', 'C3'
  ],
  conditions: {
    C1: {
      name: 'condition 1',
      trials: 10,
      iti: 3,
      keys: [
        ['L5', 'R5'],
        ['STAY_0.1', 'SWITCH_0.9']
      ]
    },
    C2: {
      name: 'condition 2',
      trials: 10,
      iti: 3,
      keys: [
        ['L5', 'R5'],
        ['L5', 'R5']
      ]
    },
    C3: {
      name: 'condition 3',
      trials: 10,
      iti: 3,
      keys: [
        ['L5', 'R5'],
        ['STAY_0.9', 'SWITCH_0.1']
      ]
    }
  },
  keys: {
    L1: { name: 'left', probability: 0.1 },
    L5: { name: 'left', probability: 0.5 },
    L9: { name: 'left', probability: 0.9 },
    R1: { name: 'right', probability: 0.1 },
    R5: { name: 'right', probability: 0.5 },
    R9: { name: 'right', probability: 0.9 },
    'STAY_0.1': { name: 'stay', probability: 0.1 },
    'STAY_0.9': { name: 'stay', probability: 0.9 },
    'SWITCH_0.1': { name: 'switch', probability: 0.1 },
    'SWITCH_0.9': { name: 'switch', probability: 0.9 }
  }
  /*
  // possible start condition syntax. It's probably not needed as it's more
  // likely manual condition selection is done as a subject is unlikely to
  // sit down and do multiple conditions in succession.
  settings: {
    startCondition: {
      type: 'random',
      from: ['C1', 'C3']
    }
  }
  */
}

// Notes / Questions

// Possible conditional syntax
//    Paula mentioned possibly having the second trial set depend on the first
/*
C1: {
  keys: [
    ['L33', 'C33', 'R33'],
    [
      ['L33', 'STAY'],    // if L33 then STAY
      ['C33', 'SWITCH'],  // if C33 then SWITCH. C for center
      ['R33', '??']
      // this maybe better as an object literal so we can handle multiple
      // options per condition (I mean logic condition rather
      // than experiment Condition)
    ]
  ]
}
*/

// condition 2 (.5 .5) is never run first; this is enforced manually
//  i.e. the experimenter starts a particular condition by clicking a button
// inter-trial-interval, random or stable? Sarah mentioned random ITI
