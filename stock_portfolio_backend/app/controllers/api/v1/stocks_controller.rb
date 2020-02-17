class Api::V1::StocksController < ApplicationController
    require 'uri'
    require 'net/http'
    def search
        # request to the IEX server to get information regarding requested stock
        url = URI("https://cloud.iexapis.com/stable/stock/#{params[:ticker]}/quote?token=#{Rails.application.credentials[:iex_token]}&filter=companyName,symbol,latestPrice,previousClose,avgTotalVolume")
        http = Net::HTTP.new(url.host, url.port)
        http.use_ssl = true
        http.verify_mode = OpenSSL::SSL::VERIFY_NONE

        request = Net::HTTP::Get.new(url)
        request["cache-control"] = 'no-cache'

        response = http.request(request)
        # if requested ticker doesn't exist, IEX API returns "Unknown symbol" as a body, so there is no need to parse data
        data = JSON.parse(response.body) if(response.body != "Unknown symbol")
        
        if(response.read_body == "Unknown symbol")
            # render error
            render json: {error: "No such ticker in our system!"}
        elsif(data['avgTotalVolume'].to_i < params[:quantity].to_i)
            # if total volume of stocks is less then requested quantity, render error
            render json: {error: "Requested quantity is not available"}
        elsif(params[:user_balance].to_f.round(2) < params[:quantity].to_i * data['latestPrice'].to_f.round(2))
            # if user doesn't have enough money for the purchase, render error with all the information
            purchase_price = params[:quantity].to_i * data['latestPrice'].to_f
            render json: {
            error: "You don't have enough money to buy #{params[:quantity] == "1" ? "a share" : "shares"} of this stock!</br>
            Requested quantity: #{params[:quantity]} | Price per stock: #{data['latestPrice']}</br>
            Purchase price: #{purchase_price.to_f.round(2)}</br>Available Balance: #{params[:user_balance]}"
            }
        else
            # else render requested stock's information along with new balance and message that is rendered on the front end for confiramtion
            amount_due = params[:quantity].to_i * data['latestPrice'].to_f
            new_balance = params[:user_balance].to_f - amount_due
            render json: {
                stock_info: data, 
                new_balance: new_balance.to_f.round(2), 
                message: "Requested quantity: #{params[:quantity]} | Price per stock: #{data['latestPrice'].to_f.round(2)}</br>
                Amount due: #{amount_due.to_f.round(2)}</br>New Balance: #{new_balance.to_f.round(2)}</br>
                You want to finish this transaction?"
            }
        end
    end


    private

    def event_params
        params.permit(:ticker, :quantity, :user_balance)
    end
end
