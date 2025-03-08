-- CreateTable
CREATE TABLE "_CollaborativeObjectives" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_CollaborativeObjectives_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_CollaborativeObjectives_B_index" ON "_CollaborativeObjectives"("B");

-- AddForeignKey
ALTER TABLE "_CollaborativeObjectives" ADD CONSTRAINT "_CollaborativeObjectives_A_fkey" FOREIGN KEY ("A") REFERENCES "objectives"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CollaborativeObjectives" ADD CONSTRAINT "_CollaborativeObjectives_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
