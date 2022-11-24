//SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.0;

import "strings.sol";

contract Ballot
{
    using strings for *;

    struct request {
        string pick_loc;
        string drop_loc;
        bool accepted;
        string reqid;
        uint256 create_time;
        address cust_address;
    }

    struct customer {
        string name;
        string pwd;
    }

    struct driver {
        string name;
        string pwd;
        int256 rating;
        string number_plate;
    }

    struct best_bid {
        string name;
        string bet;
    }

    mapping (address => customer) customers;
    mapping (address => driver) cab_drivers;
    mapping (int256 => request) requests;
    mapping (int256 => string) bets;
    mapping (int256 => best_bid) bets2;
    mapping (int256 => int256) num_bets;
    mapping (int256 => string) num_to_words;
    address[] driver_addresses;
    event RideGiven(int256 rideId, string driver_add);

    constructor() {
        num_to_words[int256(1)] = "1";
        num_to_words[int256(2)] = "2";
        num_to_words[int256(3)] = "3";
        num_to_words[int256(4)] = "4";
        num_to_words[int256(5)] = "5";
        num_to_words[int256(6)] = "6";
    }

    customer c1;
    driver d1;


    function RegisterCustomer(string memory name, string memory pwd) public returns(string memory)
    {
        if(keccak256(abi.encodePacked(checkExistenceCustomer())) == keccak256(abi.encodePacked("true")))
            return "Customer already registered!";
        c1.name = name;
        c1.pwd = pwd;
        customers[msg.sender] = c1;
        return "Customer successfully registered :)";
    }

    function LoginCustomer(string memory name, string memory pwd) public returns(string memory)
    {
        if(keccak256(abi.encodePacked(customers[msg.sender].name)) != keccak256(abi.encodePacked(name)))
            return "Wrong Username :(";
        if(keccak256(abi.encodePacked(customers[msg.sender].pwd)) != keccak256(abi.encodePacked(pwd)))
            return "Password did not match :(";
        return "Customer successfully logged in :)";
    }


    function RegisterDriver(string memory name, string memory pwd, string memory number_plate) public returns(string memory)
    {
        if(keccak256(abi.encodePacked(checkExistenceDriver())) == keccak256(abi.encodePacked("true")))
            return "Driver already registered!";
        d1.name = name;
        d1.pwd = pwd;
        d1.number_plate = number_plate;
        cab_drivers[msg.sender] = d1;
        driver_addresses.push(msg.sender);
        return "Driver successfully registered :)";
    }

    function LoginDriver(string memory name, string memory pwd) public returns(string memory)
    {
        if(keccak256(abi.encodePacked(cab_drivers[msg.sender].name)) != keccak256(abi.encodePacked(name)))
            return "Wrong Username :(";
        if(keccak256(abi.encodePacked(cab_drivers[msg.sender].pwd)) != keccak256(abi.encodePacked(pwd)))
            return "Password did not match :(";
        return "Driver successfully logged in :)";
    }

    int256 requestid = 1;
    request r1;
    function RequestRide(string memory pickup, string memory drop) public returns(int256)
    {
        if(keccak256(abi.encodePacked(checkExistenceCustomer())) == keccak256(abi.encodePacked("false")))
            return -1;
        r1.pick_loc = pickup;
        r1.drop_loc = drop;
        r1.accepted = false;
        r1.reqid = num_to_words[requestid];
        r1.cust_address = msg.sender;
        r1.create_time = block.timestamp;
        requests[requestid] = r1;
        bets[requestid] = "";
        num_bets[requestid] = 0;
        requestid += 1;
        int256 temprequest = requestid - 1;
        return temprequest;
    }

    function seeRequests() public returns(string memory)
    {
        if(keccak256(abi.encodePacked(checkExistenceDriver())) == keccak256(abi.encodePacked("false")))
            return "Only drivers can see requests.";
        string memory output = "";
        for (int i=1;i<requestid;i++)
        {

            if (requests[i].accepted == false)
            {
                string memory cust_name = customers[requests[i].cust_address].name;
                output = output.toSlice().concat((requests[i].reqid).toSlice());
                output = output.toSlice().concat("_".toSlice());
                output = output.toSlice().concat((requests[i].pick_loc).toSlice());
                output = output.toSlice().concat("_".toSlice());
                output = output.toSlice().concat((requests[i].drop_loc).toSlice());
                output = output.toSlice().concat("_".toSlice());
                output = output.toSlice().concat((cust_name).toSlice());
                output = output.toSlice().concat("~".toSlice());
            }
        }
        return output;
    }


    function placeBet(int256 rideId, string memory name, string memory bet) public returns(string memory)
    {

        if(keccak256(abi.encodePacked(checkExistenceDriver())) == keccak256(abi.encodePacked("false")))
            return "Driver does not exist";
        if(keccak256(abi.encodePacked(requests[rideId].cust_address)) == keccak256(abi.encodePacked("")))
            return "Request Id does not exist";
        if(requests[rideId].cust_address == msg.sender)
            return "You cannot bet on your own request";
        if(requests[rideId].accepted == true)
            return "Request has already been allotted.";
        if(block.timestamp - requests[rideId].create_time > 500)
            return "Timeout to place bets";
        if(keccak256(abi.encodePacked(cab_drivers[msg.sender].name)) != keccak256(abi.encodePacked(name)))
            return "Driver name does not match";
        // if(stringToUint(bet) < uint(0))
        //     return "Bet has to be non-negative";

        // string memory address_str = addressToString(msg.sender);
        string memory output = "";
        output = output.toSlice().concat(bets[rideId].toSlice());
        output = output.toSlice().concat(name.toSlice());
        output = output.toSlice().concat(".".toSlice());
        output = output.toSlice().concat(bet.toSlice());
        output = output.toSlice().concat("~".toSlice());

        // strConcat(bets[rideId],address_str,".",uintToString(uint256(bet)),"~");
        bets[rideId] = output;
        num_bets[rideId] += 1;

        string memory prev_bet = bets2[rideId].bet;
        if(stringToUint(prev_bet) == 0 || stringToUint(bet) < stringToUint(prev_bet)) {
            bets2[rideId].name = name;
            bets2[rideId].bet = bet;
        }

        return output;

    }


    function checkExistenceCustomer() private returns(string memory)
    {
        if(keccak256(abi.encodePacked(customers[msg.sender].name)) == keccak256(abi.encodePacked("")))
            return "false";
        return "true";
    }

    function checkExistenceDriver() private returns(string memory)
    {
        if(keccak256(abi.encodePacked(cab_drivers[msg.sender].name)) == keccak256(abi.encodePacked("")))
            return "false";
        return "true";
    }

    function stringToUint(string memory s) private returns (uint result)
    {
        bytes memory b = bytes(s);
        uint i;
        result = 0;
        for (i = 0; i < b.length; i++)
        {
            uint c = uint8(b[i]);
            if (c >= 48 && c <= 57)
            {
                result = result * 10 + (c - 48);
            }
        }
    }

    function update_min(uint256 fare) private returns(uint256 min)
    {
        min = fare;
        return min;
    }

    function getDrivertwo(string[] memory parts) private returns(string memory)
    {
        uint256 min = 100000;
        string memory min_driver;
        for (uint j=0;j<parts.length;j++)
        {
            strings.slice memory s2 = parts[j].toSlice();
            strings.slice memory delim2 = ".".toSlice();
            string[] memory split = new string[](s2.count(delim2) + 1);
            for(uint k = 0; k < split.length; k++)
            {
                split[k] = s2.split(delim2).toString();
            }
            uint fare = stringToUint(split[1]);
            if  (fare < min)
            {
                min = update_min(fare);
                min_driver = split[0];
                min_driver = min_driver.toSlice().concat("-".toSlice());
                min_driver = min_driver.toSlice().concat(split[1].toSlice());
            }
        }
        return min_driver;
    }

    function getDriver(int256 requestId) public returns(string memory)
    {

        if(keccak256(abi.encodePacked(requests[requestId].cust_address)) == keccak256(abi.encodePacked("")))
            return "No such request exists";
        if(keccak256(abi.encodePacked(bets[requestId])) == keccak256(abi.encodePacked("")))
            return "No bets for this ride";
        if(keccak256(abi.encodePacked(checkExistenceCustomer())) == keccak256(abi.encodePacked("false")))
            return "Only customers can get drivers.";
        if(requests[requestId].cust_address != msg.sender)
            return "This is not your request";

        /*strings.slice memory s = bets[requestId].toSlice();
        strings.slice memory delim = "~".toSlice();
        string[] memory parts = new string[](s.count(delim));
        for(uint i = 0; i < parts.length; i++)
        {
            parts[i] = s.split(delim).toString();
        }
        string memory to_return = getDrivertwo(parts);
        //emit RideGiven(requestId, to_return);
        requests[requestId].accepted = true;
        return to_return;*/
        string memory response = "";
        response = response.toSlice().concat("Name of your cab driver: ".toSlice());
        response = response.toSlice().concat(bets2[requestId].name.toSlice());
        response = response.toSlice().concat(" -- Fare requested for your ride: ".toSlice());
        response = response.toSlice().concat(bets2[requestId].bet.toSlice());
        return response;
    }


}
