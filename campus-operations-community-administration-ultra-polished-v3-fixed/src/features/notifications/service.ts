import type {UserRole} from '../../core/types';
import {eventBus} from '../../core/events';
export type NotificationType = 'ACTIVITY'|'SCHEDULE'|'ANNOUNCEMENT'|'ACHIEVEMENT'|'INCIDENT'|'BUS'|'EMERGENCY'|'FORUM';
export interface Notification { id:string; userId:string; type:NotificationType; title:string; message:string; createdAt:string; read:boolean; path?:string; relatedId?:string; }
const KEY='campus-operations.notifications.v1';
const listeners=new Set<()=>void>();
export function list(userId:string,role?:UserRole){return read().filter(n=>n.userId===userId||Boolean(role&&n.userId===`role:${role}`)).sort((a,b)=>b.createdAt.localeCompare(a.createdAt));}
export function countUnread(userId:string,role?:UserRole){return list(userId,role).filter(n=>!n.read).length;}
function read():Notification[]{try{const raw=localStorage.getItem(KEY);return raw?JSON.parse(raw) as Notification[]:[];}catch{return[];}}
function write(items:Notification[]){localStorage.setItem(KEY,JSON.stringify(items));listeners.forEach(fn=>fn());}
export function notify(input:Omit<Notification,'id'|'read'|'createdAt'> & {createdAt?:string}){const item:Notification={...input,id:crypto.randomUUID(),read:false,createdAt:input.createdAt??new Date().toISOString()};write([item,...read()]);window.dispatchEvent(new CustomEvent('notification:created',{detail:item}));return item;}
export function markRead(id:string,userId:string,role?:UserRole){write(read().map(n=>n.id===id&&(n.userId===userId||Boolean(role&&n.userId===`role:${role}`))?{...n,read:true}:n));}
export function markAllRead(userId:string,role?:UserRole){write(read().map(n=>(n.userId===userId||Boolean(role&&n.userId===`role:${role}`))?{...n,read:true}:n));}
export function seed(){if(localStorage.getItem(KEY))return;const now=Date.now();const demo:Notification[]=[
{id:'ntf-1',userId:'usr_admin_001',type:'ANNOUNCEMENT',title:'Aviso urgente publicado',message:'Se publicó una alerta institucional para la comunidad.',createdAt:new Date(now-3600000).toISOString(),read:false,path:'/announcements'},
{id:'ntf-2',userId:'usr_admin_001',type:'ACHIEVEMENT',title:'Logro desbloqueado',message:'Completaste la primera semana.',createdAt:new Date(now-7200000).toISOString(),read:false,path:'/achievements'},
{id:'ntf-3',userId:'usr_admin_001',type:'FORUM',title:'Nueva respuesta en el foro',message:'Alguien respondió a una publicación.',createdAt:new Date(now-86400000).toISOString(),read:true,path:'/forum'}];write(demo);}
export function subscribe(fn:()=>void){listeners.add(fn);return()=>listeners.delete(fn);}
let bridgesReady=false;
export function connectSystemEvents(){if(bridgesReady)return;bridgesReady=true;eventBus.on('schedule:changed',()=>notify({userId:'usr_admin_001',type:'SCHEDULE',title:'Cambio de horario',message:'Se detectó un cambio en los horarios.',path:'/schedules'}));eventBus.on('transport:changed',()=>notify({userId:'usr_admin_001',type:'BUS',title:'Actualización de transporte',message:'Se actualizó información de transporte.',path:'/transport'}));eventBus.on('emergency:changed',()=>notify({userId:'usr_admin_001',type:'EMERGENCY',title:'Actualización de emergencia',message:'Se actualizó un aviso de emergencia.',path:'/emergencies'}));window.addEventListener('activity:created',()=>notify({userId:'usr_admin_001',type:'ACTIVITY',title:'Nueva actividad',message:'Se registró una nueva actividad.',path:'/calendar'}));}
connectSystemEvents();
