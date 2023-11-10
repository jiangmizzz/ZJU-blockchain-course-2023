import { Tabs } from "antd";
import type { TabsProps } from "antd";
import { useEffect, useState } from "react";
import CarCard from "../../components/CarCard";
import { web3 } from "../../util/contracts";
import "./index.css";

const items: TabsProps["items"] = [
  {
    key: "1",
    label: "所有汽车",
  },
  {
    key: "2",
    label: "可租借的汽车",
  },
];

const iniCars = [
  {
    tokenId: 0,
    owner: "小明",
    borrower: "",
    returnDate: "2022-10-4",
  },
  {
    tokenId: 1,
    owner: "小hong",
    borrower: "小ming",
    returnDate: "2023-10-4",
  },
  // {
  //   tokenId: 2,
  //   owner: "redred",
  //   borrower: "小m",
  //   returnDate: "2023-10-5",
  // },
  // {
  //   tokenId: 3,
  //   owner: "MM",
  //   borrower: "小ming",
  //   returnDate: "2023-10-4",
  // },
];

export default function HomePage() {
  const [carType, setCarType] = useState<string>("0");
  const [carsList, setCarsList] = useState(iniCars);
  const [account, setAccount] = useState<string>("");

  useEffect(() => {
    const getMyAccount = async () => {
      const accounts = await web3.eth.getAccounts();
      if (accounts && accounts.length) {
        setAccount(accounts[0]);
        setCarType("1");
      }
    };
    getMyAccount();
  }, []);

  useEffect(() => {
    const getCarList = async (key: string) => {
      if (key == "1") {
        //alert("获取全部汽车");
        //获取全部汽车
      } else {
        //alert("获取可借汽车");
        //可借汽车
      }
    };
    getCarList(carType);
  }, [carType]);

  // async function getCarList(key: string) {
  //
  // }
  //借一辆车，只有主页的车可以借
  function borrowACar(tokenId: number) {
    alert("成功借到了一辆车！");
  }

  return (
    <div>
      <Tabs items={items} onChange={setCarType} />
      <div className="carCard-grid">
        {carsList.map(({ tokenId, owner, borrower, returnDate }, index) => {
          return (
            <>
              <CarCard
                key={tokenId}
                tokenId={tokenId}
                owner={owner}
                borrower={borrower}
                returnDate={returnDate}
                borrowable={borrower == "" && owner != account}
                onBorrow={() => borrowACar(tokenId)}
              />
            </>
          );
        })}
      </div>
    </div>
  );
}
