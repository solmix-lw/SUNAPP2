import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Bell, Check, Info, AlertTriangle, XCircle, CheckCircle2 } from "lucide-react";
import { format } from "date-fns";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import { apiRequest } from "@/lib/queryClient";

interface Notification {
    id: string;
    type: "info" | "success" | "warning" | "error";
    activityType: string;
    message: string;
    read: boolean;
    data: any;
    createdAt: string;
}

export function NotificationsPopover() {
    const [open, setOpen] = useState(false);
    const queryClient = useQueryClient();
    const { toast } = useToast();

    const { data: notifications = [], isLoading } = useQuery<Notification[]>({
        queryKey: ["/api/notifications"],
        refetchInterval: 30000, // Poll every 30 seconds
    });

    const unreadCount = notifications.filter((n) => !n.read).length;

    const markReadMutation = useMutation({
        mutationFn: async (id: string) => {
            await apiRequest("PATCH", `/api/notifications/${id}/read`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/notifications"] });
        },
    });

    const markAllReadMutation = useMutation({
        mutationFn: async () => {
            await apiRequest("POST", "/api/notifications/mark-all-read");
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/notifications"] });
            toast({
                title: "Success",
                description: "All notifications marked as read",
            });
        },
    });

    const handleNotificationClick = (notification: Notification) => {
        if (!notification.read) {
            markReadMutation.mutate(notification.id);
        }
        setOpen(false);
    };

    const getIcon = (type: string) => {
        switch (type) {
            case "success":
                return <CheckCircle2 className="h-4 w-4 text-green-500" />;
            case "warning":
                return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
            case "error":
                return <XCircle className="h-4 w-4 text-red-500" />;
            default:
                return <Info className="h-4 w-4 text-blue-500" />;
        }
    };

    const getLink = (notification: Notification) => {
        if (notification.data?.workOrderId) return `/work-orders/${notification.data.workOrderId}`;
        if (notification.data?.requisitionId) return `/parts-requests/${notification.data.requisitionId}`; // Assuming route
        if (notification.data?.inspectionId) return `/inspections/${notification.data.inspectionId}`; // Assuming route
        if (notification.data?.requestId) return `/parts-requests/${notification.data.requestId}`;
        return "#";
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                        <Badge
                            variant="destructive"
                            className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center rounded-full p-0 text-xs"
                        >
                            {unreadCount > 9 ? "9+" : unreadCount}
                        </Badge>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="end">
                <div className="flex items-center justify-between p-4 border-b">
                    <h4 className="font-semibold">Notifications</h4>
                    {unreadCount > 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-xs h-auto p-0 text-muted-foreground hover:text-primary"
                            onClick={() => markAllReadMutation.mutate()}
                            disabled={markAllReadMutation.isPending}
                        >
                            Mark all read
                        </Button>
                    )}
                </div>
                <ScrollArea className="h-[300px]">
                    {isLoading ? (
                        <div className="p-4 text-center text-sm text-muted-foreground">
                            Loading...
                        </div>
                    ) : notifications.length === 0 ? (
                        <div className="p-4 text-center text-sm text-muted-foreground">
                            No notifications
                        </div>
                    ) : (
                        <div className="grid gap-1">
                            {notifications.map((notification) => (
                                <Link key={notification.id} href={getLink(notification)}>
                                    <div
                                        className={cn(
                                            "flex items-start gap-3 p-4 hover:bg-muted/50 transition-colors cursor-pointer",
                                            !notification.read && "bg-muted/20 border-l-2 border-primary"
                                        )}
                                        onClick={() => handleNotificationClick(notification)}
                                    >
                                        <div className="mt-1">{getIcon(notification.type)}</div>
                                        <div className="grid gap-1">
                                            <p className="text-sm font-medium leading-none">
                                                {notification.message}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {format(new Date(notification.createdAt), "MMM d, h:mm a")}
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </ScrollArea>
            </PopoverContent>
        </Popover>
    );
}
