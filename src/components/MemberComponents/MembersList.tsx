import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { Button, Form, Input, Select, message } from 'antd';
import MemberTable from './MemberTable';
import MemberForm from './MemberForm';

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
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [firstNameFilter, setFirstNameFilter] = useState<string>('');
  const [lastNameFilter, setLastNameFilter] = useState<string>('');
  const [genderFilter, setGenderFilter] = useState<string | undefined>();
  const [form] = Form.useForm();

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
    setEditingMember(member || null);
    setIsModalVisible(true);
    form.resetFields();
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingMember(null);
    form.resetFields();
  };

  const handleAddMember = async (values: any) => {
    try {
      const response = await axios.post<Member>('https://x8ki-letl-twmt.n7.xano.io/api:tSDGfQun/members', values);
      const newMember = response.data;
      setMembers([...members, newMember]);
      setIsModalVisible(false);
      message.success('Member added successfully');
    } catch (error) {
      console.error('Error adding member:', error);
      message.error('Failed to add member');
    }
    form.resetFields();
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

      <MemberTable
        members={members}
        onEdit={showModal}
        onDelete={handleDeleteMember}
      />

      <MemberForm
        visible={isModalVisible}
        onCancel={handleCancel}
        onFinish={handleAddMember}
        initialValues={editingMember ? {
          id: editingMember.id,
          firstname: editingMember.firstname,
          lastname: editingMember.lastname,
          gender: editingMember.gender,
          birthday: editingMember.birthday,
          salary: editingMember.salary,
        } : undefined}
      />
    </div>
  )
}

export default MembersList