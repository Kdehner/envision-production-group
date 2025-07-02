// admin/src/containers/HomePage/index.js
import React, { memo } from "react";
import { PluginHeader } from "strapi-helper-plugin";

const HomePage = () => {
  return (
    <div style={{ padding: "18px 30px" }}>
      <PluginHeader
        title="Inventory Manager"
        description="Manage equipment inventory, track status, and generate reports"
      />

      <div style={{ padding: "20px 0" }}>
        <h2>Welcome to Inventory Manager</h2>
        <p>Your plugin is successfully loaded!</p>

        <div
          style={{
            background: "#f0f8ff",
            padding: "15px",
            borderRadius: "5px",
            margin: "20px 0",
            border: "1px solid #e0e0e0",
          }}
        >
          <h3 style={{ margin: "0 0 10px 0", color: "#333" }}>
            Plugin Status: ✅ Active
          </h3>
          <p style={{ margin: 0, color: "#666" }}>
            The inventory manager plugin is now running in your Strapi admin.
          </p>
        </div>

        <div style={{ marginTop: "30px" }}>
          <h3>Quick Actions</h3>
          <ul>
            <li style={{ marginBottom: "10px" }}>
              <a
                href="/admin/plugins/content-manager/collectionType/application::equipment-item.equipment-item"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#007cff", textDecoration: "underline" }}
              >
                Manage Equipment Items
              </a>
            </li>
            <li style={{ marginBottom: "10px" }}>
              <a
                href="/admin/plugins/content-manager/collectionType/application::equipment-category.equipment-category"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#007cff", textDecoration: "underline" }}
              >
                Manage Equipment Categories
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default memo(HomePage);
