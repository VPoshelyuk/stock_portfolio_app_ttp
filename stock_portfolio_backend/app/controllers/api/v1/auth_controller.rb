=begin
  * @desc this class holds functions for auth interactions
  * login(renders user and auth token if user exists and password can be authenicated by bcrypt), 
  * auto_login(checks if user with the given token exists, 
  * renders user information amd reencoded token)
=end

class Api::V1::AuthController < ApplicationController

    def login
      user = User.find_by(email: params[:email])

      if user && user.authenticate(params[:password])
        token = encode_token(user.id)
        render json: {user: user, token: token}
      else
        render json: {errors: "No email/password match!"}
      end
    end
  
    def auto_login
      if session_user
        token = encode_token(session_user.id)
        render json: {user: session_user, token: token}
      else 
        render json: {errors: "Auto-login failed!"}
      end
      
    end
end