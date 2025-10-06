import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// Function to check if a company has sufficient data to be considered "fully populated"
function isCompanyFullyPopulated(company: any): boolean {
  const requiredFields = [
    'description', 'industry', 'website', 'country', 'size', 'sector',
    'foundedYear', 'headquarters', 'revenue', 'employeeCount', 'legalStatus',
    'ceo', 'linkedin', 'phone', 'email', 'businessModel', 'targetMarket'
  ];
  
  const optionalButImportantFields = [
    'marketCap', 'stockSymbol', 'founders', 'boardMembers', 'twitter',
    'facebook', 'instagram', 'youtube', 'address', 'glassdoorRating',
    'googleRating', 'products', 'geographicPresence', 'keyPartners',
    'competitors', 'marketShare', 'competitiveAdvantage', 'growthStage'
  ];
  
  // Count how many required fields are populated
  const requiredPopulated = requiredFields.filter(field => {
    const value = company[field];
    return value !== null && value !== undefined && value !== '' && 
           !(Array.isArray(value) && value.length === 0) &&
           !(typeof value === 'object' && value !== null && Object.keys(value).length === 0);
  }).length;
  
  // Count how many optional fields are populated
  const optionalPopulated = optionalButImportantFields.filter(field => {
    const value = company[field];
    return value !== null && value !== undefined && value !== '' && 
           !(Array.isArray(value) && value.length === 0) &&
           !(typeof value === 'object' && value !== null && Object.keys(value).length === 0);
  }).length;
  
  // Company is considered fully populated if:
  // - At least 80% of required fields are filled (13 out of 16)
  // - At least 50% of optional fields are filled (10 out of 20)
  const requiredThreshold = Math.ceil(requiredFields.length * 0.8);
  const optionalThreshold = Math.ceil(optionalButImportantFields.length * 0.5);
  
  return requiredPopulated >= requiredThreshold && optionalPopulated >= optionalThreshold;
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
      .from('companies')
      .select(`
        *,
        content_items!inner(
          *,
          transcriptions(*),
          business_insights(*)
        ),
        business_insights!inner(*)
      `)
      .ilike('name', `%${query}%`)
      .order('name', { ascending: true });

    if (type) {
      companiesQuery = companiesQuery.eq('type', type);
    }

    const { data: companies, error: companiesError } = await companiesQuery;

    if (companiesError) {
      console.error('Error searching companies:', companiesError);
      return NextResponse.json(
        { error: "Failed to search companies" },
        { status: 500 }
      );
    }

    // Filter content items and insights by user
    const filteredCompanies = companies?.map(company => ({
      ...company,
      content_items: company.content_items?.filter((item: any) => item.user_id === session.user.id) || [],
      business_insights: company.business_insights?.filter((insight: any) => insight.user_id === session.user.id) || []
    })) || [];

    // Also search for content items that might contain the company name
    const { data: relatedContent, error: contentError } = await supabaseAdmin
      .from('content_items')
      .select(`
        *,
        transcriptions(*),
        business_insights(*),
        companies(*)
      `)
      .eq('user_id', session.user.id)
      .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
      .order('created_at', { ascending: false })
      .limit(10);

    if (contentError) {
      console.error('Error searching content:', contentError);
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
    const { data: existingCompany, error: checkError } = await supabaseAdmin
      .from('companies')
      .select('*')
      .eq('name', name)
      .single();

    if (existingCompany) {
      console.log(`Company "${name}" already exists`);
      
      // Check if the existing company is fully populated
      const isFullyPopulated = isCompanyFullyPopulated(existingCompany);
      
      if (isFullyPopulated) {
        return NextResponse.json(
          { error: `A company named "${name}" already exists with complete information. Please choose a different name or search for the existing company.` },
          { status: 400 }
        );
      } else {
        // Update the existing company with new data
        console.log(`Updating incomplete company "${name}" with new data`);
        const { data: updatedCompany, error: updateError } = await supabaseAdmin
          .from('companies')
          .update({
            description: description || existingCompany.description,
            industry: industry || existingCompany.industry,
            website: website || existingCompany.website,
            country: country || existingCompany.country,
            size: size || existingCompany.size,
            type: type || existingCompany.type,
            tradingName: tradingName || existingCompany.tradingName,
            sector: sector || existingCompany.sector,
            foundedYear: foundedYear || existingCompany.foundedYear,
            headquarters: headquarters || existingCompany.headquarters,
            revenue: revenue || existingCompany.revenue,
            marketCap: marketCap || existingCompany.marketCap,
            employeeCount: employeeCount || existingCompany.employeeCount,
            legalStatus: legalStatus || existingCompany.legalStatus,
            stockSymbol: stockSymbol || existingCompany.stockSymbol,
            ceo: ceo || existingCompany.ceo,
            keyExecutives: keyExecutives || existingCompany.keyExecutives,
            founders: founders || existingCompany.founders,
            boardMembers: boardMembers || existingCompany.boardMembers,
            linkedin: linkedin || existingCompany.linkedin,
            twitter: twitter || existingCompany.twitter,
            facebook: facebook || existingCompany.facebook,
            instagram: instagram || existingCompany.instagram,
            youtube: youtube || existingCompany.youtube,
            otherSocial: otherSocial || existingCompany.otherSocial,
            phone: phone || existingCompany.phone,
            email: email || existingCompany.email,
            address: address || existingCompany.address,
            supportEmail: supportEmail || existingCompany.supportEmail,
            salesEmail: salesEmail || existingCompany.salesEmail,
            pressContact: pressContact || existingCompany.pressContact,
            glassdoorRating: glassdoorRating || existingCompany.glassdoorRating,
            googleRating: googleRating || existingCompany.googleRating,
            trustpilotScore: trustpilotScore || existingCompany.trustpilotScore,
            bbbRating: bbbRating || existingCompany.bbbRating,
            yelpRating: yelpRating || existingCompany.yelpRating,
            industryReviews: industryReviews || existingCompany.industryReviews,
            businessModel: businessModel || existingCompany.businessModel,
            products: products || existingCompany.products,
            targetMarket: targetMarket || existingCompany.targetMarket,
            geographicPresence: geographicPresence || existingCompany.geographicPresence,
            languages: languages || existingCompany.languages,
            keyPartners: keyPartners || existingCompany.keyPartners,
            majorClients: majorClients || existingCompany.majorClients,
            suppliers: suppliers || existingCompany.suppliers,
            competitors: competitors || existingCompany.competitors,
            acquisitions: acquisitions || existingCompany.acquisitions,
            subsidiaries: subsidiaries || existingCompany.subsidiaries,
            marketShare: marketShare || existingCompany.marketShare,
            competitiveAdvantage: competitiveAdvantage || existingCompany.competitiveAdvantage,
            industryRanking: industryRanking || existingCompany.industryRanking,
            growthStage: growthStage || existingCompany.growthStage,
            marketTrends: marketTrends || existingCompany.marketTrends,
            recentNews: recentNews || existingCompany.recentNews,
            pressReleases: pressReleases || existingCompany.pressReleases,
            mediaMentions: mediaMentions || existingCompany.mediaMentions,
            awards: awards || existingCompany.awards,
            speakingEngagements: speakingEngagements || existingCompany.speakingEngagements,
            technologyStack: technologyStack || existingCompany.technologyStack,
            patents: patents || existingCompany.patents,
            rdInvestment: rdInvestment || existingCompany.rdInvestment,
            innovationAreas: innovationAreas || existingCompany.innovationAreas,
            techPartnerships: techPartnerships || existingCompany.techPartnerships,
            esgScore: esgScore || existingCompany.esgScore,
            sustainabilityInitiatives: sustainabilityInitiatives || existingCompany.sustainabilityInitiatives,
            corporateValues: corporateValues || existingCompany.corporateValues,
            diversityInclusion: diversityInclusion || existingCompany.diversityInclusion,
            socialImpact: socialImpact || existingCompany.socialImpact,
            officeLocations: officeLocations || existingCompany.officeLocations,
            remoteWorkPolicy: remoteWorkPolicy || existingCompany.remoteWorkPolicy,
            workCulture: workCulture || existingCompany.workCulture,
            benefits: benefits || existingCompany.benefits,
            hiringStatus: hiringStatus || existingCompany.hiringStatus,
            swotAnalysis: swotAnalysis || existingCompany.swotAnalysis,
            riskFactors: riskFactors || existingCompany.riskFactors,
            growthStrategy: growthStrategy || existingCompany.growthStrategy,
            investmentThesis: investmentThesis || existingCompany.investmentThesis,
            dueDiligenceNotes: dueDiligenceNotes || existingCompany.dueDiligenceNotes,
          },
        });

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
