## 🧠 Time Calculation Logic
The application distinguishes **two complementary views** of time spent on projects:
---
### 🧾 Declarable Time (to report to management)
- Corresponds to **the sum of all recorded time** on projects marked as **professional**.
- **Each pro project is counted separately**, even if multiple are active simultaneously.
- **No period merging**: the goal is to reflect all working hours to be declared.
#### Example:
- Project A (pro) active from 10am to 11am  
- Project B (pro) active from 10:30am to 11:30am  
→ **Declarable Time = 2h**
---
### 👨‍💻 Real Global Time (personal view)
- Corresponds to **actual time spent coding**, across all projects (pro and personal).
- When multiple projects are active in parallel, **the period is counted only once**.
- Represents **actual personal involvement**, without double-counting.
#### Example:
- Project A (pro) active from 2:00pm to 3:00pm  
- Project B (personal) active from 2:30pm to 3:30pm  
→ **Real Global Time = 1h30**
---
### 🎯 Usage
- `Declarable Time` → used for professional tracking and overtime declaration.  
- `Real Global Time` → used for personal work time analysis (self-assessment, productivity, work-life balance, etc.).