const axios = require("axios");

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

exports.analyzeMood = async (
  text,
  tasks = [],
  currentTime = "",
  currentDay = "",
  currentDate = ""
) => {

  try {

    if (!OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY missing");
    }

    // ✅ ONLY UNCOMPLETED TASKS
    const pendingTasks = tasks.filter(
      (t) => !t.completed
    );

    // ✅ CALCULATE URGENCY
    const today = new Date();

    const enhancedTasks = pendingTasks.map((task) => {

      let urgency = "Normal";

      if (task.deadline) {

        const deadlineDate = new Date(task.deadline);

        const diffDays = Math.ceil(
          (deadlineDate.getTime() - today.getTime()) /
          (1000 * 60 * 60 * 24)
        );

        if (diffDays <= 1) {
          urgency = "Critical";
        } else if (diffDays <= 3) {
          urgency = "High";
        }
      }

      return {
        ...task,
        urgency
      };
    });

    const response = await axios.post(

      "https://api.openai.com/v1/chat/completions",

      {
        model: "gpt-4o-mini",

        temperature: 0.4,

        max_tokens: 1200,

        messages: [

          // ✅ SYSTEM
          {
            role: "system",

            content: `
You are an advanced emotional intelligence AI.

Your job is NOT to detect explicit emotion words.

Your job is to UNDERSTAND HUMAN SITUATIONS.

The user will describe their day naturally.

You must infer:
- emotional state
- mental fatigue
- stress level
- energy level
- motivation
- burnout risk
- productivity capacity

VERY IMPORTANT:

DO NOT default to "Neutral".

Neutral should be VERY RARE.

You must deeply analyze:
- activities
- workload
- social situations
- routines
- pressure
- tiredness
- motivation
- time of day
- wording tone

REALISTIC EMOTIONAL REASONING:

Examples:

"I just returned home after college"
→ likely Tired

"I attended many meetings and deadlines are pending"
→ Stressed

"I completed my important work and now relaxing"
→ Happy

"I woke up fresh and ready to work"
→ Energetic

"I've been studying continuously since morning"
→ Exhausted

"I have too many things to finish"
→ Overwhelmed

"I had a normal relaxed day"
→ Calm

IMPORTANT:

Returning home after long work/classes/travel should NOT be Neutral.

Words like:
- long day
- finally home
- exhausted
- drained
- too much work
- pressure
- nonstop
- sleepy
- hectic

should reduce:
- energy
- workCapacity

WORK CAPACITY RULES:

Exhausted → 10-25
Tired → 25-45
Stressed → 35-55
Calm → 50-70
Happy → 60-80
Focused → 70-90
Energetic → 85-100

TASK SCHEDULING RULES:

- Urgent + high priority → Do Now
- Medium priority → Do Later
- Low priority during stress/tiredness → Skip
- Never overload tired users
- Energetic users can handle more work

You MUST think like a human productivity coach.

Return ONLY VALID JSON.
`
          },

          // ✅ USER
          {
            role: "user",

            content: `
Return ONLY JSON in this EXACT format:

{
  "mood": "Tired | Happy | Stressed | Neutral | Energetic",
  "energy": "Low | Medium | High",
  "workCapacity": number,
  "schedule": [
    {
      "task": "task title",
      "priority": "High | Medium | Low",
      "action": "Do Now | Do Later | Skip",
      "deadline": "YYYY-MM-DD",
      "reason": "short human explanation"
    }
  ],
  "suggestion": "short motivational suggestion"
}

USER DAY DESCRIPTION:
${text}

CURRENT DATE:
${currentDate}

CURRENT TIME:
${currentTime}

CURRENT DAY:
${currentDay}

PENDING TASKS:
${JSON.stringify(enhancedTasks)}

IMPORTANT:
- Schedule MUST NOT be empty if tasks exist.
- Ignore completed tasks.
- Keep explanations short and realistic.
- Human-like emotional reasoning is required.
`
          }
        ]
      },

      {
        headers: {
          "Content-Type": "application/json",

          Authorization: `Bearer ${OPENAI_API_KEY}`
        }
      }
    );

    const content =
      response.data?.choices?.[0]?.message?.content;

    console.log("🧠 OPENAI RAW:", content);

    if (!content) {
      throw new Error("Empty AI response");
    }

    // ✅ SAFE JSON EXTRACTION
    const jsonMatch =
      content.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      throw new Error("Invalid JSON");
    }

    const parsed = JSON.parse(jsonMatch[0]);

// ✅ RULE-BASED EMOTION CORRECTION

const lowerText = text.toLowerCase();

// TIRED DETECTION
if (
  lowerText.includes("returned home") ||
  lowerText.includes("came home") ||
  lowerText.includes("long day") ||
  lowerText.includes("tired") ||
  lowerText.includes("exhausted") ||
  lowerText.includes("drained")
) {

  parsed.mood = "Tired";

  parsed.energy = "Low";

  parsed.workCapacity = Math.min(
    parsed.workCapacity,
    40
  );
}

// STRESS DETECTION
if (
  lowerText.includes("lot of work") ||
  lowerText.includes("many tasks") ||
  lowerText.includes("deadlines") ||
  lowerText.includes("pressure") ||
  lowerText.includes("too much work")
) {

  parsed.mood = "Stressed";

  parsed.energy = "Medium";

  parsed.workCapacity = Math.min(
    parsed.workCapacity,
    55
  );
}

// ENERGETIC DETECTION
if (
  lowerText.includes("fresh") ||
  lowerText.includes("motivated") ||
  lowerText.includes("productive") ||
  lowerText.includes("excited")
) {

  parsed.mood = "Energetic";

  parsed.energy = "High";

  parsed.workCapacity = Math.max(
    parsed.workCapacity,
    80
  );
}

    // ✅ FORCE SCHEDULE IF EMPTY
    if (
      enhancedTasks.length > 0 &&
      (
        !parsed.schedule ||
        parsed.schedule.length === 0
      )
    ) {

     parsed.schedule = enhancedTasks.map((task) => {

  let action = "Do Later";

  // ✅ SMART DECISION BASED ON MOOD
  if (
    parsed.mood === "Tired" ||
    parsed.energy === "Low"
  ) {

    if (
      task.priority === "High" ||
      task.urgency === "Critical"
    ) {

      action = "Do Now";

    } else {

      action = "Skip";
    }

  }

  else if (
    parsed.mood === "Energetic" ||
    parsed.energy === "High"
  ) {

    if (
      task.priority === "High" ||
      task.priority === "Medium"
    ) {

      action = "Do Now";

    } else {

      action = "Do Later";
    }

  }

  else if (
    parsed.mood === "Stressed"
  ) {

    if (
      task.priority === "High"
    ) {

      action = "Do Now";

    } else {

      action = "Do Later";
    }

  }

  return {

    task: task.text,

    priority: task.priority || "Medium",

    action,

    deadline: task.deadline || "",

    reason:
      action === "Do Now"
        ? "Important based on your current state"
        : action === "Skip"
        ? "Can wait until energy improves"
        : "Recommended later"
  };
});

    // ✅ SAFETY LIMITS
    if (parsed.workCapacity > 100) {
      parsed.workCapacity = 100;
    }

    if (parsed.workCapacity < 0) {
      parsed.workCapacity = 0;
    }

    return parsed;

  } catch (err) {

    console.error(
      "❌ OPENAI ERROR:",
      err.response?.data || err.message
    );

    // ✅ SMART FALLBACK
    const fallbackSchedule = tasks
      .filter((t) => !t.completed)
      .map((task) => ({

        task: task.text,

        priority: task.priority || "Medium",

        action: "Do Later",

        deadline: task.deadline || "",

        reason: "Pending task"
      }));

    return {

      mood: "Neutral",

      energy: "Medium",

      workCapacity: 50,

      schedule: fallbackSchedule,

      suggestion:
        "Focus on one important task at a time and avoid overload."
    };
  }
};