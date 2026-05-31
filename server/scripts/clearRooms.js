const mongoose = require("mongoose")
require("dotenv").config()

const connectDB = require("../config/db")
const Room = require("../models/Room")

async function main() {
  if (!process.argv.includes("--confirm")) {
    console.log("Refusing to delete rooms without --confirm")
    process.exit(1)
  }

  await connectDB()

  const result = await Room.deleteMany({})
  console.log(`Deleted ${result.deletedCount} room records`)

  await mongoose.disconnect()
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
