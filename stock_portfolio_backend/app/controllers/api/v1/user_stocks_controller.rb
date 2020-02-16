class Api::V1::UserStocksController < ApplicationController
    require 'uri'
    require 'net/http'
    def user_recent
        user_stocks = UserStock.order('created_at DESC').select{ |check_user| check_user.user_id == params[:user_id]}
        render json: user_stocks
    end

    def user_all
        user_portfolio = UserPortfolio.find_by(user_id: params[:user_id])
        user_stocks = user_portfolio['stocks']
        user_stocks.map do |stock| 
            url = URI("https://cloud.iexapis.com/stable/stock/#{stock['ticker']}/quote?token=#{Rails.application.credentials[:iex_token]}&filter=latestPrice,change")
            http = Net::HTTP.new(url.host, url.port)
            http.use_ssl = true
            http.verify_mode = OpenSSL::SSL::VERIFY_NONE

            request = Net::HTTP::Get.new(url)
            request["cache-control"] = 'no-cache'

            response = http.request(request)
            data = JSON.parse(response.body)

            stock['price'] = data['latestPrice']
            stock['value'] = (data['latestPrice'].to_f * stock['quantity'].to_i).round(2)

            if(data['change'].to_f > 0)
                stock['color'] = "green"
            elsif(data['change'].to_f < 0)
                stock['color'] = "red"
            end

        end
        user_portfolio.update(:stocks => user_stocks)

        # user_stocks = UserStock.select{ |check_user| check_user.user_id == params[:user_id]}
        # ret_val = []
        # quantity = 0
        # arr = user_stocks.sort_by{|stock| stock['ticker']}
        # arr.each_with_index do |stock, i|
        #     if(arr[i+1] && stock['ticker'] == arr[i+1]['ticker'])
        #         if(stock['status'] == "BUY")
        #             quantity = quantity + stock['quantity'].to_i
        #         elsif(stock['status'] == "SELL")
        #             quantity = quantity - stock['quantity'].to_i
        #         end
        #     else
        #         url = URI("https://cloud.iexapis.com/stable/stock/#{stock['ticker']}/quote?token=#{Rails.application.credentials[:iex_token]}&filter=companyName,symbol,latestPrice,previousClose,change,avgTotalVolume")
        #         http = Net::HTTP.new(url.host, url.port)
        #         http.use_ssl = true
        #         http.verify_mode = OpenSSL::SSL::VERIFY_NONE
    
        #         request = Net::HTTP::Get.new(url)
        #         request["cache-control"] = 'no-cache'
    
        #         response = http.request(request)
        #         data = JSON.parse(response.body)
                
        #         if(stock['status'] == "BUY")
        #             quantity = quantity + stock['quantity'].to_i
        #         elsif(stock['status'] == "SELL")
        #             quantity = quantity - stock['quantity'].to_i
        #         end

        #         value = quantity * data['latestPrice'].to_f.round(2)
        #         color = "gray"
        #         if(data['change'].to_f > 0)
        #             color = "green"
        #         elsif(data['change'].to_f < 0)
        #             color = "red"
        #         end
        #             ret_val.push(
        #             {
        #                 "ticker" => stock['ticker'],
        #                 "quantity" => quantity,
        #                 "value" => value.to_f.round(2),
        #                 "price" => data['latestPrice'].to_f.round(2),
        #                 "color" => color
        #             }
        #         ) if(quantity != 0)
        #         quantity = 0
        #     end
        # end
        # render json: ret_val
        render json: user_stocks
    end


    def create
        user_stock = UserStock.create(user_stocks_params)
        if user_stock.save
            user_portfolio = UserPortfolio.find_by(user_id: params[:user_id])
            portfolio = user_portfolio['stocks']
            if(!portfolio.find{|stock| stock['ticker'] == user_stock['ticker']}) 
                modified_user_stock = user_stock.attributes
                modified_user_stock['color'] = "gray"
                modified_user_stock['value'] = (params[:price].to_f * params[:quantity].to_f).round(2)
                portfolio.unshift(modified_user_stock)
            else
                portfolio.map do |stock| 
                    if(stock['ticker'] == user_stock['ticker'])
                    if(user_stock['status'] == "BUY")
                        stock['quantity'] = stock['quantity'].to_i + user_stock['quantity'].to_i
                    elsif(user_stock['status'] == "SELL")
                        stock['quantity'] = stock['quantity'].to_i - user_stock['quantity'].to_i
                    end
                end
            end
            portfolio.select!{|stock| stock['quantity'].to_i != 0}
            end
            user_portfolio.update(stocks: portfolio)
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
