// actions/fetchQuizResponses.js
"use server";

import { GoogleSpreadsheet } from "google-spreadsheet";
import { JWT } from "google-auth-library";
import cache from "@/cache"; // Adjust the path if needed
import { sheetConfigs } from "@/sheetConfig";

interface QuizResponse {
  email: string;
  name: string;
  marks: number;
  totalMarks: number;
  quizName: string;
}

interface AggregatedResponses {
  [email: string]: {
    name: string;
    quizzes: { quizName: string; marks: number; totalMarks: number }[];
  };
}

const jwt = new JWT({
  email: process.env.CLIENT_EMAIL,
  key: process.env.GSHEETS_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

function parseMarks(marks: string | undefined | null): [number, number] {
  if (!marks || typeof marks !== "string") {
    return [0, 0];
  }

  const [achievedStr, totalStr] = marks.split(" / ");
  const achieved = Number(achievedStr);
  const total = Number(totalStr);

  if (isNaN(achieved) || isNaN(total)) {
    return [0, 0];
  }

  return [achieved, total];
}

async function fetchQuizResponses(
  sheetConfig: {
    key: string;
    name: string;
    score: string;
    email: string;
    totalMarks: number;
  },
  quizName: string
): Promise<QuizResponse[]> {
  const cacheKey = `google-sheet-data-${quizName}`;
  const cachedData = cache.get(cacheKey);

  if (cachedData) {
    console.log(cacheKey, cachedData);
    return cachedData;
  }

  try {
    const doc = new GoogleSpreadsheet(sheetConfig.key, jwt);
    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[0];
    const rows = await sheet.getRows();

    const quizResponses = rows.map((row) => {
      const [achieved, total] = parseMarks(row.get(sheetConfig.score));
      return {
        email: row.get(sheetConfig.email),
        name: row.get(sheetConfig.name) || "name undefined",
        marks: achieved,
        totalMarks: total,
        quizName: quizName,
      };
    });

    cache.set(cacheKey, quizResponses);
    return quizResponses;
  } catch (error: any) {
    throw new Error(error.message);
  }
}

interface QuizResponse {
  email: string;
  name: string;
  marks: number;
  totalMarks: number;
  quizName: string;
}

export const aggregateResponses = async () => {
  const cacheKey = "aggregated-responses";
  const cachedData = cache.get(cacheKey);

  if (cachedData) {
    console.log("shipping cached data");
    return cachedData;
  }
  const aggregatedResponses: AggregatedResponses = {};

  for (const config of sheetConfigs) {
    const responses = await fetchQuizResponses(config, config.quizName);

    responses.forEach((response) => {
      if (!aggregatedResponses[response.email]) {
        aggregatedResponses[response.email] = {
          name: response.name,
          quizzes: [],
        };
      }

      const existingQuiz = aggregatedResponses[response.email].quizzes.find(
        (q) => q.quizName === response.quizName
      );

      if (!existingQuiz) {
        aggregatedResponses[response.email].quizzes.push({
          quizName: response.quizName,
          marks: response.marks,
          totalMarks: response.totalMarks,
        });
      }
    });
  }
  cache.set(cacheKey, aggregatedResponses);
  return aggregatedResponses;
};

// Utility functions
const getSinglePercentage = (
  quizzes: { quizName: string; marks: number; totalMarks: number }[]
) => {
  let totalAchieved = 0;
  let totalPossible = 0;

  quizzes.forEach((quiz) => {
    totalAchieved += quiz.marks;
    totalPossible += quiz.totalMarks;
  });

  if (totalPossible === 0) return 0;

  const basePercentage = (totalAchieved / totalPossible) * 100;

  const attemptFactor = quizzes.length / sheetConfigs.length;

  const finalPercentage = basePercentage * attemptFactor;

  return parseInt(finalPercentage.toFixed());
};

export const calculatePercentages = (
  aggregatedResponses: AggregatedResponses
) => {
  const percentages: { email: string; name: string; percentage: number }[] = [];

  for (const email in aggregatedResponses) {
    const user = aggregatedResponses[email];

    const basePercentage = getSinglePercentage(user.quizzes);

    percentages.push({ email, name: user.name, percentage: basePercentage });
  }

  return percentages;
};

export const getTopTen = (
  percentages: { email: string; name: string; percentage: number }[]
) => {
  return percentages.sort((a, b) => b.percentage - a.percentage).slice(0, 10);
};

export const getUserDataByEmail = (aggregatedResponses: any, email: string) => {
  return aggregatedResponses[email] || null;
};
