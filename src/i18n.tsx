import { createContext, useContext, useState, type ReactNode } from 'react'
import { DICT, type Dict, type Lang } from './data/i18n'

const LangContext = createContext<{
  lang: Lang
  setLang: (l: Lang) => void
  t: Dict
}>({ lang: 'en', setLang: () => {}, t: DICT.en })

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(
    () => (localStorage.getItem('lang') as Lang) || 'en',
  )
  const setLang = (l: Lang) => {
    setLangState(l)
    localStorage.setItem('lang', l)
  }
  return (
    <LangContext.Provider value={{ lang, setLang, t: DICT[lang] }}>
      {children}
    </LangContext.Provider>
  )
}

export function useLang() {
  return useContext(LangContext)
}
