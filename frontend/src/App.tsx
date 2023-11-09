import "./assets/reset.css";
import "./App.css";
import HomePage from "./pages/index";
import Profile from "./pages/profile/profile";
import React, { useState } from "react";
import { PieChartOutlined, UserOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Breadcrumb, Layout, Menu, theme } from "antd";
import { MenuItemType } from "antd/es/menu/hooks/useItems";
import { Link, Navigate, Route, Routes } from "react-router-dom";

const { Header, Content, Footer, Sider } = Layout;

type MenuItem = Required<MenuProps>["items"][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[]
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

const items: MenuItem[] = [
  getItem(<Link to="/home">首页</Link>, "0", <PieChartOutlined />),
  getItem(<Link to="/profile">个人中心</Link>, "1", <UserOutlined />),
];

const App: React.FC = () => {
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [currentPage, selectCurrentPage] = useState<number>(0);
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          defaultSelectedKeys={["0"]}
          mode="inline"
          items={items}
          onSelect={(selected) => selectCurrentPage(parseInt(selected.key))}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }} />
        <Content style={{ margin: "0 16px" }}>
          <Breadcrumb style={{ margin: "16px 0" }}>
            <Breadcrumb.Item>Borrow Your Car</Breadcrumb.Item>
            <Breadcrumb.Item>
              {(items[currentPage] as MenuItemType).label}
            </Breadcrumb.Item>
          </Breadcrumb>
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: colorBgContainer,
            }}
          >
            <Routes>
              <Route path="/profile" element={<Profile />} />
              <Route path="/home" element={<HomePage />} />
              <Route path="/" element={<Navigate to="/home" />} />
            </Routes>
          </div>
        </Content>
        <Footer style={{ textAlign: "center" }}>
          Ant Design ©2023 Created by Ant UED
        </Footer>
      </Layout>
    </Layout>
  );
};

export default App;
