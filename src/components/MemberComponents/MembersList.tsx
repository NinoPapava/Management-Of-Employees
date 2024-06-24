import React, { useState, useEffect }  from 'react'
import axios from 'axios';
import { Table, Button, Modal, Form, Input, Select, Popconfirm, message } from 'antd';
import membersColumn from '../../columns/membersColumn.json';

interface Member {
  id: number;
  firstname: string;
  lastname: string;
  gender: string;
  birthday: string;
  salary: number;
}


const MembersList = () => {

  const [members, setMembers] = useState<Member[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingMemberId, setEditingMemberId] = useState<number | null>(null);
  const [form] = Form.useForm();

  const [firstNameFilter, setFirstNameFilter] = useState<string>('');
  const [lastNameFilter, setLastNameFilter] = useState<string>('');
  const [genderFilter, setGenderFilter] = useState<string | undefined>();

  useEffect(() => {
    fetchMembers();
  }, [firstNameFilter, lastNameFilter, genderFilter]);

  const fetchMembers = async () => {
    try {
      const response = await axios.get<Member[]>('https://x8ki-letl-twmt.n7.xano.io/api:tSDGfQun/members');
      let filteredMembers = response.data;

      if (firstNameFilter) {
        filteredMembers = filteredMembers.filter(member => member.firstname.toLowerCase().includes(firstNameFilter.toLowerCase()));
      }
      if (lastNameFilter) {
        filteredMembers = filteredMembers.filter(member => member.lastname.toLowerCase().includes(lastNameFilter.toLowerCase()));
      }
      if (genderFilter) {
        filteredMembers = filteredMembers.filter(member => member.gender === genderFilter);
      }

      setMembers(filteredMembers);
    } catch (error) {
      console.error('Error fetching members:', error);
    }
  };

  const handleFilterChange = (filterType: string, value: string | undefined) => {
    switch (filterType) {
      case 'firstName':
        setFirstNameFilter(value || '');
        break;
      case 'lastName':
        setLastNameFilter(value || '');
        break;
      case 'gender':
        setGenderFilter(value);
        break;
      default:
        break;
    }
  };


  const showModal = (member?: Member) => {
    if (member) {
      setEditingMemberId(member.id); 
      form.setFieldsValue({
        firstname: member.firstname,
        lastname: member.lastname,
        gender: member.gender,
        birthday: member.birthday,
        salary: member.salary,
      });
    } else {
      form.resetFields(); 
    }
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields(); 
    setEditingMemberId(null); 
  };

  const handleAddEditMember = async (values: any) => {
    console.log("Edit logic will be here....")
  };

  const handleDeleteMember = async (memberId: number) => {
    try {
      await axios.delete(`https://x8ki-letl-twmt.n7.xano.io/api:tSDGfQun/members/${memberId}`);
      setMembers(members.filter((member) => member.id !== memberId));
      message.success('Member deleted successfully');
    } catch (error) {
      console.error('Error deleting member:', error);
      message.error('Failed to delete member');
    }
  };

  const columns = [
    ...membersColumn,
    {
      title: 'Action',
      key: 'action',
      render: (text: any, record: Member) => (
        <span>
          <Button type="link" onClick={() => showModal(record)}>Edit</Button>
          <Popconfirm
            title="Are you sure to delete this member?"
            onConfirm={() => handleDeleteMember(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="link" danger>Delete</Button>
          </Popconfirm>
        </span>
      ),
    },
  ];


  return (
    <div>
      <div style={{ marginBottom: '16px' }}>
        <Input
          placeholder="Filter by First Name"
          onChange={(e) => handleFilterChange('firstName', e.target.value)}
          style={{ width: 200, marginRight: '8px' }}
        />
        <Input
          placeholder="Filter by Last Name"
          onChange={(e) => handleFilterChange('lastName', e.target.value)}
          style={{ width: 200, marginRight: '8px' }}
        />
        <Select
          placeholder="Filter by Gender"
          allowClear
          onChange={(value) => handleFilterChange('gender', value)}
          style={{ width: 120, marginRight: '8px' }}
        >
          <Select.Option value="male">Male</Select.Option>
          <Select.Option value="female">Female</Select.Option>
        </Select>
        <Button type="primary" onClick={() => showModal()}>Add Member</Button>
      </div>
      
      <Modal
        title={editingMemberId ? 'Edit Member' : 'Add New Member'}
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleAddEditMember}
          initialValues={{
            gender: 'Choose gender..', 
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
            <Button onClick={handleCancel}>Cancel</Button>
            <Button type="primary" htmlType="submit" style={{ marginLeft: 8 }}>Save</Button>
          </Form.Item>
        </Form>
      </Modal>

      <Table dataSource={members} columns={columns} rowKey="id" />
    </div>
  )
}

export default MembersList