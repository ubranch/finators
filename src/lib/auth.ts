import PocketBase from 'pocketbase';

const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL);

export async function checkAuth() {
    // Check if there's a valid session
    return pb.authStore.isValid;
}

export function getUser() {
    return pb.authStore.model;
}

export function getErrorMessage(error: any): string {
    if (error.response?.data) {
        const { data } = error.response;
        if (typeof data === 'object') {
            return Object.values(data).flat().join(', ');
        }
        return data.toString();
    }
    return error.message || 'An unexpected error occurred';
}
