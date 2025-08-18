
import { NextResponse } from 'next/server';
import { initializeAdminApp } from '@/lib/firebase-admin';
import { logAPI } from '@/lib/logger';

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


export async function GET(request: Request) {
    try {
        // Log API access
        await logAPI(null, '/api/check-duplicates', 'GET', {
            userAgent: request.headers.get('user-agent'),
            timestamp: new Date().toISOString()
        });

        const { adminDb } = initializeAdminApp();
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

        const result = {
            emails: Array.from(emails),
            registerNumbers: Array.from(registerNumbers),
            phones: Array.from(phones),
        };

        // Log successful response
        await logAPI(null, '/api/check-duplicates', 'GET', {
            ...result,
            status: 'success',
            recordCount: {
                emails: result.emails.length,
                registerNumbers: result.registerNumbers.length,
                phones: result.phones.length
            }
        });

        return NextResponse.json(result);

    } catch (error: any) {
        console.error('Error fetching duplicates:', error);
        
        // Log error
        await logAPI(null, '/api/check-duplicates', 'GET', {
            error: error.message,
            status: 'error'
        });

        return NextResponse.json({ error: error.message || 'An unknown error occurred' }, { status: 500 });
    }
}
