class Api::V1::UserFavoritesController < ApplicationController
    def user_recent
        user_stocks = UserStocks.select{ |check_user| check_user.user_id == params[:user_id]}
        render json: user_stocks
    end

    def user_all
        user_stocks = UserStocks.select{ |check_user| check_user.user_id == params[:user_id]}
        ret_val = []
        obj = user_stocks.group_by{|x| "#{x['name']}".to_sym}
        obj.each do |key, value|
            count = 0
            value.each do |stock|
                if stock['status'] == 'buy'
                count = count + stock['num_of_shares'].to_i
                else
                    count = count + stock['num_of_shares'].to_i
                end
            end
            url = URI("https://cloud.iexapis.com/stable/stock/#{value[0]['name']}/quote?token=#{Rails.application.credentials[:iex_token]}")
            http = Net::HTTP.new(url.host, url.port)
            http.use_ssl = true
            http.verify_mode = OpenSSL::SSL::VERIFY_NONE

            request = Net::HTTP::Get.new(url)
            request["cache-control"] = 'no-cache'

            response = http.request(request)
            data = JSON.parse(response.body)
            ret_val.push(
            {
                "name" => value[0]['name'],
                "num_of_shares" => count,
                "value" => count * data['latestPrice'].to_i
            }
            )
        end
        render json: ret_val
    end


    def create
        user_stocks = UserStocks.find_or_create_by(user_stockss_params)
        if user_stocks.save
            render json: user_stocks
        else
            render json: { errors: user_stocks.errors.full_messages }, status: :unprocessible_entity
        end
    end

    private

    def user_stockss_params
        params.permit(:user_id, :name, :number, :price, :status)
    end
end
