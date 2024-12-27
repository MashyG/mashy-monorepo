import { SearchButton } from "@/utils/types";
import { Button } from "../ui/button";
import { Search } from "lucide-react";

export default function RightSearchComp(props: { searchBtn: SearchButton }) {
  return (
    <div className="mx-4">
      <Button variant="link" size="icon">
        <Search />
      </Button>
      {/* 
        <Button asChild>
          <Link href="/login">Login</Link>
        </Button>
      */}
    </div>
  );
}
