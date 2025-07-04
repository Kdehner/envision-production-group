// Create initial categories and sample equipment
const strapiInstance = require("../");

async function seed() {
  const categories = [
    {
      name: "Lighting",
      slug: "lighting",
      description: "Professional lighting equipment for events",
      icon: "Zap",
      isActive: true,
      sortOrder: 1,
    },
    {
      name: "Audio",
      slug: "audio",
      description: "Sound systems and audio equipment",
      icon: "Volume2",
      isActive: true,
      sortOrder: 2,
    },
    // Add more categories...
  ];

  for (const category of categories) {
    await strapi.entityService.create(
      "api::equipment-category.equipment-category",
      {
        data: category,
      }
    );
  }

  console.log("✅ Seed data created successfully");
}

module.exports = { seed };
