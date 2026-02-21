export function isAuthenticated() {
    const token = localStorage.getItem('token');
    return !!token;
}

export function isAdmin() {
    const role = localStorage.getItem('role');
    return role === 'admin';
}
