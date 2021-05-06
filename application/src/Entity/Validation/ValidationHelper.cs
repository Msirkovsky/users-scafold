using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;

namespace Scaffolding.Entity.Validation
{
    public interface ISimpleValidatorResult
    {
        string ToHtmlString();
        bool IsOk { get; }
        bool HasError { get; }
        string[] GetMessages();
    }

    public class SimpleValidator : ISimpleValidatorResult
    {
        private readonly List<ValidationError> _errors = new List<ValidationError>();

        public string ToHtmlString() => string.Join("<br/>", GetMessages());
        public void HasValue(string name, string val)
        {
            if (string.IsNullOrWhiteSpace(val))
                _errors.Add(new ValidationError($"Pole {name} musí být vyplněno.", name));
        }

        public void HasValue(string name, int? val)
        {
            if (val.HasValue == false)
                _errors.Add(new ValidationError($"Pole {name} musí být vyplněno.", name));
        }

        public void HasValue(string name, DateTime? val)
        {
            if (val.HasValue == false)
                _errors.Add(new ValidationError($"Pole {name} musí být vyplněno.", name));
        }

        public void HasValue(string name, decimal? val)
        {
            if (val.HasValue == false)
                _errors.Add(new ValidationError($"Pole {name} musí být vyplněno.", name));
        }

        public void HasValue(string name, bool? val)
        {
            if (val.HasValue == false)
                _errors.Add(new ValidationError($"Pole {name} musí být vyplněno.", name));
        }


        public void HasValue(string name, Guid? val)
        {
            if (val.HasValue == false || val.Value == Guid.Empty)
                _errors.Add(new ValidationError($"Pole {name} musí být vyplněno.", name));
        }

        public bool IsOk => _errors.Count == 0;
        public bool HasError => IsOk == false;

        public string[] GetMessages()
        {
            return _errors.Select(x => x.Message).ToArray();
        }

        public void IsEmail(string name, string val)
        {
            if (val == null)
                return;

            var regex = new Regex(@"^([\w\.\-]+)@([\w\-]+)((\.(\w){2,3})+)$");
            var match = regex.Match(val);
            if (match.Success == false)
                _errors.Add(new ValidationError($"{name} neni ve správném formátu.", name));

        }

        public void Custom(string message, bool val)
        {
            if (val == false)
                _errors.Add(new ValidationError(message, ""));
        }

        
        public void Assert(string message, bool val)
        {
            if (val == false)
                _errors.Add(new ValidationError(message, ""));
        }

        public void Add(string errorMessage)
        {
            _errors.Add(new ValidationError(errorMessage, ""));
        }

        public void AddRange(string[] messages)
        {
            _errors.AddRange(
                messages.Select(x => new ValidationError(x, "")).ToArray()
            );
        }

    }

    public class ValidationError
    {
        public ValidationError(string message, string property)
        {
            Message = message;
            Property = property;
        }

        public string Message { get; set; }
        public string Property { get; set; }
    }
}
