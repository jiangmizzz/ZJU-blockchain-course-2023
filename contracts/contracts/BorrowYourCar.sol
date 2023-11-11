// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

// Uncomment the line to use openzeppelin/ERC721
// You can use this dependency directly because it has been installed by TA already
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
// Uncomment this line to use console.log
import "hardhat/console.sol";
import "./MyERC20.sol";

contract BorrowYourCar is ERC721 {
    // use a event if you want
    // to represent time you can choose block.timestamp
    // event CarBorrowed(
    //     address owner,
    //     address borrower,
    //     uint256 startTime,
    //     uint256 duration
    // );

    // maybe you need a struct to store car information
    struct Car {
        uint32 tokenId;
        address owner;
        address borrower;
        string returnDate;
        uint256 price;
    }

    mapping(uint256 => Car) public cars; // A map from car index to its information
    MyERC20 public ERC20Contract;
    uint32 public carCnt;
    uint256[] priceArray = [100, 123, 250, 300, 40, 50]; //分配价格

    // ...
    // TODO add any variables if you want

    //构造NFT的名称和符号
    constructor(address constractAddress) ERC721("CarNFT", "CAR") {
        ERC20Contract = MyERC20(constractAddress);
        // maybe you need a constructor
    }

    //分发一个NFT
    function mintCarNFT(address account) external {
        cars[carCnt] = Car(
            carCnt,
            account,
            address(0),
            "---",
            priceArray[carCnt % 6]
        );
        _mint(account, carCnt);
        carCnt++;
    }

    //查看所有汽车
    function getAllCars() external view returns (Car[] memory) {
        Car[] memory allCars = new Car[](carCnt);
        for (uint i = 0; i < carCnt; i++) {
            allCars[i] = cars[i];
        }
        return allCars;
    }

    //查看可以借的车的列表
    function getCarsCanBorrow(
        address account
    ) external view returns (Car[] memory) {
        uint256 cnt = 0;
        for (uint i = 0; i < carCnt; i++) {
            if (cars[i].owner != account && cars[i].borrower == address(0)) {
                cnt++;
            }
        }
        uint index = 0;
        Car[] memory carsCanBorrow = new Car[](cnt);
        for (uint i = 0; i < carCnt; i++) {
            if (cars[i].owner != account && cars[i].borrower == address(0)) {
                carsCanBorrow[index++] = cars[i];
            }
        }
        return carsCanBorrow;
    }

    //查看自己拥有的车的列表
    function getMyCars(address account) external view returns (Car[] memory) {
        uint256 cnt = 0;
        for (uint i = 0; i < carCnt; i++) {
            if (cars[i].owner == account) {
                cnt++;
            }
        }
        uint index = 0;
        Car[] memory myCars = new Car[](cnt);
        for (uint i = 0; i < carCnt; i++) {
            if (cars[i].owner == account) {
                myCars[index++] = cars[i];
            }
        }
        return myCars;
    }

    //查看自己借的车
    function getMyborrowedCars(
        address account
    ) external view returns (Car[] memory) {
        uint256 cnt = 0;
        for (uint i = 0; i < carCnt; i++) {
            if (cars[i].borrower == account) {
                cnt++;
            }
        }
        uint index = 0;
        Car[] memory myBorrowedCars = new Car[](cnt);
        for (uint256 i = 0; i < carCnt; i++) {
            if (cars[i].borrower == account) {
                myBorrowedCars[index++] = cars[i];
            }
        }
        return myBorrowedCars;
    }

    //付费借车
    function borrowACar(
        uint256 carTokenId,
        string memory returnDate,
        uint256 price,
        address account
    ) external {
        require(ERC20Contract.balances(account) >= price, "No enough balance!");
        address owner = cars[carTokenId].owner;
        ERC20Contract.transfer(account, owner, price); //转钱到指定账户
        cars[carTokenId].borrower = account;
        cars[carTokenId].returnDate = returnDate;
    }

    // //还车
    // function returnACar(address borrower, uint256 carTokenId) external {
    //     cars[carTokenId].borrower = address(0);
    //     cars[carTokenId].returnDate = "---";
    // }
}
