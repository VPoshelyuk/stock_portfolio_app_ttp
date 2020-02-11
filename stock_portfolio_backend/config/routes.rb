Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      resources :users
      resources :user_stocks
      post "/search", to: "stocks#search"
      post "/signup", to: "users#create"
      post "/login", to: "auth#login"
      get "/auto_login", to: "auth#auto_login"
    end
  end
end
