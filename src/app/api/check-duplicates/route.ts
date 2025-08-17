
import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

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


export async function GET() {
    try {
        if (!adminDb) {
            throw new Error("Firebase Admin has not been initialized.");
        }

        const registrationsSnapshot = await adminDb.collection('registrations').get();
        
        const emails = new Set<string>();
        const registerNumbers = new Set<string>();
        const phones = new Set<string>();

        registrationsSnapshot.forEach(doc => {
            const team = doc.data() as Omit<Team, 'id'>;
            team.members.forEach(member => {
                if (member.email) emails.add(member.email.toLowerCase());
                if (member.registerNumber) registerNumbers.add(member.registerNumber.toLowerCase());
                if (member.phone) phones.add(member.phone);
            });
        });

        return NextResponse.json({
            emails: Array.from(emails),
            registerNumbers: Array.from(registerNumbers),
            phones: Array.from(phones),
        });

    } catch (error: any) {
        console.error('Error fetching duplicates:', error);
        return NextResponse.json({ error: error.message || 'An unknown error occurred' }, { status: 500 });
    }
}
