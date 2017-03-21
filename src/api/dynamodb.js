import AWS from 'aws-sdk'
import databaseConfig from 'config/database'

export const sessionTrialInit = (id, conditions) => {
  const docParams = {
    TableName: databaseConfig.table,
    Item: {
      'user_id': id,
      'conditions': { conditions },
      'trials': []
    }
  }

  const docClient = new AWS.DynamoDB.DocumentClient()
  docClient.put(docParams, (err, data) => {
    console.debug(err, data)
  })
}

export const sessionTrialInsert = (id, trial) => {
  // Objects need to be converted to DynamoDB maps to be inserted
  // i.e. {"Name": {"S": "Widget"}, "Value": {"N": "33"}}

  // See AttributeValue on this page:
  // http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html#update-property

  // Using the DocumentClient allows us to do that with javascript Objects ...

  const docParams = {
    TableName: databaseConfig.table,
    UpdateExpression: 'SET #T = list_append(#T, :t)',
    ExpressionAttributeNames: {
      '#T': 'trials'
    },
    ExpressionAttributeValues: {
      ':t': [trial]
    },
    Key: { 'user_id': id }
  }

  const docClient = new AWS.DynamoDB.DocumentClient()
  docClient.update(docParams, (err, data) => {
    console.debug(err, data)
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
