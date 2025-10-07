// Test local signup endpoint
const testLocalSignup = async () => {
  const testData = {
    email: "test-local@example.com",
    password: "testpassword123",
    firstName: "Test",
    lastName: "User",
    companyName: "Test Company",
  };

  try {
    console.log("Testing local signup endpoint...");
    console.log("URL: http://localhost:3000/api/signup");
    console.log("Data:", testData);

    const response = await fetch("http://localhost:3000/api/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(testData),
    });

    console.log("Response status:", response.status);

    const responseText = await response.text();
    console.log("Response body:", responseText);

    if (response.ok) {
      console.log("✅ SUCCESS! Local signup endpoint is working!");
    } else {
      console.log("❌ Error response received");

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

testLocalSignup();
