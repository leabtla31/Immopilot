import type { Preview } from "@storybook/nextjs-vite";
import { MotionConfig } from "framer-motion";
import { ThemeProvider } from "next-themes";

import { TooltipProvider } from "../src/components/ui/tooltip";
import { inter } from "../src/styles/fonts";

import "../src/styles/globals.css";

const preview: Preview = {
  parameters: {
    layout: "centered",
    controls: { expanded: true, matchers: { color: /(background|color)$/i } },
    backgrounds: { disable: true },
    a11y: { test: "error" },
    nextjs: { appDirectory: true },
  },
  globalTypes: {
    theme: {
      description: "Thème",
      toolbar: {
        title: "Thème",
        icon: "mirror",
        items: [
          { value: "light", title: "Clair" },
          { value: "dark", title: "Sombre" },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: { theme: "light" },
  decorators: [
    (Story, context) => {
      const theme = context.globals.theme === "dark" ? "dark" : "light";
      return (
        <ThemeProvider attribute="class" forcedTheme={theme}>
          <MotionConfig reducedMotion="user">
            <TooltipProvider>
              <div className={`${inter.variable} bg-background p-10 font-sans text-foreground`}>
                <Story />
              </div>
            </TooltipProvider>
          </MotionConfig>
        </ThemeProvider>
      );
    },
  ],
};

export default preview;
