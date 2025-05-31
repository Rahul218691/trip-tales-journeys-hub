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
}

const FilterModal = ({ isOpen, onClose }: FilterModalProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("recent");
  const [selectedTripTypes, setSelectedTripTypes] = useState<string[]>([]);
  const [transportationType, setTransportationType] = useState("");

  const handleApplyFilters = () => {
    // Here you would implement the actual filtering logic
    console.log("Applying filters:", { 
      searchQuery, 
      sortBy, 
      tripTypes: selectedTripTypes,
      transportationType 
    });
    onClose();
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setSortBy("recent");
    setSelectedTripTypes([]);
    setTransportationType("");
  };

  const toggleTripType = (type: string) => {
    setSelectedTripTypes(prev => 
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
            <RadioGroup defaultValue="recent" value={sortBy} onValueChange={setSortBy}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="recent" id="recent" />
                <label htmlFor="recent" className="text-sm">Most Recent</label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="popular" id="popular" />
                <label htmlFor="popular" className="text-sm">Most Popular</label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="commented" id="commented" />
                <label htmlFor="commented" className="text-sm">Most Commented</label>
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
          <Button variant="outline" onClick={handleResetFilters}>
            Reset
          </Button>
          <Button onClick={handleApplyFilters}>
            Apply Filters
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FilterModal;
