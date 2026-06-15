export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    minimumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-AU", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatDateTime(dateStr: string): string {
  return new Date(dateStr).toLocaleString("en-AU", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function getStatusColor(status: string): string {
  const map: Record<string, string> = {
    // Orders
    Pending: "bg-yellow-100 text-yellow-800",
    Confirmed: "bg-blue-100 text-blue-800",
    Preparing: "bg-purple-100 text-purple-800",
    "Out for Delivery": "bg-orange-100 text-orange-800",
    Delivered: "bg-green-100 text-green-800",
    Cancelled: "bg-red-100 text-red-800",
    Completed: "bg-green-100 text-green-800",
    // Inventory
    OK: "bg-green-100 text-green-800",
    Low: "bg-yellow-100 text-yellow-800",
    Critical: "bg-red-100 text-red-800",
    Out: "bg-gray-100 text-gray-800",
    // Menu
    Available: "bg-green-100 text-green-800",
    Unavailable: "bg-red-100 text-red-800",
    Seasonal: "bg-blue-100 text-blue-800",
    // Staff
    "On Duty": "bg-green-100 text-green-800",
    "Off Duty": "bg-gray-100 text-gray-800",
    "On Leave": "bg-yellow-100 text-yellow-800",
    // Events
    Upcoming: "bg-blue-100 text-blue-800",
    "In Progress": "bg-purple-100 text-purple-800",
    // New
    New: "bg-blue-100 text-blue-800",
    Contacted: "bg-orange-100 text-orange-800",
  };
  return map[status] ?? "bg-gray-100 text-gray-700";
}

export function slugify(str: string): string {
  return str.toLowerCase().replace(/\s+/g, "-");
}

export function generateRef(prefix: string): string {
  return `${prefix}-${String(Math.floor(Math.random() * 90000) + 10000)}`;
}
