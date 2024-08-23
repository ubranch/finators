// src/components/AmountFormatSelector.tsx
"use client"

import * as React from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface AmountFormatSelectorProps {
  onFormatChange: (format: string) => void
}

export function AmountFormatSelector({ onFormatChange }: AmountFormatSelectorProps) {
  const [selectedFormat, setSelectedFormat] = React.useState("default")

  const handleFormatChange = (format: string) => {
    setSelectedFormat(format)
    onFormatChange(format)
  }

  return (
    <Select value={selectedFormat} onValueChange={handleFormatChange}>
      <SelectTrigger className="w-[150px]">
        <SelectValue placeholder="Amount Format" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="default">Default</SelectItem>
        <SelectItem value="thousands">Thousands</SelectItem>
        <SelectItem value="millions">Millions</SelectItem>
      </SelectContent>
    </Select>
  )
}
