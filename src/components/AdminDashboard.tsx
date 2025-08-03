import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

interface DashboardStats {
  totalSessions: number;
  completedMissions: number;
  completionRate: string;
  totalAdvice: number;
}

interface UserSession {
  user_name: string;
  game_state: string;
  completed_mission: boolean;
  started_at: string;
  completed_at: string | null;
}

interface GroomAdvice {
  user_name: string;
  advice_text: string;
  submitted_at: string;
  completed_mission: boolean;
}

interface ContactInfo {
  user_name: string;
  email_address: string | null;
  mailing_address: string | null;
  email_collected_at: string | null;
  address_collected_at: string | null;
}

interface EasterEggStat {
  event_type: string;
  count: number;
}

interface AnalyticsEvent {
  event_type: string;
  count: number;
  last_occurrence: string;
}

interface SystemConfig {
  groomsmenNames: string[];
  easterEggsEnabled: boolean;
  contactCollectionEnabled: boolean;
  adviceCollectionEnabled: boolean;
}

export function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [dashboardData, setDashboardData] = useState<{
    statistics: DashboardStats;
    recentSessions: UserSession[];
    easterEggStats: EasterEggStat[];
  } | null>(null);
  const [groomAdvice, setGroomAdvice] = useState<GroomAdvice[]>([]);
  const [contactInfo, setContactInfo] = useState<ContactInfo[]>([]);
  const [analyticsEvents, setAnalyticsEvents] = useState<AnalyticsEvent[]>([]);
  const [systemConfig, setSystemConfig] = useState<SystemConfig>({
    groomsmenNames: [],
    easterEggsEnabled: true,
    contactCollectionEnabled: true,
    adviceCollectionEnabled: true,
  });
  const [exportFormat, setExportFormat] = useState('csv');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const baseUrl = process.env.NODE_ENV === 'production' 
    ? 'https://mission-groomsmen-api.reese-wedding.workers.dev' 
    : 'http://127.0.0.1:8787';

  const authenticate = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${baseUrl}/api/admin/dashboard`, {
        headers: {
          'Authorization': `Bearer ${password}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setDashboardData(data);
        setIsAuthenticated(true);
        localStorage.setItem('admin_token', password);
        await loadAllData();
      } else {
        setError('Invalid password');
      }
    } catch (err) {
      setError('Failed to connect to server');
    }

    setLoading(false);
  };

  const loadAllData = async () => {
    await Promise.all([
      loadGroomAdvice(),
      loadContactInfo(),
      loadAnalyticsEvents(),
      loadSystemConfig(),
    ]);
  };

  const loadGroomAdvice = async () => {
    try {
      const response = await fetch(`${baseUrl}/api/admin/advice`, {
        headers: {
          'Authorization': `Bearer ${password}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setGroomAdvice(data.advice || []);
      }
    } catch (err) {
      console.error('Failed to load groom advice:', err);
    }
  };

  const loadContactInfo = async () => {
    try {
      const response = await fetch(`${baseUrl}/api/admin/contact-info`, {
        headers: {
          'Authorization': `Bearer ${password}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setContactInfo(data.contactInfo || []);
      }
    } catch (err) {
      console.error('Failed to load contact info:', err);
    }
  };

  const loadAnalyticsEvents = async () => {
    try {
      const response = await fetch(`${baseUrl}/api/admin/analytics`, {
        headers: {
          'Authorization': `Bearer ${password}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setAnalyticsEvents(data.events || []);
      }
    } catch (err) {
      console.error('Failed to load analytics events:', err);
    }
  };

  const loadSystemConfig = async () => {
    try {
      const response = await fetch(`${baseUrl}/api/admin/config`, {
        headers: {
          'Authorization': `Bearer ${password}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setSystemConfig(data.config || systemConfig);
      }
    } catch (err) {
      console.error('Failed to load system config:', err);
    }
  };

  const updateSystemConfig = async (config: Partial<SystemConfig>) => {
    try {
      const response = await fetch(`${baseUrl}/api/admin/config`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${password}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(config),
      });

      if (response.ok) {
        await loadSystemConfig();
      }
    } catch (err) {
      console.error('Failed to update system config:', err);
    }
  };

  const exportData = async (type: string) => {
    try {
      const response = await fetch(`${baseUrl}/api/admin/export/${type}`, {
        headers: {
          'Authorization': `Bearer ${password}`,
        },
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `mission-groomsmen-${type}-${new Date().toISOString().split('T')[0]}.${exportFormat}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (err) {
      console.error('Failed to export data:', err);
    }
  };

  const deleteSession = async (sessionId: string) => {
    if (!confirm('Are you sure you want to delete this session? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`${baseUrl}/api/admin/sessions/${sessionId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${password}`,
        },
      });

      if (response.ok) {
        await loadAllData();
      }
    } catch (err) {
      console.error('Failed to delete session:', err);
    }
  };

  const approveAdvice = async (adviceId: string, approved: boolean) => {
    try {
      const response = await fetch(`${baseUrl}/api/admin/advice/${adviceId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${password}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ approved }),
      });

      if (response.ok) {
        await loadGroomAdvice();
      }
    } catch (err) {
      console.error('Failed to update advice approval:', err);
    }
  };

  // Try to restore session
  useEffect(() => {
    const savedToken = localStorage.getItem('admin_token');
    if (savedToken) {
      setPassword(savedToken);
      // Auto-authenticate with saved token
      setTimeout(() => {
        const button = document.querySelector('[data-auth-button]') as HTMLButtonElement;
        if (button) button.click();
      }, 100);
    }
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const logout = () => {
    setIsAuthenticated(false);
    setPassword('');
    setDashboardData(null);
    setGroomAdvice([]);
    setContactInfo([]);
    setAnalyticsEvents([]);
    localStorage.removeItem('admin_token');
  };

  const filteredAdvice = groomAdvice.filter(advice =>
    advice.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    advice.advice_text.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredContactInfo = contactInfo.filter(contact =>
    contact.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (contact.email_address && contact.email_address.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (contact.mailing_address && contact.mailing_address.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (!isAuthenticated) {
    return (
      <div className="admin-dashboard-container bg-black text-green-400 p-4">
        <div className="max-w-md mx-auto mt-20">
          <Card className="bg-gray-900 border-green-500">
            <div className="p-6">
              <h1 className="text-2xl font-bold mb-6 text-green-400">
                🕵️ Mission Groomsmen Admin
              </h1>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="password" className="text-green-400">
                    Admin Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && authenticate()}
                    className="bg-gray-800 border-green-500 text-green-400"
                    placeholder="Enter admin password..."
                  />
                </div>

                {error && (
                  <div className="text-red-400 text-sm">
                    ❌ {error}
                  </div>
                )}

                <Button
                  data-auth-button
                  onClick={authenticate}
                  disabled={loading || !password}
                  className="w-full bg-green-600 hover:bg-green-700 text-black"
                >
                  {loading ? 'Authenticating...' : 'Access Dashboard'}
                </Button>
                
                <Button 
                  onClick={() => window.location.href = '/'} 
                  className="w-full bg-gray-600 hover:bg-gray-700 text-white"
                >
                  ← Back to App
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard-container bg-black text-green-400 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-green-400">
            🕵️ Mission Groomsmen Dashboard
          </h1>
          <Button onClick={logout} className="bg-red-600 hover:bg-red-700 text-white">
            Logout
          </Button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-2 mb-6 border-b border-green-500">
          {[
            { id: 'overview', label: '📊 Overview', icon: '📊' },
            { id: 'sessions', label: '👥 Sessions', icon: '👥' },
            { id: 'advice', label: '💬 Advice', icon: '💬' },
            { id: 'contact', label: '📧 Contact Info', icon: '📧' },
            { id: 'analytics', label: '📈 Analytics', icon: '📈' },
            { id: 'easter-eggs', label: '🥚 Easter Eggs', icon: '🥚' },
            { id: 'config', label: '⚙️ Configuration', icon: '⚙️' },
            { id: 'export', label: '📤 Export', icon: '📤' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-t-lg transition-colors ${
                activeTab === tab.id
                  ? 'bg-green-600 text-black font-semibold'
                  : 'bg-gray-800 text-green-400 hover:bg-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {dashboardData && (
          <>
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Card className="bg-gray-900 border-green-500">
                    <div className="p-4 text-center">
                      <div className="text-2xl font-bold text-green-400">
                        {dashboardData.statistics.totalSessions}
                      </div>
                      <div className="text-sm text-gray-400">Total Sessions</div>
                    </div>
                  </Card>

                  <Card className="bg-gray-900 border-green-500">
                    <div className="p-4 text-center">
                      <div className="text-2xl font-bold text-green-400">
                        {dashboardData.statistics.completedMissions}
                      </div>
                      <div className="text-sm text-gray-400">Completed Missions</div>
                    </div>
                  </Card>

                  <Card className="bg-gray-900 border-green-500">
                    <div className="p-4 text-center">
                      <div className="text-2xl font-bold text-green-400">
                        {dashboardData.statistics.completionRate}%
                      </div>
                      <div className="text-sm text-gray-400">Completion Rate</div>
                    </div>
                  </Card>

                  <Card className="bg-gray-900 border-green-500">
                    <div className="p-4 text-center">
                      <div className="text-2xl font-bold text-green-400">
                        {dashboardData.statistics.totalAdvice}
                      </div>
                      <div className="text-sm text-gray-400">Advice Submitted</div>
                    </div>
                  </Card>
                </div>

                {/* Quick Actions */}
                <Card className="bg-gray-900 border-green-500">
                  <div className="p-6">
                    <h2 className="text-xl font-bold mb-4 text-green-400">
                      🚀 Quick Actions
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <Button
                        onClick={() => exportData('sessions')}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        📊 Export Sessions
                      </Button>
                      <Button
                        onClick={() => exportData('advice')}
                        className="bg-purple-600 hover:bg-purple-700 text-white"
                      >
                        💬 Export Advice
                      </Button>
                      <Button
                        onClick={() => exportData('contact')}
                        className="bg-orange-600 hover:bg-orange-700 text-white"
                      >
                        📧 Export Contacts
                      </Button>
                      <Button
                        onClick={() => setActiveTab('config')}
                        className="bg-gray-600 hover:bg-gray-700 text-white"
                      >
                        ⚙️ System Config
                      </Button>
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {/* Sessions Tab */}
            {activeTab === 'sessions' && (
              <Card className="bg-gray-900 border-green-500">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-green-400">
                      👥 User Sessions
                    </h2>
                    <div className="flex space-x-2">
                      <Input
                        placeholder="Search sessions..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="bg-gray-800 border-green-500 text-green-400 w-64"
                      />
                      <Select value={filterStatus} onValueChange={setFilterStatus}>
                        <SelectTrigger className="w-32 bg-gray-800 border-green-500 text-green-400">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="in-progress">In Progress</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {dashboardData.recentSessions
                      .filter(session => 
                        session.user_name.toLowerCase().includes(searchTerm.toLowerCase()) &&
                        (filterStatus === 'all' || 
                         (filterStatus === 'completed' && session.completed_mission) ||
                         (filterStatus === 'in-progress' && !session.completed_mission))
                      )
                      .map((session, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center p-3 bg-gray-800 rounded border-l-4 border-green-500"
                        >
                          <div className="flex-1">
                            <div className="font-semibold text-green-400">{session.user_name}</div>
                            <div className="text-sm text-gray-400">{session.game_state}</div>
                            <div className="text-xs text-gray-500">
                              Started: {formatDate(session.started_at)}
                              {session.completed_at && ` | Completed: ${formatDate(session.completed_at)}`}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className={`px-2 py-1 rounded text-xs font-semibold ${
                              session.completed_mission 
                                ? 'bg-green-600 text-black' 
                                : 'bg-yellow-600 text-black'
                            }`}>
                              {session.completed_mission ? '✅ Complete' : '⏳ In Progress'}
                            </div>
                            <Button
                              size="sm"
                              onClick={() => deleteSession(session.user_name)}
                              className="bg-red-600 hover:bg-red-700 text-white"
                            >
                              🗑️
                            </Button>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </Card>
            )}

            {/* Advice Tab */}
            {activeTab === 'advice' && (
              <Card className="bg-gray-900 border-green-500">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-green-400">
                      💬 Groom Advice & Stories
                    </h2>
                    <Input
                      placeholder="Search advice..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="bg-gray-800 border-green-500 text-green-400 w-64"
                    />
                  </div>
                  
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {filteredAdvice.length > 0 ? (
                      filteredAdvice.map((advice, index) => (
                        <div
                          key={index}
                          className="p-4 bg-gray-800 rounded border-l-4 border-green-500"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div className="font-semibold text-green-400">
                              {advice.user_name}
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="text-sm text-gray-400">
                                {formatDate(advice.submitted_at)}
                              </div>
                              <div className={`px-2 py-1 rounded text-xs font-semibold ${
                                advice.completed_mission 
                                  ? 'bg-green-600 text-black' 
                                  : 'bg-yellow-600 text-black'
                              }`}>
                                {advice.completed_mission ? '✅ Complete' : '⏳ In Progress'}
                              </div>
                            </div>
                          </div>
                          <div className="text-gray-200 whitespace-pre-wrap mb-3">
                            {advice.advice_text}
                          </div>
                          <div className="flex justify-end space-x-2">
                            <Button
                              size="sm"
                              onClick={() => approveAdvice(advice.user_name, true)}
                              className="bg-green-600 hover:bg-green-700 text-black"
                            >
                              ✅ Approve
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => approveAdvice(advice.user_name, false)}
                              className="bg-red-600 hover:bg-red-700 text-white"
                            >
                              ❌ Reject
                            </Button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-gray-400 text-center py-8">
                        {searchTerm ? 'No advice matching your search' : 'No advice submitted yet'}
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            )}

            {/* Contact Info Tab */}
            {activeTab === 'contact' && (
              <Card className="bg-gray-900 border-green-500">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-green-400">
                      📧 Contact Information
                    </h2>
                    <Input
                      placeholder="Search contacts..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="bg-gray-800 border-green-500 text-green-400 w-64"
                    />
                  </div>
                  
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {filteredContactInfo.length > 0 ? (
                      filteredContactInfo.map((contact, index) => (
                        <div
                          key={index}
                          className="p-4 bg-gray-800 rounded border-l-4 border-blue-500"
                        >
                          <div className="flex justify-between items-start mb-3">
                            <div className="font-semibold text-blue-400">
                              {contact.user_name}
                            </div>
                            <div className="text-sm text-gray-400">
                              Last updated: {contact.email_collected_at || contact.address_collected_at ? 
                                formatDate(contact.email_collected_at || contact.address_collected_at!) : 
                                'No contact info collected'
                              }
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <div className="text-sm font-semibold text-gray-400 mb-1">
                                📧 Email Address
                              </div>
                              <div className="text-gray-200">
                                {contact.email_address || 'Not provided'}
                              </div>
                              {contact.email_collected_at && (
                                <div className="text-xs text-gray-500">
                                  Collected: {formatDate(contact.email_collected_at)}
                                </div>
                              )}
                            </div>
                            
                            <div>
                              <div className="text-sm font-semibold text-gray-400 mb-1">
                                📮 Mailing Address
                              </div>
                              <div className="text-gray-200">
                                {contact.mailing_address || 'Not provided'}
                              </div>
                              {contact.address_collected_at && (
                                <div className="text-xs text-gray-500">
                                  Collected: {formatDate(contact.address_collected_at)}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-gray-400 text-center py-8">
                        {searchTerm ? 'No contacts matching your search' : 'No contact information collected yet'}
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            )}

            {/* Analytics Tab */}
            {activeTab === 'analytics' && (
              <div className="space-y-6">
                <Card className="bg-gray-900 border-green-500">
                  <div className="p-6">
                    <h2 className="text-xl font-bold mb-4 text-green-400">
                      📈 Analytics Events
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {analyticsEvents.map((event, index) => (
                        <div
                          key={index}
                          className="p-4 bg-gray-800 rounded border border-green-500"
                        >
                          <div className="text-lg font-semibold text-green-400">
                            {event.event_type.replace(/_/g, ' ').toUpperCase()}
                          </div>
                          <div className="text-2xl font-bold text-green-400">
                            {event.count}
                          </div>
                          <div className="text-sm text-gray-400">
                            Last: {formatDate(event.last_occurrence)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {/* Easter Eggs Tab */}
            {activeTab === 'easter-eggs' && (
              <Card className="bg-gray-900 border-green-500">
                <div className="p-6">
                  <h2 className="text-xl font-bold mb-4 text-green-400">
                    🎬 Easter Egg Discoveries
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {dashboardData.easterEggStats.length > 0 ? (
                      dashboardData.easterEggStats.map((stat, index) => (
                        <div
                          key={index}
                          className="p-4 bg-gray-800 rounded border border-yellow-500"
                        >
                          <div className="text-lg font-semibold text-yellow-400 capitalize">
                            {stat.event_type.replace('easter_egg_', '').replace('_', ' ')}
                          </div>
                          <div className="text-2xl font-bold text-yellow-400">
                            {stat.count}
                          </div>
                          <div className="text-sm text-gray-400">
                            Discoveries
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-gray-400 text-center py-8 col-span-full">
                        No easter eggs discovered yet
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            )}

            {/* Configuration Tab */}
            {activeTab === 'config' && (
              <div className="space-y-6">
                <Card className="bg-gray-900 border-green-500">
                  <div className="p-6">
                    <h2 className="text-xl font-bold mb-4 text-green-400">
                      ⚙️ System Configuration
                    </h2>
                    
                    <div className="space-y-6">
                      {/* Feature Toggles */}
                      <div>
                        <h3 className="text-lg font-semibold mb-3 text-green-400">
                          🎛️ Feature Toggles
                        </h3>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between p-3 bg-gray-800 rounded">
                            <div>
                              <div className="font-semibold">Easter Eggs</div>
                              <div className="text-sm text-gray-400">Enable hidden features and easter eggs</div>
                            </div>
                            <Button
                              onClick={() => updateSystemConfig({ easterEggsEnabled: !systemConfig.easterEggsEnabled })}
                              className={systemConfig.easterEggsEnabled ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-600 hover:bg-gray-700'}
                            >
                              {systemConfig.easterEggsEnabled ? '✅ Enabled' : '❌ Disabled'}
                            </Button>
                          </div>
                          
                          <div className="flex items-center justify-between p-3 bg-gray-800 rounded">
                            <div>
                              <div className="font-semibold">Contact Collection</div>
                              <div className="text-sm text-gray-400">Allow users to provide email and address</div>
                            </div>
                            <Button
                              onClick={() => updateSystemConfig({ contactCollectionEnabled: !systemConfig.contactCollectionEnabled })}
                              className={systemConfig.contactCollectionEnabled ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-600 hover:bg-gray-700'}
                            >
                              {systemConfig.contactCollectionEnabled ? '✅ Enabled' : '❌ Disabled'}
                            </Button>
                          </div>
                          
                          <div className="flex items-center justify-between p-3 bg-gray-800 rounded">
                            <div>
                              <div className="font-semibold">Advice Collection</div>
                              <div className="text-sm text-gray-400">Allow users to submit groom advice</div>
                            </div>
                            <Button
                              onClick={() => updateSystemConfig({ adviceCollectionEnabled: !systemConfig.adviceCollectionEnabled })}
                              className={systemConfig.adviceCollectionEnabled ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-600 hover:bg-gray-700'}
                            >
                              {systemConfig.adviceCollectionEnabled ? '✅ Enabled' : '❌ Disabled'}
                            </Button>
                          </div>
                        </div>
                      </div>

                      {/* Groomsmen Management */}
                      <div>
                        <h3 className="text-lg font-semibold mb-3 text-green-400">
                          👥 Groomsmen Management
                        </h3>
                        <div className="space-y-2">
                          {systemConfig.groomsmenNames.map((name, index) => (
                            <div key={index} className="flex items-center justify-between p-2 bg-gray-800 rounded">
                              <span className="text-green-400">{name}</span>
                              <Button
                                size="sm"
                                onClick={() => {
                                  const newNames = systemConfig.groomsmenNames.filter((_, i) => i !== index);
                                  updateSystemConfig({ groomsmenNames: newNames });
                                }}
                                className="bg-red-600 hover:bg-red-700 text-white"
                              >
                                🗑️
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {/* Export Tab */}
            {activeTab === 'export' && (
              <Card className="bg-gray-900 border-green-500">
                <div className="p-6">
                  <h2 className="text-xl font-bold mb-4 text-green-400">
                    📤 Data Export
                  </h2>
                  
                  <div className="space-y-6">
                    <div>
                      <Label className="text-green-400 mb-2 block">Export Format</Label>
                      <Select value={exportFormat} onValueChange={setExportFormat}>
                        <SelectTrigger className="w-32 bg-gray-800 border-green-500 text-green-400">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="csv">CSV</SelectItem>
                          <SelectItem value="json">JSON</SelectItem>
                          <SelectItem value="xlsx">Excel</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Button
                        onClick={() => exportData('sessions')}
                        className="bg-blue-600 hover:bg-blue-700 text-white p-4"
                      >
                        <div className="text-center">
                          <div className="text-lg">📊</div>
                          <div className="font-semibold">Export Sessions</div>
                          <div className="text-sm opacity-75">User session data</div>
                        </div>
                      </Button>

                      <Button
                        onClick={() => exportData('advice')}
                        className="bg-purple-600 hover:bg-purple-700 text-white p-4"
                      >
                        <div className="text-center">
                          <div className="text-lg">💬</div>
                          <div className="font-semibold">Export Advice</div>
                          <div className="text-sm opacity-75">Groom advice submissions</div>
                        </div>
                      </Button>

                      <Button
                        onClick={() => exportData('contact')}
                        className="bg-orange-600 hover:bg-orange-700 text-white p-4"
                      >
                        <div className="text-center">
                          <div className="text-lg">📧</div>
                          <div className="font-semibold">Export Contacts</div>
                          <div className="text-sm opacity-75">Email and address data</div>
                        </div>
                      </Button>

                      <Button
                        onClick={() => exportData('analytics')}
                        className="bg-green-600 hover:bg-green-700 text-black p-4"
                      >
                        <div className="text-center">
                          <div className="text-lg">📈</div>
                          <div className="font-semibold">Export Analytics</div>
                          <div className="text-sm opacity-75">Event tracking data</div>
                        </div>
                      </Button>
                    </div>

                    <div className="mt-6 p-4 bg-gray-800 rounded">
                      <h3 className="font-semibold text-green-400 mb-2">📋 Export Summary</h3>
                      <div className="text-sm text-gray-400 space-y-1">
                        <div>• Sessions: {dashboardData.statistics.totalSessions} total</div>
                        <div>• Advice: {groomAdvice.length} submissions</div>
                        <div>• Contacts: {contactInfo.length} entries</div>
                        <div>• Analytics: {analyticsEvents.length} event types</div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  );
}