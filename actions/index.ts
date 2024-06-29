"use server";

import { GoogleSpreadsheet } from "google-spreadsheet";
import { JWT } from 'google-auth-library';
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
    key: process.env.GSHEETS_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

function parseMarks(marks: string): [number, number] {
    const [achieved, total] = marks?.split(' / ').map(Number);
    return [achieved, total];
}

async function fetchQuizResponses(sheetConfig: { key: string, name: string, score: string, email: string, totalMarks: number }, quizName: string): Promise<QuizResponse[]> {
    try {
        const doc = new GoogleSpreadsheet(sheetConfig.key, jwt);
        // await doc.useServiceAccountAuth(jwt); // Corrected method for JWT authentication
        await doc.loadInfo();
        const sheet = doc.sheetsByIndex[0]; // Assuming data is in the first sheet
        const rows = await sheet.getRows();

        return rows.map((row) => {
            const [achieved, total] = parseMarks(row.get(sheetConfig.score)); // Corrected method to access row data
            return {
                email: row.get(sheetConfig.email), // Corrected method to access row data
                name: row.get(sheetConfig.name) ? row.get(sheetConfig.name) : "name undefined", // Corrected method to access row data
                marks: achieved,
                totalMarks: total,  
                quizName: quizName,
            };
        });
    } catch (error: any) {
        throw new Error(error.message);
    }
}

export const aggregateResponses = async () => {
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

            const existingQuiz = aggregatedResponses[response.email].quizzes.find(q => q.quizName === response.quizName);

            if (!existingQuiz) {
                aggregatedResponses[response.email].quizzes.push({
                    quizName: response.quizName,
                    marks: response.marks,
                    totalMarks: response.totalMarks,
                });
            }
        });
    }

    return aggregatedResponses;
}

// Utility functions
// Function to calculate the percentage for a single user's quizzes
const getSinglePercentage = (quizzes: { quizName: string; marks: number; totalMarks: number }[]) => {
    let totalAchieved = 0;
    let totalPossible = 0;

    quizzes.forEach(quiz => {
        totalAchieved += quiz.marks;
        totalPossible += quiz.totalMarks;
    });

    if (totalPossible === 0) return 0; // Handle case where totalPossible is zero to avoid division by zero

    const basePercentage = (totalAchieved / totalPossible) * 100;

    // Apply a factor based on the number of quizzes attempted
    const attemptFactor = quizzes.length / sheetConfigs.length;

    // Calculate final percentage incorporating the attempt factor
    const finalPercentage = basePercentage * attemptFactor;

    return parseInt(finalPercentage.toFixed());
};

// Function to calculate the percentages for all users with more weight for more quizzes attempted
export const calculatePercentages = (aggregatedResponses: AggregatedResponses) => {
    const percentages: { email: string; name: string; percentage: number }[] = [];

    for (const email in aggregatedResponses) {
        const user = aggregatedResponses[email];
        
        // Calculate the base percentage using the getSinglePercentage function
        const basePercentage = getSinglePercentage(user.quizzes);

        // Apply a logarithmic scaling to the number of quizzes attempted
        
        percentages.push({ email, name: user.name, percentage: basePercentage });
    }

    return percentages;
};


export const getTopTen = (percentages: { email: string; name: string; percentage: number }[]) => {
    let perc =  percentages.sort((a, b) => b.percentage - a.percentage).slice(0, 10)
    console.log(perc);
    
    return perc;
};

export const getUserDataByEmail = (aggregatedResponses: any, email: string) => {
    return aggregatedResponses[email] || null;
};

// Call aggregateResponses for testing purposes
// aggregateResponses().catch(console.error);
