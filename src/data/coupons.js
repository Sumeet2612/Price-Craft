// src/data/coupons.js

export const coupons = [
  {
    id: "SAVE10",
    type: "PERCENTAGE",
    value: 10,
    stackable: false,
    expiry: "2027-12-31",

    condition: {
      minCartValue: 0,
      applicableCategories: ["all"],
    },
  },

  {
    id: "FLAT200",
    type: "FLAT",
    value: 200,
    stackable: true,
    expiry: "2027-12-31",

    condition: {
      minCartValue: 1000,
      applicableCategories: ["all"],
    },
  },

  {
    id: "FASHION20",
    type: "PERCENTAGE",
    value: 20,
    stackable: false,
    expiry: "2027-12-31",

    condition: {
      minCartValue: 500,
      applicableCategories: ["Fashion"],
    },
  },

  {
    id: "BOGOBOOKS",
    type: "BOGO",
    value: 1,
    stackable: false,
    expiry: "2027-12-31",

    condition: {
      minCartValue: 0,
      applicableCategories: ["Books"],
    },
  },

  {
    id: "BIG500",
    type: "MIN_CART_VALUE",
    value: 500,
    stackable: true,
    expiry: "2027-12-31",

    condition: {
      minCartValue: 2000,
      applicableCategories: ["all"],
    },
  },
];