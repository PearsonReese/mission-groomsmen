import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

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

interface EasterEggStat {
  event_type: string;
  count: number;
}

export function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [dashboardData, setDashboardData] = useState<{
    statistics: DashboardStats;
    recentSessions: UserSession[];
    easterEggStats: EasterEggStat[];
  } | null>(null);
  const [groomAdvice, setGroomAdvice] = useState<GroomAdvice[]>([]);

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
        await loadGroomAdvice();
      } else {
        setError('Invalid password');
      }
    } catch (err) {
      setError('Failed to connect to server');
    }

    setLoading(false);
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
    localStorage.removeItem('admin_token');
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
    <div className="admin-dashboard-container bg-black text-green-400 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-green-400">
            🕵️ Mission Groomsmen Dashboard
          </h1>
          <Button onClick={logout} className="bg-red-600 hover:bg-red-700 text-white">
            Logout
          </Button>
        </div>

        {dashboardData && (
          <>
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
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

            {/* Recent Sessions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <Card className="bg-gray-900 border-green-500">
                <div className="p-6">
                  <h2 className="text-xl font-bold mb-4 text-green-400">
                    📊 Recent Sessions
                  </h2>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {dashboardData.recentSessions.map((session, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center p-2 bg-gray-800 rounded"
                      >
                        <div>
                          <div className="font-semibold">{session.user_name}</div>
                          <div className="text-sm text-gray-400">{session.game_state}</div>
                        </div>
                        <div className="text-right text-sm">
                          <div className={session.completed_mission ? 'text-green-400' : 'text-yellow-400'}>
                            {session.completed_mission ? '✅ Complete' : '⏳ In Progress'}
                          </div>
                          <div className="text-gray-400">
                            {formatDate(session.started_at)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>

              {/* Easter Egg Statistics */}
              <Card className="bg-gray-900 border-green-500">
                <div className="p-6">
                  <h2 className="text-xl font-bold mb-4 text-green-400">
                    🎬 Easter Egg Discoveries
                  </h2>
                  <div className="space-y-2">
                    {dashboardData.easterEggStats.length > 0 ? (
                      dashboardData.easterEggStats.map((stat, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center p-2 bg-gray-800 rounded"
                        >
                          <div className="capitalize">
                            {stat.event_type.replace('easter_egg_', '').replace('_', ' ')}
                          </div>
                          <div className="text-green-400 font-bold">
                            {stat.count}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-gray-400 text-center py-4">
                        No easter eggs discovered yet
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            </div>

            {/* Groom Advice */}
            <Card className="bg-gray-900 border-green-500">
              <div className="p-6">
                <h2 className="text-xl font-bold mb-4 text-green-400">
                  💬 Groom Advice & Stories
                </h2>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {groomAdvice.length > 0 ? (
                    groomAdvice.map((advice, index) => (
                      <div
                        key={index}
                        className="p-4 bg-gray-800 rounded border-l-4 border-green-500"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div className="font-semibold text-green-400">
                            {advice.user_name}
                          </div>
                          <div className="text-sm text-gray-400">
                            {formatDate(advice.submitted_at)}
                          </div>
                        </div>
                        <div className="text-gray-200 whitespace-pre-wrap">
                          {advice.advice_text}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-gray-400 text-center py-8">
                      No advice submitted yet
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}