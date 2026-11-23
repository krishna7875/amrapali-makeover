import React from 'react';

export function InstagramIcon({ className = 'w-4 h-4', ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

export function WhatsAppIcon({ className = 'w-4 h-4', ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
      {...props}
    >
      {/* WhatsApp authentic brand green (#25D366) speech bubble */}
      <path
        d="M12.004 2C6.48 2 2 6.48 2 12.004c0 1.996.586 3.856 1.6 5.426L2 22l4.71-1.542a9.96 9.96 0 0 0 5.294 1.546c5.524 0 10.004-4.48 10.004-10.004C22.008 6.48 17.528 2 12.004 2z"
        fill="#25D366"
      />
      {/* Official white phone receiver handset */}
      <path
        d="M17.472 14.382c-.301-.15-1.78-.878-2.056-.979-.276-.1-.476-.15-.677.15-.2.301-.776.979-.952 1.18-.175.201-.351.226-.652.076-.301-.15-1.27-.468-2.42-1.493-.895-.798-1.5-1.784-1.676-2.085-.175-.301-.019-.464.132-.614.136-.135.301-.351.452-.527.15-.175.2-.301.3-.501.1-.2.05-.376-.025-.526-.075-.15-.677-1.631-.928-2.235-.245-.588-.495-.508-.677-.518l-.578-.01c-.2 0-.526.075-.802.376-.276.301-1.053 1.028-1.053 2.507s1.079 2.908 1.23 3.109c.15.2 2.122 3.24 5.14 4.543.718.31 1.278.496 1.716.635.72.23 1.376.197 1.895.12.578-.087 1.78-.727 2.03-1.43.25-.702.25-1.304.175-1.43-.075-.125-.276-.201-.577-.351z"
        fill="#FFFFFF"
      />
    </svg>
  );
}
