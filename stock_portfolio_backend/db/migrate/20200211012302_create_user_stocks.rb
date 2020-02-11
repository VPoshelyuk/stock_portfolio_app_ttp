class CreateUserStocks < ActiveRecord::Migration[6.0]
  def change
    create_table :user_stocks do |t|
      t.references :user, null: false, foreign_key: true
      t.string :name
      t.integer :number
      t.integer :price
      t.string :status

      t.timestamps
    end
  end
end
