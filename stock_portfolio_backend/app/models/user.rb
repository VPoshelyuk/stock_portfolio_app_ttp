class User < ApplicationRecord
    # validations
    validates :email, uniqueness: true, :presence => true, :on => :create
    validates :name, :presence => true, :on => :create
    validates :password, :presence => true, 
    :length => {:within => 6..40}, :on => :create
    has_secure_password
    # relationships
    has_one :user_portfolio
    has_many :user_stocks
    has_many :stocks, through: :user_stocks
end
