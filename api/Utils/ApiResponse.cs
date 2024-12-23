namespace api.Utils;

public class ApiResponse<T>
{
    public bool Success { get; set; }
    public string? Message { get; set; }
    public T? Data { get; set; }
    public object? DevelopmentDetails { get; set; }

    public static ApiResponse<T> CreateSuccess(T data, string message = "Operation successful")
    {
        return new ApiResponse<T>
        {
            Success = true,
            Message = message,
            Data = data
        };
    }

    public static ApiResponse<T> CreateError(string message, T? data = default)
    {
        return new ApiResponse<T>
        {
            Success = false,
            Message = message,
            Data = data
        };
    }
}

public class ApiResponse
{
    public bool Success { get; set; }
    public string? Message { get; set; }
    public object? Data { get; set; }
    public object? DevelopmentDetails { get; set; }

    public static ApiResponse CreateSuccess(string message = "Operation successful", object? data = null)
    {
        return new ApiResponse
        {
            Success = true,
            Message = message,
            Data = data
        };
    }

    public static ApiResponse CreateError(string message, object? data = null)
    {
        return new ApiResponse
        {
            Success = false,
            Message = message,
            Data = data
        };
    }

    internal static object Error(string message)
    {
        throw new NotImplementedException();
    }
}
