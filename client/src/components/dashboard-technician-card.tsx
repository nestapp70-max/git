import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import type { TechnicianWithUser } from '@shared/schema';

interface DashboardTechnicianCardProps {
  technician: TechnicianWithUser;
  isUnlocked: boolean;
  onUnlock: (technicianId: string) => void;
}

export function DashboardTechnicianCard({ technician, isUnlocked, onUnlock }: DashboardTechnicianCardProps) {
  const initials = technician.user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const mainSkill = technician.skills[0] || 'Technician';
  const basePrice = 199 + (technician.skills.length * 50);

  return (
    <div className="flex items-start gap-3 rounded-lg border border-border bg-card p-4 hover-elevate transition-all cursor-pointer">
      {/* Avatar */}
      <Avatar className="h-12 w-12 flex-shrink-0 bg-primary/20">
        <AvatarFallback className="bg-primary text-primary-foreground font-bold text-sm">
          {initials}
        </AvatarFallback>
      </Avatar>

      {/* Main Content */}
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-sm">{technician.user.name}</div>
        <div className="text-xs text-muted-foreground mt-0.5">
          {mainSkill} • <span className="text-muted-foreground">{technician.experience} yrs</span>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          <div className="inline-flex items-center rounded-full bg-muted/50 px-2 py-1 text-xs text-muted-foreground">
            Base ₹{basePrice}
          </div>
          <div className="inline-flex items-center rounded-full bg-muted/50 px-2 py-1 text-xs text-muted-foreground">
            {mainSkill}
          </div>
        </div>
      </div>

      {/* Right Side: Rating & WhatsApp */}
      <div className="flex flex-col items-end gap-2 flex-shrink-0">
        <div className="text-sm font-semibold text-primary">{technician.rating} ⭐</div>
        <Button
          size="sm"
          variant="ghost"
          className="rounded-full bg-green-500/10 hover:bg-green-500/20 text-green-600 text-xs h-7 px-2"
          onClick={(e) => {
            e.stopPropagation();
            const whatsappUrl = `https://wa.me/91${technician.user.phone}?text=Hi%20${encodeURIComponent(technician.user.name)}`;
            window.open(whatsappUrl, '_blank');
          }}
          data-testid={`button-whatsapp-${technician.id}`}
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5 mr-1">
            <path d="M20.5 3.5A11.5 11.5 0 1 0 12 23a11.3 11.3 0 0 0 6.2-1.8l3.4 1-1-3.3A11.3 11.3 0 0 0 23 12 11.5 11.5 0 0 0 20.5 3.5zm-8.5 16.2a9.6 9.6 0 0 1-5.2-1.5l-.4-.3-3.1.9.9-3.1-.3-.4A9.6 9.6 0 1 1 12 19.7z"></path>
          </svg>
          Chat
        </Button>
      </div>
    </div>
  );
}
