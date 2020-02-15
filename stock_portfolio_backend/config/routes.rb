Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      resources :users, :only => [:show, :create, :update]
      resources :user_stocks, :only => [:create]
      patch "/update_balance", to: "users#update_balance"
      post "/user_recent", to: "user_stocks#user_recent"
      post "/user_all", to: "user_stocks#user_all"
      post "/search", to: "stocks#search"
      post "/signup", to: "users#create"
      post "/login", to: "auth#login"
      get "/auto_login", to: "auth#auto_login"
    end
  end
end
