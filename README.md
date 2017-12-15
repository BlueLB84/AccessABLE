# accessABLE

**accessABLE** provides a space where users can search for local businesses and submit a review of a business's accessibility.

[accessable.herokuapp.com](https://accessable.herokuapp.com "accessABLE")

![accessABLE Home](dev_images/desktop_home.png "accessABLE Home")


## Overview ##
**accessABLE** is a full stack web application that allows users to search for a business or establishment using the Google Places API. After a general or specific search, the user is able to select a single business in order to see the business's accessibilty reviews and ratings. In order to review a business, a user can register for access to *accessABLE* (using [passportjs.org](http://www.passportjs.org/ "Passport")). After initial registration, the user is able to log in with their username and password and review a business.  A review consists of answering YES or NO to six accessibility statements.  The user is also able to enter a text review before submitting their review.  

### Technology Stack ###
*  Front-end technologies
    +  HTML, CSS, JavaScript, jQuery, JSON
*  Server technologies
    +  Node.js, Express, Passport.js, MongoDB, Mongoose, Chai, Axios, Pug, Google Places API
*  Development Environment
    +  Sublime Text, Postman
* Additional Tools
    +  Google Fonts, Font Awesome, Flexbox


### Desktop View Examples ###
![accessABLE login](dev_images/desktop_login.png "accessABLE login")  
![accessABLE user registration](dev_images/desktop_user_reg.png "accessABLE user registration")  
![accessABLE search results](dev_images/desktop_results.png "accessABLE search results")  
![accessABLE single result](dev_images/desktop_single_result.png "accessABLE single result")  
![accessABLE review](dev_images/desktop_review.png "accessABLE review")  
![accessABLE review textbox](dev_images/desktop_review_textbox.png "accessABLE review textbox")  

* * *

### Mobile View Examples ###
![accessABLE mobile home](/dev_images/mobile_home.jpg "accessABLE mobile home")  
![accessABLE mobile search results](/dev_images/mobile_results.jpg "accessABLE mobile search results")  
![accessABLE mobile review percentages](/dev_images/mobile_review_percentages.jpg "accessABLE mobile review percentages")  
![accessABLE mobile review submit](/dev_images/mobile_review_submit.jpg "accessABLE mobile review submit")