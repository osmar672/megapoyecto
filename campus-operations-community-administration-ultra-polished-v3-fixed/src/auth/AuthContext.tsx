import {createContext,useContext,useState,type ReactNode} from 'react';
import type {User} from '../core/types';
const demoUser:User={id:'usr_admin_001',firstName:'Elena',lastName:'Mora',role:'ADMIN',email:'admin@campus.local',isActive:true};
const C=createContext<{user:User;logout:()=>void}>({user:demoUser,logout:()=>undefined});
export function AuthProvider({children}:{children:ReactNode}){const[user,setUser]=useState(demoUser);return <C.Provider value={{user,logout:()=>setUser(demoUser)}}>{children}</C.Provider>}
export const useAuth=()=>useContext(C);
