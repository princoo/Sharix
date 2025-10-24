import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Settings, User, Lock, Bell } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="">
      <div className="mx-auto max-w-7xl space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary">
            Settings
          </h1>
          <p className="text-muted-foreground mt-2">
            Update profile, change password, and manage platform configurations
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="shadow-none">
            <CardHeader className="flex flex-row items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle>Profile Settings</CardTitle>
                <CardDescription>
                  Update your personal information
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Profile settings content coming soon...
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-none">
            <CardHeader className="flex flex-row items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Lock className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle>Security</CardTitle>
                <CardDescription>
                  Change password and security settings
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Security settings content coming soon...
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-none">
            <CardHeader className="flex flex-row items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Bell className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle>Notifications</CardTitle>
                <CardDescription>
                  Manage notification preferences
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Notification settings content coming soon...
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-none">
            <CardHeader className="flex flex-row items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Settings className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle>Platform Configuration</CardTitle>
                <CardDescription>Manage platform-wide settings</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Platform configuration content coming soon...
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
