
import { NextResponse } from 'next/server';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const initializeFirebaseAdmin = () => {
    if (getApps().length > 0) {
        return;
    }
    
    if (!process.env.FIREBASE_ADMIN_PRIVATE_KEY) {
        throw new Error('The FIREBASE_ADMIN_PRIVATE_KEY environment variable is not set.');
    }
    
    try {
        const serviceAccount = JSON.parse(process.env.FIREBASE_ADMIN_PRIVATE_KEY);
        initializeApp({
            credential: cert(serviceAccount)
        });
    } catch (error) {
        if (error instanceof SyntaxError) {
            throw new Error('Failed to parse FIREBASE_ADMIN_PRIVATE_KEY. Please ensure it is a valid JSON string.');
        }
        throw error;
    }
};

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
        initializeFirebaseAdmin();
        const db = getFirestore();

        const registrationsSnapshot = await db.collection('registrations').get();
        
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
