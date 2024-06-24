import React from 'react';
import { Modal, Form, Input, Select, Button } from 'antd';
import axios from 'axios';
import { message } from 'antd';
import { Task } from './TasksList';

interface TaskModalProps {
  visible: boolean;
  onCancel: () => void;
  onFinish: (values: any) => void;
  initialValues?: Partial<Task>;
  isEdit: boolean;
}

const TaskModal: React.FC<TaskModalProps> = ({ visible, onCancel, onFinish, initialValues, isEdit }) => {
  const [form] = Form.useForm();

  React.useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
    } else {
      form.resetFields();
    }
  }, [form, initialValues]);

  const handleFormFinish = async (values: any) => {
    try {
      await onFinish(values);
      form.resetFields();
    } catch (error) {
      console.error('Failed to add/edit task:', error);
      message.error('Failed to add/edit task');
    }
  };

  return (
    <Modal
      title={isEdit ? 'Edit Task' : 'Add New Task'}
      open={visible}
      onCancel={onCancel}
      footer={null}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFormFinish}
      >
        <Form.Item name="title" label="Title" rules={[{ required: true, message: 'Please enter title' }]}>
          <Input />
        </Form.Item>
        <Form.Item name="description" label="Description" rules={[{ required: true, message: 'Please enter description' }]}>
          <Input />
        </Form.Item>
        <Form.Item name="status" label="Status" rules={[{ required: true, message: 'Please select status' }]}>
          <Select>
            <Select.Option value="ongoing">On going</Select.Option>
            <Select.Option value="completed">Completed</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item name="completion_date" label="Completion Date" rules={[{ required: true, message: 'Please select completion date' }]}>
          <Input type="date" />
        </Form.Item>
        <Form.Item>
          <Button onClick={onCancel}>Cancel</Button>
          <Button type="primary" htmlType="submit" style={{ marginLeft: 8 }}>Save</Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default TaskModal;
