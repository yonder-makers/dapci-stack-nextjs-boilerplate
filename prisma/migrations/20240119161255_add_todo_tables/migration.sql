-- CreateTable
CREATE TABLE "todo_lists" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,


CONSTRAINT "todo_lists_pkey" PRIMARY KEY ("id") );

-- CreateTable
CREATE TABLE "todo_items" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "list_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,


CONSTRAINT "todo_items_pkey" PRIMARY KEY ("id") );

-- AddForeignKey
ALTER TABLE "todo_items"
ADD CONSTRAINT "todo_items_list_id_fkey" FOREIGN KEY ("list_id") REFERENCES "todo_lists" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;