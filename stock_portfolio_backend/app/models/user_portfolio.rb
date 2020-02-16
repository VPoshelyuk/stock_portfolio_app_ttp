class UserPortfolio < ApplicationRecord
  belongs_to :user
  # serializers
  serialize :stocks, Array
end
