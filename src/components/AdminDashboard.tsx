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

export function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    sessions: true,
    advice: true,
    contact: true,
    analytics: false
  });
  const [dashboardData, setDashboardData] = useState<{
    statistics: DashboardStats;
    recentSessions: UserSession[];
    easterEggStats: EasterEggStat[];
  } | null>(null);
  const [groomAdvice, setGroomAdvice] = useState<GroomAdvice[]>([]);
  const [contactInfo, setContactInfo] = useState<ContactInfo[]>([]);
  const [analyticsEvents, setAnalyticsEvents] = useState<AnalyticsEvent[]>([]);

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

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

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
    <div className="admin-dashboard-container bg-black text-green-400 min-h-screen">
      <div className="max-w-7xl mx-auto p-4 max-h-screen overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-green-400">
            🕵️ Mission Groomsmen Dashboard
          </h1>
          <Button onClick={logout} className="bg-red-600 hover:bg-red-700 text-white">
            Logout
          </Button>
        </div>

        {dashboardData && (
          <div className="space-y-6">
            {/* Statistics Overview */}
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

            {/* User Sessions */}
            <Card className="bg-gray-900 border-green-500">
              <div className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <Button
                    onClick={() => toggleSection('sessions')}
                    className="flex items-center gap-2 bg-transparent hover:bg-gray-800 text-green-400"
                  >
                    <span className={`transform transition-transform ${expandedSections.sessions ? 'rotate-90' : ''}`}>
                      ▶
                    </span>
                    <h2 className="text-xl font-bold">👥 User Sessions ({dashboardData.recentSessions.length})</h2>
                  </Button>
                  <div className="flex space-x-2">
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
                
                {expandedSections.sessions && (
                  <div className="overflow-x-auto max-h-96 overflow-y-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-green-500">
                          <th className="text-left p-2 text-green-400">Name</th>
                          <th className="text-left p-2 text-green-400">Status</th>
                          <th className="text-left p-2 text-green-400">Game State</th>
                          <th className="text-left p-2 text-green-400">Started</th>
                          <th className="text-left p-2 text-green-400">Completed</th>
                          <th className="text-center p-2 text-green-400">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dashboardData.recentSessions
                          .filter(session => 
                            (filterStatus === 'all' || 
                             (filterStatus === 'completed' && session.completed_mission) ||
                             (filterStatus === 'in-progress' && !session.completed_mission))
                          )
                          .map((session, index) => (
                            <tr key={index} className="border-b border-gray-700 hover:bg-gray-800">
                              <td className="p-2 font-semibold text-green-400">{session.user_name}</td>
                              <td className="p-2">
                                <span className={`px-2 py-1 rounded text-xs font-semibold ${
                                  session.completed_mission 
                                    ? 'bg-green-600 text-black' 
                                    : 'bg-yellow-600 text-black'
                                }`}>
                                  {session.completed_mission ? '✅ Complete' : '⏳ In Progress'}
                                </span>
                              </td>
                              <td className="p-2 text-gray-400">{session.game_state}</td>
                              <td className="p-2 text-gray-400">{formatDate(session.started_at)}</td>
                              <td className="p-2 text-gray-400">
                                {session.completed_at ? formatDate(session.completed_at) : '-'}
                              </td>
                              <td className="p-2 text-center">
                                <Button
                                  size="sm"
                                  onClick={() => deleteSession(session.user_name)}
                                  className="bg-red-600 hover:bg-red-700 text-white"
                                >
                                  🗑️
                                </Button>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </Card>

            {/* Groom Advice */}
            <Card className="bg-gray-900 border-green-500">
              <div className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <Button
                    onClick={() => toggleSection('advice')}
                    className="flex items-center gap-2 bg-transparent hover:bg-gray-800 text-green-400"
                  >
                    <span className={`transform transition-transform ${expandedSections.advice ? 'rotate-90' : ''}`}>
                      ▶
                    </span>
                    <h2 className="text-xl font-bold">💬 Groom Advice & Stories ({groomAdvice.length})</h2>
                  </Button>
                </div>
                
                {expandedSections.advice && (
                  <div className="overflow-x-auto max-h-96 overflow-y-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-green-500">
                          <th className="text-left p-2 text-green-400">Name</th>
                          <th className="text-left p-2 text-green-400">Advice</th>
                          <th className="text-left p-2 text-green-400">Status</th>
                          <th className="text-left p-2 text-green-400">Submitted</th>
                        </tr>
                      </thead>
                      <tbody>
                        {groomAdvice.length > 0 ? (
                          groomAdvice.map((advice, index) => (
                            <tr key={index} className="border-b border-gray-700 hover:bg-gray-800">
                              <td className="p-2 font-semibold text-green-400">{advice.user_name}</td>
                              <td className="p-2 text-gray-200 max-w-md">
                                <div className="truncate">
                                  {advice.advice_text.length > 100 
                                    ? `${advice.advice_text.substring(0, 100)}...` 
                                    : advice.advice_text}
                                </div>
                              </td>
                              <td className="p-2">
                                <span className={`px-2 py-1 rounded text-xs font-semibold ${
                                  advice.completed_mission 
                                    ? 'bg-green-600 text-black' 
                                    : 'bg-yellow-600 text-black'
                                }`}>
                                  {advice.completed_mission ? '✅ Complete' : '⏳ In Progress'}
                                </span>
                              </td>
                              <td className="p-2 text-gray-400">{formatDate(advice.submitted_at)}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={4} className="text-gray-400 text-center py-8">
                              No advice submitted yet
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </Card>

            {/* Contact Information */}
            <Card className="bg-gray-900 border-green-500">
              <div className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <Button
                    onClick={() => toggleSection('contact')}
                    className="flex items-center gap-2 bg-transparent hover:bg-gray-800 text-green-400"
                  >
                    <span className={`transform transition-transform ${expandedSections.contact ? 'rotate-90' : ''}`}>
                      ▶
                    </span>
                    <h2 className="text-xl font-bold">📧 Contact Information ({contactInfo.length})</h2>
                  </Button>
                </div>
                
                {expandedSections.contact && (
                  <div className="overflow-x-auto max-h-96 overflow-y-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-green-500">
                          <th className="text-left p-2 text-green-400">Name</th>
                          <th className="text-left p-2 text-green-400">Email</th>
                          <th className="text-left p-2 text-green-400">Address</th>
                          <th className="text-left p-2 text-green-400">Email Collected</th>
                          <th className="text-left p-2 text-green-400">Address Collected</th>
                        </tr>
                      </thead>
                      <tbody>
                        {contactInfo.length > 0 ? (
                          contactInfo.map((contact, index) => (
                            <tr key={index} className="border-b border-gray-700 hover:bg-gray-800">
                              <td className="p-2 font-semibold text-blue-400">{contact.user_name}</td>
                              <td className="p-2 text-gray-200">
                                {contact.email_address || 'Not provided'}
                              </td>
                              <td className="p-2 text-gray-200 max-w-md">
                                <div className="truncate">
                                  {contact.mailing_address || 'Not provided'}
                                </div>
                              </td>
                              <td className="p-2 text-gray-400">
                                {contact.email_collected_at ? formatDate(contact.email_collected_at) : '-'}
                              </td>
                              <td className="p-2 text-gray-400">
                                {contact.address_collected_at ? formatDate(contact.address_collected_at) : '-'}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={5} className="text-gray-400 text-center py-8">
                              No contact information collected yet
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </Card>

            {/* Analytics & Easter Eggs */}
            <Card className="bg-gray-900 border-green-500">
              <div className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <Button
                    onClick={() => toggleSection('analytics')}
                    className="flex items-center gap-2 bg-transparent hover:bg-gray-800 text-green-400"
                  >
                    <span className={`transform transition-transform ${expandedSections.analytics ? 'rotate-90' : ''}`}>
                      ▶
                    </span>
                    <h2 className="text-xl font-bold">📈 Analytics & Easter Eggs ({analyticsEvents.length + dashboardData.easterEggStats.length})</h2>
                  </Button>
                </div>
                
                {expandedSections.analytics && (
                  <div className="space-y-4">
                    {/* Analytics Events Table */}
                    <div>
                      <h3 className="text-lg font-semibold mb-2 text-green-400">📊 Analytics Events</h3>
                      <div className="overflow-x-auto max-h-64 overflow-y-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b border-green-500">
                              <th className="text-left p-2 text-green-400">Event Type</th>
                              <th className="text-left p-2 text-green-400">Count</th>
                              <th className="text-left p-2 text-green-400">Last Occurrence</th>
                            </tr>
                          </thead>
                          <tbody>
                            {analyticsEvents.map((event, index) => (
                              <tr key={index} className="border-b border-gray-700 hover:bg-gray-800">
                                <td className="p-2 text-green-400 font-medium">
                                  {event.event_type.replace(/_/g, ' ').toUpperCase()}
                                </td>
                                <td className="p-2 text-green-400 font-bold">{event.count}</td>
                                <td className="p-2 text-gray-400">{formatDate(event.last_occurrence)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Easter Eggs Table */}
                    <div>
                      <h3 className="text-lg font-semibold mb-2 text-yellow-400">🎬 Easter Egg Discoveries</h3>
                      <div className="overflow-x-auto max-h-64 overflow-y-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b border-yellow-500">
                              <th className="text-left p-2 text-yellow-400">Easter Egg</th>
                              <th className="text-left p-2 text-yellow-400">Discoveries</th>
                            </tr>
                          </thead>
                          <tbody>
                            {dashboardData.easterEggStats.length > 0 ? (
                              dashboardData.easterEggStats.map((stat, index) => (
                                <tr key={index} className="border-b border-gray-700 hover:bg-gray-800">
                                  <td className="p-2 text-yellow-400 font-medium capitalize">
                                    {stat.event_type.replace('easter_egg_', '').replace('_', ' ')}
                                  </td>
                                  <td className="p-2 text-yellow-400 font-bold">{stat.count}</td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan={2} className="text-gray-400 text-center py-4">
                                  No easter eggs discovered yet
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}