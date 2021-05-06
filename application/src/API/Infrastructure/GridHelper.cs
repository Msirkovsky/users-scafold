using System;
using System.Collections;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Linq.Dynamic.Core;
using System.Reflection;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace API.Infrastructure
{
    public static class GridHelper
    {
        public static GridHelperRequest ParseGridRequest(HttpContext context)
        {
            var requestQuery = context.Request.Query;
            if (string.IsNullOrWhiteSpace(requestQuery["take"]))
                return GridHelperRequest.Empty;

            var sortBy = requestQuery["sortBy"];
            var filterBy = requestQuery["filterBy"];

            var request = new GridHelperRequest
            {
                Sorts = ParseSortBy(sortBy),
                Filters = ParseFilterBy(filterBy),
                Take = int.Parse(requestQuery["take"], CultureInfo.InvariantCulture),
                Skip = int.Parse(requestQuery["skip"], CultureInfo.InvariantCulture)
            };

            return request;
        }

        public static string FirstCharToUpper(this string input)
        {
            if (String.IsNullOrEmpty(input))
            {
                throw new ArgumentException("UGH!");
            }
            return input.First().ToString().ToUpper() + input.Substring(1);
        }

        public static List<Sort> ParseSortBy(string sortExpression)
        {


            var result = new List<Sort>();

            if (String.IsNullOrWhiteSpace(sortExpression))
            {
                return result;
            }

            var sortExpressions = sortExpression.Split(new[] { '~' }, StringSplitOptions.RemoveEmptyEntries);
            if (sortExpressions.Length > 0)
            {
                result.AddRange(sortExpressions.Select((se) =>
                {
                    var seParts = se.Split('_');
                    return new Sort { PropertyName = seParts[0].FirstCharToUpper(), SortName = seParts[1].ToUpper() };
                }));

            }
            return result;
        }

        public static List<Filter> ParseFilterBy(string filterExpression)
        {

            var result = new List<Filter>();
            if (String.IsNullOrWhiteSpace(filterExpression))
            {
                return result;
            }

            var filterExpressions = filterExpression.Split(new[] { '~' }, StringSplitOptions.RemoveEmptyEntries);
            foreach (var actualFilter in filterExpressions)
            {
                var actualFilterParts = actualFilter.Split('_');
                var propertyName = actualFilterParts[0]?.FirstCharToUpper();


                result.Add(new Filter { PropertyName = propertyName, FilterStrings = actualFilterParts.Skip(1).ToArray() });

            }
            return result;
        }


        public static GridHelperResponse EnhanceForGridInMemory<T>(this IQueryable<T> query, GridHelperRequest request)
            where T : class
        {
            query = query.FilterBy(request.Filters);
            query = query.SortBy(request.Sorts);
            var count = query.Count();
            query = query.SkipAndTake(request.Skip, request.Take);
            return new GridHelperResponse { Data = query.ToList(), Total = count };
        }

        public static GridHelperResponse EnhanceForGrid<T>(this IQueryable<T> query, GridHelperRequest request)
            where T : class
        {
            int count;
            if (request != GridHelperRequest.Empty)
            {
                query = query.FilterBy(request.Filters);
                query = query.SortBy(request.Sorts);
                count = query.Count();
                query = query.SkipAndTake(request.Skip, request.Take);
                query = query.AsNoTracking();
            }
            else
                count = query.Count();

            return new GridHelperResponse { Data = query.ToList(), Total = count };
        }



        public static IQueryable<T> SortBy<T>(this IQueryable<T> query, IEnumerable<Sort> sorts)
        {
            var sortsArray = sorts as Sort[] ?? sorts.ToArray();
            if (!sortsArray.Any()) 
                return query;

            var linqDynamicSortString = String.Join(", ", sortsArray.Select(s => s.PropertyName + " " + s.SortName));
            query = query.OrderBy(linqDynamicSortString);
            return query;
        }

        public static IQueryable<T> FilterBy<T>(this IQueryable<T> query, IEnumerable<Filter> filters)
        {
            foreach (var actualFilter in filters)
            {

                var propertyName = actualFilter.PropertyName;

                var propertyInfo = typeof(T).GetProperty(propertyName);
                if (propertyInfo == null)
                {
                    throw new Exception($"Property: {propertyName} not found in type type {typeof(T).FullName}");
                }
                query = query.FilterBy(propertyName, propertyInfo, actualFilter.FilterStrings);

            }
            return query;
        }

        private static Dictionary<Type, IFilterHandler> _handlers = new Dictionary<Type, IFilterHandler> {
            {typeof(string), new StringFilterHandler()}
        };


        private static IQueryable<T> FilterBy<T>(this IQueryable<T> query, String propertyName, PropertyInfo propertyInfo, String[] filterParams)
        {
            var propertyType = propertyInfo.PropertyType;
            var handler = _handlers[propertyType];
            if (handler == null)
            {
                throw new Exception($"Unknown filter handler for type: {propertyType.FullName} on property: {propertyInfo.Name} of type {typeof(T).FullName}");
            }

            return handler.Filter(query, propertyName, filterParams);
        }

        public static IQueryable<T> SkipAndTake<T>(this IQueryable<T> query, int? skip, int? take)
        {
            if (skip != null)
            {
                query = query.Skip(skip.Value);
            }
            if (take != null)
            {
                query = query.Take(take.Value);
            }
            return query;
        }
    }

    interface IFilterHandler
    {
        IQueryable<T> Filter<T>(IQueryable<T> query, String propertyName, String[] filterParams);
    }



    public class StringFilterHandler : IFilterHandler
    {
        public IQueryable<T> Filter<T>(IQueryable<T> query, String propertyName, String[] filterParams)
        {
            return query
                .Where(propertyName + " != null")
                .Where(propertyName + ".ToUpper().Contains(@0)", filterParams[0].ToUpper());
        }
    }

    public class GridHelperResponse
    {
        public IEnumerable Data { get; set; }
        public int Total { get; set; }
        public object SideCarData { get; set; }
    }

    public class Filter
    {
        public String PropertyName { get; set; }
        public String[] FilterStrings { get; set; }
    }

    public class Sort
    {
        public String PropertyName { get; set; }
        public String SortName { get; set; }
    }

    public class GridHelperRequest
    {
        public IList<Filter> Filters { get; set; }

        public IList<Sort> Sorts { get; set; }
        public int? Skip { get; set; }
        public int? Take { get; set; }

        public static readonly GridHelperRequestEmpty Empty = new GridHelperRequestEmpty();

    }
}