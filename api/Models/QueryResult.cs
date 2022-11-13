namespace api.Models;

public class QueryResult<DataType> : IQueryResult
{
    public int Status { get; set; }
    public string Message { get; set; }
    public DataType? Data { get; set; }

    public QueryResult(int status, string message, DataType? data)
    {
        this.Status = status;
        this.Message = message;

        if (data != null)
        {
            this.Data = data;
        }
    }
}