"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";

interface FocusReminderProps {
  open: boolean;
  awayDuration: number;
  onDismiss: () => void;
}

function getReminderContent(seconds: number) {
  const minutes = Math.round(seconds / 60);

  if (seconds < 60) {
    return {
      title: "欢迎回来！",
      description: "休息了一小会儿，继续加油吧！",
    };
  }
  if (minutes <= 5) {
    return {
      title: "欢迎回来！",
      description: `休息了 ${minutes} 分钟，精神充沛了吧？`,
    };
  }
  if (minutes <= 15) {
    return {
      title: "回来啦！",
      description: `离开了 ${minutes} 分钟，适当休息很重要！`,
    };
  }
  return {
    title: "好久不见！",
    description: `离开了 ${minutes} 分钟。没关系，重新开始也很棒！`,
  };
}

export function FocusReminder({ open, awayDuration, onDismiss }: FocusReminderProps) {
  const { title, description } = getReminderContent(awayDuration);

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onDismiss()}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-center text-xl">{title}</DialogTitle>
          <DialogDescription className="text-center text-base pt-2">
            {description}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-center pt-2">
          <Button onClick={onDismiss} className="w-full sm:w-auto">
            <BookOpen className="h-4 w-4 mr-2" />
            继续学习
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
