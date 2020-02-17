class ApplicationController < ActionController::API
    def encode_token(id)
        # encoding user id using jwt 
        JWT.encode({user_id: id}, Rails.application.credentials[:jwt_token])
      end
    
      def get_auth_header
        # checck Authorization header
        request.headers["Authorization"]
      end
    
      def decoded_token
        # decoding user id using jwt 
        begin
          JWT.decode(get_auth_header, Rails.application.credentials[:jwt_token])[0]["user_id"]
        rescue
          nil
        end
      end
    
      def session_user
        # find user by id from decoded token
        User.find_by(id: decoded_token)
      end
    
      def logged_in?
        # boolean value of session_user
        !!session_user
      end
end
