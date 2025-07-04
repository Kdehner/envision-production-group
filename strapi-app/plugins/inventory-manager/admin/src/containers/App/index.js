// admin/src/containers/App/index.js - Updated with CreateEquipment route
import React, { memo } from "react";
import { Switch, Route } from "react-router-dom";
import { NotFound } from "strapi-helper-plugin";

import pluginId from "../../pluginId";
import HomePage from "../HomePage";
import Dashboard from "../Dashboard";
import QuickScan from "../QuickScan";
import CreateEquipment from "../CreateEquipment";

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
        <Route
          path={`/plugins/${pluginId}/create-equipment`}
          component={CreateEquipment}
          exact
        />
        <Route component={NotFound} />
      </Switch>
    </div>
  );
};

export default memo(App);
