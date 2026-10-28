import fs from 'fs';

let content = fs.readFileSync('server.ts', 'utf8');

// Mount adminRoutes
if (!content.includes("app.use('/api/admin', adminRoutes);")) {
  content = content.replace(
    /app\.use\('\/api\/auth',\s*authRoutes\);/,
    "app.use('/api/auth', authRoutes);\r\napp.use('/api/admin', adminRoutes);"
  );
}

// Bypass credit & history check for admin
content = content.replace(
  /if \(user && user\.credits_remaining <= 0\) \{/,
  "if (user && user.role !== 'admin' && user.credits_remaining <= 0) {"
);

content = content.replace(
  /if \(user && finalUserId\) \{\s*const buildCount = await Build\.countDocuments\(\{ user_id: finalUserId \}\);\s*if \(buildCount >= user\.history_limit\) \{/,
  "if (user && user.role !== 'admin' && finalUserId) {\r\n      const buildCount = await Build.countDocuments({ user_id: finalUserId });\r\n      if (buildCount >= user.history_limit) {"
);

// Admin has no watermark
content = content.replace(
  /const isPremiumDB = user \? !user\.watermark_enabled : false;/,
  "const isPremiumDB = (user && user.role === 'admin') ? true : (user ? !user.watermark_enabled : false);"
);

fs.writeFileSync('server.ts', content, 'utf8');
console.log('✅ server.ts updated with admin routes and bypasses!');
