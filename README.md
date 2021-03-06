# Stage 2 - TTP Project (Stockr)

Front end         |Back end
------------------|------------------
React + Redux     |Ruby on Rails
npm start         |rails s

### Important notes: <br/>
* All required features from the list down below(User Stories) are implemented.<br/>
* Plus, added ability to sell stocks: <br/>
> While at portfolio page *("/" if you are logged in)*, click on the card of the stock you want to sell, <br/>
> you will be prompted with options to sell shares of chosen stock!<br/>
* Mobile compatible \*_with all modern smartphones, that Stockr was tested on_\*<br/>
* While testing the IEX API I noticed that sometimes "open" returns **null**, to prevent program from carshing<br/> 
or giving out unexpected outputs, if API returns null for "open", all the checks for prices to indicate performance<br />
are going to be based on "lastClosing" parameter instead. <br />



<br/>

### User Stories (6): <br/>
 
✅1. As a user, I want to create a new account with my name, email, and password so that I can buy and 
trade stocks:<br/>
✔ Default the user’s cash account balance to $5000.00 USD. <br/>
✔ A user can only register once with any given email. <br/>
 <br/>
✅2. As a user, I want to authenticate via email and password so that I can access my account. <br/>
 <br/>
✅3. As a user, I want to buy shares of stock at its current price by specifying its ticker symbol and the 
number of shares so that I can invest: <br/>
✔ A user can only buy whole number quantities of shares. <br/>
✔ A user can only buy shares if they have enough cash in their account for a given purchase. <br/>
✔ A user can only buy shares if the ticker symbol is valid. <br/>
 <br/>
✅4. As a user, I want to view a list of all transactions I’ve made to date (trades) so that I can perform an 
audit. <br/>
 <br/>
✅5. As a user, I want to view my portfolio (a list of all the stocks I own along with their current values) so 
that I can review performance. <br/>
✔ Current values should be based on the latest price and quantity owned for a given stock. <br/>
✔ Each stock owned should only appear once. <br/>
 <br/>
✅6. As a user, I’d like to see the font color of stock symbols and current prices in my portfolio change 
dynamically to indicate performance. <br/>
✔ Display red when the current price is less than the day’s open price. <br/>
✔ Display grey when the current price is equal to the day’s open price. <br/>
✔ Display green when the current price is greater than the day’s open price. <br/>

