import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronDown, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function CollapsibleCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(true);

  return (
    <Card className="overflow-hidden transition-all">
      <div
        className="flex items-center justify-between cursor-pointer p-4 border-b bg-muted hover:bg-muted/70 transition-colors"
        onClick={() => setOpen(!open)}
      >
        <div className="flex items-center space-x-2">
          {open ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
          <h2 className="text-lg font-semibold tracking-wide">{title}</h2>
        </div>
      </div>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.1, ease: "easeOut" }}
          >
            <CardContent className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {children}
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
