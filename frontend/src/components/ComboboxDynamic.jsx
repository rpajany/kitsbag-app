import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CheckIcon, ChevronsUpDownIcon } from "lucide-react";

export const ComboboxDynamic = ({
  comboValue,
  setComboValue,
  comboData,
  fetchDataOnOpen,
  styleCustom=""
}) => {
  const [open, setOpen] = useState(false);

  // <Popover open={open} onOpenChange={handleOpenChange}>
  //  onOpenChange(true) is triggered → isOpen becomes true
  const handleOpenChange = (isOpen) => {
    setOpen(isOpen);
    if (isOpen && typeof fetchDataOnOpen === "function") {
      fetchDataOnOpen(); // ✅ Call parent function on open
    }
  };

  return (
    <>
      <Popover open={open} onOpenChange={handleOpenChange} >
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={`w-full justify-between ${styleCustom}`} // w-[200px]
          >
            {comboValue
              ? comboData.find((item) => item.value === comboValue)?.label
              : "Select item..."}
            <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder="Search item..." />
            <CommandList>
              <CommandEmpty>No item found.</CommandEmpty>
              <CommandGroup>
                {comboData.map((item) => (
                  <CommandItem
                    key={item.value}
                    value={item.value}
                    onSelect={(currentValue) => {
                      setComboValue(
                        currentValue === comboValue ? "" : currentValue
                      );
                      setOpen(false);
                    }}
                  >
                    <CheckIcon
                      className={cn(
                        "mr-2 h-4 w-4",
                        comboValue === item.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {item.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </>
  );
};
