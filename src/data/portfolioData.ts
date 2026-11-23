export type SkillCategory =
  | 'All'
  | 'AI & Agentic AI'
  | 'Backend Development'
  | 'AI Integration'
  | 'Automation';

export type SkillIconKey =
  | 'brain'
  | 'link'
  | 'git-branch'
  | 'bot'
  | 'network'
  | 'database'
  | 'plug'
  | 'code'
  | 'zap'
  | 'server'
  | 'route'
  | 'sparkles'
  | 'cpu'
  | 'terminal'
  | 'workflow'
  | 'refresh'
  | 'user-check';

export interface SkillItem {
  id: string;
  name: string;
  category: Exclude<SkillCategory, 'All'>;
  iconKey: SkillIconKey;
  roleInStack: string;
  architectureNote: string;
  connectsWith: string[];
}

export interface ProjectPipelineNode {
  label: string;
  detail: string;
}

export interface ProjectCaseStudy {
  overview: string;
  problemStatement: string;
  proposedSolution: string;
  systemArchitecture: string;
  keyFeatures: string[];
  developmentChallenges: string[];
  myContribution: string;
  liveDemoUrl: string | null;
}

export interface ProjectItem {
  id: string;
  index: string;
  title: string;
  category: string;
  shortDescription: string;
  architectureSummary: string;
  technologies: string[];
  pipelineNodes: ProjectPipelineNode[];
  visualVariant: 'sdr' | 'keyword' | 'chatbot' | 'backlink' | 'pdf';
  githubUrl: string;
  caseStudy: ProjectCaseStudy;
}

export type GitHubProjectCategory =
  | 'All'
  | 'AI & Machine Learning'
  | 'Agentic AI & MCP'
  | 'AI Automation'
  | 'Web Development'
  | 'Android Development';

export interface GitHubProjectItem {
  id: string;
  index: string;
  title: string;
  category: Exclude<GitHubProjectCategory, 'All'>;
  description: string;
  technologies: string[];
  githubUrl: string;
  repoName: string;
}

export interface TimelineEntry {
  id: string;
  period: string;
  title: string;
  institution: string;
  type: 'Education' | 'Development';
  summary: string;
  highlights: string[];
}

export const HERO_PROFILE = {
  brand: 'MUHAMMAD USMAN',
  name: 'Muhammad Usman',
  role: 'Agentic AI Engineer',
  headline: 'I build intelligent AI experiences.',
  shortIntro:
    'Designing intelligent AI-powered applications, autonomous multi-step agents, Retrieval-Augmented Generation (RAG) systems, and workflow automation built for real-world software challenges.',
  rotatingFocus: [
    'AI Engineering & Autonomous Agents',
    'Intelligent Workflow Automation',
    'RAG & Model Context Protocol (MCP)',
    'FastAPI, LangGraph & Gemini Systems',
  ],
  portraitPath: '/assets/aistudio/1789168680275_4eefef02.jpg',
  resumeUrl: '/Muhammad-Usman-Resume.pdf',
  locationLabel: 'Faisalabad, Pakistan',
} as const;

// Easy single-source Availability Status configuration.
// Toggle `isActive` or adjust labels directly here to update Hero & Contact indicators.
export const AVAILABILITY_CONFIG = {
  isActive: true,
  primaryStatus: 'Available for Opportunities',
  statuses: [
    'Available for Opportunities',
    'Open to AI Engineering Internships',
    'Open to Freelance Projects',
  ],
} as const;

export const ABOUT_CONTENT = {
  title: 'Engineering autonomous systems that solve real-world problems.',
  lead: 'Computer Science undergraduate at Government College University Faisalabad (Class of 2026), driven by a deep interest in Artificial Intelligence, Agentic AI, and turning intelligent workflows into reliable software.',
  careerGoal:
    'Career Goal: To work as a professional Agentic AI Engineer building dependable, tool-connected autonomous systems and production AI applications that solve meaningful real-world problems.',
  pillars: [
    {
      index: '01',
      heading: 'Computer Science Foundation',
      body: 'Grounded in algorithms, data structures, and software architecture through my BS in Computer Science at Government College University Faisalabad.',
    },
    {
      index: '02',
      heading: 'Agentic AI Architecture',
      body: 'Designing stateful multi-agent graphs with LangGraph and LangChain where agents reason across steps, invoke tools safely, and recover cleanly from edge cases.',
    },
    {
      index: '03',
      heading: 'Practical AI Applications',
      body: 'Building real-world AI-powered applications—from resume reviewers and study assistants to RAG knowledge pipelines and Model Context Protocol (MCP) servers.',
    },
    {
      index: '04',
      heading: 'Real-World Automation & Career Focus',
      body: 'Connecting Python, FastAPI, Flask, and Google Gemini API with n8n Human-in-the-Loop automation on my path to becoming a professional Agentic AI Engineer.',
    },
  ],
} as const;

export const SKILL_CATEGORIES: SkillCategory[] = [
  'All',
  'AI & Agentic AI',
  'Backend Development',
  'AI Integration',
  'Automation',
];

export const SKILLS_DATA: SkillItem[] = [
  {
    id: 'artificial-intelligence',
    name: 'Artificial Intelligence',
    category: 'AI & Agentic AI',
    iconKey: 'brain',
    roleInStack: 'Reasoning, Planning & Decision Logic',
    architectureNote:
      'Applied foundation in agent reasoning, tool selection, evaluation loops, and dependable system guardrails.',
    connectsWith: ['AI Agents', 'LangGraph', 'Google Gemini API'],
  },
  {
    id: 'langchain',
    name: 'LangChain',
    category: 'AI & Agentic AI',
    iconKey: 'link',
    roleInStack: 'Composable Chains & Tool Abstractions',
    architectureNote:
      'Structures document loaders, text splitters, semantic retrievers, and structured LLM output chains in Python projects.',
    connectsWith: ['LangGraph', 'Retrieval-Augmented Generation (RAG)', 'Python'],
  },
  {
    id: 'langgraph',
    name: 'LangGraph',
    category: 'AI & Agentic AI',
    iconKey: 'git-branch',
    roleInStack: 'Stateful Cyclic Agent Workflows',
    architectureNote:
      'Orchestrates multi-step agent state machines with conditional routing, memory checkpoints, and human-in-the-loop review.',
    connectsWith: ['AI Agents', 'Multi-Agent Systems', 'LangChain'],
  },
  {
    id: 'ai-agents',
    name: 'AI Agents',
    category: 'AI & Agentic AI',
    iconKey: 'bot',
    roleInStack: 'Autonomous Goal-Directed Execution',
    architectureNote:
      'Agents capable of decomposing tasks, invoking external APIs or MCP tools, inspecting results, and iterating cleanly.',
    connectsWith: ['LangGraph', 'Model Context Protocol (MCP)', 'AI Workflow Automation'],
  },
  {
    id: 'multi-agent-systems',
    name: 'Multi-Agent Systems',
    category: 'AI & Agentic AI',
    iconKey: 'network',
    roleInStack: 'Specialized Collaborative Roles',
    architectureNote:
      'Supervisor-worker and pipeline topologies separating research, synthesis, verification, and execution responsibilities.',
    connectsWith: ['LangGraph', 'AI Agents', 'FastAPI'],
  },
  {
    id: 'rag',
    name: 'Retrieval-Augmented Generation (RAG)',
    category: 'AI & Agentic AI',
    iconKey: 'database',
    roleInStack: 'Grounded Knowledge Retrieval',
    architectureNote:
      'Document chunking, semantic indexing, and citation-grounded generation across PDFs, DOCX files, CSVs, and web sources.',
    connectsWith: ['LangChain', 'Google Gemini API', 'Python'],
  },
  {
    id: 'mcp',
    name: 'Model Context Protocol (MCP)',
    category: 'AI & Agentic AI',
    iconKey: 'plug',
    roleInStack: 'Standardized Context & Tool Bridge',
    architectureNote:
      'Exposes clean tools, resources, and remote server endpoints so AI models interact reliably with external applications.',
    connectsWith: ['AI Agents', 'Python', 'FastAPI'],
  },
  {
    id: 'python',
    name: 'Python',
    category: 'Backend Development',
    iconKey: 'code',
    roleInStack: 'Core Systems & Async Agent Runtime',
    architectureNote:
      'Primary language powering AI agent orchestration, document processing, MCP servers, Flask apps, and FastAPI services.',
    connectsWith: ['FastAPI', 'Flask', 'LangChain'],
  },
  {
    id: 'fastapi',
    name: 'FastAPI',
    category: 'Backend Development',
    iconKey: 'zap',
    roleInStack: 'High-Throughput Async API Layer',
    architectureNote:
      'Serves typed REST and streaming endpoints with schema validation to expose AI pipelines to web apps and webhooks.',
    connectsWith: ['Python', 'REST APIs', 'n8n'],
  },
  {
    id: 'flask',
    name: 'Flask',
    category: 'Backend Development',
    iconKey: 'server',
    roleInStack: 'Lightweight Python Web & AI Services',
    architectureNote:
      'Used to build practical AI web applications such as PDF/DOCX resume reviewers with clean route handling and file uploads.',
    connectsWith: ['Python', 'REST APIs', 'LangChain'],
  },
  {
    id: 'rest-apis',
    name: 'REST APIs',
    category: 'Backend Development',
    iconKey: 'route',
    roleInStack: 'Service Integration & Data Exchange',
    architectureNote:
      'Designing and integrating structured HTTP endpoints connecting AI models, webhook triggers, databases, and frontend UIs.',
    connectsWith: ['FastAPI', 'Flask', 'AI Workflow Automation'],
  },
  {
    id: 'google-gemini-api',
    name: 'Google Gemini API',
    category: 'AI Integration',
    iconKey: 'sparkles',
    roleInStack: 'Multimodal Reasoning & Structured Outputs',
    architectureNote:
      'Powers document analysis, resume feedback, study synthesis, function calling, and structured JSON generation.',
    connectsWith: ['LLM Integration', 'Prompt Engineering', 'Retrieval-Augmented Generation (RAG)'],
  },
  {
    id: 'llm-integration',
    name: 'LLM Integration',
    category: 'AI Integration',
    iconKey: 'cpu',
    roleInStack: 'Application-Level Model Wiring',
    architectureNote:
      'Integrating large language models cleanly into web backends, document parsers, and automation nodes with validation.',
    connectsWith: ['Google Gemini API', 'LangChain', 'REST APIs'],
  },
  {
    id: 'prompt-engineering',
    name: 'Prompt Engineering',
    category: 'AI Integration',
    iconKey: 'terminal',
    roleInStack: 'Deterministic Instruction & Schema Design',
    architectureNote:
      'Crafting clear system instructions, output constraints, and context-grounding prompts to improve reliability.',
    connectsWith: ['Google Gemini API', 'LLM Integration', 'AI Agents'],
  },
  {
    id: 'n8n',
    name: 'n8n',
    category: 'Automation',
    iconKey: 'workflow',
    roleInStack: 'Visual Workflow & Node Orchestration',
    architectureNote:
      'Builds automated pipelines connecting webhooks, Gmail, OpenAI/Gemini nodes, and scheduled execution flows.',
    connectsWith: ['AI Workflow Automation', 'Human-in-the-Loop Workflows', 'REST APIs'],
  },
  {
    id: 'ai-workflow-automation',
    name: 'AI Workflow Automation',
    category: 'Automation',
    iconKey: 'refresh',
    roleInStack: 'End-to-End Automated Pipelines',
    architectureNote:
      'Combining triggers, AI drafting/classification steps, and downstream actions to remove repetitive manual work.',
    connectsWith: ['n8n', 'Human-in-the-Loop Workflows', 'AI Agents'],
  },
  {
    id: 'human-in-the-loop-workflows',
    name: 'Human-in-the-Loop Workflows',
    category: 'Automation',
    iconKey: 'user-check',
    roleInStack: 'Supervised Approval & Regeneration',
    architectureNote:
      'Integrating human review checkpoints inside automated pipelines—such as LinkedIn post generation and content regeneration.',
    connectsWith: ['n8n', 'AI Workflow Automation', 'LangGraph'],
  },
];

export const FEATURED_PROJECTS: ProjectItem[] = [
  {
    id: 'ai-sdr-agent',
    index: '01',
    title: 'AI SDR Agent',
    category: 'Autonomous Outreach Pipeline',
    shortDescription:
      'An autonomous sales development agent that researches prospect profiles, analyzes company context, and drafts tailored outreach sequences.',
    architectureSummary:
      'Built as a stateful multi-step graph separating lead enrichment, signal extraction, message drafting, and structured review before CRM handoff.',
    technologies: ['LangGraph', 'Gemini API', 'Python', 'FastAPI', 'n8n Automation'],
    pipelineNodes: [
      { label: 'Lead Intake', detail: 'Webhook / CSV prospect payload' },
      { label: 'Research Node', detail: 'Company & role context synthesis' },
      { label: 'Drafting Graph', detail: 'Angle selection & personalization' },
      { label: 'Workflow Sync', detail: 'n8n approval & delivery trigger' },
    ],
    visualVariant: 'sdr',
    githubUrl: 'https://github.com/ranausman831',
    caseStudy: {
      overview:
        'An autonomous outreach architecture designed to transform raw prospect lists into researched, context-aware outbound drafts without sacrificing human oversight.',
      problemStatement:
        'Manual outbound prospecting requires switching across company pages, role descriptions, and repetitive email templates, creating bottlenecks and generic copy.',
      proposedSolution:
        'A stateful LangGraph workflow paired with Gemini API and n8n webhooks that separates intake validation, research summarization, angle selection, and supervised approval.',
      systemArchitecture:
        'Webhook and CSV payloads enter a FastAPI endpoint, pass through a modular LangGraph state graph (Intake → Research Node → Drafting Node), and pause cleanly for n8n review prior to dispatch.',
      keyFeatures: [
        'Stateful node separation between lead enrichment, reasoning, and drafting',
        'Structured prospect context briefs before message generation',
        'FastAPI REST interface compatible with webhook triggers',
        'Human-in-the-Loop approval integration via n8n before external delivery',
      ],
      developmentChallenges: [
        'Preventing hallucinated company details when sparse input payloads are submitted',
        'Maintaining predictable structured JSON state transitions between LangGraph nodes',
        'Keeping outreach tone concise and adaptable across different target roles',
      ],
      myContribution:
        'Designed the LangGraph node topology, structured Gemini prompt schemas, FastAPI integration layer, and n8n workflow handoff triggers.',
      liveDemoUrl: null,
    },
  },
  {
    id: 'ai-keyword-research-agent',
    index: '02',
    title: 'AI Keyword Research Agent',
    category: 'Multi-Step SEO Intelligence',
    shortDescription:
      'An agentic research workflow that expands seed topics, clusters search intent, and structures actionable keyword hierarchies.',
    architectureSummary:
      'Uses structured tool calls to group related terms by user intent, eliminate redundancy, and output clean topic briefs for content planning.',
    technologies: ['LangChain', 'AI Agents', 'Gemini API', 'Python', 'MCP'],
    pipelineNodes: [
      { label: 'Seed Topic', detail: 'Domain & audience constraint' },
      { label: 'Expansion Agent', detail: 'Query & long-tail discovery' },
      { label: 'Intent Clustering', detail: 'Informational vs. commercial map' },
      { label: 'Brief Output', detail: 'Structured topic hierarchy' },
    ],
    visualVariant: 'keyword',
    githubUrl: 'https://github.com/ranausman831',
    caseStudy: {
      overview:
        'A multi-step topic discovery and search-intent clustering pipeline that organizes broad domain seeds into structured editorial hierarchies.',
      problemStatement:
        'Raw keyword brainstorming produces flat, overlapping lists without clear differentiation between informational, navigational, and commercial search intent.',
      proposedSolution:
        'An agentic LangChain + Gemini pipeline coupled with MCP tool interfaces that expands domain seeds, normalizes duplicates, and categorizes terms by reader intent.',
      systemArchitecture:
        'Seed constraints feed an Expansion Agent node, stream into an Intent Clustering stage for semantic grouping, and serialize into structured topic briefs.',
      keyFeatures: [
        'Automated expansion from single seed topics into structured long-tail clusters',
        'Intent classification separating informational and decision-stage queries',
        'Redundancy pruning across overlapping semantic phrases',
        'MCP-compatible tool interface for composable workflow reuse',
      ],
      developmentChallenges: [
        'Eliminating near-duplicate phrasing across long-tail keyword expansions',
        'Enforcing consistent taxonomy labels across varied industry domains',
      ],
      myContribution:
        'Built the Python expansion chains, clustering prompt taxonomy, and structured output pipeline.',
      liveDemoUrl: null,
    },
  },
  {
    id: 'intern-ai-support-chatbot',
    index: '03',
    title: 'Intern AI Support Chatbot',
    category: 'RAG Knowledge Assistant',
    shortDescription:
      'A grounded conversational assistant built to answer onboarding and technical support questions using internal documentation.',
    architectureSummary:
      'Combines document chunking, semantic vector retrieval, and citation-aware prompting behind a FastAPI service so answers stay anchored to real guides.',
    technologies: ['RAG', 'LangChain', 'FastAPI', 'Gemini API', 'Python'],
    pipelineNodes: [
      { label: 'User Query', detail: 'Onboarding or policy question' },
      { label: 'Retriever', detail: 'Top-k semantic doc lookup' },
      { label: 'Grounded LLM', detail: 'Context-constrained synthesis' },
      { label: 'FastAPI Stream', detail: 'Cited response delivery' },
    ],
    visualVariant: 'chatbot',
    githubUrl: 'https://github.com/ranausman831',
    caseStudy: {
      overview:
        'A documentation-grounded conversational assistant tailored to answer recurring onboarding and technical setup questions.',
      problemStatement:
        'New contributors and interns repeatedly search scattered handbook pages for environment setup and policy answers, while ungrounded LLMs risk fabricating steps.',
      proposedSolution:
        'A Retrieval-Augmented Generation (RAG) assistant served via FastAPI that retrieves top-k handbook chunks first and constrains Gemini responses to verified snippets.',
      systemArchitecture:
        'Documentation files are split into overlapping semantic chunks, indexed for vector similarity search, retrieved per user query, and passed into a strict grounding system prompt over FastAPI.',
      keyFeatures: [
        'Top-k semantic retrieval over internal onboarding documentation',
        'Context-constrained prompting that avoids unsupported speculation',
        'FastAPI HTTP service separating document indexing from query inference',
        'Clear fallback messaging when documentation does not cover a question',
      ],
      developmentChallenges: [
        'Tuning chunk size and overlap so multi-step setup commands stay intact',
        'Balancing retrieval recall with concise context windows to avoid noisy answers',
      ],
      myContribution:
        'Implemented the document ingestion pipeline, LangChain retriever logic, grounding prompt instructions, and FastAPI backend routes.',
      liveDemoUrl: null,
    },
  },
  {
    id: 'backlink-automation-agent',
    index: '04',
    title: 'Backlink Automation Agent',
    category: 'Workflow & Outreach Automation',
    shortDescription:
      'An automated pipeline that discovers relevant link opportunities, evaluates domain fit, and orchestrates outreach tracking.',
    architectureSummary:
      'Pairs n8n trigger and scheduling nodes with Python evaluation agents to classify prospect pages, prepare outreach context, and log pipeline state.',
    technologies: ['n8n Automation', 'Multi-Agent Systems', 'Python', 'FastAPI', 'AI Agents'],
    pipelineNodes: [
      { label: 'Discovery Feed', detail: 'Target niche & anchor inputs' },
      { label: 'Fit Evaluator', detail: 'Relevance & topic check agent' },
      { label: 'Pitch Generator', detail: 'Context-matched outreach note' },
      { label: 'n8n Tracker', detail: 'Automated follow-up queue' },
    ],
    visualVariant: 'backlink',
    githubUrl: 'https://github.com/ranausman831',
    caseStudy: {
      overview:
        'An automation-first outreach workflow pairing Python domain evaluation agents with n8n scheduling and state tracking.',
      problemStatement:
        'Link-building teams spend substantial manual effort filtering irrelevant websites and tracking follow-up statuses across spreadsheets.',
      proposedSolution:
        'A multi-stage automation architecture where n8n orchestrates discovery triggers and queues while Python FastAPI agents score topical fit and draft tailored pitches.',
      systemArchitecture:
        'Scheduled n8n workflows dispatch candidate domains to a FastAPI evaluation service; qualifying targets advance to a pitch-drafting node and structured tracker.',
      keyFeatures: [
        'Topic and niche relevance scoring before pitch preparation',
        'Context-aware outreach note drafting tailored to target content',
        'Scheduled n8n automation queues preventing duplicate outreach',
        'Modular separation between Python reasoning and n8n orchestration',
      ],
      developmentChallenges: [
        'Designing idempotent webhook handoffs so retried workflow runs never duplicate pitches',
        'Filtering low-relevance pages cleanly before invoking LLM drafting nodes',
      ],
      myContribution:
        'Architected the multi-stage n8n workflow, FastAPI evaluation endpoints, and structured state-tracking pipeline.',
      liveDemoUrl: null,
    },
  },
  {
    id: 'pdf-research-assistant',
    index: '05',
    title: 'PDF Research Assistant',
    category: 'Document RAG & Synthesis',
    shortDescription:
      'An intelligent document assistant for uploading technical PDFs, extracting structured insights, and querying across multi-page files.',
    architectureSummary:
      'Parses multi-section PDFs into metadata-tagged chunks, indexes semantic embeddings, and supports deep Q&A with page-level reference grounding.',
    technologies: ['RAG', 'Gemini API', 'LangChain', 'Python', 'FastAPI'],
    pipelineNodes: [
      { label: 'PDF Ingestion', detail: 'Text extraction & section split' },
      { label: 'Vector Index', detail: 'Metadata-aware chunk storage' },
      { label: 'Query Router', detail: 'Summary vs. pinpoint retrieval' },
      { label: 'Grounded Output', detail: 'Source-referenced synthesis' },
    ],
    visualVariant: 'pdf',
    githubUrl: 'https://github.com/ranausman831',
    caseStudy: {
      overview:
        'A multi-page PDF analysis and question-answering system designed to help readers extract structured notes and verified answers from dense documents.',
      problemStatement:
        'Reading lengthy academic papers and technical manuals makes cross-referencing specific sections slow and error-prone.',
      proposedSolution:
        'A LangChain + Gemini RAG pipeline that tags extracted chunks with page/section metadata and routes between global summarization and targeted Q&A.',
      systemArchitecture:
        'Uploaded PDFs pass through text extraction and metadata chunking into a semantic vector store; incoming queries route either to targeted chunk retrieval or section synthesis.',
      keyFeatures: [
        'Multi-page PDF text ingestion with section and page metadata retention',
        'Dual query path supporting broad summaries and specific pinpoint questions',
        'Grounded synthesis referencing retrieved source sections',
        'Clean Python + FastAPI backend structure for document uploads',
      ],
      developmentChallenges: [
        'Handling multi-column or irregularly formatted PDF text extraction',
        'Preserving section metadata across split boundaries for accurate citations',
      ],
      myContribution:
        'Built the PDF parsing workflow, LangChain chunking and retrieval configuration, and Gemini synthesis prompts.',
      liveDemoUrl: null,
    },
  },
];

export const GITHUB_PROJECT_CATEGORIES: GitHubProjectCategory[] = [
  'All',
  'AI & Machine Learning',
  'Agentic AI & MCP',
  'AI Automation',
  'Web Development',
  'Android Development',
];

export const GITHUB_PROJECTS: GitHubProjectItem[] = [
  {
    id: 'ai-career-recommendation-system',
    index: '01',
    title: 'AI Career Recommendation System',
    category: 'AI & Machine Learning',
    description:
      "AI-powered career recommendation tool that suggests job roles and personalized learning paths based on interns' skills and interests.",
    technologies: ['Python'],
    githubUrl: 'https://github.com/ranausman831/AI-Career-Recommendation-System',
    repoName: 'AI-Career-Recommendation-System',
  },
  {
    id: 'ai-linkedin-post-generator',
    index: '02',
    title: 'AI LinkedIn Post Generator',
    category: 'AI Automation',
    description:
      'AI-powered LinkedIn Post Generator Agent with Human-in-the-Loop approval and automated content regeneration using n8n.',
    technologies: ['n8n'],
    githubUrl: 'https://github.com/ranausman831/ai-linkedin-post-generator',
    repoName: 'ai-linkedin-post-generator',
  },
  {
    id: 'ai-resume-reviewer',
    index: '03',
    title: 'AI Resume Reviewer',
    category: 'AI & Machine Learning',
    description:
      'AI-powered resume reviewer built with Python, Flask, LangChain, and Gemini. Users can upload PDF or DOCX resumes and receive AI-generated feedback on skills, structure, experience, projects, and improvement areas.',
    technologies: ['Python', 'Flask', 'LangChain', 'Gemini'],
    githubUrl: 'https://github.com/ranausman831/AI_RESUME_REVIEWER',
    repoName: 'AI_RESUME_REVIEWER',
  },
  {
    id: 'daily-expenses-tracker',
    index: '04',
    title: 'Daily Expenses Tracker',
    category: 'Web Development',
    description: 'A simple application for recording and managing daily expenses.',
    technologies: [],
    githubUrl: 'https://github.com/ranausman831/daily_expenses',
    repoName: 'daily_expenses',
  },
  {
    id: 'student-productivity-mcp',
    index: '05',
    title: 'Student Productivity MCP',
    category: 'Agentic AI & MCP',
    description: 'A student productivity project built around the Model Context Protocol (MCP).',
    technologies: ['Python', 'MCP'],
    githubUrl: 'https://github.com/ranausman831/student_productivity_mcp',
    repoName: 'student_productivity_mcp',
  },
  {
    id: 'remote-mcp-server',
    index: '06',
    title: 'Remote MCP Server',
    category: 'Agentic AI & MCP',
    description: 'A remote MCP server implementation demonstrating MCP-based tool integration.',
    technologies: ['Python', 'MCP'],
    githubUrl: 'https://github.com/ranausman831/remote-mcp-server',
    repoName: 'remote-mcp-server',
  },
  {
    id: 'ride-app',
    index: '07',
    title: 'Ride App',
    category: 'Web Development',
    description: 'A ride application project developed for Mian Channu.',
    technologies: ['TypeScript'],
    githubUrl: 'https://github.com/ranausman831/rideapp',
    repoName: 'rideapp',
  },
  {
    id: 'studymate-ai',
    index: '08',
    title: 'StudyMate AI',
    category: 'AI & Machine Learning',
    description:
      'AI-powered study material analyzer built with LangChain. It supports TXT, PDF, CSV, directories, and websites, and generates summaries, important points, and questions using Gemini.',
    technologies: ['Python', 'LangChain', 'Gemini'],
    githubUrl: 'https://github.com/ranausman831/StudyMate-AI',
    repoName: 'StudyMate-AI',
  },
  {
    id: 'ai-resume',
    index: '09',
    title: 'AI Resume',
    category: 'AI & Machine Learning',
    description: 'An AI resume-related project.',
    technologies: [],
    githubUrl: 'https://github.com/ranausman831/AI-Resume',
    repoName: 'AI-Resume',
  },
  {
    id: 'ai-study-assistant',
    index: '10',
    title: 'AI Study Assistant',
    category: 'AI & Machine Learning',
    description:
      'AI Study Assistant built with LangChain and Google Gemini that generates simple study notes, important points, and questions from any topic.',
    technologies: ['Python', 'LangChain', 'Google Gemini'],
    githubUrl: 'https://github.com/ranausman831/AI-STUDY-ASSIST',
    repoName: 'AI-STUDY-ASSIST',
  },
  {
    id: 'automation-web',
    index: '11',
    title: 'Automation Web',
    category: 'AI Automation',
    description: 'A web automation project.',
    technologies: [],
    githubUrl: 'https://github.com/ranausman831/automation',
    repoName: 'automation',
  },
  {
    id: 'website-industry',
    index: '12',
    title: 'Website Industry',
    category: 'Web Development',
    description: 'An industry-related website project.',
    technologies: ['CSS'],
    githubUrl: 'https://github.com/ranausman831/website_industry',
    repoName: 'website_industry',
  },
  {
    id: 'student-form',
    index: '13',
    title: 'Student Form',
    category: 'Web Development',
    description: 'A student form project.',
    technologies: ['HTML'],
    githubUrl: 'https://github.com/ranausman831/new-github-project',
    repoName: 'new-github-project',
  },
  {
    id: 'html-repository-project',
    index: '14',
    title: 'HTML Repository Project',
    category: 'Web Development',
    description: 'A basic HTML web development project.',
    technologies: ['HTML'],
    githubUrl: 'https://github.com/ranausman831/new-repo-html',
    repoName: 'new-repo-html',
  },
  {
    id: 'listing-project',
    index: '15',
    title: 'Listing Project',
    category: 'Web Development',
    description: 'A listing-related web project.',
    technologies: [],
    githubUrl: 'https://github.com/ranausman831/listing',
    repoName: 'listing',
  },
  {
    id: 'ai-business-agent',
    index: '16',
    title: 'AI Business Agent',
    category: 'Agentic AI & MCP',
    description: 'An AI business agent project.',
    technologies: [],
    githubUrl: 'https://github.com/ranausman831/AI-Business-Agent',
    repoName: 'AI-Business-Agent',
  },
  {
    id: 'ai-email-automation',
    index: '17',
    title: 'AI Email Automation',
    category: 'AI Automation',
    description: 'AI-powered email automation workflow built with n8n, OpenAI, and Gmail.',
    technologies: ['n8n', 'OpenAI', 'Gmail'],
    githubUrl: 'https://github.com/ranausman831/ai-email-automation-n8n',
    repoName: 'ai-email-automation-n8n',
  },
  {
    id: 'greenfy-plant-care-android',
    index: '18',
    title: 'Greenfy — Plant Care Android App',
    category: 'Android Development',
    description: 'My Android Plant Care application.',
    technologies: ['Java', 'Android'],
    githubUrl: 'https://github.com/ranausman831/Greenfy',
    repoName: 'Greenfy',
  },
];

export const TIMELINE_DATA: TimelineEntry[] = [
  {
    id: 'gcu-bs-cs',
    period: '2022 – 2026',
    title: 'BS Computer Science',
    institution: 'Government College University Faisalabad',
    type: 'Education',
    summary:
      'Pursuing a Bachelor of Science in Computer Science with core focus on software engineering, algorithms, data structures, and artificial intelligence systems.',
    highlights: [
      'Artificial Intelligence & Software Architecture',
      'Backend Engineering & REST APIs',
      'Agentic AI Systems & Applied RAG',
    ],
  },
  {
    id: 'agentic-specialization',
    period: 'Hands-On Journey',
    title: 'Practical AI & Agentic Project Development',
    institution: 'Open-Source Builds & Applied Systems',
    type: 'Development',
    summary:
      'Building real-world AI applications including PDF/DOCX resume reviewers, multi-format study assistants, career recommendation tools, and Model Context Protocol (MCP) servers.',
    highlights: [
      'LangChain, LangGraph & Google Gemini API',
      'Model Context Protocol (MCP) Tool Servers',
      'Grounded RAG Document Pipelines',
    ],
  },
  {
    id: 'backend-automation-journey',
    period: 'Systems Focus',
    title: 'AI APIs, Backend Development & Workflow Automation',
    institution: 'End-to-End Engineering Practice',
    type: 'Development',
    summary:
      'Connecting Python, FastAPI, and Flask backends with n8n automation and Human-in-the-Loop approval workflows across email, content, and task pipelines.',
    highlights: [
      'Python, FastAPI, Flask & REST APIs',
      'n8n AI Workflow & Email Automation',
      'Human-in-the-Loop Approval Loops',
    ],
  },
  {
    id: 'aspire-fsc',
    period: '2019 – 2021',
    title: 'FSc Non-Medical',
    institution: 'Aspire College',
    type: 'Education',
    summary:
      'Completed intermediate studies in mathematics, physics, and analytical sciences, establishing quantitative problem-solving foundations.',
    highlights: ['Mathematics & Analytical Reasoning', 'Physics & Computational Logic'],
  },
  {
    id: 'matriculation',
    period: '2019',
    title: 'Matriculation',
    institution: 'Secondary School Education',
    type: 'Education',
    summary:
      'Completed secondary education with science focus, sparking long-term interest in computing and intelligent software.',
    highlights: ['Core Sciences & Computing Fundamentals'],
  },
];

export const CONTACT_INFO = {
  linkedinUrl: 'https://www.linkedin.com/in/muhammad-usman-74431034b/',
  linkedinLabel: 'linkedin.com/in/muhammad-usman-74431034b',
  email: 'mbox9016@gmail.com',
  githubUrl: 'https://github.com/ranausman831',
  githubRepositoriesUrl: 'https://github.com/ranausman831?tab=repositories',
  githubLabel: 'github.com/ranausman831',
  // Optional direct WhatsApp configuration: set a verified wa.me URL (e.g. 'https://wa.me/923001234567')
  // and display label to reveal the WhatsApp card in the Contact section.
  whatsappUrl: '',
  whatsappLabel: '',
} as const;

// Detailed Case Study blueprints for key public GitHub repositories
export const CASE_STUDY_BY_REPO_ID: Record<string, ProjectCaseStudy & { pipelineNodes: ProjectPipelineNode[] }> = {
  'ai-career-recommendation-system': {
    overview:
      'An AI-powered career recommendation system suggesting suitable technical roles and personalized learning roadmaps from an intern’s skill profile and interests.',
    problemStatement:
      'Early-career developers and interns often struggle to map their current skillset to realistic job roles and structured next-step learning resources.',
    proposedSolution:
      'A Python recommendation application that evaluates stated skills and career interests to output ranked role matches paired with actionable study milestones.',
    systemArchitecture:
      'User skill and interest inputs pass through a Python evaluation layer that maps competencies against role requirements and produces structured learning path guidance.',
    pipelineNodes: [
      { label: 'Skill Intake', detail: 'Collect interests & technical skills' },
      { label: 'Profile Matching', detail: 'Align competencies to target roles' },
      { label: 'Gap Analysis', detail: 'Identify missing foundational topics' },
      { label: 'Roadmap Output', detail: 'Recommend roles & learning path' },
    ],
    keyFeatures: [
      'Role matching tailored to intern skills and declared interests',
      'Personalized learning path suggestions rather than generic links',
      'Lightweight Python architecture built for quick iteration',
    ],
    developmentChallenges: [
      'Structuring recommendations so beginners receive realistic progression paths',
      'Handling diverse input descriptions across overlapping technical domains',
    ],
    myContribution:
      'Designed and implemented the Python career matching logic and learning path recommendation workflow.',
    liveDemoUrl: null,
  },
  'ai-linkedin-post-generator': {
    overview:
      'An automated n8n LinkedIn post generator incorporating Human-in-the-Loop approval and automated regeneration loops before publishing.',
    problemStatement:
      'Fully automated social content bots frequently produce off-brand drafts if published without review, whereas writing every post manually slows consistency.',
    proposedSolution:
      'An n8n workflow pairing AI drafting nodes with an explicit Human-in-the-Loop checkpoint allowing reviewers to approve or trigger automated regeneration.',
    systemArchitecture:
      'Topic triggers enter n8n, invoke an AI post-drafting step, route to a review checkpoint, and loop back to regeneration when feedback requests revisions.',
    pipelineNodes: [
      { label: 'Topic Trigger', detail: 'Draft idea or scheduled trigger' },
      { label: 'AI Post Writer', detail: 'Draft LinkedIn copy in n8n' },
      { label: 'Human Review', detail: 'Approve or request regeneration' },
      { label: 'Regenerate Loop', detail: 'Refine draft from reviewer feedback' },
    ],
    keyFeatures: [
      'Explicit Human-in-the-Loop approval gate inside n8n',
      'Automated regeneration loop when a draft needs improvement',
      'End-to-end visual workflow orchestration without external boilerplate',
    ],
    developmentChallenges: [
      'Managing workflow execution pause/resume state during human approval',
      'Passing revision context cleanly back into the regeneration prompt',
    ],
    myContribution:
      'Built the complete n8n node graph, prompt configuration, and Human-in-the-Loop regeneration loop.',
    liveDemoUrl: null,
  },
  'ai-resume-reviewer': {
    overview:
      'A Flask web application integrating LangChain and Google Gemini to review uploaded PDF or DOCX resumes across skills, structure, experience, and projects.',
    problemStatement:
      'Students and job applicants rarely receive structured, section-by-section feedback on how clearly their resume communicates technical impact.',
    proposedSolution:
      'A Python + Flask application that parses PDF and DOCX uploads cleanly and leverages LangChain with Gemini to generate actionable section-level critique.',
    systemArchitecture:
      'Browser file uploads reach Flask route handlers, document parsers extract clean text from PDF/DOCX files, and LangChain passes content to Gemini for structured evaluation.',
    pipelineNodes: [
      { label: 'Resume Upload', detail: 'Accept PDF or DOCX file in Flask' },
      { label: 'Text Extraction', detail: 'Parse document layout cleanly' },
      { label: 'LangChain + Gemini', detail: 'Evaluate skills, projects & structure' },
      { label: 'Review Report', detail: 'Present prioritized improvement areas' },
    ],
    keyFeatures: [
      'Supports both PDF and DOCX resume formats',
      'Evaluates skills, structure, experience, projects, and improvement areas',
      'Clean Flask web routing paired with LangChain and Gemini inference',
    ],
    developmentChallenges: [
      'Handling formatting differences between PDF and DOCX text extraction',
      'Ensuring constructive, section-specific feedback rather than vague summaries',
    ],
    myContribution:
      'Developed the Flask backend, document upload validation, text extraction pipeline, and LangChain + Gemini review chains.',
    liveDemoUrl: null,
  },
  'student-productivity-mcp': {
    overview:
      'A student productivity tooling project built on the Model Context Protocol (MCP) to expose academic and task utilities directly to MCP-compatible AI clients.',
    problemStatement:
      'AI assistants cannot reliably inspect or update student study schedules and productivity tools without ad-hoc, fragile glue code.',
    proposedSolution:
      'An MCP server implementation in Python defining typed tools and structured schemas that AI clients can invoke cleanly.',
    systemArchitecture:
      'MCP clients communicate over the protocol boundary to discover available Python productivity tools, send validated arguments, and receive structured tool outputs.',
    pipelineNodes: [
      { label: 'MCP Client', detail: 'AI host requests tool schema' },
      { label: 'Tool Discovery', detail: 'Expose typed productivity actions' },
      { label: 'Python Handler', detail: 'Execute validated task logic' },
      { label: 'Structured Result', detail: 'Return grounded MCP response' },
    ],
    keyFeatures: [
      'Standardized Model Context Protocol (MCP) tool definitions',
      'Python implementation ready for MCP-capable AI assistants',
      'Clean separation between LLM reasoning and deterministic task execution',
    ],
    developmentChallenges: [
      'Designing concise tool schemas so AI models select the right parameters reliably',
      'Validating client inputs across protocol boundaries cleanly',
    ],
    myContribution:
      'Designed and implemented the MCP tool contracts and Python server handlers.',
    liveDemoUrl: null,
  },
  'remote-mcp-server': {
    overview:
      'A remote Model Context Protocol (MCP) server demonstrating network-accessible tool integration for AI agents and applications.',
    problemStatement:
      'Local stdio MCP servers are tied to a single workstation, limiting shared or cloud-connected agent tool access.',
    proposedSolution:
      'A Python remote MCP server architecture showcasing how external AI clients connect to and invoke hosted MCP tools over the network.',
    systemArchitecture:
      'Remote MCP transport listens for authorized client sessions, advertises registered tool definitions, executes handlers in Python, and streams protocol responses back.',
    pipelineNodes: [
      { label: 'Remote Client', detail: 'Connects over network transport' },
      { label: 'MCP Server', detail: 'Registers and validates tools' },
      { label: 'Tool Execution', detail: 'Runs Python business logic' },
      { label: 'Protocol Output', detail: 'Delivers typed response payload' },
    ],
    keyFeatures: [
      'Remote network-accessible MCP tool server pattern',
      'Demonstrates standardized tool registration and invocation in Python',
      'Reusable foundation for multi-agent and cloud AI integrations',
    ],
    developmentChallenges: [
      'Structuring transport handling and clear error payloads across remote requests',
      'Maintaining clean contract boundaries between client discovery and server tools',
    ],
    myContribution:
      'Built the Python remote MCP server implementation and tool integration examples.',
    liveDemoUrl: null,
  },
  'studymate-ai': {
    overview:
      'A multi-format AI study analyzer using LangChain and Gemini to process TXT, PDF, CSV, directories, and websites into summaries, key points, and practice questions.',
    problemStatement:
      'Students revise across heterogeneous materials—lecture PDFs, CSV notes, folders of text files, and web articles—making unified review time-consuming.',
    proposedSolution:
      'A unified LangChain document-loader and Gemini synthesis pipeline that normalizes multiple source formats into clean study outputs.',
    systemArchitecture:
      'Format-specific loaders read TXT, PDF, CSV, directories, or web URLs; LangChain splits content into manageable chunks; Gemini synthesizes summaries, key takeaways, and quiz questions.',
    pipelineNodes: [
      { label: 'Multi-Source Load', detail: 'TXT, PDF, CSV, folder, or web URL' },
      { label: 'Text Chunking', detail: 'LangChain normalization pipeline' },
      { label: 'Gemini Synthesis', detail: 'Generate summary & key points' },
      { label: 'Study Output', detail: 'Practice questions & structured notes' },
    ],
    keyFeatures: [
      'Multi-format ingestion across TXT, PDF, CSV, directories, and web pages',
      'Generates concise summaries, important bullet points, and revision questions',
      'Modular LangChain + Gemini pipeline in Python',
    ],
    developmentChallenges: [
      'Normalizing cleanly across diverse loaders (tabular CSV vs. unstructured web/PDF)',
      'Chunking large folders without exceeding model context limits',
    ],
    myContribution:
      'Built the multi-format LangChain ingestion loaders and Gemini study-synthesis workflow.',
    liveDemoUrl: null,
  },
  'ai-email-automation': {
    overview:
      'An AI-powered email automation workflow built with n8n, OpenAI, and Gmail to streamline inbox processing and response preparation.',
    problemStatement:
      'High-volume recurring emails require repetitive reading, triage, and drafting effort across daily inbox workflows.',
    proposedSolution:
      'An automated n8n pipeline listening to Gmail triggers, invoking OpenAI nodes for classification or drafting, and coordinating Gmail actions.',
    systemArchitecture:
      'Gmail trigger events enter n8n, pass message content to OpenAI reasoning nodes for analysis/drafting, and route structured results back to Gmail actions.',
    pipelineNodes: [
      { label: 'Gmail Trigger', detail: 'Watch incoming email events' },
      { label: 'n8n Router', detail: 'Extract sender & body context' },
      { label: 'OpenAI Node', detail: 'Classify intent & prepare draft' },
      { label: 'Gmail Action', detail: 'Store draft or automate workflow' },
    ],
    keyFeatures: [
      'Direct n8n integration with Gmail triggers and actions',
      'AI-driven message understanding and reply preparation',
      'Clean low-code node orchestration for repeatable inbox automation',
    ],
    developmentChallenges: [
      'Structuring prompts so email threads retain tone and essential context',
      'Safeguarding edge cases around automated trigger loops',
    ],
    myContribution:
      'Designed and configured the end-to-end n8n workflow connecting Gmail and OpenAI nodes.',
    liveDemoUrl: null,
  },
};

export interface ArchitectureNodeSpec {
  id: string;
  step: string;
  label: string;
  role: string;
  responsibility: string;
  io: string;
}

export interface ArchitectureBlueprint {
  id:
    | 'ai-agent-workflow'
    | 'langgraph-state-workflow'
    | 'rag-pipeline'
    | 'mcp-architecture'
    | 'multi-agent-system';
  shortLabel: string;
  title: string;
  overview: string;
  explanation: string;
  dataFlowSummary: string;
  nodes: ArchitectureNodeSpec[];
}

export const AI_ARCHITECTURES: ArchitectureBlueprint[] = [
  {
    id: 'ai-agent-workflow',
    shortLabel: 'AI Agent Workflow',
    title: 'Goal-Directed AI Agent Workflow',
    overview:
      'A structured perceive-plan-act-verify execution loop enabling an LLM agent to break down an objective, select appropriate tools, inspect real outputs, and refine before responding.',
    explanation:
      'Instead of relying on single-shot prompting, an agent workflow isolates planning from tool execution and checks intermediate results against constraints so errors are caught before reaching the user.',
    dataFlowSummary: 'Goal Input → Task Planner → Tool Selector → Tool Execution → Output Verification → Final Response',
    nodes: [
      {
        id: 'input-goal',
        step: '01',
        label: 'Goal & Constraints',
        role: 'Entry Interface',
        responsibility: 'Captures user intent, validates required inputs, and attaches system boundaries.',
        io: 'Validated prompt payload + schema rules',
      },
      {
        id: 'planner',
        step: '02',
        label: 'Reasoning Planner',
        role: 'Decision Engine',
        responsibility: 'Decomposes complex goals into ordered sub-tasks and picks the next action.',
        io: 'Action plan or direct completion signal',
      },
      {
        id: 'tool-exec',
        step: '03',
        label: 'Tool Invocation Layer',
        role: 'API & Function Bridge',
        responsibility: 'Executes deterministic Python functions, REST APIs, or external lookups safely.',
        io: 'Structured tool response or error status',
      },
      {
        id: 'verifier',
        step: '04',
        label: 'Observation & Check',
        role: 'Verification Gate',
        responsibility: 'Inspects tool results for completeness; triggers retry or delivers final response.',
        io: 'Verified final answer',
      },
    ],
  },
  {
    id: 'langgraph-state-workflow',
    shortLabel: 'LangGraph State Flow',
    title: 'LangGraph State-Based Workflow',
    overview:
      'A typed, cyclic state machine where specialized nodes read and mutate a shared state object across conditional edges, checkpoints, and optional Human-in-the-Loop pauses.',
    explanation:
      'LangGraph shines when workflows require loops, branching logic, and deterministic state persistence—such as drafting, critiquing, pausing for human approval, and regenerating cleanly.',
    dataFlowSummary: 'Shared State Init → Worker Node → Conditional Router → Review / Human Gate → State Checkpoint / End',
    nodes: [
      {
        id: 'typed-state',
        step: '01',
        label: 'Typed Graph State',
        role: 'Shared Memory Schema',
        responsibility: 'Holds messages, intermediate artifacts, retry counters, and approval flags.',
        io: 'Typed dictionary / Pydantic state',
      },
      {
        id: 'processing-node',
        step: '02',
        label: 'Processing Node',
        role: 'Graph Step Worker',
        responsibility: 'Executes focused reasoning or data enrichment and returns partial state updates.',
        io: 'State delta patch',
      },
      {
        id: 'conditional-edge',
        step: '03',
        label: 'Conditional Router',
        role: 'Branching Controller',
        responsibility: 'Evaluates state thresholds to route forward, loop back for revision, or escalate.',
        io: 'Next node key',
      },
      {
        id: 'hitl-gate',
        step: '04',
        label: 'Human / End Checkpoint',
        role: 'Supervised Handoff',
        responsibility: 'Pauses graph execution for human approval or commits final verified state.',
        io: 'Approved output / persisted checkpoint',
      },
    ],
  },
  {
    id: 'rag-pipeline',
    shortLabel: 'RAG Pipeline',
    title: 'Retrieval-Augmented Generation (RAG) Pipeline',
    overview:
      'Grounding LLM generation in external PDFs, DOCX files, CSVs, and knowledge bases through structured ingestion, semantic retrieval, and citation-constrained synthesis.',
    explanation:
      'RAG keeps model responses accurate and inspectable without retraining weights: documents are indexed into searchable chunks offline, and only relevant evidence enters the model prompt at query time.',
    dataFlowSummary: 'Source Docs → Chunk & Metadata → Vector Index → Semantic Top-K Retrieval → Grounded LLM Response',
    nodes: [
      {
        id: 'doc-ingest',
        step: '01',
        label: 'Document Loaders',
        role: 'Format Ingestion',
        responsibility: 'Extracts clean text and page/file metadata from PDF, DOCX, TXT, CSV, and web sources.',
        io: 'Normalized document sections',
      },
      {
        id: 'chunk-index',
        step: '02',
        label: 'Chunking & Vector Index',
        role: 'Semantic Store',
        responsibility: 'Splits text cleanly with overlap, embeds chunks, and stores searchable vectors.',
        io: 'Indexed embeddings + metadata',
      },
      {
        id: 'retriever',
        step: '03',
        label: 'Top-K Retriever',
        role: 'Query Matcher',
        responsibility: 'Embeds incoming questions and retrieves the highest-relevance context snippets.',
        io: 'Ranked evidence chunks',
      },
      {
        id: 'grounded-gen',
        step: '04',
        label: 'Grounded Synthesis',
        role: 'Constrained Generator',
        responsibility: 'Generates answers anchored strictly to retrieved snippets with clear missing-info honesty.',
        io: 'Cited answer + source references',
      },
    ],
  },
  {
    id: 'mcp-architecture',
    shortLabel: 'MCP Client-Server',
    title: 'MCP Client-Server Architecture',
    overview:
      'Standardized protocol architecture separating AI host applications (clients) from reusable external tool and resource servers over local or remote transports.',
    explanation:
      'Instead of rewriting bespoke integrations for every AI framework, Model Context Protocol (MCP) lets a Python tool server expose typed schemas once so any compatible AI client can discover and call them.',
    dataFlowSummary: 'AI Host / Client → Capability Discovery → Typed Tool Request → Remote/Local MCP Server → Structured Result',
    nodes: [
      {
        id: 'mcp-host',
        step: '01',
        label: 'AI Host & MCP Client',
        role: 'Protocol Consumer',
        responsibility: 'Initiates client sessions, negotiates protocol capabilities, and tracks active tools.',
        io: 'JSON-RPC initialize & list_tools',
      },
      {
        id: 'transport',
        step: '02',
        label: 'Protocol Transport',
        role: 'Stdio / Remote Channel',
        responsibility: 'Carries structured tool schemas, resource URIs, and execution payloads reliably.',
        io: 'Typed protocol messages',
      },
      {
        id: 'mcp-server',
        step: '03',
        label: 'Python MCP Server',
        role: 'Tool Registry & Guard',
        responsibility: 'Validates arguments against declared schemas and routes calls to domain handlers.',
        io: 'Validated handler invocation',
      },
      {
        id: 'domain-tools',
        step: '04',
        label: 'Tools & Resources',
        role: 'Backend Capabilities',
        responsibility: 'Executes productivity actions, database reads, or external API integrations.',
        io: 'Structured MCP tool response',
      },
    ],
  },
  {
    id: 'multi-agent-system',
    shortLabel: 'Multi-Agent System',
    title: 'Supervisor-Worker Multi-Agent System',
    overview:
      'Coordinated architecture delegating sub-problems across specialized worker agents (research, evaluation, drafting) supervised by an orchestrator node.',
    explanation:
      'Breaking one monolithic prompt into dedicated roles keeps instructions focused, makes failure points easier to debug, and allows deterministic checks between agent handoffs.',
    dataFlowSummary: 'Task Brief → Supervisor Orchestrator → Specialist Agents (Research / Eval / Draft) → Quality Check → Output',
    nodes: [
      {
        id: 'supervisor',
        step: '01',
        label: 'Supervisor Agent',
        role: 'Orchestrator',
        responsibility: 'Breaks down incoming requests, assigns tasks to specialists, and aggregates state.',
        io: 'Scoped sub-task assignments',
      },
      {
        id: 'research-agent',
        step: '02',
        label: 'Research Specialist',
        role: 'Context Gatherer',
        responsibility: 'Queries documents, web signals, or APIs to build structured factual briefs.',
        io: 'Verified context bundle',
      },
      {
        id: 'eval-draft-agent',
        step: '03',
        label: 'Evaluator & Drafter',
        role: 'Domain Execution',
        responsibility: 'Scores fit against criteria and generates domain-specific structured deliverables.',
        io: 'Candidate deliverable + score',
      },
      {
        id: 'handoff-sync',
        step: '04',
        label: 'Synthesis & Delivery',
        role: 'Final Aggregator',
        responsibility: 'Audits combined outputs and passes clean JSON or text to FastAPI or n8n workflows.',
        io: 'Production-ready output payload',
      },
    ],
  },
];

export type InsightTopic =
  | 'All'
  | 'Python'
  | 'Artificial Intelligence'
  | 'Agentic AI'
  | 'LangChain'
  | 'LangGraph'
  | 'Model Context Protocol'
  | 'Retrieval-Augmented Generation'
  | 'FastAPI'
  | 'AI Automation';

export interface TechnicalInsightItem {
  id: string;
  topic: Exclude<InsightTopic, 'All'>;
  title: string;
  summary: string;
  readingTime: string;
  statusLabel: 'Engineering Note · In Preparation (Unpublished)';
  keyTakeaways: string[];
  sections: Array<{ heading: string; body: string }>;
}

export const INSIGHT_TOPICS: InsightTopic[] = [
  'All',
  'Agentic AI',
  'LangGraph',
  'Model Context Protocol',
  'Retrieval-Augmented Generation',
  'LangChain',
  'FastAPI',
  'Python',
  'Artificial Intelligence',
  'AI Automation',
];

export const TECHNICAL_INSIGHTS: TechnicalInsightItem[] = [
  {
    id: 'note-agentic-ai',
    topic: 'Agentic AI',
    title: 'Designing Bounded Tool Loops in Agentic AI Systems',
    summary:
      'Architectural study notes on separating planning, deterministic tool validation, and bounded retry limits so autonomous agents fail safely.',
    readingTime: '4 min read',
    statusLabel: 'Engineering Note · In Preparation (Unpublished)',
    keyTakeaways: [
      'Isolate model reasoning from external side effects with strict input schemas.',
      'Bound max iteration depth to prevent runaway token or API loops.',
      'Surface explicit uncertainty when tool outputs lack required facts.',
    ],
    sections: [
      {
        heading: 'Why Tool Contracts Matter More Than Prompt Length',
        body: 'In practical Agentic AI builds, reliability comes primarily from clear tool boundaries rather than ever-longer prompts. When every tool accepts narrow, typed parameters and returns structured status fields, the agent recovers cleanly from missing or malformed inputs.',
      },
      {
        heading: 'Preventing Silent Loops',
        body: 'Autonomous execution always needs step ceilings and state-change checks. If two consecutive iterations call the same tool with identical inputs, deterministic guardrails should halt the loop and ask for clarification or escalate.',
      },
    ],
  },
  {
    id: 'note-langgraph',
    topic: 'LangGraph',
    title: 'Modeling Cyclic Agent Workflows with Shared State in LangGraph',
    summary:
      'How explicit state graphs enable conditional routing, draft-critique cycles, and clean Human-in-the-Loop pauses.',
    readingTime: '5 min read',
    statusLabel: 'Engineering Note · In Preparation (Unpublished)',
    keyTakeaways: [
      'Typed state keeps node responsibilities small and testable.',
      'Conditional edges make retry and escalation rules inspectable in code.',
      'Checkpoints allow human review before external side effects run.',
    ],
    sections: [
      {
        heading: 'State First, Prompts Second',
        body: 'Designing a LangGraph application starts with defining the shared state schema: raw input, extracted signals, current draft, critique feedback, and iteration count. Each node then acts like a clean transition function.',
      },
      {
        heading: 'Integrating Human Approval Gates',
        body: 'For high-impact actions such as outbound messaging or content publishing, breaking before the delivery node allows an operator to inspect state, approve, or trigger a targeted regeneration pass.',
      },
    ],
  },
  {
    id: 'note-mcp',
    topic: 'Model Context Protocol',
    title: 'Exposing Reusable Python Tools with Model Context Protocol (MCP)',
    summary:
      'Lessons from building local and remote Python MCP servers to standardize tool discovery across AI clients.',
    readingTime: '4 min read',
    statusLabel: 'Engineering Note · In Preparation (Unpublished)',
    keyTakeaways: [
      'Decouples tool implementations from any single AI chat client.',
      'Descriptive parameter schemas directly improve tool selection accuracy.',
      'Remote MCP transport extends local tool patterns to networked services.',
    ],
    sections: [
      {
        heading: 'One Tool Server, Any Compatible Host',
        body: 'Before MCP, exposing productivity utilities or custom scripts to an assistant meant writing framework-specific wrappers repeatedly. MCP standardizes how capabilities, inputs, and results cross the client-server boundary.',
      },
      {
        heading: 'Local vs. Remote MCP Boundaries',
        body: 'Local stdio servers work well for developer workstation automation, whereas remote MCP servers introduce clear network transport boundaries, input validation, and structured error reporting.',
      },
    ],
  },
  {
    id: 'note-rag',
    topic: 'Retrieval-Augmented Generation',
    title: 'Chunking & Metadata Strategies for Accurate Document RAG',
    summary:
      'Practical notes from PDF and multi-format study assistants on preserving document structure during semantic retrieval.',
    readingTime: '5 min read',
    statusLabel: 'Engineering Note · In Preparation (Unpublished)',
    keyTakeaways: [
      'Preserve page numbers and headings inside chunk metadata.',
      'Avoid splitting multi-step procedures or tables mid-sentence.',
      'Pair retrieved chunks with strict instructions to refuse unsupported claims.',
    ],
    sections: [
      {
        heading: 'Garbage Chunks Create Weak Retrieval',
        body: 'In document assistants handling PDFs, DOCX files, and CSVs, retrieval quality depends heavily on how cleanly source structure survives extraction. Attaching section titles and page numbers ensures the synthesizer never loses context.',
      },
      {
        heading: 'Grounding Guarantees',
        body: 'A RAG system should treat retrieved context as the single source of truth for factual questions. When top-k similarity yields weak matches, admitting the gap builds far more user trust than guessing.',
      },
    ],
  },
  {
    id: 'note-langchain',
    topic: 'LangChain',
    title: 'Composable Document Loaders and Structured Chains in LangChain',
    summary:
      'Organizing ingestion, text splitting, and structured LLM output parsers cleanly across Python AI applications.',
    readingTime: '4 min read',
    statusLabel: 'Engineering Note · In Preparation (Unpublished)',
    keyTakeaways: [
      'Normalize diverse formats (PDF, TXT, CSV, URLs) into a unified Document schema.',
      'Separate loader adapters from downstream summarization or QA prompts.',
      'Keep chain stages modular for straightforward debugging.',
    ],
    sections: [
      {
        heading: 'Unified Document Pipelines',
        body: 'Projects like StudyMate AI and AI Resume Reviewer benefit from treating ingestion as an interchangeable layer. Whether text starts in a PDF or a directory of files, normalizing early simplifies every downstream step.',
      },
    ],
  },
  {
    id: 'note-fastapi',
    topic: 'FastAPI',
    title: 'Serving Reliable AI Endpoints with FastAPI & Schema Validation',
    summary:
      'Why typed request/response models, timeouts, and clean error mapping make FastAPI ideal for AI microservices.',
    readingTime: '4 min read',
    statusLabel: 'Engineering Note · In Preparation (Unpublished)',
    keyTakeaways: [
      'Validate payloads upfront before paying LLM inference latency.',
      'Use async routes cleanly when coordinating upstream model and webhook calls.',
      'Return predictable JSON error shapes for frontend and automation clients.',
    ],
    sections: [
      {
        heading: 'Schema Boundaries Protect Downstream Models',
        body: 'In AI backends, bad inputs quickly turn into wasted tokens or confusing failures. FastAPI request validation catches missing fields and oversized text immediately at the HTTP boundary.',
      },
    ],
  },
  {
    id: 'note-python',
    topic: 'Python',
    title: 'Writing Maintainable Python Services for AI Engineering Projects',
    summary:
      'Structuring document parsers, environment configuration, and modular helpers across Flask, FastAPI, and MCP builds.',
    readingTime: '3 min read',
    statusLabel: 'Engineering Note · In Preparation (Unpublished)',
    keyTakeaways: [
      'Keep pure domain logic separate from web framework routing.',
      'Centralize environment config rather than reading secrets deep inside helpers.',
      'Write explicit error paths for file parsing and external HTTP timeouts.',
    ],
    sections: [
      {
        heading: 'Clarity Over Clever Abstractions',
        body: 'Whether building a Flask resume reviewer or a remote MCP server, separating file extraction, prompt construction, and HTTP transport keeps each Python module easy to test and extend.',
      },
    ],
  },
  {
    id: 'note-ai',
    topic: 'Artificial Intelligence',
    title: 'Evaluating LLM Outputs Beyond "Looks Good" in Prototype Apps',
    summary:
      'Notes on checking instruction adherence, format consistency, and groundedness when integrating Gemini and other LLMs.',
    readingTime: '4 min read',
    statusLabel: 'Engineering Note · In Preparation (Unpublished)',
    keyTakeaways: [
      'Verify structured JSON adherence across edge-case inputs.',
      'Test out-of-scope prompts explicitly to confirm honest fallback behavior.',
      'Track latency and failure modes independently of model quality.',
    ],
    sections: [
      {
        heading: 'Testing for What Can Go Wrong',
        body: 'Real users upload noisy documents and ask unexpected questions. Building repeatable test cases for empty inputs, ambiguous queries, and unsupported topics ensures consistent application behavior.',
      },
    ],
  },
  {
    id: 'note-automation',
    topic: 'AI Automation',
    title: 'Combining n8n Triggers with Human-in-the-Loop AI Checkpoints',
    summary:
      'Patterns from email triage and LinkedIn content workflows using n8n, webhooks, and supervised approval loops.',
    readingTime: '4 min read',
    statusLabel: 'Engineering Note · In Preparation (Unpublished)',
    keyTakeaways: [
      'Use n8n for visual scheduling, webhooks, and SaaS connectors.',
      'Offload complex reasoning or multi-step logic to dedicated Python/FastAPI endpoints.',
      'Keep human approval in the loop whenever external communication is sent.',
    ],
    sections: [
      {
        heading: 'Orchestration Meets Supervision',
        body: 'n8n excels at wiring Gmail, webhooks, and schedules quickly. Pairing those triggers with AI drafting and an explicit approval/regeneration step delivers automation speed without losing human judgment.',
      },
    ],
  },
];

