
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Search } from "lucide-react";

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FilterModal = ({ isOpen, onClose }: FilterModalProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("recent");
  const [category, setCategory] = useState("all");

  const handleApplyFilters = () => {
    // Here you would implement the actual filtering logic
    console.log("Applying filters:", { searchQuery, sortBy, category });
    onClose();
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setSortBy("recent");
    setCategory("all");
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
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

          {/* Categories */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Categories</h3>
            <RadioGroup defaultValue="all" value={category} onValueChange={setCategory}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="all" id="all" />
                <label htmlFor="all" className="text-sm">All</label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="adventure" id="adventure" />
                <label htmlFor="adventure" className="text-sm">Adventure</label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="city" id="city" />
                <label htmlFor="city" className="text-sm">City Breaks</label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="beach" id="beach" />
                <label htmlFor="beach" className="text-sm">Beach Holiday</label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="nature" id="nature" />
                <label htmlFor="nature" className="text-sm">Nature & Wildlife</label>
              </div>
            </RadioGroup>
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
