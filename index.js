require('dotenv').config();
const express = require('express');
const { OpenAI } = require('openai');
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Pathfinder is up and running 🏳️‍🌈');
});

app.post('/api/match', async (req, res) => {
  const answers = req.body;

  const prompt = `
You're a queer-friendly career guide. A user just filled out a playful, identity-aware tech career quiz. 
Based on their answers, recommend one tech-related job role and explain in 1–2 sentences why it fits them. 
Use warm, inclusive, and affirming language. Avoid generic responses and personalize the match.

Here’s a list of roles you can choose from:
- Frontend Developer – Builds the parts of websites and apps users see and interact with.
- Backend Developer – Builds the behind-the-scenes systems that power apps and websites.
- QA Tester – Finds bugs and checks if software works properly before it’s released.
- Web Developer – Creates websites using code or tools like WordPress or Webflow.
- Fullstack Developer
- Cloud Engineer
- Data Analyst – Looks at data to find trends and help companies make decisions.
- Business Analyst – Connects business needs with tech solutions and improves processes.
- Product Analyst – Analyzes how users interact with products to help improve them.
- UX/UI Designer – Designs how digital products look and feel to make them easy to use.
- Content Designer – Writes and structures content so users understand what to do.
- Graphic Designer – Designs visuals like icons, graphics, and branding for tech products.
- Product Manager – Leads the planning and building of tech products across teams.
- Project Manager – Keeps tech projects on track, on time, and running smoothly.
- Technical Writer – Writes clear documentation for software, tools, or tech processes.
- Customer Support Specialist – Helps users solve problems with tech products.
- Community Manager – Builds and supports online communities around a product or brand.
- Developer Advocate – Helps developers use a product and brings feedback to the team.
- No-Code Developer – Builds apps or workflows using tools instead of traditional coding.
- Automation Specialist – Sets up systems that automate tasks using tools like Zapier or Airtable.

Answers: ${JSON.stringify(answers, null, 2)}

Respond in JSON only: { "role": "...", "why": "..." }
`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You're a career matching assistant who speaks with queer warmth, clarity, and encouragement."
        },
        {
          role: "user",
          content: prompt
        }
      ]
    });

    const raw = completion.choices[0].message.content;
    const parsed = JSON.parse(raw);
    res.json(parsed);

  } catch (error) {
    console.error('OpenAI error:', error);
    res.status(500).json({
      role: "Oops!",
      why: "Something went wrong with the AI. Please try again or check the API key."
    });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server is running at http://localhost:${PORT}`);
});