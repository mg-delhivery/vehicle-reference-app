# Vehicle Reference App
An app that gives the user the ability to create, update, and transition vehicles through their lifecycle.  The intention of this is to give the developer an easy point of reference for a few things:
- Generating access token
- Communicating with Participant Service

## Setup
- Run `yarn`
- change the name of your `.env.local.skeleton` to `.env.local`
  - Fill out the required fields (all can be grabbed from your app summary page in Dev Portal)

## Running the app
- Run `yarn start`
  - Vehicles participant type will be created during startup if it doesn't already exist.
  - Vehicle attributes will be defined during startup
