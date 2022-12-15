# Vehicles Front End

Exposes a UI for managing vehicles.

## Getting started

### Configure proxy

You will need to configure your /etc/hosts file to serve traffic as a domain name for the authentication to work.

First, look up your tenant url in the Developer Portal. For example, if it's `https://dlvindia.preprod.dlv2.fxtrt.io`, then your `TENANT_URL` will be `preprod.dlv2.fxtrt.io`.

If using a \*nix shell:

    TENANT_NAME=<Add your tenant name here>
    TENANT_URL=<Add your tenant url here>

    # Most Linux distros
    echo "127.0.0.1 ${TENANT_NAME}-cdev.${TENANT_URL}" >> /etc/hosts

    # Macs
    echo "127.0.0.1 ${TENANT_NAME}-cdev.${TENANT_URL}" | sudo tee -a /etc/hosts

### Running locally

First, install dependencies with `yarn install`.

Then simply run `yarn start` to start up a local server (make sure you've configured your proxy above).
