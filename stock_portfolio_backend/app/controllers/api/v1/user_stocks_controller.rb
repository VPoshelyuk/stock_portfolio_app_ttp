class Api::V1::UserStocksController < ApplicationController
    require 'uri'
    require 'net/http'
    def user_recent
        # renders all transactions associated with the user from newest to the oldest
        user_stocks = UserStock.order('created_at DESC').select{ |check_user| check_user.user_id == params[:user_id]}
        render json: user_stocks
    end

    def user_all
        user_portfolio = UserPortfolio.find_by(user_id: params[:user_id]) #find a portfolio belonging to the user
        user_stocks = user_portfolio['stocks']
        user_stocks.map do |stock| 
            # mapping through all the user's stocks to update current price/portfolio value & color
            url = URI("https://cloud.iexapis.com/stable/stock/#{stock['ticker']}/quote?token=#{Rails.application.credentials[:iex_token]}&filter=open,close,latestPrice,previousClose,iexRealtimePrice,isUSMarketOpen")
            http = Net::HTTP.new(url.host, url.port)
            http.use_ssl = true
            http.verify_mode = OpenSSL::SSL::VERIFY_NONE

            request = Net::HTTP::Get.new(url)
            request["cache-control"] = 'no-cache'

            response = http.request(request)
            data = JSON.parse(response.body)

            stock['price'] = data['latestPrice']
            stock['value'] = (data['latestPrice'].to_f * stock['quantity'].to_i).round(2)

            # sometimes when market is closed API returns null for "open"
            # so use "previousClose" instead if "open" is null
            cap = data['open'] ? 'open' : 'previousClose'

            # updating the color/checking for difference in latestPrice and 'open'/'previousClose'
            if((data['latestPrice'].to_f - data[cap].to_f) > 0)
                stock['color'] = "green"
            elsif((data['latestPrice'].to_f - data[cap].to_f) < 0)
                stock['color'] = "red"
            else
                stock['color'] = "gray"
            end
        end
        user_portfolio.update(:stocks => user_stocks)

# Different method to update user's portfolio//cons: creates a new array of objects on every run
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
        user_stock = UserStock.create(user_stocks_params) #creating a new UserStock
        if user_stock.save
            # if UserStock is successfully saved, find user portfolio
            user_portfolio = UserPortfolio.find_by(user_id: params[:user_id])
            portfolio = user_portfolio['stocks']
            if(!portfolio.find{|stock| stock['ticker'] == user_stock['ticker']}) 
                # if stock with given ticker, doesn't exist in portfolio yet, add it
                modified_user_stock = user_stock.attributes
                modified_user_stock['color'] = "gray"
                modified_user_stock['value'] = (params[:price].to_f * params[:quantity].to_f).round(2)
                portfolio.unshift(modified_user_stock)
            else
                # map through all the stocks in portfolio and update the one with corresponding ticker
                portfolio.map do |stock| 
                    if(stock['ticker'] == user_stock['ticker'])
                    if(user_stock['status'] == "BUY")
                        stock['quantity'] = stock['quantity'].to_i + user_stock['quantity'].to_i
                    elsif(user_stock['status'] == "SELL")
                        stock['quantity'] = stock['quantity'].to_i - user_stock['quantity'].to_i
                    end
                end
            end
            portfolio.select!{|stock| stock['quantity'].to_i != 0} #remove stocks with 0 quantity
            end
            user_portfolio.update(stocks: portfolio) # update portfolio with new stocks list
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
