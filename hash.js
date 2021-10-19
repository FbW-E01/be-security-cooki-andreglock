import bcrypt from 'bcrypt';

export async function hash (input) {
    return await bcrypt.hash(`${input}`, 5);
}