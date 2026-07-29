import React from 'react';

export interface IconProps {
  size?: number;
  className?: string;
  style?: React.CSSProperties;
  'aria-hidden'?: boolean | 'true' | 'false';
}

type IconFC = (props: IconProps) => React.JSX.Element;

function icon(paths: React.ReactNode): IconFC {
  return function Icon({ size = 20, className, style, 'aria-hidden': ariaHidden = true }: IconProps) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        style={style}
        aria-hidden={ariaHidden}
      >
        {paths}
      </svg>
    );
  };
}

export const Icons = {
  Dashboard:     icon(<><rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/></>),
  Globe:         icon(<><circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3c2.5 3 2.5 15 0 18M12 3c-2.5 3-2.5 15 0 18"/></>),
  Globe2:        icon(<><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18 14 14 0 0 1 0-18"/></>),
  Settings:      icon(<><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 0 1-4 0v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 0 1 0-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 0 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 0 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></>),
  Wrench:        icon(<path d="M14.7 6.3a4 4 0 0 0 5 5l-9 9a2.8 2.8 0 0 1-4-4l9-9a4 4 0 0 0 5 5z"/>),
  Pages:         icon(<><path d="M7 3h8l4 4v14a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z"/><path d="M14 3v5h5M9 13h6M9 17h6"/></>),
  BookOpen:      icon(<><path d="M12 7v14"/><path d="M3 18a4 4 0 0 1 4-4h5v7H7a4 4 0 0 1-4-3z"/><path d="M21 18a4 4 0 0 0-4-4h-5v7h5a4 4 0 0 0 4-3z"/><path d="M3 6a4 4 0 0 1 4-4h5v12H7a4 4 0 0 0-4 3z"/><path d="M21 6a4 4 0 0 0-4-4h-5v12h5a4 4 0 0 1 4 3z"/></>),
  Share:         icon(<><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.6 10.5 6.8-4M8.6 13.5l6.8 4"/></>),
  Briefcase:     icon(<><rect x="3" y="7" width="18" height="14" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 13h18"/></>),
  Mail:          icon(<><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 7 9-7"/></>),
  Edit:          icon(<><path d="M17 3 21 7l-12 12H5v-4z"/><path d="m14 6 4 4"/></>),
  Link:          icon(<><path d="M10 14a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1"/><path d="M14 10a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1"/></>),
  AtSign:        icon(<><circle cx="12" cy="12" r="4"/><path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-4 8"/></>),
  Newspaper:     icon(<><path d="M4 4h13a2 2 0 0 1 2 2v14H6a2 2 0 0 1-2-2z"/><path d="M19 8h2v10a2 2 0 0 1-2 2M8 8h7M8 12h7M8 16h7"/></>),
  Megaphone:     icon(<><path d="M3 11v2a1 1 0 0 0 1 1h2l5 5V5L6 10H4a1 1 0 0 0-1 1z"/><path d="M16 8a5 5 0 0 1 0 8M19 5a9 9 0 0 1 0 14"/></>),
  Calendar:      icon(<><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></>),
  Bell:          icon(<><path d="M6 8a6 6 0 0 1 12 0c0 7 3 8 3 8H3s3-1 3-8z"/><path d="M10 21a2 2 0 0 0 4 0"/></>),
  User:          icon(<><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></>),
  Users:         icon(<><circle cx="9" cy="8" r="4"/><path d="M1 21a8 8 0 0 1 16 0M17 11a3.5 3.5 0 0 0 0-7M23 21a7 7 0 0 0-4.5-6.5"/></>),
  Phone:         icon(<><rect x="6" y="2" width="12" height="20" rx="2"/><path d="M11 18h2"/></>),
  UserPlus:      icon(<><circle cx="9" cy="8" r="4"/><path d="M1 21a8 8 0 0 1 16 0M20 8v6M23 11h-6"/></>),
  UserGroup:     icon(<><circle cx="9" cy="8" r="3.5"/><path d="M2 21a7 7 0 0 1 14 0"/><circle cx="17" cy="9" r="2.5"/><path d="M22 19a5 5 0 0 0-3-4.5"/></>),
  Ticket:        icon(<><path d="M3 10V7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v3a2 2 0 0 0 0 4v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-3a2 2 0 0 0 0-4z"/><path d="M9 5v14"/></>),
  ChevronDown:   icon(<path d="m6 9 6 6 6-6"/>),
  ChevronRight:  icon(<path d="m9 6 6 6-6 6"/>),
  Search:        icon(<><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></>),
  Grid:          icon(<><rect x="4" y="4" width="6" height="6" rx="1"/><rect x="14" y="4" width="6" height="6" rx="1"/><rect x="4" y="14" width="6" height="6" rx="1"/><rect x="14" y="14" width="6" height="6" rx="1"/></>),
  Question:      icon(<><circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.8.4-1 1-1 1.7M12 17h.01"/></>),
  Message:       icon(<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>),
  LifeBuoy:      icon(<><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3.5"/><path d="m4.9 4.9 4.5 4.5M14.6 14.6l4.5 4.5M4.9 19.1l4.5-4.5M14.6 9.4l4.5-4.5"/></>),
  ArrowUpRight:  icon(<path d="M7 17 17 7M7 7h10v10"/>),
  TrendUp:       icon(<path d="m3 17 6-6 4 4 8-8M14 7h7v7"/>),
  TrendDown:     icon(<path d="m3 7 6 6 4-4 8 8M14 17h7v-7"/>),
  MapPin:        icon(<><path d="M12 21s-7-6.5-7-12a7 7 0 0 1 14 0c0 5.5-7 12-7 12z"/><circle cx="12" cy="9" r="2.5"/></>),
  Clock:         icon(<><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>),
  Sliders:       icon(<path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6"/>),
  X:             icon(<path d="M18 6 6 18M6 6l12 12"/>),
  Plus:          icon(<path d="M12 5v14M5 12h14"/>),
  Sparkles:      icon(<><path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M5.6 18.4l2.8-2.8M15.6 8.4l2.8-2.8"/></>),
  Zap:           icon(<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>),
  Bug:           icon(<><rect x="8" y="6" width="8" height="14" rx="4"/><path d="M12 6V3M9 3l3 3 3-3M4 12h4M16 12h4M5 8l3 2M19 8l-3 2M5 18l3-2M19 18l-3-2"/></>),
  Shield:        icon(<path d="M12 3 4 6v7c0 4 3 7 8 8 5-1 8-4 8-8V6z"/>),
  Palette:       icon(<><path d="M12 3a9 9 0 1 0 0 18c1.5 0 2.5-1 2.5-2.3 0-.7-.3-1.4-.8-1.9-.5-.5-.7-1.2-.7-1.8 0-1.1.9-2 2-2H17a4 4 0 0 0 4-4 8 8 0 0 0-9-6z"/><circle cx="7.5" cy="10.5" r="1"/><circle cx="12" cy="7.5" r="1"/><circle cx="16.5" cy="10.5" r="1"/></>),
  Image:         icon(<><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="m21 16-5-5L5 20"/></>),
  FileText:      icon(<><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M14 3v6h6M8 13h8M8 17h6"/></>),
  Folder:        icon(<path d="M3 6a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>),
  Languages:     icon(<><path d="M4 5h8M8 3v2M6 5c0 6-2 8-2 8M4 9c0 4 4 5 6 5"/><path d="m14 21 4-10 4 10M16 16h6"/></>),
  Database:      icon(<><ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v6c0 1.7 3.6 3 8 3s8-1.3 8-3V5"/><path d="M4 11v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6"/></>),
  Layers:        icon(<><path d="m12 3 9 5-9 5-9-5z"/><path d="m3 12 9 5 9-5M3 17l9 5 9-5"/></>),
  Layout:        icon(<><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></>),
  Eye:           icon(<><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></>),
  Form:          icon(<><rect x="4" y="4" width="16" height="16" rx="2"/><path d="M8 9h8M8 13h5M8 17h3"/></>),
  Rss:           icon(<><path d="M4 11a9 9 0 0 1 9 9M4 4a16 16 0 0 1 16 16"/><circle cx="5" cy="19" r="1.5"/></>),
  Tag:           icon(<><path d="M20 13 13 20a2 2 0 0 1-2.8 0L3 12.8V4h8.8L20 12a.7.7 0 0 1 0 1z"/><circle cx="7.5" cy="7.5" r="1"/></>),
  AlertTriangle: icon(<><path d="M10.3 3.9 2.6 17a2 2 0 0 0 1.7 3h15.4a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/><path d="M12 9v4M12 17h.01"/></>),
  Smartphone:    icon(<><rect x="6" y="2" width="12" height="20" rx="2.5"/><path d="M10 18h4"/></>),
  Tablet:        icon(<><rect x="4" y="3" width="16" height="18" rx="2"/><circle cx="12" cy="17.5" r=".5" fill="currentColor"/></>),
  IdCard:        icon(<><rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="9" cy="11" r="2.5"/><path d="M5 17c1-2 3-3 4-3s3 1 4 3M14 9h4M14 12h4"/></>),
  Heart:         icon(<path d="M12 21s-7-4.5-9-9.5C1.6 7.7 3.8 4 7.4 4c1.9 0 3.5 1 4.6 2.5C13.1 5 14.7 4 16.6 4 20.2 4 22.4 7.7 21 11.5 19 16.5 12 21 12 21z"/>),
  Vote:          icon(<><rect x="3" y="11" width="18" height="10" rx="2"/><path d="m7 11 3-7 8 7"/></>),
  Photo:         icon(<><rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="8" cy="10" r="1.5"/><path d="m3 17 5-5 4 4 3-3 6 6"/></>),
  Server:        icon(<><rect x="3" y="4" width="18" height="7" rx="2"/><rect x="3" y="13" width="18" height="7" rx="2"/><circle cx="7" cy="7.5" r=".5" fill="currentColor"/><circle cx="7" cy="16.5" r=".5" fill="currentColor"/></>),
  Sun:           icon(<><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M2 12h2M20 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"/></>),
  Moon:          icon(<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>),
  LayoutGrid:    icon(<><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></>),
  AlignJustify:  icon(<path d="M3 6h18M3 10h18M3 14h18M3 18h18"/>),
  Circle:        icon(<circle cx="12" cy="12" r="9"/>),
  AccountTree:   icon(<><rect x="3" y="9" width="6" height="6" rx="1.5"/><rect x="15" y="3" width="6" height="6" rx="1.5"/><rect x="15" y="15" width="6" height="6" rx="1.5"/><path d="M9 12h2v-6h4M11 12v6h4"/></>),
  Brush:         icon(<><path d="m11 10 3 3"/><path d="M6.5 21A3.5 3.5 0 1 0 3 17.5a2.62 2.62 0 0 1-.708 1.792A1 1 0 0 0 3 21z"/><path d="M9.969 17.031 21.378 5.624a1 1 0 0 0-3.002-3.002L6.967 14.031"/></>),
  Play:          icon(<><circle cx="12" cy="12" r="9"/><path d="M10.5 8.5 15.5 12l-5 3.5z" fill="currentColor" stroke="none"/></>),
  Paperclip:     icon(<path d="M21.44 11.05 12.25 20.24a5.5 5.5 0 0 1-7.78-7.78l9.19-9.19a3.5 3.5 0 0 1 4.95 4.95l-9.2 9.19a1.5 1.5 0 0 1-2.12-2.12l8.49-8.48"/>),
  Code:          icon(<><path d="m16 18 6-6-6-6"/><path d="m8 6-6 6 6 6"/></>),
  CreditCard:    icon(<><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/></>),
} as const;

export type IconName = keyof typeof Icons;
