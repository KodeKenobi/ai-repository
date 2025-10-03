import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");
    const type = searchParams.get("type");

    if (!query) {
      return NextResponse.json(
        { error: "Query parameter is required" },
        { status: 400 }
      );
    }

    // Search companies by name (case-insensitive)
    const companies = await prisma.company.findMany({
      where: {
        name: {
          contains: query,
          mode: "insensitive",
        },
        ...(type && { type: type as any }),
      },
      include: {
        contentItems: {
          where: { userId: session.user.id },
          include: {
            transcription: true,
            insights: true,
          },
        },
        insights: {
          where: { userId: session.user.id },
        },
      },
      orderBy: { name: "asc" },
    });

    // Also search for content items that might contain the company name
    const relatedContent = await prisma.contentItem.findMany({
      where: {
        userId: session.user.id,
        OR: [
          { title: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
          {
            transcription: {
              content: { contains: query, mode: "insensitive" },
            },
          },
        ],
      },
      include: {
        transcription: true,
        insights: true,
        company: true,
      },
      orderBy: { createdAt: "desc" },
      take: 10,
    });

    return NextResponse.json({
      companies,
      relatedContent,
      query,
    });
  } catch (error) {
    console.error("Company search error:", error);
    return NextResponse.json(
      { error: "Failed to search companies" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const requestBody = await request.json();
    console.log("Company creation request body:", JSON.stringify(requestBody, null, 2));

    const {
      name,
      description,
      industry,
      website,
      country,
      size,
      type,
      tradingName,
      sector,
      foundedYear,
      headquarters,
      revenue,
      marketCap,
      employeeCount,
      legalStatus,
      stockSymbol,
      ceo,
      keyExecutives,
      founders,
      boardMembers,
      linkedin,
      twitter,
      facebook,
      instagram,
      youtube,
      otherSocial,
      phone,
      email,
      address,
      supportEmail,
      salesEmail,
      pressContact,
      glassdoorRating,
      googleRating,
      trustpilotScore,
      bbbRating,
      yelpRating,
      industryReviews,
      businessModel,
      products,
      targetMarket,
      geographicPresence,
      languages,
      keyPartners,
      majorClients,
      suppliers,
      competitors,
      acquisitions,
      subsidiaries,
      marketShare,
      competitiveAdvantage,
      industryRanking,
      growthStage,
      marketTrends,
      recentNews,
      pressReleases,
      mediaMentions,
      awards,
      speakingEngagements,
      technologyStack,
      patents,
      rdInvestment,
      innovationAreas,
      techPartnerships,
      esgScore,
      sustainabilityInitiatives,
      corporateValues,
      diversityInclusion,
      socialImpact,
      officeLocations,
      remoteWorkPolicy,
      workCulture,
      benefits,
      hiringStatus,
      swotAnalysis,
      riskFactors,
      growthStrategy,
      investmentThesis,
      dueDiligenceNotes,
    } = requestBody;

    if (!name) {
      console.log("Missing company name in request");
      return NextResponse.json(
        { error: "Company name is required" },
        { status: 400 }
      );
    }

    // Check if company already exists
    const existingCompany = await prisma.company.findUnique({
      where: { name },
    });

    if (existingCompany) {
      console.log(`Company "${name}" already exists`);
      return NextResponse.json(
        { error: `A company named "${name}" already exists. Please choose a different name or search for the existing company.` },
        { status: 400 }
      );
    }

    // Create new company
    const company = await prisma.company.create({
      data: {
        name,
        description,
        industry,
        website,
        country,
        size,
        type: type || "SUPPLIER",
        tradingName,
        sector,
        foundedYear,
        headquarters,
        revenue,
        marketCap,
        employeeCount,
        legalStatus,
        stockSymbol,
        ceo,
        keyExecutives,
        founders,
        boardMembers,
        linkedin,
        twitter,
        facebook,
        instagram,
        youtube,
        otherSocial,
        phone,
        email,
        address,
        supportEmail,
        salesEmail,
        pressContact,
        glassdoorRating,
        googleRating,
        trustpilotScore,
        bbbRating,
        yelpRating,
        industryReviews,
        businessModel,
        products,
        targetMarket,
        geographicPresence,
        languages,
        keyPartners,
        majorClients,
        suppliers,
        competitors,
        acquisitions,
        subsidiaries,
        marketShare,
        competitiveAdvantage,
        industryRanking,
        growthStage,
        marketTrends,
        recentNews,
        pressReleases,
        mediaMentions,
        awards,
        speakingEngagements,
        technologyStack,
        patents,
        rdInvestment,
        innovationAreas,
        techPartnerships,
        esgScore,
        sustainabilityInitiatives,
        corporateValues,
        diversityInclusion,
        socialImpact,
        officeLocations,
        remoteWorkPolicy,
        workCulture,
        benefits,
        hiringStatus,
        swotAnalysis,
        riskFactors,
        growthStrategy,
        investmentThesis,
        dueDiligenceNotes,
      },
    });

    return NextResponse.json(
      {
        message: "Company created successfully",
        company,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Company creation error:", error);
    return NextResponse.json(
      { error: "Failed to create company" },
      { status: 500 }
    );
  }
}
