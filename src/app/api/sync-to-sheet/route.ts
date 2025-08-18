
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

// Function to get header row
function getHeaderRow() {
    const headerRow = ["Team Name"];
    for(let i = 1; i <= MAX_MEMBERS; i++) {
        headerRow.push(`Member ${i} Name`, `Member ${i} Email`, `Member ${i} Phone`, `Member ${i} Register Number`, `Member ${i} Class`, `Member ${i} Department`, `Member ${i} School`);
    }
    return headerRow;
}


// Function to ensure header exists
async function ensureHeader(sheets: any, spreadsheetId: string) {
    const range = 'A1:Z1';
    try {
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId,
            range,
        });
        if (!response.data.values || response.data.values.length === 0) {
            await sheets.spreadsheets.values.update({
                spreadsheetId,
                range: 'A1',
                valueInputOption: 'USER_ENTERED',
                requestBody: {
                    values: [getHeaderRow()],
                },
            });
        }
    } catch(error) {
        // If sheet is empty, it might throw an error. In that case, we write the header.
        if ((error as any).code === 400) {
             await sheets.spreadsheets.values.update({
                spreadsheetId,
                range: 'A1',
                valueInputOption: 'USER_ENTERED',
                requestBody: {
                    values: [getHeaderRow()],
                },
            });
        } else {
            throw error;
        }
    }
}


function transformTeamToRow(team: Team) {
    const row: (string | null)[] = [team.teamName];
    for (let i = 0; i < MAX_MEMBERS; i++) {
        const member = team.members[i];
        if (member) {
            // Prepend phone number with an apostrophe to ensure it's treated as a string by Google Sheets
            const phone = member.phone ? `'${member.phone}` : null;
            row.push(member.name, member.email, phone, member.registerNumber, member.className, member.department, member.school);
        } else {
            row.push(null, null, null, null, null, null, null);
        }
    }
    return row;
}

export async function POST(req: Request) {
    try {
        const { teamData, teamsData } = (await req.json()) as { teamData?: Team, teamsData?: Team[] };
        const { GOOGLE_SHEETS_CLIENT_EMAIL, GOOGLE_SHEETS_PRIVATE_KEY, GOOGLE_SHEET_ID } = process.env;
        
        if (!GOOGLE_SHEETS_CLIENT_EMAIL || !GOOGLE_SHEETS_PRIVATE_KEY || !GOOGLE_SHEET_ID) {
            throw new Error("Google Sheets API credentials or Sheet ID are not set in environment variables.");
        }
        
        if (!teamData && !teamsData) {
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

        // Handle automatic sync for a single new team
        if (teamData) {
             const row = transformTeamToRow(teamData);
             await sheets.spreadsheets.values.append({
                spreadsheetId: GOOGLE_SHEET_ID,
                range: 'A1', 
                valueInputOption: 'USER_ENTERED',
                requestBody: {
                    values: [row],
                },
            });
            return NextResponse.json({ message: 'Sync successful!' });
        }
        
        // Handle manual bulk sync for all teams
        if (teamsData) {
            // Clear existing data (but not the header)
            await sheets.spreadsheets.values.clear({
                spreadsheetId: GOOGLE_SHEET_ID,
                range: 'A2:Z', // Clear from the second row downwards
            });

            if (teamsData.length > 0) {
                const rows = teamsData.map(transformTeamToRow);
                await sheets.spreadsheets.values.update({
                    spreadsheetId: GOOGLE_SHEET_ID,
                    range: 'A2',
                    valueInputOption: 'USER_ENTERED',
                    requestBody: {
                        values: rows,
                    },
                });
            }
            return NextResponse.json({ message: 'Bulk sync successful!' });
        }


    } catch (error) {
        console.error('Error syncing to Google Sheet:', error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        return NextResponse.json({ error: `Server Error: ${errorMessage}` }, { status: 500 });
    }
}
