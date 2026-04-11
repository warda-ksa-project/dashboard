/** شعارات وردة (نفس أسماء الملفات في البورتال). */
export function wardaLogoPath(lang?: string | null): string {
  const l = (lang ?? localStorage.getItem('lang') ?? 'en').toString().toLowerCase();
  return l === 'ar'
    ? 'assets/images/ARABIC%20-logo.png'
    : 'assets/images/English%20-logo.png';
}
