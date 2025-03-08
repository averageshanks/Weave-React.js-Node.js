-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "organization" TEXT;

-- AlterTable
ALTER TABLE "Task" ALTER COLUMN "deadline" SET DEFAULT NOW() + interval '7 day';
