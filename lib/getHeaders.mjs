export const getHeaders = () => {
    return {
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "OPTIONS,POST,GET,PUT",
      "Access-Control-Allow-Credentials": true,
    }
  }