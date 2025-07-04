// admin/src/containers/HomePage/index.js - Updated with Create Equipment navigation
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

  const primaryCardStyle = {
    ...cardStyle,
    background: "linear-gradient(135deg, #007cff 0%, #0056b3 100%)",
    color: "white",
    border: "2px solid #007cff",
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

        {/* Quick Actions Section */}
        <h3>Quick Actions</h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "20px",
            margin: "20px 0",
          }}
        >
          {/* Create Equipment Card - Primary Action */}
          <div
            style={primaryCardStyle}
            onClick={() => navigateTo("/create-equipment")}
            onMouseEnter={(e) => {
              e.target.style.transform = "translateY(-2px)";
              e.target.style.boxShadow = "0 4px 8px rgba(0, 124, 255, 0.3)";
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.1)";
            }}
          >
            <h4 style={{ margin: "0 0 10px 0", color: "white" }}>
              ➕ Create Equipment
            </h4>
            <p style={{ margin: 0, color: "rgba(255, 255, 255, 0.9)" }}>
              Add new equipment to inventory with automatic SKU generation
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
              Scan equipment QR codes or barcodes for instant status updates
            </p>
          </div>
        </div>

        {/* Plugin Features Grid */}
        <h3>Management Features</h3>
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

          {/* Equipment List - Link to Strapi Collection */}
          <div
            style={cardStyle}
            onClick={() => {
              // Navigate to Strapi's equipment collection manager
              window.location.href =
                "/admin/plugins/content-manager/collectionType/application::equipment-item.equipment-item";
            }}
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
              📋 Equipment List
            </h4>
            <p style={{ margin: 0, color: "#666" }}>
              View and manage all equipment in the system
            </p>
          </div>

          {/* Reports Card - Future Feature */}
          <div
            style={{
              ...cardStyle,
              opacity: 0.6,
              cursor: "not-allowed",
            }}
            onClick={(e) => {
              e.preventDefault();
              alert("Reports feature coming soon!");
            }}
          >
            <h4 style={{ margin: "0 0 10px 0", color: "#6c757d" }}>
              📈 Reports
            </h4>
            <p style={{ margin: 0, color: "#666" }}>
              Generate equipment utilization and maintenance reports
            </p>
            <div
              style={{
                fontSize: "12px",
                color: "#ffc107",
                marginTop: "8px",
                fontWeight: "bold",
              }}
            >
              Coming Soon
            </div>
          </div>

          {/* Settings Card - Future Feature */}
          <div
            style={{
              ...cardStyle,
              opacity: 0.6,
              cursor: "not-allowed",
            }}
            onClick={(e) => {
              e.preventDefault();
              alert("Settings feature coming soon!");
            }}
          >
            <h4 style={{ margin: "0 0 10px 0", color: "#6c757d" }}>
              ⚙️ Settings
            </h4>
            <p style={{ margin: 0, color: "#666" }}>
              Configure SKU patterns, locations, and system preferences
            </p>
            <div
              style={{
                fontSize: "12px",
                color: "#ffc107",
                marginTop: "8px",
                fontWeight: "bold",
              }}
            >
              Coming Soon
            </div>
          </div>
        </div>

        {/* Recent Activity Section */}
        <div
          style={{
            background: "white",
            borderRadius: "8px",
            padding: "20px",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
            marginTop: "30px",
          }}
        >
          <h3 style={{ margin: "0 0 15px 0", color: "#333" }}>
            🔧 System Status
          </h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "15px",
            }}
          >
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  fontSize: "24px",
                  fontWeight: "bold",
                  color: "#28a745",
                }}
              >
                ✅
              </div>
              <div
                style={{ fontSize: "14px", color: "#666", marginTop: "5px" }}
              >
                SKU System Active
              </div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  fontSize: "24px",
                  fontWeight: "bold",
                  color: "#28a745",
                }}
              >
                25+
              </div>
              <div
                style={{ fontSize: "14px", color: "#666", marginTop: "5px" }}
              >
                Brand Prefixes Ready
              </div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  fontSize: "24px",
                  fontWeight: "bold",
                  color: "#007cff",
                }}
              >
                Auto
              </div>
              <div
                style={{ fontSize: "14px", color: "#666", marginTop: "5px" }}
              >
                SKU Generation
              </div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  fontSize: "24px",
                  fontWeight: "bold",
                  color: "#007cff",
                }}
              >
                Ready
              </div>
              <div
                style={{ fontSize: "14px", color: "#666", marginTop: "5px" }}
              >
                Equipment Creation
              </div>
            </div>
          </div>
        </div>

        {/* Help Section */}
        <div
          style={{
            background: "#f8f9fa",
            border: "1px solid #e9ecef",
            borderRadius: "8px",
            padding: "20px",
            marginTop: "20px",
          }}
        >
          <h4 style={{ margin: "0 0 10px 0", color: "#333" }}>💡 Quick Tips</h4>
          <ul style={{ margin: 0, paddingLeft: "20px", color: "#666" }}>
            <li style={{ marginBottom: "8px" }}>
              <strong>SKU Generation:</strong> SKUs are automatically created
              using the format EPG-[CATEGORY]-[BRAND]-[NUMBER]
            </li>
            <li style={{ marginBottom: "8px" }}>
              <strong>Brand Prefixes:</strong> 25+ major brands are
              pre-configured (Chauvet→CH, Shure→SH, QSC→QS, etc.)
            </li>
            <li style={{ marginBottom: "8px" }}>
              <strong>Categories:</strong> Lighting(LT), Audio(AU), Power(PW),
              Staging(ST), Effects(EF)
            </li>
            <li>
              <strong>Quick Access:</strong> Use the Equipment List to view all
              items, or Create Equipment for new additions
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default memo(HomePage);
