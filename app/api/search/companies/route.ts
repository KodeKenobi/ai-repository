import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// Function to check if a company has sufficient data to be considered "fully populated"
function isCompanyFullyPopulated(company: any): boolean {
  const requiredFields = [
    "description",
    "industry",
    "website",
    "country",
    "size",
    "sector",
    "foundedYear",
    "headquarters",
    "revenue",
    "employeeCount",
    "legalStatus",
    "ceo",
    "linkedin",
    "phone",
    "email",
    "businessModel",
    "targetMarket",
  ];

  const optionalButImportantFields = [
    "marketCap",
    "stockSymbol",
    "founders",
    "boardMembers",
    "twitter",
    "facebook",
    "instagram",
    "youtube",
    "address",
    "glassdoorRating",
    "googleRating",
    "products",
    "geographicPresence",
    "keyPartners",
    "competitors",
    "marketShare",
    "competitiveAdvantage",
    "growthStage",
  ];

  // Count how many required fields are populated
  const requiredPopulated = requiredFields.filter((field) => {
    const value = company[field];
    return (
      value !== null &&
      value !== undefined &&
      value !== "" &&
      !(Array.isArray(value) && value.length === 0) &&
      !(
        typeof value === "object" &&
        value !== null &&
        Object.keys(value).length === 0
      )
    );
  }).length;

  // Count how many optional fields are populated
  const optionalPopulated = optionalButImportantFields.filter((field) => {
    const value = company[field];
    return (
      value !== null &&
      value !== undefined &&
      value !== "" &&
      !(Array.isArray(value) && value.length === 0) &&
      !(
        typeof value === "object" &&
        value !== null &&
        Object.keys(value).length === 0
      )
    );
  }).length;

  // Company is considered fully populated if:
  // - At least 80% of required fields are filled (13 out of 16)
  // - At least 50% of optional fields are filled (10 out of 20)
  const requiredThreshold = Math.ceil(requiredFields.length * 0.8);
  const optionalThreshold = Math.ceil(optionalButImportantFields.length * 0.5);

  return (
    requiredPopulated >= requiredThreshold &&
    optionalPopulated >= optionalThreshold
  );
}

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
    let companiesQuery = supabaseAdmin
      .from("companies")
      .select(
        `
        *,
        content_items!inner(
          *,
          transcriptions(*),
          business_insights(*)
        ),
        business_insights!inner(*)
      `
      )
      .ilike("name", `%${query}%`)
      .order("name", { ascending: true });

    if (type) {
      companiesQuery = companiesQuery.eq("type", type);
    }

    const { data: companies, error: companiesError } = await companiesQuery;

    if (companiesError) {
      console.error("Error searching companies:", companiesError);
      return NextResponse.json(
        { error: "Failed to search companies" },
        { status: 500 }
      );
    }

    // Filter content items and insights by user
    const filteredCompanies =
      companies?.map((company) => ({
        ...company,
        content_items:
          company.content_items?.filter(
            (item: any) => item.user_id === session.user.id
          ) || [],
        business_insights:
          company.business_insights?.filter(
            (insight: any) => insight.user_id === session.user.id
          ) || [],
      })) || [];

    // Also search for content items that might contain the company name
    const { data: relatedContent, error: contentError } = await supabaseAdmin
      .from("content_items")
      .select(
        `
        *,
        transcriptions(*),
        business_insights(*),
        companies(*)
      `
      )
      .eq("user_id", session.user.id)
      .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
      .order("created_at", { ascending: false })
      .limit(10);

    if (contentError) {
      console.error("Error searching content:", contentError);
      return NextResponse.json(
        { error: "Failed to search content" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      companies: filteredCompanies,
      relatedContent: relatedContent || [],
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
    console.log(
      "Company creation request body:",
      JSON.stringify(requestBody, null, 2)
    );

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
    const { data: existingCompany, error: checkError } = await supabaseAdmin
      .from("companies")
      .select("*")
      .eq("name", name)
      .single();

    if (existingCompany) {
      console.log(`Company "${name}" already exists`);

      // Check if the existing company is fully populated
      const isFullyPopulated = isCompanyFullyPopulated(existingCompany);

      if (isFullyPopulated) {
        return NextResponse.json(
          {
            error: `A company named "${name}" already exists with complete information. Please choose a different name or search for the existing company.`,
          },
          { status: 400 }
        );
      } else {
        // Update the existing company with new data
        console.log(`Updating incomplete company "${name}" with new data`);
        const { data: updatedCompany, error: updateError } = await supabaseAdmin
          .from("companies")
          .update({
            description: description || existingCompany.description,
            industry: industry || existingCompany.industry,
            website: website || existingCompany.website,
            country: country || existingCompany.country,
            size: size || existingCompany.size,
            type: type || existingCompany.type,
            trading_name: tradingName || existingCompany.trading_name,
            sector: sector || existingCompany.sector,
            founded_year: foundedYear || existingCompany.founded_year,
            headquarters: headquarters || existingCompany.headquarters,
            revenue: revenue || existingCompany.revenue,
            market_cap: marketCap || existingCompany.market_cap,
            employee_count: employeeCount || existingCompany.employee_count,
            legal_status: legalStatus || existingCompany.legal_status,
            stock_symbol: stockSymbol || existingCompany.stock_symbol,
            ceo: ceo || existingCompany.ceo,
            key_executives: keyExecutives || existingCompany.key_executives,
            founders: founders || existingCompany.founders,
            board_members: boardMembers || existingCompany.board_members,
            linkedin: linkedin || existingCompany.linkedin,
            twitter: twitter || existingCompany.twitter,
            facebook: facebook || existingCompany.facebook,
            instagram: instagram || existingCompany.instagram,
            youtube: youtube || existingCompany.youtube,
            other_social: otherSocial || existingCompany.other_social,
            phone: phone || existingCompany.phone,
            email: email || existingCompany.email,
            address: address || existingCompany.address,
            support_email: supportEmail || existingCompany.support_email,
            sales_email: salesEmail || existingCompany.sales_email,
            press_contact: pressContact || existingCompany.press_contact,
            glassdoor_rating:
              glassdoorRating || existingCompany.glassdoor_rating,
            google_rating: googleRating || existingCompany.google_rating,
            trustpilot_score:
              trustpilotScore || existingCompany.trustpilot_score,
            bbb_rating: bbbRating || existingCompany.bbb_rating,
            yelp_rating: yelpRating || existingCompany.yelp_rating,
            industry_reviews:
              industryReviews || existingCompany.industry_reviews,
            business_model: businessModel || existingCompany.business_model,
            products: products || existingCompany.products,
            target_market: targetMarket || existingCompany.target_market,
            geographic_presence:
              geographicPresence || existingCompany.geographic_presence,
            languages: languages || existingCompany.languages,
            key_partners: keyPartners || existingCompany.key_partners,
            major_clients: majorClients || existingCompany.major_clients,
            suppliers: suppliers || existingCompany.suppliers,
            competitors: competitors || existingCompany.competitors,
            acquisitions: acquisitions || existingCompany.acquisitions,
            subsidiaries: subsidiaries || existingCompany.subsidiaries,
            market_share: marketShare || existingCompany.market_share,
            competitive_advantage:
              competitiveAdvantage || existingCompany.competitive_advantage,
            industry_ranking:
              industryRanking || existingCompany.industry_ranking,
            growth_stage: growthStage || existingCompany.growth_stage,
            market_trends: marketTrends || existingCompany.market_trends,
            recent_news: recentNews || existingCompany.recent_news,
            press_releases: pressReleases || existingCompany.press_releases,
            media_mentions: mediaMentions || existingCompany.media_mentions,
            awards: awards || existingCompany.awards,
            speaking_engagements:
              speakingEngagements || existingCompany.speaking_engagements,
            technology_stack:
              technologyStack || existingCompany.technology_stack,
            patents: patents || existingCompany.patents,
            rd_investment: rdInvestment || existingCompany.rd_investment,
            innovation_areas:
              innovationAreas || existingCompany.innovation_areas,
            tech_partnerships:
              techPartnerships || existingCompany.tech_partnerships,
            esg_score: esgScore || existingCompany.esg_score,
            sustainability_initiatives:
              sustainabilityInitiatives ||
              existingCompany.sustainability_initiatives,
            corporate_values:
              corporateValues || existingCompany.corporate_values,
            diversity_inclusion:
              diversityInclusion || existingCompany.diversity_inclusion,
            social_impact: socialImpact || existingCompany.social_impact,
            office_locations:
              officeLocations || existingCompany.office_locations,
            remote_work_policy:
              remoteWorkPolicy || existingCompany.remote_work_policy,
            work_culture: workCulture || existingCompany.work_culture,
            benefits: benefits || existingCompany.benefits,
            hiring_status: hiringStatus || existingCompany.hiring_status,
            swot_analysis: swotAnalysis || existingCompany.swot_analysis,
            risk_factors: riskFactors || existingCompany.risk_factors,
            growth_strategy: growthStrategy || existingCompany.growth_strategy,
            investment_thesis:
              investmentThesis || existingCompany.investment_thesis,
            due_diligence_notes:
              dueDiligenceNotes || existingCompany.due_diligence_notes,
          })
          .eq("name", name)
          .select()
          .single();

        if (updateError) {
          console.error("Error updating company:", updateError);
          return NextResponse.json(
            { error: "Database error: " + updateError.message },
            { status: 500 }
          );
        }

        return NextResponse.json(
          {
            message: `Company "${name}" updated successfully with additional information`,
            company: updatedCompany,
          },
          { status: 200 }
        );
      }
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
