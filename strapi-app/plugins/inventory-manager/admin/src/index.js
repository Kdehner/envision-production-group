// admin/src/index.js - Exactly following Strapi v3 docs
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
    initializer: Initializer, // This must be the component, not null
    injectedComponents: [],
    isRequired: pluginPkg.strapi.required || false,
    layout: null,
    lifecycles,
    mainComponent: App,
    name,
    preventComponentRendering: false,
    trads,
    menu: {
      // Set a link into the PLUGINS section
      pluginsSectionLinks: [
        {
          destination: `/plugins/${pluginId}`,
          icon,
          label: {
            id: `${pluginId}.plugin.name`,
            defaultMessage: "Inventory Manager",
          },
          name,
          // Permissions based on docs example
          permissions: [
            {
              action: "plugins::inventory-manager.read",
              subject: null,
            },
          ],
        },
      ],
    },
  };

  console.log("🔧 Plugin config created:", {
    id: plugin.id,
    name: plugin.name,
    hasInitializer: !!plugin.initializer,
    hasMainComponent: !!plugin.mainComponent,
    menuLinks: plugin.menu.pluginsSectionLinks.length,
  });

  return strapi.registerPlugin(plugin);
};
