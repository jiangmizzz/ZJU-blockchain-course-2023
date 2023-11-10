import "./assets/reset.css";
import "./App.css";
import HomePage from "./pages/index";
import Profile from "./pages/profile/profile";
import React, { useEffect, useState } from "react";
import { PieChartOutlined, UserOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import {
  message,
  Breadcrumb,
  Layout,
  Menu,
  theme,
  Tag,
  Divider,
  Button,
} from "antd";
import { MenuItemType } from "antd/es/menu/hooks/useItems";
import { Link, Navigate, Route, Routes } from "react-router-dom";
import { web3 } from "./util/contracts";

const { Header, Content, Footer, Sider } = Layout;
const GanacheTestChainId = "0x539"; // Ganache默认的ChainId = 0x539 = Hex(1337)
// TODO change according to your configuration
const GanacheTestChainName = "borrow-cars";
const GanacheTestChainRpcUrl = "http://127.0.0.1:8545";

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
  const [account, setAccount] = useState<string>(""); //账户address
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const [messageApi, contextHolder] = message.useMessage();

  // 初始化检查用户是否已经连接钱包
  useEffect(() => {
    // 查看window对象里是否存在ethereum（metamask安装后注入的）对象
    const initCheckAccounts = async () => {
      // @ts-ignore
      const { ethereum } = window;
      if (Boolean(ethereum && ethereum.isMetaMask)) {
        // 尝试获取连接的用户账户
        const accounts = await web3.eth.getAccounts();
        if (accounts && accounts.length && accounts[0] != account) {
          setAccount(accounts[0]);
        } else {
          messageApi.open({
            key: "1",
            type: "error",
            content: "你还未绑定钱包！",
          });
        }
      }
    };
    initCheckAccounts();
    return () => {
      //react18新特性，useEffect会执行两次，因此要及时清除副作用
      messageApi.destroy("1");
    };
  }, []);

  //尝试让用户授权打开metamask
  const onClickConnectWallet = async () => {
    // 查看window对象里是否存在ethereum（metamask安装后注入的）对象
    // @ts-ignore
    const { ethereum } = window;
    if (!Boolean(ethereum && ethereum.isMetaMask)) {
      alert("MetaMask is not installed!");
      return;
    }

    try {
      // 如果当前小狐狸不在本地链上，切换Metamask到本地测试链
      if (ethereum.chainId !== GanacheTestChainId) {
        const chain = {
          chainId: GanacheTestChainId, // Chain-ID
          chainName: GanacheTestChainName, // Chain-Name
          rpcUrls: [GanacheTestChainRpcUrl], // RPC-URL
        };

        try {
          // 尝试切换到本地网络
          await ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: chain.chainId }],
          });
        } catch (switchError: any) {
          // 如果本地网络没有添加到Metamask中，添加该网络
          if (switchError.code === 4902) {
            await ethereum.request({
              method: "wallet_addEthereumChain",
              params: [chain],
            });
          }
        }
      }

      // 小狐狸成功切换网络了，接下来让小狐狸请求用户的授权
      await ethereum.request({ method: "eth_requestAccounts" });
      // 获取小狐狸拿到的授权用户列表
      const accounts = await ethereum.request({ method: "eth_accounts" });
      // 如果用户存在，展示其account，否则显示错误信息
      setAccount(accounts[0] || "Not able to get accounts");
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {contextHolder}
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
            <Tag color="#2db7f5">Your Account:</Tag>
            <span style={{ marginRight: "15px" }}> {account}</span>
            <Button
              type="primary"
              disabled={account != ""}
              onClick={onClickConnectWallet}
            >
              点击连接钱包
            </Button>
            <Divider />
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
