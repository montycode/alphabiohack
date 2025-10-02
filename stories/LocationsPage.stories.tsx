import type { Meta, StoryObj } from '@storybook/react';

import { LocationsPage } from '../components/locations';

const meta: Meta<typeof LocationsPage> = {
  title: 'Pages/LocationsPage',
  component: LocationsPage,
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      default: 'dark',
      values: [
        { name: 'dark', value: '#1a1a1a' },
        { name: 'light', value: '#ffffff' },
      ],
    },
  },
  tags: ['autodocs'],
  argTypes: {
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    className: '',
  },
};

export const WithCustomClass: Story = {
  args: {
    className: 'p-8',
  },
};
