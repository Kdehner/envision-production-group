import pluginPkg from "../../package.json";
import pluginId from "./pluginId";
import App from "./containers/App";
import Initializer from "./containers/Initializer";
import lifecycles from "./lifecycles";
import trads from "./translations";

export default (strapi) => {
  const plugin = {
    blockerComponent: null,
    blockerComponentProps: {},
    description: pluginPkg.strapi.description,
    icon: pluginPkg.strapi.icon,
    id: pluginId,
    initializer: Initializer,
    injectedComponents: [],
    isReady: false,
    isRequired: pluginPkg.strapi.required || false,
    layout: null,
    lifecycles,
    mainComponent: App,
    name: pluginPkg.strapi.name,
    preventComponentRendering: false,
    trads,
    menu: {
      pluginsSectionLinks: [
        {
          destination: "/plugins/inventory-manager",
          icon: "warehouse",
          label: {
            id: "inventory-manager.plugin.name",
            defaultMessage: "Inventory Manager",
          },
          name: "inventory-manager",
        },
        {
          destination: "/plugins/inventory-manager/dashboard",
          icon: "dashboard",
          label: {
            id: "inventory-manager.dashboard.name",
            defaultMessage: "Dashboard",
          },
          name: "inventory-dashboard",
        },
        {
          destination: "/plugins/inventory-manager/quick-scan",
          icon: "qrcode",
          label: {
            id: "inventory-manager.scan.name",
            defaultMessage: "Quick Scan",
          },
          name: "quick-scan",
        },
      ],
    },
  };

  return strapi.registerPlugin(plugin);
};
