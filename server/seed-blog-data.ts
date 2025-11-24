import { dbStorage } from "./db-storage";
import { storage } from "./storage";

export async function seedBlogData() {
  try {
    // Only seed if not already seeded
    const existingPosts = await storage.getBlogPosts(false);
    if (existingPosts && existingPosts.length > 0) {
      return; // Already seeded
    }

    const blogPosts = [
      {
        title: "5 Tips for Hiring a Reliable Technician",
        excerpt: "Learn how to find and hire the most reliable technician for your needs on LabourConnect",
        content: `<h2>1. Check Reviews and Ratings</h2>
<p>Always look at a technician's previous customer reviews and ratings. This gives you insight into their work quality and reliability.</p>
<h2>2. Verify Skills</h2>
<p>Make sure the technician has the specific skills required for your job. Don't assume they can do all types of work.</p>
<h2>3. Clear Communication</h2>
<p>Communicate your requirements clearly upfront. A good technician will ask clarifying questions.</p>
<h2>4. Set a Budget</h2>
<p>Be clear about your budget. This helps technicians give accurate quotes.</p>
<h2>5. Check Availability</h2>
<p>Confirm the technician is available on your preferred dates and times.</p>`,
        author: "LabourConnect Team",
        category: "tips",
        published: true,
      },
      {
        title: "How LabourConnect is Transforming Labour Markets in India",
        excerpt: "Discover how LabourConnect is making it easier to connect with skilled professionals",
        content: `<h2>The Problem We Solve</h2>
<p>Finding reliable skilled labour has always been challenging in India. LabourConnect bridges this gap by connecting customers directly with verified technicians.</p>
<h2>Our Mission</h2>
<p>We believe every Indian should have access to quality skilled services at fair prices without middlemen.</p>
<h2>How It Works</h2>
<p>Our platform connects customers directly with verified technicians and labourers, eliminating middlemen and ensuring transparency in pricing and service quality.</p>
<h2>Growing Impact</h2>
<p>LabourConnect now operates across major cities with thousands of satisfied customers and skilled professionals earning better livelihood.</p>`,
        author: "LabourConnect Team",
        category: "news",
        published: true,
      },
      {
        title: "The Ultimate Guide to Finding Electricians Near You",
        excerpt: "Everything you need to know about finding and hiring qualified electricians in your area",
        content: `<h2>Why Professional Electricians Matter</h2>
<p>Electrical work is dangerous and complex. Always hire qualified electricians to ensure safety and quality work.</p>
<h2>What to Look For</h2>
<p>Check certifications, years of experience, and customer reviews. Ask about their safety practices.</p>
<h2>Getting Quotes</h2>
<p>Get quotes from 2-3 electricians before deciding. Compare pricing, timeline, and warranty offered.</p>
<h2>During the Work</h2>
<p>Stay available for questions and inspections. Document all work completed with photos.</p>`,
        author: "LabourConnect Team",
        category: "guides",
        published: true,
      },
    ];

    for (const post of blogPosts) {
      await storage.createBlogPost(post);
    }

    console.log("✓ Blog posts seeded successfully");
  } catch (error) {
    console.log("Blog seeding skipped or already done");
  }
}
