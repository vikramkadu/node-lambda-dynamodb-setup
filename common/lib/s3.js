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
