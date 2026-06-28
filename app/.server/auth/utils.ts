import { compare, hash } from 'bcryptjs';

export function hashCreds(password: string) {
    return hash(password, 10);
}

export function verifyCreds(password: string, hashSecret: string) {
    return compare(password, hashSecret);
}
