export type MenuPrice = { label?: string; value: string };

export type MenuProduct = {
  id: string;
  name: string;
  image: string;
  alt: string;
  piecesLabel?: string;
  priceLabel?: string;
  prices?: MenuPrice[];
  description?: string;
  options?: { label: string; values: string[] }[];
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
  prices: MenuPrice[] | string,
  details: Pick<MenuProduct, "piecesLabel" | "description" | "options"> = {},
): MenuProduct {
  return {
    id, name, image: `/images/products/${category}/${id}.webp`, alt: `Calle Café ${name}`,
    ...(typeof prices === "string" ? { priceLabel: prices } : { prices }),
    ...details,
  };
}

// Price references and unresolved content are documented in docs/menu-content.md.
export const menuCategories: MenuCategory[] = [
  {
    id: "coffee-based", title: "Coffee Based", section: "drinks",
    products: [
      product("coffee-based", "EYSEL NAT KOPI", "Eysel Nat Kopi", [{ label: "Hot · 10 oz", value: "₱120" }, { label: "Iced · 16 oz", value: "₱150" }]),
      product("coffee-based", "ISPANIS LATEY", "Ispanis Latey", [{ label: "Hot · 10 oz", value: "₱115" }, { label: "Iced · 16 oz", value: "₱160" }]),
      product("coffee-based", "KARAMEL MAKAYATO", "Karamel Makayato", [{ label: "Hot · 10 oz", value: "₱100" }, { label: "Iced · 16 oz", value: "₱145" }]),
      product("coffee-based", "WAYT MOKA LATEY", "Wayt Moka Latey", [{ label: "Hot · 10 oz", value: "₱100" }, { label: "Iced · 16 oz", value: "₱140" }]),
      product("coffee-based", "SISOLT LATEY", "Sisolt Latey", [{ label: "Hot · 10 oz", value: "₱100" }, { label: "Iced · 16 oz", value: "₱140" }]),
      product("coffee-based", "MOKA LATEY", "Moka Latey", [{ label: "Hot · 10 oz", value: "₱100" }, { label: "Iced · 16 oz", value: "₱140" }]),
      { ...product("coffee-based", "affogato", "Affogato", [{ value: "₱140" }]), id: "coffee-affogato" },
    ],
  },
  {
    id: "matcha-series", title: "Matcha Series", section: "drinks",
    products: [
      product("matcha-series", "MATYA LATEY", "Matya Latey", [{ label: "Iced · 18 oz", value: "₱185" }]),
      product("matcha-series", "SISOLT MATYA", "Sisolt Matya", [{ label: "Iced · 18 oz", value: "₱195" }]),
      product("matcha-series", "ISTROBERI MATYA", "Istroberi Matya", [{ label: "Iced · 18 oz", value: "₱205" }]),
      product("matcha-series", "DERTI MATYA", "Derti Matya", [{ label: "Iced · 18 oz", value: "₱220" }]),
    ],
  },
  {
    id: "fruit-series", title: "Fruit Series", section: "drinks",
    products: [
      product("fruit-series", "ISTROBERI SODA", "Istroberi Soda", [{ label: "Iced · 18 oz", value: "₱80" }]),
      product("fruit-series", "BLUBERI SODA", "Bluberi Soda", [{ label: "Iced · 18 oz", value: "₱80" }]),
      product("fruit-series", "GREYPS SODA", "Greyps Soda", [{ label: "Iced · 18 oz", value: "₱80" }]),
      product("fruit-series", "LAYTSI SODA", "Laytsi Soda", [{ label: "Iced · 18 oz", value: "₱80" }]),
      product("fruit-series", "ISTROBERI MELK", "Istroberi Melk", [{ label: "Iced · 16 oz", value: "₱90" }]),
      product("fruit-series", "BLUBERI MELK", "Bluberi Melk", [{ label: "Iced · 16 oz", value: "₱90" }]),
      product("fruit-series", "LIMON YAKULT", "Limon Yakult", [{ label: "Iced · 16 oz", value: "₱135" }]),
      product("fruit-series", "ISTROBERI TEA", "Istroberi Tea", [{ label: "Iced", value: "₱100" }]),
      product("fruit-series", "BLUBERITEA", "Blueberi Tea", [{ label: "Iced", value: "₱100" }]),
      product("fruit-series", "GREYPS TEA", "Greyps Tea", [{ label: "Iced", value: "₱100" }]),
      product("fruit-series", "LAYTSI TEA", "Laytsi Tea", [{ label: "Iced", value: "₱100" }]),
    ],
  },
  {
    id: "milktea-based", title: "Milktea Based", section: "drinks",
    products: [
      product("milktea-based", "TAYGER BRAWN SUGAR", "Tayger Brawn Sugar", [{ label: "Iced · 16 oz", value: "₱115" }]),
      product("milktea-based", "OKININAWA", "Okininawa", [{ label: "Iced · 16 oz", value: "₱115" }]),
      product("milktea-based", "KUKIS N KRIM", "Kukis N Krim", [{ label: "Iced · 16 oz", value: "₱115" }]),
      product("milktea-based", "ISTROBERI", "Istroberi", [{ label: "Iced · 16 oz", value: "₱115" }]),
    ],
  },
  {
    id: "snacks", title: "Snacks", section: "snacks",
    products: [
      product("snacks", "churros", "Tsuros", [{ value: "₱100" }], {
        piecesLabel: "5 pieces",
        options: [{ label: "Dip options", values: ["Chocolate", "Caramel", "Strawberry", "Matcha"] }],
      }),
      product("snacks", "fries", "Fries", [{ value: "₱135" }], {
        options: [{ label: "Flavor options", values: ["Cheese", "Barbeque", "Sour Cream"] }],
      }),
      product("snacks", "HASH BROWNS", "AshBrawn", [{ value: "₱140" }], { piecesLabel: "3 pieces" }),
      product("snacks", "nachos", "NaChoz", [{ value: "₱185" }]),
      product("snacks", "waffles", "Waffles", [{ value: "₱105" }], {
        options: [
          { label: "Syrup options", values: ["Chocolate", "Caramel", "Strawberry", "Matcha"] },
          { label: "Toppings", values: ["Almond", "Oreo", "Biscoff", "Choco Chips"] },
        ]
      }),
      product("snacks", "LOADED FRIES", "Oberload Fries", [{ value: "₱165" }]),
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
