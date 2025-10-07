// Test login endpoint
const testLogin = async () => {
  const loginData = {
    email: "test-local@example.com",
    password: "testpassword123",
  };

  try {
    console.log("Testing login endpoint...");
    console.log("URL: http://localhost:3000/api/auth/signin");
    console.log("Data:", loginData);

    const response = await fetch("http://localhost:3000/api/auth/signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        email: loginData.email,
        password: loginData.password,
        callbackUrl: "http://localhost:3000/dashboard",
      }),
    });

    console.log("Response status:", response.status);
    console.log(
      "Response headers:",
      Object.fromEntries(response.headers.entries())
    );

    const responseText = await response.text();
    console.log("Response body:", responseText);

    if (response.ok) {
      console.log("✅ SUCCESS! Login endpoint is working!");
    } else {
      console.log("❌ Error response received");
    }
  } catch (error) {
    console.error("❌ Network error:", error.message);
  }
};

testLogin();
