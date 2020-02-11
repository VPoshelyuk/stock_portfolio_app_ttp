class Api::V1::StocksController < ApplicationController
    require 'uri'
    require 'net/http'
    def search
        url = URI("https://cloud.iexapis.com/stable/stock/#{params[:ticker]}/quote?token=#{Rails.application.credentials[:iex_token]}")
        http = Net::HTTP.new(url.host, url.port)
        http.use_ssl = true
        http.verify_mode = OpenSSL::SSL::VERIFY_NONE

        request = Net::HTTP::Get.new(url)
        request["cache-control"] = 'no-cache'

        response = http.request(request)
        if(response.read_body == "Unknown symbol")
            render json: {error: response.read_body}, status: :unprocessible_entity
        else
            render json: response.read_body
        end
    end


    private
    
    def event_params
        params.permit(:ticker)
    end
end
