import React, { memo, useState, useRef, useEffect } from "react";
import { PluginHeader, Block, Container, Row, Col } from "strapi-helper-plugin";
import { Button } from "@buffetjs/core";
import styled from "styled-components";

const StyledContainer = styled(Container)`
  padding: 18px 30px;
`;

const ScanArea = styled.div`
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  text-align: center;

  .scan-input {
    width: 100%;
    padding: 15px;
    font-size: 18px;
    border: 2px solid #ddd;
    border-radius: 8px;
    margin-bottom: 15px;

    &:focus {
      outline: none;
      border-color: #007cff;
    }
  }

  .scan-instructions {
    color: #666;
    margin-bottom: 20px;
  }
`;

const EquipmentCard = styled.div`
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;

  .equipment-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;

    h3 {
      margin: 0;
      color: #333;
    }

    .status-badge {
      padding: 5px 10px;
      border-radius: 15px;
      font-size: 12px;
      font-weight: bold;

      &.available {
        background: #d4edda;
        color: #155724;
      }

      &.rented {
        background: #fff3cd;
        color: #856404;
      }

      &.maintenance {
        background: #f8d7da;
        color: #721c24;
      }
    }
  }

  .equipment-details {
    margin-bottom: 20px;

    .detail-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 5px;

      .label {
        font-weight: 500;
        color: #666;
      }

      .value {
        color: #333;
      }
    }
  }

  .action-buttons {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
  }
`;

const QuickScan = () => {
  const [scannedCode, setScannedCode] = useState("");
  const [equipment, setEquipment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    // Auto-focus the input for barcode scanners
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleScan = async (code) => {
    if (!code.trim()) return;

    setLoading(true);
    setMessage("");

    try {
      // Try to parse as QR code JSON first
      let searchTerm = code;
      try {
        const parsed = JSON.parse(code);
        if (parsed.type === "equipment" && parsed.sku) {
          searchTerm = parsed.sku;
        }
      } catch {
        // Not JSON, use as-is (probably direct SKU scan)
      }

      // Search for equipment by SKU
      const results = await strapi.plugins[
        "content-manager"
      ].services.contentmanager.find({
        model: "equipment-item",
        params: { sku: searchTerm },
      });

      const equipmentList = results.results || results;

      if (equipmentList.length > 0) {
        setEquipment(equipmentList[0]);
        setMessage(`Found: ${equipmentList[0].name}`);
      } else {
        setEquipment(null);
        setMessage("Equipment not found. Please check the barcode/QR code.");
      }
    } catch (error) {
      console.error("Error searching equipment:", error);
      setMessage("Error searching for equipment.");
      setEquipment(null);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setScannedCode(value);

    // Auto-search when Enter is pressed or barcode scanner completes
    if (e.key === "Enter" || value.length > 10) {
      handleScan(value);
    }
  };

  const updateEquipmentStatus = async (newStatus) => {
    if (!equipment) return;

    try {
      await strapi.plugins["content-manager"].services.contentmanager.edit({
        model: "equipment-item",
        id: equipment.id,
        data: { status: newStatus },
      });

      setEquipment({ ...equipment, status: newStatus });
      setMessage(`Status updated to: ${newStatus}`);
    } catch (error) {
      console.error("Error updating status:", error);
      setMessage("Error updating equipment status.");
    }
  };

  const clearScan = () => {
    setScannedCode("");
    setEquipment(null);
    setMessage("");
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <StyledContainer>
      <PluginHeader
        title="Quick Scan"
        description="Scan equipment barcodes/QR codes for quick status updates"
      />

      <Row>
        <Col>
          <ScanArea>
            <div className="scan-instructions">
              Scan a barcode/QR code or manually enter equipment SKU
            </div>
            <input
              ref={inputRef}
              type="text"
              className="scan-input"
              placeholder="Scan barcode or enter SKU..."
              value={scannedCode}
              onChange={(e) => setScannedCode(e.target.value)}
              onKeyPress={handleInputChange}
            />
            <div
              style={{ display: "flex", gap: "10px", justifyContent: "center" }}
            >
              <Button
                color="primary"
                onClick={() => handleScan(scannedCode)}
                disabled={loading || !scannedCode.trim()}
              >
                {loading ? "Searching..." : "Search"}
              </Button>
              <Button color="secondary" onClick={clearScan}>
                Clear
              </Button>
            </div>
            {message && (
              <div
                style={{
                  marginTop: "15px",
                  padding: "10px",
                  backgroundColor: equipment ? "#d4edda" : "#f8d7da",
                  color: equipment ? "#155724" : "#721c24",
                  borderRadius: "4px",
                }}
              >
                {message}
              </div>
            )}
          </ScanArea>
        </Col>
      </Row>

      {equipment && (
        <Row>
          <Col>
            <EquipmentCard>
              <div className="equipment-header">
                <h3>{equipment.name}</h3>
                <span
                  className={`status-badge ${
                    equipment.status?.toLowerCase() || "available"
                  }`}
                >
                  {equipment.status || "Available"}
                </span>
              </div>

              <div className="equipment-details">
                <div className="detail-row">
                  <span className="label">SKU:</span>
                  <span className="value">{equipment.sku}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Brand/Model:</span>
                  <span className="value">
                    {equipment.brand} {equipment.model}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="label">Category:</span>
                  <span className="value">
                    {equipment.equipment_category?.name || "Uncategorized"}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="label">Location:</span>
                  <span className="value">
                    {equipment.location || "Warehouse"}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="label">Available Quantity:</span>
                  <span className="value">
                    {equipment.availableQuantity || equipment.quantity || 0}
                  </span>
                </div>
              </div>

              <div className="action-buttons">
                <Button
                  color="success"
                  onClick={() => updateEquipmentStatus("Available")}
                  disabled={equipment.status === "Available"}
                >
                  Mark Available
                </Button>
                <Button
                  color="warning"
                  onClick={() => updateEquipmentStatus("Rented")}
                  disabled={equipment.status === "Rented"}
                >
                  Check Out
                </Button>
                <Button
                  color="secondary"
                  onClick={() => updateEquipmentStatus("Maintenance")}
                  disabled={equipment.status === "Maintenance"}
                >
                  Send to Maintenance
                </Button>
                <Button
                  color="danger"
                  onClick={() => updateEquipmentStatus("Damaged")}
                  disabled={equipment.status === "Damaged"}
                >
                  Mark Damaged
                </Button>
                <Button
                  color="primary"
                  onClick={() =>
                    window.open(
                      `/admin/plugins/content-manager/collectionType/application::equipment-item.equipment-item/${equipment.id}`,
                      "_blank"
                    )
                  }
                >
                  Full Edit
                </Button>
              </div>
            </EquipmentCard>
          </Col>
        </Row>
      )}
    </StyledContainer>
  );
};

export default memo(QuickScan);
