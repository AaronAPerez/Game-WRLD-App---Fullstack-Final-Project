// using System;
// using System.Collections.Generic;
// using System.Linq;
// using System.Threading.Tasks;
// using System.Net;
// using System.Text.Json;
// using api.Utils;

// namespace api.Middleware;

// public class ErrorHandlingMiddleware
// {
//     private readonly RequestDelegate _next;
//     private readonly ILogger<ErrorHandlingMiddleware> _logger;
//     private readonly IWebHostEnvironment _env;

//     public ErrorHandlingMiddleware(
//         RequestDelegate next,
//         ILogger<ErrorHandlingMiddleware> logger,
//         IWebHostEnvironment env)
//     {
//         _next = next;
//         _logger = logger;
//         _env = env;
//     }

//     public async Task InvokeAsync(HttpContext context)
//     {
//         try
//         {
//             await _next(context);
//         }
//         catch (Exception error)
//         {
//             var response = context.Response;
//             response.ContentType = "application/json";

//             var (statusCode, message) = GetErrorDetails(error);
//             response.StatusCode = statusCode;

//             var result = ApiResponse.Error(message);

//             if (_env.IsDevelopment())
//             {
//                 result.DevelopmentDetails = new
//                 {
//                     error.StackTrace,
//                     error.Source,
//                     error.Message
//                 };
//             }

//             _logger.LogError(error, message);

//             await response.WriteAsync(JsonSerializer.Serialize(result));
//         }
//     }

//     private (int StatusCode, string Message) GetErrorDetails(Exception error)
//     {
//         return error switch
//         {
//             UnauthorizedAccessException _ =>
//                 ((int)HttpStatusCode.Unauthorized, "Unauthorized"),

//             InvalidOperationException _ =>
//                 ((int)HttpStatusCode.BadRequest, error.Message),

//             KeyNotFoundException _ =>
//                 ((int)HttpStatusCode.NotFound, "Resource not found"),

//             ArgumentException _ =>
//                 ((int)HttpStatusCode.BadRequest, error.Message),

//             ApplicationException _ =>
//                 ((int)HttpStatusCode.BadRequest, error.Message),

//             _ => ((int)HttpStatusCode.InternalServerError,
//                 _env.IsDevelopment() ? error.Message : "An unexpected error occurred.")
//         };
//     }
// }
