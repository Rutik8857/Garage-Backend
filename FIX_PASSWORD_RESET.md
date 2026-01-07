# How to Fix the Password Reset Functionality

It appears that the password reset functionality is not working because of a missing database update. The `users` table in your database is missing the `reset_token` and `reset_token_expiry` columns, which are required to store password reset tokens.

To fix this, you need to run the database migration script that was created for this purpose.

## Step 1: Open a terminal

Open a new terminal or command prompt.

## Step 2: Navigate to the server directory

In your terminal, navigate to the `server` directory of your project:

```sh
cd c:\Users\Admin\Desktop\next\next\server
```

## Step 3: Run the migration script

Execute the following command to run the migration script:

```sh
node runMigration.js
```

This script will add the required columns to your `users` table. It is safe to run this script multiple times.

After running the script, the password reset functionality should work as expected.
