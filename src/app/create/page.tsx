"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileUpload } from "@/components/file-upload"
import { ItineraryForm } from "@/components/itinerary-form"
import { useToast } from "@/hooks/use-toast"
import { processSpreadsheetData, parseCSV, parseExcel } from "@/lib/itinerary-processor"

export default function CreatePage() {
  const [activeTab, setActiveTab] = useState("upload")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleFileSelect = (file: File | null) => {
    setSelectedFile(file)
  }

  const handleContinueUpload = async () => {
    if (!selectedFile) {
      toast({
        title: "No file selected",
        description: "Please select a spreadsheet file to upload.",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)
    toast({
      title: "Processing file...",
      description: "Reading and processing your spreadsheet.",
    })

    try {
      let data: string[][] = [];
      const fileName = selectedFile.name.toLowerCase();

      if (fileName.endsWith(".csv")) {
        // Read CSV file
        const text = await selectedFile.text();
        data = parseCSV(text);
      } else if (fileName.endsWith(".xlsx") || fileName.endsWith(".xls")) {
        // Read Excel file (requires xlsx library)
        try {
          // Dynamically import xlsx only when needed
          const XLSX = await import("xlsx");
          const buffer = await selectedFile.arrayBuffer();
          const workbook = XLSX.read(buffer, { type: "buffer" });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          data = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as string[][];
        } catch (excelError) {
          console.error("Error processing Excel file:", excelError);
          toast({
            title: "Excel Processing Error",
            description: "Could not process the Excel file. Ensure the \"xlsx\" library is installed if running locally, or try uploading as CSV.",
            variant: "destructive",
          });
          setIsProcessing(false);
          return;
        }
      } else {
        throw new Error("Unsupported file type");
      }

      if (!data || data.length < 2) {
        throw new Error("Spreadsheet is empty or invalid format");
      }

      // Process the data (assuming processSpreadsheetData handles the logic)
      // In a real app, this might save to DB and redirect, or store in state
      const processedItinerary = processItineraryData(data);
      console.log("Processed Itinerary:", processedItinerary);

      // For now, just show success and log data
      toast({
        title: "File Processed Successfully!",
        description: `Processed itinerary: ${processedItinerary.title}`,
      })
      
      // TODO: Navigate to a preview page or display the itinerary
      // Example: router.push("/preview?data=" + JSON.stringify(processedItinerary));

    } catch (error: any) {
      console.error("Error handling file upload:", error);
      toast({
        title: "Error Processing File",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }
  
  const handleContinueManual = () => {
    // TODO: Implement logic for manual form submission
    toast({
        title: "Manual Entry Submitted (Placeholder)",
        description: "Manual entry processing not yet implemented.",
      })
    console.log("Manual form submitted (placeholder)");
  }

  return (
    <div className="container py-10">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight">Create Your Itinerary</h1>
          <p className="text-muted-foreground mt-2">
            Upload a spreadsheet or manually enter your travel details
          </p>
        </div>

        <Tabs defaultValue="upload" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upload">Upload Spreadsheet</TabsTrigger>
            <TabsTrigger value="manual">Manual Entry</TabsTrigger>
          </TabsList>
          
          <TabsContent value="upload" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Upload Spreadsheet</CardTitle>
                <CardDescription>
                  Upload your itinerary data in spreadsheet format (Excel or CSV)
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Pass the handler function to FileUpload */}
                <FileUpload onFileSelect={handleFileSelect} />
                
                <div className="mt-6">
                  <h3 className="text-sm font-medium mb-2">Template Format</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Your spreadsheet should follow this format:
                  </p>
                  <div className="bg-muted p-4 rounded-md overflow-x-auto">
                    <table className="min-w-full text-sm">
                      <thead>
                        <tr>
                          <th className="text-left p-2 border">Day</th>
                          <th className="text-left p-2 border">City</th>
                          <th className="text-left p-2 border">Date</th>
                          <th className="text-left p-2 border">Time</th>
                          <th className="text-left p-2 border">Category</th>
                          <th className="text-left p-2 border">Description</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="p-2 border">1</td>
                          <td className="p-2 border">Paris</td>
                          <td className="p-2 border">2025-05-01</td>
                          <td className="p-2 border">09:00</td>
                          <td className="p-2 border">Sightseeing</td>
                          <td className="p-2 border">Eiffel Tower visit</td>
                        </tr>
                        <tr>
                          <td className="p-2 border">1</td>
                          <td className="p-2 border">Paris</td>
                          <td className="p-2 border">2025-05-01</td>
                          <td className="p-2 border">12:30</td>
                          <td className="p-2 border">Food</td>
                          <td className="p-2 border">Lunch at Café de Paris</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="mt-4">
                    {/* TODO: Implement template download functionality */}
                    <Button variant="outline" size="sm" disabled>
                      Download Template
                    </Button>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => router.push("/")}>Cancel</Button>
                {/* Add onClick handler and disable while processing */}
                <Button onClick={handleContinueUpload} disabled={isProcessing}>
                  {isProcessing ? "Processing..." : "Continue"}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="manual" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Manual Entry</CardTitle>
                <CardDescription>
                  Enter your itinerary details manually
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium">Trip Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="trip-name">Trip Name</Label>
                        <Input id="trip-name" placeholder="European Vacation" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="trip-dates">Trip Dates</Label>
                        <div className="grid grid-cols-2 gap-2">
                          <Input type="date" id="start-date" />
                          <Input type="date" id="end-date" />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <ItineraryForm />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => router.push("/")}>Cancel</Button>
                <Button onClick={handleContinueManual}>Continue</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
