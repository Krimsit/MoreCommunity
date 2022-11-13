namespace api.Models;

public class Community
{
    public long Id { get; set; }
    public string Avatar { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    public int Followers { get; set; }
    public string[] Keywords { get; set; }
}