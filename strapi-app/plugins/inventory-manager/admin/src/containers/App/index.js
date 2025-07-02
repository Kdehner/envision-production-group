import React, { memo } from "react";
import { Switch, Route } from "react-router-dom";
import { NotFound } from "strapi-helper-plugin";

import pluginId from "../../pluginId";
import HomePage from "../HomePage";
import Dashboard from "../Dashboard";
import QuickScan from "../QuickScan";

const App = () => {
  return (
    <div>
      <Switch>
        <Route path={`/plugins/${pluginId}`} component={HomePage} exact />
        <Route
          path={`/plugins/${pluginId}/dashboard`}
          component={Dashboard}
          exact
        />
        <Route
          path={`/plugins/${pluginId}/quick-scan`}
          component={QuickScan}
          exact
        />
        <Route component={NotFound} />
      </Switch>
    </div>
  );
};

export default memo(App);
