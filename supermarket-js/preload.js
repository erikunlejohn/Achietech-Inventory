// ===== Preload Sample Data for ACHIETECH =====
// Runs once — if no data already in localStorage

if (!localStorage.getItem("products")) {
  const preloadProducts = [
    // ===== LAPTOPS =====
    { id: 1, name: "HP EliteBook 840 G8", category: "Laptops", price: 820000, quantity: 8, dateAdded: "2025-10-17" },
    { id: 2, name: "Dell XPS 13", category: "Laptops", price: 950000, quantity: 5, dateAdded: "2025-10-17" },
    { id: 3, name: "MacBook Air M2", category: "Laptops", price: 1250000, quantity: 6, dateAdded: "2025-10-17" },
    { id: 4, name: "Asus ROG Zephyrus G14", category: "Laptops", price: 1450000, quantity: 3, dateAdded: "2025-10-17" },
    { id: 5, name: "Lenovo ThinkPad X1 Carbon", category: "Laptops", price: 1100000, quantity: 4, dateAdded: "2025-10-17" },
    { id: 6, name: "Acer Aspire 5", category: "Laptops", price: 480000, quantity: 10, dateAdded: "2025-10-17" },
    { id: 7, name: "MSI Modern 15", category: "Laptops", price: 750000, quantity: 7, dateAdded: "2025-10-17" },
    { id: 8, name: "HP Pavilion 15", category: "Laptops", price: 580000, quantity: 9, dateAdded: "2025-10-17" },
    { id: 9, name: "Apple MacBook Pro 16 M3", category: "Laptops", price: 1950000, quantity: 2, dateAdded: "2025-10-17" },
    { id: 10, name: "Samsung Galaxy Book3", category: "Laptops", price: 870000, quantity: 5, dateAdded: "2025-10-17" },

    // ===== PHONES =====
    { id: 11, name: "iPhone 14 Pro Max", category: "Phones", price: 1250000, quantity: 10, dateAdded: "2025-10-17" },
    { id: 12, name: "Samsung Galaxy S23 Ultra", category: "Phones", price: 1150000, quantity: 7, dateAdded: "2025-10-17" },
    { id: 13, name: "Tecno Phantom X2", category: "Phones", price: 490000, quantity: 12, dateAdded: "2025-10-17" },
    { id: 14, name: "Infinix Zero 30 5G", category: "Phones", price: 420000, quantity: 15, dateAdded: "2025-10-17" },
    { id: 15, name: "Google Pixel 8", category: "Phones", price: 950000, quantity: 6, dateAdded: "2025-10-17" },
    { id: 16, name: "Xiaomi Redmi Note 13 Pro+", category: "Phones", price: 380000, quantity: 10, dateAdded: "2025-10-17" },
    { id: 17, name: "iPhone 13", category: "Phones", price: 950000, quantity: 9, dateAdded: "2025-10-17" },
    { id: 18, name: "Samsung A55 5G", category: "Phones", price: 520000, quantity: 11, dateAdded: "2025-10-17" },
    { id: 19, name: "Oppo Reno 11", category: "Phones", price: 480000, quantity: 8, dateAdded: "2025-10-17" },
    { id: 20, name: "Huawei P60 Pro", category: "Phones", price: 1050000, quantity: 4, dateAdded: "2025-10-17" },

    // ===== DESKTOPS =====
    { id: 21, name: "HP ProDesk 600 G5", category: "Desktops", price: 430000, quantity: 6, dateAdded: "2025-10-17" },
    { id: 22, name: "Dell OptiPlex 7090", category: "Desktops", price: 560000, quantity: 5, dateAdded: "2025-10-17" },
    { id: 23, name: "Apple iMac 24-inch M1", category: "Desktops", price: 1350000, quantity: 3, dateAdded: "2025-10-17" },
    { id: 24, name: "Acer Aspire TC-1760", category: "Desktops", price: 390000, quantity: 8, dateAdded: "2025-10-17" },
    { id: 25, name: "Lenovo IdeaCentre 5", category: "Desktops", price: 410000, quantity: 7, dateAdded: "2025-10-17" },
    { id: 26, name: "Asus ExpertCenter D7", category: "Desktops", price: 520000, quantity: 6, dateAdded: "2025-10-17" },
    { id: 27, name: "Dell Inspiron 24 AIO", category: "Desktops", price: 620000, quantity: 5, dateAdded: "2025-10-17" },
    { id: 28, name: "HP All-in-One 27", category: "Desktops", price: 750000, quantity: 4, dateAdded: "2025-10-17" },
    { id: 29, name: "Apple Mac Studio M2 Max", category: "Desktops", price: 1850000, quantity: 2, dateAdded: "2025-10-17" },
    { id: 30, name: "Lenovo ThinkCentre Neo 50s", category: "Desktops", price: 460000, quantity: 6, dateAdded: "2025-10-17" },

    // ===== GADGETS =====
    { id: 31, name: "Apple AirPods Pro 2", category: "Gadgets", price: 230000, quantity: 12, dateAdded: "2025-10-17" },
    { id: 32, name: "Anker PowerCore 20000mAh", category: "Gadgets", price: 38000, quantity: 20, dateAdded: "2025-10-17" },
    { id: 33, name: "Logitech MX Master 3 Mouse", category: "Gadgets", price: 95000, quantity: 10, dateAdded: "2025-10-17" },
    { id: 34, name: "Sony WH-1000XM5 Headphones", category: "Gadgets", price: 480000, quantity: 7, dateAdded: "2025-10-17" },
    { id: 35, name: "JBL Flip 6 Bluetooth Speaker", category: "Gadgets", price: 89000, quantity: 14, dateAdded: "2025-10-17" },
    { id: 36, name: "Samsung 25W Fast Charger", category: "Gadgets", price: 18000, quantity: 30, dateAdded: "2025-10-17" },
    { id: 37, name: "Sandisk 128GB Flash Drive", category: "Gadgets", price: 14000, quantity: 25, dateAdded: "2025-10-17" },
    { id: 38, name: "Zealot B28 Wireless Headset", category: "Gadgets", price: 28000, quantity: 15, dateAdded: "2025-10-17" },
    { id: 39, name: "Oraimo Power Bank 20000mAh", category: "Gadgets", price: 25000, quantity: 18, dateAdded: "2025-10-17" },
    { id: 40, name: "UGREEN USB-C Hub", category: "Gadgets", price: 32000, quantity: 12, dateAdded: "2025-10-17" },
    { id: 41, name: "Apple 35W Dual USB-C Charger", category: "Gadgets", price: 48000, quantity: 9, dateAdded: "2025-10-17" },
    { id: 42, name: "Baseus Encok W3 Earbuds", category: "Gadgets", price: 18000, quantity: 20, dateAdded: "2025-10-17" },
    { id: 43, name: "Oraimo Smart Watch OSW-18", category: "Gadgets", price: 45000, quantity: 8, dateAdded: "2025-10-17" },
    { id: 44, name: "Apple Magic Keyboard", category: "Gadgets", price: 105000, quantity: 6, dateAdded: "2025-10-17" },
    { id: 45, name: "Logitech C920 HD Webcam", category: "Gadgets", price: 68000, quantity: 7, dateAdded: "2025-10-17" },
    { id: 46, name: "Anker Soundcore A20i", category: "Gadgets", price: 24000, quantity: 15, dateAdded: "2025-10-17" },
    { id: 47, name: "Sandisk 1TB External SSD", category: "Gadgets", price: 185000, quantity: 5, dateAdded: "2025-10-17" },
    { id: 48, name: "Apple MagSafe Charger", category: "Gadgets", price: 40000, quantity: 10, dateAdded: "2025-10-17" },
    { id: 49, name: "HP Wireless Keyboard Combo", category: "Gadgets", price: 35000, quantity: 8, dateAdded: "2025-10-17" },
    { id: 50, name: "Oraimo FreePods 4", category: "Gadgets", price: 28000, quantity: 14, dateAdded: "2025-10-17" },
  ];

  localStorage.setItem("products", JSON.stringify(preloadProducts));
  console.log("✅ Preloaded 50 products into localStorage.");
} else {
  console.log("ℹ️ Products already exist in localStorage. Skipping preload.");
}
// This file is intended to be loaded before other scripts to ensure data is available.