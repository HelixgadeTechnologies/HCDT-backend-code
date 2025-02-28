export interface ApiResponse<T = any> {
    success: boolean;
    message: string;
    data?: T;
    error?: string;
  }
  
  export const successResponse = <T>(message: string, data?: T): ApiResponse<T> => ({
    success: true,
    message,
    data,
  });
  export const notFoundResponse = <T>(message: string, data?: T): ApiResponse<T> => ({
    success: false,
    message,
    data,
  });
  
  export const errorResponse = (message: string, error?: any): ApiResponse => ({
    success: false,
    message,
    error: error?.toString() || "An error occurred",
  });