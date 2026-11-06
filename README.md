# CampusHub – Student Management Dashboard

A responsive student management dashboard built with **HTML, CSS and vanilla JavaScript**.

## Features
- Dashboard with live student/course totals and today's attendance summary.
- Course-wise attendance percentages and top 5 popular courses by enrolment.
- 100 fictional demo student records.
- Add, edit, delete, search and filter students.
- Mark students Present, Absent, Late or Not marked.
- Add and edit courses; prevent deletion while students are enrolled.
- Course enrolment counts update automatically.
- LocalStorage saves changes in the current browser.
- Responsive layout for desktop, tablet and mobile.

## Run locally
Open `index.html` in a modern browser. No installation or build step is required.

## Deploy on GitHub and Vercel
1. Create a **public** GitHub repository.
2. Upload the contents of this folder (`index.html`, `style.css`, `script.js`, `README.md`, `SUBMISSION_LINKS.txt`).
3. In Vercel, choose **Add New → Project** and import the GitHub repository.
4. Select **Other** as Framework Preset. Leave Build Command and Install Command empty; use `.` as Output Directory.
5. Click Deploy.

## Important demo note
The 100 student records are fictional sample data for demonstration. Attendance starts as **Not marked**. Course attendance percentages appear as records are marked for the current date.

This is a frontend-only academic demo. LocalStorage stores data in one browser on one device; it is not a shared backend database. Clearing browser storage can remove saved changes. Different visitors/devices will not share records.
