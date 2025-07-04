// strapi-app/plugins/inventory-manager/services/sku-generator.js
"use strict";

/**
 * SKU Generation Service for EPG Equipment
 * Format: EPG[CATEGORY_PREFIX][BRAND_PREFIX][SEQUENTIAL_NUMBER]
 * Example: EPG-LT-CH-001 (Envision Production Group, Lighting, Chauvet, Item #001)
 */

module.exports = {
  /**
   * Category prefix mapping
   */
  categoryPrefixes: {
    lighting: "LT",
    audio: "AU",
    "power & distribution": "PW",
    power: "PW", // Alternative name
    staging: "ST",
    effects: "EF",
    "special effects": "EF", // Alternative name
  },

  /**
   * Default brand prefix for unknown brands
   */
  defaultBrandPrefix: "GE",

  /**
   * Generate SKU for equipment item
   * @param {Object} equipmentData - Equipment item data
   * @returns {Promise<string>} Generated SKU
   */
  async generateSKU(equipmentData) {
    try {
      console.log("🏷️  Generating SKU for equipment:", equipmentData.name);

      // Get category prefix
      const categoryPrefix = await this.getCategoryPrefix(equipmentData);
      console.log("📂 Category prefix:", categoryPrefix);

      // Get brand prefix
      const brandPrefix = await this.getBrandPrefix(equipmentData.brand);
      console.log("🏢 Brand prefix:", brandPrefix);

      // Get next sequential number
      const sequentialNumber = await this.getNextSequentialNumber(
        categoryPrefix,
        brandPrefix
      );
      console.log("🔢 Sequential number:", sequentialNumber);

      // Generate final SKU
      const sku = `EPG-${categoryPrefix}-${brandPrefix}-${sequentialNumber}`;
      console.log("✅ Generated SKU:", sku);

      return sku;
    } catch (error) {
      console.error("❌ Error generating SKU:", error);
      throw new Error(`Failed to generate SKU: ${error.message}`);
    }
  },

  /**
   * Get category prefix from equipment data
   * @param {Object} equipmentData - Equipment item data
   * @returns {Promise<string>} Category prefix
   */
  async getCategoryPrefix(equipmentData) {
    try {
      let categoryName = null;

      // Handle different ways category might be provided
      if (equipmentData.equipment_category) {
        if (typeof equipmentData.equipment_category === "object") {
          categoryName = equipmentData.equipment_category.name;
        } else {
          // Category ID provided, need to fetch category
          const category = await strapi.services["equipment-category"].findOne({
            id: equipmentData.equipment_category,
          });
          categoryName = category?.name;
        }
      }

      if (!categoryName) {
        console.warn("⚠️  No category found, using default");
        return "GE"; // Generic fallback
      }

      const normalizedName = categoryName.toLowerCase().trim();
      const prefix = this.categoryPrefixes[normalizedName];

      if (!prefix) {
        console.warn(
          `⚠️  Unknown category "${categoryName}", using generic prefix`
        );
        return "GE";
      }

      return prefix;
    } catch (error) {
      console.error("❌ Error getting category prefix:", error);
      return "GE"; // Fallback to generic
    }
  },

  /**
   * Get brand prefix from brand name (using database collection)
   * @param {string} brandName - Brand name
   * @returns {Promise<string>} Brand prefix
   */
  async getBrandPrefix(brandName) {
    if (!brandName || typeof brandName !== "string") {
      console.warn("⚠️  No brand name provided, using default prefix");
      return this.defaultBrandPrefix;
    }

    try {
      const normalizedBrand = brandName.toLowerCase().trim();

      // Search for exact match first
      let brandPrefix = await strapi.query("brand-prefix").findOne({
        brandName: normalizedBrand,
        isActive: true,
      });

      // If no exact match, search for partial matches
      if (!brandPrefix) {
        const allBrands = await strapi.query("brand-prefix").find({
          isActive: true,
          _limit: -1,
        });

        // Look for brands that contain the search term or vice versa
        brandPrefix = allBrands.find((brand) => {
          const dbBrandName = brand.brandName.toLowerCase();
          return (
            dbBrandName.includes(normalizedBrand) ||
            normalizedBrand.includes(dbBrandName)
          );
        });
      }

      if (!brandPrefix) {
        console.warn(`⚠️  Unknown brand "${brandName}", using default prefix`);
        return this.defaultBrandPrefix;
      }

      console.log(
        `🏢 Found brand prefix: ${brandName} -> ${brandPrefix.prefix}`
      );
      return brandPrefix.prefix;
    } catch (error) {
      console.error("❌ Error getting brand prefix from database:", error);
      return this.defaultBrandPrefix;
    }
  },

  /**
   * Get next sequential number for category+brand combination
   * @param {string} categoryPrefix - Category prefix (LT, AU, etc.)
   * @param {string} brandPrefix - Brand prefix (CH, SH, etc.)
   * @returns {Promise<string>} Zero-padded sequential number (001, 002, etc.)
   */
  async getNextSequentialNumber(categoryPrefix, brandPrefix) {
    try {
      // Find highest existing SKU for this category+brand combination
      const skuPattern = `EPG-${categoryPrefix}-${brandPrefix}-%`;

      const existingItems = await strapi.query("equipment-item").find({
        sku_contains: `EPG-${categoryPrefix}-${brandPrefix}-`,
        _limit: -1, // Get all matching items
      });

      console.log(
        `🔍 Found ${existingItems.length} existing items for ${categoryPrefix}-${brandPrefix}`
      );

      let highestNumber = 0;

      // Extract numbers from existing SKUs
      existingItems.forEach((item) => {
        if (item.sku) {
          const match = item.sku.match(/EPG-\w+-\w+-(\d+)$/);
          if (match) {
            const number = parseInt(match[1], 10);
            if (number > highestNumber) {
              highestNumber = number;
            }
          }
        }
      });

      const nextNumber = highestNumber + 1;
      const paddedNumber = nextNumber.toString().padStart(3, "0");

      console.log(
        `📊 Highest existing: ${highestNumber}, Next: ${nextNumber}, Padded: ${paddedNumber}`
      );

      return paddedNumber;
    } catch (error) {
      console.error("❌ Error getting sequential number:", error);
      // Fallback to 001 if there's an error
      return "001";
    }
  },

  /**
   * Validate SKU format
   * @param {string} sku - SKU to validate
   * @returns {boolean} Whether SKU is valid
   */
  validateSKU(sku) {
    if (!sku || typeof sku !== "string") {
      return false;
    }

    // Check format: EPG-XX-XX-000
    const skuPattern = /^EPG-[A-Z]{2}-[A-Z]{2}-\d{3}$/;
    return skuPattern.test(sku);
  },

  /**
   * Check if SKU already exists
   * @param {string} sku - SKU to check
   * @param {number} excludeId - Equipment ID to exclude from check (for updates)
   * @returns {Promise<boolean>} Whether SKU exists
   */
  async skuExists(sku, excludeId = null) {
    try {
      const query = { sku };
      if (excludeId) {
        query.id_ne = excludeId;
      }

      const existing = await strapi.query("equipment-item").findOne(query);
      return !!existing;
    } catch (error) {
      console.error("❌ Error checking SKU existence:", error);
      return false;
    }
  },

  /**
   * Create new brand prefix entry
   * @param {string} brandName - Brand name
   * @param {string} prefix - Two-letter prefix
   * @param {Object} options - Additional options
   * @returns {Promise<Object>} Created brand prefix
   */
  async createBrandPrefix(brandName, prefix, options = {}) {
    try {
      if (!brandName || !prefix) {
        throw new Error("Brand name and prefix are required");
      }

      if (prefix.length !== 2) {
        throw new Error("Prefix must be exactly 2 characters");
      }

      const normalizedBrand = brandName.toLowerCase().trim();
      const upperPrefix = prefix.toUpperCase();

      // Check if brand already exists
      const existingBrand = await strapi.query("brand-prefix").findOne({
        brandName: normalizedBrand,
      });

      if (existingBrand) {
        throw new Error(
          `Brand "${brandName}" already exists with prefix "${existingBrand.prefix}"`
        );
      }

      // Check if prefix already exists
      const existingPrefix = await strapi.query("brand-prefix").findOne({
        prefix: upperPrefix,
      });

      if (existingPrefix) {
        throw new Error(
          `Prefix "${upperPrefix}" already exists for brand "${existingPrefix.brandName}"`
        );
      }

      // Create new brand prefix
      const newBrandPrefix = await strapi.query("brand-prefix").create({
        brandName: normalizedBrand,
        prefix: upperPrefix,
        description: options.description || null,
        category: options.category || "general",
        website: options.website || null,
        notes: options.notes || null,
        isActive: true,
        isDefault: false,
      });

      console.log(`✅ Created brand prefix: ${brandName} -> ${upperPrefix}`);
      return newBrandPrefix;
    } catch (error) {
      console.error("❌ Error creating brand prefix:", error);
      throw error;
    }
  },

  /**
   * Update brand prefix
   * @param {number} id - Brand prefix ID
   * @param {Object} updates - Updates to apply
   * @returns {Promise<Object>} Updated brand prefix
   */
  async updateBrandPrefix(id, updates) {
    try {
      const existing = await strapi.query("brand-prefix").findOne({ id });
      if (!existing) {
        throw new Error(`Brand prefix with ID ${id} not found`);
      }

      // Validate prefix if being updated
      if (updates.prefix && updates.prefix.length !== 2) {
        throw new Error("Prefix must be exactly 2 characters");
      }

      if (updates.prefix) {
        updates.prefix = updates.prefix.toUpperCase();

        // Check if new prefix conflicts with another brand
        const conflicting = await strapi.query("brand-prefix").findOne({
          prefix: updates.prefix,
          id_ne: id,
        });

        if (conflicting) {
          throw new Error(
            `Prefix "${updates.prefix}" already exists for brand "${conflicting.brandName}"`
          );
        }
      }

      const updated = await strapi
        .query("brand-prefix")
        .update({ id }, updates);
      console.log(
        `✅ Updated brand prefix: ${updated.brandName} -> ${updated.prefix}`
      );
      return updated;
    } catch (error) {
      console.error("❌ Error updating brand prefix:", error);
      throw error;
    }
  },

  /**
   * Get all brand prefixes
   * @param {Object} filters - Optional filters
   * @returns {Promise<Array>} Brand prefixes
   */
  async getAllBrandPrefixes(filters = {}) {
    try {
      const query = {
        _limit: -1,
        _sort: "brandName:ASC",
        ...filters,
      };

      const brandPrefixes = await strapi.query("brand-prefix").find(query);
      console.log(`📋 Retrieved ${brandPrefixes.length} brand prefixes`);
      return brandPrefixes;
    } catch (error) {
      console.error("❌ Error getting brand prefixes:", error);
      throw error;
    }
  },

  /**
   * Get active brand prefixes as key-value mapping (for backwards compatibility)
   * @returns {Promise<Object>} Brand prefixes mapping
   */
  async getBrandPrefixMapping() {
    try {
      const brandPrefixes = await this.getAllBrandPrefixes({ isActive: true });

      const mapping = {};
      brandPrefixes.forEach((brand) => {
        mapping[brand.brandName] = brand.prefix;
      });

      // Add default mapping
      mapping["generic"] = this.defaultBrandPrefix;
      mapping["unknown"] = this.defaultBrandPrefix;
      mapping["other"] = this.defaultBrandPrefix;

      return mapping;
    } catch (error) {
      console.error("❌ Error getting brand prefix mapping:", error);
      return { generic: this.defaultBrandPrefix };
    }
  },

  /**
   * Get all available category prefixes (for admin interface)
   * @returns {Object} Category prefixes mapping
   */
  getAllCategoryPrefixes() {
    return { ...this.categoryPrefixes };
  },

  /**
   * Initialize default brand prefixes (run once on setup)
   * @returns {Promise<void>}
   */
  async initializeDefaultBrands() {
    try {
      console.log("🔄 Initializing default brand prefixes...");

      const defaultBrands = [
        // Primary Partners
        {
          brandName: "chauvet",
          prefix: "CH",
          category: "lighting",
          description: "Chauvet Professional Lighting",
        },
        {
          brandName: "chauvet professional",
          prefix: "CH",
          category: "lighting",
          description: "Chauvet Professional Lighting",
        },
        {
          brandName: "qsc",
          prefix: "QS",
          category: "audio",
          description: "QSC Audio Systems",
        },
        {
          brandName: "martin",
          prefix: "MH",
          category: "lighting",
          description: "Martin by Harman Lighting",
        },
        {
          brandName: "martin by harman",
          prefix: "MH",
          category: "lighting",
          description: "Martin by Harman Lighting",
        },
        {
          brandName: "shure",
          prefix: "SH",
          category: "audio",
          description: "Shure Microphone Systems",
        },
        {
          brandName: "adj",
          prefix: "AD",
          category: "lighting",
          description: "ADJ Lighting Equipment",
        },
        {
          brandName: "american dj",
          prefix: "AD",
          category: "lighting",
          description: "American DJ Lighting",
        },

        // Additional Audio Brands
        {
          brandName: "yamaha",
          prefix: "YM",
          category: "audio",
          description: "Yamaha Audio Equipment",
        },
        {
          brandName: "crown",
          prefix: "CR",
          category: "audio",
          description: "Crown Amplifiers",
        },
        {
          brandName: "mackie",
          prefix: "MK",
          category: "audio",
          description: "Mackie Audio",
        },
        {
          brandName: "jbl",
          prefix: "JB",
          category: "audio",
          description: "JBL Professional",
        },
        {
          brandName: "ev",
          prefix: "EV",
          category: "audio",
          description: "Electro-Voice",
        },
        {
          brandName: "electro-voice",
          prefix: "EV",
          category: "audio",
          description: "Electro-Voice",
        },
        {
          brandName: "behringer",
          prefix: "BE",
          category: "audio",
          description: "Behringer Audio",
        },
        {
          brandName: "focusrite",
          prefix: "FC",
          category: "audio",
          description: "Focusrite Audio Interfaces",
        },
        {
          brandName: "akg",
          prefix: "AK",
          category: "audio",
          description: "AKG Microphones",
        },
        {
          brandName: "sennheiser",
          prefix: "SE",
          category: "audio",
          description: "Sennheiser Audio",
        },
        {
          brandName: "rode",
          prefix: "RO",
          category: "audio",
          description: "RODE Microphones",
        },

        // Additional Lighting Brands
        {
          brandName: "elation",
          prefix: "EL",
          category: "lighting",
          description: "Elation Professional",
        },
        {
          brandName: "elation professional",
          prefix: "EL",
          category: "lighting",
          description: "Elation Professional",
        },
        {
          brandName: "arri",
          prefix: "AR",
          category: "lighting",
          description: "ARRI Lighting",
        },
        {
          brandName: "kino flo",
          prefix: "KF",
          category: "lighting",
          description: "Kino Flo Lighting",
        },
        {
          brandName: "litepanels",
          prefix: "LP",
          category: "lighting",
          description: "Litepanels LED",
        },
        {
          brandName: "godox",
          prefix: "GD",
          category: "lighting",
          description: "Godox Lighting",
        },
        {
          brandName: "aputure",
          prefix: "AP",
          category: "lighting",
          description: "Aputure Lighting",
        },

        // Generic/Fallback
        {
          brandName: "generic",
          prefix: "GE",
          category: "general",
          description: "Generic/Unknown Brand",
          isDefault: true,
        },
        {
          brandName: "other",
          prefix: "GE",
          category: "general",
          description: "Other/Unspecified Brand",
        },
        {
          brandName: "unknown",
          prefix: "GE",
          category: "general",
          description: "Unknown Brand",
        },
      ];

      let created = 0;
      let skipped = 0;

      for (const brand of defaultBrands) {
        try {
          // Check if brand already exists
          const existing = await strapi.query("brand-prefix").findOne({
            brandName: brand.brandName,
          });

          if (!existing) {
            await strapi.query("brand-prefix").create({
              brandName: brand.brandName,
              prefix: brand.prefix,
              category: brand.category,
              description: brand.description,
              isActive: true,
              isDefault: brand.isDefault || false,
            });
            created++;
            console.log(`✅ Created: ${brand.brandName} -> ${brand.prefix}`);
          } else {
            skipped++;
          }
        } catch (error) {
          console.error(
            `❌ Failed to create ${brand.brandName}:`,
            error.message
          );
        }
      }

      console.log(
        `🏁 Default brands initialization complete: ${created} created, ${skipped} skipped`
      );
      return { created, skipped, total: defaultBrands.length };
    } catch (error) {
      console.error("❌ Error initializing default brands:", error);
      throw error;
    }
  },
};
