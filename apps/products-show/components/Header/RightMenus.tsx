import { type MenuItem } from "@/utils/types";
import Link from "next/link";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

export default function RightMenus(props: { menus: MenuItem[] }) {
  const { menus } = props;
  return (
    <div className="hidden sm:block">
    <NavigationMenu>
      <NavigationMenuList>
        {menus.map((menu) => (
          <NavigationMenuItem key={menu.key}>
            <Link href={menu.key} legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                {menu.name}
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>

    </div>
  );
}
