"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { PlusCircle, Trash2 } from "lucide-react"

export function ItineraryForm() {
  const [days, setDays] = useState([
    {
      id: 1,
      city: "",
      date: "",
      activities: [
        {
          id: 1,
          time: "",
          category: "",
          description: ""
        }
      ]
    }
  ])

  const addDay = () => {
    const newDay = {
      id: days.length + 1,
      city: "",
      date: "",
      activities: [
        {
          id: 1,
          time: "",
          category: "",
          description: ""
        }
      ]
    }
    setDays([...days, newDay])
  }

  const removeDay = (dayId) => {
    if (days.length > 1) {
      setDays(days.filter(day => day.id !== dayId))
    }
  }

  const addActivity = (dayId) => {
    setDays(days.map(day => {
      if (day.id === dayId) {
        return {
          ...day,
          activities: [
            ...day.activities,
            {
              id: day.activities.length + 1,
              time: "",
              category: "",
              description: ""
            }
          ]
        }
      }
      return day
    }))
  }

  const removeActivity = (dayId, activityId) => {
    setDays(days.map(day => {
      if (day.id === dayId) {
        if (day.activities.length > 1) {
          return {
            ...day,
            activities: day.activities.filter(activity => activity.id !== activityId)
          }
        }
      }
      return day
    }))
  }

  const updateDay = (dayId, field, value) => {
    setDays(days.map(day => {
      if (day.id === dayId) {
        return { ...day, [field]: value }
      }
      return day
    }))
  }

  const updateActivity = (dayId, activityId, field, value) => {
    setDays(days.map(day => {
      if (day.id === dayId) {
        return {
          ...day,
          activities: day.activities.map(activity => {
            if (activity.id === activityId) {
              return { ...activity, [field]: value }
            }
            return activity
          })
        }
      }
      return day
    }))
  }

  return (
    <div className="space-y-8">
      {days.map((day) => (
        <div key={day.id} className="border rounded-lg p-4 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-medium">Day {day.id}</h3>
            {days.length > 1 && (
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => removeDay(day.id)}
                aria-label="Remove day"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor={`day-${day.id}-city`}>City</Label>
              <Input 
                id={`day-${day.id}-city`} 
                placeholder="Paris" 
                value={day.city}
                onChange={(e) => updateDay(day.id, 'city', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`day-${day.id}-date`}>Date</Label>
              <Input 
                type="date" 
                id={`day-${day.id}-date`} 
                value={day.date}
                onChange={(e) => updateDay(day.id, 'date', e.target.value)}
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <h4 className="text-sm font-medium">Activities</h4>
            {day.activities.map((activity) => (
              <div key={activity.id} className="grid grid-cols-12 gap-2 items-start">
                <div className="col-span-2">
                  <Label htmlFor={`day-${day.id}-activity-${activity.id}-time`} className="sr-only">Time</Label>
                  <Input 
                    id={`day-${day.id}-activity-${activity.id}-time`} 
                    placeholder="09:00" 
                    value={activity.time}
                    onChange={(e) => updateActivity(day.id, activity.id, 'time', e.target.value)}
                  />
                </div>
                <div className="col-span-3">
                  <Label htmlFor={`day-${day.id}-activity-${activity.id}-category`} className="sr-only">Category</Label>
                  <Select 
                    value={activity.category}
                    onValueChange={(value) => updateActivity(day.id, activity.id, 'category', value)}
                  >
                    <SelectTrigger id={`day-${day.id}-activity-${activity.id}-category`}>
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Sightseeing">Sightseeing</SelectItem>
                      <SelectItem value="Food">Food</SelectItem>
                      <SelectItem value="Transportation">Transportation</SelectItem>
                      <SelectItem value="Accommodation">Accommodation</SelectItem>
                      <SelectItem value="Activity">Activity</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-6">
                  <Label htmlFor={`day-${day.id}-activity-${activity.id}-description`} className="sr-only">Description</Label>
                  <Textarea 
                    id={`day-${day.id}-activity-${activity.id}-description`} 
                    placeholder="Description" 
                    className="min-h-[60px]"
                    value={activity.description}
                    onChange={(e) => updateActivity(day.id, activity.id, 'description', e.target.value)}
                  />
                </div>
                <div className="col-span-1 flex justify-center pt-3">
                  {day.activities.length > 1 && (
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => removeActivity(day.id, activity.id)}
                      aria-label="Remove activity"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-2"
              onClick={() => addActivity(day.id)}
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Activity
            </Button>
          </div>
        </div>
      ))}
      
      <Button 
        variant="outline" 
        onClick={addDay}
      >
        <PlusCircle className="h-4 w-4 mr-2" />
        Add Day
      </Button>
    </div>
  )
}
