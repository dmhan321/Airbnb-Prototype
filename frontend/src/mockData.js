// mockData.js

// 模拟用户信息
export const users = [
  {
    id: 1,
    name: "Alice",
    email: "alice@example.com",
    role: "host", // host: 房东
  },
  {
    id: 2,
    name: "Bob",
    email: "bob@example.com",
    role: "guest", // guest: 普通用户
  },
  {
    id: 3,
    name: "Charlie",
    email: "charlie@example.com",
    role: "host",
  },
];

// 模拟房源信息
export const properties = [
  {
    id: 101,
    title: "Cozy Apartment in San Francisco",
    location: "San Francisco",
    price: 120,
    guests: 2,
    availableFrom: "2025-09-01",
    availableTo: "2025-12-31",
    image: "https://via.placeholder.com/300x200.png?text=San+Francisco+Apartment",
    ownerId: 1, // 对应 Alice
    ownerName: "Alice",
  },
  {
    id: 102,
    title: "Beach House in Santa Cruz",
    location: "Santa Cruz",
    price: 200,
    guests: 4,
    availableFrom: "2025-10-01",
    availableTo: "2025-12-15",
    image: "https://via.placeholder.com/300x200.png?text=Santa+Cruz+Beach+House",
    ownerId: 3, // 对应 Charlie
    ownerName: "Charlie",
  },
  {
    id: 103,
    title: "Modern Condo in Los Angeles",
    location: "Los Angeles",
    price: 150,
    guests: 3,
    availableFrom: "2025-09-15",
    availableTo: "2025-12-30",
    image: "https://via.placeholder.com/300x200.png?text=LA+Condo",
    ownerId: 1, // Alice 也可以有多个房源
    ownerName: "Alice",
  },
];