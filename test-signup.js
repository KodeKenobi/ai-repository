// Simple test script to check if signup endpoint works
const testSignup = async () => {
  const testData = {
    email: "test@example.com",
    password: "testpassword123",
    firstName: "Test",
    lastName: "User",
    companyName: "Test Company",
  };

  try {
    console.log("Testing signup endpoint...");
    console.log(
      "URL: https://ai-data-repository-qckb93pc4-kodekenobis-projects.vercel.app/api/signup"
    );
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
    console.log(
      "Response headers:",
      Object.fromEntries(response.headers.entries())
    );

    const responseText = await response.text();
    console.log("Response body:", responseText);

    if (response.ok) {
      console.log("✅ Signup endpoint is working!");
    } else {
      console.log("❌ Signup endpoint returned an error");
    }
  } catch (error) {
    console.error("❌ Error testing signup:", error.message);
  }
};

testSignup();
