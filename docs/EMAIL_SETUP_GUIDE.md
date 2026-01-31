# Email Configuration Guide

## For Gmail

### Step 1: Enable 2-Factor Authentication
1. Go to https://myaccount.google.com/security
2. Enable 2-Step Verification

### Step 2: Generate App Password
1. Go to https://myaccount.google.com/apppasswords
2. Select "Mail" and "Other (Custom name)"
3. Name it "MSME Automation"
4. Click "Generate"
5. Copy the 16-character password (e.g., "abcd efgh ijkl mnop")

### Step 3: Update .env File

Replace these lines in your `.env` file:

```bash
# Email Configuration
COMPANY_EMAIL=your_actual_email@gmail.com
EMAIL_PASSWORD=abcdefghijklmnop  # 16-char app password (no spaces)
COMPANY_NAME=Your Actual Company Name

# Gemini API (already configured)
GEMINI_API_KEY=AIzaSyCBYmzR1R1CwZauoHa7onLoSxPsEt-B88A
```

### Example:
```bash
COMPANY_EMAIL=mycompany@gmail.com
EMAIL_PASSWORD=xyzw1234abcd5678
COMPANY_NAME=Tech Solutions Inc
GEMINI_API_KEY=AIzaSyCBYmzR1R1CwZauoHa7onLoSxPsEt-B88A
```

## Testing Without Email

You can test the complete system without email setup using:

```bash
python ai_agents\demo_autonomous_system.py
```

This demo simulates the entire workflow without requiring email credentials.

## When You're Ready for Real Email

Once you've added real credentials to `.env`, you can run:

```python
from ai_agents.autonomous_system import AutonomousSystem

system = AutonomousSystem()
system.run_once()  # Process emails once
```

Or for continuous monitoring:

```python
system.run_continuous_loop(interval_minutes=10)
```
