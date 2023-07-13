
# **Overview**

The Vehicle Reference app is specially designed to assist developers in creating a web application that can efficiently manage logistics network participants such as vehicles through the participant service. Moreover, the app is seamlessly integrated with [Console](https://docs.getos1.com/docs/console-ui-overview), which is a workspace that provides users with access to all your web applications in one place. 

**Note:** Follow the steps below to run the app in your local machine. 


## **Application Organization**

The app is organized into two parts:

**1. Front-End Client:** This provides the user interface for the vehicle creation and management.

**2. Backend Server:** Enables creation, updates, and lifecycle management for Vehicles by using the participant service at the backend. The Vehicle object is modeled using the [Participant Service](https://docs.getos1.com/docs/creating-participants).


# **How to set up**

Developers need to first register an app in the developer portal and obtain credentials for the app. Refer to the [Getting Started with the OS1 Platform](https://docs.getos1.com/docs/getting-started-1#step-4-register-an-app) guide for registering an app and obtaining credentials. 

**Note:** Be sure to select **web app** for the app type.

## **Setting up the Front-End (Client)**

Follow the steps below to get started with the front-end client:

### **Configure Proxy**

To ensure successful authentication, you must configure your  `/etc/hosts` file on your local machine to handle traffic as a domain name. To accomplish this, you can set up your Tenant URL using a Nix compatible shell.


1. The first step is to look up your Tenant URL in the [Developer Portal. ](https://portal.getos1.com/#/login)You can view the instructions for obtaining your Tenant URL in our [Getting Started with the OS1 Platform](https://docs.getos1.com/docs/getting-started-1#step-5-retrieving-and-using-your-platform-credentials) guide. 
2. Open a Nix Shell and execute the following commands:

```
TENANT_NAME=<Add your tenant name here>
TENANT_URL=<Add your tenant url here>
```
3. Update your `/etc/hosts` file:


#### Linux

```
echo "$(echo "127.0.0.1 ${TENANT_URL//https:\/\/$TENANT_NAME/$TENANT_NAME-cdev}")" >> /etc/hosts
```

#### Mac

```
echo "$(echo "127.0.0.1 ${TENANT_URL//https:\/\/$TENANT_NAME/$TENANT_NAME-cdev}")" | sudo tee -a /etc/hosts
```

#### Example

127.0.0.1 os1devs-cdev.sandbox.getos1.com
Format will be:
IPAddress  <TenantId>-cdev.<BaseDomainUrlFromTenantUrl>

#### Windows

Windows stores the `hosts` file at `C:\Windows\System32\drivers\etc\`. To modify the file:

1. Open a *Notepad* as an *Administrator*.
2. In the notepad, go to **File > Open** and navigate to `C:\Windows\System32\drivers\etc\`.
3. The `hosts` file won’t be visible by default because it doesn’t have a file extension. To make it visible, change the file type filter from **Text Documents (.txt)** to **All File (.*)**, and then select the `hosts` file. 
4. After opening the file, you can add your entry at the end of the file, following the format in the above examples for Linux and Mac.

```
127.0.0.1 ${TENANT_URL//https:\/\/$TENANT_NAME/$TENANT_NAME-cdev}
```

These commands append your tenant’s domain to the `etc`

#### **Running Locally**

After configuring your proxy, you'll need to enter `cd client` to change to the client directory. Follow the steps below to run the application on your local machine:

1. Install the necessary dependencies

```
yarn install
```

2. Add all values required in the `.env file`. Developers can access the required values from the app summary page in the [Developer Portal](https://portal.getos1.com/#/login). See the required values
    1. client_id - this should be the frontend client id.
    2. App id - app id given on portal.
    3. Dev tenant id - tenant id given on portal.

	Refer to the [Getting Started with the OS1 Platform](https://docs.getos1.com/docs/getting-started-1#step-5-retrieving-and-using-your-platform-credentials) guide for obtaining these details.  

3. Next, start your local server using the configuured proxy URL.

```
yarn start
```

The app will start on localhost:4500. Put the proxy configured url in the browser to open the app.

## **How to setup the Backend (Server)**

The backend server facilitates vehicle creation, update, and lifecycle management. It also provides a baseline reference on how to model a vehicle or any other participant in a logistics network such as Facility using the Participant Service. The intention of this is to give the developer an easy point of reference for the following:

* Generating access token
* Communicating with Participant Service

### **Setup**

1. First, from the root of the directory enter `cd server`.
2. Install dependencies: `yarn`.
3. Rename your `.env.local.skeleton` to `.env.local`.
4. Add values for each required variable in the `.env.local` file. These details are available on your app summary page in the Developer Portal. Refer to the [Getting Started with the OS1 Platform](https://docs.getos1.com/docs/getting-started-1#step-5-retrieving-and-using-your-platform-credentials) guide for obtaining these details.  

### **Running the App**

1. Start your application: `yarn start`.
2. The `Vehicle's` participant type and vehicle attributes will be defined during the application startup if they don't exist.

The browser will open http://localhost:4500. However, you developers need to update the URL to `https://${TENANT_NAME}-cdev.${TENANT_URL}:4500` in order for the keycloak redirection to work. 