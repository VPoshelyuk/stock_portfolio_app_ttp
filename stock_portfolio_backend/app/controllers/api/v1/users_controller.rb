=begin
  * @desc this class holds functions for user interactions
  * such as: show(used for test purposes only), create(used on sign up), 
  * update_balance(called on purchase or sale of stocks, updates user balance, renders new balance)
=end

class Api::V1::UsersController < ApplicationController
    def show
        user = User.find(params[:id])
        token = encode_token(user.id)
        render json: {user: user, token: token}
    end

    def create
        user = User.create(user_params)
        if user.save
            UserPortfolio.create(user_id: user.id)
            token = encode_token(user.id)
            render json: {user: user, token: token}
        else
            render json: { errors: user.errors.full_messages }
        end
    end

    def update_balance
        user = User.update(params[:id], balance: params[:balance])
        if user.save
            render json: {new_balance: user["balance"]}
        else
            render json: { errors: user.errors.full_messages }
        end
    end

    private

    def user_params
        params.permit(:id, :name, :email, :password, :balance)
    end
end
