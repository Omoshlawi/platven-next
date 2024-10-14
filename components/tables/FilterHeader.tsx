"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React from "react";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

interface Props {}

const FilterHeader: React.FC<Props> = ({}) => {
  const { replace } = useRouter();
  const pathName = usePathname();
  const searchParams = useSearchParams();

  const handleSearch = useDebouncedCallback((value) => {
    const queryParams = new URLSearchParams(searchParams.toString());
    if (value) {
      queryParams.set("search", value);
    } else {
      queryParams.delete("search");
    }
    replace(`${pathName}?${queryParams.toString()}`);
  }, 300);

  return (
    <div className="flex flex-col md:flex-row md:space-x-2 max-md:space-y-2">
      <div className="flex-1">
        <Input
          className="min-w-[200px]"
          placeholder="Search...."
          onChange={({ target: { value } }) => {
            handleSearch(value);
          }}
          defaultValue={
            (searchParams.get("search") as string | undefined) ?? ""
          }
        />
      </div>
      <div className="flex-none md:w-52 ">
        <Select
          onValueChange={(value) => {
            const queryParams = new URLSearchParams(searchParams.toString());
            if (value) {
              queryParams.set("page_size", value);
            } else {
              queryParams.delete("page_size");
            }
            replace(`${pathName}?${queryParams.toString()}`);
          }}
          value={searchParams.get("page_size") as string | undefined}
        >
          <SelectTrigger className="">
            <SelectValue placeholder="Page size" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Size</SelectLabel>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default FilterHeader;
