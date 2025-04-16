import { model, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import { locationSchema } from './location';


const userSchema = new Schema(
    {
        username: { type: String, required: true, unique: true },
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        currentLocation: { type: locationSchema, index: "2dsphere" },
        lastLocation: { type: locationSchema, index: "2dsphere" },
        address: { type: String, required: true },
        phone: { type: String },
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
    this.username = username.replace(/[^a-zA-Z0-9]/g, '');
});

export const User = model('User', userSchema);
