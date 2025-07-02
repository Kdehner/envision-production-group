// admin/src/containers/Initializer/index.js
import { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import pluginId from "../../pluginId";

const Initializer = ({ updatePlugin }) => {
  const ref = useRef();
  ref.current = updatePlugin;

  useEffect(() => {
    console.log("🔧 Initializer mounted for", pluginId);

    // Mark plugin as ready - this is critical for menu display
    ref.current(pluginId, "isReady", true);

    console.log("🔧 Plugin marked as ready:", pluginId);
  }, []);

  return null;
};

Initializer.propTypes = {
  updatePlugin: PropTypes.func.isRequired,
};

export default Initializer;
