-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "companyName" TEXT,
    "password" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "companies" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "tradingName" TEXT,
    "description" TEXT,
    "industry" TEXT,
    "sector" TEXT,
    "foundedYear" INTEGER,
    "headquarters" TEXT,
    "country" TEXT,
    "size" TEXT,
    "type" TEXT NOT NULL DEFAULT 'SUPPLIER',
    "revenue" TEXT,
    "marketCap" TEXT,
    "employeeCount" TEXT,
    "legalStatus" TEXT,
    "stockSymbol" TEXT,
    "ceo" TEXT,
    "keyExecutives" JSONB,
    "founders" TEXT,
    "boardMembers" JSONB,
    "website" TEXT,
    "linkedin" TEXT,
    "twitter" TEXT,
    "facebook" TEXT,
    "instagram" TEXT,
    "youtube" TEXT,
    "otherSocial" JSONB,
    "phone" TEXT,
    "email" TEXT,
    "address" TEXT,
    "supportEmail" TEXT,
    "salesEmail" TEXT,
    "pressContact" TEXT,
    "glassdoorRating" REAL,
    "googleRating" REAL,
    "trustpilotScore" REAL,
    "bbbRating" TEXT,
    "yelpRating" REAL,
    "industryReviews" JSONB,
    "businessModel" TEXT,
    "products" JSONB,
    "targetMarket" TEXT,
    "geographicPresence" JSONB,
    "languages" JSONB,
    "keyPartners" JSONB,
    "majorClients" JSONB,
    "suppliers" JSONB,
    "competitors" JSONB,
    "acquisitions" JSONB,
    "subsidiaries" JSONB,
    "marketShare" TEXT,
    "competitiveAdvantage" TEXT,
    "industryRanking" TEXT,
    "growthStage" TEXT,
    "marketTrends" JSONB,
    "recentNews" JSONB,
    "pressReleases" JSONB,
    "mediaMentions" JSONB,
    "awards" JSONB,
    "speakingEngagements" JSONB,
    "technologyStack" JSONB,
    "patents" JSONB,
    "rdInvestment" TEXT,
    "innovationAreas" JSONB,
    "techPartnerships" JSONB,
    "esgScore" TEXT,
    "sustainabilityInitiatives" JSONB,
    "corporateValues" JSONB,
    "diversityInclusion" JSONB,
    "socialImpact" JSONB,
    "officeLocations" JSONB,
    "remoteWorkPolicy" TEXT,
    "workCulture" TEXT,
    "benefits" JSONB,
    "hiringStatus" TEXT,
    "swotAnalysis" JSONB,
    "riskFactors" JSONB,
    "growthStrategy" TEXT,
    "investmentThesis" TEXT,
    "dueDiligenceNotes" JSONB,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "content_items" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "contentType" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "sourceUrl" TEXT,
    "cloudStoragePath" TEXT,
    "fileName" TEXT,
    "fileSize" BIGINT,
    "mimeType" TEXT,
    "duration" INTEGER,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "companyId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "processedAt" DATETIME,
    "userId" TEXT NOT NULL,
    CONSTRAINT "content_items_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "content_items_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "transcriptions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "content" TEXT NOT NULL,
    "language" TEXT,
    "confidence" REAL,
    "wordCount" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "contentItemId" TEXT NOT NULL,
    CONSTRAINT "transcriptions_contentItemId_fkey" FOREIGN KEY ("contentItemId") REFERENCES "content_items" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "business_insights" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "category" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "confidence" REAL,
    "priority" TEXT NOT NULL DEFAULT 'MEDIUM',
    "tags" TEXT,
    "sourceQuote" TEXT,
    "companyId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" TEXT NOT NULL,
    "contentItemId" TEXT NOT NULL,
    CONSTRAINT "business_insights_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "business_insights_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "business_insights_contentItemId_fkey" FOREIGN KEY ("contentItemId") REFERENCES "content_items" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "consistency_reports" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "contradictions" JSONB,
    "totalContradictions" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "consistency_reports_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "gap_analysis_reports" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "gaps" JSONB,
    "totalGaps" INTEGER NOT NULL DEFAULT 0,
    "priorityGaps" INTEGER NOT NULL DEFAULT 0,
    "recommendations" JSONB,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "gap_analysis_reports_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "companies_name_key" ON "companies"("name");

-- CreateIndex
CREATE UNIQUE INDEX "transcriptions_contentItemId_key" ON "transcriptions"("contentItemId");
