class CreateStocks < ActiveRecord::Migration[6.0]
  def change
    create_table :stocks do |t|
      t.string :ticker
      t.decimal :price, :precision => 1000, :scale => 2

      t.timestamps
    end
  end
end
