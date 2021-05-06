using System;
using System.Linq;
using AutoMapper;
using Scaffolding.Entity.Entities;

namespace API.Services.Common
{
    public class MapperService
    {
        public virtual TDestination Map<TDestination>(object source)
        {
            return Mapper.Map<TDestination>(source);
        }

        public virtual TDestination Map<TSource, TDestination>(TSource source, TDestination destination)
        {
            return Mapper.Map(source, destination);
        }

        internal void MapList<TSource, TDest>(
            TSource[] sourceCol, 
            TDest[] destinationCol, 
            Func<TSource, TDest, bool> existCallback, 
            Action<TSource> insertCallback, 
            Action<TSource,TDest> mapCallback,
            Action<TDest> deleteCallback
            )

        {
            foreach (var source in sourceCol)
            {
                foreach (var destination in destinationCol)
                {
                    if (existCallback(source, destination))
                    {
                        mapCallback?.Invoke(source, destination);
                    }
                }
            }
            var toInserts = sourceCol.Where(s => destinationCol.All(d => existCallback(s, d) ==false)).ToArray();

            foreach (var toInsert in toInserts)
            {
                insertCallback(toInsert);
            }

            var toDeletes = destinationCol.Where(d => sourceCol.All(s => existCallback(s, d)==false)).ToArray();
            foreach (var toDelete in toDeletes)
            {
                deleteCallback(toDelete);
            }
        }

        internal void MapList<TSource, TDest>(TSource[] sourceCol, TDest[] destinationCol, Action<TDest> insertCallback, Action<TDest> deleteCallback)
            where TSource : IIdentifiable
            where TDest : IIdentifiable
        {
            foreach (var source in sourceCol)
            {
                foreach (var destination in destinationCol)
                {
                    if (source.GetId() == destination.GetId())
                    {
                        //merge
                        Map(source, destination);
                    }
                }
            }
            //to insert
            var toInserts = sourceCol.Where(s => destinationCol.All(d => d.GetId() != s.GetId())).ToArray();

            foreach (var toInsert in toInserts)
            {
                var newItem = Map<TDest>(toInsert);
                insertCallback(newItem);
            }

            var toDeletes = destinationCol.Where(d => sourceCol.All(s => s.GetId() != d.GetId())).ToArray();
            foreach (var toDelete in toDeletes)
            {
                deleteCallback(toDelete);
            }

        }


        internal void MapList<T>(T[] sourceCol, T[] destinationCol, Action<T> insertCallback, Action<T> deleteCallback) where T : IIdentifiable
        {
            foreach (var source in sourceCol)
            {
                foreach (var destination in destinationCol)
                {
                    if (source.GetId() == destination.GetId())
                    {
                        Map(source, destination);
                    }
                }
            }
            
            var toInserts = sourceCol.Where(s => destinationCol.All(d => d.GetId() != s.GetId())).ToArray();
            foreach (var toInsert in toInserts)
            {
                insertCallback(toInsert);
            }

            var toDeletes = destinationCol.Where(d => sourceCol.All(s => s.GetId() != d.GetId())).ToArray();
            foreach (var toDelete in toDeletes)
            {
                deleteCallback(toDelete);
            }

        }

        public void MapList<TSource, TDest>(TSource[] toInserts, Action<TDest> insertCallback)
            where TSource : IIdentifiable
            where TDest : IIdentifiable
        {
            foreach (var toInsert in toInserts)
            {
                var newItem = Map<TDest>(toInsert);
                insertCallback(newItem);
            }
        }
    }
}