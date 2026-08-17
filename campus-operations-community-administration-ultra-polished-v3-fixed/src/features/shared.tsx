
import type { ReactNode } from "react";
import type { UserRole, SearchProvider, WidgetDefinition } from "../../core/types";

export const allRoles: UserRole[] = ["ADMIN","TEACHER","STUDENT_FAMILY","STAFF"];
export const adminStaffTeacher: UserRole[] = ["ADMIN","TEACHER","STAFF"];
export function persist<T>(key:string, fallback:T): [T, (value:T)=>void] {
  const read=()=>{ try { const raw=localStorage.getItem(key); return raw?JSON.parse(raw) as T:fallback; } catch { return fallback; } };
  const value=read();
  return [value,(next)=>localStorage.setItem(key,JSON.stringify(next))];
}
export function Panel({children,title,action}:{children:ReactNode;title?:string;action?:ReactNode}){return <section className="card"><div className="split"><div>{title&&<h2 style={{marginTop:0}}>{title}</h2>}</div>{action}</div>{children}</section>}
export function Page({eyebrow,title,description,children}:{eyebrow:string;title:string;description:string;children:ReactNode}){return <><div className="section-header"><div><div className="eyebrow">{eyebrow}</div><h1>{title}</h1><p>{description}</p></div></div>{children}</>}
export function SearchFilter({value,onChange,placeholder="Buscar..."}:{value:string;onChange:(v:string)=>void;placeholder?:string}){return <div className="toolbar"><div className="search-box"><span aria-hidden="true">⌕</span><input value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} aria-label={placeholder}/></div></div>}
export function Empty({message}:{message:string}){return <div className="empty-state" role="status"><strong>Sin resultados</strong><p>{message}</p></div>}
export function FeatureWidget({title,value,detail}:{title:string;value:string;detail:string}){return <div className="widget"><strong>{value}</strong><span>{title}</span><small>{detail}</small></div>}
export function makeSearch(id:string,category:string,items:()=>Array<{id:string;title:string;description:string;path:string;keywords:string[]}>,roles:UserRole[]=allRoles):SearchProvider{return {id,search(q){return items().filter(x=>[x.title,x.description,...x.keywords].join(" ").toLowerCase().includes(q.toLowerCase())).map(x=>({...x,category,allowedRoles:roles,source:id}))}}}
export function makeWidget(id:string,title:string,order:number,render:()=>ReactNode,roles:UserRole[]=allRoles):WidgetDefinition{return {id,title,order,allowedRoles:roles,render:()=>render()}}
export function selectClassName(status:string){return `badge ${status.toLowerCase().includes('urgent')||status.toLowerCase().includes('critical')?'badge-danger':status.toLowerCase().includes('available')||status.toLowerCase().includes('completed')||status.toLowerCase().includes('approved')?'badge-success':'badge-neutral'}`}
