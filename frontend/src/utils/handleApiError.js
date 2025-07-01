export const handleApiError = (error, customMessage = "Something went wrong") => {
  // Default error object
  let parsedError = {
    error: true,
    message: customMessage,
    statusCode: null,
    details: null,
  };

  if (error.response) {
    // Server responded with a status code outside the 2xx range
    parsedError.statusCode = error.response.status;
    parsedError.message = error.response.data?.message || customMessage;
    parsedError.details = error.response.data;
    console.error("API Error Response:", error.response);
  } else if (error.request) {
    // Request was made, but no response received
    parsedError.message = "No response from server.";
    console.error("API No Response:", error.request);
  } else {
    // Something happened in setting up the request
    parsedError.message = error.message || customMessage;
    console.error("API Setup Error:", error.message);
  }

  console.error("API Error Details:", parsedError);
  return parsedError;
};
