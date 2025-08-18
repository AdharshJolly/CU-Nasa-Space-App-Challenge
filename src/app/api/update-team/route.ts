
import { NextResponse } from 'next/server';
import { initializeAdminApp } from '@/lib/firebase-admin';
import { logActivity } from '@/lib/logger';
import { z } from 'zod';
import { google } from 'googleapis';

const indianPhoneNumberRegex = /^(?:\+91)?[6-9]\d{9}$/;

// Schema for a single member
const memberSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Invalid email format."),
  phone: z.string().trim().regex(indianPhoneNumberRegex, "Invalid Indian phone number."),
  registerNumber: z.string().trim().min(1, "Register number is required."),
  className: z.string().trim().min(1, "Class is required."),
  department: z.string().trim().min(1, "Department is required."),
  school: z.string().min(1, "School is required."),
});

// Schema for the entire team update request
const updateTeamSchema = z.object({
  teamName: z.string().trim().min(3, "Team name must be at least 3 characters."),
  members: z.array(memberSchema).min(2, "A team must have at least 2 members.").max(5, "A team can have at most 5 members."),
});

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
    id: string;
    teamName: string;
    members: TeamMember[];
}


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
            const phone = member.phone ? `'${member.phone}` : null;
            row.push(member.name, member.email, phone, member.registerNumber, member.className, member.department, member.school);
        } else {
            row.push(null, null, null, null, null, null, null);
        }
    }
    return row;
}

async function syncAllTeamsToSheet(teamsData: Team[]) {
     const { GOOGLE_SHEETS_CLIENT_EMAIL, GOOGLE_SHEETS_PRIVATE_KEY, GOOGLE_SHEET_ID } = process.env;
        
    if (!GOOGLE_SHEETS_CLIENT_EMAIL || !GOOGLE_SHEETS_PRIVATE_KEY || !GOOGLE_SHEET_ID) {
        throw new Error("Google Sheets API credentials or Sheet ID are not set in environment variables.");
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

    // Clear existing data (but not the header)
    await sheets.spreadsheets.values.clear({
        spreadsheetId: GOOGLE_SHEET_ID,
        range: 'A2:Z',
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
}


export async function POST(req: Request) {
    let updatedByEmail = 'unknown';
    try {
        const { adminDb } = initializeAdminApp();
        const { teamId, teamData, updatedBy } = await req.json();
        updatedByEmail = updatedBy;

        if (!teamId || !teamData || !updatedBy) {
            return NextResponse.json({ error: 'Missing required fields (teamId, teamData, updatedBy).' }, { status: 400 });
        }
        
        const validationResult = updateTeamSchema.safeParse(teamData);
        if (!validationResult.success) {
            return NextResponse.json({ error: 'Invalid team data provided.', details: validationResult.error.flatten() }, { status: 400 });
        }

        const validatedData = validationResult.data;

        const registrationsRef = adminDb.collection('registrations');
        const teamDocRef = registrationsRef.doc(teamId);

        const teamDoc = await teamDocRef.get();
        if (!teamDoc.exists) {
             return NextResponse.json({ error: 'Team not found.' }, { status: 404 });
        }
        const originalData = teamDoc.data();

        const teamNameQuery = await registrationsRef.where('teamName', '==', validatedData.teamName).get();
        if (!teamNameQuery.empty && teamNameQuery.docs[0].id !== teamId) {
            return NextResponse.json({ error: 'This team name is already taken.' }, { status: 409 });
        }

        await teamDocRef.update({
            teamName: validatedData.teamName,
            members: validatedData.members
        });

        await logActivity(updatedBy, 'Team Updated', {
            teamId,
            teamName: validatedData.teamName,
            changes: { from: originalData, to: validatedData }
        });

        // After successful update, fetch all teams and re-sync the sheet
        try {
            const allTeamsSnapshot = await registrationsRef.orderBy('createdAt').get();
            const allTeams = allTeamsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Team[];
            await syncAllTeamsToSheet(allTeams);
            await logActivity(updatedBy, 'Automatic Google Sheet Sync Triggered', { afterTeamId: teamId, reason: 'Team edit' });
        } catch (syncError: any) {
            console.error('Post-edit sync to sheet failed:', syncError);
            await logActivity(updatedBy, 'Automatic Sync Failed', { afterTeamId: teamId, error: syncError.message });
        }


        return NextResponse.json({ message: 'Team updated and sheet sync triggered successfully.' });

    } catch (error: any) {
        console.error('Error updating team:', error);
        await logActivity(updatedByEmail, 'Team Update Failed', { error: error.message });
        return NextResponse.json({ error: error.message || 'An unknown server error occurred.' }, { status: 500 });
    }
}
