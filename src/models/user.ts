import { model, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';


const userSchema = new Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

});

// Hash password before saving
userSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = function (candidatePassword: string) {
    return bcrypt.compare(candidatePassword, this.password);
};

export const User = model('User', userSchema);
