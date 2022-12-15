import { ErrorData } from '../../participant/participant.interface';

export function handleErrorResponse(error: any): ErrorData {
  const errorData: ErrorData = {};
  if (error.response) {
    const errorResponseData = error.response.data.error ?? error.response;
    errorData.code = errorResponseData.code;
    errorData.description =
      errorResponseData.description ?? errorResponseData.statusText;
    errorData.additionalInfo =
      errorResponseData.additionalInfo ?? errorResponseData.data;
    errorData.status = error.response.status;
  } else {
    errorData.code = error.code;
    errorData.description = error.message;
    errorData.status = error.status;
  }
  return errorData;
}
