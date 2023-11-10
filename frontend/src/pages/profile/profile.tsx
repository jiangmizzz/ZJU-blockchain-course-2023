import { Tabs } from "antd";
import type { TabsProps } from "antd";
import { useState } from "react";
import CarCard from "../../components/CarCard";
import "./profile.css";

const items: TabsProps["items"] = [
  {
    key: "1",
    label: "我拥有的汽车",
  },
  {
    key: "2",
    label: "我租借的汽车",
  },
];

const iniCars = [
  {
    tokenId: 0,
    owner: "小明",
    borrower: "小红",
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

export default function Profile() {
  const [carsList, setCarsList] = useState(iniCars);

  async function handleTabChange(key: string) {
    if (key == "1") {
      //获取全部汽车
    } else {
      //可借汽车
    }
  }
  return (
    <div>
      <Tabs items={items} onChange={handleTabChange} />
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
                borrowable={false} //profile中的车均不能借
              />
            </>
          );
        })}
      </div>
    </div>
  );
}
