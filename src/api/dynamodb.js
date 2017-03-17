import AWS from 'aws-sdk'
import databaseConfig from 'config/database'

const dynamodb = new AWS.DynamoDB()

export const sessionTrialInit = (id) => {
  const params = {
    TableName: databaseConfig.table,
    Item: {
      'user_id': {
        'S': id
      },
      'value': {
        'L': []
      }
    }
  }

  dynamodb.putItem(params, (err, data) => {
    console.debug(err, data)
  })
}

export const sessionTrialInsert = (id, value = 'test') => {
  const params2 = {
    TableName: databaseConfig.table,
    UpdateExpression: 'SET #V = list_append(#V, :v)',
    ExpressionAttributeNames: {
      '#V': 'value'
    },
    ExpressionAttributeValues: {
      ':v': {
        'L': [
          { 'S': value }
        ]
      }
    },
    Key: {
      'user_id': {
        'S': id
      }
    }
  }

  dynamodb.updateItem(params2, (err, data) => {
    console.debug(err, data)
  })
}
