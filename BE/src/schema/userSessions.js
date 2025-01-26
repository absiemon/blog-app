//A mongodb model for user using mongoose in ts
import mongoose from "mongoose";

// define the schema for the api key model
const userSessionSchema = new mongoose.Schema(
    {
        session_id: { type: String, required: true },
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        refresh_token: { type: String, required: true },
        device_info: {
            device_name: { type: String, default: 'Unknown' },
            ip_address: { type: String, default: 'Unknown' },
            platform: { type: String, default: 'Unknown' },
        },
        device_id: { type: String, required: true },
        is_current_device: { type: Boolean, default: false },
        is_active: { type: Boolean, default: true },
        expires_at: { type: Date, select: false },
        logged_in_at: { type: Date },
    },
    {
        timestamps: true,
        collection: 'userSession'
    }
);

// create the model
const UserSession = mongoose.model("UserSession", userSessionSchema);
export default UserSession;
