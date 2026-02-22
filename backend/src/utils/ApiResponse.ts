class ApiResponse {
    success: boolean;
    message: string;
    data: any;
    errors: any;

    constructor(statusCode: number, data: any, message = "Success", errors = null) {
        this.success = statusCode < 400;
        this.message = message;
        this.data = data;
        this.errors = errors;
    }
}

export = ApiResponse;
