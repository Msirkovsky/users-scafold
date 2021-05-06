using System.IO;
using System.Net;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace API
{
    public class HandleNotFoundMiddleware
    {
        private readonly RequestDelegate _next;
        public HandleNotFoundMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task Invoke(HttpContext context)
        {
            if (!IsApiRequest(context.Request.Path) && !HasDotInLastSegment(context.Request.Path))
            {
                await ReturnIndexPage(context);
                return;
            }

            await _next.Invoke(context);

        }

        private bool IsApiRequest(PathString path)
        {
            return path.StartsWithSegments(new PathString("/api"));
        }

        private bool HasDotInLastSegment(string uri)
        {
            var lastSegmentStartPos = uri.LastIndexOf('/');
            return uri.IndexOf('.', lastSegmentStartPos + 1) >= 0;
        }

        private static async Task ReturnIndexPage(HttpContext context)
        {
            var file = new FileInfo(Path.Combine("wwwroot", "index.html"));
            byte[] buffer;

            context.Response.StatusCode = (int)HttpStatusCode.OK;
            context.Response.ContentType = "text/html";
            buffer = File.ReadAllBytes(file.FullName);

            context.Response.ContentLength = buffer.Length;

            using (var stream = context.Response.Body)
            {
                await stream.WriteAsync(buffer, 0, buffer.Length);
                await stream.FlushAsync();
            }

        }
    }
}