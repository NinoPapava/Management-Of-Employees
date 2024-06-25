import React, {useState} from 'react';
import { Table, Button, Popconfirm, Select, Input, Checkbox } from 'antd';
import { Task } from './TasksList';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';

interface TaskTableProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (taskId: number) => void;
}

const TaskTable: React.FC<TaskTableProps> = ({ tasks, onEdit, onDelete }) => {

  const [filteredTasks, setFilteredTasks] = useState<Task[]>(tasks);
  const [titleFilter, setTitleFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string | undefined>();
  const [executiveFilter, setExecutiveFilter] = useState<number[]>([]);
  const [overdueFilter, setOverdueFilter] = useState<boolean>(false);

  const { Option } = Select;

  const applyFilters = () => {
    let filteredData = tasks.filter(task => {
      if (titleFilter && !task.title.toLowerCase().includes(titleFilter.toLowerCase())) {
        return false;
      }
      if (statusFilter && task.status !== statusFilter) {
        return false;
      }
      if (executiveFilter.length > 0 && !executiveFilter.includes(task._assigned_member?.id || 0)) {
        return false;
      }
      if (overdueFilter && !isTaskOverdue(task)) {
        return false;
      }
      return true;
    });

    setFilteredTasks(filteredData);
  };

  const isTaskOverdue = (task: Task): boolean => {
    const today = new Date();
    const completionDate = new Date(task.completion_date);
    return completionDate < today;
  };

  const handleTitleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitleFilter(e.target.value);
  };

  const handleStatusFilterChange = (value: string | undefined) => {
    setStatusFilter(value);
  };

  const handleExecutiveFilterChange = (value: number[]) => {
    setExecutiveFilter(value);
  };

  const handleOverdueFilterChange = (e: CheckboxChangeEvent) => {
    setOverdueFilter(e.target.checked);
  };
  React.useEffect(() => {
    applyFilters();
  }, [titleFilter, statusFilter, executiveFilter, overdueFilter]);


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
      render: (date: string) => {
        const overdue = isTaskOverdue({ completion_date: date } as Task);
        return (
          <span style={{ color: overdue ? 'red' : 'inherit' }}>{date}</span>
        );
      },
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
    <div>
      <div style={{ marginBottom: '16px' }}>
        <Input
          placeholder="Filter by Title"
          onChange={handleTitleFilterChange}
          style={{ width: 200, marginRight: '8px' }}
        />
        <Select
          placeholder="Filter by Status"
          allowClear
          onChange={handleStatusFilterChange}
          style={{ width: 150, marginRight: '8px' }}
        >
          <Option >To Do</Option>
          <Option value="ongoing">On going</Option>
          <Option value="completed">Completed</Option>
        </Select>
        <Select
          mode="multiple"
          placeholder="Filter by Executive"
          allowClear
          onChange={handleExecutiveFilterChange}
          style={{ width: 250, marginRight: '8px' }}
        >
          {tasks.map(task => (
            <Option key={task._assigned_member?.id} value={task._assigned_member?.id || 0}>
              {`${task._assigned_member?.firstname} ${task._assigned_member?.lastname}`}
            </Option>
          ))}
        </Select>
        <Checkbox
          onChange={handleOverdueFilterChange}
          style={{ marginRight: '8px' }}
        >
          Overdue Tasks
        </Checkbox>
      </div>
      <Table dataSource={filteredTasks} columns={columns} rowKey="id" />
    </div>
  );
};

export default TaskTable;
