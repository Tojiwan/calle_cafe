export type MenuProduct = {
  id: string;
  name: string;
  image: string;
  alt: string;
  piecesLabel?: string;
  priceLabel?: string;
  description?: string;
  options?: { label: string; values: string }[];
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
  details: Pick<MenuProduct, "piecesLabel" | "description" | "options"> = {},
): MenuProduct {
  return { id, name, image: `/images/products/${category}/${id}.webp`, alt: `Calle Café ${name}`, priceLabel, ...details };
}

// Price references and unresolved content are documented in docs/menu-content.md.
export const menuCategories: MenuCategory[] = [
  {
    id: "coffee-based", title: "Coffee Based", section: "drinks",
    products: [
      product("coffee-based", "EYSEL NAT KOPI", "Eysel Nat Kopi", "Hot (10 oz) ₱120 · Iced (16 oz) ₱150"),
      product("coffee-based", "ISPANIS LATEY", "Ispanis Latey", "Hot (10 oz) ₱115 · Iced (16 oz) ₱160"),
      product("coffee-based", "KARAMEL MAKAYATO", "Karamel Makayato", "Hot (10 oz) ₱100 · Iced (16 oz) ₱145"),
      product("coffee-based", "WAYT MOKA LATEY", "Wayt Moka Latey", "Hot (10 oz) ₱100 · Iced (16 oz) ₱140"),
      product("coffee-based", "SISOLT LATEY", "Sisolt Latey", "Hot (10 oz) ₱100 · Iced (16 oz) ₱140"),
      product("coffee-based", "MOKA LATEY", "Moka Latey", "Hot (10 oz) ₱100 · Iced (16 oz) ₱140"),
      { ...product("coffee-based", "affogato", "Affogato", "₱140"), id: "coffee-affogato" },
    ],
  },
  {
    id: "matcha-series", title: "Matcha Series", section: "drinks",
    products: [
      product("matcha-series", "MATYA LATEY", "Matya Latey", "Iced (18 oz) ₱185"),
      product("matcha-series", "SISOLT MATYA", "Sisolt Matya", "Iced (18 oz) ₱195"),
      product("matcha-series", "ISTROBERI MATYA", "Istroberi Matya", "Iced (18 oz) ₱205"),
      product("matcha-series", "DERTI MATYA", "Derti Matya", "Iced (18 oz) ₱220"),
    ],
  },
  {
    id: "fruit-series", title: "Fruit Series", section: "drinks",
    products: [
      product("fruit-series", "ISTROBERI SODA", "Istroberi Soda", "Iced (18 oz) ₱80"),
      product("fruit-series", "BLUBERI SODA", "Bluberi Soda", "Iced (18 oz) ₱80"),
      product("fruit-series", "GREYPS SODA", "Greyps Soda", "Iced (18 oz) ₱80"),
      product("fruit-series", "LAYTSI SODA", "Laytsi Soda", "Iced (18 oz) ₱80"),
      product("fruit-series", "ISTROBERI MELK", "Istroberi Melk", "Iced (16 oz) ₱90"),
      product("fruit-series", "BLUBERI MELK", "Bluberi Melk", "Iced (16 oz) ₱90"),
      product("fruit-series", "LIMON YAKULT", "Limon Yakult", "Iced (16 oz) ₱135"),
      product("fruit-series", "ISTROBERI TEA", "Istroberi Tea", "Iced ₱100"),
      product("fruit-series", "BLUBERITEA", "Blueberi Tea", "Iced ₱100"),
      product("fruit-series", "GREYPS TEA", "Greyps Tea", "Iced ₱100"),
      product("fruit-series", "LAYTSI TEA", "Laytsi Tea", "Iced ₱100"),
    ],
  },
  {
    id: "milktea-based", title: "Milktea Based", section: "drinks",
    products: [
      product("milktea-based", "TAYGER BRAWN SUGAR", "Tayger Brawn Sugar", "Iced (16 oz) ₱115"),
      product("milktea-based", "OKININAWA", "Okininawa", "Iced (16 oz) ₱115"),
      product("milktea-based", "KUKIS N KRIM", "Kukis N Krim", "Iced ₱115"),
      product("milktea-based", "ISTROBERI", "Istroberi", "Iced ₱115"),
    ],
  },
  {
    id: "snacks", title: "Snacks", section: "snacks",
    products: [
      product("snacks", "churros", "Tsuros", "₱100", {
        piecesLabel: "5 pieces",
        options: [{ label: "Dip options", values: "Chocolate · Caramel · Strawberry · Matcha" }],
      }),
      product("snacks", "fries", "Fries", "₱135", {
        options: [{ label: "Flavor options", values: "Cheese · Barbeque · Sour Cream" }],
      }),
      product("snacks", "HASH BROWNS", "AshBrawn", "₱140", { piecesLabel: "3 pieces" }),
      product("snacks", "nachos", "NaChoz", "₱185"),
      product("snacks", "waffles", "Waffles", "₱105", {
        options: [
          { label: "Syrup options", values: "Chocolate · Caramel · Strawberry · Matcha" },
          { label: "Toppings", values: "Almond · Oreo · Biscoff · Choco Chips" },
        ]
      }),
      product("snacks", "LOADED FRIES", "Oberload Fries", "₱165"),
    ],
  },
  {
    id: "weekend-cocktails", title: "Weekend Drinks", section: "weekend-cocktails",
    products: [
      product("weekend-cocktails", "summer-cocktail", "Summer Cocktail", "₱100"),
      product("weekend-cocktails", "blueberry-pink-cocktail", "Blueberry Pink Cocktail", "₱100"),
      product("weekend-cocktails", "blueberry-peach-cocktail", "Blueberry Peach Cocktail", "₱100"),
      product("weekend-cocktails", "lychee-rainbow-cocktail", "Lychee Rainbow Cocktail", "₱100"),
    ],
  },
];
