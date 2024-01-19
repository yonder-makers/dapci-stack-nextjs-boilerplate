-- AlterTable
ALTER TABLE "todo_lists" ADD COLUMN "company_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "todo_lists"
ADD CONSTRAINT "todo_lists_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;