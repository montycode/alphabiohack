import type { Meta, StoryObj } from "@storybook/react";

import { AvailabilityForm } from "../components/availability/availability-form";
import { AvailabilityPage } from "../components/availability/availability-page";

const meta: Meta<typeof AvailabilityForm> = {
  title: "Components/AvailabilityForm",
  component: AvailabilityForm,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    locationId: {
      control: "text",
      description: "ID de la ubicación",
    },
    locationName: {
      control: "text", 
      description: "Nombre de la ubicación",
    },
    loading: {
      control: "boolean",
      description: "Estado de carga",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    locationId: "loc_123",
    locationName: "Clínica Central",
    loading: false,
  },
};

export const Loading: Story = {
  args: {
    locationId: "loc_123",
    locationName: "Clínica Central",
    loading: true,
  },
};

export const WithLongLocationName: Story = {
  args: {
    locationId: "loc_456",
    locationName: "Centro Médico Especializado en Cardiología y Neurología",
    loading: false,
  },
};
