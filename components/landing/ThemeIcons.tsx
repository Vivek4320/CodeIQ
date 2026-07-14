import { Moon, Bot, Gamepad2, Sparkles, Waves, Shield, Sun } from "lucide-react";
import type { ThemeKey } from "./theme";

export const themeIcons: Record<ThemeKey, React.ComponentType<{ size?: number; strokeWidth?: number; style?: React.CSSProperties }>> = {
  midnight: Moon,
  cyberpunk: Bot,
  retro: Gamepad2,
  neonNights: Sparkles,
  ocean: Waves,
  hacker: Shield,
  lightmode: Sun,
};
