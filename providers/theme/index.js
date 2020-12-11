import { createContext } from "react"
import useStickyState from "../../hooks/useStickyState"
import styles from "./Theme.module.css"

const ThemeContext = createContext({})
// headerFont: font1, font2, font3
// textFont: font1, font2, font3
// primaryColor: color1, color2, color3
// body
// div
// button, buttonHover
// linkColor

const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useStickyState("theme", "dark")
    // const [primaryColor, setPrimaryColor] = useStickyState(theme, "green")
    // const headerFont
    // const textFont

    const toggleTheme = () => {
        const newTheme = theme === "light" ? "dark" : "light"
        setTheme(newTheme)
    }

    const bodyClassNames = [styles.darkBody, styles.textFont0]
    const sectionClassNames = [styles.darkSection]
    const buttonClassNames = [styles.darkBody, styles.darkButton, styles.greenBgOnHover]
    const fontHeaderClassNames = [styles.headerFont0]

    return (
        <ThemeContext.Provider
            value={{
                theme,
                toggleTheme,
                bodyClassNames,
                sectionClassNames,
                buttonClassNames,
                fontHeaderClassNames,
            }}
        >
            {children}
        </ThemeContext.Provider>
    )
}

export { ThemeProvider, ThemeContext }
