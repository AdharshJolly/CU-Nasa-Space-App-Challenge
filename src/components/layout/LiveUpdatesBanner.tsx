"use client";

import { useState, useEffect } from 'react';
import { Megaphone } from 'lucide-react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export function LiveUpdatesBanner() {
  const [bannerText, setBannerText] = useState<string | null>(null);
  const [isEnabled, setIsEnabled] = useState(false);

  useEffect(() => {
    const bannerUnsubscribe = onSnapshot(doc(db, "settings", "liveBanner"), (doc) => {
      if (doc.exists() && doc.data().text) {
        setBannerText(doc.data().text);
      } else {
        setBannerText(null);
      }
    });

    const featuresUnsubscribe = onSnapshot(doc(db, "settings", "features"), (doc) => {
      if (doc.exists()) {
        setIsEnabled(doc.data().liveUpdatesEnabled);
      } else {
        setIsEnabled(false);
      }
    });

    return () => {
      bannerUnsubscribe();
      featuresUnsubscribe();
    }
  }, []);

  if (!bannerText || !isEnabled) {
    return null;
  }

  return (
    <div className="bg-primary/10 text-primary-foreground p-3 text-center text-sm">
      <div className="container mx-auto flex items-center justify-center gap-2">
        <Megaphone className="h-5 w-5 text-primary" />
        <p className="text-foreground">
          <span className="font-bold">Live Updates:</span> {bannerText}
        </p>
      </div>
    </div>
  );
}
