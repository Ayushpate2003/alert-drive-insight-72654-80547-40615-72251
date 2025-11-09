import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import {
  Settings,
  Shield,
  Database,
  Brain,
  Cloud,
  Bell,
  Save,
  RotateCcw,
  Info,
  Key,
  Lock,
  Clock,
  Server,
  Zap,
  Mail,
  Smartphone
} from 'lucide-react';

const AdminSettings = () => {
  const [settings, setSettings] = useState({
    // Security & Access
    jwtExpiry: '24',
    passwordMinLength: '8',
    mfaEnabled: true,
    sessionTimeout: '60',

    // Data Management
    dataRetention: '365',
    backupFrequency: 'daily',
    anonymizeData: true,

    // AI Models
    modelVersion: 'v2.1.0',
    autoRetrain: false,
    retrainThreshold: '0.85',

    // Integrations
    vertexAiKey: '',
    ragEngineUrl: '',
    webhookUrl: '',

    // Notifications
    emailAlerts: true,
    systemAlerts: true,
    alertEmail: 'admin@safeyatra.com'
  });

  const handleSave = (section: string) => {
    // In a real app, this would save to backend
    console.log(`Saving ${section} settings:`, settings);
    // Show success toast
  };

  const handleReset = (section: string) => {
    // Reset to defaults
    console.log(`Resetting ${section} settings`);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Settings className="w-8 h-8 text-[#00B4D8]" />
            System Settings & Configuration
          </h1>
          <p className="text-gray-400 mt-1">Manage application parameters, security, and integrations</p>
        </div>
      </div>

      <Tabs defaultValue="security" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 bg-[#1A1A1A] border border-gray-700">
          <TabsTrigger value="security" className="data-[state=active]:bg-[#00B4D8] data-[state=active]:text-black">
            <Shield className="w-4 h-4 mr-2" />
            Security
          </TabsTrigger>
          <TabsTrigger value="data" className="data-[state=active]:bg-[#00B4D8] data-[state=active]:text-black">
            <Database className="w-4 h-4 mr-2" />
            Data
          </TabsTrigger>
          <TabsTrigger value="ai" className="data-[state=active]:bg-[#00B4D8] data-[state=active]:text-black">
            <Brain className="w-4 h-4 mr-2" />
            AI Models
          </TabsTrigger>
          <TabsTrigger value="integrations" className="data-[state=active]:bg-[#00B4D8] data-[state=active]:text-black">
            <Cloud className="w-4 h-4 mr-2" />
            Integrations
          </TabsTrigger>
          <TabsTrigger value="notifications" className="data-[state=active]:bg-[#00B4D8] data-[state=active]:text-black">
            <Bell className="w-4 h-4 mr-2" />
            Notifications
          </TabsTrigger>
        </TabsList>

        {/* Security & Access Tab */}
        <TabsContent value="security" className="space-y-6">
          <Card className="bg-[#1A1A1A] border-gray-700 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-red-500/20 rounded-lg">
                <Shield className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white">Security & Access Control</h3>
                <p className="text-gray-400">Manage authentication, authorization, and security policies</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="jwtExpiry" className="text-gray-300">JWT Token Expiry (hours)</Label>
                <Input
                  id="jwtExpiry"
                  type="number"
                  value={settings.jwtExpiry}
                  onChange={(e) => setSettings({...settings, jwtExpiry: e.target.value})}
                  className="bg-[#0B0C10] border-gray-600 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="passwordMinLength" className="text-gray-300">Minimum Password Length</Label>
                <Input
                  id="passwordMinLength"
                  type="number"
                  value={settings.passwordMinLength}
                  onChange={(e) => setSettings({...settings, passwordMinLength: e.target.value})}
                  className="bg-[#0B0C10] border-gray-600 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sessionTimeout" className="text-gray-300">Session Timeout (minutes)</Label>
                <Input
                  id="sessionTimeout"
                  type="number"
                  value={settings.sessionTimeout}
                  onChange={(e) => setSettings({...settings, sessionTimeout: e.target.value})}
                  className="bg-[#0B0C10] border-gray-600 text-white"
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-[#0B0C10] rounded-lg border border-gray-600">
                <div className="flex items-center gap-3">
                  <Smartphone className="w-5 h-5 text-blue-400" />
                  <div>
                    <p className="text-white font-medium">Multi-Factor Authentication</p>
                    <p className="text-gray-400 text-sm">Require 2FA for admin accounts</p>
                  </div>
                </div>
                <Switch
                  checked={settings.mfaEnabled}
                  onCheckedChange={(checked) => setSettings({...settings, mfaEnabled: checked})}
                />
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <Button
                onClick={() => handleSave('security')}
                className="bg-[#00B4D8] hover:bg-[#00B4D8]/80 text-black"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Security Settings
              </Button>
              <Button
                variant="outline"
                onClick={() => handleReset('security')}
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset to Defaults
              </Button>
            </div>
          </Card>
        </TabsContent>

        {/* Data Management Tab */}
        <TabsContent value="data" className="space-y-6">
          <Card className="bg-[#1A1A1A] border-gray-700 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Database className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white">Data Management & Privacy</h3>
                <p className="text-gray-400">Configure data retention, backups, and privacy settings</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="dataRetention" className="text-gray-300">Data Retention Period (days)</Label>
                <Input
                  id="dataRetention"
                  type="number"
                  value={settings.dataRetention}
                  onChange={(e) => setSettings({...settings, dataRetention: e.target.value})}
                  className="bg-[#0B0C10] border-gray-600 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="backupFrequency" className="text-gray-300">Backup Frequency</Label>
                <Select value={settings.backupFrequency} onValueChange={(value) => setSettings({...settings, backupFrequency: value})}>
                  <SelectTrigger className="bg-[#0B0C10] border-gray-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1A1A1A] border-gray-600">
                    <SelectItem value="hourly">Hourly</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between p-4 bg-[#0B0C10] rounded-lg border border-gray-600 md:col-span-2">
                <div className="flex items-center gap-3">
                  <Lock className="w-5 h-5 text-green-400" />
                  <div>
                    <p className="text-white font-medium">Data Anonymization</p>
                    <p className="text-gray-400 text-sm">Automatically anonymize personal data after retention period</p>
                  </div>
                </div>
                <Switch
                  checked={settings.anonymizeData}
                  onCheckedChange={(checked) => setSettings({...settings, anonymizeData: checked})}
                />
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <Button
                onClick={() => handleSave('data')}
                className="bg-[#00B4D8] hover:bg-[#00B4D8]/80 text-black"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Data Settings
              </Button>
              <Button
                variant="outline"
                onClick={() => handleReset('data')}
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset to Defaults
              </Button>
            </div>
          </Card>
        </TabsContent>

        {/* AI Models Tab */}
        <TabsContent value="ai" className="space-y-6">
          <Card className="bg-[#1A1A1A] border-gray-700 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <Brain className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white">AI Models & Retraining</h3>
                <p className="text-gray-400">Manage fatigue detection and dashcam AI models</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="modelVersion" className="text-gray-300">Current Model Version</Label>
                <div className="p-3 bg-[#0B0C10] border border-gray-600 rounded-lg">
                  <p className="text-white font-mono">{settings.modelVersion}</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="retrainThreshold" className="text-gray-300">Retraining Accuracy Threshold</Label>
                <Input
                  id="retrainThreshold"
                  type="number"
                  step="0.01"
                  min="0"
                  max="1"
                  value={settings.retrainThreshold}
                  onChange={(e) => setSettings({...settings, retrainThreshold: e.target.value})}
                  className="bg-[#0B0C10] border-gray-600 text-white"
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-[#0B0C10] rounded-lg border border-gray-600 md:col-span-2">
                <div className="flex items-center gap-3">
                  <Zap className="w-5 h-5 text-yellow-400" />
                  <div>
                    <p className="text-white font-medium">Automatic Model Retraining</p>
                    <p className="text-gray-400 text-sm">Automatically retrain models when accuracy drops below threshold</p>
                  </div>
                </div>
                <Switch
                  checked={settings.autoRetrain}
                  onCheckedChange={(checked) => setSettings({...settings, autoRetrain: checked})}
                />
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <Button
                onClick={() => handleSave('ai')}
                className="bg-[#00B4D8] hover:bg-[#00B4D8]/80 text-black"
              >
                <Save className="w-4 h-4 mr-2" />
                Save AI Settings
              </Button>
              <Button className="bg-green-600 hover:bg-green-700 text-white">
                <Brain className="w-4 h-4 mr-2" />
                Trigger Manual Retraining
              </Button>
              <Button
                variant="outline"
                onClick={() => handleReset('ai')}
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset to Defaults
              </Button>
            </div>
          </Card>
        </TabsContent>

        {/* Integrations Tab */}
        <TabsContent value="integrations" className="space-y-6">
          <Card className="bg-[#1A1A1A] border-gray-700 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-cyan-500/20 rounded-lg">
                <Cloud className="w-6 h-6 text-cyan-400" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white">API Integrations & Services</h3>
                <p className="text-gray-400">Configure external service connections and API keys</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="vertexAiKey" className="text-gray-300 flex items-center gap-2">
                  <Key className="w-4 h-4" />
                  Vertex AI API Key
                </Label>
                <Input
                  id="vertexAiKey"
                  type="password"
                  placeholder="Enter Vertex AI API key"
                  value={settings.vertexAiKey}
                  onChange={(e) => setSettings({...settings, vertexAiKey: e.target.value})}
                  className="bg-[#0B0C10] border-gray-600 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ragEngineUrl" className="text-gray-300 flex items-center gap-2">
                  <Server className="w-4 h-4" />
                  RAG Engine URL
                </Label>
                <Input
                  id="ragEngineUrl"
                  placeholder="https://rag-engine.safeyatra.com"
                  value={settings.ragEngineUrl}
                  onChange={(e) => setSettings({...settings, ragEngineUrl: e.target.value})}
                  className="bg-[#0B0C10] border-gray-600 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="webhookUrl" className="text-gray-300 flex items-center gap-2">
                  <Cloud className="w-4 h-4" />
                  Webhook URL (Optional)
                </Label>
                <Input
                  id="webhookUrl"
                  placeholder="https://webhook.example.com/alerts"
                  value={settings.webhookUrl}
                  onChange={(e) => setSettings({...settings, webhookUrl: e.target.value})}
                  className="bg-[#0B0C10] border-gray-600 text-white"
                />
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <Button
                onClick={() => handleSave('integrations')}
                className="bg-[#00B4D8] hover:bg-[#00B4D8]/80 text-black"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Integration Settings
              </Button>
              <Button
                variant="outline"
                onClick={() => handleReset('integrations')}
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset to Defaults
              </Button>
            </div>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6">
          <Card className="bg-[#1A1A1A] border-gray-700 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-orange-500/20 rounded-lg">
                <Bell className="w-6 h-6 text-orange-400" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white">Notification Preferences</h3>
                <p className="text-gray-400">Configure alerts and notification settings</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="alertEmail" className="text-gray-300 flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Alert Email Address
                </Label>
                <Input
                  id="alertEmail"
                  type="email"
                  value={settings.alertEmail}
                  onChange={(e) => setSettings({...settings, alertEmail: e.target.value})}
                  className="bg-[#0B0C10] border-gray-600 text-white"
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-[#0B0C10] rounded-lg border border-gray-600">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-blue-400" />
                  <div>
                    <p className="text-white font-medium">Email Alerts</p>
                    <p className="text-gray-400 text-sm">Send email notifications for critical system events</p>
                  </div>
                </div>
                <Switch
                  checked={settings.emailAlerts}
                  onCheckedChange={(checked) => setSettings({...settings, emailAlerts: checked})}
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-[#0B0C10] rounded-lg border border-gray-600">
                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5 text-green-400" />
                  <div>
                    <p className="text-white font-medium">System Notifications</p>
                    <p className="text-gray-400 text-sm">Show in-app notifications for system events</p>
                  </div>
                </div>
                <Switch
                  checked={settings.systemAlerts}
                  onCheckedChange={(checked) => setSettings({...settings, systemAlerts: checked})}
                />
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <Button
                onClick={() => handleSave('notifications')}
                className="bg-[#00B4D8] hover:bg-[#00B4D8]/80 text-black"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Notification Settings
              </Button>
              <Button
                variant="outline"
                onClick={() => handleReset('notifications')}
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset to Defaults
              </Button>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Version Info Panel */}
      <Card className="bg-[#1A1A1A] border-gray-700 p-6">
        <div className="flex items-center gap-3 mb-4">
          <Info className="w-5 h-5 text-[#00B4D8]" />
          <h3 className="text-lg font-semibold text-white">System Information</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-gray-400">System Version</p>
            <p className="text-white font-mono">v2.1.0</p>
          </div>
          <div>
            <p className="text-gray-400">AI Model Version</p>
            <p className="text-white font-mono">{settings.modelVersion}</p>
          </div>
          <div>
            <p className="text-gray-400">Database Version</p>
            <p className="text-white font-mono">PostgreSQL 15.3</p>
          </div>
        </div>
      </Card>


    </div>
  );
};

export default AdminSettings;
