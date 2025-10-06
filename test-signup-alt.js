// Test with different URL formats
const testSignupAlt = async () => {
  const testData = {
    email: "test2@example.com",
    password: "testpassword123",
    firstName: "Test",
    lastName: "User",
    companyName: "Test Company",
  };

  const urls = [
    "https://ai-data-repository-qckb93pc4-kodekenobis-projects.vercel.app/api/signup",
    "https://ai-data-repository-diiyvj3ft-kodekenobis-projects.vercel.app/api/signup"
  ];

  for (const url of urls) {
    try {
      console.log(`\nTesting: ${url}`);
      
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(testData),
      });

      console.log("Response status:", response.status);
      
      if (response.status === 200 || response.status === 201) {
        const responseText = await response.text();
        console.log("✅ SUCCESS! Response:", responseText);
        break;
      } else if (response.status === 401) {
        console.log("❌ Still getting 401 - Authentication still enabled");
      } else {
        const responseText = await response.text();
        console.log("Response body:", responseText.substring(0, 200) + "...");
      }
    } catch (error) {
      console.error("❌ Error:", error.message);
    }
  }
};

testSignupAlt();
