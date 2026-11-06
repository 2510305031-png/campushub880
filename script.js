const todayKey = new Date().toLocaleDateString('en-CA');
const names = ["Aarav Sharma","Ananya Verma","Vivaan Gupta","Diya Singh","Aditya Kumar","Ishita Patel","Arjun Mehta","Saanvi Joshi","Reyansh Yadav","Aadhya Mishra","Krishna Rao","Myra Kapoor","Kabir Malhotra","Pari Chauhan","Rohan Das","Kiara Nair","Dhruv Bansal","Navya Jain","Ishaan Khanna","Sara Ali","Atharv Saini","Riya Thakur","Dev Agarwal","Meera Iyer","Yash Arora","Anika Roy","Shaurya Gill","Tanya Saxena","Manav Reddy","Avni Kulkarni","Harsh Vardhan","Prisha Menon","Kartik Rana","Aanya Bhatia","Samar Khan","Mahi Desai","Rudra Pandey","Nisha Goyal","Aarohi Bose","Veer Choudhary","Om Prakash","Pihu Sood","Lakshya Tiwari","Kavya Shetty","Parth Dubey","Aditi Rawat","Neil Thomas","Simran Kaur","Ritvik Jain","Tara Sen","Aryan Malik","Jhanvi Arora","Siddharth Rao","Muskan Sharma","Amanpreet Singh","Shreya Nair","Raghav Batra","Nandini Gupta","Pranav Joshi","Ira Kapoor","Kunal Sethi","Palak Yadav","Rishabh Verma","Sia Mehta","Abhinav Das","Tanvi Mishra","Mohit Saini","Esha Khanna","Anshul Roy","Vanya Patel","Gaurav Kumar","Diya Malhotra","Nakul Bansal","Ritika Jain","Sahil Chauhan","Aarush Gill","Sakshi Reddy","Vihaan Arora","Ayesha Khan","Madhav Iyer","Ishani Bose","Jayant Thakur","Rhea Kulkarni","Chirag Rana","Sneha Bhatia","Prateek Sood","Anvi Menon","Nitin Agarwal","Shivani Rawat","Keshav Pandey","Mira Thomas","Rajat Malik","Kritika Sen","Abhay Tiwari","Rashmi Shetty","Varun Dubey","Payal Saxena","Samarjeet Kaur","Apoorva Goyal","Rohan Khurana"];
const initialCourses = [
 {id:"c1",name:"Computer Science",code:"CSE",description:"Core computing, programming, algorithms and software development."},
 {id:"c2",name:"Artificial Intelligence & ML",code:"AIML",description:"Machine learning, intelligent systems and practical AI applications."},
 {id:"c3",name:"Data Science",code:"DS",description:"Data analysis, statistics, visualisation and data-driven decisions."},
 {id:"c4",name:"Business Administration",code:"BBA",description:"Management, business strategy, marketing and entrepreneurship."},
 {id:"c5",name:"Computer Applications",code:"BCA",description:"Application development, databases and computer fundamentals."},
 {id:"c6",name:"Commerce",code:"BCOM",description:"Accounting, finance, business law and commerce fundamentals."},
 {id:"c7",name:"Mechanical Engineering",code:"ME",description:"Engineering design, manufacturing and mechanical systems."},
 {id:"c8",name:"Electronics & Communication",code:"ECE",description:"Electronics, communication systems and embedded technology."}
];
const load = (key, fallback) => { try { const x=JSON.parse(localStorage.getItem(key)); return x ?? fallback; } catch { return fallback; } };
let courses = load("campushub_courses_v2", initialCourses);
let students = load("campushub_students_v2", null);
if (!Array.isArray(students) || students.length < 100) {
  const courseIds = courses.map(c=>c.id);
  students = names.map((name,i)=>({id:"s"+(i+1),studentId:"STU"+String(101+i),name,courseId:courseIds[i%courseIds.length],year:(i%4+1)+" "+(i%4===0?"st":i%4===1?"nd":i%4===2?"rd":"th")+" Year",email:name.toLowerCase().replace(/\s+/g,".")+"@campus.edu"}));
  localStorage.setItem("campushub_students_v2",JSON.stringify(students));
}
let attendance = load("campushub_attendance_v2",{});
function save(){localStorage.setItem("campushub_students_v2",JSON.stringify(students));localStorage.setItem("campushub_courses_v2",JSON.stringify(courses));localStorage.setItem("campushub_attendance_v2",JSON.stringify(attendance));}
const $ = id => document.getElementById(id);
const safe = value => String(value??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const courseName = id => courses.find(c=>c.id===id)?.name || "Unassigned";
const courseCode = id => courses.find(c=>c.id===id)?.code || "—";
const todayAttendance = () => attendance[todayKey] || {};
const initials = name => name.split(/\s+/).slice(0,2).map(x=>x[0]).join("").toUpperCase();
function toast(msg){$("toast").textContent=msg;$("toast").classList.add("show");setTimeout(()=>$("toast").classList.remove("show"),2300)}
function nav(page){document.querySelectorAll(".page").forEach(p=>p.classList.remove("active"));$(page+"Page").classList.add("active");document.querySelectorAll(".nav-link").forEach(b=>b.classList.toggle("active",b.dataset.page===page));$("pageTitle").textContent=page[0].toUpperCase()+page.slice(1);$("sidebar").classList.remove("open");renderAll()}
function options(select,selected=""){select.innerHTML=courses.map(c=>`<option value="${safe(c.id)}" ${c.id===selected?"selected":""}>${safe(c.name)} (${safe(c.code)})</option>`).join("")}
function populateFilters(){const html='<option value="all">All courses</option>'+courses.map(c=>`<option value="${safe(c.id)}">${safe(c.name)}</option>`).join("");$("courseFilter").innerHTML=html;$("attendanceCourseFilter").innerHTML=html;options($("studentCourse"))}
function renderDashboard(){
 const att=todayAttendance(), vals=Object.values(att), marked=vals.filter(v=>["Present","Absent","Late"].includes(v)).length,present=vals.filter(v=>v==="Present").length;
 $("totalStudents").textContent=students.length;$("totalCourses").textContent=courses.length;$("presentToday").textContent=present;$("overallRate").textContent=marked?Math.round(present/marked*100)+"%":"—";
 $("courseAttendance").innerHTML=courses.map(c=>{const group=students.filter(s=>s.courseId===c.id),done=group.filter(s=>att[s.id]),p=group.filter(s=>att[s.id]==="Present").length,rate=done.length?Math.round(p/done.length*100):0;return `<div><div class="attendance-course-top"><strong>${safe(c.name)}</strong><span>${done.length?rate+"%":"Not marked"} · ${p}/${done.length} marked present</span></div><div class="progress"><span style="width:${rate}%"></span></div></div>`}).join("")||'<div class="empty-state">Add a course to see attendance.</div>';
 const ranked=[...courses].map(c=>({...c,count:students.filter(s=>s.courseId===c.id).length})).sort((a,b)=>b.count-a.count).slice(0,5);
 $("popularCourses").innerHTML=ranked.map((c,i)=>`<div class="popular-item"><div class="rank">${String(i+1).padStart(2,"0")}</div><div class="popular-info"><strong>${safe(c.name)}</strong><small>${safe(c.code)}</small></div><div class="popular-count">${c.count} students</div></div>`).join("")||'<div class="empty-state">No courses yet.</div>';
 $("recentStudents").innerHTML=[...students].slice(-5).reverse().map(s=>`<tr><td><div class="student-cell"><div class="student-avatar">${safe(initials(s.name))}</div><div><strong>${safe(s.name)}</strong><small>${safe(s.email)}</small></div></div></td><td>${safe(courseName(s.courseId))}</td><td>${safe(s.year)}</td><td><span class="status ${att[s.id]?att[s.id].toLowerCase():"unmarked"}">${safe(att[s.id]||"Not marked")}</span></td></tr>`).join("");
}
function renderStudents(){
 const q=$("studentSearch").value.toLowerCase(),f=$("courseFilter").value;
 const rows=students.filter(s=>(f==="all"||s.courseId===f)&&[s.name,s.studentId,s.email].some(v=>v.toLowerCase().includes(q)));
 $("studentsTable").innerHTML=rows.map(s=>`<tr><td><div class="student-cell"><div class="student-avatar">${safe(initials(s.name))}</div><div><strong>${safe(s.name)}</strong><small>${safe(s.email)}</small></div></div></td><td>${safe(s.studentId)}</td><td>${safe(courseName(s.courseId))}</td><td>${safe(s.year)}</td><td>${safe(s.email)}</td><td><button class="action-btn" data-edit-student="${safe(s.id)}">Edit</button><button class="action-btn delete" data-delete-student="${safe(s.id)}">Delete</button></td></tr>`).join("")||'<tr><td colspan="6" class="empty-state">No students found.</td></tr>';
 $("studentCount").textContent=`Showing ${rows.length} of ${students.length} students`;
}
function renderAttendance(){
 const att=todayAttendance(),counts={Present:0,Absent:0,Late:0,unmarked:0};students.forEach(s=>{const v=att[s.id];if(counts[v]!==undefined)counts[v]++;else counts.unmarked++});
 $("attPresent").textContent=counts.Present;$("attAbsent").textContent=counts.Absent;$("attLate").textContent=counts.Late;$("attUnmarked").textContent=counts.unmarked;
 const q=$("attendanceSearch").value.toLowerCase(),f=$("attendanceCourseFilter").value,sf=$("attendanceStatusFilter").value;
 const rows=students.filter(s=>s.name.toLowerCase().includes(q)||s.studentId.toLowerCase().includes(q)).filter(s=>f==="all"||s.courseId===f).filter(s=>sf==="all"||(att[s.id]||"Not marked")===sf);
 $("attendanceTable").innerHTML=rows.map(s=>{const v=att[s.id]||"Not marked";return `<tr><td><div class="student-cell"><div class="student-avatar">${safe(initials(s.name))}</div><strong>${safe(s.name)}</strong></div></td><td>${safe(s.studentId)}</td><td>${safe(courseName(s.courseId))}</td><td><select class="attendance-select" data-attendance="${safe(s.id)}"><option ${v==="Not marked"?"selected":""}>Not marked</option><option ${v==="Present"?"selected":""}>Present</option><option ${v==="Absent"?"selected":""}>Absent</option><option ${v==="Late"?"selected":""}>Late</option></select></td></tr>`}).join("")||'<tr><td colspan="4" class="empty-state">No students found.</td></tr>';
 $("attendanceCount").textContent=`Showing ${rows.length} of ${students.length} students`;
}
function renderCourses(){
 $("courseSummary").innerHTML=`<div class="mini-stat"><span>Total courses</span><strong>${courses.length}</strong></div><div class="mini-stat"><span>Enrolled students</span><strong>${students.length}</strong></div><div class="mini-stat"><span>Average class size</span><strong>${courses.length?Math.round(students.length/courses.length):0}</strong></div>`;
 $("courseGrid").innerHTML=courses.map(c=>{const count=students.filter(s=>s.courseId===c.id).length;return `<article class="course-card"><span class="course-code">${safe(c.code)}</span><h3>${safe(c.name)}</h3><p>${safe(c.description||"Course information will be updated soon.")}</p><div class="course-meta"><span>Enrolled students</span><strong>${count}</strong></div><div class="course-actions"><button class="action-btn" data-edit-course="${safe(c.id)}">Edit course</button><button class="action-btn delete" data-delete-course="${safe(c.id)}">Delete</button></div></article>`}).join("")||'<div class="panel empty-state">No courses yet. Add your first course.</div>';
}
function renderAll(){populateFilters();renderDashboard();renderStudents();renderAttendance();renderCourses()}
function openModal(id){$(id).classList.add("show")}
function closeModal(id){$(id).classList.remove("show")}
function resetStudentForm(){ $("studentForm").reset();$("editStudentId").value="";$("studentModalTitle").textContent="Add student";$("studentId").disabled=false;options($("studentCourse")); }
function resetCourseForm(){ $("courseForm").reset();$("editCourseId").value="";$("courseModalTitle").textContent="Add course";$("courseCode").disabled=false; }
function addStudent(){resetStudentForm();openModal("studentModal")}
function addCourse(){resetCourseForm();openModal("courseModal")}
$("studentForm").addEventListener("submit",e=>{e.preventDefault();const id=$("editStudentId").value,studentId=$("studentId").value.trim(),name=$("studentName").value.trim(),email=$("studentEmail").value.trim();if(students.some(s=>s.studentId.toLowerCase()===studentId.toLowerCase()&&s.id!==id)){toast("That student ID already exists.");return}const record={id:id||"s"+Date.now(),studentId,name,email,year:$("studentYear").value,courseId:$("studentCourse").value};if(id)students=students.map(s=>s.id===id?record:s);else students.push(record);save();closeModal("studentModal");renderAll();toast(id?"Student updated":"Student added")});
$("courseForm").addEventListener("submit",e=>{e.preventDefault();const id=$("editCourseId").value,code=$("courseCode").value.trim().toUpperCase();if(courses.some(c=>c.code.toLowerCase()===code.toLowerCase()&&c.id!==id)){toast("That course code already exists.");return}const record={id:id||"c"+Date.now(),name:$("courseName").value.trim(),code,description:$("courseDescription").value.trim()};if(id)courses=courses.map(c=>c.id===id?record:c);else courses.push(record);save();closeModal("courseModal");renderAll();toast(id?"Course updated":"Course added")});
document.addEventListener("click",e=>{
 const editS=e.target.closest("[data-edit-student]");if(editS){const s=students.find(x=>x.id===editS.dataset.editStudent);if(!s)return;resetStudentForm();$("editStudentId").value=s.id;$("studentModalTitle").textContent="Edit student";$("studentName").value=s.name;$("studentId").value=s.studentId;$("studentId").disabled=true;$("studentYear").value=s.year;$("studentEmail").value=s.email;options($("studentCourse"),s.courseId);openModal("studentModal")}
 const delS=e.target.closest("[data-delete-student]");if(delS){const s=students.find(x=>x.id===delS.dataset.deleteStudent);if(s&&confirm(`Delete ${s.name}?`)){students=students.filter(x=>x.id!==s.id);Object.values(attendance).forEach(day=>delete day[s.id]);save();renderAll();toast("Student deleted")}}
 const editC=e.target.closest("[data-edit-course]");if(editC){const c=courses.find(x=>x.id===editC.dataset.editCourse);if(!c)return;resetCourseForm();$("editCourseId").value=c.id;$("courseModalTitle").textContent="Edit course";$("courseName").value=c.name;$("courseCode").value=c.code;$("courseCode").disabled=true;$("courseDescription").value=c.description;openModal("courseModal")}
 const delC=e.target.closest("[data-delete-course]");if(delC){const c=courses.find(x=>x.id===delC.dataset.deleteCourse);if(c){if(students.some(s=>s.courseId===c.id)){toast("Move enrolled students before deleting this course.");return}if(confirm(`Delete ${c.name}?`)){courses=courses.filter(x=>x.id!==c.id);save();renderAll();toast("Course deleted")}}}
 const close=e.target.closest("[data-close]");if(close)closeModal(close.dataset.close);
 const go=e.target.closest("[data-go]");if(go)nav(go.dataset.go);
});
document.addEventListener("change",e=>{if(e.target.matches("[data-attendance]")){attendance[todayKey]=attendance[todayKey]||{};attendance[todayKey][e.target.dataset.attendance]=e.target.value==="Not marked"?"":e.target.value;save();renderAll()}});
["studentSearch","courseFilter"].forEach(id=>$(id).addEventListener(id==="studentSearch"?"input":"change",renderStudents));
["attendanceSearch","attendanceCourseFilter","attendanceStatusFilter"].forEach(id=>$(id).addEventListener(id==="attendanceSearch"?"input":"change",renderAttendance));
document.querySelectorAll(".nav-link").forEach(b=>b.addEventListener("click",()=>nav(b.dataset.page)));
$("addStudentBtn").addEventListener("click",addStudent);$("dashAddStudent").addEventListener("click",()=>{nav("students");addStudent()});$("addCourseBtn").addEventListener("click",addCourse);
$("mobileMenu").addEventListener("click",()=>$("sidebar").classList.toggle("open"));
$("todayLabel").textContent=new Date().toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"});
$("attendanceDate").textContent=new Date().toLocaleDateString("en-IN",{weekday:"short",day:"numeric",month:"short",year:"numeric"});
renderAll();