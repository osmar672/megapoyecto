"use client";

import { useState, type FormEvent } from "react";
import type { AttendanceRecord } from "../../../core/types/domain";
import { Button } from "../../../components/ui/Button";
import { FormField, SelectField } from "../../../components/ui/FormField";
import { useAuth } from "../../auth/context/AuthContext";
import { academicRepository } from "../services/academicRepository";
import styles from "./AcademicsPage.module.css";

const attendanceLabels: Record<AttendanceRecord["status"], string> = {
  PRESENT: "Presente",
  ABSENT: "Ausente",
  LATE: "Tardía",
  EXCUSED: "Justificada",
};

export function AcademicsPage() {
  const { user } = useAuth();
  const [, setVersion] = useState(0);
  const [gradeCourseId, setGradeCourseId] = useState("");
  const [gradeStudentId, setGradeStudentId] = useState("");
  const [period, setPeriod] = useState("II trimestre");
  const [score, setScore] = useState(""
  );
  const [maxScore, setMaxScore] = useState("100");
  const [comment, setComment] = useState("");
  const [attendanceCourseId, setAttendanceCourseId] = useState("");
  const [attendanceStudentId, setAttendanceStudentId] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [attendanceStatus, setAttendanceStatus] = useState<AttendanceRecord["status"]>("PRESENT");
  const [notes, setNotes] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const view = user ? academicRepository.getView(user) : null;
  if (!user || !view) return null;

  const canWrite = user.role === "ADMIN" || user.role === "TEACHER";
  const courseName = (id: string) => view.courses.find((course) => course.id === id)?.name ?? "Curso no disponible";
  const studentName = (id: string) => {
    const student = view.students.find((candidate) => candidate.id === id);
    return student ? `${student.firstName} ${student.lastName}` : "Estudiante no disponible";
  };
  const studentsForCourse = (courseId: string) => {
    const studentIds = new Set(view.enrollments.filter((enrollment) => enrollment.courseId === courseId).map((enrollment) => enrollment.studentId));
    return view.students.filter((student) => studentIds.has(student.id));
  };
  const percentages = view.grades.filter((grade) => grade.maxScore > 0).map((grade) => grade.score / grade.maxScore * 100);
  const average = percentages.length ? Math.round(percentages.reduce((total, value) => total + value, 0) / percentages.length) : null;
  const presentRecords = view.attendance.filter((record) => record.status === "PRESENT").length;
  const attendanceRate = view.attendance.length ? Math.round(presentRecords / view.attendance.length * 100) : null;

  const announce = (success: string) => {
    setVersion((current) => current + 1);
    setMessage(success);
    setError("");
  };

  const saveGrade = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      academicRepository.saveGrade(user, {
        courseId: gradeCourseId,
        studentId: gradeStudentId,
        period,
        score: Number(score),
        maxScore: Number(maxScore),
        comment,
      });
      setScore("");
      setComment("");
      announce("La calificación fue guardada. Si ya existía para ese periodo, se actualizó.");
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "No fue posible guardar la calificación.");
      setMessage("");
    }
  };

  const saveAttendance = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      academicRepository.saveAttendance(user, {
        courseId: attendanceCourseId,
        studentId: attendanceStudentId,
        date,
        status: attendanceStatus,
        notes,
      });
      setNotes("");
      announce("La asistencia fue guardada. Si ya existía para esa fecha, se actualizó.");
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "No fue posible guardar la asistencia.");
      setMessage("");
    }
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div><p>Seguimiento escolar</p><h1>Información académica</h1><span>{canWrite ? "Registra y consulta calificaciones y asistencia de tus cursos autorizados." : "Consulta el seguimiento del estudiante vinculado a tu perfil."}</span></div>
      </header>

      <section className={styles.summary} aria-label="Resumen académico">
        <article><span>Cursos visibles</span><strong>{view.courses.length}</strong><small>Según tu perfil institucional</small></article>
        <article><span>Promedio general</span><strong>{average === null ? "—" : `${average}%`}</strong><small>{view.grades.length} evaluaciones disponibles</small></article>
        <article><span>Asistencia presente</span><strong>{attendanceRate === null ? "—" : `${attendanceRate}%`}</strong><small>{view.attendance.length} registros disponibles</small></article>
      </section>

      {message && <div className={styles.success} role="status">{message}</div>}
      {error && <div className={styles.error} role="alert">{error}</div>}

      {view.courses.length === 0 ? (
        <section className={styles.empty}><strong>No hay cursos vinculados</strong><p>Administración debe asignar cursos y matrículas a este perfil.</p></section>
      ) : (
        <>
          {canWrite && (
            <section className={styles.forms} aria-label="Registro académico">
              <form onSubmit={saveGrade}>
                <div className={styles.formTitle}><p>Evaluación</p><h2>Registrar calificación</h2></div>
                <SelectField id="grade-course" label="Curso" required value={gradeCourseId} onChange={(event) => { setGradeCourseId(event.target.value); setGradeStudentId(""); }}><option value="">Selecciona un curso</option>{view.courses.map((course) => <option key={course.id} value={course.id}>{course.code} · {course.name}</option>)}</SelectField>
                <SelectField id="grade-student" label="Estudiante" required value={gradeStudentId} onChange={(event) => setGradeStudentId(event.target.value)} disabled={!gradeCourseId}><option value="">Selecciona un estudiante</option>{studentsForCourse(gradeCourseId).map((student) => <option key={student.id} value={student.id}>{student.firstName} {student.lastName}</option>)}</SelectField>
                <FormField id="grade-period" label="Periodo" required value={period} onChange={(event) => setPeriod(event.target.value)} />
                <div className={styles.twoColumns}><FormField id="grade-score" label="Puntaje" type="number" min="0" step="0.01" required value={score} onChange={(event) => setScore(event.target.value)} /><FormField id="grade-max" label="Puntaje máximo" type="number" min="1" step="0.01" required value={maxScore} onChange={(event) => setMaxScore(event.target.value)} /></div>
                <FormField id="grade-comment" label="Comentario (opcional)" value={comment} onChange={(event) => setComment(event.target.value)} />
                <Button type="submit">Guardar calificación</Button>
              </form>

              <form onSubmit={saveAttendance}>
                <div className={styles.formTitle}><p>Seguimiento diario</p><h2>Registrar asistencia</h2></div>
                <SelectField id="attendance-course" label="Curso" required value={attendanceCourseId} onChange={(event) => { setAttendanceCourseId(event.target.value); setAttendanceStudentId(""); }}><option value="">Selecciona un curso</option>{view.courses.map((course) => <option key={course.id} value={course.id}>{course.code} · {course.name}</option>)}</SelectField>
                <SelectField id="attendance-student" label="Estudiante" required value={attendanceStudentId} onChange={(event) => setAttendanceStudentId(event.target.value)} disabled={!attendanceCourseId}><option value="">Selecciona un estudiante</option>{studentsForCourse(attendanceCourseId).map((student) => <option key={student.id} value={student.id}>{student.firstName} {student.lastName}</option>)}</SelectField>
                <div className={styles.twoColumns}><FormField id="attendance-date" label="Fecha" type="date" required value={date} onChange={(event) => setDate(event.target.value)} /><SelectField id="attendance-status" label="Estado" value={attendanceStatus} onChange={(event) => setAttendanceStatus(event.target.value as AttendanceRecord["status"])}>{(Object.keys(attendanceLabels) as AttendanceRecord["status"][]).map((value) => <option key={value} value={value}>{attendanceLabels[value]}</option>)}</SelectField></div>
                <FormField id="attendance-notes" label="Observación (opcional)" value={notes} onChange={(event) => setNotes(event.target.value)} />
                <Button type="submit">Guardar asistencia</Button>
              </form>
            </section>
          )}

          <section className={styles.dataPanel}>
            <div className={styles.sectionTitle}><p>Resultados</p><h2>Calificaciones</h2></div>
            {view.grades.length === 0 ? <p className={styles.muted}>Todavía no hay calificaciones disponibles.</p> : <div className={styles.tableScroll}><table><thead><tr><th>Estudiante</th><th>Curso</th><th>Periodo</th><th>Resultado</th><th>Comentario</th></tr></thead><tbody>{view.grades.map((grade) => <tr key={grade.id}><td>{studentName(grade.studentId)}</td><td>{courseName(grade.courseId)}</td><td>{grade.period}</td><td><strong>{grade.score}/{grade.maxScore}</strong><span>{Math.round(grade.score / grade.maxScore * 100)}%</span></td><td>{grade.comment ?? "—"}</td></tr>)}</tbody></table></div>}
          </section>

          <section className={styles.dataPanel}>
            <div className={styles.sectionTitle}><p>Seguimiento</p><h2>Asistencia</h2></div>
            {view.attendance.length === 0 ? <p className={styles.muted}>Todavía no hay registros de asistencia.</p> : <div className={styles.tableScroll}><table><thead><tr><th>Fecha</th><th>Estudiante</th><th>Curso</th><th>Estado</th><th>Observación</th></tr></thead><tbody>{view.attendance.map((record) => <tr key={record.id}><td><time dateTime={record.date}>{new Intl.DateTimeFormat("es-CR", { dateStyle: "medium", timeZone: "UTC" }).format(new Date(`${record.date}T00:00:00Z`))}</time></td><td>{studentName(record.studentId)}</td><td>{courseName(record.courseId)}</td><td><span className={`${styles.attendanceBadge} ${styles[record.status.toLowerCase()]}`}>{attendanceLabels[record.status]}</span></td><td>{record.notes ?? "—"}</td></tr>)}</tbody></table></div>}
          </section>
        </>
      )}
    </div>
  );
}
