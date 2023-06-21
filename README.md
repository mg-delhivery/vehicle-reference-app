
# **Overview**

This guide introduces the Vehicle Reference App, using which one can create and manage the lifecycle of the vehicles. Vehicle app demonstrates how a developer can build a web app to manage logistics network participants such as Vehicles using the participant service. The app also demonstrates integration with [Console](https://docs.getos1.com/docs/console-ui-overview), a workspace using which end customers can access all webapps from a single place. 

**Note:** Follow the steps below to run the app in your local machine. 


## **Application Organization**

The app is organized into two parts as below:

**1. Front-End Client:** This provides the user interface for the vehicle creation and management.

**2. Backend Server:** Enables creation, updates, and lifecycle management for Vehicles by using the participant service at the backend. The Vehicle object is modeled using the participant service.


## **How to setup the Front-End (Client)**

Follow the steps below to get started with the front-end client:

### **Configure Proxy**

To ensure successful authentication, you must configure your  `/etc/hosts` file on your local machine to handle traffic as a domain name. To accomplish this, you can set up your Tenant URL using a Nix Shell



1. The first step is to look up your Tenant URL in the [Developer Portal. ](https://portal.getos1.com/#/login)You can view the instructions for obtaining your Tenant URL in our [Getting Started with the OS1 Platform](https://docs.getos1.com/docs/getting-started-1#step-5-retrieving-and-using-your-platform-credentials) guide. 
2. Open a Nix Shell and execute the following commands:

```
TENANT_NAME=<Add your tenant name here>
TENANT_URL=<Add your tenant url here>
```
3. Update your `/etc/hosts` file:


#### Linux

```
echo "127.0.0.1 ${TENANT_NAME}-cdev.${TENANT_URL}" >> /etc/hosts
```

#### Mac

```
echo "127.0.0.1 ${TENANT_NAME}-cdev.${TENANT_URL}" | sudo tee -a /etc/hosts
```

#### Windows

Windows stores the `hosts` file at `C:\Windows\System32\drivers\etc\`. To modify the file:

1. Open a Notepad as an Administrator.
2. In the notepad, go to **File > Open** and navigate to `C:\Windows\System32\drivers\etc\`.
3. The `hosts` file won’t be visible by default because it doesn’t have a file extension. To make it visible, change the file type filter from **Text Documents (.txt)** to **All File (.*)**, and then select the `hosts` file. 
4. After opening the file, you can add your entry at the end of the file, following the format in the above examples for Linux and Mac.

```
127.0.0.1 ${TENANT_NAME}-cdev.${TENANT_URL}
```

These commands append your tenant’s domain to the `etc`

#### **Running Locally**

After configuring your proxy, follow the steps below to run the application on your local machine:



1. Install the necessary dependencies

```
yarn install
```

2. Next, start your local server. 

```
yarn start
```

## **How to setup the Backend (Server)**

The backend server facilitates vehicle creation, update, and lifecycle management. It also provides a baseline reference on how to model a vehicle or any other participant in a logistics network such as a Facility using the Participant Service. In particular this demonstrates the following:

* Generating access token
* Communicating with Participant Service

### **Setup**

1. Install dependencies: `yarn`.
2. Rename your `.env.local.skeleton` to `.env.local`.
3. Add values for each required variable in the `.env.local` file. These details are available on your app summary page in the Developer Portal. Refer to the [Getting Started with the OS1 Platform](https://docs.getos1.com/docs/getting-started-1#step-5-retrieving-and-using-your-platform-credentials) guide for obtaining these details.  

### **Running the App**

1. Start your application: `yarn start`.
2. The `Vehicle's` participant type and vehicle attributes will be defined during the application startup if they don't exist.