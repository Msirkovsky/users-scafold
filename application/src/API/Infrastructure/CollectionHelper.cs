using System;
using System.Collections.Generic;
using System.Linq;

namespace API.Infrastructure
{
    public static class CollectionHelper
    {
        public static void AddRemoveMap<S, T>(
            ICollection<S> source,
            ICollection<T> target,
            Func<S, T, bool> equals, Action<S, T> mapFn) where T : new()
        {
            var toRemove = target.Where(t => !source.Any(s => equals(s, t))).ToList();
            toRemove.ForEach(r => target.Remove(r));

            foreach (var sourceItem in source)
            {
                T toMap = target.SingleOrDefault(t => equals(sourceItem, t));
                if (toMap == null)
                {
                    toMap = new T();
                    target.Add(toMap);
                }
                mapFn(sourceItem, toMap);
            }
        }
    }
}