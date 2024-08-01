const apiResponse = (statusCode, data, message = "Success") => ({
    statusCode: statusCode,
    data: data,
    message: message,
    success: statusCode < 400
});

export { apiResponse };