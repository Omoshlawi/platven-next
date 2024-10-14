"use client";

import { Button } from "@/components/ui/button";
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
import { Separator } from "@/components/ui/separator";
import { PropertyType } from "@prisma/client";
import dynamic from "next/dynamic";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
const ReactSelect = dynamic(() => import("react-select"), {
  ssr: false, // Prevent SSR
});
const CreatableSelect = dynamic(() => import("react-select/creatable"), {
  ssr: false, // Prevent SSR
});

const FilterForm = () => {
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const pathName = usePathname();

  const [types, setTypes] = useState<PropertyType[]>([]);

  useEffect(() => {
    (async () => {
      const response = await fetch("/api/property-types");
      if (response.ok) {
        const data: PropertyType[] = await response.json();
        setTypes(data);
      }
    })();
  }, []);

  const handleSearch = useDebouncedCallback((key, value) => {
    const queryParams = new URLSearchParams(searchParams.toString());
    if (value) {
      queryParams.set(key, value);
    } else {
      queryParams.delete(key);
    }
    replace(`${pathName}?${queryParams.toString()}`);
  }, 300);

  return (
    <div className="w-full border rounded-lg shadow">
      {/* Header */}
      <div className="p-2 ">
        <div className="w-full flex justify-between items-center mb-2 ">
          <span className="font-bold">Filters</span>
          <Button variant={"link"} onClick={() => replace(pathName)}>
            Clear all
          </Button>
        </div>
        {/* seach */}
        <Input
          name="search"
          placeholder="Seach ..."
          defaultValue={searchParams.get("search") ?? ""}
          onChange={({ target: { value, name } }) => handleSearch(name, value)}
        />

        <div className="w-full my-4">
          <Select
            name="status"
            defaultValue={searchParams.get("status") ?? undefined}
            onValueChange={(value) => handleSearch("status", value)}
          >
            <SelectTrigger>
              <SelectValue
                placeholder="Select Status"
                defaultValue={searchParams.get("status") ?? undefined}
              />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Property status</SelectLabel>
                {[
                  { id: "onSale", label: "On sale" },
                  { id: "onRent", label: "On rent" },
                ].map(({ id, label }, index) => (
                  <SelectItem key={index} value={id}>
                    {label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="w-full my-4">
          <Select
            name="roadAccessNature"
            defaultValue={searchParams.get("roadAccessNature") ?? undefined}
            onValueChange={(value) => handleSearch("roadAccessNature", value)}
          >
            <SelectTrigger>
              <SelectValue
                placeholder="Select road access nature"
                defaultValue={searchParams.get("roadAccessNature") ?? undefined}
              />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Road access Nature</SelectLabel>
                {[
                  { id: "Highway", label: "Highway" },
                  { id: "Tarmac", label: "Tarmac" },
                  { id: "Murram", label: "Murram" },
                ].map(({ id, label }, index) => (
                  <SelectItem key={index} value={id}>
                    {label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="w-full my-4">
          <Select
            name="typeId"
            // disabled={loading}
            onValueChange={(value) => handleSearch("typeId", value)}
            defaultValue={searchParams.get("typeId") ?? undefined}
          >
            <SelectTrigger>
              <SelectValue
                defaultValue={searchParams.get("status") ?? undefined}
                placeholder="Select type"
              />
            </SelectTrigger>
            <SelectContent>
              {/* @ts-ignore  */}
              {types.map((type) => (
                <SelectItem key={type.id} value={type.id}>
                  {type.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Separator className="mt-4" />
      {/* price */}
      <div className="p-2">
        <span className="uppercase opacity-30">Price</span>
        <div className="w-full grid grid-cols-2 gap-2">
          <Input
            name="minPrice"
            type="number"
            placeholder="Min price"
            defaultValue={searchParams.get("minPrice") ?? ""}
            onChange={({ target: { value, name } }) =>
              handleSearch(name, value)
            }
          />
          <Input
            type="number"
            name="maxPrice"
            placeholder="Max price"
            defaultValue={searchParams.get("maxPrice") ?? ""}
            onChange={({ target: { value, name } }) =>
              handleSearch(name, value)
            }
          />
        </div>
      </div>
      <Separator className="mt-4" />
    </div>
  );
};

export default FilterForm;
