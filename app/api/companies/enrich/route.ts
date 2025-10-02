import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    console.log("AI Enrichment API called");

    const session = await getServerSession(authOptions);
    console.log("Session:", session ? "Found" : "Not found");

    if (!session?.user?.id) {
      console.log("Unauthorized - no session or user ID");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { companyName } = await request.json();
    console.log("Company name:", companyName);

    if (!companyName) {
      return NextResponse.json(
        { error: "Company name is required" },
        { status: 400 }
      );
    }

    console.log("Calling OpenAI API...");

    // Call OpenAI API to get comprehensive company information
    const openaiResponse = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: `You are a comprehensive business intelligence analyst. Provide detailed, accurate information for any company.

              Extract ALL available information and format as a JSON object with these exact fields:

              {
                "name": "Official company name",
                "tradingName": "Brand/trading name if different",
                "description": "Comprehensive 2-3 paragraph company overview",
                "industry": "Primary industry",
                "sector": "Business sector (Technology, Healthcare, Finance, etc.)",
                "foundedYear": 2023,
                "headquarters": "Full headquarters address",
                "country": "Headquarters country",
                "size": "Small/Medium/Large/Enterprise",
                "type": "SUPPLIER/COMPETITOR/PARTNER/TARGET/CUSTOMER",
                
                "revenue": "Annual revenue (e.g., '$1.2B', '$500M')",
                "marketCap": "Market capitalization if public",
                "employeeCount": "Exact employee count or range",
                "legalStatus": "Public/Private/Startup/Non-profit",
                "stockSymbol": "Stock ticker if public",
                
                "ceo": "CEO name and brief background",
                "keyExecutives": ["CTO: Name", "CFO: Name"],
                "founders": "Founder names and backgrounds",
                "boardMembers": ["Notable board member 1", "Notable board member 2"],
                
                "website": "Main website URL",
                "linkedin": "LinkedIn company page URL",
                "twitter": "Twitter/X handle",
                "facebook": "Facebook page URL",
                "instagram": "Instagram handle",
                "youtube": "YouTube channel URL",
                "otherSocial": ["Snapchat", "TikTok", "Pinterest"],
                
                "phone": "Main business phone",
                "email": "General contact email",
                "address": "Complete business address",
                "supportEmail": "Customer support email",
                "salesEmail": "Sales inquiries email",
                "pressContact": "Media relations contact",
                
                "glassdoorRating": 4.2,
                "googleRating": 4.5,
                "trustpilotScore": 4.1,
                "bbbRating": "A+",
                "yelpRating": 3.8,
                "industryReviews": ["Platform: Rating", "Platform: Rating"],
                
                "businessModel": "B2B/B2C/SaaS/Marketplace/etc",
                "products": ["Product 1", "Product 2", "Service 1"],
                "targetMarket": "Target customer segments",
                "geographicPresence": ["Country 1", "Country 2", "Region 1"],
                "languages": ["English", "Spanish", "French"],
                
                "keyPartners": ["Partner 1", "Partner 2"],
                "majorClients": ["Client 1", "Client 2"],
                "suppliers": ["Supplier 1", "Supplier 2"],
                "competitors": ["Competitor 1", "Competitor 2"],
                "acquisitions": ["Acquired Company 1", "Acquired Company 2"],
                "subsidiaries": ["Subsidiary 1", "Subsidiary 2"],
                
                "marketShare": "Market share percentage or position",
                "competitiveAdvantage": "Unique selling points",
                "industryRanking": "Position in industry",
                "growthStage": "Startup/Growth/Mature/Declining",
                "marketTrends": ["Trend 1", "Trend 2"],
                
                "recentNews": ["Headline 1", "Headline 2"],
                "pressReleases": ["Release 1", "Release 2"],
                "mediaMentions": ["Publication: Article", "Publication: Article"],
                "awards": ["Award 1", "Award 2"],
                "speakingEngagements": ["Event: Speaker", "Event: Speaker"],
                
                "technologyStack": ["Technology 1", "Technology 2"],
                "patents": ["Patent 1", "Patent 2"],
                "rdInvestment": "R&D spending amount",
                "innovationAreas": ["Area 1", "Area 2"],
                "techPartnerships": ["Partner 1", "Partner 2"],
                
                "esgScore": "ESG rating",
                "sustainabilityInitiatives": ["Initiative 1", "Initiative 2"],
                "corporateValues": ["Value 1", "Value 2"],
                "diversityInclusion": ["DEI Initiative 1", "DEI Initiative 2"],
                "socialImpact": ["Impact 1", "Impact 2"],
                
                "officeLocations": ["Location 1", "Location 2"],
                "remoteWorkPolicy": "Hybrid/Remote/Office-first",
                "workCulture": "Company culture description",
                "benefits": ["Benefit 1", "Benefit 2"],
                "hiringStatus": "Actively hiring/Not hiring/Selective",
                
                "swotAnalysis": {
                  "strengths": ["Strength 1", "Strength 2"],
                  "weaknesses": ["Weakness 1", "Weakness 2"],
                  "opportunities": ["Opportunity 1", "Opportunity 2"],
                  "threats": ["Threat 1", "Threat 2"]
                },
                "riskFactors": ["Risk 1", "Risk 2"],
                "growthStrategy": "Expansion and growth plans",
                "investmentThesis": "Why invest or partner with this company",
                "dueDiligenceNotes": ["Note 1", "Note 2"]
              }

              IMPORTANT:
              - Use null for fields where information is not available
              - Be accurate and factual - only include verified information
              - For arrays, provide 2-5 relevant items
              - For ratings, use decimal numbers (e.g., 4.2)
              - For years, use integers (e.g., 2023)
              - Include specific details when available
              - Focus on recent, relevant information
              - Return ONLY valid JSON, no additional text`,
            },
            {
              role: "user",
              content: `Get comprehensive information for company: ${companyName}`,
            },
          ],
          temperature: 0.3,
          max_tokens: 4000,
        }),
      }
    );

    console.log("OpenAI response status:", openaiResponse.status);

    if (!openaiResponse.ok) {
      const errorText = await openaiResponse.text();
      console.error("OpenAI API error:", errorText);
      throw new Error(
        `OpenAI API error: ${openaiResponse.status} - ${errorText}`
      );
    }

    const openaiData = await openaiResponse.json();
    console.log("OpenAI response received");

    const companyInfo = JSON.parse(openaiData.choices[0].message.content);
    console.log("Company data parsed successfully");

    return NextResponse.json({
      success: true,
      company: companyInfo,
    });
  } catch (error) {
    console.error("Company enrichment error:", error);
    console.error("Error stack:", error.stack);
    console.error("Error message:", error.message);
    return NextResponse.json(
      { error: "Failed to enrich company information", details: error.message },
      { status: 500 }
    );
  }
}
