"use client";

import { useState, useEffect } from "react";
import { Search, Building2, Plus, Filter, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface Company {
  id: string;

  // Core Company Data
  name: string;
  tradingName?: string;
  description?: string;
  industry?: string;
  sector?: string;
  foundedYear?: number;
  headquarters?: string;
  country?: string;
  size?: string;
  type: string;

  // Financial Information
  revenue?: string;
  marketCap?: string;
  employeeCount?: string;
  legalStatus?: string;
  stockSymbol?: string;

  // Leadership & People
  ceo?: string;
  keyExecutives?: any[];
  founders?: string;
  boardMembers?: any[];

  // Digital Presence
  website?: string;
  linkedin?: string;
  twitter?: string;
  facebook?: string;
  instagram?: string;
  youtube?: string;
  otherSocial?: any[];

  // Contact Information
  phone?: string;
  email?: string;
  address?: string;
  supportEmail?: string;
  salesEmail?: string;
  pressContact?: string;

  // Reviews & Ratings
  glassdoorRating?: number;
  googleRating?: number;
  trustpilotScore?: number;
  bbbRating?: string;
  yelpRating?: number;
  industryReviews?: any[];

  // Business Details
  businessModel?: string;
  products?: any[];
  targetMarket?: string;
  geographicPresence?: any[];
  languages?: any[];

  // Relationships & Partnerships
  keyPartners?: any[];
  majorClients?: any[];
  suppliers?: any[];
  competitors?: any[];
  acquisitions?: any[];
  subsidiaries?: any[];

  // Market Position
  marketShare?: string;
  competitiveAdvantage?: string;
  industryRanking?: string;
  growthStage?: string;
  marketTrends?: any[];

  // Media & Press
  recentNews?: any[];
  pressReleases?: any[];
  mediaMentions?: any[];
  awards?: any[];
  speakingEngagements?: any[];

  // Technology & Innovation
  technologyStack?: any[];
  patents?: any[];
  rdInvestment?: string;
  innovationAreas?: any[];
  techPartnerships?: any[];

  // Sustainability & Values
  esgScore?: string;
  sustainabilityInitiatives?: any[];
  corporateValues?: any[];
  diversityInclusion?: any[];
  socialImpact?: any[];

  // Operational Data
  officeLocations?: any[];
  remoteWorkPolicy?: string;
  workCulture?: string;
  benefits?: any[];
  hiringStatus?: string;

  // Business Intelligence
  swotAnalysis?: any;
  riskFactors?: any[];
  growthStrategy?: string;
  investmentThesis?: string;
  dueDiligenceNotes?: any[];

  // Relations
  contentItems: any[];
  insights: any[];
}

interface CompanySearchProps {
  userId: string;
}

export default function CompanySearch({ userId }: CompanySearchProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [companies, setCompanies] = useState<Company[]>([]);
  const [relatedContent, setRelatedContent] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filterType, setFilterType] = useState("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [createError, setCreateError] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [newCompany, setNewCompany] = useState({
    name: "",
    tradingName: "",
    description: "",
    industry: "",
    sector: "",
    foundedYear: undefined as number | undefined,
    headquarters: "",
    country: "",
    size: "",
    type: "SUPPLIER",
    revenue: "",
    marketCap: "",
    employeeCount: "",
    legalStatus: "",
    stockSymbol: "",
    ceo: "",
    keyExecutives: [] as any[],
    founders: "",
    boardMembers: [] as any[],
    website: "",
    linkedin: "",
    twitter: "",
    facebook: "",
    instagram: "",
    youtube: "",
    otherSocial: [] as any[],
    phone: "",
    email: "",
    address: "",
    supportEmail: "",
    salesEmail: "",
    pressContact: "",
    glassdoorRating: undefined as number | undefined,
    googleRating: undefined as number | undefined,
    trustpilotScore: undefined as number | undefined,
    bbbRating: "",
    yelpRating: undefined as number | undefined,
    industryReviews: [] as any[],
    businessModel: "",
    products: [] as any[],
    targetMarket: "",
    geographicPresence: [] as any[],
    languages: [] as any[],
    keyPartners: [] as any[],
    majorClients: [] as any[],
    suppliers: [] as any[],
    competitors: [] as any[],
    acquisitions: [] as any[],
    subsidiaries: [] as any[],
    marketShare: "",
    competitiveAdvantage: "",
    industryRanking: "",
    growthStage: "",
    marketTrends: [] as any[],
    recentNews: [] as any[],
    pressReleases: [] as any[],
    mediaMentions: [] as any[],
    awards: [] as any[],
    speakingEngagements: [] as any[],
    technologyStack: [] as any[],
    patents: [] as any[],
    rdInvestment: "",
    innovationAreas: [] as any[],
    techPartnerships: [] as any[],
    esgScore: "",
    sustainabilityInitiatives: [] as any[],
    corporateValues: [] as any[],
    diversityInclusion: [] as any[],
    socialImpact: [] as any[],
    officeLocations: [] as any[],
    remoteWorkPolicy: "",
    workCulture: "",
    benefits: [] as any[],
    hiringStatus: "",
    swotAnalysis: {} as any,
    riskFactors: [] as any[],
    growthStrategy: "",
    investmentThesis: "",
    dueDiligenceNotes: [] as any[],
  });
  const [isEnriching, setIsEnriching] = useState(false);

  const searchCompanies = async (query: string) => {
    if (!query.trim()) {
      setCompanies([]);
      setRelatedContent([]);
      return;
    }

    setIsLoading(true);
    try {
      const params = new URLSearchParams({ q: query });
      if (filterType && filterType !== "all") params.append("type", filterType);

      const response = await fetch(`/api/search/companies?${params}`, {
        credentials: "include",
      });
      const data = await response.json();

      setCompanies(data.companies || []);
      setRelatedContent(data.relatedContent || []);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const enrichCompany = async () => {
    if (!newCompany.name.trim()) return;

    setIsEnriching(true);
    try {
      const response = await fetch("/api/companies/enrich", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ companyName: newCompany.name }),
      });

      if (response.ok) {
        const data = await response.json();
        setNewCompany((prev) => ({
          ...prev,
          ...data.company,
          name: prev.name, // Keep the original name
        }));
      }
    } catch (error) {
      console.error("Enrich company error:", error);
    } finally {
      setIsEnriching(false);
    }
  };

  const enrichExistingCompany = async (company: Company) => {
    setIsEnriching(true);
    try {
      const response = await fetch("/api/companies/enrich", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ companyName: company.name }),
      });

      if (response.ok) {
        const data = await response.json();
        // Update the company in the list with enriched data
        setCompanies((prevCompanies) =>
          prevCompanies.map((c) =>
            c.id === company.id ? { ...c, ...data.company } : c
          )
        );
      } else {
        const errorData = await response.json();
        console.error("Enrichment failed:", errorData);
        alert(
          `Failed to enrich company: ${errorData.error || "Unknown error"}`
        );
      }
    } catch (error) {
      console.error("Enrich existing company error:", error);
    } finally {
      setIsEnriching(false);
    }
  };

  const createCompany = async () => {
    setIsCreating(true);
    setCreateError("");
    
    try {
      // Only send the fields that the API can handle
      const companyData = {
        name: newCompany.name,
        description: newCompany.description,
        industry: newCompany.industry,
        website: newCompany.website,
        country: newCompany.country,
        size: newCompany.size,
        type: newCompany.type,
        // Add the new fields that are in the schema
        tradingName: newCompany.tradingName,
        sector: newCompany.sector,
        foundedYear: newCompany.foundedYear,
        headquarters: newCompany.headquarters,
        revenue: newCompany.revenue,
        marketCap: newCompany.marketCap,
        employeeCount: newCompany.employeeCount,
        legalStatus: newCompany.legalStatus,
        stockSymbol: newCompany.stockSymbol,
        ceo: newCompany.ceo,
        keyExecutives: newCompany.keyExecutives,
        founders: newCompany.founders,
        boardMembers: newCompany.boardMembers,
        linkedin: newCompany.linkedin,
        twitter: newCompany.twitter,
        facebook: newCompany.facebook,
        instagram: newCompany.instagram,
        youtube: newCompany.youtube,
        otherSocial: newCompany.otherSocial,
        phone: newCompany.phone,
        email: newCompany.email,
        address: newCompany.address,
        supportEmail: newCompany.supportEmail,
        salesEmail: newCompany.salesEmail,
        pressContact: newCompany.pressContact,
        glassdoorRating: newCompany.glassdoorRating,
        googleRating: newCompany.googleRating,
        trustpilotScore: newCompany.trustpilotScore,
        bbbRating: newCompany.bbbRating,
        yelpRating: newCompany.yelpRating,
        industryReviews: newCompany.industryReviews,
        businessModel: newCompany.businessModel,
        products: newCompany.products,
        targetMarket: newCompany.targetMarket,
        geographicPresence: newCompany.geographicPresence,
        languages: newCompany.languages,
        keyPartners: newCompany.keyPartners,
        majorClients: newCompany.majorClients,
        suppliers: newCompany.suppliers,
        competitors: newCompany.competitors,
        acquisitions: newCompany.acquisitions,
        subsidiaries: newCompany.subsidiaries,
        marketShare: newCompany.marketShare,
        competitiveAdvantage: newCompany.competitiveAdvantage,
        industryRanking: newCompany.industryRanking,
        growthStage: newCompany.growthStage,
        marketTrends: newCompany.marketTrends,
        recentNews: newCompany.recentNews,
        pressReleases: newCompany.pressReleases,
        mediaMentions: newCompany.mediaMentions,
        awards: newCompany.awards,
        speakingEngagements: newCompany.speakingEngagements,
        technologyStack: newCompany.technologyStack,
        patents: newCompany.patents,
        rdInvestment: newCompany.rdInvestment,
        innovationAreas: newCompany.innovationAreas,
        techPartnerships: newCompany.techPartnerships,
        esgScore: newCompany.esgScore,
        sustainabilityInitiatives: newCompany.sustainabilityInitiatives,
        corporateValues: newCompany.corporateValues,
        diversityInclusion: newCompany.diversityInclusion,
        socialImpact: newCompany.socialImpact,
        officeLocations: newCompany.officeLocations,
        remoteWorkPolicy: newCompany.remoteWorkPolicy,
        workCulture: newCompany.workCulture,
        benefits: newCompany.benefits,
        hiringStatus: newCompany.hiringStatus,
        swotAnalysis: newCompany.swotAnalysis,
        riskFactors: newCompany.riskFactors,
        growthStrategy: newCompany.growthStrategy,
        investmentThesis: newCompany.investmentThesis,
        dueDiligenceNotes: newCompany.dueDiligenceNotes,
      };

      const response = await fetch("/api/search/companies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(companyData),
      });

      if (response.ok) {
        setIsCreateDialogOpen(false);
        setNewCompany({
          name: "",
          tradingName: "",
          description: "",
          industry: "",
          sector: "",
          foundedYear: undefined,
          headquarters: "",
          country: "",
          size: "",
          type: "SUPPLIER",
          revenue: "",
          marketCap: "",
          employeeCount: "",
          legalStatus: "",
          stockSymbol: "",
          ceo: "",
          keyExecutives: [],
          founders: "",
          boardMembers: [],
          website: "",
          linkedin: "",
          twitter: "",
          facebook: "",
          instagram: "",
          youtube: "",
          otherSocial: [],
          phone: "",
          email: "",
          address: "",
          supportEmail: "",
          salesEmail: "",
          pressContact: "",
          glassdoorRating: undefined,
          googleRating: undefined,
          trustpilotScore: undefined,
          bbbRating: "",
          yelpRating: undefined,
          industryReviews: [],
          businessModel: "",
          products: [],
          targetMarket: "",
          geographicPresence: [],
          languages: [],
          keyPartners: [],
          majorClients: [],
          suppliers: [],
          competitors: [],
          acquisitions: [],
          subsidiaries: [],
          marketShare: "",
          competitiveAdvantage: "",
          industryRanking: "",
          growthStage: "",
          marketTrends: [],
          recentNews: [],
          pressReleases: [],
          mediaMentions: [],
          awards: [],
          speakingEngagements: [],
          technologyStack: [],
          patents: [],
          rdInvestment: "",
          innovationAreas: [],
          techPartnerships: [],
          esgScore: "",
          sustainabilityInitiatives: [],
          corporateValues: [],
          diversityInclusion: [],
          socialImpact: [],
          officeLocations: [],
          remoteWorkPolicy: "",
          workCulture: "",
          benefits: [],
          hiringStatus: "",
          swotAnalysis: {},
          riskFactors: [],
          growthStrategy: "",
          investmentThesis: "",
          dueDiligenceNotes: [],
        });
        // Refresh search if we have a query
        if (searchQuery) {
          searchCompanies(searchQuery);
        }
      } else {
        const errorData = await response.json();
        setCreateError(errorData.error || "Failed to create company");
      }
    } catch (error) {
      console.error("Create company error:", error);
      setCreateError("Something went wrong. Please try again.");
    } finally {
      setIsCreating(false);
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "SUPPLIER":
        return "bg-blue-100 text-blue-800";
      case "COMPETITOR":
        return "bg-red-100 text-red-800";
      case "PARTNER":
        return "bg-green-100 text-green-800";
      case "TARGET":
        return "bg-purple-100 text-purple-800";
      case "CUSTOMER":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Building2 className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Company Search</h1>
            <p className="text-gray-600">
              Search and manage companies, suppliers, and competitors
            </p>
          </div>
        </div>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Company
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] max-w-4xl w-full overflow-hidden flex flex-col">
            <DialogHeader>
              <DialogTitle>Add New Company</DialogTitle>
              <DialogDescription>
                Create a new company profile for tracking and analysis
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 overflow-y-auto flex-1 pr-2 [&_input]:focus:outline-none [&_textarea]:focus:outline-none [&_select]:focus:outline-none">
              <div>
                <Label htmlFor="name">Company Name *</Label>
                <div className="flex space-x-2">
                  <Input
                    id="name"
                    value={newCompany.name}
                    onChange={(e) =>
                      setNewCompany({ ...newCompany, name: e.target.value })
                    }
                    placeholder="e.g., Coca Cola"
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={enrichCompany}
                    disabled={!newCompany.name.trim() || isEnriching}
                    className="whitespace-nowrap"
                  >
                    {isEnriching ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                        AI...
                      </>
                    ) : (
                      <>
                        <Brain className="h-4 w-4 mr-2" />
                        Auto-fill
                      </>
                    )}
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  AI will automatically fill in 70+ company details including
                  social media, reviews, financials, leadership, and more!
                </p>
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newCompany.description}
                  onChange={(e) =>
                    setNewCompany({
                      ...newCompany,
                      description: e.target.value,
                    })
                  }
                  placeholder="Brief description of the company"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="industry">Industry</Label>
                  <Input
                    id="industry"
                    value={newCompany.industry}
                    onChange={(e) =>
                      setNewCompany({ ...newCompany, industry: e.target.value })
                    }
                    placeholder="e.g., Beverages"
                  />
                </div>
                <div>
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    value={newCompany.country}
                    onChange={(e) =>
                      setNewCompany({ ...newCompany, country: e.target.value })
                    }
                    placeholder="e.g., USA"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    value={newCompany.website}
                    onChange={(e) =>
                      setNewCompany({ ...newCompany, website: e.target.value })
                    }
                    placeholder="https://example.com"
                  />
                </div>
                <div>
                  <Label htmlFor="size">Company Size</Label>
                  <Select
                    value={newCompany.size}
                    onValueChange={(value) =>
                      setNewCompany({ ...newCompany, size: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Small">Small (1-50)</SelectItem>
                      <SelectItem value="Medium">Medium (51-500)</SelectItem>
                      <SelectItem value="Large">Large (501-5000)</SelectItem>
                      <SelectItem value="Enterprise">
                        Enterprise (5000+)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="ceo">CEO</Label>
                  <Input
                    id="ceo"
                    value={newCompany.ceo}
                    onChange={(e) =>
                      setNewCompany({ ...newCompany, ceo: e.target.value })
                    }
                    placeholder="e.g., Tim Cook"
                  />
                </div>
                <div>
                  <Label htmlFor="revenue">Revenue</Label>
                  <Input
                    id="revenue"
                    value={newCompany.revenue}
                    onChange={(e) =>
                      setNewCompany({ ...newCompany, revenue: e.target.value })
                    }
                    placeholder="e.g., $1.2B"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="type">Company Type</Label>
                <Select
                  value={newCompany.type}
                  onValueChange={(value) =>
                    setNewCompany({ ...newCompany, type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SUPPLIER">Supplier</SelectItem>
                    <SelectItem value="COMPETITOR">Competitor</SelectItem>
                    <SelectItem value="PARTNER">Partner</SelectItem>
                    <SelectItem value="TARGET">Target</SelectItem>
                    <SelectItem value="CUSTOMER">Customer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            {createError && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3">
                <p className="text-sm text-red-600">{createError}</p>
              </div>
            )}
            <div className="flex justify-end space-x-2 pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => {
                  setIsCreateDialogOpen(false);
                  setCreateError("");
                }}
                disabled={isCreating}
              >
                Cancel
              </Button>
              <Button onClick={createCompany} disabled={isCreating}>
                {isCreating ? "Creating..." : "Create Company"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search Bar */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search companies by name (e.g., Coca Cola, Apple, Microsoft)..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              searchCompanies(e.target.value);
            }}
            className="pl-10"
          />
        </div>
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-48">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="SUPPLIER">Suppliers</SelectItem>
            <SelectItem value="COMPETITOR">Competitors</SelectItem>
            <SelectItem value="PARTNER">Partners</SelectItem>
            <SelectItem value="TARGET">Targets</SelectItem>
            <SelectItem value="CUSTOMER">Customers</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Results */}
      {isLoading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Searching companies...</p>
        </div>
      )}

      {!isLoading && searchQuery && (
        <div className="space-y-6">
          {/* Companies */}
          {companies.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold mb-4">
                Companies ({companies.length})
              </h2>
              <div className="grid gap-4">
                {companies.map((company) => (
                  <Card key={company.id} className="overflow-hidden">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-xl mb-2">
                            {company.name}
                            {company.tradingName &&
                              company.tradingName !== company.name && (
                                <span className="text-lg text-gray-600 ml-2">
                                  ({company.tradingName})
                                </span>
                              )}
                          </CardTitle>
                          <CardDescription className="space-y-1">
                            <div className="flex flex-wrap gap-2">
                              {company.industry && (
                                <Badge variant="outline">
                                  {company.industry}
                                </Badge>
                              )}
                              {company.sector && (
                                <Badge variant="outline">
                                  {company.sector}
                                </Badge>
                              )}
                              {company.country && (
                                <Badge variant="outline">
                                  {company.country}
                                </Badge>
                              )}
                              {company.size && (
                                <Badge variant="outline">{company.size}</Badge>
                              )}
                              {company.foundedYear && (
                                <Badge variant="outline">
                                  Founded {company.foundedYear}
                                </Badge>
                              )}
                            </div>
                          </CardDescription>
                        </div>
                        <Badge className={getTypeColor(company.type)}>
                          {company.type}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Description */}
                      {company.description && (
                        <p className="text-sm text-gray-700 leading-relaxed">
                          {company.description}
                        </p>
                      )}

                      {/* Key Metrics */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {company.revenue && (
                          <div className="text-center p-3 bg-blue-50 rounded-lg">
                            <div className="text-lg font-semibold text-blue-900">
                              {company.revenue}
                            </div>
                            <div className="text-xs text-blue-600">Revenue</div>
                          </div>
                        )}
                        {company.employeeCount && (
                          <div className="text-center p-3 bg-green-50 rounded-lg">
                            <div className="text-lg font-semibold text-green-900">
                              {company.employeeCount}
                            </div>
                            <div className="text-xs text-green-600">
                              Employees
                            </div>
                          </div>
                        )}
                        {company.glassdoorRating && (
                          <div className="text-center p-3 bg-yellow-50 rounded-lg">
                            <div className="text-lg font-semibold text-yellow-900">
                              {company.glassdoorRating}/5
                            </div>
                            <div className="text-xs text-yellow-600">
                              Glassdoor
                            </div>
                          </div>
                        )}
                        {company.googleRating && (
                          <div className="text-center p-3 bg-purple-50 rounded-lg">
                            <div className="text-lg font-semibold text-purple-900">
                              {company.googleRating}/5
                            </div>
                            <div className="text-xs text-purple-600">
                              Google
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Leadership */}
                      {(company.ceo || company.founders) && (
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">
                            Leadership
                          </h4>
                          <div className="space-y-1 text-sm text-gray-600">
                            {company.ceo && (
                              <div>
                                <strong>CEO:</strong> {company.ceo}
                              </div>
                            )}
                            {company.founders && (
                              <div>
                                <strong>Founders:</strong> {company.founders}
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Digital Presence */}
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">
                          Digital Presence
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {company.website && (
                            <a
                              href={company.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full hover:bg-blue-200"
                            >
                              🌐 Website
                            </a>
                          )}
                          {company.linkedin && (
                            <a
                              href={company.linkedin}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full hover:bg-blue-200"
                            >
                              💼 LinkedIn
                            </a>
                          )}
                          {company.twitter && (
                            <a
                              href={`https://twitter.com/${company.twitter}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full hover:bg-blue-200"
                            >
                              🐦 Twitter
                            </a>
                          )}
                          {company.facebook && (
                            <a
                              href={company.facebook}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full hover:bg-blue-200"
                            >
                              📘 Facebook
                            </a>
                          )}
                          {company.instagram && (
                            <a
                              href={`https://instagram.com/${company.instagram}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full hover:bg-blue-200"
                            >
                              📷 Instagram
                            </a>
                          )}
                          {company.youtube && (
                            <a
                              href={company.youtube}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full hover:bg-blue-200"
                            >
                              📺 YouTube
                            </a>
                          )}
                        </div>
                      </div>

                      {/* Business Details */}
                      {(company.businessModel ||
                        company.products ||
                        company.targetMarket) && (
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">
                            Business Details
                          </h4>
                          <div className="space-y-1 text-sm text-gray-600">
                            {company.businessModel && (
                              <div>
                                <strong>Model:</strong> {company.businessModel}
                              </div>
                            )}
                            {company.targetMarket && (
                              <div>
                                <strong>Target Market:</strong>{" "}
                                {company.targetMarket}
                              </div>
                            )}
                            {company.products &&
                              company.products.length > 0 && (
                                <div>
                                  <strong>Products:</strong>{" "}
                                  {company.products.slice(0, 3).join(", ")}
                                </div>
                              )}
                          </div>
                        </div>
                      )}

                      {/* Contact Information */}
                      {(company.phone || company.email || company.address) && (
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">
                            Contact
                          </h4>
                          <div className="space-y-1 text-sm text-gray-600">
                            {company.phone && (
                              <div>
                                <strong>Phone:</strong> {company.phone}
                              </div>
                            )}
                            {company.email && (
                              <div>
                                <strong>Email:</strong> {company.email}
                              </div>
                            )}
                            {company.address && (
                              <div>
                                <strong>Address:</strong> {company.address}
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Content Stats */}
                      <div className="flex items-center justify-between text-sm text-gray-500 pt-2 border-t">
                        <div className="flex items-center space-x-4">
                          <span>
                            {company.contentItems.length} content items
                          </span>
                          <span>{company.insights.length} insights</span>
                          {company.stockSymbol && (
                            <span className="font-mono">
                              {company.stockSymbol}
                            </span>
                          )}
                        </div>
                        {/* Show Enrich button if company lacks comprehensive data */}
                        {(!company.description ||
                          !company.industry ||
                          !company.website) && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => enrichExistingCompany(company)}
                            disabled={isEnriching}
                          >
                            {isEnriching ? (
                              <>
                                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600 mr-1"></div>
                                Enriching...
                              </>
                            ) : (
                              <>
                                <Brain className="h-3 w-3 mr-1" />
                                Enrich
                              </>
                            )}
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Related Content */}
          {relatedContent.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold mb-4">
                Related Content ({relatedContent.length})
              </h2>
              <div className="grid gap-4">
                {relatedContent.map((content) => (
                  <Card key={content.id}>
                    <CardHeader>
                      <CardTitle className="text-base">
                        {content.title}
                      </CardTitle>
                      <CardDescription>
                        {content.contentType} •{" "}
                        {new Date(content.createdAt).toLocaleDateString()}
                        {content.company && ` • ${content.company.name}`}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600">
                        {content.description ||
                          content.transcription?.content?.substring(0, 200) +
                            "..."}
                      </p>
                      <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                        <span>{content.insights.length} insights</span>
                        <Badge variant="outline">{content.status}</Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* No Results */}
          {companies.length === 0 && relatedContent.length === 0 && (
            <div className="text-center py-8">
              <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No companies found
              </h3>
              <p className="text-gray-600 mb-4">
                No companies or related content found for "{searchQuery}"
              </p>
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create "{searchQuery}" Company
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Empty State */}
      {!searchQuery && (
        <div className="text-center py-12">
          <Building2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-900 mb-2">
            Search Companies
          </h3>
          <p className="text-gray-600 mb-6">
            Enter a company name to search your database or create a new company
            profile
          </p>
          <div className="flex justify-center space-x-4">
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Company
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
