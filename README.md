# Vehicle Reference App

A reference app which demonstrates how to use the Core Participants service in order to create and manage a fleet of vehicles.

## Structure

This app exists as a monorepo containing a front end app called `client` and a backend one called `server`.

## A Note on Auth

As you develop your app, you'll go through several phases of auth implementation.

Our recommendation is as follows:

1. Start off with your back end app, and make all calls to CoreOS using your client id and secret from Developer Portal.
2. When you build your front end, you can do your initial validation around checking for token validity with the CoreOS AAA service. (We'll be releasing an example of this soon.)
3. As you get closer to publishing, you'll need to set up UMS (User Management Service), and then begin passing through the front end tokens (obtained from ConsoleUI) through to the CoreOS calls. This will ensure that the user is properly authorized to make such calls.
