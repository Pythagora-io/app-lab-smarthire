require('dotenv').config();
const mongoose = require('mongoose');
const { connectDB } = require('../config/database');
const Organization = require('../models/Organization');
const Team = require('../models/Team');
const JobPosting = require('../models/JobPosting');
const Applicant = require('../models/Applicant');

const sampleJobPostings = [
  {
    title: 'Senior Frontend Developer',
    summary: 'Looking for an experienced frontend developer to join our team',
    description: 'We are seeking a talented Senior Frontend Developer to join our growing team...',
    requirements: [
      'At least 5 years of experience with React',
      'Strong TypeScript skills',
      'Experience with modern frontend frameworks'
    ],
    responsibilities: [
      'Lead frontend development initiatives',
      'Mentor junior developers',
      'Architect scalable frontend solutions'
    ],
    status: 'Open'
  },
  {
    title: 'Backend Engineer',
    summary: 'Backend engineer needed for our core platform team',
    description: 'Join our backend team to build scalable microservices...',
    requirements: [
      'Strong Node.js experience',
      'Experience with MongoDB',
      'Knowledge of microservices architecture'
    ],
    responsibilities: [
      'Design and implement backend services',
      'Optimize database performance',
      'Write technical documentation'
    ],
    status: 'Open'
  }
];

const sampleApplicants = [
  {
    name: 'John Doe',
    email: 'john.doe@example.com',
    location: 'New York, USA',
    cv: 'https://example.com/cv1.pdf',
    cvFileName: 'john_doe_cv.pdf',
    position: ['Senior Frontend Developer'],
    status: 'Applied'
  },
  {
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    location: 'London, UK',
    cv: 'https://example.com/cv2.pdf',
    cvFileName: 'jane_smith_cv.pdf',
    additionalFile: 'https://example.com/portfolio.pdf',
    additionalFileName: 'portfolio.pdf',
    position: ['Backend Engineer'],
    status: 'Screened'
  },
  {
    name: 'Mike Johnson',
    email: 'mike.johnson@example.com',
    location: 'Berlin, Germany',
    cv: 'https://example.com/cv3.pdf',
    cvFileName: 'mike_johnson_cv.pdf',
    position: ['Senior Frontend Developer', 'Backend Engineer'],
    status: 'Interview'
  }
];

async function seedDatabase() {
  try {
    await connectDB();
    console.log('Connected to database');

    // Get the first organization (assuming it exists)
    const organization = await Organization.findOne();
    if (!organization) {
      throw new Error('No organization found. Please create an organization first.');
    }

    // Get the first team (assuming it exists)
    const team = await Team.findOne({ organization: organization._id });
    if (!team) {
      throw new Error('No team found. Please create a team first.');
    }

    console.log('Creating job postings...');
    const createdJobPostings = await Promise.all(
      sampleJobPostings.map(posting =>
        JobPosting.create({
          ...posting,
          organization: organization._id,
          team: team._id
        })
      )
    );
    console.log(`Created ${createdJobPostings.length} job postings`);

    console.log('Creating applicants...');
    const createdApplicants = await Promise.all(
      sampleApplicants.map(applicant => {
        // Randomly assign a job posting to the applicant
        const randomJobPosting = createdJobPostings[Math.floor(Math.random() * createdJobPostings.length)];
        return Applicant.create({
          ...applicant,
          organization: organization._id,
          jobPosting: randomJobPosting._id
        });
      })
    );
    console.log(`Created ${createdApplicants.length} applicants`);

    console.log('Database seeding completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();