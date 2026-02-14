import { useTheme } from "../../components/components-internetShop/useTheme"

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme()

  return (
    <button onClick={toggleTheme} title="Сменить тему">
      {theme === 'light' ? '🌙' : '☀️'}
    </button>
  )
}
