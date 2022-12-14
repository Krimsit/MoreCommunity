using System.ComponentModel.DataAnnotations.Schema;

namespace api.Models;

public class Upload
{
    public long Id { get; set; }
    public string Type { get; set; } = String.Empty;
    public string Url { get; set; } = String.Empty;
    public string Name { get; set; } = String.Empty;
    public long? PostId { get; set; }
}

public class CreateUpload
{
    public long Id { get; set; }
    public string File { get; set; }
    public string? Folder { get; set; }
    public string Type { get; set; } = String.Empty;
    public string Name { get; set; } = String.Empty;
}

public class UploadPostFile
{
    public string Type { get; set; } = String.Empty;
    public string File { get; set; }
    public string Name { get; set; } = String.Empty;
}

public class UploadPostFiles
{
    public long PostId { get; set; }
    public string Folder { get; set; }
    public List<UploadPostFile> files { get; set; }
}