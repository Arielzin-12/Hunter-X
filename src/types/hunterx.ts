export type LeadStatus = "new" | "contacted" | "interested" | "negotiation" | "customer" | "lost";
export type Lead = {
  id: string; name: string; category?: string; city?: string; state?: string;
  phone?: string; website?: string; address?: string; rating?: number;
  reviews_count?: number; status: LeadStatus; has_website?: boolean;
  has_phone?: boolean; has_whatsapp?: boolean | "unknown"; source?: string;
  created_at?: string; last_contact_at?: string;
};
export type NavItem = { label: string; to: string; icon: string };
