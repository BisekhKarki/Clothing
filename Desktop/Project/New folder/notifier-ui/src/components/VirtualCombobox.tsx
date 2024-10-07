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
import { cn } from "@/lib/utils";
import { useVirtualizer } from "@tanstack/react-virtual";
import { Check, ChevronsUpDown } from "lucide-react";
import * as React from "react";
import { FormControl } from "./ui/form";

type Option = {
  value: string;
  label: string;
  securityName: string;
};

interface VirtualizedCommandProps {
  height: string;
  options: Option[];
  placeholder: string;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  form?: any;
  field?: any;
}

const VirtualizedCommand = ({
  height,
  options,
  placeholder,
  form,
  field,
  setOpen,
}: VirtualizedCommandProps) => {
  const [filteredOptions, setFilteredOptions] =
    React.useState<Option[]>(options);
  const parentRef = React.useRef(null);

  const virtualizer = useVirtualizer({
    count: filteredOptions.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 50,
    overscan: 5,
  });

  const virtualOptions = virtualizer.getVirtualItems();

  const handleSearch = (search: string) => {
    setFilteredOptions(
      options.filter(
        (option) =>
          option.value.toLowerCase().includes(search.toLowerCase()) ||
          option.securityName.toLowerCase().includes(search.toLowerCase())
      )
    );
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
    }
  };

  return (
    <Command
      shouldFilter={false}
      onKeyDown={handleKeyDown}
      className="text-white bg-black w-full"
    >
      <CommandInput onValueChange={handleSearch} placeholder={placeholder} />
      <CommandEmpty>No item found.</CommandEmpty>
      <CommandGroup
        ref={parentRef}
        style={{
          height: height,
          width: "100%",
          overflow: "auto",
        }}
      >
        <div
          style={{
            height: `${virtualizer.getTotalSize()}px`,
            width: "100%",
            position: "relative",
          }}
        >
          <CommandList>
            {virtualOptions.map((virtualOption) => (
              <CommandItem
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: `${virtualOption.size}px`,

                  transform: `translateY(${virtualOption.start}px)`,
                }}
                className="text-[#fff] hover:bg-[#252525] hover:text-[#fff] cursor-pointer w-full  py-4"
                key={filteredOptions[virtualOption.index].value}
                value={filteredOptions[virtualOption.index].value}
                onSelect={() => {
                  form.setValue(
                    "symbol",
                    filteredOptions[virtualOption.index].value
                  );

                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    field.value === filteredOptions[virtualOption.index].value
                      ? "opacity-100"
                      : "opacity-0"
                  )}
                />
                <div className="flex flex-col items-start">
                  {filteredOptions[virtualOption.index].label}
                  <span className="">
                    {" "}
                    - {filteredOptions[virtualOption.index].securityName}
                  </span>
                </div>
              </CommandItem>
            ))}
          </CommandList>
        </div>
      </CommandGroup>
    </Command>
  );
};

interface VirtualizedComboboxProps {
  options: { symbol: string; securityName: string }[];
  field?: any;
  searchPlaceholder?: string;
  width?: string;
  height?: string;
  form?: any;
  isDisabled?: boolean;
}

export function VirtualizedCombobox({
  options,
  searchPlaceholder = "Search items...",
  width = "100%",
  height = "400px",
  field,
  form,
  isDisabled = false,
}: VirtualizedComboboxProps) {
  const [open, setOpen] = React.useState<boolean>(false);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <FormControl>
          <Button
            variant="outline"
            role="combobox"
            disabled={isDisabled}
            aria-expanded={open}
            className={`w-full justify-between text-[#fff] bg-transparent ${
              !field.value && "text-muted-foreground"
            }`}
            style={{
              width: width,
            }}
          >
            {field.value
              ? options
                  .find((option) => option.symbol === field.value)
                  ?.symbol.toString()
              : searchPlaceholder}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </FormControl>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-[480px]">
        <VirtualizedCommand
          height={height}
          options={options.map((option) => ({
            value: option.symbol,
            label: option.symbol,
            securityName: option.securityName,
          }))}
          placeholder={searchPlaceholder}
          form={form}
          setOpen={setOpen}
          field={field}
        />
      </PopoverContent>
    </Popover>
  );
}
