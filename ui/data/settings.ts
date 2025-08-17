export const dummyBusinesses = [
  { id: 1, name: "Main Shop", description: "Downtown branch", is_active: true, created_on: new Date().toISOString() },
  { id: 2, name: "Kampala Outlet", description: "Retail outlet", is_active: true, created_on: new Date().toISOString() },
  { id: 3, name: "Warehouse", description: "Storage & dispatch", is_active: false, created_on: new Date().toISOString() },
];

export const dummyUsers = [
  { id: 1, username: "admin", email: "admin@anacreon.app", role: "Admin", is_active: true },
  { id: 2, username: "clerk", email: "clerk@anacreon.app", role: "Clerk", is_active: true },
  { id: 3, username: "auditor", email: "auditor@anacreon.app", role: "Auditor", is_active: false },
];

export const dummyIntegrations = [
  { id: "webhooks", name: "Webhooks", status: "Connected" },
  { id: "payments", name: "Payments", status: "Not configured" },
  { id: "storage", name: "Cloud Storage", status: "Connected" },
];

export const dummyExpenditureCategories = [
  { id: 1, name: "Rent", description: "Monthly shop rent", is_active: true },
  { id: 2, name: "Utilities", description: "Electricity, water, internet", is_active: true },
  { id: 3, name: "Transport", description: "Delivery and supply transport", is_active: true },
  { id: 4, name: "Miscellaneous", description: "Other expenses", is_active: false },
];


