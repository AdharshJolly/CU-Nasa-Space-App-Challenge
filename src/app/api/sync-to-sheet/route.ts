
import { google } from 'googleapis';
import { collection, getDocs, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import {NextResponse} from 'next/server';

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

// Define maximum number of members a team can have, for header generation
const MAX_MEMBERS = 5;

export async function POST() {
    try {
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

        const q = query(collection(db, "registrations"));
        const querySnapshot = await getDocs(q);
        const teams = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Team[];

        if (teams.length === 0) {
            return NextResponse.json({ message: "No teams to sync." });
        }
        
        const headerRow = ["Team Name"];
        for(let i = 1; i <= MAX_MEMBERS; i++) {
            headerRow.push(`Member ${i} Name`, `Member ${i} Email`, `Member ${i} Phone`, `Member ${i} Register Number`, `Member ${i} Class`, `Member ${i} Department`, `Member ${i} School`);
        }
        
        const dataRows = teams.map(team => {
            const row: (string | null)[] = [team.teamName];
            for (let i = 0; i < MAX_MEMBERS; i++) {
                const member = team.members[i];
                if (member) {
                    row.push(member.name, member.email, member.phone, member.registerNumber, member.className, member.department, member.school);
                } else {
                    row.push(null, null, null, null, null, null, null); // Fill with empty values if member doesn't exist
                }
            }
            return row;
        });

        const values = [headerRow, ...dataRows];
        const range = 'A1';
        const valueInputOption = 'USER_ENTERED';

        // Clear the sheet before writing new data
        await sheets.spreadsheets.values.clear({
            spreadsheetId: GOOGLE_SHEET_ID,
            range: 'A:ZZ', 
        });

        await sheets.spreadsheets.values.update({
            spreadsheetId: GOOGLE_SHEET_ID,
            range,
            valueInputOption,
            requestBody: {
                values,
            },
        });

        return NextResponse.json({ message: 'Sync successful!' });

    } catch (error) {
        console.error('Error syncing to Google Sheet:', error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        return NextResponse.json({ error: `Server Error: ${errorMessage}` }, { status: 500 });
    }
}
