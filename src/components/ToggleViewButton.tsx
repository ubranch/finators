import { BarChart, Table } from "lucide-react";
import React from "react";

import { Button } from "@/components/ui/button";

interface ToggleViewButtonProps {
  readonly isGraphicView: boolean;
  readonly onToggle: () => void;
}

export function ToggleViewButton({
  isGraphicView,
  onToggle,
}: ToggleViewButtonProps) {
  return (
    <Button
      onClick={onToggle}
      variant={isGraphicView ? "secondary" : "outline"}
      size="sm"
    >
      {isGraphicView ? (
        <BarChart className="h-4 w-4 mr-2" />
      ) : (
        <Table className="h-4 w-4 mr-2" />
      )}
      {isGraphicView ? "Graphic View" : "Table View"}
    </Button>
  );
}
