import mongoose from "mongoose";
import { TenantModel } from "../src/models/TenantModel.js";
import { ApartmentModel } from "../src/models/ApartmentModel.js";

const FIRST_NAMES = [
  "Johan",
  "Maria",
  "Erik",
  "Anna",
  "Lars",
  "Karin",
  "Magnus",
  "Sofia",
];
const LAST_NAMES = [
  "Andersson",
  "Bergström",
  "Carlsson",
  "Davidsson",
  "Eriksson",
  "Falk",
  "Gustafsson",
  "Hansson",
];

function randomFromArray(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateEmail(firstName, lastName) {
  return `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`;
}

function generatePhone() {
  return `070-${Math.floor(Math.random() * 9000000) + 1000000}`;
}

async function seed() {
  await mongoose.connect(
    process.env.DB_CONNECTION_STRING || "mongodb://localhost:27020/propertyDB"
  );

  // Get all available apartments
  const availableApartments = await ApartmentModel.find({ isAvailable: true });

  if (availableApartments.length === 0) {
    console.log(
      "No available apartments found. Please seed apartments first with: npm run seed:apartments"
    );
    process.exit(1);
  }

  await TenantModel.deleteMany({});

  const tenants = [];
  for (let i = 0; i < Math.min(10, availableApartments.length); i++) {
    const firstName = randomFromArray(FIRST_NAMES);
    const lastName = randomFromArray(LAST_NAMES);

    tenants.push({
      name: `${firstName} ${lastName}`,
      email: generateEmail(firstName, lastName),
      phone: generatePhone(),
    });
  }

  // Insert tenants and bind to apartments
  const createdTenants = await TenantModel.insertMany(tenants);

  for (let i = 0; i < createdTenants.length; i++) {
    availableApartments[i].tenant = createdTenants[i]._id;
    availableApartments[i].isAvailable = false;
    await availableApartments[i].save();
  }

  console.log(
    `Seeded ${createdTenants.length} tenants and bound them to apartments!`
  );
  process.exit(0);
}

seed();
