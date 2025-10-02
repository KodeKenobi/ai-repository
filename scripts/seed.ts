import {
  PrismaClient,
  ContentType,
  ContentSource,
  ProcessingStatus,
  InsightCategory,
  Priority,
} from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting seed...");

  // Clear existing data
  await prisma.businessInsight.deleteMany();
  await prisma.transcription.deleteMany();
  await prisma.contentItem.deleteMany();
  await prisma.consistencyReport.deleteMany();
  await prisma.gapAnalysisReport.deleteMany();
  await prisma.user.deleteMany();

  // Create test user (admin credentials - hidden from user)
  const hashedPassword = await bcrypt.hash("johndoe123", 12);
  const testUser = await prisma.user.create({
    data: {
      email: "john@doe.com",
      firstName: "John",
      lastName: "Doe",
      companyName: "Business Analytics Inc",
      password: hashedPassword,
    },
  });

  console.log("Created test user:", testUser.email);

  // Create sample content items
  const contentItems = await Promise.all([
    prisma.contentItem.create({
      data: {
        title: "Q3 Business Strategy Meeting",
        description: "Quarterly review and strategy planning session",
        contentType: ContentType.AUDIO,
        source: ContentSource.FILE_UPLOAD,
        fileName: "q3-strategy.mp3",
        mimeType: "audio/mpeg",
        fileSize: BigInt(15742080), // ~15MB
        duration: 1800, // 30 minutes
        status: ProcessingStatus.COMPLETED,
        userId: testUser.id,
        processedAt: new Date(),
      },
    }),

    prisma.contentItem.create({
      data: {
        title: "Customer Interview - Sarah Johnson",
        description: "User feedback session about product features",
        contentType: ContentType.VIDEO,
        source: ContentSource.FILE_UPLOAD,
        fileName: "customer-interview-sarah.mp4",
        mimeType: "video/mp4",
        fileSize: BigInt(52428800), // ~50MB
        duration: 2700, // 45 minutes
        status: ProcessingStatus.COMPLETED,
        userId: testUser.id,
        processedAt: new Date(),
      },
    }),

    prisma.contentItem.create({
      data: {
        title: "Marketing Best Practices Blog",
        description: "Industry insights on digital marketing trends",
        contentType: ContentType.BLOG_ARTICLE,
        source: ContentSource.BLOG_URL,
        sourceUrl: "https://example.com/marketing-best-practices",
        status: ProcessingStatus.COMPLETED,
        userId: testUser.id,
        processedAt: new Date(),
      },
    }),

    prisma.contentItem.create({
      data: {
        title: "Product Demo Video",
        description: "Latest product features demonstration",
        contentType: ContentType.VIDEO,
        source: ContentSource.YOUTUBE_URL,
        sourceUrl: "https://youtube.com/watch?v=example123",
        status: ProcessingStatus.PENDING,
        userId: testUser.id,
      },
    }),
  ]);

  console.log(`Created ${contentItems.length} content items`);

  // Create transcriptions for processed content
  const transcriptions = await Promise.all([
    prisma.transcription.create({
      data: {
        content: `In today's quarterly meeting, we discussed our strategic initiatives for Q4. Key points included expanding our customer base by 25%, improving product functionality based on user feedback, and increasing marketing spend to capture market share. We also identified three major pain points in our current operations that need immediate attention.`,
        language: "en",
        confidence: 0.94,
        wordCount: 45,
        contentItemId: contentItems[0].id,
      },
    }),

    prisma.transcription.create({
      data: {
        content: `Sarah: I love how intuitive the interface is, but I think the reporting feature could be more robust. The current charts are basic and don't give me the insights I need for my business decisions. Also, the mobile app loads slowly on my phone. John: That's valuable feedback. What specific metrics would be most helpful? Sarah: I need better conversion tracking and customer lifetime value calculations. The integration with our CRM system would also be a game-changer.`,
        language: "en",
        confidence: 0.91,
        wordCount: 68,
        contentItemId: contentItems[1].id,
      },
    }),

    prisma.transcription.create({
      data: {
        content: `Digital marketing has evolved significantly in 2024. Companies are focusing more on personalized customer experiences and data-driven decision making. Key trends include AI-powered content creation, advanced segmentation strategies, and omnichannel customer engagement. Successful businesses are those that can adapt quickly to changing consumer behaviors and leverage technology to create meaningful connections with their audience.`,
        language: "en",
        confidence: 0.96,
        wordCount: 62,
        contentItemId: contentItems[2].id,
      },
    }),
  ]);

  console.log(`Created ${transcriptions.length} transcriptions`);

  // Create business insights
  const insights = await Promise.all([
    prisma.businessInsight.create({
      data: {
        category: InsightCategory.STRATEGIC,
        title: "Customer Acquisition Growth Opportunity",
        content:
          "The Q3 meeting reveals a clear growth target of 25% customer base expansion. This suggests strong confidence in current product-market fit and available resources for scaling.",
        confidence: 0.89,
        priority: Priority.HIGH,
        tags: ["growth", "customers", "expansion"],
        sourceQuote: "expanding our customer base by 25%",
        userId: testUser.id,
        contentItemId: contentItems[0].id,
      },
    }),

    prisma.businessInsight.create({
      data: {
        category: InsightCategory.PRODUCT,
        title: "Reporting Feature Enhancement Needed",
        content:
          "Customer feedback indicates that current reporting capabilities are insufficient for business decision-making. Users need more sophisticated analytics and CRM integration.",
        confidence: 0.92,
        priority: Priority.HIGH,
        tags: ["product", "features", "reporting", "analytics"],
        sourceQuote: "reporting feature could be more robust",
        userId: testUser.id,
        contentItemId: contentItems[1].id,
      },
    }),

    prisma.businessInsight.create({
      data: {
        category: InsightCategory.MARKETING,
        title: "AI-Powered Marketing Trend Opportunity",
        content:
          "Industry analysis shows AI-powered content creation is becoming essential. This presents an opportunity to leverage AI tools for competitive advantage in marketing efforts.",
        confidence: 0.87,
        priority: Priority.MEDIUM,
        tags: ["marketing", "AI", "trends", "content"],
        sourceQuote: "AI-powered content creation",
        userId: testUser.id,
        contentItemId: contentItems[2].id,
      },
    }),

    prisma.businessInsight.create({
      data: {
        category: InsightCategory.OPERATIONS,
        title: "Operational Pain Points Identified",
        content:
          "Three major operational issues require immediate attention. Addressing these could significantly improve efficiency and customer satisfaction.",
        confidence: 0.85,
        priority: Priority.CRITICAL,
        tags: ["operations", "efficiency", "issues"],
        sourceQuote: "three major pain points in our current operations",
        userId: testUser.id,
        contentItemId: contentItems[0].id,
      },
    }),
  ]);

  console.log(`Created ${insights.length} business insights`);

  // Create sample consistency report
  const consistencyReport = await prisma.consistencyReport.create({
    data: {
      title: "Q3 Content Consistency Analysis",
      description:
        "Analysis of contradictions found across Q3 business content",
      contradictions: [
        {
          issue: "Growth targets mismatch",
          description:
            "Strategy meeting mentions 25% customer growth while customer interview suggests focus on retention",
          sources: [
            "Q3 Business Strategy Meeting",
            "Customer Interview - Sarah Johnson",
          ],
          severity: "medium",
        },
        {
          issue: "Technology priority conflict",
          description:
            "Marketing content emphasizes AI adoption while operations focus on basic system improvements",
          sources: [
            "Marketing Best Practices Blog",
            "Q3 Business Strategy Meeting",
          ],
          severity: "low",
        },
      ],
      totalContradictions: 2,
      userId: testUser.id,
    },
  });

  console.log("Created consistency report");

  // Create sample gap analysis report
  const gapAnalysisReport = await prisma.gapAnalysisReport.create({
    data: {
      title: "Business Information Gap Analysis",
      description: "Identified missing critical business information areas",
      gaps: [
        {
          area: "Financial Metrics",
          description:
            "No clear revenue targets or profitability analysis mentioned in content",
          impact: "high",
          category: "financial",
        },
        {
          area: "Competitive Analysis",
          description:
            "Limited information about competitors and market positioning",
          impact: "medium",
          category: "competitive",
        },
        {
          area: "Risk Assessment",
          description:
            "No formal risk management or mitigation strategies discussed",
          impact: "high",
          category: "risk",
        },
      ],
      totalGaps: 3,
      priorityGaps: 2,
      recommendations: [
        {
          title: "Implement Financial Dashboard",
          description: "Create regular financial reporting and KPI tracking",
          priority: "high",
          effort: "medium",
        },
        {
          title: "Conduct Market Research",
          description: "Perform comprehensive competitive analysis quarterly",
          priority: "medium",
          effort: "high",
        },
      ],
      userId: testUser.id,
    },
  });

  console.log("Created gap analysis report");

  console.log("Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
