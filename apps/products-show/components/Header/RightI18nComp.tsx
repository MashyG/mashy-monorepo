"use client";

import { useState } from "react";

import { Languages } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { I18ns } from "@/utils/types";
import { getI18ns } from "@/utils/baseData";

export default function RightI18nComp(props: { lang: I18ns }) {
  const { lang } = props;
  const [position, setPosition] = useState(lang as string);
  const i18nList = getI18ns();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Languages />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuRadioGroup value={position} onValueChange={setPosition}>
          {i18nList.map((item) => (
            <DropdownMenuRadioItem key={item.key} value={item.key}>
              {item.value}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
