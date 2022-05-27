# InvestorSpace
Code challenge for Surfboard (AKA Daommo) - InvestorSpace is the future platform for investor meetings!

#Setting Up
Begin by cloning this repo to your local machine. Then run the following command to install all dependencies:
```
yarn install
```
Once set up, head over to [Daily.co](https://www.daily.co/). Create an account and retrieve your API Key. Then, create a file called
```
env.local
```
in the root of the project. Add the following values to set it up properly:
```
# Domain excluding 'https://' and 'daily.co' e.g. 'somedomain'
DAILY_DOMAIN=YOUR_DOMAIN

# Obtained from https://dashboard.daily.co/developers
DAILY_API_KEY=YOUR_API_KEY

# Daily REST API endpoint
DAILY_REST_DOMAIN=https://api.daily.co/v1
```
Once set up, run the following command to start the project:
```
yarn dev
```
