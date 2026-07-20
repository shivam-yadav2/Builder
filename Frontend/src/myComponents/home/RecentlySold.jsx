import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, CheckCircle2 } from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const isVideo = (url) =>
  ["video/mp4", ".mp4", ".webm", ".ogg"].some((ext) => url?.toLowerCase().endsWith(ext));

// Social-proof section: shows recently closed deals pulled from the Gallery.
const RecentlySold = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    let active = true;
    axios
      .get(`${API_BASE_URL}/api/v1/gallery/get-all?category=sold`)
      .then((res) => {
        if (active) setItems((res.data?.data || []).slice(0, 6));
      })
      .catch(() => {
        /* silently hide the section if it fails */
      });
    return () => {
      active = false;
    };
  }, []);

  if (items.length === 0) return null;

  return (
    <div className="py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-3 text-center">
          <span className="text-[15px] font-semibold text-[#1563df]">Our Track Record</span>
          <h2 className="text-3xl font-bold md:text-4xl">Recently Sold Properties</h2>
          <p className="max-w-2xl text-gray-500">
            Real deals we've successfully closed for our happy clients.
          </p>
        </div>

        <div className="mt-9 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => {
            const cover = item.images?.[0];
            const coverUrl = cover ? `${API_BASE_URL}/${cover}` : null;
            return (
              <Card key={item._id} className="overflow-hidden transition-shadow hover:shadow-lg">
                <div className="relative h-52 w-full bg-gray-100">
                  {coverUrl &&
                    (isVideo(cover) ? (
                      <video src={coverUrl} className="h-52 w-full object-cover" muted />
                    ) : (
                      <img src={coverUrl} alt={item.name} className="h-52 w-full object-cover" />
                    ))}
                  <Badge className="absolute right-3 top-3 bg-green-600 text-white hover:bg-green-600">
                    <CheckCircle2 className="mr-1 h-3.5 w-3.5" /> Sold
                  </Badge>
                </div>
                <CardContent className="space-y-1 pt-4">
                  <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                  <p className="flex items-center gap-1 text-sm text-gray-600">
                    <MapPin className="h-4 w-4" /> {item.location}
                  </p>
                  <p className="text-base font-semibold text-[#1563df]">{item.sold_price}</p>
                  <p className="text-xs text-gray-400">
                    Closed on {new Date(item.sold_date).toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default RecentlySold;
