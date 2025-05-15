BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[Balance] (
    [id] NVARCHAR(1000) NOT NULL,
    [current] INT NOT NULL,
    [income] INT NOT NULL,
    [expenses] INT NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Balance_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [Balance_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Transaction] (
    [id] NVARCHAR(1000) NOT NULL,
    [avatar] NVARCHAR(1000) NOT NULL,
    [name] NVARCHAR(1000) NOT NULL,
    [date] DATETIME2 NOT NULL,
    [amount] INT NOT NULL,
    [categoryId] NVARCHAR(1000) NOT NULL,
    [recurringBillId] NVARCHAR(1000),
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Transaction_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [Transaction_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[RecurringBill] (
    [id] NVARCHAR(1000) NOT NULL,
    [avatar] NVARCHAR(1000) NOT NULL,
    [name] NVARCHAR(1000) NOT NULL,
    [amount] INT NOT NULL,
    [day] INT NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [RecurringBill_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [RecurringBill_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Budget] (
    [id] NVARCHAR(1000) NOT NULL,
    [maximum] INT NOT NULL,
    [categoryId] NVARCHAR(1000) NOT NULL,
    [themeId] NVARCHAR(1000) NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Budget_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [Budget_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Budget_categoryId_key] UNIQUE NONCLUSTERED ([categoryId]),
    CONSTRAINT [Budget_themeId_key] UNIQUE NONCLUSTERED ([themeId])
);

-- CreateTable
CREATE TABLE [dbo].[Pot] (
    [id] NVARCHAR(1000) NOT NULL,
    [name] NVARCHAR(1000) NOT NULL,
    [target] INT NOT NULL,
    [total] INT NOT NULL,
    [themeId] NVARCHAR(1000) NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Pot_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [Pot_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Pot_themeId_key] UNIQUE NONCLUSTERED ([themeId])
);

-- CreateTable
CREATE TABLE [dbo].[Category] (
    [id] NVARCHAR(1000) NOT NULL,
    [name] NVARCHAR(1000) NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Category_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [Category_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Theme] (
    [id] NVARCHAR(1000) NOT NULL,
    [name] NVARCHAR(1000) NOT NULL,
    [color] NVARCHAR(1000) NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Theme_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [Theme_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[User] (
    [id] NVARCHAR(1000) NOT NULL,
    [email] NVARCHAR(1000) NOT NULL,
    [name] NVARCHAR(1000) NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [User_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [User_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [User_email_key] UNIQUE NONCLUSTERED ([email])
);

-- CreateTable
CREATE TABLE [dbo].[Password] (
    [id] NVARCHAR(1000) NOT NULL,
    [hash] NVARCHAR(1000) NOT NULL,
    [userId] NVARCHAR(1000) NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Password_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [Password_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Password_userId_key] UNIQUE NONCLUSTERED ([userId])
);

-- AddForeignKey
ALTER TABLE [dbo].[Transaction] ADD CONSTRAINT [Transaction_categoryId_fkey] FOREIGN KEY ([categoryId]) REFERENCES [dbo].[Category]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Transaction] ADD CONSTRAINT [Transaction_recurringBillId_fkey] FOREIGN KEY ([recurringBillId]) REFERENCES [dbo].[RecurringBill]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Budget] ADD CONSTRAINT [Budget_categoryId_fkey] FOREIGN KEY ([categoryId]) REFERENCES [dbo].[Category]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Budget] ADD CONSTRAINT [Budget_themeId_fkey] FOREIGN KEY ([themeId]) REFERENCES [dbo].[Theme]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Pot] ADD CONSTRAINT [Pot_themeId_fkey] FOREIGN KEY ([themeId]) REFERENCES [dbo].[Theme]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Password] ADD CONSTRAINT [Password_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[User]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
