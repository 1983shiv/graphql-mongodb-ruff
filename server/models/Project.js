import mongoose from "mongoose";
// import Client from "./models/Client.js"; 

const ProjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  clientId :{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Client"
  },
  description: {
    type: String
  },
  status: {
    type: String,
    enum: ["Not Started", "In Progress", "Completed"],
    default: "Not Started",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Project", ProjectSchema);