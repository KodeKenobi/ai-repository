const { PrismaClient } = require('./prisma/generated/client');

const prisma = new PrismaClient();

async function transferContentToIgnatius() {
  try {
    console.log('🔄 Transferring content to Ignatius Mutizwa...\n');

    // Get all users
    const users = await prisma.user.findMany();
    console.log('👤 Available users:');
    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.email} (ID: ${user.id})`);
    });

    // Find Ignatius's account
    const ignatiusAccount = users.find(user => 
      user.email.toLowerCase().includes('ignatius') || 
      user.firstName?.toLowerCase().includes('ignatius') ||
      user.lastName?.toLowerCase().includes('mutizwa')
    );

    if (!ignatiusAccount) {
      console.log('❌ Ignatius Mutizwa account not found');
      console.log('💡 Please check the email address you used to create the account');
      return;
    }

    console.log(`\n🎯 Found Ignatius account: ${ignatiusAccount.email}`);

    // Get the test user's content
    const testUser = users.find(user => user.email === 'john@doe.com');
    if (!testUser) {
      console.log('❌ Test user not found');
      return;
    }

    const testUserContent = await prisma.contentItem.findMany({
      where: { userId: testUser.id },
      include: {
        transcription: true,
        insights: true
      }
    });

    console.log(`📚 Found ${testUserContent.length} content items to transfer`);

    // Transfer each content item
    for (const contentItem of testUserContent) {
      try {
        // Update the content item to belong to Ignatius
        await prisma.contentItem.update({
          where: { id: contentItem.id },
          data: { userId: ignatiusAccount.id }
        });

        // Update insights to belong to Ignatius
        if (contentItem.insights.length > 0) {
          await prisma.businessInsight.updateMany({
            where: { contentItemId: contentItem.id },
            data: { userId: ignatiusAccount.id }
          });
        }

        console.log(`✅ Transferred: ${contentItem.title}`);
      } catch (error) {
        console.log(`❌ Error transferring ${contentItem.title}: ${error.message}`);
      }
    }

    // Verify the transfer
    const ignatiusContent = await prisma.contentItem.findMany({
      where: { userId: ignatiusAccount.id },
      include: {
        transcription: true,
        insights: true
      }
    });

    console.log(`\n🎉 Transfer complete!`);
    console.log(`📊 Ignatius's account now has ${ignatiusContent.length} content items:`);
    ignatiusContent.forEach((item, index) => {
      console.log(`${index + 1}. ${item.title} (${item.status}) - ${item.insights.length} insights`);
    });

    // Check companies
    const companies = await prisma.company.findMany();
    console.log(`\n🏢 Companies available: ${companies.length}`);
    companies.forEach(company => {
      console.log(`   - ${company.name}`);
    });

    console.log(`\n🚀 Next steps:`);
    console.log(`   1. Login with your Ignatius Mutizwa account`);
    console.log(`   2. Go to /dashboard/content to see all the content`);
    console.log(`   3. Go to /dashboard/companies to see the companies`);

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

transferContentToIgnatius();
