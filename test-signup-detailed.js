// Detailed test script to check signup endpoint
const testSignupDetailed = async () => {
  const testData = {
    email: "test3@example.com",
    password: "testpassword123",
    firstName: "Test",
    lastName: "User",
    companyName: "Test Company",
  };

  try {
    console.log("Testing signup endpoint with detailed logging...");
    console.log("URL: https://ai-data-repository-qckb93pc4-kodekenobis-projects.vercel.app/api/signup");
    console.log("Data:", testData);

    const response = await fetch(
      "https://ai-data-repository-qckb93pc4-kodekenobis-projects.vercel.app/api/signup",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(testData),
      }
    );

    console.log("Response status:", response.status);
    console.log("Response headers:", Object.fromEntries(response.headers.entries()));
    
    const responseText = await response.text();
    console.log("Response body:", responseText);

    if (response.ok) {
      console.log("✅ SUCCESS! Signup endpoint is working!");
    } else {
      console.log("❌ Error response received");
      
      // Try to parse as JSON for better error details
      try {
        const errorData = JSON.parse(responseText);
        console.log("Error details:", errorData);
      } catch (e) {
        console.log("Could not parse error as JSON");
      }
    }
  } catch (error) {
    console.error("❌ Network error:", error.message);
  }
};

testSignupDetailed();
