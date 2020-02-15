class Api::V1::UserStocksController < ApplicationController
    require 'uri'
    require 'net/http'
    def user_recent
        user_stock = UserStock.order('created_at DESC').select{ |check_user| check_user.user_id == params[:user_id]}
        render json: user_stock
    end

    def user_all
        user_stock = UserStock.select{ |check_user| check_user.user_id == params[:user_id]}
        ret_val = []
        quantity = 0
        arr = user_stock.sort_by{|stock| stock['ticker']}
        arr.each_with_index do |stock, i|
            if(arr[i+1] && stock['ticker'] == arr[i+1]['ticker'])
                if(stock['status'] == "BUY")
                    quantity = quantity + stock['quantity'].to_i
                elsif(stock['status'] == "SELL")
                    quantity = quantity - stock['quantity'].to_i
                end
            else
                url = URI("https://cloud.iexapis.com/stable/stock/#{stock['ticker']}/quote?token=#{Rails.application.credentials[:iex_token]}&filter=companyName,symbol,latestPrice,previousClose,change,avgTotalVolume")
                http = Net::HTTP.new(url.host, url.port)
                http.use_ssl = true
                http.verify_mode = OpenSSL::SSL::VERIFY_NONE
    
                request = Net::HTTP::Get.new(url)
                request["cache-control"] = 'no-cache'
    
                response = http.request(request)
                data = JSON.parse(response.body)
                
                if(stock['status'] == "BUY")
                    quantity = quantity + stock['quantity'].to_i
                elsif(stock['status'] == "SELL")
                    quantity = quantity - stock['quantity'].to_i
                end

                value = quantity * data['latestPrice'].to_f.round(2)
                color = "gray"
                if(data['change'].to_f > 0)
                    color = "green"
                elsif(data['change'].to_f < 0)
                    color = "red"
                end
                    ret_val.push(
                    {
                        "ticker" => stock['ticker'],
                        "companyName" => data['companyName'],
                        "quantity" => quantity,
                        "value" => value.to_f.round(2),
                        "current_price" => data['latestPrice'].to_f.round(2),
                        "color" => color
                    }
                ) if(quantity != 0)
                quantity = 0
            end
        end
        render json: ret_val
        # user_stock = UserStock.order('created_at DESC').select{ |check_user| check_user.user_id == params[:user_id]}
        # ret_val = []
        # obj = user_stock.group_by{|x| "#{x['ticker']}".to_sym}
        # obj.each do |key, value|
        #     count = 0
        #     value.each do |stock|
        #         if stock['status'] == 'BUY'
        #             count = count + stock['quantity'].to_i
        #         else
        #             count = count - stock['quantity'].to_i
        #         end
        #     end
            # url = URI("https://cloud.iexapis.com/stable/stock/#{value[0]['ticker']}/quote?token=#{Rails.application.credentials[:iex_token]}&filter=symbol,latestPrice,previousClose,change,avgTotalVolume")
            # http = Net::HTTP.new(url.host, url.port)
            # http.use_ssl = true
            # http.verify_mode = OpenSSL::SSL::VERIFY_NONE

            # request = Net::HTTP::Get.new(url)
            # request["cache-control"] = 'no-cache'

            # response = http.request(request)
            # data = JSON.parse(response.body)
            # val = count * data['latestPrice']
        #     ret_val.push(
        #     {
        #         "ticker" => value[0]['ticker'],
        #         "quantity" => count,
        #         "value" => val.to_f.round(2)
        #     }
        #     )
        # end
    end


    def create
        user_stock = UserStock.create(user_stocks_params)
        if user_stock.save
            render json: user_stock
        else
            render json: { errors: user_stock.errors.full_messages }
        end
    end

    private

    def user_stocks_params
        params.permit(:user_id, :ticker, :quantity, :price, :status)
    end
end
