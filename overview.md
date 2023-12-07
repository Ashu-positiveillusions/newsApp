
Overview
Purpose of the app 
Newsapp is an app that fetches the top 100 news headlines, stores them for offline access, displays them in a dynamic list view, and allows user interaction.
Core functionalities : it will display 10 headlines at a time and will update 5 headlines every 10 seconds. Users can PIN a headline by swiping right from left and DELETE a headline by swiping right to left.
Setup
Prerequisites: Node, React native setup, Xcode and android studio
Clone the repository using following command
git clone  https://github.com/Ashu-positiveillusions/newsApp.git
Install the dependencies
npm install
To run for ios/android
npm run ios
npm run android

Components and screen
Splash screen - which loads when the app is opened
Dashboard screen - it lists the headlines and also shows the headlines which are pinned.
Header component - it creates the header which is to be displayed at the top of the dashboard screen.

Background Tasks
Using react-native-background-fetch package to schedule a background task that will fetch the articles from newsapi.org and save them in the async storage.
These headlines will be displayed when the user opens the app and this ensures that headlines are shown even in the case of no internet availability.

Persistent storage
For this we are using react-native-async-storage/async-storage. The app will check if the async storage has the headlines and it will show those headlines, in case if there are not any headlines in the async storage then it will fetch it.

APIs
https://newsapi.org/v2/top-headlines?country=us&apiKey=${API_KEY}&pageSize=100
To fetch the top 100 headlines
API_KEY needs to be created by creating an account on newsapi.org website.
Environment variables
API_KEY
This will contain the api key generated from the above newsapi.org.
