// admin/src/containers/Initializer/index.js - Enhanced for menu display
import { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import pluginId from "../../pluginId";

const Initializer = ({ updatePlugin }) => {
  const ref = useRef();
  ref.current = updatePlugin;

  useEffect(() => {
    console.log("🔧 Initializer starting for plugin:", pluginId);

    // Critical: Mark plugin as ready for menu display
    ref.current(pluginId, "isReady", true);

    console.log("✅ Plugin marked as ready:", pluginId);
    console.log("🔧 Menu should now be visible in admin sidebar");

    // Optional: Additional plugin initialization can go here
    // For example: registering additional components, setting up event listeners, etc.
  }, []);

  return null;
};

Initializer.propTypes = {
  updatePlugin: PropTypes.func.isRequired,
};

export default Initializer;
