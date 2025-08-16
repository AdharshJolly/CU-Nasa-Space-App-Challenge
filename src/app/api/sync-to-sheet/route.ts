
import { google } from 'googleapis';
import {NextResponse} from 'next/server';

export const dynamic = 'force-dynamic'; // Force Node.js runtime

interface TeamMember {
    name: string;
    email: string;
    phone: string;
    registerNumber: string;
    className: string;
    department: string;
    school: string;
}

interface Team {
    teamName: string;
    members: TeamMember[];
}

// Define maximum number of members a team can have, for header generation
const MAX_MEMBERS = 5;

// Function to ensure header exists
async function ensureHeader(sheets: any, spreadsheetId: string) {
    const range = 'A1:Z1';
    const response = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range,
    });
    if (!response.data.values || response.data.values.length === 0) {
        // Header is missing, let's write it
        const headerRow = ["Team Name"];
        for(let i = 1; i <= MAX_MEMBERS; i++) {
            headerRow.push(`Member ${i} Name`, `Member ${i} Email`, `Member ${i} Phone`, `Member ${i} Register Number`, `Member ${i} Class`, `Member ${i} Department`, `Member ${i} School`);
        }
        
        await sheets.spreadsheets.values.update({
            spreadsheetId,
            range: 'A1',
            valueInputOption: 'USER_ENTERED',
            requestBody: {
                values: [headerRow],
            },
        });
    }
}

export async function POST(req: Request) {
    try {
        const { teamData } = (await req.json()) as { teamData: Team };
        const { GOOGLE_SHEETS_CLIENT_EMAIL, GOOGLE_SHEETS_PRIVATE_KEY, GOOGLE_SHEET_ID } = process.env;
        
        if (!GOOGLE_SHEETS_CLIENT_EMAIL || !GOOGLE_SHEETS_PRIVATE_KEY || !GOOGLE_SHEET_ID) {
            throw new Error("Google Sheets API credentials or Sheet ID are not set in environment variables.");
        }
        
        if (!teamData) {
            throw new Error("No team data provided in the request body.");
        }

        const auth = new google.auth.GoogleAuth({
            credentials: {
                client_email: GOOGLE_SHEETS_CLIENT_EMAIL,
                private_key: GOOGLE_SHEETS_PRIVATE_KEY.replace(/\\n/g, '\n'),
            },
            scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });

        const sheets = google.sheets({ version: 'v4', auth });

        await ensureHeader(sheets, GOOGLE_SHEET_ID);

        const row: (string | null)[] = [teamData.teamName];
        for (let i = 0; i < MAX_MEMBERS; i++) {
            const member = teamData.members[i];
            if (member) {
                row.push(member.name, member.email, member.phone, member.registerNumber, member.className, member.department, member.school);
            } else {
                row.push(null, null, null, null, null, null, null);
            }
        }
        
        await sheets.spreadsheets.values.append({
            spreadsheetId: GOOGLE_SHEET_ID,
            range: 'A1', // Appending to the sheet, it will find the next empty row
            valueInputOption: 'USER_ENTERED',
            requestBody: {
                values: [row],
            },
        });

        return NextResponse.json({ message: 'Sync successful!' });

    } catch (error) {
        console.error('Error syncing to Google Sheet:', error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        return NextResponse.json({ error: `Server Error: ${errorMessage}` }, { status: 500 });
    }
}
