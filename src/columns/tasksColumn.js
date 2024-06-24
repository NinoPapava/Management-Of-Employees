const renderAssignedMember = (assignedMember) => {
  if (assignedMember) {
    return `${assignedMember.firstname} ${assignedMember.lastname}`;
  } else {
    return '';
  }
};

const columns = [
  {
    title: 'Title',
    dataIndex: 'title',
    key: 'title'
  },
  {
    title: 'Description',
    dataIndex: 'description',
    key: 'description'
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status'
  },
  {
    title: 'Completion Date',
    dataIndex: 'completion_date',
    key: 'completion_date'
  },
  {
    title: 'Assigned Member',
    dataIndex: '_assigned_member',
    key: '_assigned_member',
    render: renderAssignedMember
  }
];

export default columns;
