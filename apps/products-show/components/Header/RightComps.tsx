import { type HeaderRightData } from "@/utils/types";
import RightI18nComp from "./RightI18nComp";
import RightSearchComp from "./RightSearchComp";
import RightMenus from "./RightMenus";

export default function RightComps(data: HeaderRightData) {
  const { menus, searchBtn, lang } = data;
  return (
    <div className="flex items-center">
      <RightMenus menus={menus} />
      <RightSearchComp searchBtn={searchBtn} />
      <RightI18nComp lang={lang} />
    </div>
  );
}
