# accessABLE

**accessABLE** provides a space where users can search for local businesses and submit a review of a business's accessibility.

[accessable.herokuapp.com](https://accessable.herokuapp.com "accessABLE")

![accessABLE Home](dev_images/desktop_home.png "accessABLE Home") *accessABLE Home*


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

### Icons ###
I would like to credit [The Accessible Icon Project](http://accessibleicon.org/ "The Accessible Icon Project") for the following icon that I used throughout this project: ![accessible icon](dev_images/accessible_icon_lg.png "accessible icon")

I created the following svg icons through [Vectr.com](https://vectr.com/ "Vectr"):
![accessABLE icon](public/images/accessABLE_icon.svg "accessABLE icon")
![small accessABLE icon](public/images/accessABLE_icon_small.svg "accessABLE icon")
![parking icon](public/images/parking_icon.svg "parking icon")
![entrance icon](public/images/enter_exit_icon.svg "entrance icon")
![interior navigation icon](public/images/interior_navigation.svg "interior navigation")
![customer service icon](public/images/customer_service_icon.svg "customer service icon")
![bathroom icon](public/images/bathroom_icon.svg "bathroom icon")
![service animal icon](public/images/service_dog_icon.svg "service animal icon")

### Desktop View Examples ###
![accessABLE login](dev_images/desktop_login.png "accessABLE login")  
*login*
* * *
![accessABLE user registration](dev_images/desktop_user_reg.png "accessABLE user registration")  
*user registration*
* * *
![accessABLE search results](dev_images/desktop_results.png "accessABLE search results")  
*search results*
* * *
![accessABLE single result](dev_images/desktop_single_result.png "accessABLE single result")  
*single result*
* * *
![accessABLE review](dev_images/desktop_review.png "accessABLE review")  
*review*
* * *
![accessABLE review textbox](dev_images/desktop_review_textbox.png "accessABLE review textbox")  
*review textbox*

### Mobile View Examples ###
![accessABLE mobile home](/dev_images/mobile_home.jpg "accessABLE mobile home")  
*home*
* * *
![accessABLE mobile search results](/dev_images/mobile_results.jpg "accessABLE mobile search results")  
*search results*
* * *
![accessABLE mobile review percentages](/dev_images/mobile_review_percentages.jpg "accessABLE mobile review percentages")  
*review icons and percentages*
* * *
![accessABLE mobile review submit](/dev_images/mobile_review_submit.jpg "accessABLE mobile review submit")  
*review submit*