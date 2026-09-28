const u = (id: string, w = 600) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=70`;

export type Category = { id: string; name: string; image: string };

export const categories: Category[] = [
  { id: "biryani", name: "Biryani", image: u("photo-1563379091339-03b21ab4a4f8", 300) },
  { id: "north-indian", name: "North Indian", image: u("photo-1585937421612-70a008356fbe", 300) },
  { id: "south-indian", name: "South Indian", image: u("photo-1589301760014-d929f3979dbc", 300) },
  { id: "pizza", name: "Pizza", image: u("photo-1565299624946-b28f40a0ae38", 300) },
  { id: "desserts", name: "Desserts", image: u("photo-1551024601-bec78aea704b", 300) },
  { id: "burgers", name: "Burgers", image: u("photo-1568901346375-23c9450c58cd", 300) },
  { id: "rolls", name: "Rolls", image: u("photo-1626700051175-6818013e1d4f", 300) },
  { id: "noodles", name: "Noodles", image: u("photo-1569718212165-3a8278d5f624", 300) },
  { id: "salad", name: "Salad", image: u("photo-1512621776951-a57141f2eefd", 300) },
  { id: "ice-cream", name: "Ice Cream", image: u("photo-1497034825429-c343d7c6a68f", 300) },
  { id: "cake", name: "Cake", image: u("photo-1578985545062-69928b1d9587", 300) },
];

export const locations = ["Indiranagar", "Koramangala", "HSR Layout", "Whitefield", "Jayanagar"];

export type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  veg: boolean;
  available: boolean;
  image: string;
  section: string;
};

export type Restaurant = {
  id: string;
  name: string;
  cuisines: string[];
  categories: string[];
  area: string;
  rating: number;
  etaMin: number;
  costForTwo: number;
  pureVeg: boolean;
  offers: string[];
  image: string;
  menu: MenuItem[];
};

type Seed = [string, string, number, boolean, boolean, string, string, string?];
const items = (rid: string, seeds: Seed[]): MenuItem[] =>
  seeds.map(([name, description, price, veg, available, image, section], i) => ({
    id: `${rid}-${i}`,
    name,
    description,
    price,
    veg,
    available,
    image: u(image, 400),
    section,
  }));

export const restaurants: Restaurant[] = [
  {
    id: "nawabi-handi",
    name: "Nawabi Handi",
    cuisines: ["Biryani", "Mughlai"],
    categories: ["biryani", "north-indian"],
    area: "Koramangala",
    rating: 4.5,
    etaMin: 32,
    costForTwo: 600,
    pureVeg: false,
    offers: ["20% off up to ₹100", "Free delivery above ₹499"],
    image: u("photo-1563379091339-03b21ab4a4f8", 900),
    menu: items("nawabi-handi", [
      ["Hyderabadi Chicken Dum Biryani", "Slow-cooked basmati, saffron, tender chicken and fried onions.", 329, false, true, "photo-1563379091339-03b21ab4a4f8", "Biryani"],
      ["Paneer Tikka Biryani", "Smoky paneer tikka layered with fragrant rice.", 289, true, true, "photo-1631452180519-c014fe946bc7", "Biryani"],
      ["Mutton Biryani", "Bone-in mutton, dum cooked for four hours.", 429, false, false, "photo-1633945274405-b6c8069047b0", "Biryani"],
      ["Butter Chicken", "Creamy tomato gravy with charred chicken.", 299, false, true, "photo-1585937421612-70a008356fbe", "Curries"],
      ["Double Ka Meetha", "Hyderabadi bread pudding with nuts.", 129, true, true, "photo-1551024601-bec78aea704b", "Desserts"],
    ]),
  },
  {
    id: "dosa-district",
    name: "Dosa District",
    cuisines: ["South Indian", "Breakfast"],
    categories: ["south-indian"],
    area: "Jayanagar",
    rating: 4.6,
    etaMin: 24,
    costForTwo: 300,
    pureVeg: true,
    offers: ["Flat ₹50 off above ₹299"],
    image: u("photo-1589301760014-d929f3979dbc", 900),
    menu: items("dosa-district", [
      ["Masala Dosa", "Crisp rice crepe with spiced potato, chutneys and sambar.", 119, true, true, "photo-1589301760014-d929f3979dbc", "Dosas"],
      ["Ghee Podi Dosa", "Roasted in ghee with gunpowder spice.", 139, true, true, "photo-1668236543090-82eba5ee5976", "Dosas"],
      ["Idli Vada Combo", "Two idlis, one medu vada, sambar and chutney.", 99, true, true, "photo-1589301760014-d929f3979dbc", "Tiffin"],
      ["Filter Coffee", "Strong decoction with frothy milk.", 49, true, true, "photo-1509042239860-f550ce710b93", "Beverages"],
    ]),
  },
  {
    id: "forno-rosso",
    name: "Forno Rosso",
    cuisines: ["Pizza", "Italian"],
    categories: ["pizza", "desserts"],
    area: "Indiranagar",
    rating: 4.3,
    etaMin: 35,
    costForTwo: 800,
    pureVeg: false,
    offers: ["Buy 1 Get 1 on medium pizzas"],
    image: u("photo-1565299624946-b28f40a0ae38", 900),
    menu: items("forno-rosso", [
      ["Margherita", "San Marzano tomato, fior di latte, basil.", 349, true, true, "photo-1574071318508-1cdbab80d002", "Pizzas"],
      ["Pepperoni Classic", "Spicy pepperoni, mozzarella, oregano.", 449, false, true, "photo-1565299624946-b28f40a0ae38", "Pizzas"],
      ["Farmhouse Veggie", "Peppers, olives, mushrooms, onions.", 399, true, true, "photo-1513104890138-7c749659a591", "Pizzas"],
      ["Tiramisu", "Espresso-soaked ladyfingers, mascarpone.", 229, true, false, "photo-1571877227200-a0d98ea607e9", "Desserts"],
    ]),
  },
  {
    id: "stack-house",
    name: "Stack House Burgers",
    cuisines: ["Burgers", "American"],
    categories: ["burgers"],
    area: "HSR Layout",
    rating: 4.2,
    etaMin: 28,
    costForTwo: 500,
    pureVeg: false,
    offers: ["Free fries with any combo"],
    image: u("photo-1568901346375-23c9450c58cd", 900),
    menu: items("stack-house", [
      ["Classic Smash Burger", "Double smashed patty, cheddar, pickles.", 259, false, true, "photo-1568901346375-23c9450c58cd", "Burgers"],
      ["Crispy Paneer Burger", "Spiced paneer, slaw, chipotle mayo.", 219, true, true, "photo-1550547660-d9450f859349", "Burgers"],
      ["Loaded Fries", "Cheese sauce, jalapeños, spring onion.", 149, true, true, "photo-1573080496219-bb080dd4f877", "Sides"],
      ["Oreo Shake", "Thick shake with crushed cookies.", 169, true, true, "photo-1572490122747-3968b75cc699", "Shakes"],
    ]),
  },
  {
    id: "roll-republic",
    name: "Roll Republic",
    cuisines: ["Rolls", "Street Food"],
    categories: ["rolls"],
    area: "Indiranagar",
    rating: 4.1,
    etaMin: 22,
    costForTwo: 350,
    pureVeg: false,
    offers: ["10% off with bank offers"],
    image: u("photo-1626700051175-6818013e1d4f", 900),
    menu: items("roll-republic", [
      ["Chicken Kathi Roll", "Egg-coated paratha, chicken tikka, onions.", 169, false, true, "photo-1626700051175-6818013e1d4f", "Rolls"],
      ["Paneer Tikka Roll", "Charred paneer, mint chutney.", 149, true, true, "photo-1600555379765-f82335a7b1b0", "Rolls"],
      ["Chicken Shawarma", "Garlic toum, pickles, pita.", 179, false, true, "photo-1529006557810-274b9b2fc783", "Wraps"],
    ]),
  },
  {
    id: "wok-and-roll",
    name: "Wok This Way",
    cuisines: ["Chinese", "Noodles"],
    categories: ["noodles"],
    area: "Whitefield",
    rating: 4.0,
    etaMin: 38,
    costForTwo: 550,
    pureVeg: false,
    offers: ["Flat 15% off"],
    image: u("photo-1569718212165-3a8278d5f624", 900),
    menu: items("wok-and-roll", [
      ["Hakka Noodles", "Wok-tossed with vegetables and soy.", 199, true, true, "photo-1585032226651-759b368d7246", "Noodles"],
      ["Chilli Garlic Chicken Noodles", "Fiery garlic, chilli oil, chicken.", 249, false, true, "photo-1569718212165-3a8278d5f624", "Noodles"],
      ["Veg Manchurian", "Crispy veg balls in tangy gravy.", 189, true, true, "photo-1603133872878-684f208fb84b", "Starters"],
    ]),
  },
  {
    id: "sugar-studio",
    name: "Sugar Studio",
    cuisines: ["Desserts", "Bakery"],
    categories: ["desserts", "cake", "ice-cream"],
    area: "Koramangala",
    rating: 4.7,
    etaMin: 26,
    costForTwo: 400,
    pureVeg: true,
    offers: ["Up to 30% off on cakes"],
    image: u("photo-1578985545062-69928b1d9587", 900),
    menu: items("sugar-studio", [
      ["Belgian Chocolate Cake (500g)", "Rich ganache, soft sponge.", 549, true, true, "photo-1578985545062-69928b1d9587", "Cakes"],
      ["Waffle with Ice Cream", "Crisp waffle, vanilla scoop, chocolate drizzle.", 199, true, true, "photo-1562376552-0d160a2f238d", "Waffles"],
      ["Chocolate Sundae", "Three scoops, fudge, nuts.", 179, true, true, "photo-1497034825429-c343d7c6a68f", "Ice Cream"],
    ]),
  },
  {
    id: "green-bowl",
    name: "Green Bowl Co.",
    cuisines: ["Salads", "Healthy"],
    categories: ["salad"],
    area: "HSR Layout",
    rating: 4.4,
    etaMin: 25,
    costForTwo: 450,
    pureVeg: true,
    offers: ["Free delivery"],
    image: u("photo-1512621776951-a57141f2eefd", 900),
    menu: items("green-bowl", [
      ["Mediterranean Bowl", "Quinoa, hummus, falafel, greens.", 289, true, true, "photo-1512621776951-a57141f2eefd", "Bowls"],
      ["Greek Salad", "Feta, olives, cucumber, tomato.", 239, true, true, "photo-1540420773420-3366772f4999", "Salads"],
      ["Cold-pressed Juice", "Apple, beet, carrot, ginger.", 129, true, false, "photo-1600271886742-f049cd451bba", "Drinks"],
    ]),
  },
];

export const getRestaurant = (id: string) => restaurants.find((r) => r.id === id);

export const distanceFrom = (r: Restaurant, loc: string) => {
  const d = Math.abs(locations.indexOf(r.area) - locations.indexOf(loc));
  return Math.round((1.2 + d * 1.9 + (r.rating % 1)) * 10) / 10;
};

// Pricing rules (application-controlled)
export const PRICING = { freeDeliveryAbove: 499, deliveryFee: 40, platformFee: 5, taxRate: 0.05 };
export const bill = (subtotal: number) => {
  const deliveryFee = subtotal >= PRICING.freeDeliveryAbove || subtotal === 0 ? 0 : PRICING.deliveryFee;
  const taxes = Math.round(subtotal * PRICING.taxRate);
  const platformFee = subtotal ? PRICING.platformFee : 0;
  return { subtotal, deliveryFee, taxes, platformFee, total: subtotal + deliveryFee + taxes + platformFee };
};
