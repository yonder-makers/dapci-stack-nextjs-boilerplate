DELETE from todo_item_assignees;

ALTER TABLE "todo_item_assignees"
DROP CONSTRAINT "todo_item_assignees_item_id_fkey";

-- DropIndex
DROP INDEX "todo_item_assignees_item_id_user_id_key";

-- AlterTable
ALTER TABLE "todo_item_assignees"
DROP COLUMN "item_id",
ADD COLUMN "todo_item_id" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "todo_item_assignees_todo_item_id_user_id_key" ON "todo_item_assignees" ("todo_item_id", "user_id");

-- AddForeignKey
ALTER TABLE "todo_item_assignees"
ADD CONSTRAINT "todo_item_assignees_todo_item_id_fkey" FOREIGN KEY ("todo_item_id") REFERENCES "todo_items" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;