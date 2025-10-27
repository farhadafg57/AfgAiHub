
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
      'Ask questions about Quranic verses and their meanings.',
      'Seek guidance on life issues from an Islamic perspective.',
      'Explore the stories and lessons of the prophets.',
      'Understand complex theological concepts.',
    ],
    tips: [
      'Be specific in your questions to get more precise answers.',
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
        prompt: 'Can you explain the story of Prophet Yusuf (Joseph) and its main lessons?',
        explanation: 'Requests a summary and moral takeaway from a specific Quranic narrative.',
      },
      {
        prompt: 'I am struggling with staying focused during my prayers. Is there any advice from the Quran?',
        explanation: 'Connects a personal, practical issue to a request for spiritual advice.',
      },
    ],
  },
  'doctor-assistant': {
    title: 'Doctor Assistant',
    description: 'How to use the Symptom Checker for preliminary medical information.',
    features: [
        'Describe your symptoms in natural language.',
        'Receive a list of potential conditions based on your input.',
        'Get suggestions for next steps, such as when to see a doctor.',
        'Understand symptoms in a structured and informative way.',
    ],
    tips: [
        'Be as detailed as possible. Include the duration, severity, and nature of your symptoms.',
        'Mention any relevant medical history or conditions if you feel comfortable.',
        'Do not rely on this tool for a diagnosis. Always consult a healthcare professional.',
        'Use this tool for informational purposes to prepare for a doctor\'s appointment.',
    ],
    examplePrompts: [
      {
        prompt: 'I have had a persistent dry cough, a low-grade fever around 37.5°C, and fatigue for the last three days. I also have a slight headache.',
        explanation: 'Provides specific symptoms with duration and measurements for a more accurate analysis.',
      },
      {
        prompt: 'My child has a red rash on their arms and torso, but no fever. It doesn\'t seem to be itchy. What could this be?',
        explanation: 'Clearly describes the symptom and what is NOT present, which helps narrow down possibilities.',
      },
      {
        prompt: 'I\'m experiencing sharp pain in my lower back after lifting a heavy object. It hurts more when I bend over. What are some possible causes?',
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
        'Ask questions about a property\'s neighborhood, such as schools or crime rates.',
        'Inquire about market trends and property valuation estimates.',
        'Receive details on property history, such as past sales.',
    ],
    tips: [
        'Provide a full, accurate address for the best results.',
        'Ask specific questions. Instead of "Is this a good area?", try "What are the ratings of nearby elementary schools?"',
        'Use the agent to compare different properties by asking the same questions for multiple addresses.',
        'While the AI provides data, always consult with a human real estate professional for transactions.',
    ],
    examplePrompts: [
      {
        prompt: 'Property Address: 1600 Amphitheatre Parkway, Mountain View, CA. Question: What are the property taxes and recent sales history for this address?',
        explanation: 'A well-structured query with a clear address and specific financial questions.',
      },
      {
        prompt: 'Property Address: 1 Infinite Loop, Cupertino, CA. Question: Tell me about the local amenities. Are there parks, grocery stores, and public transport nearby?',
        explanation: 'Asks for practical, location-based information relevant to a home buyer.',
      },
      {
        prompt: 'Property Address: 742 Evergreen Terrace, Springfield. Question: What is the estimated market value of this property and how does it compare to others in the same zip code?',
        explanation: 'Requests a comparative market analysis, which is a high-value task for this agent.',
      },
    ],
  },
  'app-prototyper': {
    title: 'App Prototyper',
    description: 'Learn how to generate initial code snippets for your app ideas.',
    features: [
        'Describe an application in plain English.',
        'Receive generated code snippets as a starting point.',
        'Specify features you want included in the prototype.',
        'Get code for simple UI components or logic.',
    ],
    tips: [
        'Clearly define the main purpose of your app.',
        'Break down the app into its core components or features in your description.',
        'The more detailed your description, the more relevant the generated code will be.',
        'Use the generated code as a foundation to build upon, not as a final product.',
    ],
    examplePrompts: [
      {
        prompt: 'Generate code for a simple weather app. It should have a search bar to enter a city name and display the current temperature, humidity, and wind speed.',
        explanation: 'Clearly states the app type and the specific UI elements and data points to include.',
      },
      {
        prompt: 'I need a basic note-taking app. It should have a main screen that shows a list of notes, a button to add a new note, and the ability to delete notes.',
        explanation: 'Describes the app by its core user actions and screens.',
      },
      {
        prompt: 'Create a component for a recipe app that displays a recipe. It needs to show an image, title, ingredients list, and step-by-step instructions.',
        explanation: 'Focuses on a single, well-defined component, which is a great way to use the prototyper.',
      },
    ],
  },
  'antique-authenticator': {
    title: 'Antique Authenticator',
    description: 'How to get an AI-powered authentication analysis for your antiques.',
    features: [
        'Upload an image of an antique for analysis.',
        'Provide additional details like markings, history, or materials.',
        'Receive an authenticity assessment based on the provided information.',
        'Get insights into the potential value and key identifying features.',
    ],
    tips: [
        'Take clear, well-lit photos of the item from multiple angles.',
        'Include pictures of any signatures, markings, or details that seem important.',
        'In the "Additional Details" section, write down anything you know about the item\'s history or provenance.',
        'The AI provides an educated opinion, but for high-value items, always seek a certified human appraiser.',
    ],
    examplePrompts: [
      {
        prompt: 'Image: [Image of a porcelain vase]. Details: This vase was inherited from my great-aunt. It has a blue stamp on the bottom that looks like a crown. Is it a genuine Meissen vase?',
        explanation: 'Provides an image, known history (provenance), and points out a specific feature (the mark) to guide the AI.',
      },
      {
        prompt: 'Image: [Image of a wooden chair]. Details: I found this at a flea market. It feels very heavy. Can you tell me what style it is and its approximate age?',
        explanation: 'Asks for specific information (style, age) which helps the AI focus its analysis.',
      },
    ],
    disclaimer: 'This analysis is based on visual data and AI pattern recognition. It is for informational purposes only and is not a substitute for a professional appraisal by a certified expert.',
  },
  'legal-assistant': {
    title: 'Legal Assistant',
    description: 'A guide to getting preliminary legal information and drafting simple documents.',
    features: [
      'Ask general questions about legal topics (e.g., contracts, intellectual property).',
      'Get help understanding common legal terms and concepts.',
      'Receive a basic structure or template for simple documents.',
      'Explore legal considerations for common life events (e.g., starting a business).',
    ],
    tips: [
      'Do not provide sensitive or confidential personal information.',
      'Frame questions generally. Ask "What are the typical elements of a freelance contract?" instead of describing your specific legal dispute.',
      'Use the information as a starting point for your own research or for a consultation with a lawyer.',
      'For document drafting, be very clear about the purpose and key terms you want to include.',
    ],
    examplePrompts: [
      {
        prompt: 'What is the difference between a trademark and a copyright?',
        explanation: 'Asks for a clear definition and comparison of two legal concepts.',
      },
      {
        prompt: 'I\'m starting a small online business. What are the basic legal steps I should consider?',
        explanation: 'Requests a general checklist for a common scenario.',
      },
      {
        prompt: 'Draft a simple Non-Disclosure Agreement (NDA) for a new software project between two individuals.',
        explanation: 'Requests a template for a common, relatively standard legal document.',
      },
    ],
    disclaimer: 'This AI is not a lawyer and does not provide legal advice. The information provided is for educational purposes only. You should consult with a qualified attorney for advice on your specific legal issues.',
  },
  'career-coach': {
    title: 'Career Coach',
    description: 'Get personalized career advice, resume feedback, and job search strategies.',
    features: [
      'Get actionable advice tailored to your career goals and experience level.',
      'Receive feedback on your resume or professional summary.',
      'Discover strategies for networking and job searching in your field.',
      'Get a list of curated resources to help you with your career development.',
    ],
    tips: [
      'Be specific about your career goal. "I want to become a Senior Data Scientist at a tech company" is better than "I want a new job."',
      'Provide a concise but comprehensive summary of your experience. You can paste a simplified version of your resume.',
      'Ask targeted questions about skills you need to develop or industries you want to enter.',
      'Use the generated advice to create a concrete action plan for yourself.',
    ],
    examplePrompts: [
      {
        prompt: 'Career Goal: I am a software engineer with 5 years of experience in Python and want to transition to a management role. Experience: [Paste resume summary here]. What skills should I develop and how should I position myself?',
        explanation: 'Provides a clear starting point, a goal, and the relevant background information.',
      },
      {
        prompt: 'Career Goal: Land my first job as a UX designer. Experience: I just graduated from a UX bootcamp and have a portfolio with three projects. [Paste short project descriptions]. Can you review my experience and suggest improvements?',
        explanation: 'Focuses the request on resume/portfolio feedback for an entry-level position.',
      },
    ],
  },
  'travel-planner': {
    title: 'Travel Planner',
    description: 'Your guide to creating personalized travel itineraries and getting recommendations.',
    features: [
      'Generate a day-by-day itinerary for any destination.',
      'Customize the plan based on your interests, budget, and trip duration.',
      'Get suggestions for activities, restaurants, and accommodations.',
      'Receive a practical packing list tailored to your trip.',
    ],
    tips: [
      'Specify your interests clearly (e.g., "I love art history, street food, and hiking").',
      'Be realistic about your budget and duration to get a feasible plan.',
      'Use the generated itinerary as a flexible framework, not a strict schedule.',
      'Ask for alternatives, such as "What are some less touristy things to do in Paris?"',
    ],
    examplePrompts: [
      {
        prompt: 'Destination: Rome, Italy. Duration: 5 days. Interests: Ancient Roman history, authentic pasta, and photography. Budget: Mid-range.',
        explanation: 'Provides all the key parameters needed for a well-rounded itinerary.',
      },
      {
        prompt: 'I\'m going to Kyoto, Japan for 3 days on a budget. I\'m interested in temples and gardens. What should I do?',
        explanation: 'A concise but effective prompt that gives the AI enough information to create a plan.',
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
      'Receive a weekly workout schedule based on your goals and fitness level.',
      'Specify the number of days you can train and the equipment you have available.',
      'Get a structured plan including exercises, sets, and reps.',
      'Receive general dietary tips to support your fitness journey.',
    ],
    tips: [
      'Be honest about your current fitness level (beginner, intermediate, advanced) for a safe and effective plan.',
      'Clearly list your available equipment. "None", "dumbbells and a bench", or "full gym access" are all good descriptions.',
      'Your goal should be specific, such as "lose 10 pounds," "build upper body strength," or "run a 5k."',
      'Consistency is key. Use the plan as a guide and stick to it.',
    ],
    examplePrompts: [
      {
        prompt: 'Goal: Build muscle. Level: Intermediate. Days per week: 4. Equipment: Full gym.',
        explanation: 'A perfect, concise prompt with all the necessary information.',
      },
      {
        prompt: 'I want to lose weight and improve my cardio. I am a beginner and can work out 3 days a week at home. I have no equipment except a yoga mat.',
        explanation: 'A descriptive prompt that gives the AI clear constraints to work within.',
      },
    ],
    disclaimer: 'Consult with a physician or other healthcare professional before starting this or any other fitness program to determine if it is right for your needs.',
  },
  'content-creator': {
    title: 'Content Creator',
    description: 'A guide to generating content ideas and drafting articles, threads, and scripts.',
    features: [
      'Brainstorm content ideas and headlines for a given topic.',
      'Generate a starter draft for a blog post, tweet thread, or video script.',
      'Tailor the content to a specific target audience.',
      'Overcome writer\'s block with fresh perspectives.',
    ],
    tips: [
      'Define your target audience clearly. "Marketing managers at SaaS companies" is better than "business people."',
      'Provide a clear, focused topic. "The benefits of content marketing" is better than "marketing."',
      'Use the generated draft as a starting point. Edit and add your own voice and insights.',
      'For tweet threads, you can ask the AI to number the tweets for you.',
    ],
    examplePrompts: [
      {
        prompt: 'Topic: The importance of sleep for productivity. Content Type: Blog post. Target Audience: Young professionals and entrepreneurs.',
        explanation: 'Provides a clear topic, format, and audience for a targeted piece of content.',
      },
      {
        prompt: 'Generate a tweet thread about 5 common mistakes to avoid when learning a new language. The audience is language learners.',
        explanation: 'A specific request for a list-based format suitable for Twitter.',
      },
      {
        prompt: 'Topic: How to make the perfect cup of coffee at home. Content Type: Video script. Target Audience: Coffee beginners.',
        explanation: 'Requests a script format, implying a need for visual cues and spoken narration.',
      },
    ],
  },
};
