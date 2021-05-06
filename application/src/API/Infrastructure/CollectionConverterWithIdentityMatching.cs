using System;
using System.Linq;
using System.Linq.Expressions;
using AutoMapper;

namespace API.Infrastructure
{
    public class CollectionConverterWithIdentityMatching<TSource, TDestination> : 
        ITypeConverter<TSource[], TDestination[]> where TDestination : class
    {
        private readonly Func<TSource, object> _sourcePrimaryKeyExpression;
        private readonly Func<TDestination, object> _destinationPrimaryKeyExpression;

        private CollectionConverterWithIdentityMatching(Expression<Func<TSource, object>> sourcePrimaryKey, Expression<Func<TDestination, object>> destinationPrimaryKey)
        {
            _sourcePrimaryKeyExpression = sourcePrimaryKey.Compile();
            _destinationPrimaryKeyExpression = destinationPrimaryKey.Compile();
        }

        public static CollectionConverterWithIdentityMatching<TSource, TDestination> 
            Instance(Expression<Func<TSource, object>> sourcePrimaryKey, Expression<Func<TDestination, object>> destinationPrimaryKey)
        {
            return new CollectionConverterWithIdentityMatching<TSource, TDestination>(
                sourcePrimaryKey, destinationPrimaryKey);
        }

        private string GetPrimaryKey<TObject>(object entity, Func<TObject, object> expression)
        {
            var tempId = expression.Invoke((TObject)entity);
            var id = System.Convert.ToString(tempId);
            return id;
        }

        public TDestination[] Convert(TSource[] sourceList, TDestination[] destinationList, ResolutionContext context)
        {
            var destinationCollection = destinationList.ToList();
            var sourceCollection = sourceList;
            foreach (var source in sourceCollection)
            {
                var matchedDestination = default(TDestination);

                foreach (var destination in destinationCollection)
                {
                    var sourcePrimaryKey = GetPrimaryKey(source, _sourcePrimaryKeyExpression);
                    var destinationPrimaryKey = GetPrimaryKey(destination, _destinationPrimaryKeyExpression);

                    if (string.Equals(sourcePrimaryKey, destinationPrimaryKey, StringComparison.OrdinalIgnoreCase))
                    {
                        Mapper.Map(source, destination);
                        matchedDestination = destination;
                        break;
                    }
                }

                if (matchedDestination == null)
                {
                    destinationCollection.Add(Mapper.Map<TDestination>(source));
                }
            }

            foreach (var destination in destinationList)
            {
                foreach (var source in sourceList)
                {
                    var sourcePrimaryKey = GetPrimaryKey(source, _sourcePrimaryKeyExpression);
                    var destinationPrimaryKey = GetPrimaryKey(destination, _destinationPrimaryKeyExpression);

                    if (string.Equals(sourcePrimaryKey, destinationPrimaryKey, StringComparison.OrdinalIgnoreCase) == false)
                    {
                        destinationCollection.Remove(destination);
                    }
                }
            }

            return destinationCollection.ToArray();
        }
    }
}