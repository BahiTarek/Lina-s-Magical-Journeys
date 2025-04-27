"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MapPin, Search } from "lucide-react"
import { GoogleMap } from "@/components/google-map"

export function MapIntegration({ cities = [] }) {
  const [activeTab, setActiveTab] = useState("overview")
  const [searchQuery, setSearchQuery] = useState("")
  const [mapCenter, setMapCenter] = useState({ lat: 48.8566, lng: 2.3522 }) // Default to Paris
  const [mapZoom, setMapZoom] = useState(5)

  // In a real implementation, these would be derived from the itinerary data
  const defaultCities = cities.length > 0 ? cities : [
    { name: "Paris", lat: 48.8566, lng: 2.3522 },
    { name: "Rome", lat: 41.9028, lng: 12.4964 },
    { name: "Barcelona", lat: 41.3851, lng: 2.1734 }
  ]

  const [selectedCities, setSelectedCities] = useState(defaultCities)

  const handleSearch = (e) => {
    e.preventDefault()
    // In a real implementation, this would search for the city using a geocoding API
    console.log("Searching for:", searchQuery)
  }

  const handleCitySelect = (city) => {
    setActiveTab(city.name)
    setMapCenter({ lat: city.lat, lng: city.lng })
    setMapZoom(12)
  }

  return (
    <div className="space-y-4">
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            {selectedCities.map((city) => (
              <TabsTrigger key={city.name} value={city.name}>
                {city.name}
              </TabsTrigger>
            ))}
          </TabsList>
          
          <form onSubmit={handleSearch} className="relative">
            <Input
              placeholder="Search for a city"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-10 w-[200px]"
            />
            <Button 
              type="submit" 
              variant="ghost" 
              size="icon" 
              className="absolute right-0 top-0 h-full"
            >
              <Search className="h-4 w-4" />
            </Button>
          </form>
        </div>
        
        <Card>
          <CardContent className="p-0">
            <TabsContent value="overview" className="m-0">
              <div className="h-[500px] relative">
                <GoogleMap 
                  center={{ lat: 45.0, lng: 10.0 }} 
                  zoom={4}
                  markers={selectedCities}
                />
                
                <div className="absolute top-4 left-4 bg-background/90 backdrop-blur-sm p-4 rounded-lg shadow-md max-w-xs">
                  <h3 className="text-sm font-medium mb-2">Trip Overview</h3>
                  <ul className="space-y-2">
                    {selectedCities.map((city, index) => (
                      <li key={city.name} className="flex items-center text-sm">
                        <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center text-white text-xs mr-2">
                          {index + 1}
                        </div>
                        <Button 
                          variant="link" 
                          className="p-0 h-auto font-normal"
                          onClick={() => handleCitySelect(city)}
                        >
                          {city.name}
                        </Button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </TabsContent>
            
            {selectedCities.map((city) => (
              <TabsContent key={city.name} value={city.name} className="m-0">
                <div className="h-[500px] relative">
                  <GoogleMap 
                    center={{ lat: city.lat, lng: city.lng }} 
                    zoom={12}
                    markers={[city]}
                  />
                  
                  <div className="absolute top-4 left-4 bg-background/90 backdrop-blur-sm p-4 rounded-lg shadow-md max-w-xs">
                    <h3 className="text-sm font-medium mb-2 flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {city.name}
                    </h3>
                    <p className="text-xs text-muted-foreground mb-2">
                      Points of Interest
                    </p>
                    <ul className="space-y-1 text-sm">
                      <li>• Eiffel Tower</li>
                      <li>• Louvre Museum</li>
                      <li>• Notre-Dame Cathedral</li>
                    </ul>
                  </div>
                </div>
              </TabsContent>
            ))}
          </CardContent>
        </Card>
      </Tabs>
    </div>
  )
}
