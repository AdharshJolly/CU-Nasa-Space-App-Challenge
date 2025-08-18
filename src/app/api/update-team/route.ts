
import { NextResponse } from 'next/server';
import { initializeAdminApp } from '@/lib/firebase-admin';
import { logActivity } from '@/lib/logger';
import { z } from 'zod';

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

export async function POST(req: Request) {
    try {
        const { adminDb, adminAuth } = await initializeAdminApp();
        const { teamId, teamData, updatedBy } = await req.json();

        // Validate the incoming data
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

        // Check for uniqueness constraints against other teams
        const teamNameQuery = await registrationsRef.where('teamName', '==', validatedData.teamName).get();
        if (!teamNameQuery.empty && teamNameQuery.docs[0].id !== teamId) {
            return NextResponse.json({ error: 'This team name is already taken.' }, { status: 409 });
        }
        
        // This is a simplified uniqueness check. For a production app with high concurrency,
        // more robust checks (e.g., using transactions or dedicated fields) would be better.
        // For now, we rely on the frontend validation which is more comprehensive.

        await teamDocRef.update({
            teamName: validatedData.teamName,
            members: validatedData.members
        });

        await logActivity(updatedBy, 'Team Updated', {
            teamId,
            teamName: validatedData.teamName,
            changes: { from: originalData, to: validatedData }
        });

        return NextResponse.json({ message: 'Team updated successfully.' });

    } catch (error: any) {
        console.error('Error updating team:', error);
        // Ensure the error is logged even if the update fails
        const { updatedBy } = await req.json().catch(() => ({ updatedBy: 'unknown' }));
        await logActivity(updatedBy, 'Team Update Failed', { error: error.message });

        return NextResponse.json({ error: error.message || 'An unknown server error occurred.' }, { status: 500 });
    }
}

    