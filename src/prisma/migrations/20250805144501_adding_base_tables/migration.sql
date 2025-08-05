-- CreateEnum
CREATE TYPE "public"."PaymentStatus" AS ENUM ('pending', 'confirmed', 'rejected');

-- CreateTable
CREATE TABLE "public"."Role" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "invitedBy" TEXT,
    "roleId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."MemberProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "monthlyShareCommitment" INTEGER NOT NULL,
    "phoneNumber" TEXT,
    "joinDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MemberProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ShareSetting" (
    "id" TEXT NOT NULL,
    "sharePrice" DECIMAL(10,2) NOT NULL,
    "activeFrom" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ShareSetting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Invite" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "acceptedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Invite_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Contribution" (
    "id" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "month" TIMESTAMP(3) NOT NULL,
    "amountPaid" DECIMAL(10,2) NOT NULL,
    "proofUrl" TEXT,
    "confirmedBy" TEXT,
    "status" "public"."PaymentStatus" NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Contribution_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Role_name_key" ON "public"."Role"("name");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "MemberProfile_userId_key" ON "public"."MemberProfile"("userId");

-- CreateIndex
CREATE INDEX "MemberProfile_userId_idx" ON "public"."MemberProfile"("userId");

-- CreateIndex
CREATE INDEX "MemberProfile_joinDate_idx" ON "public"."MemberProfile"("joinDate");

-- CreateIndex
CREATE INDEX "ShareSetting_activeFrom_idx" ON "public"."ShareSetting"("activeFrom");

-- CreateIndex
CREATE UNIQUE INDEX "Invite_token_key" ON "public"."Invite"("token");

-- CreateIndex
CREATE INDEX "Invite_userId_idx" ON "public"."Invite"("userId");

-- CreateIndex
CREATE INDEX "Invite_expiresAt_idx" ON "public"."Invite"("expiresAt");

-- CreateIndex
CREATE INDEX "Contribution_profileId_idx" ON "public"."Contribution"("profileId");

-- CreateIndex
CREATE INDEX "Contribution_month_idx" ON "public"."Contribution"("month");

-- CreateIndex
CREATE INDEX "Contribution_status_idx" ON "public"."Contribution"("status");

-- CreateIndex
CREATE INDEX "Contribution_confirmedBy_idx" ON "public"."Contribution"("confirmedBy");

-- AddForeignKey
ALTER TABLE "public"."User" ADD CONSTRAINT "User_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "public"."Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."MemberProfile" ADD CONSTRAINT "MemberProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Invite" ADD CONSTRAINT "Invite_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Contribution" ADD CONSTRAINT "Contribution_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "public"."MemberProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Contribution" ADD CONSTRAINT "Contribution_confirmedBy_fkey" FOREIGN KEY ("confirmedBy") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
