        let account;
        const metamask_login_customer = async () => {
            if(window.ethereum !== "undefined"){
                const accounts = await ethereum.request({method: "eth_requestAccounts"});
                account = accounts[0];
                const customer_name = document.getElementById("login_username").value;
                const customer_pwd = document.getElementById("login_userpass").value;
                const cust_resp = await window.contract.methods.LoginCustomer(customer_name, customer_pwd).call({ from: account });
                if(cust_resp != "Customer successfully logged in :)") {alert(cust_resp); return;}
                await window.contract.methods.LoginCustomer(customer_name, customer_pwd).send({ from: account });
                alert(cust_resp);
                alert("Address: " + account);
                window.location.href = "./request_ride.html";
            }

        }

        const metamask_login_driver = async () => {
            if(window.ethereum !== "undefined"){
                const accounts = await ethereum.request({method: "eth_requestAccounts"});
                account = accounts[0];
                const driver_name = document.getElementById("login_drivername").value;
                const driver_pwd = document.getElementById("login_driverpass").value;
                const driv_resp = await window.contract.methods.LoginDriver(driver_name, driver_pwd).call({ from: account });
                if(driv_resp != "Driver successfully logged in :)") {alert(driv_resp); return;}
                await window.contract.methods.LoginDriver(driver_name, driver_pwd).send({ from: account });
                alert(driv_resp);
                alert("Address: " + account);
                window.location.href = "./place_bet.html";
            }

        }

        const metamask_reg_customer = async () => {
            if(window.ethereum !== "undefined"){
                const accounts = await ethereum.request({method: "eth_requestAccounts"});
                account = accounts[0];
                const customer_name = document.getElementById("inputArea0").value;
                const customer_pwd = document.getElementById("userpass").value;
                const cust_resp2 = await window.contract.methods.RegisterCustomer(customer_name, customer_pwd).call({ from: account });
                if(cust_resp2 != "Customer successfully registered :)") {alert(cust_resp2); return;}
                await window.contract.methods.RegisterCustomer(customer_name, customer_pwd).send({ from: account });
                alert(cust_resp2);
                alert("Address: " + account);
                window.location.href = "./request_ride.html";
            }

        }

        const metamask_reg_driver = async () => {
            if(window.ethereum !== "undefined"){
                const accounts = await ethereum.request({method: "eth_requestAccounts"});
                account = accounts[0];
                const driver_name = document.getElementById("inputArea1").value;
                const driver_pwd = document.getElementById("driverpass").value;
                const num_plate = document.getElementById("inputArea2").value;
                const driv_resp2 = await window.contract.methods.RegisterDriver(driver_name, driver_pwd, num_plate).call({ from: account });
                if(driv_resp2 != "Driver successfully registered :)") {alert(driv_resp2); return;}
                await window.contract.methods.RegisterDriver(driver_name, driver_pwd, num_plate).send({ from: account });
                alert(driv_resp2);
                alert("Address: " + account);
                window.location.href = "./place_bet.html";
            }

        }

        const login_customer = async () => {
            connectContract();
            metamask_login_customer();
        }

        const login_driver = async () => {
            connectContract();
            metamask_login_driver();
        }

        const reg_customer = async () => {
            connectContract();
            metamask_reg_customer();
        }

        const reg_driver = async () => {
            connectContract();
            metamask_reg_driver();
        }

        const req_ride = async () => {
            connectContract();
            if(window.ethereum !== "undefined"){
                const accounts = await ethereum.request({method: "eth_requestAccounts"});
                account = accounts[0];
                const pickup = document.getElementById("inputArea3").value;
                const drop = document.getElementById("inputArea4").value;
                const ride_resp = await window.contract.methods.RequestRide(pickup, drop).call({ from: account });
                await window.contract.methods.RequestRide(pickup, drop).send({ from: account });
                alert("Ride booking successful :)");
                alert("Your ride request ID is: " + ride_resp);
            }
        }

        const place_bet = async () => {
            connectContract();
            if(window.ethereum !== "undefined"){
                const accounts = await ethereum.request({method: "eth_requestAccounts"});
                account = accounts[0];
                const req_id = document.getElementById("inputArea5").value;
                const driver_name = document.getElementById("inputArea6").value;
                const bet = document.getElementById("inputArea7").value;
                const bet_resp = await window.contract.methods.placeBet(req_id, driver_name, bet).call({ from: account });

                if(bet_resp == "Driver does not exist") {alert(bet_resp); return;}
                if(bet_resp == "Request Id does not exist") {alert(bet_resp); return;}
                if(bet_resp == "You cannot bet on your own request") {alert(bet_resp); return;}
                if(bet_resp == "Request has already been allotted.") {alert(bet_resp); return;}
                if(bet_resp == "Timeout to place bets") {alert(bet_resp); return;}
                if(bet_resp == "Driver name does not match") {alert(bet_resp); return;}

                await window.contract.methods.placeBet(req_id, driver_name, bet).send({ from: account });
                alert("Bet successfully placed for ride ID " + req_id + " of amount " + bet);
                alert("Bets placed for ride ID " + req_id + " : " + bet_resp);
            }
        }

        /*
        const see_req = async () => {
            connectContract();
            if(window.ethereum !== "undefined"){
                const accounts = await ethereum.request({method: "eth_requestAccounts"});
                account = accounts[0];
                const requests = await window.contract.methods.seeRequests().call({ from: account });
                //alert(requests);
                const arr = requests.split("~");
                for(let i=0; i<arr.length-1; i++) {
                    
                    const arr2 = arr[i].split("_");
                    for(let j=0; j<arr2.length; j++) {
                        alert(arr2[j]);
                        document.getElementById("data_area").innerHTML = `${arr2[j]}\t`;
                    }

                    document.getElementById("data_area").innerHTML = `\n`;
                }
            }
        }
        */

        const get_driver = async () => {
            connectContract();
            if(window.ethereum !== "undefined"){
                const accounts = await ethereum.request({method: "eth_requestAccounts"});
                account = accounts[0];
                const req_id = document.getElementById("inputArea8").value;
                const driver = await window.contract.methods.getDriver(req_id).call({ from: account });
                
                if(driver == "No such request exists") {alert(driver); return;}
                if(driver == "No bets for this ride") {alert(driver); return;}
                if(driver == "Only customers can get drivers.") {alert(driver); return;}
                if(driver == "This is not your request") {alert(driver); return;}

                await window.contract.methods.getDriver(req_id).send({ from: account });
                document.getElementById("final").innerHTML = `${driver}`;
            }
        }

        const connectContract = async () => {
            const ABI = [
                {
                    "inputs": [
                        {
                            "internalType": "int256",
                            "name": "requestId",
                            "type": "int256"
                        }
                    ],
                    "name": "getDriver",
                    "outputs": [
                        {
                            "internalType": "string",
                            "name": "",
                            "type": "string"
                        }
                    ],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "string",
                            "name": "name",
                            "type": "string"
                        },
                        {
                            "internalType": "string",
                            "name": "pwd",
                            "type": "string"
                        }
                    ],
                    "name": "LoginCustomer",
                    "outputs": [
                        {
                            "internalType": "string",
                            "name": "",
                            "type": "string"
                        }
                    ],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "string",
                            "name": "name",
                            "type": "string"
                        },
                        {
                            "internalType": "string",
                            "name": "pwd",
                            "type": "string"
                        }
                    ],
                    "name": "LoginDriver",
                    "outputs": [
                        {
                            "internalType": "string",
                            "name": "",
                            "type": "string"
                        }
                    ],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "int256",
                            "name": "rideId",
                            "type": "int256"
                        },
                        {
                            "internalType": "string",
                            "name": "name",
                            "type": "string"
                        },
                        {
                            "internalType": "string",
                            "name": "bet",
                            "type": "string"
                        }
                    ],
                    "name": "placeBet",
                    "outputs": [
                        {
                            "internalType": "string",
                            "name": "",
                            "type": "string"
                        }
                    ],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "string",
                            "name": "name",
                            "type": "string"
                        },
                        {
                            "internalType": "string",
                            "name": "pwd",
                            "type": "string"
                        }
                    ],
                    "name": "RegisterCustomer",
                    "outputs": [
                        {
                            "internalType": "string",
                            "name": "",
                            "type": "string"
                        }
                    ],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "string",
                            "name": "name",
                            "type": "string"
                        },
                        {
                            "internalType": "string",
                            "name": "pwd",
                            "type": "string"
                        },
                        {
                            "internalType": "string",
                            "name": "number_plate",
                            "type": "string"
                        }
                    ],
                    "name": "RegisterDriver",
                    "outputs": [
                        {
                            "internalType": "string",
                            "name": "",
                            "type": "string"
                        }
                    ],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "string",
                            "name": "pickup",
                            "type": "string"
                        },
                        {
                            "internalType": "string",
                            "name": "drop",
                            "type": "string"
                        }
                    ],
                    "name": "RequestRide",
                    "outputs": [
                        {
                            "internalType": "int256",
                            "name": "",
                            "type": "int256"
                        }
                    ],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "inputs": [],
                    "name": "seeRequests",
                    "outputs": [
                        {
                            "internalType": "string",
                            "name": "",
                            "type": "string"
                        }
                    ],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "inputs": [],
                    "stateMutability": "nonpayable",
                    "type": "constructor"
                },
                {
                    "anonymous": false,
                    "inputs": [
                        {
                            "indexed": false,
                            "internalType": "int256",
                            "name": "rideId",
                            "type": "int256"
                        },
                        {
                            "indexed": false,
                            "internalType": "string",
                            "name": "driver_add",
                            "type": "string"
                        }
                    ],
                    "name": "RideGiven",
                    "type": "event"
                }
            ];
            const Address = "0xDCFB2af167358bCfB2274Ab55d8E22B6464646C6";
            window.web3 = await new Web3(window.ethereum);
            window.contract = await new window.web3.eth.Contract(ABI, Address);
            console.log("Connection Status: Success");
        }