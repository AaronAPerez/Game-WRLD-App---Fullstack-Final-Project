using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Configuration;

public class FileUploadSettings
{
    public long MaxFileSize { get; set; }
    public string[] AllowedExtensions { get; set; }
    public string UploadPath { get; set; }
}
