// common/lib/dynamoDB.js
const AWS = require('aws-sdk');
const dynamoDB = new AWS.DynamoDB.DocumentClient();

const getItem = async (TableName, Key) => {
  const params = { TableName, Key };
  return dynamoDB.get(params).promise();
};

const putItem = async (TableName, Item) => {
  const params = { TableName, Item };
  return dynamoDB.put(params).promise();
};

module.exports = { getItem, putItem };

// common/lib/s3.js
const S3 = new AWS.S3();

const uploadFile = async (Bucket, Key, Body) => {
  const params = { Bucket, Key, Body };
  return S3.upload(params).promise();
};

const getFile = async (Bucket, Key) => {
  const params = { Bucket, Key };
  return S3.getObject(params).promise();
};

module.exports = { uploadFile, getFile };
