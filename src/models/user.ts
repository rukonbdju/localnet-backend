import { model, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import { geolocation } from './location';


const userSchema = new Schema(
    {
        username: { type: String, unique: true },
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        currentGeolocation: { type: geolocation, index: "2dsphere" },
        primaryGeolocation: { type: geolocation, index: "2dsphere", required: true },
        lastGeolocation: { type: geolocation, index: "2dsphere" },
        address: { type: String, required: true },
        country: { type: String, required: true },
        city: { type: String, default: '' },
        state: { type: String, default: '' },
        district: { type: String, default: '' },
        village: { type: String, default: '' },
        countryCode: { type: String, default: '' },
        dateOfBirth: { type: Date, },
        phone: { type: String, default: '' },
        avatar: { type: String, default: '' },
        coverPhoto: { type: String, default: '' },
        bio: { type: String, default: '' },
        verified: { type: Boolean, default: false },
    },
    { timestamps: true }
);

// Hash password before saving
userSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    this.password = await bcrypt.hash(this.password, 10);
});

//generate username from email
userSchema.pre('save', function () {
    if (!this.isModified('email')) return;
    let username = this.email.split('@')[0];
    this.username = username.replace(/[^a-zA-Z0-9]/g, '') + new Date().getTime().toString().slice(-5);
});

export const User = model('User', userSchema);
