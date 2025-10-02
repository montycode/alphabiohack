import { Dropzone, DropzoneContent, DropzoneEmptyState } from '../components/ui/dropzone';
import type { Meta, StoryObj } from '@storybook/react';

import { useSupabaseUpload } from '../hooks/use-supabase-upload';

const DropzoneDemo = () => {
  const props = useSupabaseUpload({
    bucketName: 'test',
    path: 'test',
    allowedMimeTypes: ['image/*'],
    maxFiles: 2,
    maxFileSize: 1000 * 1000 * 10, // 10MB
  });

  return (
    <div className="w-[500px]">
      <Dropzone {...props}>
        <DropzoneEmptyState />
        <DropzoneContent />
      </Dropzone>
    </div>
  );
};

const meta: Meta<typeof DropzoneDemo> = {
  title: 'UI/Dropzone',
  component: DropzoneDemo,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const SingleFile: Story = {
  render: () => {
    const props = useSupabaseUpload({
      bucketName: 'test',
      path: 'single',
      allowedMimeTypes: ['image/*'],
      maxFiles: 1,
      maxFileSize: 1000 * 1000 * 5, // 5MB
    });

    return (
      <div className="w-[400px]">
        <Dropzone {...props}>
          <DropzoneEmptyState />
          <DropzoneContent />
        </Dropzone>
      </div>
    );
  },
};

export const MultipleFiles: Story = {
  render: () => {
    const props = useSupabaseUpload({
      bucketName: 'test',
      path: 'multiple',
      allowedMimeTypes: ['image/*', 'application/pdf'],
      maxFiles: 5,
      maxFileSize: 1000 * 1000 * 20, // 20MB
    });

    return (
      <div className="w-[600px]">
        <Dropzone {...props}>
          <DropzoneEmptyState />
          <DropzoneContent />
        </Dropzone>
      </div>
    );
  },
};
