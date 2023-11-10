import { Button, Card, Image } from "antd";
import car1 from "../assets/car1.jpg";
import car2 from "../assets/car2.jpg";
import car3 from "../assets/car3.jpg";
import car4 from "../assets/car4.jpg";
import car5 from "../assets/car5.jpg";
import car6 from "../assets/car6.jpg";
import car7 from "../assets/car7.jpg";
import car8 from "../assets/car8.jpg";

const picArray = [car1, car2, car3, car4, car5, car6, car7, car8];

export interface carCardProps {
  tokenId: number;
  owner: string;
  borrower: string;
  returnDate: string;
  borrowable: boolean; //可否被当前用户借
  onBorrow?: () => void; //租借事件
}
export default function CarCard(props: carCardProps) {
  return (
    <>
      <Card
        hoverable
        title={"Car No." + props.tokenId}
        extra={
          props.borrowable ? (
            <Button type="primary" onClick={props.onBorrow}>
              租借
            </Button>
          ) : (
            <></>
          )
        }
      >
        <Image src={picArray[props.tokenId % 8]} height={200} />
        <div>
          <p>Owner: {props.owner}</p>
          <p>Borrower: {props.borrower == "" ? "未借出" : props.borrower}</p>
          <p>returnDate: {props.borrower == "" ? "---" : props.returnDate}</p>
        </div>
      </Card>
    </>
  );
}
