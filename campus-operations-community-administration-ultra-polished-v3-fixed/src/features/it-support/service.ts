import { demoData } from "./data";
const key="campusOperations.itSupport.v1";
export function list(){try{const raw=localStorage.getItem(key);return raw?JSON.parse(raw):demoData;}catch{return demoData;}}
export function seed(){if(!localStorage.getItem(key))localStorage.setItem(key,JSON.stringify(demoData));}
export function save<T>(items:T[]){localStorage.setItem(key,JSON.stringify(items));}
