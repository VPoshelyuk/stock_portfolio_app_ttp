class User < ApplicationRecord
    validates :email, uniqueness: true
    has_secure_password
    validates_presence_of :password, :on => :create
    has_many :user_stocks
    has_many :stocks, through: :user_stocks
end
