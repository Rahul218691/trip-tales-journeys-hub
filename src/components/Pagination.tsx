
import { 
  Pagination as PaginationContainer,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface PaginationProps {
  currentPage: number;
  onPageChange: (page: number) => void;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

const Pagination = ({ 
  currentPage, 
  onPageChange, 
  hasNextPage, 
  hasPrevPage 
}: PaginationProps) => {
  const handlePrevious = () => {
    if (hasPrevPage) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (hasNextPage) {
      onPageChange(currentPage + 1);
    }
  };
  
  return (
    <PaginationContainer>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious 
            onClick={handlePrevious} 
            className={`${!hasPrevPage ? 'pointer-events-none opacity-50' : 'cursor-pointer'}`} 
          />
        </PaginationItem>
        <PaginationItem>
          <PaginationNext 
            onClick={handleNext} 
            className={`${!hasNextPage ? 'pointer-events-none opacity-50' : 'cursor-pointer'}`} 
          />
        </PaginationItem>
      </PaginationContent>
    </PaginationContainer>
  );
};

export default Pagination;
