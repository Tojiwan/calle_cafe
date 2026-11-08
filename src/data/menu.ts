export type MenuProduct = {
  id: string;
  name: string;
  image: string;
  alt: string;
  priceLabel?: string;
  description?: string;
};

export type MenuCategory = {
  id: string;
  title: string;
  section: "drinks" | "snacks" | "weekend-cocktails";
  products: MenuProduct[];
};

function product(
  category: string,
  id: string,
  name: string,
  priceLabel?: string,
  description?: string,
): MenuProduct {
  return { id, name, image: `/images/products/${category}/${id}.webp`, alt: `Calle Café ${name}`, priceLabel, description };
}

// Price references and unresolved content are documented in docs/menu-content.md.
export const menuCategories: MenuCategory[] = [
  {
    id: "coffee-based", title: "Coffee Based", section: "drinks",
    products: [
      product("coffee-based", "eyselnat-kopi", "Eysel Nat Kopi", "Hot (10 oz) ₱120 · Iced (16 oz) ₱150"),
      product("coffee-based", "ispanis-latey", "Ispanis Latey", "Hot (10 oz) ₱115 · Iced (16 oz) ₱160"),
      product("coffee-based", "karamel-makayato", "Karamel Makayato", "Hot (10 oz) ₱100 · Iced (16 oz) ₱145"),
      product("coffee-based", "white-moka-latey", "Wayt Moka Latey", "Hot (10 oz) ₱100 · Iced (16 oz) ₱140"),
      product("coffee-based", "sisolt-latey", "Sisolt Latey", "Hot (10 oz) ₱100 · Iced (16 oz) ₱140"),
      product("coffee-based", "moka-latey", "Moka Latey", "Hot (10 oz) ₱100 · Iced (16 oz) ₱140"),
      { ...product("coffee-based", "affogato", "Affogato", "₱140"), id: "coffee-affogato" },
    ],
  },
  {
    id: "matcha-series", title: "Matcha Series", section: "drinks",
    products: [
      product("matcha-series", "matya-latey", "Matya Latey", "Iced (18 oz) ₱185"),
      product("matcha-series", "sisolt-matya", "Sisolt Matya", "Iced (18 oz) ₱195"),
      product("matcha-series", "istroberi-matya", "Istroberi Matya", "Iced (18 oz) ₱205"),
      product("matcha-series", "derti-matya", "Derti Matya", "Iced (18 oz) ₱220"),
    ],
  },
  {
    id: "fruit-series", title: "Fruit Series", section: "drinks",
    products: [
      product("fruit-series", "istroberi-soda", "Istroberi Soda", "Iced (18 oz) ₱80"),
      product("fruit-series", "bluberi-soda", "Bluberi Soda", "Iced (18 oz) ₱80"),
      product("fruit-series", "greyps-soda", "Greyps Soda", "Iced (18 oz) ₱80"),
      product("fruit-series", "laytsi-soda", "Laytsi Soda", "Iced (18 oz) ₱80"),
      product("fruit-series", "istroberi-melk", "Istroberi Melk", "Iced (16 oz) ₱90"),
      product("fruit-series", "bluberi-milk", "Bluberi Melk", "Iced (16 oz) ₱90"),
      product("fruit-series", "limon-yakult", "Limon Yakult", "Iced (16 oz) ₱135"),
      product("fruit-series", "istroberi-tea", "Istroberi Tea", "Iced ₱100"),
      product("fruit-series", "blueberi-tea", "Blueberi Tea", "Iced ₱100"),
      product("fruit-series", "greyps-tea", "Greyps Tea", "Iced ₱100"),
      product("fruit-series", "laytsi-tea", "Laytsi Tea", "Iced ₱100"),
    ],
  },
  {
    id: "milktea-based", title: "Milktea Based", section: "drinks",
    products: [
      product("milktea-based", "tayger-brawn-sugar", "Tayger Brawn Sugar", "Iced (16 oz) ₱115"),
      product("milktea-based", "okinawa", "Okinawa", "Iced (16 oz) ₱115"),
      product("milktea-based", "kukis-n-krim", "Kukis N Krim", "Iced ₱115"),
      product("milktea-based", "istroberi", "Istroberi", "Iced ₱115"),
    ],
  },
  {
    id: "snacks", title: "Snacks", section: "snacks",
    products: [
      product("snacks", "churros", "Churros"),
      product("snacks", "fries", "Fries", "₱135", "Flavors: Cheese, Barbeque, Sour Cream."),
      product("snacks", "hashbrowns", "Hash Brown"),
      product("snacks", "nachos", "Nachos"),
      product("snacks", "waffles", "Waffles", "₱105", "Syrup: Chocolate, Caramel, Strawberry, Matcha. Toppings: Almond, Oreo, Biscoff, Choco Chips. ₱20 for additional toppings."),
      product("snacks", "loaded-fries", "Loaded Fries"),
    ],
  },
  {
    id: "weekend-cocktails", title: "Weekend Drinks", section: "weekend-cocktails",
    products: [
      product("weekend-cocktails", "summer-cocktail", "Summer Cocktail", "₱100"),
      product("weekend-cocktails", "blueberry-pink-cocktal", "Blueberry Pink Cocktail", "₱100"),
      product("weekend-cocktails", "blueberry-peach-cocktail", "Blueberry Peach Cocktail", "₱100"),
      { ...product("weekend-cocktails", "affogato", "Affogato", "₱140"), id: "weekend-affogato" },
      product("weekend-cocktails", "lychee-rainbow-cocktail", "Lychee Rainbow Cocktail", "₱100"),
    ],
  },
];
