export interface ApiResponse<T = any> {
    message: string
    result: boolean
    data?: T
    error?: any
}

export function createResponse<T>(message: string, result: boolean, data?: T, error?: any): ApiResponse<T> {
    return {
        message,
        result,
        data,
        error
    }
}