# Test Email Examples for Autonomous System

Send these emails to **darshangirase18@gmail.com** to test the autonomous email-to-project system.

---

## 📧 Example 1: Mobile App Development (High Priority)

**To:** darshangirase18@gmail.com  
**Subject:** Need a mobile app for my business  

**Body:**
```
Hi,

I need a mobile app developed for my e-commerce business. 

Project Details:
- Budget: ₹80,000
- Deadline: 5 days from today
- Advance Payment: ₹40,000 (50% paid upfront)
- Requirements: Android and iOS app with payment gateway integration

Please let me know if you can help.

Thanks,
Rajesh Kumar
```

**Expected Priority:** HIGH (tight deadline + advance payment)

---

## 📧 Example 2: Website Development (Medium Priority)

**To:** darshangirase18@gmail.com  
**Subject:** Website development project  

**Body:**
```
Hello,

I'm looking for a professional website for my startup.

Details:
- Budget: ₹50,000
- Timeline: Need it in 15 days
- Advance: ₹10,000 ready to pay
- Type: Corporate website with CMS

Looking forward to your response.

Best regards,
Priya Sharma
```

**Expected Priority:** NORMAL (moderate deadline + some advance)

---

## 📧 Example 3: E-commerce Platform (Critical Priority)

**To:** darshangirase18@gmail.com  
**Subject:** URGENT: E-commerce platform needed  

**Body:**
```
Hi Team,

We need an e-commerce platform urgently!

Project Info:
- Budget: ₹150,000
- Deadline: 3 days (URGENT!)
- Advance Payment: ₹75,000 (50% advance ready)
- Requirements: Full e-commerce with inventory management

This is time-sensitive. Please confirm ASAP.

Regards,
Amit Patel
CEO, ShopNow
```

**Expected Priority:** CRITICAL (very tight deadline + high value + advance payment)

---

## 📧 Example 4: Simple Landing Page (Low Priority)

**To:** darshangirase18@gmail.com  
**Subject:** Landing page design  

**Body:**
```
Hi,

I need a simple landing page.

Details:
- Budget: ₹15,000
- Timeline: 30 days (no rush)
- Payment: After delivery
- Type: Single page website

Let me know your availability.

Thanks,
Neha Singh
```

**Expected Priority:** LOW (long deadline + low value + no advance)

---

## 📧 Example 5: Custom Software (High Priority)

**To:** darshangirase18@gmail.com  
**Subject:** Custom inventory management software  

**Body:**
```
Dear Team,

We require custom inventory management software.

Project Specifications:
- Budget: ₹200,000
- Deadline: 10 days
- Advance: ₹100,000 (50% upfront)
- Features: Real-time tracking, reporting, multi-user access

Please share your proposal.

Best,
Vikram Reddy
Operations Manager
```

**Expected Priority:** HIGH (good budget + reasonable deadline + advance)

---

## 🎯 How to Test

### Step 1: Send Email
1. Open your email client (Gmail, Outlook, etc.)
2. Copy one of the examples above
3. Send to: **darshangirase18@gmail.com**

### Step 2: Check Dashboard
1. Open: http://localhost:3001
2. Navigate to Service Startup Dashboard
3. Click **"Check Emails Now"** button

### Step 3: See Results
- Alert will show: "✅ Email check complete! Found X project email(s)"
- Email subject and sender will be displayed
- Statistics will update automatically

### Step 4: Verify Processing
The system will:
1. ✅ Detect the email as project-related
2. 🤖 Extract requirements (budget, deadline, advance)
3. ⚖️ Calculate priority score
4. 👥 Assign to team members
5. ✉️ Generate professional response (logged)

---

## 📊 Priority Calculation

The system uses this formula:

```
Priority Score = 
  (40% × Deadline Urgency) +
  (25% × Payment Status) +
  (15% × Project Value) +
  (10% × Client Importance) +
  (-10% × Team Overload Penalty)
```

**Priority Levels:**
- **CRITICAL:** Score ≥ 80 (urgent + high value + advance)
- **HIGH:** Score 60-79 (tight deadline or good payment)
- **NORMAL:** Score 40-59 (standard projects)
- **LOW:** Score < 40 (long deadline + low value)

---

## 🔍 What the AI Looks For

**Project Type Keywords:**
- mobile app, android, ios, application
- website, web development, portal
- e-commerce, online store, shopping
- software, system, platform
- design, UI/UX, graphics

**Budget Indicators:**
- ₹, rupees, INR, Rs
- Numbers followed by "thousand", "lakh", "K"
- "budget:", "cost:", "price:"

**Deadline Indicators:**
- "urgent", "ASAP", "immediately"
- "X days", "X weeks", "by [date]"
- "deadline:", "timeline:", "delivery:"

**Payment Indicators:**
- "advance", "upfront", "50%"
- "paid", "ready to pay"
- "payment terms"

---

## ✅ Expected Behavior

After sending any of these emails:

1. **Email Detection:** System identifies it as project-related
2. **AI Extraction:** Gemini extracts all details
3. **Priority Scoring:** Calculates score based on urgency/value
4. **Team Assignment:** Assigns to Alice, Bob, Charlie, or Diana based on skills
5. **Response Generation:** Creates professional email (currently logged, not sent)
6. **Dashboard Update:** Statistics increment

---

## 🎨 Try Different Scenarios

**Test High Priority:**
- Short deadline (< 7 days)
- High budget (> ₹50,000)
- Advance payment mentioned

**Test Low Priority:**
- Long deadline (> 20 days)
- Low budget (< ₹20,000)
- No advance payment

**Test Edge Cases:**
- No budget mentioned
- No deadline mentioned
- Vague requirements

---

## 📝 Notes

- The system monitors the inbox every 10 minutes automatically
- Manual check via "Check Emails Now" is instant
- All emails are stored to prevent duplicates
- AI uses Gemini 2.5 Flash Lite for extraction
- Priority calculation is deterministic and explainable

---

**Send any of these emails and watch the autonomous system work its magic!** ✨
