export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  emoji: string;
}

// Seed data — used by the seed script to populate Firestore
export const grocerySeedData: Omit<Product, "id">[] = [
  { name: "Basmati Rice (5kg)", price: 1250, description: "Premium long-grain basmati rice, perfect for biriyani and fried rice.", emoji: "🍚" },
  { name: "Ceylon Tea (500g)", price: 680, description: "Authentic Sri Lankan black tea with a rich, bold flavor.", emoji: "🍵" },
  { name: "Coconut Oil (1L)", price: 890, description: "Pure cold-pressed coconut oil for cooking and frying.", emoji: "🥥" },
  { name: "Red Lentils (1kg)", price: 520, description: "High-quality dhal, a staple for Sri Lankan curry.", emoji: "🫘" },
  { name: "Cinnamon Sticks (100g)", price: 350, description: "True Ceylon cinnamon with a delicate, sweet aroma.", emoji: "🌿" },
];

export const electronicSeedData: Omit<Product, "id">[] = [
  { name: "Wireless Earbuds", price: 4500, description: "Bluetooth 5.3 earbuds with noise cancellation and 24h battery.", emoji: "🎧" },
  { name: "Smart Watch", price: 8900, description: "Fitness tracker with heart rate monitor and GPS.", emoji: "⌚" },
  { name: "Portable Speaker", price: 3200, description: "Waterproof Bluetooth speaker with deep bass and 12h playtime.", emoji: "🔊" },
  { name: "USB-C Hub", price: 2800, description: "7-in-1 hub with HDMI, USB 3.0, SD card reader, and PD charging.", emoji: "🔌" },
  { name: "Webcam HD 1080p", price: 5600, description: "Full HD webcam with built-in microphone for video calls.", emoji: "📷" },
];
