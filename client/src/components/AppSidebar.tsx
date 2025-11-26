import { Home, Wrench, Box, Upload, ClipboardList, Building2, Users, FileText, BookOpen, MapPin, CheckCircle, Truck, Settings, ClipboardCheck, Search, Package, BarChart3, Store, Trophy, UserCheck, ClipboardSignature, Briefcase, Navigation, Archive, DollarSign, LucideIcon } from "lucide-react";
import { Link, useLocation } from "wouter";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { useLanguage } from "@/contexts/LanguageContext";
import { useQuery } from "@tanstack/react-query";
import { getMainPages, getGaragePages, type AvailablePage } from "@/lib/available-pages";

const iconMap: Record<string, LucideIcon> = {
  Home, Wrench, Box, Upload, ClipboardList, Building2, Users, FileText, 
  BookOpen, MapPin, CheckCircle, Truck, Settings, ClipboardCheck, Search, 
  Package, BarChart3, Store, Trophy, UserCheck, ClipboardSignature, 
  Briefcase, Navigation, Archive, DollarSign,
};

export function AppSidebar() {
  const [location] = useLocation();
  const { t } = useLanguage();

  const { data: appCustomizations } = useQuery({
    queryKey: ["/api/app-customizations"],
  });

  const { data: authData } = useQuery({
    queryKey: ["/api/auth/me"],
  });

  const user = (authData as any)?.user;
  const permissions = (authData as any)?.user?.pagePermissions || [];

  const hasPageAccess = (pagePath: string): boolean => {
    if (user?.role?.toLowerCase() === 'ceo' || user?.role?.toLowerCase() === 'admin') {
      return true;
    }
    const permission = permissions.find((p: any) => p.pagePath === pagePath);
    if (!permission) {
      return true;
    }
    return permission.isAllowed;
  };

  const getTitle = (page: AvailablePage): string => {
    if (page.translationKey) {
      return t(page.translationKey);
    }
    return page.name;
  };

  const getIcon = (iconName: string): LucideIcon => {
    return iconMap[iconName] || Box;
  };

  const mainMenuItems = getMainPages();
  const garageMenuItems = getGaragePages();

  return (
    <Sidebar>
      <SidebarHeader className="p-6">
        <div className="flex items-center gap-2">
          {(appCustomizations as any)?.logoUrl ? (
            <div className="flex h-9 w-9 items-center justify-center">
              <img
                src={(appCustomizations as any).logoUrl}
                alt="Company Logo"
                className="max-h-full max-w-full object-contain"
                data-testid="img-sidebar-logo"
              />
            </div>
          ) : (
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary">
              <Wrench className="h-5 w-5 text-primary-foreground" />
            </div>
          )}
          <div className="flex flex-col">
            <span className="text-base font-semibold">
              {(appCustomizations as any)?.appName || t("appName")}
            </span>
            <span className="text-xs text-muted-foreground">{t("heavyEquipment")}</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{t("navigation")}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainMenuItems.filter(item => hasPageAccess(item.path)).map((item) => {
                const Icon = getIcon(item.iconName);
                return (
                  <SidebarMenuItem key={item.path}>
                    <SidebarMenuButton asChild isActive={location === item.path}>
                      <Link href={item.path} data-testid={item.testId}>
                        <Icon className="h-4 w-4" />
                        <span>{getTitle(item)}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>{t("garageManagement")}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {garageMenuItems.filter(item => hasPageAccess(item.path)).map((item) => {
                const Icon = getIcon(item.iconName);
                return (
                  <SidebarMenuItem key={item.path}>
                    <SidebarMenuButton asChild isActive={location === item.path}>
                      <Link href={item.path} data-testid={item.testId}>
                        <Icon className="h-4 w-4" />
                        <span>{getTitle(item)}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4 border-t">
        <div className="text-xs text-muted-foreground text-center">
          {/* Footer content can be added here if needed */}
        </div>
      </SidebarFooter>
    </Sidebar >
  );
}
