
export type AgentGuide = {
  title: string;
  description: string;
  features: string[];
  tips: string[];
  examplePrompts: { prompt: string; explanation: string }[];
  disclaimer?: string;
};

export const guides: Record<string, AgentGuide> = {
  'quran-tutor': {
    title: 'Quran Tutor',
    description: 'A guide to receiving spiritual guidance and knowledge from the Quran.',
    features: [
      'Ask questions about Quranic verses and their meanings in context.',
      'Seek guidance on life issues from an Islamic perspective.',
      'Explore the stories and lessons of the prophets.',
      'Understand complex theological concepts and their relevance today.',
    ],
    tips: [
      'Be specific in your questions to get more precise answers. Instead of "patience", ask "How can I practice patience when facing hardship, according to the Quran?"',
      'Frame your queries with respect and sincerity.',
      'Use follow-up questions to delve deeper into a topic.',
      'Combine spiritual queries with practical life scenarios for contextual guidance.',
    ],
    examplePrompts: [
      {
        prompt: 'What does the Quran say about dealing with grief and loss?',
        explanation: 'Asks for direct Quranic guidance on a specific emotional challenge.',
      },
      {
        prompt: 'Can you explain the story of Prophet Yusuf (Joseph) and its main lessons about trust and perseverance?',
        explanation: 'Requests a summary and moral takeaway from a specific Quranic narrative.',
      },
      {
        prompt: 'I am struggling with staying focused during my prayers. Is there any advice from the Quran or the life of the Prophet?',
        explanation: 'Connects a personal, practical issue to a request for spiritual advice.',
      },
    ],
  },
  'doctor-assistant': {
    title: 'Doctor Assistant',
    description: 'How to use the Symptom Checker for preliminary medical information.',
    features: [
        'Describe your symptoms in natural, conversational language.',
        'Receive a list of potential conditions based on your input for informational purposes.',
        'Get suggestions for next steps, such as when to see a doctor or what to ask them.',
        'Understand symptoms in a structured and informative way.',
    ],
    tips: [
        'Be as detailed as possible. Include the duration, severity, location, and nature of your symptoms (e.g., "sharp pain" vs "dull ache").',
        'Mention any relevant medical history or conditions if you feel comfortable.',
        'Do not rely on this tool for a diagnosis. Always consult a healthcare professional for medical advice.',
        'Use this tool to organize your thoughts and prepare for a more productive doctor\'s appointment.',
    ],
    examplePrompts: [
      {
        prompt: 'I have had a persistent dry cough, a low-grade fever around 37.5°C, and fatigue for the last three days. I also have a slight headache that gets worse in the afternoon.',
        explanation: 'Provides specific symptoms with duration and measurements for a more accurate analysis.',
      },
      {
        prompt: 'My child has a red rash on their arms and torso, but no fever. It doesn\'t seem to be itchy. It appeared this morning. What could this be?',
        explanation: 'Clearly describes the symptom and what is NOT present, which helps narrow down possibilities.',
      },
      {
        prompt: 'I\'m experiencing sharp pain in my lower right back after lifting a heavy object yesterday. It hurts more when I bend over or twist my body.',
        explanation: 'Gives context to the injury and specifies what actions worsen the symptom.',
      },
    ],
    disclaimer: 'This AI is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.',
  },
  'real-estate-agent': {
    title: 'Real Estate Agent',
    description: 'Your guide to finding and learning about real estate properties.',
    features: [
        'Get detailed information on a specific property address.',
        'Ask questions about a property\'s neighborhood, such as schools, parks, and crime rates.',
        'Inquire about market trends and property valuation estimates.',
        'Receive details on property history, such as past sales and tax assessments.',
    ],
    tips: [
        'Provide a full, accurate address including city and country for the best results.',
        'Ask specific questions. Instead of "Is this a good area?", try "What are the ratings of nearby elementary schools?" or "How far is the nearest hospital?"',
        'Use the agent to compare different properties by asking the same set of questions for multiple addresses.',
        'While the AI provides data, always consult with a human real estate professional for transactions and financial advice.',
    ],
    examplePrompts: [
      {
        prompt: 'Property Address: 1600 Amphitheatre Parkway, Mountain View, CA, USA. Question: What are the property taxes and recent sales history for this address?',
        explanation: 'A well-structured query with a clear address and specific financial questions.',
      },
      {
        prompt: 'Property Address: 1 Infinite Loop, Cupertino, CA, USA. Question: Tell me about the local amenities. Are there parks, grocery stores, and public transport within a 2km radius?',
        explanation: 'Asks for practical, location-based information relevant to a home buyer.',
      },
      {
        prompt: 'Property Address: 742 Evergreen Terrace, Springfield. Question: What is the estimated market value of this property and how does it compare to other 3-bedroom houses in the same zip code?',
        explanation: 'Requests a comparative market analysis, which is a high-value task for this agent.',
      },
    ],
  },
  'app-prototyper': {
    title: 'App Prototyper',
    description: 'Learn how to generate initial code snippets for your app ideas.',
    features: [
        'Describe an application in plain English, including its purpose and key features.',
        'Receive generated code snippets in modern frameworks as a starting point.',
        'Specify UI components, user interactions, and basic data models.',
        'Get code for simple UI components or logic to accelerate development.',
    ],
    tips: [
        'Clearly define the main purpose and target user of your app.',
        'Break down the app into its core components or screens (e.g., "a login screen," "a dashboard with charts," "a settings page").',
        'The more detailed your description, the more relevant the generated code will be. Mention technologies if you have a preference (e.g., React, TailwindCSS).',
        'Use the generated code as a foundation to build upon, not as a final, production-ready product.',
    ],
    examplePrompts: [
      {
        prompt: 'Generate code for a simple weather app using React and TailwindCSS. It should have a search bar to enter a city name and display the current temperature, humidity, and wind speed in a card.',
        explanation: 'Clearly states the app type, technology stack, and specific UI elements and data points to include.',
      },
      {
        prompt: 'I need a basic note-taking app. The main screen should show a grid of notes. There should be a floating action button to add a new note, which opens a modal. Each note card should have a delete button.',
        explanation: 'Describes the app by its core user actions, UI patterns (grid, floating button), and screens.',
      },
      {
        prompt: 'Create a reusable React component for a recipe app that displays a recipe. It needs to accept props for an image URL, title, an array of ingredients, and an array of instruction strings.',
        explanation: 'Focuses on a single, well-defined, reusable component with a clear data contract (props).',
      },
    ],
  },
  'antique-authenticator': {
    title: 'Antique Authenticator',
    description: 'How to get an AI-powered authentication analysis for your antiques.',
    features: [
        'Upload an image of an antique for a detailed visual analysis.',
        'Provide additional details like markings, history, or materials for a more accurate assessment.',
        'Receive an authenticity assessment based on style, era, and manufacturing techniques.',
        'Get insights into the potential value, origin, and key identifying features.',
    ],
    tips: [
        'Take clear, well-lit photos of the item from multiple angles (front, back, bottom).',
        'Include close-up pictures of any signatures, maker\'s marks, or unique details.',
        'In the "Additional Details" section, write down anything you know about the item\'s history (provenance).',
        'The AI provides an educated opinion. For high-value items, this analysis can be a great starting point for a professional appraisal.',
    ],
    examplePrompts: [
      {
        prompt: 'Image: [Image of a porcelain vase]. Details: This vase was inherited from my great-aunt who lived in Germany. It has a blue stamp on the bottom that looks like two crossed swords. Is it a genuine Meissen vase?',
        explanation: 'Provides an image, known history (provenance), and points out a specific feature (the mark) to guide the AI.',
      },
      {
        prompt: 'Image: [Image of a wooden chair]. Details: I found this at a flea market. It feels very heavy and has dovetail joints. Can you tell me what style it is and its approximate age?',
        explanation: 'Asks for specific information (style, age) and provides construction details (dovetail joints) which helps the AI focus its analysis.',
      },
    ],
    disclaimer: 'This analysis is based on visual data and AI pattern recognition. It is for informational purposes only and is not a substitute for a professional appraisal by a certified expert.',
  },
  'legal-assistant': {
    title: 'Legal Assistant',
    description: 'A guide to getting preliminary legal information and drafting simple documents.',
    features: [
      'Ask general questions about legal topics (e.g., contracts, intellectual property).',
      'Get help understanding common legal terms and concepts in plain language.',
      'Receive a basic structure or template for simple documents like an NDA or a basic service agreement.',
      'Explore legal considerations for common life events (e.g., starting a business, renting a property).',
    ],
    tips: [
      'Do not provide sensitive or confidential personal information. This is not a secure channel for legal advice.',
      'Frame questions generally. Ask "What are the typical elements of a freelance contract?" instead of describing a specific legal dispute.',
      'Use the information as a starting point for your own research or for a more productive consultation with a lawyer.',
      'For document drafting, be very clear about the purpose and key terms you want to include (e.g., parties involved, confidential information).',
    ],
    examplePrompts: [
      {
        prompt: 'What is the difference between a trademark and a copyright, and when would a small business need each one?',
        explanation: 'Asks for a clear definition and comparison of two legal concepts with a practical application.',
      },
      {
        prompt: 'I\'m starting a small online business selling handmade crafts. What are the basic legal steps I should consider in the US?',
        explanation: 'Requests a general checklist for a common scenario, specifying the jurisdiction.',
      },
      {
        prompt: 'Draft a simple one-way Non-Disclosure Agreement (NDA) for a new software project. The Disclosing Party is "Innovate Inc." and the Receiving Party is "John Doe". The confidential information is related to "Project X".',
        explanation: 'Requests a template for a common legal document with specific parties and subject matter.',
      },
    ],
    disclaimer: 'This AI is not a lawyer and does not provide legal advice. The information provided is for educational purposes only. You should consult with a qualified attorney for advice on your specific legal issues.',
  },
  'career-coach': {
    title: 'Career Coach',
    description: 'Get personalized career advice, resume feedback, and job search strategies.',
    features: [
      'Get actionable advice tailored to your career goals and experience level.',
      'Receive constructive feedback on your resume or professional summary to highlight your strengths.',
      'Discover strategies for networking, interviewing, and navigating the job market in your field.',
      'Get a list of curated resources (courses, books, communities) to help with your career development.',
    ],
    tips: [
      'Be specific about your career goal. "I want to become a Senior Data Scientist at a FAANG company within 2 years" is better than "I want a new job."',
      'Provide a concise but comprehensive summary of your experience. You can paste a simplified, anonymized version of your resume.',
      'Ask targeted questions about skills you need to develop, industries you want to enter, or challenges you are facing.',
      'Use the generated advice to create a concrete, step-by-step action plan for yourself.',
    ],
    examplePrompts: [
      {
        prompt: 'Career Goal: I am a software engineer with 5 years of experience in Python and AWS, and I want to transition to a management role. Experience: [Paste resume summary here]. What skills should I develop and how should I position myself in interviews?',
        explanation: 'Provides a clear starting point, a goal, and the relevant background information.',
      },
      {
        prompt: 'Career Goal: Land my first job as a UX designer. Experience: I just graduated from a UX bootcamp and have a portfolio with three projects (a mobile app for a local cafe, a website redesign for a non-profit, and a conceptual smart home app). Can you review my experience and suggest how to present it on my resume?',
        explanation: 'Focuses the request on resume/portfolio feedback for an entry-level position.',
      },
    ],
  },
  'travel-planner': {
    title: 'Travel Planner',
    description: 'Your guide to creating personalized travel itineraries and getting recommendations.',
    features: [
      'Generate a detailed, day-by-day itinerary for any destination worldwide.',
      'Customize the plan based on your interests, budget, trip duration, and travel style.',
      'Get suggestions for activities, restaurants (with budget indicators), and local gems.',
      'Receive a practical packing list tailored to your trip\'s season and activities.',
    ],
    tips: [
      'Specify your interests clearly (e.g., "I love art history, street food, and live jazz music").',
      'Be realistic about your budget and duration to get a feasible plan.',
      'Use the "Additional Notes" field for important context, like "traveling with kids" or "need wheelchair accessibility".',
      'Ask for alternatives, such as "What are some less touristy things to do in Paris?" or "Suggest a day trip from Tokyo."',
    ],
    examplePrompts: [
      {
        prompt: 'Destination: Rome, Italy. Duration: 5 days. Interests: Ancient Roman history, authentic pasta, and photography. Budget: Mid-range. Notes: We are a couple in our 30s and enjoy walking.',
        explanation: 'Provides all the key parameters needed for a well-rounded and personalized itinerary.',
      },
      {
        prompt: 'I\'m going to Kyoto, Japan for 3 days on a strict budget. I\'m interested in temples, gardens, and finding cheap, delicious ramen. What should I do?',
        explanation: 'A concise but effective prompt that gives the AI enough information to create a focused plan.',
      },
      {
        prompt: 'Create a packing list for a 10-day trip to Costa Rica in July. We will be doing a mix of hiking in the rainforest and relaxing on the beach.',
        explanation: 'A focused request for just one feature of the agent (the packing list) with good context.',
      },
    ],
  },
  'fitness-trainer': {
    title: 'Fitness Trainer',
    description: 'How to get a personalized workout plan and dietary advice.',
    features: [
      'Receive a structured weekly workout schedule based on your goals and fitness level.',
      'Specify the number of days you can train and the exact equipment you have available.',
      'Get a detailed plan including exercises, sets, reps, and rest periods.',
      'Receive general dietary tips and sample meal ideas to support your fitness journey.',
    ],
    tips: [
      'Be honest about your current fitness level (beginner, intermediate, advanced) for a safe and effective plan.',
      'Clearly list your available equipment. "None", "a pair of 10kg dumbbells and a bench", or "full gym access" are all good descriptions.',
      'Your goal should be specific and measurable, such as "lose 5kg in 3 months," "build upper body strength to do 10 pull-ups," or "run a 5k in under 30 minutes."',
      'Consistency is key. Use the plan as a guide and adapt it as you get stronger.',
    ],
    examplePrompts: [
      {
        prompt: 'Goal: Build muscle, especially in my chest and back. Level: Intermediate. Days per week: 4. Equipment: Full gym.',
        explanation: 'A perfect, concise prompt with all the necessary information for a detailed strength plan.',
      },
      {
        prompt: 'I want to lose weight and improve my cardio. I am a beginner and can work out 3 days a week at home. I have no equipment except a yoga mat and resistance bands.',
        explanation: 'A descriptive prompt that gives the AI clear constraints to work within for a home workout plan.',
      },
    ],
    disclaimer: 'Consult with a physician or other healthcare professional before starting this or any other fitness program to determine if it is right for your needs. This AI does not provide medical advice.',
  },
  'content-creator': {
    title: 'Content Creator',
    description: 'A guide to generating content ideas and drafting articles, threads, and scripts.',
    features: [
      'Brainstorm a list of engaging content ideas and headlines for a given topic.',
      'Generate a well-structured starter draft for a blog post, tweet thread, or video script.',
      'Tailor the content\'s tone and style to a specific target audience.',
      'Overcome writer\'s block with fresh perspectives and outlines.',
    ],
    tips: [
      'Define your target audience clearly. "Marketing managers at B2B SaaS companies" is better than "business people."',
      'Provide a clear, focused topic. "The benefits of content marketing for small businesses" is better than "marketing."',
      'Use the generated draft as a starting point. Always edit it to add your own unique voice, insights, and examples.',
      'For tweet threads, you can ask the AI to "number each tweet" or "use emojis to make it more engaging".',
    ],
    examplePrompts: [
      {
        prompt: 'Topic: The importance of sleep for productivity. Content Type: Blog post. Target Audience: Young professionals and entrepreneurs. Tone: Informative but relatable.',
        explanation: 'Provides a clear topic, format, audience, and desired tone for a targeted piece of content.',
      },
      {
        prompt: 'Generate a 10-part tweet thread about 5 common mistakes to avoid when learning a new language. The audience is beginner language learners. Make it encouraging.',
        explanation: 'A specific request for a list-based format suitable for Twitter, including a desired tone.',
      },
      {
        prompt: 'Topic: How to make the perfect cup of pour-over coffee at home. Content Type: Video script. Target Audience: Coffee beginners. Include visual cues in the script like "[Shot of coffee blooming]".',
        explanation: 'Requests a script format and provides instructions for including video-specific elements.',
      },
    ],
  },
};
