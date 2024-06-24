import React from 'react';
import { Modal, Form, Input, Select, Button } from 'antd';

interface Member {
  id: number;
  firstname: string;
  lastname: string;
  gender: string;
  birthday: string;
  salary: number;
}

interface MemberFormProps {
  visible: boolean;
  onCancel: () => void;
  onFinish: (values: any) => void;
  initialValues?: Partial<Member>;
}

const MemberForm: React.FC<MemberFormProps> = ({ visible, onCancel, onFinish, initialValues }) => {
  const [form] = Form.useForm();

  return (
    <Modal
      title={initialValues ? 'Edit Member' : 'Add New Member'}
      open={visible}
      onCancel={onCancel}
      footer={null}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
          ...initialValues,
          gender: initialValues?.gender || 'Choose gender..', 
        }}
      >
        <Form.Item name="firstname" label="First Name" rules={[{ required: true, message: 'Please enter first name' }]}>
          <Input />
        </Form.Item>
        <Form.Item name="lastname" label="Last Name" rules={[{ required: true, message: 'Please enter last name' }]}>
          <Input />
        </Form.Item>
        <Form.Item name="gender" label="Gender" rules={[{ required: true, message: 'Please select gender' }]}>
          <Select>
            <Select.Option value="male">Male</Select.Option>
            <Select.Option value="female">Female</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item name="birthday" label="Birthday" rules={[{ required: true, message: 'Please select birthday' }]}>
          <Input type="date" />
        </Form.Item>
        <Form.Item name="salary" label="Salary" rules={[{ required: true, message: 'Please enter salary' }]}>
          <Input type="number" />
        </Form.Item>
        <Form.Item>
          <Button onClick={onCancel}>Cancel</Button>
          <Button type="primary" htmlType="submit" style={{ marginLeft: 8 }}>Save</Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default MemberForm;