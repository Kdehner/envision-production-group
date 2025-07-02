import React, { memo, useState, useEffect } from "react";
import {
  HeaderNav,
  LoadingIndicator,
  PluginHeader,
  Block,
  Container,
  Row,
  Col,
} from "strapi-helper-plugin";
import { Button, Table } from "@buffetjs/core";
import styled from "styled-components";

const StyledContainer = styled(Container)`
  padding: 18px 30px;
`;

const StatusBadge = styled.span`
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;

  &.available {
    background-color: #d4edda;
    color: #155724;
  }

  &.rented {
    background-color: #fff3cd;
    color: #856404;
  }

  &.maintenance {
    background-color: #f8d7da;
    color: #721c24;
  }

  &.damaged {
    background-color: #f5c6cb;
    color: #721c24;
  }
`;

const HomePage = () => {
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: "all",
    category: "all",
    search: "",
  });

  useEffect(() => {
    fetchEquipment();
  }, [filters]);

  const fetchEquipment = async () => {
    try {
      setLoading(true);
      let url = "/equipment-items";
      const params = new URLSearchParams();

      if (filters.status !== "all") {
        params.append("status", filters.status);
      }
      if (filters.category !== "all") {
        params.append("equipment_category.slug", filters.category);
      }
      if (filters.search) {
        params.append("_q", filters.search);
      }

      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const response = await strapi.plugins[
        "content-manager"
      ].services.contentmanager.find({
        model: "equipment-item",
        params: Object.fromEntries(params),
      });

      setEquipment(response.results || response);
    } catch (error) {
      console.error("Error fetching equipment:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (equipmentId, newStatus) => {
    try {
      await strapi.plugins["content-manager"].services.contentmanager.edit({
        model: "equipment-item",
        id: equipmentId,
        data: { status: newStatus },
      });

      // Refresh the list
      fetchEquipment();
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const generateQRCode = (equipmentId, sku) => {
    // Generate QR code URL for equipment
    const qrData = JSON.stringify({
      type: "equipment",
      id: equipmentId,
      sku: sku,
    });
    return `https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(
      qrData
    )}`;
  };

  const headers = [
    { name: "QR Code", value: "qr" },
    { name: "Name", value: "name" },
    { name: "SKU", value: "sku" },
    { name: "Brand/Model", value: "brand" },
    { name: "Category", value: "category" },
    { name: "Status", value: "status" },
    { name: "Quantity", value: "quantity" },
    { name: "Available", value: "available" },
    { name: "Location", value: "location" },
    { name: "Actions", value: "actions" },
  ];

  const rows = equipment.map((item) => ({
    qr: (
      <img
        src={generateQRCode(item.id, item.sku)}
        alt={`QR Code for ${item.name}`}
        style={{ width: "50px", height: "50px" }}
      />
    ),
    name: item.name,
    sku: item.sku,
    brand: `${item.brand || ""} ${item.model || ""}`.trim(),
    category: item.equipment_category?.name || "Uncategorized",
    status: (
      <StatusBadge className={item.status?.toLowerCase() || "available"}>
        {item.status || "Available"}
      </StatusBadge>
    ),
    quantity: item.quantity || 0,
    available: item.availableQuantity || item.quantity || 0,
    location: item.location || "Warehouse",
    actions: (
      <div style={{ display: "flex", gap: "8px" }}>
        <Button
          color="secondary"
          size="small"
          onClick={() => handleStatusChange(item.id, "Maintenance")}
        >
          Maintenance
        </Button>
        <Button
          color="primary"
          size="small"
          onClick={() =>
            window.open(
              `/admin/plugins/content-manager/collectionType/application::equipment-item.equipment-item/${item.id}`,
              "_blank"
            )
          }
        >
          Edit
        </Button>
      </div>
    ),
  }));

  return (
    <StyledContainer>
      <PluginHeader
        title="Inventory Manager"
        description="Manage equipment inventory, track status, and generate reports"
      />

      <HeaderNav
        links={[
          {
            name: "Overview",
            to: "/plugins/inventory-manager",
          },
          {
            name: "Dashboard",
            to: "/plugins/inventory-manager/dashboard",
          },
          {
            name: "Quick Scan",
            to: "/plugins/inventory-manager/quick-scan",
          },
        ]}
        style={{ marginTop: "4.4rem" }}
      />

      <Block>
        <Row>
          <Col>
            <h2>Equipment Inventory</h2>

            {/* Filters */}
            <div
              style={{
                marginBottom: "20px",
                display: "flex",
                gap: "15px",
                alignItems: "center",
              }}
            >
              <input
                type="text"
                placeholder="Search equipment..."
                value={filters.search}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, search: e.target.value }))
                }
                style={{
                  padding: "8px",
                  borderRadius: "4px",
                  border: "1px solid #ddd",
                }}
              />

              <select
                value={filters.status}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, status: e.target.value }))
                }
                style={{
                  padding: "8px",
                  borderRadius: "4px",
                  border: "1px solid #ddd",
                }}
              >
                <option value="all">All Status</option>
                <option value="Available">Available</option>
                <option value="Rented">Rented</option>
                <option value="Maintenance">Maintenance</option>
                <option value="Damaged">Damaged</option>
              </select>

              <Button color="primary" onClick={fetchEquipment}>
                Refresh
              </Button>
            </div>

            {loading ? (
              <LoadingIndicator />
            ) : (
              <Table headers={headers} rows={rows} />
            )}
          </Col>
        </Row>
      </Block>
    </StyledContainer>
  );
};

export default memo(HomePage);
