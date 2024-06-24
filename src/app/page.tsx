'use client'
import React from 'react';
import { Layout, Menu } from 'antd';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'; // Import Routes from react-router-dom
import Header from '@/components/Header';
import MembersList from '@/components/MemberComponents/MembersList';
import TasksList from '@/components/TaskComponents/TasksList';
import HomePage from '@/components/HomeComponent/HomePage';

const { Sider, Content } = Layout;

export default function Home() {
  return (
    <Router>
      <Layout style={{ minHeight: '100vh' }}>
        <Sider width={200} theme="light">
          <Menu mode="inline" defaultSelectedKeys={['/']}>
          <Menu.Item key="home">
              <Link to="/">Home</Link>
            </Menu.Item>
            <Menu.Item key="members">
              <Link to="/members">Members</Link>
            </Menu.Item>
            <Menu.Item key="tasks">
              <Link to="/tasks">Tasks</Link>
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout>
          <Header />
          <Content style={{ margin: '16px' }}>
            <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
              <Routes> 
                <Route path="/" element={< HomePage />} />
                <Route path="/members" element={<MembersList />} />
                <Route path="/tasks" element={<TasksList />} />
              </Routes>
            </div>
          </Content>
        </Layout>
      </Layout>
    </Router>
  );
}
