class CreateUserStocks < ActiveRecord::Migration[6.0]
  def change
    create_table :user_stocks do |t|
      t.references :user, null: false, foreign_key: true
      t.string :ticker
      t.integer :quantity
      t.decimal :price, :precision => 1000, :scale => 2
      t.string :status

      t.timestamps
    end
  end
end
