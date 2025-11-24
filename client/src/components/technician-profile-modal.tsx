import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ChevronLeft, ChevronRight, Star, MapPin, Briefcase, Clock } from 'lucide-react';
import type { TechnicianWithUser } from '@shared/schema';

interface TechnicianProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  technician: TechnicianWithUser | null;
  onUnlock?: (technicianId: string) => void;
  isUnlocked?: boolean;
}

export function TechnicianProfileModal({
  isOpen,
  onClose,
  technician,
  onUnlock,
  isUnlocked = false,
}: TechnicianProfileModalProps) {
  const [photoIndex, setPhotoIndex] = useState(0);

  if (!technician) return null;

  const initials = technician.user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  // Sample work photos (in real app, would come from database)
  const workPhotos = [
    'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1517420879713-6d4ee50991d3?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1516516407957-5d86903aafb7?w=400&h=400&fit=crop',
  ];

  const nextPhoto = () => {
    setPhotoIndex((prev) => (prev + 1) % workPhotos.length);
  };

  const prevPhoto = () => {
    setPhotoIndex((prev) => (prev - 1 + workPhotos.length) % workPhotos.length);
  };

  const dailyRate = 199 + technician.skills.length * 50;
  const whatsappUrl = `https://wa.me/91${technician.user.phone}?text=Hi%20${encodeURIComponent(technician.user.name)}%20I%20need%20your%20services`;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-4 border-b">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 bg-primary/20">
              <AvatarFallback className="bg-primary text-primary-foreground font-bold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <DialogTitle className="text-2xl">{technician.user.name}</DialogTitle>
              <p className="text-sm text-muted-foreground mt-1">{technician.skills[0]} Specialist</p>
              <div className="flex items-center gap-2 mt-2">
                <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{technician.location}</span>
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 pt-4">
          {/* Work Photos Slider */}
          {workPhotos.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold text-sm">Previous Work</h3>
              <div className="relative rounded-lg overflow-hidden bg-muted h-64 flex items-center justify-center">
                <img
                  src={workPhotos[photoIndex]}
                  alt={`Work photo ${photoIndex + 1}`}
                  className="w-full h-full object-cover"
                />

                {workPhotos.length > 1 && (
                  <>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="absolute left-2 bg-black/50 hover:bg-black/70 text-white"
                      onClick={prevPhoto}
                      data-testid="button-prev-photo"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="absolute right-2 bg-black/50 hover:bg-black/70 text-white"
                      onClick={nextPhoto}
                      data-testid="button-next-photo"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </Button>
                  </>
                )}

                <div className="absolute bottom-3 right-3 bg-black/60 text-white px-2.5 py-1 rounded-full text-xs font-medium">
                  {photoIndex + 1} / {workPhotos.length}
                </div>
              </div>
            </div>
          )}

          {/* Skills & Experience */}
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                  <Briefcase className="h-3.5 w-3.5" />
                  Skills
                </div>
                <div className="space-y-2">
                  {technician.skills.map((skill, idx) => (
                    <div key={idx} className="text-sm font-medium">
                      {skill}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  Experience
                </div>
                <div className="text-2xl font-bold text-primary">
                  {technician.experience}
                  <span className="text-sm text-muted-foreground ml-1">years</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Rating & Reviews */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div>
                  <div className="flex items-center gap-1">
                    <span className="text-2xl font-bold">{technician.rating}</span>
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.round(Number(technician.rating))
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-muted-foreground'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {technician.totalReviews} customer reviews
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Daily Rate */}
          <Card className="bg-primary/10 border-primary/20">
            <CardContent className="pt-6">
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">Daily Wage / Starting Rate</p>
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-bold text-primary">₹{dailyRate}</span>
                  <span className="text-sm text-muted-foreground">per day</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bio */}
          {technician.bio && (
            <Card>
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground">{technician.bio}</p>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1"
              data-testid="button-whatsapp-contact"
            >
              <Button className="w-full bg-green-600 hover:bg-green-700">
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 mr-2">
                  <path d="M20.5 3.5A11.5 11.5 0 1 0 12 23a11.3 11.3 0 0 0 6.2-1.8l3.4 1-1-3.3A11.3 11.3 0 0 0 23 12 11.5 11.5 0 0 0 20.5 3.5zm-8.5 16.2a9.6 9.6 0 0 1-5.2-1.5l-.4-.3-3.1.9.9-3.1-.3-.4A9.6 9.6 0 1 1 12 19.7z"></path>
                </svg>
                WhatsApp
              </Button>
            </a>

            {!isUnlocked && onUnlock && (
              <Button
                className="flex-1"
                variant="default"
                onClick={() => {
                  onUnlock(technician.id);
                  onClose();
                }}
                data-testid="button-unlock-contact"
              >
                Unlock Contact (₹10)
              </Button>
            )}

            {isUnlocked && (
              <div className="flex-1 flex items-center justify-center rounded-md bg-muted">
                <span className="text-sm font-medium text-muted-foreground">
                  ✓ Contact Unlocked
                </span>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
