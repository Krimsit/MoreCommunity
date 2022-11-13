namespace api.Models;

public interface IQueryResult
{
    protected int Status { get; set; }
    protected int Message { get; set; }
}