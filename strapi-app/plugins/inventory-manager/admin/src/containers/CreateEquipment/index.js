// admin/src/containers/CreateEquipment/index.js - Fixed for data loading issues
import React, { memo, useState, useEffect } from "react";
import { PluginHeader } from "strapi-helper-plugin";
import { useHistory } from "react-router-dom";
import pluginId from "../../pluginId";

const styles = {
  container: {
    padding: "18px 30px",
  },
  form: {
    background: "white",
    borderRadius: "8px",
    padding: "24px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    marginBottom: "20px",
  },
  formGrid: {
    display: "grid",
    gap: "20px",
  },
  formRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "20px",
  },
  formGroup: {
    marginBottom: "20px",
  },
  label: {
    display: "block",
    marginBottom: "8px",
    fontWeight: "500",
    color: "#333",
    fontSize: "14px",
  },
  input: {
    width: "100%",
    padding: "12px",
    border: "1px solid #ddd",
    borderRadius: "4px",
    fontSize: "14px",
    boxSizing: "border-box",
    transition: "border-color 0.3s ease",
  },
  textarea: {
    width: "100%",
    padding: "12px",
    border: "1px solid #ddd",
    borderRadius: "4px",
    fontSize: "14px",
    minHeight: "100px",
    resize: "vertical",
    boxSizing: "border-box",
  },
  select: {
    width: "100%",
    padding: "12px",
    border: "1px solid #ddd",
    borderRadius: "4px",
    fontSize: "14px",
    background: "white",
    boxSizing: "border-box",
  },
  skuPreview: {
    background: "#f8f9fa",
    border: "2px solid #e9ecef",
    borderRadius: "8px",
    padding: "16px",
    marginBottom: "20px",
  },
  skuPreviewGenerated: {
    background: "#e8f5e8",
    border: "2px solid #28a745",
  },
  skuText: {
    fontSize: "18px",
    fontWeight: "bold",
    color: "#333",
    marginBottom: "8px",
    fontFamily: "monospace",
  },
  skuGenerated: {
    color: "#28a745",
  },
  skuHint: {
    fontSize: "12px",
    color: "#666",
    fontStyle: "italic",
  },
  buttonContainer: {
    display: "flex",
    gap: "12px",
    justifyContent: "flex-end",
    paddingTop: "20px",
    borderTop: "1px solid #eee",
    marginTop: "20px",
  },
  button: {
    padding: "12px 24px",
    border: "none",
    borderRadius: "4px",
    fontSize: "14px",
    fontWeight: "500",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
  buttonPrimary: {
    background: "#007cff",
    color: "white",
  },
  buttonSecondary: {
    background: "#6c757d",
    color: "white",
  },
  buttonDisabled: {
    background: "#ccc",
    color: "#666",
    cursor: "not-allowed",
  },
  errorMessage: {
    background: "#f8d7da",
    color: "#721c24",
    padding: "12px",
    borderRadius: "4px",
    marginBottom: "20px",
    fontSize: "14px",
  },
  successMessage: {
    background: "#d4edda",
    color: "#155724",
    padding: "12px",
    borderRadius: "4px",
    marginBottom: "20px",
    fontSize: "14px",
  },
  validationError: {
    color: "#dc3545",
    fontSize: "12px",
    marginTop: "4px",
  },
  inputError: {
    borderColor: "#dc3545",
  },
  helpText: {
    fontSize: "12px",
    color: "#666",
    marginTop: "4px",
  },
  loadingMessage: {
    background: "#d1ecf1",
    color: "#0c5460",
    padding: "12px",
    borderRadius: "4px",
    marginBottom: "20px",
    fontSize: "14px",
  },
  specRow: {
    display: "flex",
    gap: "12px",
    marginBottom: "8px",
    alignItems: "center",
  },
  specInput: {
    flex: "1",
    padding: "8px",
    border: "1px solid #ddd",
    borderRadius: "4px",
    fontSize: "14px",
  },
  removeSpecButton: {
    background: "#dc3545",
    color: "white",
    border: "none",
    borderRadius: "4px",
    padding: "8px 12px",
    fontSize: "12px",
    cursor: "pointer",
  },
  addSpecButton: {
    background: "#28a745",
    color: "white",
    border: "none",
    borderRadius: "4px",
    padding: "8px 16px",
    fontSize: "12px",
    cursor: "pointer",
    marginTop: "8px",
  },
};

const CreateEquipment = () => {
  const history = useHistory();

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    model: "",
    category: "",
    description: "",
    quantity: 1,
    availableQuantity: 1,
    status: "Available",
    location: "",
    serialNumber: "",
    featured: false,
    specifications: [],
  });

  // Additional state
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [skuPreview, setSkuPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // Load initial data
  useEffect(() => {
    loadInitialData();
  }, []);

  // Update SKU preview when relevant fields change
  useEffect(() => {
    generateSkuPreview();
  }, [formData.name, formData.brand, formData.category]);

  const loadInitialData = async () => {
    try {
      setDataLoading(true);
      setError("");

      console.log("🔧 Loading categories and brands...");

      // Load categories with error handling
      let categoriesData = [];
      try {
        const categoriesResponse = await fetch("/equipment-categories");
        if (categoriesResponse.ok) {
          categoriesData = await categoriesResponse.json();
          console.log("✅ Categories loaded:", categoriesData);
        } else {
          console.warn(
            "⚠️ Categories request failed:",
            categoriesResponse.status
          );
        }
      } catch (categoryError) {
        console.warn("⚠️ Categories fetch error:", categoryError);
      }

      // Load brands with error handling
      let brandsData = [];
      try {
        const brandsResponse = await fetch("/inventory-manager/sku/brands");
        if (brandsResponse.ok) {
          brandsData = await brandsResponse.json();
          console.log("✅ Brands loaded:", brandsData);
        } else {
          console.warn("⚠️ Brands request failed:", brandsResponse.status);
        }
      } catch (brandError) {
        console.warn("⚠️ Brands fetch error:", brandError);
      }

      // Ensure we have arrays even if API calls fail
      setCategories(Array.isArray(categoriesData) ? categoriesData : []);
      setBrands(Array.isArray(brandsData) ? brandsData : []);

      // Add fallback data if API calls failed
      if (!Array.isArray(categoriesData) || categoriesData.length === 0) {
        setCategories([
          { id: 1, name: "Lighting" },
          { id: 2, name: "Audio" },
          { id: 3, name: "Power & Distribution" },
          { id: 4, name: "Staging" },
          { id: 5, name: "Effects" },
        ]);
      }

      if (!Array.isArray(brandsData) || brandsData.length === 0) {
        setBrands([
          { id: 1, name: "Chauvet", prefix: "CH" },
          { id: 2, name: "Shure", prefix: "SH" },
          { id: 3, name: "QSC", prefix: "QS" },
          { id: 4, name: "Generic", prefix: "GE" },
        ]);
      }
    } catch (error) {
      console.error("❌ Error loading initial data:", error);
      setError("Failed to load categories and brands. Using fallback data.");

      // Set fallback data
      setCategories([
        { id: 1, name: "Lighting" },
        { id: 2, name: "Audio" },
        { id: 3, name: "Power & Distribution" },
        { id: 4, name: "Staging" },
        { id: 5, name: "Effects" },
      ]);
      setBrands([
        { id: 1, name: "Chauvet", prefix: "CH" },
        { id: 2, name: "Shure", prefix: "SH" },
        { id: 3, name: "QSC", prefix: "QS" },
        { id: 4, name: "Generic", prefix: "GE" },
      ]);
    } finally {
      setDataLoading(false);
    }
  };

  const generateSkuPreview = () => {
    if (!formData.category || !formData.brand || !formData.name) {
      setSkuPreview("SKU will be generated automatically");
      return;
    }

    // Simulate SKU generation based on your existing pattern
    const categoryPrefix = getCategoryPrefix(formData.category);
    const brandPrefix = getBrandPrefix(formData.brand);

    // For preview, show pattern with placeholder number
    setSkuPreview(`EPG-${categoryPrefix}-${brandPrefix}-###`);
  };

  const getCategoryPrefix = (categoryId) => {
    const categoryMap = {
      1: "LT", // Lighting
      2: "AU", // Audio
      3: "PW", // Power
      4: "ST", // Staging
      5: "EF", // Effects
    };
    return categoryMap[categoryId] || "GE";
  };

  const getBrandPrefix = (brandName) => {
    const brand = brands.find((b) => b.name === brandName);
    return brand ? brand.prefix : "GE";
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear field-specific errors
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  const addSpecification = () => {
    setFormData((prev) => ({
      ...prev,
      specifications: [...prev.specifications, { key: "", value: "" }],
    }));
  };

  const updateSpecification = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      specifications: prev.specifications.map((spec, i) =>
        i === index ? { ...spec, [field]: value } : spec
      ),
    }));
  };

  const removeSpecification = (index) => {
    setFormData((prev) => ({
      ...prev,
      specifications: prev.specifications.filter((_, i) => i !== index),
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Equipment name is required";
    }

    if (!formData.brand.trim()) {
      newErrors.brand = "Brand is required";
    }

    if (!formData.category) {
      newErrors.category = "Category is required";
    }

    if (formData.quantity < 1) {
      newErrors.quantity = "Quantity must be at least 1";
    }

    if (formData.availableQuantity > formData.quantity) {
      newErrors.availableQuantity =
        "Available quantity cannot exceed total quantity";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      setError("Please fix the errors below");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // Prepare data for submission
      const submissionData = {
        ...formData,
        // Convert specifications array to object if needed
        specifications: formData.specifications.reduce((acc, spec) => {
          if (spec.key && spec.value) {
            acc[spec.key] = spec.value;
          }
          return acc;
        }, {}),
        // Ensure category is properly formatted
        equipment_category: formData.category,
      };

      console.log("🔧 Submitting equipment data:", submissionData);

      // Submit to Strapi
      const response = await fetch("/equipment-items", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submissionData),
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error("❌ Submit error:", errorData);
        throw new Error(`Failed to create equipment: ${response.status}`);
      }

      const createdEquipment = await response.json();
      console.log("✅ Equipment created:", createdEquipment);

      setSuccess(
        `Equipment "${createdEquipment.name}" created successfully with SKU: ${createdEquipment.sku}`
      );

      // Reset form after short delay
      setTimeout(() => {
        setFormData({
          name: "",
          brand: "",
          model: "",
          category: "",
          description: "",
          quantity: 1,
          availableQuantity: 1,
          status: "Available",
          location: "",
          serialNumber: "",
          featured: false,
          specifications: [],
        });
        setSuccess("");
      }, 3000);
    } catch (error) {
      console.error("❌ Error creating equipment:", error);
      setError(`Failed to create equipment: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    history.push(`/plugins/${pluginId}`);
  };

  // Show loading state while fetching initial data
  if (dataLoading) {
    return (
      <div style={styles.container}>
        <PluginHeader
          title="Create Equipment"
          description="Add new equipment to the inventory with automatic SKU generation"
        />
        <div style={styles.loadingMessage}>
          Loading categories and brands...
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <PluginHeader
        title="Create Equipment"
        description="Add new equipment to the inventory with automatic SKU generation"
      />

      {error && <div style={styles.errorMessage}>{error}</div>}

      {success && <div style={styles.successMessage}>{success}</div>}

      {/* SKU Preview */}
      <div
        style={{
          ...styles.skuPreview,
          ...(skuPreview.startsWith("EPG-") ? styles.skuPreviewGenerated : {}),
        }}
      >
        <div
          style={{
            ...styles.skuText,
            ...(skuPreview.startsWith("EPG-") ? styles.skuGenerated : {}),
          }}
        >
          SKU Preview: {skuPreview}
        </div>
        <div style={styles.skuHint}>
          {skuPreview.startsWith("EPG-")
            ? "SKU will be auto-generated with the next available number"
            : "Fill in name, brand, and category to see SKU preview"}
        </div>
      </div>

      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.formGrid}>
          {/* Basic Information Row */}
          <div style={styles.formRow}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Equipment Name *</label>
              <input
                type="text"
                style={{
                  ...styles.input,
                  ...(errors.name ? styles.inputError : {}),
                }}
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="e.g., LED PAR 64"
              />
              {errors.name && (
                <div style={styles.validationError}>{errors.name}</div>
              )}
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Brand *</label>
              <select
                style={{
                  ...styles.select,
                  ...(errors.brand ? styles.inputError : {}),
                }}
                value={formData.brand}
                onChange={(e) => handleInputChange("brand", e.target.value)}
              >
                <option value="">Select Brand</option>
                {brands.map((brand) => (
                  <option key={brand.id} value={brand.name}>
                    {brand.name} ({brand.prefix})
                  </option>
                ))}
              </select>
              {errors.brand && (
                <div style={styles.validationError}>{errors.brand}</div>
              )}
            </div>
          </div>

          {/* Model and Category Row */}
          <div style={styles.formRow}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Model</label>
              <input
                type="text"
                style={styles.input}
                value={formData.model}
                onChange={(e) => handleInputChange("model", e.target.value)}
                placeholder="e.g., SlimPAR Pro H USB"
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Category *</label>
              <select
                style={{
                  ...styles.select,
                  ...(errors.category ? styles.inputError : {}),
                }}
                value={formData.category}
                onChange={(e) => handleInputChange("category", e.target.value)}
              >
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              {errors.category && (
                <div style={styles.validationError}>{errors.category}</div>
              )}
            </div>
          </div>

          {/* Description */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Description</label>
            <textarea
              style={styles.textarea}
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Detailed description of the equipment, its capabilities, and technical features..."
            />
          </div>

          {/* Inventory Information Row */}
          <div style={styles.formRow}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Total Quantity *</label>
              <input
                type="number"
                style={{
                  ...styles.input,
                  ...(errors.quantity ? styles.inputError : {}),
                }}
                value={formData.quantity}
                onChange={(e) =>
                  handleInputChange("quantity", parseInt(e.target.value) || 1)
                }
                min="1"
              />
              {errors.quantity && (
                <div style={styles.validationError}>{errors.quantity}</div>
              )}
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Available Quantity *</label>
              <input
                type="number"
                style={{
                  ...styles.input,
                  ...(errors.availableQuantity ? styles.inputError : {}),
                }}
                value={formData.availableQuantity}
                onChange={(e) =>
                  handleInputChange(
                    "availableQuantity",
                    parseInt(e.target.value) || 1
                  )
                }
                min="0"
                max={formData.quantity}
              />
              {errors.availableQuantity && (
                <div style={styles.validationError}>
                  {errors.availableError}
                </div>
              )}
              <div style={styles.helpText}>
                Cannot exceed total quantity ({formData.quantity})
              </div>
            </div>
          </div>

          {/* Status and Location Row */}
          <div style={styles.formRow}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Status</label>
              <select
                style={styles.select}
                value={formData.status}
                onChange={(e) => handleInputChange("status", e.target.value)}
              >
                <option value="Available">Available</option>
                <option value="Rented">Rented</option>
                <option value="Maintenance">Maintenance</option>
                <option value="Damaged">Damaged</option>
                <option value="Retired">Retired</option>
              </select>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Location</label>
              <input
                type="text"
                style={styles.input}
                value={formData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
                placeholder="e.g., Warehouse A, Shelf 3"
              />
              <div style={styles.helpText}>
                Internal use only - not visible to customers
              </div>
            </div>
          </div>

          {/* Serial Number and Featured Row */}
          <div style={styles.formRow}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Serial Number</label>
              <input
                type="text"
                style={styles.input}
                value={formData.serialNumber}
                onChange={(e) =>
                  handleInputChange("serialNumber", e.target.value)
                }
                placeholder="Manufacturer's serial number"
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) =>
                    handleInputChange("featured", e.target.checked)
                  }
                  style={{ marginRight: "8px" }}
                />
                Featured Equipment
              </label>
              <div style={styles.helpText}>
                Featured equipment appears on the homepage
              </div>
            </div>
          </div>

          {/* Technical Specifications */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Technical Specifications</label>
            {formData.specifications.map((spec, index) => (
              <div key={index} style={styles.specRow}>
                <input
                  type="text"
                  style={styles.specInput}
                  value={spec.key}
                  onChange={(e) =>
                    updateSpecification(index, "key", e.target.value)
                  }
                  placeholder="Property (e.g., Power, Weight, Dimensions)"
                />
                <input
                  type="text"
                  style={styles.specInput}
                  value={spec.value}
                  onChange={(e) =>
                    updateSpecification(index, "value", e.target.value)
                  }
                  placeholder="Value (e.g., 100W, 5kg, 10x10x15cm)"
                />
                <button
                  type="button"
                  style={styles.removeSpecButton}
                  onClick={() => removeSpecification(index)}
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              style={styles.addSpecButton}
              onClick={addSpecification}
            >
              + Add Specification
            </button>
          </div>
        </div>

        {/* Form Actions */}
        <div style={styles.buttonContainer}>
          <button
            type="button"
            style={{
              ...styles.button,
              ...styles.buttonSecondary,
            }}
            onClick={handleCancel}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            style={{
              ...styles.button,
              ...(loading ? styles.buttonDisabled : styles.buttonPrimary),
            }}
            disabled={loading}
          >
            {loading ? "Creating Equipment..." : "Create Equipment"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default memo(CreateEquipment);
