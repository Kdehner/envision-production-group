// admin/src/containers/QuickScan/index.js - Safe fix for React errors
import React, { memo, useState, useRef, useEffect } from "react";
import { PluginHeader } from "strapi-helper-plugin";

// Safe inline styles
const styles = {
  container: {
    padding: "18px 30px",
  },
  scanArea: {
    background: "white",
    borderRadius: "8px",
    padding: "20px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    marginBottom: "20px",
    textAlign: "center",
  },
  scanInput: {
    width: "100%",
    maxWidth: "400px",
    padding: "15px",
    fontSize: "18px",
    border: "2px solid #ddd",
    borderRadius: "8px",
    marginBottom: "15px",
    boxSizing: "border-box",
  },
  scanInstructions: {
    color: "#666",
    marginBottom: "20px",
    fontSize: "14px",
  },
  buttonContainer: {
    display: "flex",
    gap: "10px",
    justifyContent: "center",
    flexWrap: "wrap",
  },
  button: {
    padding: "10px 20px",
    border: "none",
    borderRadius: "4px",
    background: "#007cff",
    color: "white",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "500",
  },
  buttonSecondary: {
    padding: "10px 20px",
    border: "1px solid #6c757d",
    borderRadius: "4px",
    background: "transparent",
    color: "#6c757d",
    cursor: "pointer",
    fontSize: "14px",
  },
  buttonDisabled: {
    padding: "10px 20px",
    border: "none",
    borderRadius: "4px",
    background: "#ccc",
    color: "#666",
    cursor: "not-allowed",
    fontSize: "14px",
  },
  equipmentCard: {
    background: "white",
    borderRadius: "8px",
    padding: "20px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    marginBottom: "20px",
  },
  equipmentHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "15px",
    flexWrap: "wrap",
    gap: "10px",
  },
  equipmentTitle: {
    margin: "0",
    color: "#333",
    fontSize: "20px",
  },
  statusBadge: {
    padding: "5px 12px",
    borderRadius: "15px",
    fontSize: "12px",
    fontWeight: "bold",
    textTransform: "capitalize",
  },
  statusAvailable: {
    background: "#d4edda",
    color: "#155724",
  },
  statusRented: {
    background: "#fff3cd",
    color: "#856404",
  },
  statusMaintenance: {
    background: "#f8d7da",
    color: "#721c24",
  },
  equipmentDetails: {
    marginBottom: "20px",
  },
  detailRow: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "8px",
    flexWrap: "wrap",
  },
  detailLabel: {
    fontWeight: "500",
    color: "#666",
    minWidth: "100px",
  },
  detailValue: {
    color: "#333",
    flex: "1",
    textAlign: "right",
  },
  messageSuccess: {
    background: "#d4edda",
    color: "#155724",
    padding: "10px 15px",
    borderRadius: "4px",
    marginBottom: "20px",
  },
  messageError: {
    background: "#f8d7da",
    color: "#721c24",
    padding: "10px 15px",
    borderRadius: "4px",
    marginBottom: "20px",
  },
  messageInfo: {
    background: "#d1ecf1",
    color: "#0c5460",
    padding: "10px 15px",
    borderRadius: "4px",
    marginBottom: "20px",
  },
};

const QuickScan = () => {
  const [scannedCode, setScannedCode] = useState("");
  const [equipment, setEquipment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    // Focus input on component mount
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleScan = async (code) => {
    if (!code || !code.trim()) {
      setMessage("Please enter a valid SKU or barcode");
      setMessageType("error");
      return;
    }

    setLoading(true);
    setMessage("");
    setEquipment(null);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Mock equipment data based on the scanned code
      const mockEquipment = {
        id: Math.floor(Math.random() * 1000),
        name: getEquipmentNameFromSKU(code),
        sku: code.toUpperCase(),
        status: getRandomStatus(),
        category: "Lighting",
        manufacturer: "Chauvet",
        model: "SlimPAR 64",
        location: "Warehouse A-12",
        description: "High-output LED wash light with 7 quad-color LEDs",
        lastUpdated: new Date().toLocaleDateString(),
      };

      setEquipment(mockEquipment);
      setMessage(`Equipment found: ${mockEquipment.name}`);
      setMessageType("success");
    } catch (error) {
      console.error("Error scanning equipment:", error);
      setMessage(`Equipment not found for code: ${code}`);
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  const getEquipmentNameFromSKU = (sku) => {
    const skuUpper = sku.toUpperCase();
    if (skuUpper.includes("LED") || skuUpper.includes("LP")) {
      return "LED Par Light 64";
    } else if (skuUpper.includes("MIC") || skuUpper.includes("WM")) {
      return "Wireless Microphone";
    } else if (skuUpper.includes("MIX") || skuUpper.includes("AM")) {
      return "Audio Mixer";
    } else if (skuUpper.includes("MH")) {
      return "Moving Head Light";
    } else {
      return "Professional Equipment";
    }
  };

  const getRandomStatus = () => {
    const statuses = ["available", "rented", "maintenance"];
    return statuses[Math.floor(Math.random() * statuses.length)];
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setScannedCode(value);

    // Clear previous messages when typing
    if (message) {
      setMessage("");
      setMessageType("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleScan(scannedCode);
    }
  };

  const getStatusStyle = (status) => {
    const baseStyle = styles.statusBadge;
    switch (status) {
      case "available":
        return { ...baseStyle, ...styles.statusAvailable };
      case "rented":
        return { ...baseStyle, ...styles.statusRented };
      case "maintenance":
        return { ...baseStyle, ...styles.statusMaintenance };
      default:
        return baseStyle;
    }
  };

  const handleStatusChange = async (newStatus) => {
    if (!equipment) return;

    try {
      setMessage(`Updating status to: ${newStatus}...`);
      setMessageType("info");

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      setEquipment({ ...equipment, status: newStatus });
      setMessage(`Status successfully changed to: ${newStatus}`);
      setMessageType("success");
    } catch (error) {
      console.error("Error updating status:", error);
      setMessage("Failed to update equipment status");
      setMessageType("error");
    }
  };

  const clearScan = () => {
    setScannedCode("");
    setEquipment(null);
    setMessage("");
    setMessageType("");
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const getMessageStyle = () => {
    switch (messageType) {
      case "success":
        return styles.messageSuccess;
      case "error":
        return styles.messageError;
      case "info":
        return styles.messageInfo;
      default:
        return {};
    }
  };

  return (
    <div style={styles.container}>
      <PluginHeader
        title="Quick Scan"
        description="Scan equipment barcodes or enter SKU manually"
      />

      <div style={styles.scanArea}>
        <input
          ref={inputRef}
          type="text"
          placeholder="Scan barcode or enter SKU (e.g., LED001, MIC005)..."
          value={scannedCode}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          style={styles.scanInput}
          disabled={loading}
        />
        <div style={styles.scanInstructions}>
          Scan a barcode with your device camera or manually enter the equipment
          SKU
        </div>
        <div style={styles.buttonContainer}>
          <button
            onClick={() => handleScan(scannedCode)}
            disabled={!scannedCode.trim() || loading}
            style={
              !scannedCode.trim() || loading
                ? styles.buttonDisabled
                : styles.button
            }
          >
            {loading ? "Scanning..." : "Search"}
          </button>
          <button onClick={clearScan} style={styles.buttonSecondary}>
            Clear
          </button>
        </div>
      </div>

      {message && (
        <div style={getMessageStyle()}>
          <strong>
            {messageType === "success" && "✅ Success: "}
            {messageType === "error" && "❌ Error: "}
            {messageType === "info" && "ℹ️ Info: "}
          </strong>
          {message}
        </div>
      )}

      {equipment && (
        <div style={styles.equipmentCard}>
          <div style={styles.equipmentHeader}>
            <h3 style={styles.equipmentTitle}>{equipment.name}</h3>
            <span style={getStatusStyle(equipment.status)}>
              {equipment.status}
            </span>
          </div>

          <div style={styles.equipmentDetails}>
            <div style={styles.detailRow}>
              <span style={styles.detailLabel}>SKU:</span>
              <span style={styles.detailValue}>{equipment.sku}</span>
            </div>
            <div style={styles.detailRow}>
              <span style={styles.detailLabel}>Category:</span>
              <span style={styles.detailValue}>{equipment.category}</span>
            </div>
            <div style={styles.detailRow}>
              <span style={styles.detailLabel}>Manufacturer:</span>
              <span style={styles.detailValue}>{equipment.manufacturer}</span>
            </div>
            <div style={styles.detailRow}>
              <span style={styles.detailLabel}>Model:</span>
              <span style={styles.detailValue}>{equipment.model}</span>
            </div>
            <div style={styles.detailRow}>
              <span style={styles.detailLabel}>Location:</span>
              <span style={styles.detailValue}>{equipment.location}</span>
            </div>
            <div style={styles.detailRow}>
              <span style={styles.detailLabel}>Last Updated:</span>
              <span style={styles.detailValue}>{equipment.lastUpdated}</span>
            </div>
            {equipment.description && (
              <div style={{ marginTop: "15px" }}>
                <div style={styles.detailLabel}>Description:</div>
                <p style={{ margin: "5px 0", color: "#666", fontSize: "14px" }}>
                  {equipment.description}
                </p>
              </div>
            )}
          </div>

          <div style={styles.buttonContainer}>
            {equipment.status === "available" && (
              <button
                onClick={() => handleStatusChange("rented")}
                style={styles.button}
              >
                Check Out
              </button>
            )}
            {equipment.status === "rented" && (
              <button
                onClick={() => handleStatusChange("available")}
                style={styles.button}
              >
                Check In
              </button>
            )}
            <button
              onClick={() => handleStatusChange("maintenance")}
              style={styles.buttonSecondary}
            >
              Mark for Maintenance
            </button>
          </div>
        </div>
      )}

      {/* Quick Examples */}
      <div style={styles.equipmentCard}>
        <h3 style={{ margin: "0 0 15px 0", color: "#333" }}>
          Try These Sample SKUs:
        </h3>
        <div style={styles.buttonContainer}>
          <button
            onClick={() => {
              setScannedCode("LED001");
              handleScan("LED001");
            }}
            style={styles.buttonSecondary}
          >
            LED001
          </button>
          <button
            onClick={() => {
              setScannedCode("MIC005");
              handleScan("MIC005");
            }}
            style={styles.buttonSecondary}
          >
            MIC005
          </button>
          <button
            onClick={() => {
              setScannedCode("AM010");
              handleScan("AM010");
            }}
            style={styles.buttonSecondary}
          >
            AM010
          </button>
        </div>
      </div>
    </div>
  );
};

export default memo(QuickScan);
