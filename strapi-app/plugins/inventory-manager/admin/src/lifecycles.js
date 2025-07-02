// admin/src/lifecycles.js - Enhanced debugging
console.log("🔧 Loading lifecycles.js for inventory-manager");

function bootstrap() {
  console.log("🚀 BOOTSTRAP: Inventory Manager plugin bootstrap called");
  console.log("🚀 BOOTSTRAP: Plugin should now be available in admin");

  // Debug: Check if strapi global is available
  if (typeof window !== "undefined" && window.strapi) {
    console.log("🔧 DEBUG: Strapi admin context available");
    console.log(
      "🔧 DEBUG: Registered plugins:",
      Object.keys(window.strapi.plugins || {})
    );
  }
}

function registerTrads() {
  console.log("🔧 TRANSLATIONS: registerTrads called for inventory-manager");

  // Return translations properly
  return {
    en: {
      "inventory-manager.plugin.name": "Inventory Manager",
      "inventory-manager.plugin.description":
        "Manage equipment inventory, bookings, and repairs",
    },
  };
}

export default {
  bootstrap,
  registerTrads,
};
