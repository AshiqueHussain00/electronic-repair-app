/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getInitialsAvatar } from './src/utils';

const app = express();
const PORT = 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'magic-mistry-ultra-secret-key-1029';

// Setup file-based JSON database path
const DB_FILE = path.join(process.cwd(), 'database.json');

// Initialize database file if empty
if (!fs.existsSync(DB_FILE)) {
  fs.writeFileSync(
    DB_FILE,
    JSON.stringify({
      users: [
        {
          id: 'user-cust-1',
          name: 'Azad Ansari',
          email: 'ansariazad7864@gmail.com',
          phone: '+15551234567',
          passwordHash: bcrypt.hashSync('CustPass@Electronic2026!', 10),
          role: 'CUSTOMER',
          status: 'ACTIVE',
          isEmailVerified: true,
          isPhoneVerified: true,
          avatar: getInitialsAvatar('Azad Ansari'),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 'user-tech-1',
          name: 'John Electrician',
          email: 'tech@magicmistry.com',
          phone: '+15559876543',
          passwordHash: bcrypt.hashSync('TechPass@Electronic2026!', 10),
          role: 'TECHNICIAN',
          status: 'ACTIVE',
          isEmailVerified: true,
          isPhoneVerified: true,
          avatar: getInitialsAvatar('John Electrician'),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 'user-admin-1',
          name: 'Admin Director',
          email: 'admin@magicmistry.com',
          phone: '+15550001111',
          passwordHash: bcrypt.hashSync('AdminPass@Electronic2026!', 10),
          role: 'ADMIN',
          status: 'ACTIVE',
          isEmailVerified: true,
          isPhoneVerified: true,
          avatar: getInitialsAvatar('Admin Director'),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ],
      bookings: [],
      otps: [],
    })
  );
}

// Read and write helper for persistent state
function readDB() {
  const db = JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
  let mutated = false;

  // Run dynamic schema migration to ensure all users have active statuses
  db.users = db.users.map((u: any) => {
    if (!u.status) {
      u.status = 'ACTIVE';
      mutated = true;
    }
    // Automatically migrate passwords of pre-seeded/breached accounts
    if (u.role === 'ADMIN') {
      const isCorrectPassword = bcrypt.compareSync('AdminPass@Electronic2026!', u.passwordHash);
      if (!isCorrectPassword) {
        u.passwordHash = bcrypt.hashSync('AdminPass@Electronic2026!', 10);
        mutated = true;
      }
    } else if (u.role === 'TECHNICIAN' && u.email === 'tech@magicmistry.com') {
      const isCorrectPassword = bcrypt.compareSync('TechPass@Electronic2026!', u.passwordHash);
      if (!isCorrectPassword) {
        u.passwordHash = bcrypt.hashSync('TechPass@Electronic2026!', 10);
        mutated = true;
      }
    } else if (u.role === 'CUSTOMER' && u.email === 'ansariazad7864@gmail.com') {
      const isCorrectPassword = bcrypt.compareSync('CustPass@Electronic2026!', u.passwordHash);
      if (!isCorrectPassword) {
        u.passwordHash = bcrypt.hashSync('CustPass@Electronic2026!', 10);
        mutated = true;
      }
    }
    return u;
  });

  // Inject Electronic Admin if missing
  if (!db.users.some((u: any) => u.email === 'admin@electronic.repair')) {
    db.users.push({
      id: 'user-admin-2',
      name: 'Electronic Admin',
      email: 'admin@electronic.repair',
      phone: '+15550002222',
      passwordHash: bcrypt.hashSync('AdminPass@Electronic2026!', 10),
      role: 'ADMIN',
      status: 'ACTIVE',
      isEmailVerified: true,
      isPhoneVerified: true,
      avatar: getInitialsAvatar('Electronic Admin'),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    mutated = true;
  }

  if (mutated) {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
  }
  return db;
}

function writeDB(data: any) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

// Request parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Express Token Authenticator Middleware
function authenticateToken(req: any, res: any, next: any) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err: any, userPayload: any) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }

    // Verify account is active in the database
    const db = readDB();
    const dbUser = db.users.find((u: any) => u.id === userPayload.id);
    if (dbUser && dbUser.status === 'BLOCKED') {
      return res.status(403).json({ message: 'This account has been suspended by the administrator.' });
    }

    req.user = userPayload;
    next();
  });
}

/* ==========================================
   AUTHENTICATION APIS
   ========================================== */

// 1. REGISTER
app.post('/api/auth/register', (req, res) => {
  const { name, email, phone, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Missing required registration parameters' });
  }

  const db = readDB();
  const emailLower = email.toLowerCase();

  if (db.users.some((u: any) => u.email.toLowerCase() === emailLower)) {
    return res.status(400).json({ message: 'Email address already registered' });
  }

  const newUser = {
    id: `usr-${Date.now()}`,
    name,
    email: emailLower,
    phone: phone || '',
    passwordHash: bcrypt.hashSync(password, 10),
    role: 'CUSTOMER', // Strict role selection: users can only register their own account as customers
    status: 'ACTIVE',
    isEmailVerified: false,
    isPhoneVerified: false,
    avatar: getInitialsAvatar(name),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  db.users.push(newUser);

  // Generate OTP code
  const otpCode = '123456'; // Default mock test OTP
  db.otps.push({
    email: emailLower,
    otp: otpCode,
    purpose: 'REGISTER',
    expiresAt: Date.now() + 300000, // 5 min expiry
  });

  writeDB(db);

  console.log(`[AUTH] Registered user: ${emailLower}. Verification OTP: ${otpCode}`);

  res.status(201).json({
    user: {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone,
      role: newUser.role,
      avatar: newUser.avatar,
      isEmailVerified: newUser.isEmailVerified,
    },
    message: 'Registration successful. OTP dispatched.',
  });
});

// 2. LOGIN
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password required' });
  }

  const db = readDB();
  const userRecord = db.users.find((u: any) => u.email.toLowerCase() === email.toLowerCase());

  if (!userRecord) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  // Admin login logic: Enforce single password for all Admin users
  if (userRecord.role === 'ADMIN') {
    if (password !== 'AdminPass@Electronic2026!') {
      return res.status(401).json({ message: 'Invalid admin credentials' });
    }
  } else {
    // Normal user / technician login logic: verify database hashed password
    if (!bcrypt.compareSync(password, userRecord.passwordHash)) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
  }

  // Block account checking: suspended users/technicians are rejected
  if (userRecord.status === 'BLOCKED') {
    return res.status(403).json({ message: 'This account has been suspended by the administrator.' });
  }

  // Create JWT accessToken
  const accessToken = jwt.sign(
    { id: userRecord.id, email: userRecord.email, role: userRecord.role, name: userRecord.name },
    JWT_SECRET,
    { expiresIn: '2h' }
  );

  res.json({
    user: {
      id: userRecord.id,
      name: userRecord.name,
      email: userRecord.email,
      phone: userRecord.phone,
      role: userRecord.role,
      avatar: userRecord.avatar,
      isEmailVerified: userRecord.isEmailVerified,
    },
    accessToken,
  });
});

// 3. VERIFY OTP
app.post('/api/auth/verify-otp', (req, res) => {
  const { email, otp, purpose } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ message: 'Email and OTP code required' });
  }

  const db = readDB();
  const otpRecordIndex = db.otps.findIndex(
    (o: any) => o.email.toLowerCase() === email.toLowerCase() && o.otp === otp && o.purpose === purpose
  );

  if (otpRecordIndex === -1) {
    return res.status(400).json({ message: 'Invalid or expired OTP code' });
  }

  // OTP verified, remove code from database
  db.otps.splice(otpRecordIndex, 1);

  // Update user verified status
  const userIndex = db.users.findIndex((u: any) => u.email.toLowerCase() === email.toLowerCase());
  if (userIndex !== -1) {
    db.users[userIndex].isEmailVerified = true;
    db.users[userIndex].isPhoneVerified = true;
  }

  const verifiedUser = db.users[userIndex];
  writeDB(db);

  // Issue active session token
  const accessToken = jwt.sign(
    { id: verifiedUser.id, email: verifiedUser.email, role: verifiedUser.role, name: verifiedUser.name },
    JWT_SECRET,
    { expiresIn: '2h' }
  );

  res.json({
    user: {
      id: verifiedUser.id,
      name: verifiedUser.name,
      email: verifiedUser.email,
      role: verifiedUser.role,
      avatar: verifiedUser.avatar,
      isEmailVerified: true,
    },
    accessToken,
    message: 'Identity verified successfully!',
  });
});

// 4. RESEND OTP
app.post('/api/auth/resend-otp', (req, res) => {
  const { email, purpose } = req.body;
  if (!email) {
    return res.status(400).json({ message: 'Email coordinate is required' });
  }

  const db = readDB();
  const otpCode = '123456';

  db.otps = db.otps.filter((o: any) => !(o.email.toLowerCase() === email.toLowerCase() && o.purpose === purpose));
  db.otps.push({
    email: email.toLowerCase(),
    otp: otpCode,
    purpose,
    expiresAt: Date.now() + 300000,
  });

  writeDB(db);
  console.log(`[AUTH] Resent OTP to ${email}: ${otpCode}`);

  res.json({ message: 'OTP resent successfully.' });
});

// 5. FORGOT PASSWORD REQUEST
app.post('/api/auth/forgot-password', (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: 'Email coordinate is required' });
  }

  const db = readDB();
  const exists = db.users.some((u: any) => u.email.toLowerCase() === email.toLowerCase());

  if (!exists) {
    return res.status(404).json({ message: 'Account not found with this email' });
  }

  const otpCode = '123456';
  db.otps.push({
    email: email.toLowerCase(),
    otp: otpCode,
    purpose: 'FORGOT_PASSWORD',
    expiresAt: Date.now() + 300000,
  });

  writeDB(db);
  console.log(`[AUTH] Forgot Password recovery code for ${email}: ${otpCode}`);

  res.json({ message: 'Password recovery OTP dispatched.' });
});

// 6. RESET PASSWORD COMPLETION
app.post('/api/auth/reset-password', (req, res) => {
  const { email, otp, password } = req.body;

  if (!email || !otp || !password) {
    return res.status(400).json({ message: 'All inputs required' });
  }

  const db = readDB();
  const otpIdx = db.otps.findIndex(
    (o: any) => o.email.toLowerCase() === email.toLowerCase() && o.otp === otp && o.purpose === 'FORGOT_PASSWORD'
  );

  if (otpIdx === -1) {
    return res.status(400).json({ message: 'Invalid or expired OTP code' });
  }

  db.otps.splice(otpIdx, 1);

  const userIdx = db.users.findIndex((u: any) => u.email.toLowerCase() === email.toLowerCase());
  if (userIdx !== -1) {
    db.users[userIdx].passwordHash = bcrypt.hashSync(password, 10);
  }

  writeDB(db);

  res.json({ message: 'Password changed successfully.' });
});

// 7. GET PROFILE
app.get('/api/auth/me', authenticateToken, (req: any, res: any) => {
  const db = readDB();
  const userRecord = db.users.find((u: any) => u.id === req.user.id);

  if (!userRecord) {
    return res.status(404).json({ message: 'Profile not found' });
  }

  res.json({
    id: userRecord.id,
    name: userRecord.name,
    email: userRecord.email,
    phone: userRecord.phone,
    role: userRecord.role,
    avatar: userRecord.avatar,
    isEmailVerified: userRecord.isEmailVerified,
  });
});

// 8. LOGOUT
app.post('/api/auth/logout', (req, res) => {
  res.json({ message: 'Session logged out' });
});

// 9. SILENT REFRESH
app.post('/api/auth/refresh', (req, res) => {
  res.json({ message: 'Session refreshed' });
});

/* ==========================================
   BOOKING APIS
   ========================================== */

// 1. GET BOOKINGS LIST FOR USER/ROLE
app.get('/api/bookings', authenticateToken, (req: any, res: any) => {
  const db = readDB();
  const { id, role } = req.user;

  let filtered = [];
  if (role === 'ADMIN') {
    filtered = db.bookings;
  } else if (role === 'TECHNICIAN') {
    filtered = db.bookings.filter((b: any) => b.technicianId === id || b.status === 'PENDING');
  } else {
    filtered = db.bookings.filter((b: any) => b.customerId === id);
  }

  res.json(filtered);
});

// 2. CREATE BOOKING
app.post('/api/bookings', authenticateToken, (req: any, res: any) => {
  const { serviceId, serviceName, scheduledDate, scheduledTime, address, amount, paymentMethod, problemDescription } = req.body;
  const db = readDB();

  const newBooking = {
    id: `book-${Date.now()}`,
    customerId: req.user.id,
    customerName: req.user.name,
    customerPhone: req.user.phone || '',
    serviceId,
    serviceName,
    scheduledDate,
    scheduledTime,
    address,
    status: 'PENDING',
    amount: amount || 50,
    paymentStatus: 'PENDING',
    paymentMethod: paymentMethod || 'CASH',
    problemDescription: problemDescription || '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  db.bookings.push(newBooking);
  writeDB(db);

  res.status(201).json(newBooking);
});

// 3. ACCEPT BOOKING (Technician)
app.post('/api/bookings/:id/accept', authenticateToken, (req: any, res: any) => {
  const { id } = req.params;
  const db = readDB();
  const bookingIdx = db.bookings.findIndex((b: any) => b.id === id);

  if (bookingIdx === -1) {
    return res.status(404).json({ message: 'Booking not found' });
  }

  db.bookings[bookingIdx].status = 'ACCEPTED';
  db.bookings[bookingIdx].technicianId = req.user.id;
  db.bookings[bookingIdx].technicianName = req.user.name;
  db.bookings[bookingIdx].updatedAt = new Date().toISOString();

  writeDB(db);
  res.json(db.bookings[bookingIdx]);
});

// 4. UPDATE BOOKING STATUS
app.patch('/api/bookings/:id/status', authenticateToken, (req: any, res: any) => {
  const { id } = req.params;
  const { status } = req.body;
  const db = readDB();
  const bookingIdx = db.bookings.findIndex((b: any) => b.id === id);

  if (bookingIdx === -1) {
    return res.status(404).json({ message: 'Booking not found' });
  }

  db.bookings[bookingIdx].status = status;
  db.bookings[bookingIdx].updatedAt = new Date().toISOString();

  if (status === 'COMPLETED') {
    db.bookings[bookingIdx].paymentStatus = 'PAID';
  }

  writeDB(db);
  res.json(db.bookings[bookingIdx]);
});

// 5. REVIEW BOOKING
app.post('/api/bookings/:id/review', authenticateToken, (req: any, res: any) => {
  const { id } = req.params;
  const { rating, comment } = req.body;
  const db = readDB();
  const bookingIdx = db.bookings.findIndex((b: any) => b.id === id);

  if (bookingIdx === -1) {
    return res.status(404).json({ message: 'Booking not found' });
  }

  db.bookings[bookingIdx].reviewed = true;
  db.bookings[bookingIdx].reviewRating = rating;
  db.bookings[bookingIdx].reviewComment = comment;

  writeDB(db);
  res.json({ message: 'Review recorded successfully.' });
});

/* ==========================================
   ADMIN APIS
   ========================================== */

// 1. GET ALL USERS (Admin)
app.get('/api/admin/users', authenticateToken, (req: any, res: any) => {
  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({ message: 'Admin permissions required' });
  }
  const db = readDB();
  // Return users without password hashes
  const users = db.users.map(({ passwordHash, ...rest }: any) => rest);
  res.json(users);
});

// 2. TOGGLE USER STATUS (Admin block/unblock)
app.post('/api/admin/users/:id/toggle-block', authenticateToken, (req: any, res: any) => {
  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({ message: 'Admin permissions required' });
  }
  const { id } = req.params;
  const db = readDB();
  const userIdx = db.users.findIndex((u: any) => u.id === id);

  if (userIdx === -1) {
    return res.status(404).json({ message: 'User account not found' });
  }

  // Prevent blocking oneself
  if (db.users[userIdx].id === req.user.id) {
    return res.status(400).json({ message: 'You cannot block your own admin account' });
  }

  const currentStatus = db.users[userIdx].status || 'ACTIVE';
  const nextStatus = currentStatus === 'ACTIVE' ? 'BLOCKED' : 'ACTIVE';
  db.users[userIdx].status = nextStatus;
  db.users[userIdx].updatedAt = new Date().toISOString();

  writeDB(db);
  res.json({ message: `User status successfully toggled to ${nextStatus}`, status: nextStatus });
});

// 3. CREATE VENDOR ACCOUNT (Admin)
app.post('/api/admin/vendors', authenticateToken, (req: any, res: any) => {
  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({ message: 'Admin permissions required' });
  }
  const { name, email, phone, password, skills, basePrice } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Missing vendor setup parameters' });
  }

  const db = readDB();
  const emailLower = email.toLowerCase();

  if (db.users.some((u: any) => u.email.toLowerCase() === emailLower)) {
    return res.status(400).json({ message: 'Email address already registered' });
  }

  const newVendor = {
    id: `usr-vendor-${Date.now()}`,
    name,
    email: emailLower,
    phone: phone || '',
    passwordHash: bcrypt.hashSync(password, 10),
    role: 'TECHNICIAN',
    status: 'ACTIVE',
    skills: skills || [],
    basePrice: Number(basePrice) || 60,
    isEmailVerified: true,
    isPhoneVerified: true,
    avatar: getInitialsAvatar(name),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  db.users.push(newVendor);
  writeDB(db);

  res.status(201).json({
    user: {
      id: newVendor.id,
      name: newVendor.name,
      email: newVendor.email,
      phone: newVendor.phone,
      role: newVendor.role,
      status: newVendor.status,
    },
    message: 'Vendor profile created successfully!',
  });
});

// 4. GET SYSTEM STATS (Admin)
app.get('/api/admin/stats', authenticateToken, (req: any, res: any) => {
  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({ message: 'Admin permissions required' });
  }
  const db = readDB();

  // Active users count
  const activeUsers = db.users.filter((u: any) => u.role === 'CUSTOMER' && u.status !== 'BLOCKED').length;

  // Active vendors count
  const activeVendors = db.users.filter((u: any) => u.role === 'TECHNICIAN' && u.status !== 'BLOCKED').length;

  // Working vendors (busy) count: any technician assigned to a booking that is ACCEPTED or PENDING
  const busyVendorIds = new Set(
    db.bookings
      .filter((b: any) => (b.status === 'ACCEPTED' || b.status === 'IN_PROGRESS') && b.technicianId)
      .map((b: any) => b.technicianId)
  );
  const workingVendorsCount = busyVendorIds.size;

  // Total completed works
  const completedBookings = db.bookings.filter((b: any) => b.status === 'COMPLETED');
  const completedWorksCount = completedBookings.length;

  // Total earnings (completed works sum)
  const totalEarnings = completedBookings.reduce((sum: number, b: any) => sum + (Number(b.amount) || 0), 0);

  // Vendor works done breakdown: how many works/jobs completed per vendor/worker
  const vendors = db.users.filter((u: any) => u.role === 'TECHNICIAN');
  const vendorBreakdown = vendors.map((v: any) => {
    const worksDone = db.bookings.filter((b: any) => b.technicianId === v.id && b.status === 'COMPLETED').length;
    const isWorking = busyVendorIds.has(v.id);
    return {
      id: v.id,
      name: v.name,
      email: v.email,
      status: v.status || 'ACTIVE',
      isWorking,
      worksDone,
    };
  });

  res.json({
    activeUsersCount: activeUsers,
    activeVendorsCount: activeVendors,
    workingVendorsCount,
    completedWorksCount,
    totalEarnings,
    vendorBreakdown,
  });
});

/* ==========================================
   VITE DEV MIDDLEWARE & ASSETS SERVING
   ========================================== */
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    console.log('[SYSTEM] Vite Dev Middleware mounted successfully.');
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
    console.log('[SYSTEM] Servicing static production builds.');
  }

  // Only start listener when running locally (not on Vercel serverless)
  if (!process.env.VERCEL) {
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`[SYSTEM] Full-Stack server booted at http://0.0.0.0:${PORT}`);
    });
  }
}

startServer().catch((err) => {
  console.error('[CRITICAL] Server failed to start:', err);
});

// Export for Vercel serverless function
export default app;
