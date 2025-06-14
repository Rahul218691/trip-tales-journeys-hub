import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Search } from "lucide-react";
import { TRIP_TYPES, TRANSPORTATION_TYPES } from "@/lib/constants";
import { ScrollArea } from "@/components/ui/scroll-area";

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  sortBy: "mostRecent" | "mostPopular" | "mostCommented";
  setSortBy: (value: "mostRecent" | "mostPopular" | "mostCommented") => void;
  selectedTripTypes: string[];
  setSelectedTripTypes: (value: string[] | ((prev: string[]) => string[])) => void;
  transportationType: string;
  setTransportationType: (value: string) => void;
  onApplyFilters: () => void;
  onResetFilters: () => void;
}

const FilterModal = ({ 
  isOpen, 
  onClose,
  searchQuery,
  setSearchQuery,
  sortBy,
  setSortBy,
  selectedTripTypes,
  setSelectedTripTypes,
  transportationType,
  setTransportationType,
  onApplyFilters,
  onResetFilters
}: FilterModalProps) => {
  
  const toggleTripType = (type: string) => {
    setSelectedTripTypes((prev: string[]) => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Filter Stories</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Search by location */}
          <div className="space-y-2">
            <label htmlFor="location" className="text-sm font-medium">
              Search by Location
            </label>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="location"
                placeholder="Search destinations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>

          {/* Sort by */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Sort By</h3>
            <RadioGroup value={sortBy} onValueChange={setSortBy}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="mostRecent" id="mostRecent" />
                <label htmlFor="mostRecent" className="text-sm">Most Recent</label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="mostPopular" id="mostPopular" />
                <label htmlFor="mostPopular" className="text-sm">Most Popular</label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="mostCommented" id="mostCommented" />
                <label htmlFor="mostCommented" className="text-sm">Most Commented</label>
              </div>
            </RadioGroup>
          </div>

          {/* Transportation Type */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Transportation Type</h3>
            <RadioGroup value={transportationType} onValueChange={setTransportationType}>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {TRANSPORTATION_TYPES.map((type) => (
                  <div key={type} className="flex items-center space-x-2">
                    <RadioGroupItem value={type} id={type} />
                    <label htmlFor={type} className="text-sm capitalize">{type}</label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </div>

          {/* Trip Types */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Trip Types</h3>
            <ScrollArea className="h-[200px] rounded-md border p-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {TRIP_TYPES.map((type) => (
                  <div key={type} className="flex items-center space-x-2">
                    <Checkbox
                      id={type}
                      checked={selectedTripTypes.includes(type)}
                      onCheckedChange={() => toggleTripType(type)}
                    />
                    <label
                      htmlFor={type}
                      className="text-sm capitalize cursor-pointer"
                    >
                      {type.replace(/-/g, ' ')}
                    </label>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>

        <div className="flex justify-between">
          <Button variant="outline" onClick={onResetFilters}>
            Reset
          </Button>
          <Button onClick={onApplyFilters}>
            Apply Filters
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FilterModal;
