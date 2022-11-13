namespace api.Models;

public interface IQueryResult
{
    int Status { get; set; }
    string Message { get; set; }
}