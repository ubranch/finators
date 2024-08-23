import React from 'react';
import { Button } from "@/components/ui/button"
import { BarChart, Table } from 'lucide-react';

interface ToggleViewButtonProps {
  isGraphicView: boolean;
  onToggle: () => void;
}

export function ToggleViewButton({ isGraphicView, onToggle }: ToggleViewButtonProps) {
  return (
    <Button onClick={onToggle} variant="outline" size="sm">
      {isGraphicView ? <Table className="h-4 w-4 mr-2" /> : <BarChart className="h-4 w-4 mr-2" />}
      {isGraphicView ? 'Table View' : 'Graphic View'}
    </Button>
  );
}
