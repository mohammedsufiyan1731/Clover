import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import LaunchGate from './pages/LaunchGate';
import MissionControl from './pages/MissionControl';
import CommandCenter from './pages/CommandCenter';
import TestArena from './pages/TestArena';
import Debrief from './pages/Debrief';
import InterviewRoom from './pages/InterviewRoom';
import ResumeLab from './pages/ResumeLab';
import CodeLab from './pages/CodeLab';
import StyleGuide from './pages/StyleGuide';
import NotFound from './pages/NotFound';
import { currentUserStudent, currentUserTrainer } from './mocks/apogeeData';

export default function App() {
  const [role, setRole] = useState('student'); // 'student' | 'trainer'

  const currentUser = role === 'student' ? currentUserStudent : currentUserTrainer;

  const handleRoleSwitch = (newRole) => {
    setRole(newRole);
  };

  const handleLogin = (chosenRole) => {
    setRole(chosenRole);
  };

  const handleLogout = () => {
    setRole('student');
  };

  return (
    <Routes>
      {/* S1: Launch Gate (Public Auth) */}
      <Route path="/" element={<LaunchGate onLogin={handleLogin} />} />

      {/* S2: Mission Control (Student Home) */}
      <Route
        path="/mission-control"
        element={
          <Layout
            currentRole={role}
            currentUser={currentUser}
            onRoleSwitch={handleRoleSwitch}
            onLogout={handleLogout}
          >
            <MissionControl />
          </Layout>
        }
      />

      {/* S8: Command Center (Trainer Console) */}
      <Route
        path="/command-center"
        element={
          <Layout
            currentRole={role}
            currentUser={currentUser}
            onRoleSwitch={handleRoleSwitch}
            onLogout={handleLogout}
          >
            <CommandCenter />
          </Layout>
        }
      />

      {/* S3: Test Arena */}
      <Route
        path="/test-arena"
        element={
          <Layout
            currentRole={role}
            currentUser={currentUser}
            onRoleSwitch={handleRoleSwitch}
            onLogout={handleLogout}
          >
            <TestArena />
          </Layout>
        }
      />

      {/* S4: Debrief */}
      <Route
        path="/debrief"
        element={
          <Layout
            currentRole={role}
            currentUser={currentUser}
            onRoleSwitch={handleRoleSwitch}
            onLogout={handleLogout}
          >
            <Debrief />
          </Layout>
        }
      />

      {/* S5: Interview Room (WOW PAGE) */}
      <Route
        path="/interview-room"
        element={
          <Layout
            currentRole={role}
            currentUser={currentUser}
            onRoleSwitch={handleRoleSwitch}
            onLogout={handleLogout}
          >
            <InterviewRoom />
          </Layout>
        }
      />

      {/* S6: Resume Lab */}
      <Route
        path="/resume-lab"
        element={
          <Layout
            currentRole={role}
            currentUser={currentUser}
            onRoleSwitch={handleRoleSwitch}
            onLogout={handleLogout}
          >
            <ResumeLab />
          </Layout>
        }
      />

      {/* S7: Code Lab */}
      <Route
        path="/code-lab"
        element={
          <Layout
            currentRole={role}
            currentUser={currentUser}
            onRoleSwitch={handleRoleSwitch}
            onLogout={handleLogout}
          >
            <CodeLab />
          </Layout>
        }
      />

      {/* S0: Style Guide Showcase (Directly from Stitch) */}
      <Route
        path="/style-guide"
        element={
          <Layout
            currentRole={role}
            currentUser={currentUser}
            onRoleSwitch={handleRoleSwitch}
            onLogout={handleLogout}
          >
            <StyleGuide />
          </Layout>
        }
      />

      {/* 404 Route */}
      <Route
        path="*"
        element={
          <Layout
            currentRole={role}
            currentUser={currentUser}
            onRoleSwitch={handleRoleSwitch}
            onLogout={handleLogout}
          >
            <NotFound />
          </Layout>
        }
      />
    </Routes>
  );
}
