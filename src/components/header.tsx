import { Link } from "@tanstack/react-router";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

export const Header = () => {
  return (
    <header className="relative w-full !fixed top-0 left-0 right-0 z-50 backdrop-blur">
      <div
        className="w-full max-w-screen-xl mx-auto px-4"
        style={{ maxWidth: "1340px" }}
      >
        <div className="flex items-center justify-between h-16">
          <div>
            <span className="font-semibold">sample</span>
            <span className="font-semibold">/market</span>
          </div>
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem className="!bg-transparent">
                <Link to="/" legacyBehavior passHref>
                  <NavigationMenuLink
                    className={`
                      ${navigationMenuTriggerStyle()} 
                      !bg-transparent
                      hover:!bg-zinc-900
                      hover:!bg-opacity-40
                    `}
                  >
                    Browse
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem className="!bg-transparent">
                <Link to="/upload" legacyBehavior passHref>
                  <NavigationMenuLink
                    className={`
                      ${navigationMenuTriggerStyle()} 
                      !bg-transparent
                      hover:!bg-zinc-900
                      hover:!bg-opacity-40
                    `}
                  >
                    Upload
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Genres</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <NavigationMenuLink>Link</NavigationMenuLink>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        {/* Pseudo-element for the bottom border */}
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-zinc-700"></div>
      </div>
    </header>
  );
};
