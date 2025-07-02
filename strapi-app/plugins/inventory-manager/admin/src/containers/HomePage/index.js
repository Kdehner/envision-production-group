// admin/src/containers/HomePage/index.js - Enhanced with navigation
import React, { memo } from "react";
import { PluginHeader } from "strapi-helper-plugin";
import { useHistory } from "react-router-dom";
import pluginId from "../../pluginId";

const HomePage = () => {
  const history = useHistory();

  const navigateTo = (path) => {
    history.push(`/plugins/${pluginId}${path}`);
  };

  const cardStyle = {
    background: "white",
    borderRadius: "8px",
    padding: "20px",
    margin: "10px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    cursor: "pointer",
    border: "2px solid transparent",
    transition: "all 0.3s ease",
  };

  const cardHoverStyle = {
    ...cardStyle,
    borderColor: "#007cff",
    transform: "translateY(-2px)",
  };

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

        {/* Plugin Features Grid */}
        <h3>Plugin Features</h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "20px",
            margin: "20px 0",
          }}
        >
          {/* Dashboard Card */}
          <div
            style={cardStyle}
            onClick={() => navigateTo("/dashboard")}
            onMouseEnter={(e) => {
              e.target.style.borderColor = "#007cff";
              e.target.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.target.style.borderColor = "transparent";
              e.target.style.transform = "translateY(0)";
            }}
          >
            <h4 style={{ margin: "0 0 10px 0", color: "#007cff" }}>
              📊 Dashboard
            </h4>
            <p style={{ margin: 0, color: "#666" }}>
              View equipment statistics, availability metrics, and recent
              activity
            </p>
          </div>

          {/* Quick Scan Card */}
          <div
            style={cardStyle}
            onClick={() => navigateTo("/quick-scan")}
            onMouseEnter={(e) => {
              e.target.style.borderColor = "#007cff";
              e.target.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.target.style.borderColor = "transparent";
              e.target.style.transform = "translateY(0)";
            }}
          >
            <h4 style={{ margin: "0 0 10px 0", color: "#007cff" }}>
              📱 Quick Scan
            </h4>
            <p style={{ margin: 0, color: "#666" }}>
              Scan equipment barcodes or enter SKU to check status and update
              inventory
            </p>
          </div>
        </div>

        {/* Quick Actions */}
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

        {/* API Endpoints Status */}
        <div style={{ marginTop: "30px" }}>
          <h3>Available API Endpoints</h3>
          <div
            style={{
              background: "#f8f9fa",
              padding: "15px",
              borderRadius: "5px",
              fontFamily: "monospace",
              fontSize: "14px",
            }}
          >
            <div>✅ GET /inventory-manager/statistics</div>
            <div>✅ GET /inventory-manager/equipment/sku/:sku</div>
            <div>✅ PUT /inventory-manager/equipment/:id/status</div>
            <div>✅ GET /inventory-manager/equipment/:id/availability</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(HomePage);
