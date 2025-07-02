// admin/src/index.js - Fixed for Strapi v3 navigation
import pluginPkg from "../../package.json";
import pluginId from "./pluginId";
import App from "./containers/App";
import Initializer from "./containers/Initializer";
import lifecycles from "./lifecycles";
import trads from "./translations";

export default (strapi) => {
  console.log("🔧 Registering plugin:", pluginId);

  const pluginDescription =
    pluginPkg.strapi.description || pluginPkg.description;
  const icon = pluginPkg.strapi.icon;
  const name = pluginPkg.strapi.name;

  const plugin = {
    blockerComponent: null,
    blockerComponentProps: {},
    description: pluginDescription,
    icon,
    id: pluginId,
    initializer: Initializer,
    injectedComponents: [],
    isRequired: pluginPkg.strapi.required || false,
    layout: null,
    lifecycles,
    mainComponent: App,
    name,
    preventComponentRendering: false,
    trads,
    menu: {
      // CRITICAL: Use pluginsSectionLinks for Strapi v3
      pluginsSectionLinks: [
        {
          destination: `/plugins/${pluginId}`,
          icon,
          label: {
            id: `${pluginId}.plugin.name`,
            defaultMessage: "Inventory Manager",
          },
          name,
          // FIXED: Remove permissions that might be blocking menu display
          // Permissions will be handled at the component level instead
        },
      ],
    },
  };

  console.log("🔧 Plugin registration details:", {
    id: plugin.id,
    name: plugin.name,
    icon: plugin.icon,
    hasInitializer: !!plugin.initializer,
    hasMainComponent: !!plugin.mainComponent,
    menuLinksCount: plugin.menu.pluginsSectionLinks.length,
    destination: plugin.menu.pluginsSectionLinks[0].destination,
  });

  return strapi.registerPlugin(plugin);
};
