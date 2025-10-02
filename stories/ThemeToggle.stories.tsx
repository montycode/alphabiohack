import "./globals.css"

import type { Meta, StoryObj } from "@storybook/react"

import { ThemeToggle } from "../components/common/theme-toggle"

const meta: Meta<typeof ThemeToggle> = {
  title: "Components/ThemeToggle",
  component: ThemeToggle,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const InHeader: Story = {
  decorators: [
    (Story) => (
      <div className="bg-background p-4 border rounded-lg">
        <div className="flex items-center justify-between">
          <span className="text-sm">Theme:</span>
          <Story />
        </div>
      </div>
    ),
  ],
}
