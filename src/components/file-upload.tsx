"use client"

import { useState } from "react"
import { Upload, FileText, AlertCircle, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface FileUploadProps {
  onFileSelect: (file: File | null) => void;
}

export function FileUpload({ onFileSelect }: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setError(null)
    setFile(null) // Reset file state first
    onFileSelect(null) // Notify parent that file is reset
    
    if (!selectedFile) {
      return
    }
    
    // Check file type
    const validTypes = [
      // Excel types
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      // CSV type
      "text/csv",
      // Google Sheets export (often CSV or Excel)
      "application/vnd.google-apps.spreadsheet"
    ];
    const validExtensions = [".csv", ".xlsx", ".xls"];
    
    const fileType = selectedFile.type;
    const fileName = selectedFile.name.toLowerCase();
    const fileExtension = fileName.substring(fileName.lastIndexOf("."));

    const isValidType = validTypes.includes(fileType);
    const isValidExtension = validExtensions.includes(fileExtension);

    // Allow if either type or extension is valid, as type might be generic
    if (!isValidType && !isValidExtension) {
      setError("Please upload a valid spreadsheet file (Excel or CSV)");
      return;
    }
    
    // Check file size (max 5MB)
    if (selectedFile.size > 5 * 1024 * 1024) {
      setError("File size exceeds 5MB limit");
      return;
    }
    
    setFile(selectedFile)
    onFileSelect(selectedFile) // Pass the selected file to the parent component
  }

  return (
    <div className="space-y-4">
      <div className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-muted/50 transition-colors">
        <input
          type="file"
          id="file-upload"
          className="hidden"
          onChange={handleFileChange}
          accept=".csv,.xlsx,.xls,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/csv"
        />
        <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
          <Upload className="h-10 w-10 text-muted-foreground mb-2" />
          <p className="text-sm font-medium mb-1">
            {file ? file.name : "Drag and drop your file here or click to browse"}
          </p>
          <p className="text-xs text-muted-foreground">
            Supports Excel (.xlsx, .xls) and CSV (.csv) files (max 5MB)
          </p>
        </label>
      </div>
      
      {file && (
        <Alert variant="default" className="bg-blue-50 text-blue-800 border-blue-200">
          <FileText className="h-4 w-4 mr-2" />
          <AlertDescription>
            Selected file: {file.name} ({(file.size / 1024).toFixed(1)} KB)
          </AlertDescription>
        </Alert>
      )}
      
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4 mr-2" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  )
}
