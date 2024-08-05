const { putItem, getItem } = require('../../../common/lib/dynamoDB');
const { validateUser } = require('../../../common/models/user-schema');
const { createResponse } = require('../lib/service-utilities');

module.exports.createUser = async (event) => {
  const data = JSON.parse(event.body);
  const { error } = validateUser(data);

  if (error) {
    return createResponse(400, { error: error.details[0].message });
  }

  const params = {
    TableName: 'Users',
    Item: data,
  };

  try {
    await putItem(params.TableName, params.Item);
    return createResponse(200, { message: 'User created successfully' });
  } catch (error) {
    return createResponse(500, { error: 'Could not create user' });
  }
};

module.exports.getUser = async (event) => {
  const params = {
    TableName: 'Users',
    Key: { id: event.pathParameters.id },
  };

  try {
    const result = await getItem(params.TableName, params.Key);
    if (result.Item) {
      return createResponse(200, result.Item);
    } else {
      return createResponse(404, { error: 'User not found' });
    }
  } catch (error) {
    return createResponse(500, { error: 'Could not retrieve user' });
  }
};
