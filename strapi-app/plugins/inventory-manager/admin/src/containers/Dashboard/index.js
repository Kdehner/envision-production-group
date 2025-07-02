import React, { memo, useState, useEffect } from "react";
import { PluginHeader, Block, Container, Row, Col } from "strapi-helper-plugin";
import styled from "styled-components";

const StyledContainer = styled(Container)`
  padding: 18px 30px;
`;

const StatCard = styled.div`
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;

  h3 {
    margin: 0 0 10px 0;
    color: #333;
    font-size: 24px;
  }

  p {
    margin: 0;
    color: #666;
    font-size: 14px;
  }

  .stat-number {
    font-size: 36px;
    font-weight: bold;
    color: #007cff;
  }

  &.danger .stat-number {
    color: #dc3545;
  }

  &.warning .stat-number {
    color: #ffc107;
  }

  &.success .stat-number {
    color: #28a745;
  }
`;

const RecentActivity = styled.div`
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  .activity-item {
    padding: 10px 0;
    border-bottom: 1px solid #eee;

    &:last-child {
      border-bottom: none;
    }

    .time {
      color: #666;
      font-size: 12px;
    }

    .action {
      font-weight: 500;
      margin: 5px 0;
    }

    .details {
      color: #666;
      font-size: 14px;
    }
  }
`;

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

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch equipment statistics
      const equipment = await strapi.plugins[
        "content-manager"
      ].services.contentmanager.find({
        model: "equipment-item",
      });

      const equipmentList = equipment.results || equipment;

      const newStats = {
        totalEquipment: equipmentList.length,
        availableEquipment: equipmentList.filter(
          (item) => item.status === "Available"
        ).length,
        rentedEquipment: equipmentList.filter(
          (item) => item.status === "Rented"
        ).length,
        maintenanceEquipment: equipmentList.filter(
          (item) => item.status === "Maintenance"
        ).length,
        damagedEquipment: equipmentList.filter(
          (item) => item.status === "Damaged"
        ).length,
      };

      setStats(newStats);

      // Mock recent activity (in real implementation, this would come from transaction logs)
      setRecentActivity([
        {
          id: 1,
          time: "2 hours ago",
          action: "Equipment Checked Out",
          details: "LED Par Light #EPG-001 checked out for Event #2025-001",
          type: "checkout",
        },
        {
          id: 2,
          time: "4 hours ago",
          action: "Maintenance Completed",
          details:
            "Sound Mixer #EPG-089 maintenance completed, returned to available",
          type: "maintenance",
        },
        {
          id: 3,
          time: "6 hours ago",
          action: "Equipment Returned",
          details: "Fog Machine #EPG-045 returned from Event #2025-002",
          type: "return",
        },
        {
          id: 4,
          time: "8 hours ago",
          action: "New Equipment Added",
          details: "Moving Head Light #EPG-156 added to inventory",
          type: "add",
        },
        {
          id: 5,
          time: "1 day ago",
          action: "Damage Report",
          details: "Cable #EPG-203 marked as damaged, sent for repair",
          type: "damage",
        },
      ]);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading dashboard...</div>;
  }

  return (
    <StyledContainer>
      <PluginHeader
        title="Inventory Dashboard"
        description="Overview of equipment status and recent activity"
      />

      <Row>
        <Col size={6}>
          <StatCard>
            <h3>Total Equipment</h3>
            <div className="stat-number">{stats.totalEquipment}</div>
            <p>Items in inventory</p>
          </StatCard>
        </Col>
        <Col size={6}>
          <StatCard className="success">
            <h3>Available</h3>
            <div className="stat-number">{stats.availableEquipment}</div>
            <p>Ready to rent</p>
          </StatCard>
        </Col>
      </Row>

      <Row>
        <Col size={6}>
          <StatCard className="warning">
            <h3>Currently Rented</h3>
            <div className="stat-number">{stats.rentedEquipment}</div>
            <p>Out with customers</p>
          </StatCard>
        </Col>
        <Col size={6}>
          <StatCard className="danger">
            <h3>Needs Attention</h3>
            <div className="stat-number">
              {stats.maintenanceEquipment + stats.damagedEquipment}
            </div>
            <p>Maintenance + Damaged</p>
          </StatCard>
        </Col>
      </Row>

      <Row>
        <Col>
          <Block>
            <h2>Recent Activity</h2>
            <RecentActivity>
              {recentActivity.map((activity) => (
                <div key={activity.id} className="activity-item">
                  <div className="time">{activity.time}</div>
                  <div className="action">{activity.action}</div>
                  <div className="details">{activity.details}</div>
                </div>
              ))}
            </RecentActivity>
          </Block>
        </Col>
      </Row>
    </StyledContainer>
  );
};

export default memo(Dashboard);
