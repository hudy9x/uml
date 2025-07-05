import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Dialog, DialogContent } from "./ui/dialog";
import { Progress } from "./ui/progress";
import { check, type DownloadEvent } from "@tauri-apps/plugin-updater";
import { relaunch } from "@tauri-apps/plugin-process";
import { getVersion } from "@tauri-apps/api/app";
import { toast } from "sonner";

export enum UpdateStatus {
  CHECKING = 'CHECKING',
  AVAILABLE = 'AVAILABLE',
  LATEST = 'LATEST',
  ERROR = 'ERROR'
}

export interface UpdateInfo {
  status: UpdateStatus;
  currentVersion: string;
  newVersion?: string;
  error?: string;
}

export function VersionDisplay() {
  const [version, setVersion] = useState("");
  const [updateInfo, setUpdateInfo] = useState<UpdateInfo>({
    status: UpdateStatus.CHECKING,
    currentVersion: "",
  });
  const [showUpdateDialog, setShowUpdateDialog] = useState(false);
  const [updateProgress, setUpdateProgress] = useState(0);
  const [isUpdating, setIsUpdating] = useState(false);

  const checkForUpdates = async () => {
    try {
      setUpdateInfo(prev => ({ ...prev, status: UpdateStatus.CHECKING }));
      const update = await check();
      
      if (update) {
        setUpdateInfo({
          status: UpdateStatus.AVAILABLE,
          currentVersion: version,
          newVersion: update.version
        });
      } else {
        setUpdateInfo({
          status: UpdateStatus.LATEST,
          currentVersion: version
        });
      }
    } catch (error) {
      console.error("Failed to check for updates:", error);
      setUpdateInfo({
        status: UpdateStatus.ERROR,
        currentVersion: version,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  useEffect(() => {
    // Get current version
    getVersion().then(currentVersion => {
      setVersion(currentVersion);
      setUpdateInfo(prev => ({ ...prev, currentVersion }));
    });
    
    // Initial check
    checkForUpdates();

    // Check periodically
    const interval = setInterval(checkForUpdates, 1000 * 60 * 60); // Check every hour
    return () => clearInterval(interval);
  }, []);

  // Check for updates when dialog opens
  useEffect(() => {
    if (showUpdateDialog) {
      checkForUpdates();
    }
  }, [showUpdateDialog]);

  const handleUpdate = async () => {
    try {
      setIsUpdating(true);
      const update = await check();
      
      if (!update) {
        toast.error("No update available");
        return;
      }

      let downloaded = 0;
      let totalSize = 0;
      
      await update.downloadAndInstall((progress: DownloadEvent) => {
        switch (progress.event) {
          case "Started":
            if (progress.data.contentLength) {
              totalSize = progress.data.contentLength;
              console.log(`Started downloading ${totalSize} bytes`);
            }
            break;
          case "Progress":
            downloaded += progress.data.chunkLength;
            if (totalSize > 0) {
              const percent = (downloaded / totalSize) * 100;
              setUpdateProgress(percent);
            }
            break;
          case "Finished":
            console.log("Download finished");
            break;
        }
      });

      toast.success("Update installed successfully!");
      await relaunch();
    } catch (error) {
      console.error("Failed to update:", error);
      toast.error("Failed to update: " + error);
    } finally {
      setIsUpdating(false);
      setShowUpdateDialog(false);
    }
  };

  const getStatusMessage = () => {
    switch (updateInfo.status) {
      case UpdateStatus.CHECKING:
        return (
          <div className="flex items-center gap-2 justify-center">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-sky-500 border-t-transparent"></div>
            <span>Checking for updates...</span>
          </div>
        );
      case UpdateStatus.AVAILABLE:
        return (
          <div className="text-center">
            A new version (v{updateInfo.newVersion}) is available!
          </div>
        );
      case UpdateStatus.LATEST:
        return (
          <div className="text-center">
            You're running the latest version
          </div>
        );
      case UpdateStatus.ERROR:
        return (
          <div className="text-center text-red-500">
            Failed to check for updates: {updateInfo.error || 'Unknown error'}
          </div>
        );
    }
  };

  return (
    <>
      <div className="fixed bottom-4 right-4 flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          className="relative"
          onClick={() => setShowUpdateDialog(true)}
        >
          {updateInfo.status === UpdateStatus.AVAILABLE && (
            <span className="absolute -right-1 -top-1">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-sky-500"></span>
              </span>
            </span>
          )}
          v{version}
        </Button>
      </div>

      <Dialog open={showUpdateDialog} onOpenChange={setShowUpdateDialog}>
        <DialogContent className="w-[280px] rounded-xl bg-zinc-900/80 backdrop-blur-sm border-0 [&>button]:text-white [&>button]:cursor-pointer [&>button:hover]:text-white/80">
          <div className="flex flex-col items-center gap-4 py-4">
            {/* App Icon */}
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 16.1A5 5 0 0 1 5.9 20M2 12.05A9 9 0 0 1 9.95 20M2 8V6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-6"></path>
                <line x1="2" y1="20" x2="2" y2="20"></line>
              </svg>
            </div>

            {/* App Info */}
            <div className="space-y-3 w-full">
              <div className="text-center space-y-0.5">
                <h2 className="text-xl font-semibold text-white">UML Editor</h2>
                <p className="text-xs text-gray-400">Version {version}</p>
                <p className="text-[10px] text-gray-500 max-w-[240px] mx-auto mt-2">
                  A modern UML diagram editor with real-time preview and PlantUML support. Create, edit, and export your diagrams with ease.
                </p>
              </div>

              {/* Status Message */}
              <div className="text-xs text-gray-300 py-1.5">
                {getStatusMessage()}
              </div>

              {/* Update Progress */}
              {isUpdating && (
                <div className="space-y-1.5 px-3">
                  <Progress value={updateProgress} className="h-1" />
                  <p className="text-xs text-gray-400 text-center">
                    Downloading update: {Math.round(updateProgress)}%
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              {updateInfo.status === UpdateStatus.AVAILABLE && (

              <div className="flex justify-center gap-2 pt-3">
                  <Button
                    size="sm"
                    onClick={handleUpdate}
                    disabled={isUpdating}
                    className="bg-blue-600 text-white hover:bg-blue-700 text-xs h-7 px-3"
                  >
                    {isUpdating ? "Updating..." : "Update Now"}
                  </Button>
                </div>
              )}
            </div>

            {/* Copyright */}
            <div className="text-[10px] text-gray-500 text-center">
              © {new Date().getFullYear()} UML Editor. All rights reserved.
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
} 