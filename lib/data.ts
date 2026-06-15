// ── Types ──────────────────────────────────────────────────────────────────

export type OrderStatus = "Pending" | "Confirmed" | "Preparing" | "Out for Delivery" | "Delivered" | "Cancelled";
export type OrderType = "Dine-In" | "Catering" | "Takeaway" | "Online";
export type MenuStatus = "Available" | "Unavailable" | "Seasonal";
export type EventStatus = "Upcoming" | "In Progress" | "Completed" | "Cancelled";
export type InventoryStatus = "OK" | "Low" | "Critical" | "Out";
export type StaffStatus = "On Duty" | "Off Duty" | "On Leave";
export type NotificationCategory = "Order" | "Inventory" | "Event" | "System";

export interface Order {
  id: string;
  reference: string;
  customer: string;
  venue: string;
  branch: string;
  date: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  type: OrderType;
  notes?: string;
}

export interface OrderItem {
  name: string;
  qty: number;
  price: number;
}

export interface MenuItem {
  id: string;
  name: string;
  category: string;
  price: number;
  status: MenuStatus;
  ordersThisMonth: number;
  description: string;
  dietary: string[];
}

export interface CateringEvent {
  id: string;
  reference: string;
  client: string;
  venue: string;
  date: string;
  headcount: number;
  dietary: string;
  package: string;
  status: EventStatus;
  assignedStaff: string[];
  specialRequests?: string;
  branch: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  unit: string;
  inStock: number;
  minLevel: number;
  status: InventoryStatus;
  supplier: string;
  lastUpdated: string;
}

export interface StaffMember {
  id: string;
  name: string;
  role: string;
  branch: string;
  shift: string;
  status: StaffStatus;
  assignedEvent?: string;
  phone: string;
  email: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  category: NotificationCategory;
  read: boolean;
  date: string;
}

export interface TrendPoint {
  month: string;
  orders: number;
  revenue: number;
}

// ── Mock Orders ─────────────────────────────────────────────────────────────

export const orders: Order[] = [
  { id: "o1", reference: "SP-00114", customer: "Lachlan Morrison", venue: "Sydney Convention Centre", branch: "Sydney CBD", date: "2026-06-14", items: [{ name: "Roast Lamb Platter", qty: 5, price: 89 }, { name: "Garden Salad Bowl", qty: 5, price: 22 }], total: 555, status: "Confirmed", type: "Catering", notes: "Halal required for 3 guests." },
  { id: "o2", reference: "SP-00292", customer: "Amelia Nguyen", venue: "Melbourne Town Hall", branch: "Melbourne North", date: "2026-06-14", items: [{ name: "Beef Slider Pack (12)", qty: 3, price: 45 }, { name: "Lemonade Jug", qty: 6, price: 18 }], total: 243, status: "Preparing", type: "Catering" },
  { id: "o3", reference: "SP-00194", customer: "Ethan Crawford", venue: "Brisbane Convention", branch: "Brisbane South", date: "2026-06-13", items: [{ name: "Barramundi & Chips", qty: 8, price: 28 }, { name: "Coleslaw Tub", qty: 4, price: 15 }], total: 284, status: "Delivered", type: "Catering" },
  { id: "o4", reference: "SP-00273", customer: "Sophia Patel", venue: "Perth Arena", branch: "Perth East", date: "2026-06-13", items: [{ name: "Vegan Mezze Box", qty: 10, price: 32 }], total: 320, status: "Pending", type: "Catering", notes: "All vegan, no cross-contamination." },
  { id: "o5", reference: "SP-00387", customer: "Oliver Bennett", venue: "Adelaide Oval Function", branch: "Adelaide", date: "2026-06-12", items: [{ name: "Chicken Skewers (20)", qty: 4, price: 55 }, { name: "Tzatziki Dip", qty: 4, price: 12 }], total: 268, status: "Out for Delivery", type: "Catering" },
  { id: "o6", reference: "SP-00401", customer: "Chloe Williamson", venue: "Gold Coast Marriott", branch: "Gold Coast", date: "2026-06-12", items: [{ name: "Seafood Platter", qty: 3, price: 120 }, { name: "Bread Rolls (12)", qty: 3, price: 14 }], total: 402, status: "Confirmed", type: "Catering" },
  { id: "o7", reference: "SP-00155", customer: "Jack O'Brien", venue: "Walk-in", branch: "Sydney CBD", date: "2026-06-11", items: [{ name: "Chicken Schnitzel", qty: 1, price: 22 }, { name: "Chips", qty: 1, price: 8 }], total: 30, status: "Delivered", type: "Dine-In" },
  { id: "o8", reference: "SP-00166", customer: "Grace Thompson", venue: "Online Order", branch: "Melbourne North", date: "2026-06-11", items: [{ name: "Poke Bowl", qty: 2, price: 19 }], total: 38, status: "Delivered", type: "Online" },
  { id: "o9", reference: "SP-00212", customer: "Liam Walker", venue: "Walk-in", branch: "Brisbane South", date: "2026-06-10", items: [{ name: "Beef Burger", qty: 2, price: 18 }, { name: "Sweet Potato Fries", qty: 2, price: 10 }], total: 56, status: "Delivered", type: "Dine-In" },
  { id: "o10", reference: "SP-00319", customer: "Isabella Clark", venue: "Phone Order", branch: "Perth East", date: "2026-06-10", items: [{ name: "Lamb Souvlaki", qty: 3, price: 16 }], total: 48, status: "Cancelled", type: "Takeaway", notes: "Customer cancelled — double booking." },
  { id: "o11", reference: "SP-00432", customer: "Noah Harris", venue: "Canberra Museum", branch: "Canberra", date: "2026-06-09", items: [{ name: "Corporate Lunch Box", qty: 20, price: 24 }], total: 480, status: "Delivered", type: "Catering" },
  { id: "o12", reference: "SP-00447", customer: "Mia Robinson", venue: "Darwin Convention", branch: "Darwin", date: "2026-06-09", items: [{ name: "BBQ Platter Large", qty: 2, price: 145 }, { name: "Mixed Salads x4", qty: 2, price: 38 }], total: 366, status: "Confirmed", type: "Catering" },
  { id: "o13", reference: "SP-00503", customer: "Elijah Martin", venue: "Online Order", branch: "Sydney CBD", date: "2026-06-08", items: [{ name: "Sushi Box (16pc)", qty: 4, price: 28 }], total: 112, status: "Delivered", type: "Online" },
  { id: "o14", reference: "SP-00518", customer: "Charlotte Davis", venue: "Hobart Function Room", branch: "Hobart", date: "2026-06-08", items: [{ name: "Smoked Salmon Board", qty: 5, price: 65 }, { name: "Sourdough Loaf", qty: 5, price: 12 }], total: 385, status: "Preparing", type: "Catering" },
  { id: "o15", reference: "SP-00530", customer: "Ava Wilson", venue: "Walk-in", branch: "Gold Coast", date: "2026-06-07", items: [{ name: "Acai Bowl", qty: 1, price: 15 }, { name: "Long Black", qty: 1, price: 5 }], total: 20, status: "Delivered", type: "Dine-In" },
  { id: "o16", reference: "SP-00612", customer: "Lucas Anderson", venue: "Newcastle Arena", branch: "Newcastle", date: "2026-06-07", items: [{ name: "Hot Dog Pack (10)", qty: 6, price: 35 }], total: 210, status: "Pending", type: "Catering" },
  { id: "o17", reference: "SP-00624", customer: "Harper Taylor", venue: "Online Order", branch: "Adelaide", date: "2026-06-06", items: [{ name: "Butter Chicken", qty: 2, price: 21 }, { name: "Garlic Naan x2", qty: 2, price: 7 }], total: 56, status: "Delivered", type: "Online" },
  { id: "o18", reference: "SP-00701", customer: "Benjamin Lee", venue: "Wollongong Cultural", branch: "Wollongong", date: "2026-06-06", items: [{ name: "Tapas Selection x8", qty: 3, price: 48 }], total: 144, status: "Confirmed", type: "Catering" },
  { id: "o19", reference: "SP-00745", customer: "Scarlett White", venue: "Walk-in", branch: "Canberra", date: "2026-06-05", items: [{ name: "Caesar Salad", qty: 1, price: 17 }], total: 17, status: "Delivered", type: "Dine-In" },
  { id: "o20", reference: "SP-00799", customer: "Mason Brown", venue: "Townsville Civic", branch: "Townsville", date: "2026-06-05", items: [{ name: "Roast Pork Platter", qty: 4, price: 98 }, { name: "Apple Sauce", qty: 4, price: 8 }], total: 424, status: "Cancelled", type: "Catering", notes: "Venue changed date, rebooking in progress." },
  { id: "o21", reference: "SP-00812", customer: "Evelyn Jones", venue: "Perth Convention", branch: "Perth East", date: "2026-06-04", items: [{ name: "Paella Pan (serves 20)", qty: 2, price: 180 }], total: 360, status: "Delivered", type: "Catering" },
  { id: "o22", reference: "SP-00831", customer: "Aiden Kumar", venue: "Online Order", branch: "Melbourne North", date: "2026-06-04", items: [{ name: "Loaded Nachos", qty: 3, price: 18 }], total: 54, status: "Delivered", type: "Online" },
  { id: "o23", reference: "SP-00890", customer: "Zoe Garcia", venue: "Sunshine Coast Resort", branch: "Sunshine Coast", date: "2026-06-03", items: [{ name: "Tropical Fruit Platter", qty: 6, price: 42 }, { name: "Sparkling Water Cases", qty: 6, price: 18 }], total: 360, status: "Pending", type: "Catering" },
  { id: "o24", reference: "SP-00910", customer: "Sebastian Hall", venue: "Walk-in", branch: "Sydney CBD", date: "2026-06-03", items: [{ name: "Eggs Benedict", qty: 2, price: 20 }, { name: "Flat White", qty: 2, price: 5 }], total: 50, status: "Delivered", type: "Dine-In" },
  { id: "o25", reference: "SP-00934", customer: "Lily Adams", venue: "Cairns Convention", branch: "Cairns", date: "2026-06-02", items: [{ name: "Tropical BBQ Pack", qty: 8, price: 62 }], total: 496, status: "Confirmed", type: "Catering" },
];

// ── Menu Items ───────────────────────────────────────────────────────────────

export const menuItems: MenuItem[] = [
  { id: "m1", name: "Roast Lamb Platter", category: "Mains", price: 89, status: "Available", ordersThisMonth: 42, description: "Slow-roasted lamb with rosemary jus, served with seasonal vegetables.", dietary: ["GF", "H"] },
  { id: "m2", name: "Barramundi & Chips", category: "Mains", price: 28, status: "Available", ordersThisMonth: 38, description: "Crispy battered barramundi with hand-cut chips and tartare sauce.", dietary: ["GF"] },
  { id: "m3", name: "Beef Slider Pack (12)", category: "Platters", price: 45, status: "Available", ordersThisMonth: 56, description: "Dozen mini beef sliders with relish, cheese and pickle.", dietary: [] },
  { id: "m4", name: "Vegan Mezze Box", category: "Platters", price: 32, status: "Available", ordersThisMonth: 29, description: "Hummus, falafel, stuffed vine leaves, tabbouleh and pita.", dietary: ["V", "VE", "GF"] },
  { id: "m5", name: "Chicken Skewers (20)", category: "Appetizers", price: 55, status: "Available", ordersThisMonth: 61, description: "Marinated chicken thigh skewers, chargrilled, with satay dip.", dietary: ["GF", "H"] },
  { id: "m6", name: "Seafood Platter", category: "Platters", price: 120, status: "Available", ordersThisMonth: 22, description: "Prawns, oysters, smoked salmon, crab claws, dipping sauces.", dietary: ["GF"] },
  { id: "m7", name: "Garden Salad Bowl", category: "Mains", price: 22, status: "Available", ordersThisMonth: 33, description: "Mixed leaves, cherry tomatoes, cucumber, balsamic dressing.", dietary: ["V", "VE", "GF"] },
  { id: "m8", name: "BBQ Platter Large", category: "Platters", price: 145, status: "Available", ordersThisMonth: 18, description: "Ribs, sausages, chicken wings, corn, potato salad.", dietary: [] },
  { id: "m9", name: "Corporate Lunch Box", category: "Mains", price: 24, status: "Available", ordersThisMonth: 75, description: "Choice of protein wrap, fruit salad, chips and juice.", dietary: [] },
  { id: "m10", name: "Sushi Box (16pc)", category: "Platters", price: 28, status: "Available", ordersThisMonth: 44, description: "Assorted nigiri and maki rolls with soy and wasabi.", dietary: ["GF"] },
  { id: "m11", name: "Smoked Salmon Board", category: "Appetizers", price: 65, status: "Available", ordersThisMonth: 26, description: "House-smoked salmon, cream cheese, capers, rye crackers.", dietary: ["GF"] },
  { id: "m12", name: "Paella Pan (serves 20)", category: "Mains", price: 180, status: "Seasonal", ordersThisMonth: 8, description: "Traditional Spanish paella with seafood, chicken and chorizo.", dietary: ["GF"] },
  { id: "m13", name: "Poke Bowl", category: "Mains", price: 19, status: "Available", ordersThisMonth: 50, description: "Salmon, edamame, cucumber, mango, sushi rice, sesame dressing.", dietary: ["GF"] },
  { id: "m14", name: "Beef Burger", category: "Mains", price: 18, status: "Available", ordersThisMonth: 67, description: "House-made beef patty, lettuce, tomato, cheese, brioche bun.", dietary: [] },
  { id: "m15", name: "Acai Bowl", category: "Desserts", price: 15, status: "Available", ordersThisMonth: 39, description: "Blended acai, banana, topped with granola, fresh berries, honey.", dietary: ["V", "VE", "GF"] },
  { id: "m16", name: "Tropical Fruit Platter", category: "Platters", price: 42, status: "Available", ordersThisMonth: 31, description: "Seasonal tropical fruits: mango, pineapple, papaya, dragon fruit.", dietary: ["V", "VE", "GF", "DF"] },
  { id: "m17", name: "Lamb Souvlaki", category: "Mains", price: 16, status: "Available", ordersThisMonth: 28, description: "Marinated lamb in pita with tzatziki, tomato and onion.", dietary: [] },
  { id: "m18", name: "Eggs Benedict", category: "Appetizers", price: 20, status: "Available", ordersThisMonth: 45, description: "Poached eggs, hollandaise, smoked ham on toasted English muffin.", dietary: [] },
  { id: "m19", name: "Butter Chicken", category: "Mains", price: 21, status: "Available", ordersThisMonth: 37, description: "Creamy tomato curry with tender chicken, served with rice.", dietary: ["GF", "H"] },
  { id: "m20", name: "Caesar Salad", category: "Mains", price: 17, status: "Available", ordersThisMonth: 42, description: "Cos lettuce, parmesan, bacon, croutons, Caesar dressing.", dietary: [] },
  { id: "m21", name: "Hot Dog Pack (10)", category: "Platters", price: 35, status: "Available", ordersThisMonth: 22, description: "Jumbo beef franks in brioche buns, mustard and ketchup.", dietary: [] },
  { id: "m22", name: "Tapas Selection x8", category: "Appetizers", price: 48, status: "Available", ordersThisMonth: 19, description: "8 varieties of Spanish tapas: patatas bravas, gambas, croquetas…", dietary: [] },
  { id: "m23", name: "Chicken Schnitzel", category: "Mains", price: 22, status: "Available", ordersThisMonth: 53, description: "Crumbed chicken schnitzel, chips, salad, gravy.", dietary: [] },
  { id: "m24", name: "Lemonade Jug", category: "Beverages", price: 18, status: "Available", ordersThisMonth: 60, description: "Fresh-squeezed lemonade, serves 6.", dietary: ["V", "VE", "GF"] },
  { id: "m25", name: "Long Black", category: "Beverages", price: 5, status: "Available", ordersThisMonth: 88, description: "Double espresso with hot water. Made with single-origin beans.", dietary: ["V", "VE", "GF", "DF"] },
  { id: "m26", name: "Flat White", category: "Beverages", price: 5, status: "Available", ordersThisMonth: 95, description: "Double ristretto with steamed whole milk.", dietary: ["V"] },
  { id: "m27", name: "Garlic Naan x2", category: "Appetizers", price: 7, status: "Available", ordersThisMonth: 31, description: "Soft garlic and herb naan breads, fresh from the tandoor.", dietary: ["V"] },
  { id: "m28", name: "Loaded Nachos", category: "Appetizers", price: 18, status: "Available", ordersThisMonth: 41, description: "Tortilla chips, beans, cheese, jalapeños, sour cream, guac.", dietary: ["V"] },
  { id: "m29", name: "Sweet Potato Fries", category: "Appetizers", price: 10, status: "Available", ordersThisMonth: 49, description: "Crispy sweet potato fries with aioli.", dietary: ["V", "VE", "GF", "DF"] },
  { id: "m30", name: "Pavlova Slice", category: "Desserts", price: 12, status: "Seasonal", ordersThisMonth: 14, description: "Classic Aussie pavlova with whipped cream and passionfruit.", dietary: ["V", "GF"] },
  { id: "m31", name: "Lamington Box (6)", category: "Desserts", price: 16, status: "Available", ordersThisMonth: 27, description: "Sponge cake coated in chocolate and desiccated coconut.", dietary: ["V"] },
  { id: "m32", name: "Roast Pork Platter", category: "Mains", price: 98, status: "Available", ordersThisMonth: 15, description: "Slow-roasted pork with crackling, apple sauce, roasted veg.", dietary: ["GF"] },
  { id: "m33", name: "Coleslaw Tub", category: "Mains", price: 15, status: "Available", ordersThisMonth: 35, description: "Creamy house coleslaw, serves 8–10.", dietary: ["V", "GF"] },
  { id: "m34", name: "Tropical BBQ Pack", category: "Platters", price: 62, status: "Unavailable", ordersThisMonth: 0, description: "North Queensland BBQ pack: prawns, macadamia-crusted chicken, mango salsa.", dietary: ["GF"] },
  { id: "m35", name: "Sparkling Water Cases", category: "Beverages", price: 18, status: "Available", ordersThisMonth: 23, description: "24 x 500ml sparkling water bottles.", dietary: ["V", "VE", "GF", "DF"] },
];

// ── Catering Events ──────────────────────────────────────────────────────────

export const cateringEvents: CateringEvent[] = [
  { id: "e1", reference: "EV-00234", client: "Deloitte Australia", venue: "Sydney Convention Centre, Hall A", date: "2026-06-20", headcount: 250, dietary: "GF, H options required", package: "Premium Corporate", status: "Upcoming", assignedStaff: ["Emma Parker", "James Nguyen", "Olivia Chen"], specialRequests: "Cocktail style, no seated dinner.", branch: "Sydney CBD" },
  { id: "e2", reference: "EV-00235", client: "Morrison Wedding", venue: "Botanical Gardens, Melbourne", date: "2026-06-22", headcount: 120, dietary: "V, VE, GF, DF options", package: "Wedding Banquet", status: "Upcoming", assignedStaff: ["Liam Walsh", "Sophie Brown", "Noah Kim", "Mia Scott"], specialRequests: "4-course seated dinner, custom cake table.", branch: "Melbourne North" },
  { id: "e3", reference: "EV-00236", client: "Brisbane City Council", venue: "City Hall, Brisbane", date: "2026-06-15", headcount: 80, dietary: "Halal only", package: "Government Lunch", status: "In Progress", assignedStaff: ["Aiden Lee", "Grace Turner"], branch: "Brisbane South" },
  { id: "e4", reference: "EV-00201", client: "ANZ Banking Group", venue: "Crown Perth Ballroom", date: "2026-06-10", headcount: 300, dietary: "Mixed", package: "Premium Corporate", status: "Completed", assignedStaff: ["Emma Parker", "James Nguyen"], branch: "Perth East" },
  { id: "e5", reference: "EV-00202", client: "St Joseph's School Fete", venue: "St Joseph's Primary, Adelaide", date: "2026-06-07", headcount: 400, dietary: "Nut-free, V options", package: "School Canteen Pack", status: "Completed", assignedStaff: ["Sophie Brown", "Noah Kim"], branch: "Adelaide" },
  { id: "e6", reference: "EV-00238", client: "Gold Coast Tourism Board", venue: "Gold Coast Convention Centre", date: "2026-06-28", headcount: 180, dietary: "GF, V options", package: "Gala Dinner", status: "Upcoming", assignedStaff: ["Mia Scott", "Oliver Hayes"], branch: "Gold Coast" },
  { id: "e7", reference: "EV-00239", client: "Canberra Tech Summit", venue: "National Convention Centre", date: "2026-07-02", headcount: 200, dietary: "Vegan-forward", package: "Corporate Day Pack", status: "Upcoming", assignedStaff: ["Aiden Lee", "Zoe Adams"], branch: "Canberra" },
  { id: "e8", reference: "EV-00203", client: "Richards Birthday Party", venue: "Private Residence, Hobart", date: "2026-06-01", headcount: 60, dietary: "No restrictions", package: "Casual BBQ", status: "Completed", assignedStaff: ["Liam Walsh"], branch: "Hobart" },
  { id: "e9", reference: "EV-00241", client: "Darwin Festival Committee", venue: "Darwin Waterfront Precinct", date: "2026-07-10", headcount: 500, dietary: "Mixed, GF options", package: "Festival Catering", status: "Upcoming", assignedStaff: ["Grace Turner", "James Nguyen", "Emma Parker"], branch: "Darwin" },
  { id: "e10", reference: "EV-00204", client: "Westpac Group", venue: "Sofitel Sydney", date: "2026-05-28", headcount: 150, dietary: "Mixed", package: "Premium Corporate", status: "Completed", assignedStaff: ["Oliver Hayes", "Zoe Adams"], branch: "Sydney CBD" },
  { id: "e11", reference: "EV-00244", client: "Sunshine Coast Marathon", venue: "Noosa Heads Foreshore", date: "2026-07-15", headcount: 600, dietary: "GF, V, high-carb options", package: "Sports Event Pack", status: "Upcoming", assignedStaff: ["Sophie Brown", "Aiden Lee", "Mia Scott"], branch: "Sunshine Coast" },
  { id: "e12", reference: "EV-00205", client: "Newcastle Arts Council", venue: "Newcastle Museum", date: "2026-06-05", headcount: 90, dietary: "V, VE friendly", package: "Cocktail Evening", status: "Completed", assignedStaff: ["Liam Walsh", "Grace Turner"], branch: "Newcastle" },
  { id: "e13", reference: "EV-00246", client: "Thompson Wedding Reception", venue: "Palazzo Versace, Gold Coast", date: "2026-07-19", headcount: 140, dietary: "GF, H, V options", package: "Wedding Banquet", status: "Upcoming", assignedStaff: ["Emma Parker", "Noah Kim", "Zoe Adams"], branch: "Gold Coast" },
  { id: "e14", reference: "EV-00247", client: "James Cook University Gala", venue: "JCU Cairns Campus", date: "2026-07-22", headcount: 220, dietary: "Mixed", package: "Gala Dinner", status: "Upcoming", assignedStaff: ["Oliver Hayes", "Aiden Lee"], branch: "Cairns" },
  { id: "e15", reference: "EV-00248", client: "Woolworths Annual Conference", venue: "ICC Sydney", date: "2026-07-30", headcount: 1000, dietary: "All dietary needs", package: "Conference Pack", status: "Upcoming", assignedStaff: ["Emma Parker", "James Nguyen", "Sophie Brown", "Mia Scott", "Noah Kim"], specialRequests: "Continuous refreshment stations throughout the day.", branch: "Sydney CBD" },
];

// ── Inventory ────────────────────────────────────────────────────────────────

export const inventoryItems: InventoryItem[] = [
  { id: "i1", name: "Chicken Thigh Fillets", category: "Proteins", unit: "kg", inStock: 45, minLevel: 20, status: "OK", supplier: "Ingham's Poultry", lastUpdated: "2026-06-14" },
  { id: "i2", name: "Beef Mince (Premium)", category: "Proteins", unit: "kg", inStock: 8, minLevel: 15, status: "Critical", supplier: "NH Foods Australia", lastUpdated: "2026-06-14" },
  { id: "i3", name: "Barramundi Fillets", category: "Proteins", unit: "kg", inStock: 12, minLevel: 10, status: "Low", supplier: "Cone Bay Aquaculture", lastUpdated: "2026-06-13" },
  { id: "i4", name: "Lamb Leg Bone-In", category: "Proteins", unit: "kg", inStock: 60, minLevel: 25, status: "OK", supplier: "Elders Pastoral", lastUpdated: "2026-06-13" },
  { id: "i5", name: "Atlantic Salmon", category: "Proteins", unit: "kg", inStock: 5, minLevel: 12, status: "Critical", supplier: "Huon Aquaculture", lastUpdated: "2026-06-14" },
  { id: "i6", name: "Green Capsicum", category: "Produce", unit: "kg", inStock: 18, minLevel: 10, status: "OK", supplier: "Sydney Markets", lastUpdated: "2026-06-14" },
  { id: "i7", name: "Roma Tomatoes", category: "Produce", unit: "kg", inStock: 22, minLevel: 15, status: "OK", supplier: "Sydney Markets", lastUpdated: "2026-06-14" },
  { id: "i8", name: "Mixed Salad Leaves", category: "Produce", unit: "kg", inStock: 3, minLevel: 8, status: "Critical", supplier: "Perfection Fresh", lastUpdated: "2026-06-14" },
  { id: "i9", name: "Mango (Kensington Pride)", category: "Produce", unit: "kg", inStock: 0, minLevel: 10, status: "Out", supplier: "Tropical Fruit World", lastUpdated: "2026-06-12" },
  { id: "i10", name: "Avocado", category: "Produce", unit: "each", inStock: 80, minLevel: 30, status: "OK", supplier: "Avocados Australia", lastUpdated: "2026-06-14" },
  { id: "i11", name: "Full Cream Milk", category: "Dairy", unit: "L", inStock: 40, minLevel: 20, status: "OK", supplier: "Norco Dairy", lastUpdated: "2026-06-14" },
  { id: "i12", name: "Thickened Cream", category: "Dairy", unit: "L", inStock: 6, minLevel: 10, status: "Low", supplier: "Norco Dairy", lastUpdated: "2026-06-13" },
  { id: "i13", name: "Cheddar Cheese (Block)", category: "Dairy", unit: "kg", inStock: 14, minLevel: 8, status: "OK", supplier: "Bega Cheese", lastUpdated: "2026-06-13" },
  { id: "i14", name: "Unsalted Butter", category: "Dairy", unit: "kg", inStock: 9, minLevel: 5, status: "OK", supplier: "Mainland Butter", lastUpdated: "2026-06-12" },
  { id: "i15", name: "Greek Yoghurt", category: "Dairy", unit: "kg", inStock: 4, minLevel: 6, status: "Low", supplier: "Chobani", lastUpdated: "2026-06-14" },
  { id: "i16", name: "Plain Flour (25kg bag)", category: "Dry Goods", unit: "bag", inStock: 12, minLevel: 5, status: "OK", supplier: "Defiance Mills", lastUpdated: "2026-06-11" },
  { id: "i17", name: "Sushi Rice", category: "Dry Goods", unit: "kg", inStock: 20, minLevel: 10, status: "OK", supplier: "SunRice", lastUpdated: "2026-06-10" },
  { id: "i18", name: "Panko Breadcrumbs", category: "Dry Goods", unit: "kg", inStock: 7, minLevel: 5, status: "OK", supplier: "Lowan Foods", lastUpdated: "2026-06-10" },
  { id: "i19", name: "Olive Oil (4L)", category: "Dry Goods", unit: "bottle", inStock: 8, minLevel: 6, status: "OK", supplier: "Cobram Estate", lastUpdated: "2026-06-10" },
  { id: "i20", name: "Coconut Milk (400ml cans)", category: "Dry Goods", unit: "can", inStock: 2, minLevel: 12, status: "Critical", supplier: "Trident Foods", lastUpdated: "2026-06-13" },
  { id: "i21", name: "Sparkling Water (500ml)", category: "Beverages", unit: "bottle", inStock: 288, minLevel: 100, status: "OK", supplier: "Schweppes Australia", lastUpdated: "2026-06-12" },
  { id: "i22", name: "Orange Juice (1L)", category: "Beverages", unit: "carton", inStock: 18, minLevel: 12, status: "OK", supplier: "Berri", lastUpdated: "2026-06-12" },
  { id: "i23", name: "Coffee Beans (1kg)", category: "Beverages", unit: "bag", inStock: 3, minLevel: 5, status: "Low", supplier: "Campos Coffee", lastUpdated: "2026-06-14" },
  { id: "i24", name: "Lemonade Concentrate (5L)", category: "Beverages", unit: "jug", inStock: 10, minLevel: 6, status: "OK", supplier: "Spring Valley", lastUpdated: "2026-06-11" },
  { id: "i25", name: "Takeaway Boxes (500ct)", category: "Packaging", unit: "box", inStock: 4, minLevel: 8, status: "Low", supplier: "BioPak Australia", lastUpdated: "2026-06-10" },
  { id: "i26", name: "Catering Trays (100ct)", category: "Packaging", unit: "pack", inStock: 12, minLevel: 5, status: "OK", supplier: "BioPak Australia", lastUpdated: "2026-06-10" },
  { id: "i27", name: "Disposable Gloves (M, 200ct)", category: "Packaging", unit: "box", inStock: 6, minLevel: 4, status: "OK", supplier: "Protector Alsafe", lastUpdated: "2026-06-09" },
  { id: "i28", name: "Aluminium Foil Rolls", category: "Packaging", unit: "roll", inStock: 0, minLevel: 5, status: "Out", supplier: "Multix", lastUpdated: "2026-06-11" },
  { id: "i29", name: "Bamboo Skewers (200ct)", category: "Packaging", unit: "pack", inStock: 15, minLevel: 8, status: "OK", supplier: "Chef's Choice", lastUpdated: "2026-06-08" },
  { id: "i30", name: "Napkins (500ct)", category: "Packaging", unit: "pack", inStock: 20, minLevel: 10, status: "OK", supplier: "Biopak Australia", lastUpdated: "2026-06-08" },
  { id: "i31", name: "Tiger Prawns", category: "Proteins", unit: "kg", inStock: 8, minLevel: 5, status: "OK", supplier: "Australis Seafood", lastUpdated: "2026-06-14" },
  { id: "i32", name: "Pork Belly (Skin-On)", category: "Proteins", unit: "kg", inStock: 22, minLevel: 10, status: "OK", supplier: "NH Foods Australia", lastUpdated: "2026-06-13" },
  { id: "i33", name: "Broccolini", category: "Produce", unit: "bunch", inStock: 30, minLevel: 15, status: "OK", supplier: "Sydney Markets", lastUpdated: "2026-06-14" },
  { id: "i34", name: "Sweet Potato", category: "Produce", unit: "kg", inStock: 25, minLevel: 12, status: "OK", supplier: "Perfection Fresh", lastUpdated: "2026-06-13" },
  { id: "i35", name: "Parmesan Reggiano", category: "Dairy", unit: "kg", inStock: 2, minLevel: 3, status: "Low", supplier: "Bega Cheese", lastUpdated: "2026-06-12" },
  { id: "i36", name: "Basmati Rice (10kg)", category: "Dry Goods", unit: "bag", inStock: 8, minLevel: 4, status: "OK", supplier: "SunRice", lastUpdated: "2026-06-11" },
  { id: "i37", name: "Red Wine (case 12)", category: "Beverages", unit: "case", inStock: 6, minLevel: 4, status: "OK", supplier: "Penfolds", lastUpdated: "2026-06-10" },
  { id: "i38", name: "White Wine (case 12)", category: "Beverages", unit: "case", inStock: 3, minLevel: 4, status: "Low", supplier: "Jacob's Creek", lastUpdated: "2026-06-10" },
  { id: "i39", name: "Catering Lids (200ct)", category: "Packaging", unit: "pack", inStock: 5, minLevel: 6, status: "Low", supplier: "BioPak Australia", lastUpdated: "2026-06-09" },
  { id: "i40", name: "Hand Sanitiser (5L)", category: "Packaging", unit: "bottle", inStock: 8, minLevel: 4, status: "OK", supplier: "Dettol Pro", lastUpdated: "2026-06-07" },
];

// ── Staff ────────────────────────────────────────────────────────────────────

export const staffMembers: StaffMember[] = [
  { id: "s1", name: "Emma Parker", role: "Head Chef", branch: "Sydney CBD", shift: "06:00–14:00", status: "On Duty", assignedEvent: "EV-00234", phone: "0412 234 567", email: "emma.parker@spandis.com.au" },
  { id: "s2", name: "James Nguyen", role: "Sous Chef", branch: "Sydney CBD", shift: "06:00–14:00", status: "On Duty", assignedEvent: "EV-00234", phone: "0423 345 678", email: "james.nguyen@spandis.com.au" },
  { id: "s3", name: "Olivia Chen", role: "Catering Coordinator", branch: "Sydney CBD", shift: "08:00–16:00", status: "On Duty", assignedEvent: "EV-00234", phone: "0434 456 789", email: "olivia.chen@spandis.com.au" },
  { id: "s4", name: "Liam Walsh", role: "Chef", branch: "Melbourne North", shift: "07:00–15:00", status: "On Duty", assignedEvent: "EV-00235", phone: "0445 567 890", email: "liam.walsh@spandis.com.au" },
  { id: "s5", name: "Sophie Brown", role: "Catering Coordinator", branch: "Melbourne North", shift: "08:00–16:00", status: "On Duty", assignedEvent: "EV-00235", phone: "0456 678 901", email: "sophie.brown@spandis.com.au" },
  { id: "s6", name: "Noah Kim", role: "Server", branch: "Melbourne North", shift: "10:00–18:00", status: "On Duty", phone: "0467 789 012", email: "noah.kim@spandis.com.au" },
  { id: "s7", name: "Mia Scott", role: "Server", branch: "Melbourne North", shift: "10:00–18:00", status: "Off Duty", phone: "0478 890 123", email: "mia.scott@spandis.com.au" },
  { id: "s8", name: "Aiden Lee", role: "Chef", branch: "Brisbane South", shift: "06:00–14:00", status: "On Duty", assignedEvent: "EV-00236", phone: "0489 901 234", email: "aiden.lee@spandis.com.au" },
  { id: "s9", name: "Grace Turner", role: "Catering Coordinator", branch: "Brisbane South", shift: "08:00–16:00", status: "On Duty", assignedEvent: "EV-00236", phone: "0491 012 345", email: "grace.turner@spandis.com.au" },
  { id: "s10", name: "Oliver Hayes", role: "Driver", branch: "Perth East", shift: "07:00–15:00", status: "On Duty", phone: "0402 123 456", email: "oliver.hayes@spandis.com.au" },
  { id: "s11", name: "Zoe Adams", role: "Sous Chef", branch: "Perth East", shift: "06:00–14:00", status: "Off Duty", phone: "0413 234 567", email: "zoe.adams@spandis.com.au" },
  { id: "s12", name: "Lucas Mitchell", role: "Chef", branch: "Adelaide", shift: "06:00–14:00", status: "On Duty", phone: "0424 345 678", email: "lucas.mitchell@spandis.com.au" },
  { id: "s13", name: "Ava Johnson", role: "Server", branch: "Adelaide", shift: "10:00–18:00", status: "On Leave", phone: "0435 456 789", email: "ava.johnson@spandis.com.au" },
  { id: "s14", name: "Ethan Davis", role: "Driver", branch: "Gold Coast", shift: "09:00–17:00", status: "On Duty", phone: "0446 567 890", email: "ethan.davis@spandis.com.au" },
  { id: "s15", name: "Charlotte Wilson", role: "Catering Coordinator", branch: "Gold Coast", shift: "08:00–16:00", status: "On Duty", assignedEvent: "EV-00238", phone: "0457 678 901", email: "charlotte.wilson@spandis.com.au" },
  { id: "s16", name: "Jack Robinson", role: "Chef", branch: "Canberra", shift: "06:00–14:00", status: "On Duty", phone: "0468 789 012", email: "jack.robinson@spandis.com.au" },
  { id: "s17", name: "Lily Thompson", role: "Admin", branch: "Sydney CBD", shift: "09:00–17:00", status: "On Duty", phone: "0479 890 123", email: "lily.thompson@spandis.com.au" },
  { id: "s18", name: "William Anderson", role: "Driver", branch: "Brisbane South", shift: "08:00–16:00", status: "Off Duty", phone: "0490 901 234", email: "william.anderson@spandis.com.au" },
  { id: "s19", name: "Isabella Martinez", role: "Sous Chef", branch: "Hobart", shift: "07:00–15:00", status: "On Duty", phone: "0401 012 345", email: "isabella.martinez@spandis.com.au" },
  { id: "s20", name: "Henry Taylor", role: "Server", branch: "Darwin", shift: "11:00–19:00", status: "On Duty", phone: "0412 123 456", email: "henry.taylor@spandis.com.au" },
];

// ── Notifications ────────────────────────────────────────────────────────────

export const notifications: Notification[] = [
  { id: "n1", title: "New Order Received", message: "Order SP-00934 placed by Lily Adams for Cairns Convention (AUD $496).", category: "Order", read: false, date: "2026-06-14T09:15:00" },
  { id: "n2", title: "Low Stock Alert", message: "Atlantic Salmon is critically low (5kg remaining, minimum 12kg). Reorder from Huon Aquaculture.", category: "Inventory", read: false, date: "2026-06-14T08:55:00" },
  { id: "n3", title: "Low Stock Alert", message: "Mixed Salad Leaves critically low (3kg remaining, minimum 8kg). Order from Perfection Fresh.", category: "Inventory", read: false, date: "2026-06-14T08:50:00" },
  { id: "n4", title: "Event Reminder", message: "EV-00234 (Deloitte Australia) at Sydney Convention Centre — in 6 days. 250 guests.", category: "Event", read: false, date: "2026-06-14T08:00:00" },
  { id: "n5", title: "Order Status Update", message: "Order SP-00387 (Oliver Bennett) is now Out for Delivery to Adelaide Oval Function.", category: "Order", read: false, date: "2026-06-14T07:45:00" },
  { id: "n6", title: "Out of Stock Alert", message: "Mango (Kensington Pride) is OUT OF STOCK. Seasonal item — check Tropical Fruit World.", category: "Inventory", read: false, date: "2026-06-13T17:30:00" },
  { id: "n7", title: "Out of Stock Alert", message: "Aluminium Foil Rolls are OUT OF STOCK. Order from Multix immediately.", category: "Inventory", read: false, date: "2026-06-13T17:25:00" },
  { id: "n8", title: "Event Confirmed", message: "EV-00235 (Morrison Wedding) confirmed. 120 guests, Botanical Gardens Melbourne on 22 Jun.", category: "Event", read: false, date: "2026-06-13T15:00:00" },
  { id: "n9", title: "Order Cancelled", message: "Order SP-00799 (Mason Brown) cancelled — venue changed date. Follow up for rebooking.", category: "Order", read: true, date: "2026-06-13T12:30:00" },
  { id: "n10", title: "New Staff Assigned", message: "Emma Parker assigned as lead for EV-00234 (Deloitte) and EV-00015 (Woolworths Conference).", category: "System", read: true, date: "2026-06-13T10:00:00" },
  { id: "n11", title: "Low Stock Alert", message: "Beef Mince (Premium) is critically low (8kg, minimum 15kg). Contact NH Foods Australia.", category: "Inventory", read: true, date: "2026-06-13T09:45:00" },
  { id: "n12", title: "Event Completed", message: "EV-00201 (ANZ Banking Group) completed successfully. 300 guests served at Crown Perth.", category: "Event", read: true, date: "2026-06-10T20:00:00" },
  { id: "n13", title: "Order Delivered", message: "Order SP-00432 (Noah Harris, Canberra Museum) delivered. 20 corporate lunch boxes.", category: "Order", read: true, date: "2026-06-09T14:00:00" },
  { id: "n14", title: "Low Stock Alert", message: "Coffee Beans (Campos) is low — 3 bags remaining. Minimum is 5 bags.", category: "Inventory", read: false, date: "2026-06-14T07:30:00" },
  { id: "n15", title: "System Update", message: "Dashboard updated to v2.4.1. New: bulk reorder actions in Inventory.", category: "System", read: true, date: "2026-06-09T08:00:00" },
  { id: "n16", title: "Event Upcoming", message: "EV-00239 (Canberra Tech Summit) in 17 days — 200 guests, vegan-forward menu required.", category: "Event", read: false, date: "2026-06-14T06:00:00" },
  { id: "n17", title: "Order Confirmed", message: "Order SP-00447 (Mia Robinson, Darwin Convention) confirmed. AUD $366.", category: "Order", read: true, date: "2026-06-09T11:30:00" },
  { id: "n18", title: "Low Stock Alert", message: "Takeaway Boxes running low — 4 packs remaining (minimum 8). Order from BioPak.", category: "Inventory", read: false, date: "2026-06-14T08:00:00" },
];

// ── Trend Data ───────────────────────────────────────────────────────────────

export const trendData: TrendPoint[] = [
  { month: "Jul '25", orders: 38, revenue: 12400 },
  { month: "Aug '25", orders: 44, revenue: 15800 },
  { month: "Sep '25", orders: 52, revenue: 19200 },
  { month: "Oct '25", orders: 49, revenue: 17600 },
  { month: "Nov '25", orders: 63, revenue: 24800 },
  { month: "Dec '25", orders: 81, revenue: 38200 },
  { month: "Jan '26", orders: 45, revenue: 16500 },
  { month: "Feb '26", orders: 58, revenue: 22300 },
  { month: "Mar '26", orders: 72, revenue: 31000 },
  { month: "Apr '26", orders: 66, revenue: 27400 },
  { month: "May '26", orders: 78, revenue: 34600 },
  { month: "Jun '26", orders: 25, revenue: 11200 },
];

export const branches = [
  "All Branches",
  "Sydney CBD",
  "Melbourne North",
  "Brisbane South",
  "Perth East",
  "Adelaide",
  "Gold Coast",
  "Canberra",
  "Hobart",
  "Darwin",
  "Newcastle",
  "Sunshine Coast",
  "Cairns",
  "Townsville",
  "Wollongong",
];
