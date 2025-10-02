import "./globals.css"

import type { Meta, StoryObj } from "@storybook/react"

import { LanguageSelector } from "../components/common/language-selector"

const meta: Meta<typeof LanguageSelector> = {
  title: "Components/LanguageSelector",
  component: LanguageSelector,
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
          <span className="text-sm">Language:</span>
          <Story />
        </div>
      </div>
    ),
  ],
}
