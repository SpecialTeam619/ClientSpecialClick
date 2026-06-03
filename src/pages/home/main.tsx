import { getStoredUserRole } from '@shared/lib/auth';
import CustomerHome from './CustomerHome';
import LessorHome from './LessorHome';

export default function HomePage() {
    const role = getStoredUserRole();

    if (role === 'LESSOR') {
        return <LessorHome />;
    }

    return <CustomerHome />;
}
