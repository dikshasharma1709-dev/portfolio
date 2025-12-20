import { PortfolioData } from './types';

export const content: PortfolioData = {
  name: "Diksha Sharma",
  title: "Presales Specialist | Cybersecurity",
  summary: "Driven and motivated sales professional with a strong background in persuasive demos and customer-facing technical consulting. Expert in bridging the gap between complex security technologies and business value.",
  contact: {
    email: "dikshasharma1709@gmail.com",
    phone: "+91 91102 56121",
    location: "Bangalore, India",
    linkedin: "https://www.linkedin.com/in/diksha1709"
  },
  experience: [
    {
      id: "exp1",
      company: "Mitigata",
      role: "Cyber Security Consultant",
      period: "July 2025 – Present",
      description: [
        "Recommended and implemented tailored cybersecurity solutions.",
        "Handled end-to-end procurement of security tools and services while maintaining OEM relationships."
      ]
    },
    {
      id: "exp2",
      company: "Ampcus Cyber India",
      role: "Presales Specialist",
      period: "Nov 2024 – Feb 2025",
      description: [
        "Led technical demonstrations for enterprise security solutions.",
        "Collaborated with sales teams to define customer requirements and propose tailored cybersecurity architectures."
      ]
    },
    {
      id: "exp3",
      company: "Infoavana",
      role: "Presales Engineer",
      period: "Jan 2024 – Oct 2024",
      description: [
        "Managed proof-of-concept (POC) deployments for SIEM and endpoint security solutions.",
        "Provided technical consultation to key accounts, ensuring successful product adoption."
      ]
    },
    {
      id: "exp4",
      company: "Secureinteli",
      role: "Presales Engineer",
      period: "Apr 2023 – Dec 2023",
      description: [
        "Analyzed threat landscapes and optimized security policies for clients.",
        "Supported deployment of network security infrastructure."
      ]
    },
    {
      id: "exp5",
      company: "CyberNX",
      role: "Presales Engineer",
      period: "Nov 2022 – Mar 2023",
      description: [
        "Implemented firewall rules and monitored security logs for anomalies.",
        "Assisted in vulnerability assessments and penetration testing activities."
      ]
    },
    {
      id: "exp6",
      company: "Vinca CyberTech",
      role: "Technical Engineer",
      period: "Nov 2020 – Oct 2022",
      description: [
        "Started career in cybersecurity operations.",
        "Gained hands-on experience with various security tools and protocols."
      ]
    }
  ],
  skills: [
    { name: "Presales Consulting", category: "core" },
    { name: "Technical Demos", category: "core" },
    { name: "Solution Architecture", category: "core" },
    { name: "SentinelOne", category: "tech" },
    { name: "CrowdStrike", category: "tech" },
    { name: "Netskope", category: "tech" },
    { name: "Elastic SIEM", category: "tool" },
    { name: "Splunk by CISCO", category: "tool" },
    { name: "Proofpoint", category: "tech" },
    { name: "Checkpoint", category: "tech" },
    { name: "Customer Success", category: "core" },
    { name: "POC Management", category: "core" }
  ],
  certifications: [
    { id: "c1", name: "CCSA (Check Point Certified Security Administrator)", issuer: "Check Point" },
    { id: "c2", name: "CCSE (Check Point Certified Security Expert)", issuer: "Check Point" },
    { id: "c3", name: "SentinelOne Core", issuer: "SentinelOne" },
    { id: "c4", name: "Netskope Certified Cloud Security Admin", issuer: "Netskope" },
    { id: "c5", name: "Microsoft Security Compliance", issuer: "Microsoft" }
  ]
};
