const createResponse = (statusCode, body) => {
    return {
      statusCode,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    };
  };
  
  module.exports = { createResponse };
  