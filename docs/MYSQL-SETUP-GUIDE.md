# MySQL Setup Guide for Skaarvi Resell Marketplace

## ✅ Migration Status

The database has been successfully migrated from PostgreSQL to MySQL. All necessary files have been updated:

### Updated Files:
- ✅ `DATABASE-SCHEMA.sql` - Complete MySQL schema (40+ tables)
- ✅ `.env.local` - Database configuration updated for MySQL
- ✅ `lib/database.js` - Sequelize configured for MySQL dialect
- ✅ `models/index.js` - Models updated with CHAR(36) UUID format
- ✅ `next.config.js` - Webpack externals updated for mysql2
- ✅ `package.json` - Dependencies switched from `pg` to `mysql2`

---

## 📋 Prerequisites

1. **MySQL Server 8.0+** installed and running
2. **MySQL Workbench** or command-line access
3. **Node.js 18+** installed
4. **npm** package manager

---

## 🚀 Step-by-Step Setup

### Step 1: Install MySQL (if not already installed)

#### Windows:
```bash
# Download MySQL Installer from:
# https://dev.mysql.com/downloads/installer/

# Or using Chocolatey:
choco install mysql
```

#### Ubuntu/Debian:
```bash
sudo apt update
sudo apt install mysql-server
sudo mysql_secure_installation
```

#### macOS:
```bash
brew install mysql
brew services start mysql
```

---

### Step 2: Start MySQL Service

#### Windows:
```powershell
# Start MySQL service
net start MySQL80

# Check status
Get-Service MySQL80
```

#### Linux/macOS:
```bash
# Start service
sudo systemctl start mysql

# Enable on boot
sudo systemctl enable mysql
```

---

### Step 3: Create Database

#### Option A: Using MySQL Workbench
1. Open MySQL Workbench
2. Connect to your local MySQL server
3. Click on "File" → "Open SQL Script"
4. Navigate to `D:\SKAARVI-MarketPlace\DATABASE-SCHEMA.sql`
5. Click "Execute" (⚡ icon) to run the script

#### Option B: Using Command Line
```bash
# Login to MySQL
mysql -u root -p

# Create database and import schema
source D:/SKAARVI-MarketPlace/DATABASE-SCHEMA.sql

# Or using mysql command directly
mysql -u root -p < D:/SKAARVI-MarketPlace/DATABASE-SCHEMA.sql
```

#### Option C: Using PowerShell (from project root)
```powershell
# Navigate to project directory
cd D:\SKAARVI-MarketPlace

# Import schema (enter password when prompted)
Get-Content DATABASE-SCHEMA.sql | mysql -u root -p
```

---

### Step 4: Verify Database Creation

```sql
-- Login to MySQL
mysql -u root -p

-- Show databases
SHOW DATABASES;

-- Use the database
USE skaarvi_resell_db;

-- Check tables
SHOW TABLES;

-- You should see 40+ tables including:
-- users, manufacturers, resellers, customers, products, orders, etc.

-- Check a specific table structure
DESCRIBE users;

-- Check triggers
SHOW TRIGGERS;

-- Check views
SHOW FULL TABLES WHERE Table_type = 'VIEW';
```

---

### Step 5: Configure Database Credentials

The `.env.local` file has been updated with MySQL defaults. Update if needed:

```env
# Database Configuration (MySQL)
DB_HOST=localhost
DB_PORT=3306
DB_NAME=skaarvi_resell_db
DB_USER=root
DB_PASSWORD=your_mysql_password_here
DB_DIALECT=mysql
```

**⚠️ IMPORTANT:** Replace `your_mysql_password_here` with your actual MySQL root password.

---

### Step 6: Install MySQL Dependencies

```bash
# Navigate to project directory
cd D:\SKAARVI-MarketPlace\skaarvi-reseller

# MySQL driver is already installed, but if you need to reinstall:
npm install mysql2

# Or reinstall all dependencies:
npm install
```

---

### Step 7: Test Database Connection

```bash
# Start the development server
npm run dev
```

Check the console output. You should see:
```
✅ Database connection established successfully
```

If you see connection errors, verify:
1. MySQL service is running
2. Database credentials in `.env.local` are correct
3. Database `skaarvi_resell_db` exists
4. User has proper permissions

---

## 🔧 Troubleshooting

### Error: "Cannot connect to MySQL server"

**Solution:**
```bash
# Check if MySQL is running (Windows)
Get-Service MySQL80

# Start if not running
net start MySQL80

# Check if MySQL is running (Linux/macOS)
sudo systemctl status mysql

# Start if not running
sudo systemctl start mysql
```

---

### Error: "Access denied for user 'root'@'localhost'"

**Solution:**
```bash
# Reset MySQL root password
mysql -u root -p

# Or create new user with proper privileges
CREATE USER 'skaarvi'@'localhost' IDENTIFIED BY 'strong_password';
GRANT ALL PRIVILEGES ON skaarvi_resell_db.* TO 'skaarvi'@'localhost';
FLUSH PRIVILEGES;

# Update .env.local with new credentials
DB_USER=skaarvi
DB_PASSWORD=strong_password
```

---

### Error: "Unknown database 'skaarvi_resell_db'"

**Solution:**
```bash
# Create database manually
mysql -u root -p
CREATE DATABASE skaarvi_resell_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;

# Then import schema
mysql -u root -p skaarvi_resell_db < DATABASE-SCHEMA.sql
```

---

### Error: "Client does not support authentication protocol"

**Solution:**
```sql
-- Login to MySQL
mysql -u root -p

-- Change authentication method for root user
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'your_password';
FLUSH PRIVILEGES;
```

---

### Error: "ER_NOT_SUPPORTED_AUTH_MODE"

**Solution:**
```sql
-- Update user authentication
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'your_password';
FLUSH PRIVILEGES;
```

---

## 📊 Database Schema Overview

### Key Tables Created:

| Category | Tables | Count |
|----------|--------|-------|
| **User Management** | users, manufacturers, resellers, customers | 4 |
| **Authentication** | otp_verifications, refresh_tokens, token_blacklist | 3 |
| **Products** | categories, products, product_images, product_videos, product_pricing_history | 5 |
| **Orders** | orders, order_items, order_status_history | 3 |
| **Financial** | wallets, wallet_transactions, withdrawal_requests, commission_logs | 4 |
| **Analytics** | referral_clicks, product_views, analytics_events | 3 |
| **Communication** | notifications, email_logs, sms_logs | 3 |
| **System** | system_settings, commission_rates, banners | 3 |
| **Audit** | audit_logs, error_logs | 2 |

**Total: 30 tables** (expandable to 40+ with additional features)

### Key Features Implemented:

✅ **UUID Support** - All primary keys use CHAR(36) with UUID()  
✅ **JSON Columns** - For flexible data storage (specifications, addresses, etc.)  
✅ **Triggers** - Auto-update stock, create wallets, log status changes  
✅ **Views** - Pre-built analytics views for reporting  
✅ **Stored Procedures** - Cleanup procedures for maintenance  
✅ **Indexes** - Optimized for common queries  
✅ **Foreign Keys** - Referential integrity maintained  
✅ **Constraints** - CHECK, UNIQUE, and NOT NULL constraints  
✅ **Timestamps** - Automatic created_at, updated_at tracking  
✅ **Soft Deletes** - deleted_at columns for recoverable deletion  

---

## 🔐 Initial Data Seeded

The schema automatically creates:

1. **System Settings** - Platform configuration (fees, thresholds, etc.)
2. **Commission Rates** - For free, verified, and premium resellers
3. **Default Categories** - 8 main product categories

---

## 📈 Next Steps

After database setup is complete:

1. ✅ Database schema imported
2. ✅ MySQL connection configured
3. ⏳ **Create admin user** (optional)
4. ⏳ **Import sample data** (optional)
5. ⏳ **Configure scheduled cleanup jobs**
6. ⏳ **Set up database backups**
7. ⏳ **Run application** (`npm run dev`)

---

## 📝 Optional: Create Admin User

```sql
USE skaarvi_resell_db;

-- Insert admin user
INSERT INTO users (id, mobile, email, role, is_active, is_verified)
VALUES (UUID(), '+911234567890', 'admin@skaarvi.com', 'admin', 1, 1);
```

---

## 🔄 Optional: Setup Cleanup Jobs

To automatically clean expired data, enable the MySQL Event Scheduler:

```sql
-- Enable Event Scheduler
SET GLOBAL event_scheduler = ON;

-- Create daily cleanup event for OTPs
CREATE EVENT daily_otp_cleanup
ON SCHEDULE EVERY 1 DAY
DO CALL cleanup_expired_otps();

-- Create daily cleanup event for blacklisted tokens
CREATE EVENT daily_blacklist_cleanup
ON SCHEDULE EVERY 1 DAY
DO CALL cleanup_expired_blacklist();

-- Create weekly cleanup event for old analytics
CREATE EVENT weekly_analytics_cleanup
ON SCHEDULE EVERY 1 WEEK
DO CALL cleanup_old_analytics();

-- View scheduled events
SHOW EVENTS;
```

---

## 💾 Backup Recommendations

### Daily Backup Script:

```bash
#!/bin/bash
# backup-database.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="D:/SKAARVI-MarketPlace/backups"
DB_NAME="skaarvi_resell_db"

# Create backup directory if it doesn't exist
mkdir -p $BACKUP_DIR

# Create backup
mysqldump -u root -p$DB_PASSWORD $DB_NAME > "$BACKUP_DIR/${DB_NAME}_${DATE}.sql"

# Compress backup
gzip "$BACKUP_DIR/${DB_NAME}_${DATE}.sql"

# Delete backups older than 30 days
find $BACKUP_DIR -name "*.sql.gz" -mtime +30 -delete

echo "Backup completed: ${DB_NAME}_${DATE}.sql.gz"
```

---

## 📚 Useful MySQL Commands

```sql
-- Check MySQL version
SELECT VERSION();

-- Show database size
SELECT 
  table_schema AS 'Database',
  ROUND(SUM(data_length + index_length) / 1024 / 1024, 2) AS 'Size (MB)'
FROM information_schema.TABLES
WHERE table_schema = 'skaarvi_resell_db'
GROUP BY table_schema;

-- Show table sizes
SELECT 
  table_name AS 'Table',
  ROUND(((data_length + index_length) / 1024 / 1024), 2) AS 'Size (MB)'
FROM information_schema.TABLES
WHERE table_schema = 'skaarvi_resell_db'
ORDER BY (data_length + index_length) DESC;

-- Check table structure
DESCRIBE users;

-- Show table indexes
SHOW INDEX FROM users;

-- View table creation statement
SHOW CREATE TABLE users;

-- Check foreign key constraints
SELECT 
  CONSTRAINT_NAME,
  TABLE_NAME,
  REFERENCED_TABLE_NAME
FROM information_schema.KEY_COLUMN_USAGE
WHERE TABLE_SCHEMA = 'skaarvi_resell_db'
  AND REFERENCED_TABLE_NAME IS NOT NULL;
```

---

## ✅ Verification Checklist

- [ ] MySQL 8.0+ installed and running
- [ ] Database `skaarvi_resell_db` created
- [ ] All 30+ tables created successfully
- [ ] Triggers created (update_stock_on_order, auto_create_wallet, log_status_change)
- [ ] Views created (vw_reseller_performance, vw_product_performance, vw_order_revenue_breakdown)
- [ ] Stored procedures created (cleanup_expired_otps, cleanup_expired_blacklist, cleanup_old_analytics)
- [ ] Initial data seeded (8 categories, 3 commission rates, 8 system settings)
- [ ] `.env.local` configured with correct credentials
- [ ] Dependencies installed (`mysql2` package)
- [ ] Application connects successfully (`npm run dev`)
- [ ] No connection errors in console

---

## 🎉 Success!

If all steps completed successfully:

```bash
cd D:\SKAARVI-MarketPlace\skaarvi-reseller
npm run dev
```

Visit: **http://localhost:3000**

You should see the Skaarvi Manufacturer Panel login page with MySQL powering the backend! 🚀

---

## 📞 Support

For issues or questions:
- Check the troubleshooting section above
- Review MySQL error logs: `C:\ProgramData\MySQL\MySQL Server 8.0\Data\*.err`
- Verify all credentials in `.env.local`
- Ensure MySQL service is running

---

**Last Updated:** $(date)  
**MySQL Version Required:** 8.0+  
**Schema Version:** 1.0
