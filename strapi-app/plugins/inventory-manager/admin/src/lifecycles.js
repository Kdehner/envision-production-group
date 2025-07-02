console.log("🔧 Loading lifecycles.js");

function bootstrap() {
  console.log("🚀 Inventory Manager plugin bootstrap called");
  console.log("🚀 Plugin should now be available in admin");
}

function registerTrads() {
  console.log("🔧 registerTrads called for inventory-manager");
  return {};
}

export default {
  bootstrap,
  registerTrads,
};
