// Backend/hashPassword.js

import { hash as _hash } from 'bcryptjs';

// --- IMPORTANT ---
// 1. CHOOSE your admin password here.
const plainPassword = 'adminpassword123'; 
// -----------------

// This will generate the hash
_hash(plainPassword, 10, (err, hash) => {
    if (err) {
        console.error("Error hashing password:", err);
        return;
    }
    console.log("--- Your Hashed Password ---");
    console.log(hash);
    console.log("----------------------------");
    console.log(`\nNow, use this hash in your SQL query. Your login password is: ${plainPassword}`);
});