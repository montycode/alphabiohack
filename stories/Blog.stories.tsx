import "./globals.css"

import type { Meta, StoryObj } from "@storybook/react"

import { BlogSection } from "../components/sections/blog"

const meta: Meta<typeof BlogSection> = {
  title: "Components/BlogSection",
  component: BlogSection,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Mobile: Story = {
  parameters: {
    viewport: {
      defaultViewport: "mobile1",
    },
  },
}
