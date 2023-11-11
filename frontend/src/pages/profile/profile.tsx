import { Tabs } from "antd";
import type { TabsProps } from "antd";
import { useState, useEffect } from "react";
import CarCard from "../../components/CarCard";
import "./profile.css";
import { ReturnedCarItem } from "../index";
import {
  borrowYourCarContract,
  myERC20Contract,
  web3,
} from "../../util/contracts";

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

export default function Profile() {
  const [carsList, setCarsList] = useState<ReturnedCarItem[]>([]);
  const [account, setAccount] = useState<string>("");
  const [carType, setCarType] = useState<string>("0");

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
        //获取当前拥有的汽车
        const Cars: ReturnedCarItem[] = await borrowYourCarContract.methods
          // @ts-ignore
          .getMyCars(account)
          .call();
        // console.log(Cars);
        setCarsList(Cars);
      } else {
        //获取当前借的汽车
        const Cars: ReturnedCarItem[] = await borrowYourCarContract.methods
          // @ts-ignore
          .getMyborrowedCars(account)
          .call();
        // console.log(Cars);
        setCarsList(Cars);
      }
    };
    getCarList(carType);
  }, [carType]);

  return (
    <div>
      <Tabs items={items} onChange={(key: string) => setCarType(key)} />
      <div className="carCard-grid">
        {carsList.map(({ tokenId, owner, borrower, returnDate, price }) => {
          return (
            <>
              <CarCard
                key={Number(tokenId)}
                tokenId={Number(tokenId)}
                owner={owner}
                borrower={borrower}
                returnDate={returnDate}
                price={Number(price)}
                borrowable={false} //profile中的车均不能借
              />
            </>
          );
        })}
      </div>
    </div>
  );
}
