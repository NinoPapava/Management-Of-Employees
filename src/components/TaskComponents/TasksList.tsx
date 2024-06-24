import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { Table, Button, Modal, Form, Input, Select, Popconfirm, message } from 'antd';
import tasksColumn from '../../columns/tasksColumn'; 
import TaskModal from './TaskModal';
import TaskTable from './TaskTable';
export interface Task {
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
    } else {
      setEditingTaskId(null);
    }
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields(); 
    setEditingTaskId(null); 
  };

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
    form.resetFields();
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
    form.resetFields();
  };

  return (
    <div>
      <h1>Tasks List</h1>
      <Button type="primary" onClick={() => showModal()}>Add Task</Button>

      <TaskModal
        visible={isModalVisible}
        onCancel={handleCancel}
        onFinish={handleAddTask}
        initialValues={editingTaskId ? tasks.find(task => task.id === editingTaskId) : undefined}
        isEdit={!!editingTaskId}
      />

      <TaskTable
        tasks={tasks}
        onEdit={showModal}
        onDelete={handleDeleteTask}
      />
    </div>
  )
}

export default TasksList