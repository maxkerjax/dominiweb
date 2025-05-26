
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface SystemSettings {
  waterRate: number;
  electricityRate: number;
  lateFee: number;
  depositRate: number;
}

const defaultSettings: SystemSettings = {
  waterRate: 18,
  electricityRate: 8,
  lateFee: 5,
  depositRate: 2
};

export const useSystemSettings = () => {
  const [settings, setSettings] = useState<SystemSettings>(defaultSettings);
  const [loading, setLoading] = useState(false);

  const loadSettings = async () => {
    try {
      // For now, we'll use localStorage to store settings
      // In a real application, you might want to create a settings table
      const savedSettings = localStorage.getItem('systemSettings');
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const saveSettings = async (newSettings: SystemSettings) => {
    setLoading(true);
    try {
      // Save to localStorage for now
      localStorage.setItem('systemSettings', JSON.stringify(newSettings));
      setSettings(newSettings);
      toast.success("บันทึกการตั้งค่าสำเร็จ!");
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error("ไม่สามารถบันทึกการตั้งค่าได้");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  return {
    settings,
    saveSettings,
    loading
  };
};
