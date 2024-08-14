'use strict';
export function healthCheck(event, context, callback) {

    console.log("Received request");
    let response = {
        statusCode: 200,
        body: "Lambda is working",
    };
    callback(null, response);
  }