import { Response } from 'express';

type TErrorDetail = {
  code: string;
  description: string;
};

type TResponse<T> = {
  statusCode: number;
  success: boolean;
  message?: string;
  error?: TErrorDetail;
  data: T;
};

const sendResponse = <T>(res: Response, data: TResponse<T>) => {
  // Add debug logging
  if (process.env.DEBUG === 'true') {
    console.log(`[sendResponse] status: ${data.statusCode}, success: ${data.success}, message: ${data.message || 'none'}`);
    
    if (data.error) {
      console.log(`[sendResponse] error: ${data.error.code} - ${data.error.description}`);
    }
    
    if (data.data) {
      console.log(`[sendResponse] data available: ${typeof data.data === 'object' ? 'yes (object)' : typeof data.data}`);
    } else {
      console.log(`[sendResponse] data is null or undefined`);
    }
  }
  
  res.status(data?.statusCode).json({
    success: data.success,
    message: data.message,
    error: data.error,
    data: data.data,
  });
};

export default sendResponse;
