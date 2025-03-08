-- AlterEnum
ALTER TYPE "Role" ADD VALUE 'Organization';

-- AlterTable
ALTER TABLE "Task" ALTER COLUMN "deadline" SET DEFAULT NOW() + interval '7 day';

-- CreateTable
CREATE TABLE "Notification" (
    "notificationID" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "timeOfDeliver" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL DEFAULT 'unread',
    "userId" TEXT NOT NULL,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("notificationID")
);

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
