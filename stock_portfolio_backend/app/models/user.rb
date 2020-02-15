class User < ApplicationRecord
    # validations
    validates :email, uniqueness: true
    validates :password, :presence => true, 
    :length => {:within => 6..40}, :on => :create
    has_secure_password
    # relationships
    has_many :user_stocks
    has_many :stocks, through: :user_stocks
end
