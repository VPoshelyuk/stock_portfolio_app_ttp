class CreateUserPortfolios < ActiveRecord::Migration[6.0]
  def change
    create_table :user_portfolios do |t|
      t.references :user, null: false, foreign_key: true
      t.text :stocks

      t.timestamps
    end
  end
end
