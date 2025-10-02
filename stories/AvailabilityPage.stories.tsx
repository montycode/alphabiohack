import type { Meta, StoryObj } from "@storybook/react";

import { AvailabilityPage } from "../components/availability/availability-page";

const meta: Meta<typeof AvailabilityPage> = {
  title: "Components/AvailabilityPage",
  component: AvailabilityPage,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const WithCustomClass: Story = {
  args: {},
  decorators: [
    (Story) => (
      <div className="p-6 bg-background">
        <Story />
      </div>
    ),
  ],
};
