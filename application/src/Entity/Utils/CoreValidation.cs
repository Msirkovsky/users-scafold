using System;
using JetBrains.Annotations;

namespace Scaffolding.Entity.Utils
{
    public static class CoreValidation
    {
        [AssertionMethod]
        [ContractAnnotation("obj:null => halt")]
        public static void NotNull(object obj, string message)
        {
            if (obj == null)
                throw new InvalidOperationException(message);
        }

        public static void NotEmpty(string obj, string message)
        {
            if (string.IsNullOrWhiteSpace(obj))
                throw new InvalidOperationException(message);
        }

        public static void True(bool condition, string message)
        {
            if (condition == false)
                throw new InvalidOperationException(message);
        }
    }
}