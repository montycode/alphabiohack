import type { Meta, StoryObj } from "@storybook/react"

import { SpecialtiesSection } from "../components/sections/specialties"

const meta: Meta<typeof SpecialtiesSection> = {
  title: "Components/SpecialtiesSection",
  component: SpecialtiesSection,
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
