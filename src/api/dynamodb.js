import AWS from 'aws-sdk'
import databaseConfig from 'config/database'

export const sessionTrialInit = (id, start, name, conditionOrder, conditions, studentID) => {
  const docParams = {
    TableName: databaseConfig.table,
    Item: {
      'session_id': id,
      'session_start': start,
      'name': name,
      'order': conditionOrder,
      'conditions': conditions,
      'trials': [],
      'student_id': studentID
    }
  }

  const docClient = new AWS.DynamoDB.DocumentClient()
  docClient.put(docParams, (err, data) => {
    if (err) {
      console.error('got error', err)
    }
  })
}

export const sessionTrialClose = (id, start) => {
  const params = {
    TableName: databaseConfig.table,
    UpdateExpression: 'SET #E = :e',
    ExpressionAttributeNames: {
      '#E': 'session_end'
    },
    ExpressionAttributeValues: {
      ':e': {
        'N': '' + Date.now()
      }
    },
    Key: {
      'session_id': {
        'S': id
      },
      'session_start': {
        'N': '' + start
      }
    }
  }

  const dynamodb = new AWS.DynamoDB()
  dynamodb.updateItem(params, (err, data) => {
    if (err) {
      console.error('got error', err)
    }
  })
}

export const sessionTrialInsert = (id, start, trial) => {
  // Objects need to be converted to DynamoDB maps to be inserted
  // i.e. {"Name": {"S": "Widget"}, "Value": {"N": "33"}}

  // See AttributeValue on this page:
  // http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html#update-property

  // Using the DocumentClient allows us to do that with javascript Objects ...

  const docParams = {
    TableName: databaseConfig.table,
    UpdateExpression: 'SET #T = list_append(if_not_exists(#T, :empty), :t)',
    ExpressionAttributeNames: {
      '#T': 'trials'
    },
    ExpressionAttributeValues: {
      ':t': [trial],
      ':empty': []
    },
    Key: { 'session_id': id, 'session_start': start }
  }

  const docClient = new AWS.DynamoDB.DocumentClient()
  docClient.update(docParams, (err, data) => {
    if (err) {
      console.error('got error', err)
    }
  })

  // .. instead of AttributeValue:

  /*
  const params = {
    TableName: databaseConfig.table,
    UpdateExpression: 'SET #V = list_append(#V, :v)',
    ExpressionAttributeNames: {
      '#V': 'value'
    },
    ExpressionAttributeValues: {
      ':v': {
        'L': [
          { 'M': value }
        ]
      }
    },
    Key: {
      'user_id': {
        'S': id
      }
    }
  }

  const dynamodb = new AWS.DynamoDB()
  dynamodb.updateItem(params, (err, data) => {
    console.debug(err, data)
  })
  */
}
