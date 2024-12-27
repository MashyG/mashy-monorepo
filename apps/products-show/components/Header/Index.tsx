import { getBaseData } from "@/utils/baseData";
import LeftComps from "./LeftComps";
import RightComps from "./RightComps";

export default function HeaderIndex() {
  const { headers } = getBaseData();
  const { leftData, rightData } = headers || {};

  return (
    <header className="flex justify-between items-center py-4 px-[20%] shadow-md">
      <LeftComps {...leftData} />
      <RightComps {...rightData} />
    </header>
  );
}
