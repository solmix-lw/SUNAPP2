export interface AvailablePage {
  path: string;
  name: string;
  translationKey?: string;
  iconName: string;
  category: "main" | "garage";
  testId: string;
}

export const AVAILABLE_PAGES: AvailablePage[] = [
  { path: "/", name: "Dashboard", translationKey: "dashboard", iconName: "BarChart3", category: "main", testId: "link-dashboard" },
  { path: "/my-work", name: "My Work", iconName: "Briefcase", category: "main", testId: "link-my-work" },
  { path: "/equipment", name: "Equipment", translationKey: "equipment", iconName: "Home", category: "main", testId: "link-equipment" },
  { path: "/parts", name: "Spare Parts", translationKey: "spareParts", iconName: "Wrench", category: "main", testId: "link-parts" },
  { path: "/maintenance", name: "Maintenance History", translationKey: "maintenanceHistory", iconName: "ClipboardList", category: "main", testId: "link-maintenance" },
  { path: "/models", name: "3D Models", translationKey: "models3D", iconName: "Box", category: "main", testId: "link-models" },
  { path: "/upload", name: "Upload Model", translationKey: "uploadModel", iconName: "Upload", category: "main", testId: "link-upload" },
  { path: "/items", name: "Items", iconName: "Package", category: "main", testId: "link-items" },
  { path: "/garages", name: "Garages", translationKey: "garages", iconName: "Building2", category: "garage", testId: "link-garages" },
  { path: "/equipment-reception", name: "Equipment Reception", iconName: "Truck", category: "garage", testId: "link-equipment-reception" },
  { path: "/equipment-maintenances", name: "Equipment Maintenances", iconName: "ClipboardCheck", category: "garage", testId: "link-equipment-maintenances" },
  { path: "/inspection", name: "Inspection", iconName: "Search", category: "garage", testId: "link-inspection" },
  { path: "/employees", name: "Employees", translationKey: "employees", iconName: "Users", category: "garage", testId: "link-employees" },
  { path: "/approvals", name: "Approvals", translationKey: "approvals", iconName: "CheckCircle", category: "garage", testId: "link-approvals" },
  { path: "/work-orders", name: "Work Orders", translationKey: "workOrders", iconName: "FileText", category: "garage", testId: "link-work-orders" },
  { path: "/archived-work-orders", name: "Archived Work Orders", iconName: "Archive", category: "garage", testId: "link-archived-work-orders" },
  { path: "/parts-locations", name: "Parts Locations", translationKey: "partsLocations", iconName: "MapPin", category: "garage", testId: "link-parts-locations" },
  { path: "/store-manager", name: "Store Manager", iconName: "Store", category: "garage", testId: "link-store-manager" },
  { path: "/foreman", name: "Foreman Dashboard", iconName: "UserCheck", category: "garage", testId: "link-foreman" },
  { path: "/verifier", name: "Verifier Dashboard", iconName: "ClipboardSignature", category: "garage", testId: "link-verifier" },
  { path: "/team-performance", name: "Team Performance", iconName: "Trophy", category: "garage", testId: "link-team-performance" },
  { path: "/fleet-tracking", name: "Fleet Tracking", iconName: "Navigation", category: "garage", testId: "link-fleet-tracking" },
  { path: "/cost-reports", name: "Cost Reports", iconName: "DollarSign", category: "garage", testId: "link-cost-reports" },
  { path: "/admin-settings", name: "Admin Settings", translationKey: "adminSettings", iconName: "Settings", category: "garage", testId: "link-admin-settings" },
];

export function getAllPagePaths(): string[] {
  return AVAILABLE_PAGES.map(page => page.path);
}

export function getPageByPath(path: string): AvailablePage | undefined {
  return AVAILABLE_PAGES.find(page => page.path === path);
}

export function getMainPages(): AvailablePage[] {
  return AVAILABLE_PAGES.filter(page => page.category === "main");
}

export function getGaragePages(): AvailablePage[] {
  return AVAILABLE_PAGES.filter(page => page.category === "garage");
}
