class Api::V1::StocksController < ApplicationController
    require 'uri'
    require 'net/http'
    def search
        url = URI("https://cloud.iexapis.com/stable/stock/#{params[:ticker]}/quote?token=#{Rails.application.credentials[:iex_token]}&filter=companyName,symbol,latestPrice,previousClose,change,avgTotalVolume")
        http = Net::HTTP.new(url.host, url.port)
        http.use_ssl = true
        http.verify_mode = OpenSSL::SSL::VERIFY_NONE

        request = Net::HTTP::Get.new(url)
        request["cache-control"] = 'no-cache'

        response = http.request(request)
        data = JSON.parse(response.body) if(response.body != "Unknown symbol")

        if(response.read_body == "Unknown symbol")
            render json: {error: "No such ticker in our system!"}
        elsif(data['avgTotalVolume'].to_i < params[:quantity].to_i)
            render json: {error: "Requested quantity is not available"}
        elsif(params[:user_balance].to_f.round(2) < params[:quantity].to_i * data['latestPrice'].to_f.round(2))
            render json: {error: "You don't have enough money to buy these stocks!</br>Requested quantity: #{params[:quantity]} | Price per stock: #{data['latestPrice']}</br>Available Balance: #{params[:user_balance]}"}
        else
            amount_due = params[:quantity].to_i * data['latestPrice'].to_f
            new_balance = params[:user_balance].to_f - amount_due
            render json: {stock_info: data, new_balance: new_balance.to_f.round(2), message: "Requested quantity: #{params[:quantity]} | Price per stock: #{data['latestPrice'].to_f.round(2)}</br>Amount due: #{amount_due.to_f.round(2)}</br>New Balance: #{new_balance.to_f.round(2)}</br>You want to finish this transaction?"}
        end
    end


    private

    def event_params
        params.permit(:ticker, :quantity, :user_balance)
    end
end
