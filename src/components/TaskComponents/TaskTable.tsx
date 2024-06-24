import React from 'react';
import { Table, Button, Popconfirm } from 'antd';
import { Task } from './TasksList';

interface TaskTableProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (taskId: number) => void;
}

const TaskTable: React.FC<TaskTableProps> = ({ tasks, onEdit, onDelete }) => {
  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: 'Completion Date',
      dataIndex: 'completion_date',
      key: 'completion_date',
    },
    {
      title: 'Action',
      key: 'action',
      render: (text: any, record: Task) => (
        <span>
          <Button type="link" onClick={() => onEdit(record)}>Edit</Button>
          <Popconfirm
            title="Are you sure to delete this task?"
            onConfirm={() => onDelete(record.id)}
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
    <Table dataSource={tasks} columns={columns} rowKey="id" />
  );
};

export default TaskTable;
