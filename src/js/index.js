(() => {
  "use strict";

  const KEYS = {
    users:"schoolIntranet.v1.users", credentials:"schoolIntranet.v1.credentials",
    students:"schoolIntranet.v1.students", courses:"schoolIntranet.v1.courses",
    enrollments:"schoolIntranet.v1.enrollments", grades:"schoolIntranet.v1.grades",
    attendance:"schoolIntranet.v1.attendance", announcements:"schoolIntranet.v1.announcements",
    session:"schoolIntranet.v1.session"
  };

  const seed = {
    users:[
      {id:"usr_admin_001",firstName:"Admin",lastName:"Sistema",email:"admin@escuela.test",role:"ADMIN",isActive:true,createdAt:new Date().toISOString(),updatedAt:new Date().toISOString()},
      {id:"usr_teacher_001",firstName:"Laura",lastName:"Docente",email:"docente@escuela.test",role:"TEACHER",isActive:true,createdAt:new Date().toISOString(),updatedAt:new Date().toISOString()},
      {id:"usr_family_001",firstName:"Carlos",lastName:"Familia",email:"familia@escuela.test",role:"STUDENT_FAMILY",relatedStudentId:"stu_001",isActive:true,createdAt:new Date().toISOString(),updatedAt:new Date().toISOString()}
    ],
    credentials:[
      {userId:"usr_admin_001",passwordSalt:"demo",passwordHash:"admin123"},
      {userId:"usr_teacher_001",passwordSalt:"demo",passwordHash:"docente123"},
      {userId:"usr_family_001",passwordSalt:"demo",passwordHash:"familia123"}
    ],
    students:[
      {id:"stu_001",institutionalCode:"EST-001",firstName:"Ana",lastName:"García",gradeLevel:"7",section:"A",isActive:true},
      {id:"stu_002",institutionalCode:"EST-002",firstName:"Luis",lastName:"Mora",gradeLevel:"7",section:"A",isActive:true}
    ],
    courses:[
      {id:"course_001",code:"MAT-7A",name:"Matemáticas",teacherUserId:"usr_teacher_001",gradeLevel:"7",section:"A",isActive:true},
      {id:"course_002",code:"ESP-7A",name:"Español",teacherUserId:"usr_teacher_001",gradeLevel:"7",section:"A",isActive:true}
    ],
    enrollments:[
      {id:"enr_001",studentId:"stu_001",courseId:"course_001",academicYear:"2026",status:"ACTIVE"},
      {id:"enr_002",studentId:"stu_001",courseId:"course_002",academicYear:"2026",status:"ACTIVE"},
      {id:"enr_003",studentId:"stu_002",courseId:"course_001",academicYear:"2026",status:"ACTIVE"}
    ],
    grades:[
      {id:"grade_001",studentId:"stu_001",courseId:"course_001",period:"P1",score:88,maxScore:100,comment:"Buen desempeño",recordedBy:"usr_teacher_001",createdAt:new Date().toISOString(),updatedAt:new Date().toISOString()},
      {id:"grade_002",studentId:"stu_002",courseId:"course_001",period:"P1",score:76,maxScore:100,comment:"Puede mejorar",recordedBy:"usr_teacher_001",createdAt:new Date().toISOString(),updatedAt:new Date().toISOString()}
    ],
    attendance:[
      {id:"att_001",studentId:"stu_001",courseId:"course_001",date:"2026-08-12",status:"PRESENT",notes:"",recordedBy:"usr_teacher_001",createdAt:new Date().toISOString(),updatedAt:new Date().toISOString()}
    ],
    announcements:[
      {id:"ann_001",title:"Bienvenida al ciclo lectivo",body:"La institución da la bienvenida a toda la comunidad educativa.",audience:"ALL",status:"PUBLISHED",authorUserId:"usr_admin_001",publishedAt:new Date().toISOString(),createdAt:new Date().toISOString(),updatedAt:new Date().toISOString()}
    ]
  };

  const get = k => JSON.parse(localStorage.getItem(k) || "null");
  const set = (k,v) => localStorage.setItem(k,JSON.stringify(v));
  const uid = p => `${p}_${crypto.randomUUID()}`;
  const now = () => new Date().toISOString();
  const currentUser = () => {
    const s = get(KEYS.session);
    return s ? get(KEYS.users)?.find(u => u.id === s.userId) : null;
  };

  function seedData(){
    Object.entries(seed).forEach(([name,value]) => {
      const key=KEYS[name];
      if(get(key)===null) set(key,value);
    });
  }

  function esc(v=""){return String(v).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));}
  function toast(msg){const e=document.createElement("div");e.className="toast";e.textContent=msg;document.body.appendChild(e);setTimeout(()=>e.remove(),2500)}
  function roleName(r){return ({ADMIN:"Administración",TEACHER:"Docente",STUDENT_FAMILY:"Estudiante/Familia"})[r]||r}
  function layout(active,title,content){
    const u=currentUser();
    const nav=[
      ["dashboard","Inicio","fa-home",["ADMIN","TEACHER","STUDENT_FAMILY"]],
      ["grades","Calificaciones","fa-graduation-cap",["ADMIN","TEACHER","STUDENT_FAMILY"]],
      ["attendance","Asistencia","fa-calendar-check",["ADMIN","TEACHER","STUDENT_FAMILY"]],
      ["announcements","Comunicados","fa-bullhorn",["ADMIN","TEACHER","STUDENT_FAMILY"]],
      ["users","Usuarios","fa-users",["ADMIN"]]
    ];
    return `<div class="app-shell"><aside class="sidebar">
      <div class="brand"><div class="brand-mark">IE</div><div><h1 style="color:#fff">Intranet Escolar</h1><p>Gestión institucional</p></div></div>
      <nav class="nav">${nav.filter(n=>n[3].includes(u.role)).map(n=>`<button class="${active===n[0]?"active":""}" data-nav="${n[0]}"><i class="fas ${n[2]}"></i> ${n[1]}</button>`).join("")}</nav>
      <div class="sidebar-footer"><button class="nav" style="width:100%;border:0;background:transparent;color:#aebbd0;text-align:left;padding:11px 12px" id="logout">Cerrar sesión</button></div>
    </aside><main class="main"><header class="topbar"><strong>${esc(title)}</strong><div class="user-chip"><div class="avatar">${esc(u.firstName[0])}</div><div>${esc(u.firstName+" "+u.lastName)}<br><small style="color:#68758a">${roleName(u.role)}</small></div></div></header><section class="content">${content}</section></main></div>`;
  }

  function login(){
    document.getElementById("app").innerHTML=`<div class="login-wrap"><div class="login-card">
      <div class="brand"><div class="brand-mark">IE</div><div><h1>Intranet Escolar</h1><p>Sistema de gestión interna</p></div></div>
      <form id="loginForm"><div class="field"><label>Correo o ID</label><input id="loginId" autocomplete="username" required></div>
      <div class="field"><label>Contraseña</label><div class="password"><input id="loginPass" type="password" autocomplete="current-password" required><button type="button" id="togglePass">Mostrar</button></div></div>
      <div class="row between"><label class="check"><input type="checkbox" id="remember"> Recordarme</label><button class="btn btn-secondary" type="button" id="recover">Recuperar acceso</button></div>
      <button class="btn btn-primary" style="width:100%;margin-top:18px">Iniciar sesión</button><div id="loginError" class="error"></div></form>
      <div class="demo"><strong>Accesos de prueba</strong><br>admin@escuela.test / admin123<br>docente@escuela.test / docente123<br>familia@escuela.test / familia123</div>
    </div></div>`;
    document.getElementById("loginForm").onsubmit=e=>{
      e.preventDefault(); const id=document.getElementById("loginId").value.trim(), pass=document.getElementById("loginPass").value;
      const u=(get(KEYS.users)||[]).find(x=>x.email.toLowerCase()===id.toLowerCase()||x.id===id);
      const c=u&&(get(KEYS.credentials)||[]).find(x=>x.userId===u.id);
      if(!u||!c||c.passwordHash!==pass||!u.isActive){document.getElementById("loginError").textContent="Credenciales incorrectas o usuario inactivo.";return}
      set(KEYS.session,{userId:u.id,role:u.role,issuedAt:now(),expiresAt:new Date(Date.now()+8*3600000).toISOString()});
      render("dashboard");
    };
    document.getElementById("togglePass").onclick=()=>{const p=document.getElementById("loginPass");p.type=p.type==="password"?"text":"password"};
    document.getElementById("recover").onclick=()=>toast("En el prototipo, solicita el restablecimiento al administrador.");
  }

  function dashboard(){
    const u=currentUser(), students=get(KEYS.students)||[], courses=get(KEYS.courses)||[], grades=get(KEYS.grades)||[], at=get(KEYS.attendance)||[];
    const visibleGrades=u.role==="STUDENT_FAMILY"?grades.filter(g=>g.studentId===u.relatedStudentId):u.role==="TEACHER"?grades.filter(g=>courses.some(c=>c.id===g.courseId&&c.teacherUserId===u.id)):grades;
    const visibleAtt=u.role==="STUDENT_FAMILY"?at.filter(a=>a.studentId===u.relatedStudentId):u.role==="TEACHER"?at.filter(a=>courses.some(c=>c.id===a.courseId&&c.teacherUserId===u.id)):at;
    document.getElementById("app").innerHTML=layout("dashboard","Panel principal",`
      <div class="page-head"><div><h2>Resumen</h2><p>Bienvenido, ${esc(u.firstName)}. Consulta los módulos disponibles para tu rol.</p></div></div>
      <div class="cards"><div class="card"><div class="stat-label">Estudiantes</div><div class="stat-value">${students.length}</div></div>
      <div class="card"><div class="stat-label">Cursos</div><div class="stat-value">${courses.length}</div></div>
      <div class="card"><div class="stat-label">Calificaciones visibles</div><div class="stat-value">${visibleGrades.length}</div></div>
      <div class="card"><div class="stat-label">Asistencias visibles</div><div class="stat-value">${visibleAtt.length}</div></div></div>
      <div class="panel"><h3>Acciones rápidas</h3><div class="row"><button class="btn btn-primary" data-nav="grades">Ver calificaciones</button><button class="btn btn-secondary" data-nav="attendance">Ver asistencia</button><button class="btn btn-secondary" data-nav="announcements">Ver comunicados</button></div></div>`);
  }

  function grades(){
    const u=currentUser(), courses=get(KEYS.courses)||[], students=get(KEYS.students)||[], enroll=get(KEYS.enrollments)||[], grades=get(KEYS.grades)||[];
    const allowedCourses=u.role==="TEACHER"?courses.filter(c=>c.teacherUserId===u.id):courses;
    const allowedStudents=u.role==="STUDENT_FAMILY"?students.filter(s=>s.id===u.relatedStudentId):students;
    const visible=grades.filter(g=>allowedCourses.some(c=>c.id===g.courseId)&&allowedStudents.some(s=>s.id===g.studentId));
    const canEdit=u.role!=="STUDENT_FAMILY";
    const content=`<div class="page-head"><div><h2>Calificaciones</h2><p>Períodos disponibles: P1, P2 y P3.</p></div>${canEdit?'<button class="btn btn-primary" id="newGrade">Registrar calificación</button>':''}</div>
      <div class="panel"><div class="filters"><div class="field"><label>Curso</label><select id="gCourse"><option value="">Todos</option>${allowedCourses.map(c=>`<option value="${c.id}">${esc(c.name)}</option>`).join("")}</select></div>
      <div class="field"><label>Estudiante</label><select id="gStudent"><option value="">Todos</option>${allowedStudents.map(s=>`<option value="${s.id}">${esc(s.firstName+" "+s.lastName)}</option>`).join("")}</select></div>
      <div class="field"><label>Período</label><select id="gPeriod"><option value="">Todos</option><option>P1</option><option>P2</option><option>P3</option></select></div></div></div>
      <div class="panel"><div class="table-wrap"><table><thead><tr><th>Estudiante</th><th>Curso</th><th>Período</th><th>Nota</th><th>Estado</th>${canEdit?"<th>Acciones</th>":""}</tr></thead><tbody id="gradesBody"></tbody></table></div></div>`;
    document.getElementById("app").innerHTML=layout("grades","Calificaciones",content);
    const draw=()=>{const fc=document.getElementById("gCourse").value,fs=document.getElementById("gStudent").value,fp=document.getElementById("gPeriod").value;
      const rows=visible.filter(g=>(!fc||g.courseId===fc)&&(!fs||g.studentId===fs)&&(!fp||g.period===fp));
      document.getElementById("gradesBody").innerHTML=rows.length?rows.map(g=>{const s=students.find(x=>x.id===g.studentId),c=courses.find(x=>x.id===g.courseId),pct=g.score/g.maxScore*100;return `<tr><td>${esc(s?.firstName+" "+s?.lastName)}</td><td>${esc(c?.name)}</td><td>${g.period}</td><td>${g.score}/${g.maxScore}</td><td><span class="badge ${pct>=70?"badge-green":"badge-red"}">${pct.toFixed(0)}%</span></td>${canEdit?`<td><button class="btn btn-secondary edit-grade" data-id="${g.id}">Editar</button></td>`:""}</tr>`}).join(""):`<tr><td colspan="${canEdit?6:5}" class="empty">No hay calificaciones para los filtros seleccionados.</td></tr>`;
      document.querySelectorAll(".edit-grade").forEach(b=>b.onclick=()=>gradeModal(b.dataset.id));
    };
    ["gCourse","gStudent","gPeriod"].forEach(id=>document.getElementById(id).onchange=draw);draw();
    if(canEdit)document.getElementById("newGrade").onclick=()=>gradeModal();
  }

  function gradeModal(id){
    const u=currentUser(), courses=get(KEYS.courses)||[], students=get(KEYS.students)||[], enroll=get(KEYS.enrollments)||[], grades=get(KEYS.grades)||[];
    const allowedCourses=u.role==="TEACHER"?courses.filter(c=>c.teacherUserId===u.id):courses;
    const allowedStudents=u.role==="STUDENT_FAMILY"?students.filter(s=>s.id===u.relatedStudentId):students;
    const g=grades.find(x=>x.id===id);
    document.body.insertAdjacentHTML("beforeend",`<div class="modal-backdrop" id="modal"><div class="modal"><div class="modal-head"><h3>${g?"Editar":"Registrar"} calificación</h3><button class="close" id="close">×</button></div>
      <form id="gradeForm"><div class="form-grid"><div class="field"><label>Curso</label><select id="course" required>${allowedCourses.map(c=>`<option value="${c.id}" ${g?.courseId===c.id?"selected":""}>${esc(c.name)}</option>`).join("")}</select></div>
      <div class="field"><label>Estudiante</label><select id="student" required>${allowedStudents.map(s=>`<option value="${s.id}" ${g?.studentId===s.id?"selected":""}>${esc(s.firstName+" "+s.lastName)}</option>`).join("")}</select></div>
      <div class="field"><label>Período</label><select id="period" required><option ${g?.period==="P1"?"selected":""}>P1</option><option ${g?.period==="P2"?"selected":""}>P2</option><option ${g?.period==="P3"?"selected":""}>P3</option></select></div>
      <div class="field"><label>Nota</label><input id="score" type="number" min="0" required value="${g?.score??""}"></div>
      <div class="field"><label>Nota máxima</label><input id="maxScore" type="number" min="1" required value="${g?.maxScore??100}"></div>
      <div class="field full"><label>Comentario</label><textarea id="comment">${esc(g?.comment||"")}</textarea></div></div><div class="row" style="justify-content:flex-end"><button type="button" class="btn btn-secondary" id="cancel">Cancelar</button><button class="btn btn-primary">Guardar</button></div><div id="formError" class="error"></div></form></div></div>`);
    const close=()=>document.getElementById("modal")?.remove();document.getElementById("close").onclick=close;document.getElementById("cancel").onclick=close;
    document.getElementById("gradeForm").onsubmit=e=>{e.preventDefault();const courseId=course.value,studentId=student.value,score=Number(document.getElementById("score").value),maxScore=Number(document.getElementById("maxScore").value);
      const validEnroll=enroll.some(x=>x.courseId===courseId&&x.studentId===studentId&&x.status==="ACTIVE");if(!validEnroll){formError.textContent="El estudiante no está matriculado en el curso.";return}
      if(score<0||score>maxScore){formError.textContent="La calificación debe estar entre 0 y la nota máxima.";return}
      const list=get(KEYS.grades)||[], t=now();if(g){const old=list.find(x=>x.id===g.id);Object.assign(old,{courseId,studentId,period:period.value,score,maxScore,comment:comment.value,recordedBy:u.id,updatedAt:t});}else list.push({id:uid("grade"),courseId,studentId,period:period.value,score,maxScore,comment:comment.value,recordedBy:u.id,createdAt:t,updatedAt:t});set(KEYS.grades,list);close();grades();toast("Calificación guardada correctamente.");
    };
  }

  function attendance(){
    const u=currentUser(), courses=get(KEYS.courses)||[], students=get(KEYS.students)||[], enroll=get(KEYS.enrollments)||[], records=get(KEYS.attendance)||[];
    const allowedCourses=u.role==="TEACHER"?courses.filter(c=>c.teacherUserId===u.id):courses;
    const allowedStudents=u.role==="STUDENT_FAMILY"?students.filter(s=>s.id===u.relatedStudentId):students;
    const visible=records.filter(a=>allowedCourses.some(c=>c.id===a.courseId)&&allowedStudents.some(s=>s.id===a.studentId));
    const canEdit=u.role!=="STUDENT_FAMILY";
    const content=`<div class="page-head"><div><h2>Asistencia</h2><p>Estados: presente, ausente, tardía y justificada.</p></div>${canEdit?'<button class="btn btn-primary" id="newAttendance">Registrar asistencia</button>':''}</div>
      <div class="panel"><div class="cards" style="margin:0"><div class="card"><div class="stat-label">Registros</div><div class="stat-value">${visible.length}</div></div><div class="card"><div class="stat-label">Presentes</div><div class="stat-value">${visible.filter(x=>x.status==="PRESENT").length}</div></div><div class="card"><div class="stat-label">Ausentes</div><div class="stat-value">${visible.filter(x=>x.status==="ABSENT").length}</div></div><div class="card"><div class="stat-label">Tardías/justificadas</div><div class="stat-value">${visible.filter(x=>["LATE","EXCUSED"].includes(x.status)).length}</div></div></div></div>
      <div class="panel"><div class="table-wrap"><table><thead><tr><th>Estudiante</th><th>Curso</th><th>Fecha</th><th>Estado</th>${canEdit?"<th>Acciones</th>":""}</tr></thead><tbody>${visible.length?visible.map(a=>{const s=students.find(x=>x.id===a.studentId),c=courses.find(x=>x.id===a.courseId);return `<tr><td>${esc(s?.firstName+" "+s?.lastName)}</td><td>${esc(c?.name)}</td><td>${a.date}</td><td><span class="badge ${a.status==="PRESENT"?"badge-green":a.status==="ABSENT"?"badge-red":"badge-yellow"}">${({PRESENT:"Presente",ABSENT:"Ausente",LATE:"Tardía",EXCUSED:"Justificada"})[a.status]}</span></td>${canEdit?`<td><button class="btn btn-secondary edit-att" data-id="${a.id}">Editar</button></td>`:""}</tr>`}).join(""):`<tr><td colspan="${canEdit?5:4}" class="empty">No hay registros de asistencia.</td></tr>"}</tbody></table></div></div>`;
    document.getElementById("app").innerHTML=layout("attendance","Asistencia",content);
    if(canEdit){document.getElementById("newAttendance").onclick=()=>attendanceModal();document.querySelectorAll(".edit-att").forEach(b=>b.onclick=()=>attendanceModal(b.dataset.id))}
  }

  function attendanceModal(id){
    const u=currentUser(),courses=get(KEYS.courses)||[],students=get(KEYS.students)||[],enroll=get(KEYS.enrollments)||[],records=get(KEYS.attendance)||[],r=records.find(x=>x.id===id);
    const allowedCourses=u.role==="TEACHER"?courses.filter(c=>c.teacherUserId===u.id):courses,allowedStudents=u.role==="STUDENT_FAMILY"?students.filter(s=>s.id===u.relatedStudentId):students;
    document.body.insertAdjacentHTML("beforeend",`<div class="modal-backdrop" id="modal"><div class="modal"><div class="modal-head"><h3>${r?"Editar":"Registrar"} asistencia</h3><button class="close" id="close">×</button></div><form id="attForm"><div class="form-grid">
    <div class="field"><label>Curso</label><select id="course" required>${allowedCourses.map(c=>`<option value="${c.id}" ${r?.courseId===c.id?"selected":""}>${esc(c.name)}</option>`).join("")}</select></div>
    <div class="field"><label>Estudiante</label><select id="student" required>${allowedStudents.map(s=>`<option value="${s.id}" ${r?.studentId===s.id?"selected":""}>${esc(s.firstName+" "+s.lastName)}</option>`).join("")}</select></div>
    <div class="field"><label>Fecha</label><input id="date" type="date" required value="${r?.date||new Date().toISOString().slice(0,10)}"></div>
    <div class="field"><label>Estado</label><select id="status"><option value="PRESENT">Presente</option><option value="ABSENT">Ausente</option><option value="LATE">Tardía</option><option value="EXCUSED">Justificada</option></select></div>
    <div class="field full"><label>Notas</label><textarea id="notes">${esc(r?.notes||"")}</textarea></div></div><div class="row" style="justify-content:flex-end"><button type="button" class="btn btn-secondary" id="cancel">Cancelar</button><button class="btn btn-primary">Guardar</button></div><div id="formError" class="error"></div></form></div></div>`);
    if(r)status.value=r.status;const close=()=>document.getElementById("modal")?.remove();document.getElementById("close").onclick=close;document.getElementById("cancel").onclick=close;
    document.getElementById("attForm").onsubmit=e=>{e.preventDefault();const courseId=course.value,studentId=student.value,date=document.getElementById("date").value; if(!enroll.some(x=>x.courseId===courseId&&x.studentId===studentId&&x.status==="ACTIVE")){formError.textContent="El estudiante no está matriculado en el curso.";return}
      const list=get(KEYS.attendance)||[], existing=list.find(x=>x.studentId===studentId&&x.courseId===courseId&&x.date===date);if(existing&&(!r||existing.id!==r.id)){formError.textContent="Ya existe asistencia para ese estudiante, curso y fecha.";return}
      const t=now();if(r)Object.assign(r,{courseId,studentId,date,status:status.value,notes:notes.value,recordedBy:u.id,updatedAt:t});else list.push({id:uid("att"),courseId,studentId,date,status:status.value,notes:notes.value,recordedBy:u.id,createdAt:t,updatedAt:t});set(KEYS.attendance,list);close();attendance();toast("Asistencia guardada correctamente.");
    };
  }

  function announcements(){
    const u=currentUser(), list=get(KEYS.announcements)||[];
    document.getElementById("app").innerHTML=layout("announcements","Comunicados",`<div class="page-head"><div><h2>Comunicados</h2><p>Avisos institucionales disponibles para tu rol.</p></div>${u.role==="ADMIN"?'<button class="btn btn-primary" id="newAnn">Nuevo comunicado</button>':''}</div>
    <div>${list.filter(a=>a.status==="PUBLISHED"&&["ALL",u.role].includes(a.audience)).map(a=>`<article class="panel"><div class="row between"><h3>${esc(a.title)}</h3><span class="badge badge-green">Publicado</span></div><p style="color:#68758a;line-height:1.7">${esc(a.body)}</p><small style="color:#68758a">${new Date(a.publishedAt||a.createdAt).toLocaleString("es-CR")}</small></article>`).join("")||'<div class="panel empty">No hay comunicados publicados.</div>'}</div>`);
    if(u.role==="ADMIN")document.getElementById("newAnn").onclick=()=>annModal();
  }

  function annModal(){
    document.body.insertAdjacentHTML("beforeend",`<div class="modal-backdrop" id="modal"><div class="modal"><div class="modal-head"><h3>Nuevo comunicado</h3><button class="close" id="close">×</button></div><form id="annForm"><div class="field"><label>Título</label><input id="title" required></div><div class="field"><label>Contenido</label><textarea id="body" rows="5" required></textarea></div><div class="field"><label>Audiencia</label><select id="audience"><option value="ALL">Toda la comunidad</option><option value="TEACHER">Docentes</option><option value="STUDENT_FAMILY">Estudiantes/Familias</option></select></div><div class="row" style="justify-content:flex-end"><button type="button" class="btn btn-secondary" id="cancel">Cancelar</button><button class="btn btn-primary">Publicar</button></div></form></div></div>`);
    const close=()=>document.getElementById("modal")?.remove();close.onclick=null;document.getElementById("close").onclick=close;document.getElementById("cancel").onclick=close;
    document.getElementById("annForm").onsubmit=e=>{e.preventDefault();const t=now(),a=get(KEYS.announcements)||[];a.unshift({id:uid("ann"),title:title.value,body:body.value,audience:audience.value,status:"PUBLISHED",authorUserId:currentUser().id,publishedAt:t,createdAt:t,updatedAt:t});set(KEYS.announcements,a);close();announcements();toast("Comunicado publicado.")};
  }

  function users(){
    const list=get(KEYS.users)||[];document.getElementById("app").innerHTML=layout("users","Usuarios",`<div class="page-head"><div><h2>Usuarios</h2><p>Alta, baja lógica y edición de usuarios.</p></div><button class="btn btn-primary" id="newUser">Nuevo usuario</button></div>
    <div class="panel"><div class="table-wrap"><table><thead><tr><th>Nombre</th><th>Correo</th><th>Rol</th><th>Estado</th><th>Acción</th></tr></thead><tbody>${list.map(u=>`<tr><td>${esc(u.firstName+" "+u.lastName)}</td><td>${esc(u.email)}</td><td>${roleName(u.role)}</td><td><span class="badge ${u.isActive?"badge-green":"badge-red"}">${u.isActive?"Activo":"Inactivo"}</span></td><td><button class="btn ${u.isActive?"btn-danger":"btn-success"} toggle-user data-id="${u.id}">${u.isActive?"Desactivar":"Activar"}</button></td></tr>`).join("")}</tbody></table></div></div>`);
    document.getElementById("newUser").onclick=()=>userModal();document.querySelectorAll(".toggle-user").forEach(b=>b.onclick=()=>{const arr=get(KEYS.users)||[],x=arr.find(u=>u.id===b.dataset.id);x.isActive=!x.isActive;x.updatedAt=now();set(KEYS.users,arr);users();toast("Estado del usuario actualizado.")});
  }
  function userModal(){
    document.body.insertAdjacentHTML("beforeend",`<div class="modal-backdrop" id="modal"><div class="modal"><div class="modal-head"><h3>Nuevo usuario</h3><button class="close" id="close">×</button></div><form id="userForm"><div class="form-grid"><div class="field"><label>Nombre</label><input id="first" required></div><div class="field"><label>Apellido</label><input id="last" required></div><div class="field"><label>Correo</label><input id="email" type="email" required></div><div class="field"><label>Rol</label><select id="role"><option value="ADMIN">Administración</option><option value="TEACHER">Docente</option><option value="STUDENT_FAMILY">Estudiante/Familia</option></select></div><div class="field full"><label>Contraseña inicial</label><input id="password" required minlength="6"></div></div><div class="row" style="justify-content:flex-end"><button type="button" class="btn btn-secondary" id="cancel">Cancelar</button><button class="btn btn-primary">Crear</button></div></form></div></div>`);
    const close=()=>document.getElementById("modal")?.remove();document.getElementById("close").onclick=close;document.getElementById("cancel").onclick=close;
    document.getElementById("userForm").onsubmit=e=>{e.preventDefault();const arr=get(KEYS.users)||[],creds=get(KEYS.credentials)||[];if(arr.some(u=>u.email.toLowerCase()===email.value.toLowerCase())){toast("El correo ya está registrado.");return}const id=uid("usr"),t=now();arr.push({id,firstName:first.value,lastName:last.value,email:email.value,role:role.value,isActive:true,createdAt:t,updatedAt:t});creds.push({userId:id,passwordSalt:"demo",passwordHash:password.value});set(KEYS.users,arr);set(KEYS.credentials,creds);close();users();toast("Usuario creado.")};
  }

  function render(page){
    if(!currentUser()){login();return}
    if(page==="dashboard")dashboard();else if(page==="grades")grades();else if(page==="attendance")attendance();else if(page==="announcements")announcements();else if(page==="users"&&currentUser().role==="ADMIN")users();else dashboard();
    document.querySelectorAll("[data-nav]").forEach(b=>b.onclick=()=>render(b.dataset.nav));
    const logout=document.getElementById("logout");if(logout)logout.onclick=()=>{localStorage.removeItem(KEYS.session);login()};
  }
  seedData(); render("dashboard");
})();