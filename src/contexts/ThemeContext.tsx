import React, { createContext, useContext, useState, useEffect } from 'react';

type ThemeContextValue = { theme: string; setTheme: (t:string)=>void };
const ThemeContext = createContext<ThemeContextValue>({ theme: 'futuristic', setTheme: ()=>{} });

export function ThemeProvider({ children }:{children:React.ReactNode}){
  const [theme, setTheme] = useState<string>(()=>localStorage.getItem('rptheme')||'futuristic');
  useEffect(()=>{ localStorage.setItem('rptheme', theme); document.documentElement.setAttribute('data-theme', theme); },[theme]);
  return <ThemeContext.Provider value={{theme,setTheme}}>{children}</ThemeContext.Provider>
}
export function useTheme(){ return useContext(ThemeContext); }
export default ThemeContext;
