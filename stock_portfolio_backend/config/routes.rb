Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      # auth resources
      post "/login", to: "auth#login" #log in with email and password, returns user object
      get "/auto_login", to: "auth#auto_login" #used if user has a token in local storage, returns user object
      # user resources
      resources :users, :only => [:show, :create]
      patch "/update_balance", to: "users#update_balance" #PATCH user balance, needs 2 params: user_id & new_balance, returns new balance
      post "/signup", to: "users#create" #sign up for a new account(create account) with name, email & password, returns new user object
      # user_stock resources
      resources :user_stocks, :only => [:create]
      post "/user_recent", to: "user_stocks#user_recent" #returns all user's past transactions, requires only user_id
      post "/user_all", to: "user_stocks#user_all" #calculates and returns current worth of all obtained stocks, requires only user_id
      # stock resources
      post "/search", to: "stocks#search" #search retrieves inforvation from external API, returns stock info
    end
  end
end
