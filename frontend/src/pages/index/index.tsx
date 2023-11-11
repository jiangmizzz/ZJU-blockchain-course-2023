import { Tabs, Modal, DatePicker } from "antd";
import type { TabsProps } from "antd";
import { useEffect, useState } from "react";
import CarCard from "../../components/CarCard";
import {
  borrowYourCarContract,
  myERC20Contract,
  web3,
} from "../../util/contracts";
import dayjs from "dayjs";
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

export interface ReturnedCarItem {
  tokenId: number;
  borrower: string;
  owner: string;
  price: number;
  returnDate: string;
}

export default function HomePage() {
  const [carType, setCarType] = useState<string>("0");
  const [carsList, setCarsList] = useState<ReturnedCarItem[]>([]);
  const [account, setAccount] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [carToBorrow, setCarToBorrow] = useState(-1); //要被借的车
  const [returnDate, setReturnDate] = useState<string>("2023-11-11"); //还车时间
  const [price, setPrice] = useState<number>(0); //租车价格

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
        //获取全部汽车
        const Cars: ReturnedCarItem[] = await borrowYourCarContract.methods
          .getAllCars()
          .call();
        // console.log(Cars);
        setCarsList(Cars);
      } else {
        //可借汽车
        const Cars: ReturnedCarItem[] = await borrowYourCarContract.methods
          // @ts-ignore
          .getCarsCanBorrow(account)
          .call();
        // console.log(Cars);
        setCarsList(Cars);
      }
    };
    getCarList(carType);
  }, [carType]);

  // async function getCarList(key: string) {
  //
  // }
  //借一辆车(只有主页的车可以借
  async function borrowACar() {
    setIsModalOpen(false); //关闭弹窗
    await borrowYourCarContract.methods
      // @ts-ignore
      .borrowACar(carToBorrow, returnDate, price, account)
      .send({ from: account });
    //调用借车的合约
    alert(
      "成功借到了一辆车!\n ID: " + carToBorrow + "\n归还日期: " + returnDate
    );
    window.location.reload(); //刷新页面
  }

  return (
    <div>
      <Modal
        title="租借汽车"
        open={isModalOpen}
        onOk={borrowACar}
        onCancel={() => setIsModalOpen(false)}
      >
        <span>选择还车日期：</span>
        <DatePicker
          defaultValue={dayjs(returnDate, "YYYY-MM-DD")}
          onChange={(_day, dateString) => setReturnDate(dateString)}
        />
      </Modal>
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
                borrowable={
                  borrower == "0x0000000000000000000000000000000000000000" &&
                  owner != account
                }
                price={Number(price)}
                onBorrow={() => {
                  setPrice(Number(price));
                  setCarToBorrow(Number(tokenId));
                  setIsModalOpen(true);
                }}
              />
            </>
          );
        })}
      </div>
    </div>
  );
}
