class Api::V1::UsersController < ApplicationController
    def show
        user = User.find(params[:id])
        token = encode_token(user.id)
        render json: {user: user, token: token}
    end

    def create
        user = User.create(user_params)
        if user.save
            token = encode_token(user.id)
            render json: {user: user, token: token}
        else
            render json: { errors: user.errors.full_messages }
        end
    end

    private

    def user_params
        params.permit(:user_id, :name, :email, :password)
    end
end
