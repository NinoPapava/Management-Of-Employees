import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Modal, Form, Input, Select, Popconfirm, message } from 'antd';
import tasksColumn from '../../columns/tasksColumn';

interface Task {
  id: number;
  created_at: number;
  title: string;
  description: string;
  completion_date: string;
  status: string;
  _assigned_member?: {
    id: number;
    firstname: string;
    lastname: string;
  };
}

const TasksList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  const [form] = Form.useForm();

  const getTasks = async () => {
    try {
      const response = await axios.get<Task[]>('https://x8ki-letl-twmt.n7.xano.io/api:tSDGfQun/tasks');
      return response.data;
    } catch (error) {
      console.error('Error fetching tasks:', error);
      message.error('Failed to fetch tasks');
      return [];
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getTasks();
        setTasks(data);
      } catch (error) {
        console.error('Error setting tasks:', error);
      }
    };
    fetchData();
  }, []);

  const showModal = (task?: Task) => {
    if (task) {
      setEditingTaskId(task.id);
      form.setFieldsValue({
        title: task.title,
        description: task.description,
        completion_date: task.completion_date,
        status: task.status,
        _assigned_member: task._assigned_member,
      });
    } else {
      form.resetFields();
      setEditingTaskId(null); 
    }
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
    setEditingTaskId(null);
  };

  const handleAddEditTask = async (values: any) => {
    if (editingTaskId) {
      console.log('Edit logic will be here....');
    } else {
      handleAddTask(values);
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    try {
      await axios.delete(`https://x8ki-letl-twmt.n7.xano.io/api:tSDGfQun/tasks/${taskId}`);
      setTasks(tasks.filter((task) => task.id !== taskId));
      message.success('Task deleted successfully');
    } catch (error) {
      console.error('Error deleting task:', error);
      message.error('Failed to delete task');
    }
  };

  const columns = [
    ...tasksColumn,
    {
      title: 'Action',
      key: 'action',
      render: (text: any, record: Task) => (
        <span>
          <Button type="link" onClick={() => showModal(record)}>Edit</Button>
          <Popconfirm
            title="Are you sure to delete this task?"
            onConfirm={() => handleDeleteTask(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="link" danger>Delete</Button>
          </Popconfirm>
        </span>
      ),
    },
  ];

  const handleAddTask = async (values: any) => {
    try {
      const response = await axios.post<Task>('https://x8ki-letl-twmt.n7.xano.io/api:tSDGfQun/tasks', values);
      setTasks([...tasks, response.data]);
      message.success('Task added successfully');
      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.error('Error adding task:', error);
      message.error('Failed to add task');
    }
  };

  return (
    <div>
      <h1>Tasks List</h1>
      <Button type="primary" onClick={() => showModal()}>Add Task</Button>

      <Modal
        title={editingTaskId ? 'Edit Task' : 'Add New Task'}
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleAddEditTask}
        >
          <Form.Item name="title" label="Title" rules={[{ required: true, message: 'Please enter title' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Description" rules={[{ required: true, message: 'Please enter description' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="status" label="Status" rules={[{ required: true, message: 'Please select status' }]}>
            <Select>
              <Select.Option value="todo">To Do</Select.Option>
              <Select.Option value="in_progress">In Progress</Select.Option>
              <Select.Option value="completed">Completed</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="completion_date" label="Completion Date" rules={[{ required: true, message: 'Please select completion date' }]}>
            <Input type="date" />
          </Form.Item>
          <Form.Item>
            <Button onClick={handleCancel}>Cancel</Button>
            <Button type="primary" htmlType="submit" style={{ marginLeft: 8 }}>Save</Button>
          </Form.Item>
        </Form>
      </Modal>

      <Table dataSource={tasks} columns={columns} rowKey="id" />
    </div>
  );
};

export default TasksList;
