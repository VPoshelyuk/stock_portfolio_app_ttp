class CreateUsers < ActiveRecord::Migration[6.0]
  def change
    create_table :users do |t|
      t.string :name
      t.string :email
      t.string :password_digest
      t.decimal :balance, :precision => 1000, :scale => 2, :default => 5000.00

      t.timestamps
    end
  end
end
