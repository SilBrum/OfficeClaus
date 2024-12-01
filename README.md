# Overview

🎅 Tired of drawing names out of a hat for your Secret Santa? Hats are old-school. Introducing the Secret Santa App, the modern way to organize your gift exchange without the hassle—or the handwriting.

Just input your participants' names and emails, hit a button, and voilà! Pairings are magically (and randomly) created. Everyone gets their assignment via email, and you get to look like a holiday hero with zero effort.

✨ This app keeps the magic alive while saving you from the inevitable "Who didn’t get a name?" disaster.

Go ahead, spread the holiday cheer without breaking a sweat—or a pen. 🎁

## Features
* Participant Management: Add participants with their names and emails.

* Random Pairings: Automatically generate pairings without repetition.

* Email Notifications: Sends each participant their Secret Santa assignment via email.

* Confirmation Screen: Provides feedback after pairings are completed.

* Google OAuth Integration: Sign in using Google to send emails securely.

* Clean UI: Simple and intuitive interface for ease of use.

## Technologies Used
React Native: For the mobile application.

Node.js & Express: Backend for email functionality.

Google OAuth: To authenticate and send emails securely.

Async Storage: For temporary token storage.

# Getting Started

### Clone the Repository:
```
git clone https://github.com/SilBrum/OfficeClaus
cd secret-santa-app

```

### Install Dependencies:

```
npm install
cd ios && pod install && cd ..
```

### Set Up Environment Variables:
* Create a .env file in the root of your project.
* Add the following environment variables:

```
CLIENT_ID=your-google-client-id.apps.googleusercontent.com
CLIENT_SECRET=your-google-client-secret
REDIRECT_URI=com.yourapp:/oauth2redirect
BACKEND_URL=http://localhost:3001

```

### Run the Backend Server:

```
cd server
node sendEmails.js
```

### Start the App:
```
npx react-native run-ios
```

### Future Improvements
* Allow users to customize email messages.

* Enable saving and editing participants in the app.

* Add push notifications for pairing updates.
