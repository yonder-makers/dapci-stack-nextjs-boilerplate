CREATE TABLE "todo_item_assignees" (
    "item_id" TEXT NOT NULL, "user_id" TEXT NOT NULL, "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updated_at" TIMESTAMP(3) NOT NULL
);

CREATE UNIQUE INDEX "todo_item_assignees_item_id_user_id_key" ON "todo_item_assignees" ("item_id", "user_id");

ALTER TABLE "todo_item_assignees"
ADD CONSTRAINT "todo_item_assignees_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "todo_items" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "todo_item_assignees"
ADD CONSTRAINT "todo_item_assignees_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;