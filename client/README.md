# Vehicles Front End

Exposes a UI for managing vehicles.

## Getting started

### Configure proxy

You will need to configure your /etc/hosts file to serve traffic as a domain name for the authentication to work.

To  run it on localhost, You have to setup your tenant Url as a proxy server. There are multiple ways to setup proxy server. One of the ways is to setup via nginx.

## To setup proxy server using Nginx, follow these steps:-

1.  sudo apt-get update
2.  sudo apt-get install nginx
3.  sudo cp /etc/nginx/sites-available/default /etc/nginx/sites-available/local`PortNumber` 

    local`PortNumber` should contain following code:
    ```
    server {
    listen 443 ssl;
    server_name ${TENANT_NAME}-cdev.${TENANT_URL}";

            ssl_certificate localhost.crt;
            ssl_certificate_key localhost.key;

            # index index.html index.htm index.nginx-debian.html;
            location/{
            }
            proxy_pass https://localhost:${PortNumber};
            }
    ```

You have to generate certificate using this link:- https://imagineer.in/blog/https-on-localhost-with-nginx/

4. sudo In -s /etc/nginx/sites-available/local`PortNumber` /etc/nginx/sites-enabled/ 5. sudo nano /etc/hosts add the code below:
   127.0.0.1  ${TENANT_NAME}-cdev.${TENANT_URL}"

5. sudo nginx -t
6. sudo systemctl restart nginx

### Running locally

- change script file to PORT=`PortNumber` HTTPS=true react-scripts start

    `Note:- portNumber is the port on which our client application is running in localhost. In our case, client is running on port 4500. `

First, install dependencies with `npm install`.

Then simply run `npm start` to start up a local server (make sure you've configured your proxy above).
