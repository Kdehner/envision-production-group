// admin/src/containers/Dashboard/index.js - Fixed for React error #130
import React, { memo, useState, useEffect } from "react";
import { PluginHeader } from "strapi-helper-plugin";

// Safe inline styles without React component dependencies
const styles = {
  container: {
    padding: "18px 30px",
  },
  statCard: {
    background: "white",
    borderRadius: "8px",
    padding: "20px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    marginBottom: "20px",
  },
  statCardH3: {
    margin: "0 0 10px 0",
    color: "#333",
    fontSize: "24px",
  },
  statCardP: {
    margin: "0",
    color: "#666",
    fontSize: "14px",
  },
  statNumber: {
    fontSize: "36px",
    fontWeight: "bold",
    color: "#007cff",
  },
  statNumberDanger: {
    fontSize: "36px",
    fontWeight: "bold",
    color: "#dc3545",
  },
  statNumberWarning: {
    fontSize: "36px",
    fontWeight: "bold",
    color: "#ffc107",
  },
  statNumberSuccess: {
    fontSize: "36px",
    fontWeight: "bold",
    color: "#28a745",
  },
  recentActivity: {
    background: "white",
    borderRadius: "8px",
    padding: "20px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    marginTop: "20px",
  },
  activityItem: {
    padding: "10px 0",
    borderBottom: "1px solid #eee",
  },
  activityItemLast: {
    padding: "10px 0",
    borderBottom: "none",
  },
  activityTime: {
    color: "#666",
    fontSize: "12px",
  },
  activityAction: {
    fontWeight: "500",
    margin: "5px 0",
  },
  activityDetails: {
    color: "#666",
    fontSize: "14px",
  },
  errorMessage: {
    background: "#f8d7da",
    color: "#721c24",
    padding: "15px",
    borderRadius: "5px",
    margin: "20px 0",
  },
  successMessage: {
    background: "#d4edda",
    color: "#155724",
    padding: "15px",
    borderRadius: "5px",
    margin: "20px 0",
  },
  gridContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "20px",
    margin: "20px 0",
  },
};

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalEquipment: 0,
    availableEquipment: 0,
    rentedEquipment: 0,
    maintenanceEquipment: 0,
    damagedEquipment: 0,
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Simulate API call with timeout
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock data for now - replace with actual API calls later
      const mockStats = {
        totalEquipment: 150,
        availableEquipment: 120,
        rentedEquipment: 25,
        maintenanceEquipment: 3,
        damagedEquipment: 2,
      };

      const mockActivity = [
        {
          id: 1,
          time: "2 hours ago",
          action: "Equipment checked out",
          details: "LED Par Light #LP001 rented for Corporate Event",
        },
        {
          id: 2,
          time: "4 hours ago",
          action: "Equipment returned",
          details: "Audio Mixer #AM005 returned from Wedding Event",
        },
        {
          id: 3,
          time: "1 day ago",
          action: "Maintenance completed",
          details: "Moving Head Light #MH012 maintenance completed",
        },
        {
          id: 4,
          time: "2 days ago",
          action: "New equipment added",
          details: "Wireless Microphone #WM020 added to inventory",
        },
      ];

      setStats(mockStats);
      setRecentActivity(mockActivity);
      setSuccess(true);
    } catch (error) {
      console.error("❌ Error fetching dashboard data:", error);
      setError("Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  const getStatNumberStyle = (type) => {
    switch (type) {
      case "danger":
        return styles.statNumberDanger;
      case "warning":
        return styles.statNumberWarning;
      case "success":
        return styles.statNumberSuccess;
      default:
        return styles.statNumber;
    }
  };

  const refreshData = () => {
    fetchDashboardData();
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <PluginHeader
          title="Inventory Dashboard"
          description="Equipment statistics and recent activity"
        />
        <div style={{ padding: "20px", textAlign: "center" }}>
          <div style={{ fontSize: "18px", color: "#666" }}>
            Loading dashboard data...
          </div>
          <div
            style={{
              marginTop: "10px",
              width: "50px",
              height: "50px",
              border: "3px solid #f3f3f3",
              borderTop: "3px solid #007cff",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
              margin: "20px auto",
            }}
          ></div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <PluginHeader
        title="Inventory Dashboard"
        description="Equipment statistics and recent activity"
      />

      {error && (
        <div style={styles.errorMessage}>
          <strong>Error:</strong> {error}
          <button
            onClick={refreshData}
            style={{
              marginLeft: "10px",
              padding: "5px 10px",
              background: "#dc3545",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Retry
          </button>
        </div>
      )}

      {success && !error && (
        <div style={styles.successMessage}>
          <strong>Success:</strong> Dashboard data loaded successfully!
          <button
            onClick={refreshData}
            style={{
              marginLeft: "10px",
              padding: "5px 10px",
              background: "#28a745",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Refresh
          </button>
        </div>
      )}

      {/* Statistics Grid */}
      <div style={styles.gridContainer}>
        <div style={styles.statCard}>
          <h3 style={styles.statCardH3}>Total Equipment</h3>
          <div style={getStatNumberStyle()}>{stats.totalEquipment}</div>
          <p style={styles.statCardP}>Items in inventory</p>
        </div>

        <div style={styles.statCard}>
          <h3 style={styles.statCardH3}>Available</h3>
          <div style={getStatNumberStyle("success")}>
            {stats.availableEquipment}
          </div>
          <p style={styles.statCardP}>Ready for rental</p>
        </div>

        <div style={styles.statCard}>
          <h3 style={styles.statCardH3}>Rented</h3>
          <div style={getStatNumberStyle("warning")}>
            {stats.rentedEquipment}
          </div>
          <p style={styles.statCardP}>Currently out</p>
        </div>

        <div style={styles.statCard}>
          <h3 style={styles.statCardH3}>Needs Attention</h3>
          <div style={getStatNumberStyle("danger")}>
            {stats.maintenanceEquipment + stats.damagedEquipment}
          </div>
          <p style={styles.statCardP}>Maintenance + Damaged</p>
        </div>
      </div>

      {/* Recent Activity */}
      <div style={styles.recentActivity}>
        <h3 style={{ margin: "0 0 20px 0", color: "#333" }}>Recent Activity</h3>
        {recentActivity.length > 0 ? (
          recentActivity.map((activity, index) => (
            <div
              key={activity.id}
              style={
                index === recentActivity.length - 1
                  ? styles.activityItemLast
                  : styles.activityItem
              }
            >
              <div style={styles.activityTime}>{activity.time}</div>
              <div style={styles.activityAction}>{activity.action}</div>
              <div style={styles.activityDetails}>{activity.details}</div>
            </div>
          ))
        ) : (
          <p style={styles.statCardP}>No recent activity</p>
        )}
      </div>

      {/* Backend Status */}
      <div style={styles.recentActivity}>
        <h3 style={{ margin: "0 0 20px 0", color: "#333" }}>
          Backend API Status
        </h3>
        <div style={{ fontFamily: "monospace", fontSize: "14px" }}>
          <div style={{ color: "#28a745", marginBottom: "5px" }}>
            ✅ Plugin: Active and loaded
          </div>
          <div style={{ color: "#28a745", marginBottom: "5px" }}>
            ✅ Routes: /inventory-manager/* endpoints configured
          </div>
          <div style={{ color: "#ffc107", marginBottom: "5px" }}>
            ⚠️ Data: Using mock data (API integration pending)
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default memo(Dashboard);
