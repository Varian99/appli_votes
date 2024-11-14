const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    const userId = event.requestContext.identity.cognitoIdentityId;

    const params = {
        TableName: 'UserAttributes',
        Key: {
            userId: userId
        }
    };

    try {
        const result = await dynamoDb.get(params).promise();
        return {
            statusCode: 200,
            body: JSON.stringify(result.Item)
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Could not fetch user data' })
        };
    }
};