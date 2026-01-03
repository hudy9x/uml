import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface BackButtonProps {
  to?: string;
  onClick?: () => void;
  tooltip?: string;
  className?: string;
}

export function BackButton({
  to = '/welcome',
  onClick,
  tooltip = 'Back',
  className = ''
}: BackButtonProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    // Call custom onClick handler if provided
    if (onClick) {
      onClick();
    }

    // Navigate to the specified route
    navigate(to);
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClick}
            className={`h-8 w-8 ${className}`}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
