import type {ButtonHTMLAttributes,InputHTMLAttributes,ReactNode} from 'react';
export function Button({variant='primary',children,...props}:{variant?:'primary'|'secondary'|'ghost'|'danger';children:ReactNode}&ButtonHTMLAttributes<HTMLButtonElement>){return <button className={`btn btn-${variant}`} {...props}>{children}</button>}
export function Input(props:InputHTMLAttributes<HTMLInputElement>){return <input className="input" {...props}/>}
export function Badge({children,tone='neutral'}:{children:ReactNode;tone?:'neutral'|'success'|'warning'|'danger'|'info'}){return <span className={`badge badge-${tone}`}>{children}</span>}
export function SectionHeader({eyebrow,title,description,action}:{eyebrow?:string;title:string;description?:string;action?:ReactNode}){return <div className="section-header"><div>{eyebrow&&<div className="eyebrow">{eyebrow}</div>}<h1>{title}</h1>{description&&<p>{description}</p>}</div>{action}</div>}
