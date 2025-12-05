import React, { useState, useEffect } from 'react';
import { Lock, Eye, EyeOff, Key, Search, Plus, Copy, Check, Sparkles } from 'lucide-react';

export default function PasswordManager() {
  const [view, setView] = useState('menu');
  const [passwords, setPasswords] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showPasswords, setShowPasswords] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [notification, setNotification] = useState('');

  // Form states
  const [newPassword, setNewPassword] = useState({
    site: '',
    username: '',
    password: ''
  });
  const [genLength, setGenLength] = useState(12);

  useEffect(() => {
    loadPasswords();
  }, []);

  const loadPasswords = async () => {
    try {
      const result = await window.storage.list('pwd:');
      if (result && result.keys) {
        const pwds = await Promise.all(
          result.keys.map(async (key) => {
            const data = await window.storage.get(key);
            return data ? JSON.parse(data.value) : null;
          })
        );
        setPasswords(pwds.filter(Boolean));
      }
    } catch (error) {
      console.log('No passwords yet');
      setPasswords([]);
    }
  };

  const savePassword = async () => {
    if (!newPassword.site || !newPassword.username || !newPassword.password) {
      showNotification('Please fill all fields!');
      return;
    }

    const id = Date.now();
    const pwd = { id, ...newPassword };
    
    try {
      await window.storage.set(`pwd:${id}`, JSON.stringify(pwd));
      await loadPasswords();
      setNewPassword({ site: '', username: '', password: '' });
      showNotification('Password saved successfully! ');
      setView('menu');
    } catch (error) {
      showNotification('Error saving password');
    }
  };

  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let pwd = '';
    for (let i = 0; i < genLength; i++) {
      pwd += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setNewPassword({ ...newPassword, password: pwd });
    showNotification('Password generated! ');
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    showNotification('Copied to clipboard! ');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 3000);
  };

  const filteredPasswords = passwords.filter(pwd =>
    pwd.site.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-8">
      <div className="max-w-4xl mx-auto">
        {notification && (
          <div className="fixed top-8 right-8 bg-white/90 backdrop-blur-lg rounded-2xl shadow-lg px-6 py-4 animate-pulse border-2 border-purple-200 z-50">
            <p className="text-purple-600 font-medium">{notification}</p>
          </div>
        )}

        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-block relative mb-4">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full blur-xl opacity-50 animate-pulse"></div>
            <Lock className="w-16 h-16 text-purple-600 relative" />
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 bg-clip-text text-transparent mb-2">
            Password Vault
          </h1>
          <p className="text-gray-600">Your secrets, safely stored </p>
        </div>

        {view === 'menu' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <MenuCard
              icon={<Plus className="w-8 h-8" />}
              title="Save Password"
              description="Store a new password securely"
              color="from-purple-400 to-purple-600"
              onClick={() => setView('add')}
            />
            <MenuCard
              icon={<Eye className="w-8 h-8" />}
              title="View Passwords"
              description="Browse all saved passwords"
              color="from-pink-400 to-pink-600"
              onClick={() => setView('view')}
            />
            <MenuCard
              icon={<Search className="w-8 h-8" />}
              title="Search"
              description="Find a specific password"
              color="from-blue-400 to-blue-600"
              onClick={() => setView('search')}
            />
            <MenuCard
              icon={<Sparkles className="w-8 h-8" />}
              title="Generate"
              description="Create a strong password"
              color="from-indigo-400 to-indigo-600"
              onClick={() => setView('generate')}
            />
          </div>
        )}

        {view === 'add' && (
          <div className="bg-white/60 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border-2 border-purple-200">
            <h2 className="text-3xl font-bold text-purple-600 mb-6 flex items-center gap-3">
              <Plus className="w-8 h-8" />
              Save New Password
            </h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Website (e.g., github.com)"
                value={newPassword.site}
                onChange={(e) => setNewPassword({ ...newPassword, site: e.target.value })}
                className="w-full px-6 py-4 rounded-2xl border-2 border-purple-200 focus:border-purple-400 focus:outline-none transition-all bg-white/50"
              />
              <input
                type="text"
                placeholder="Username or Email"
                value={newPassword.username}
                onChange={(e) => setNewPassword({ ...newPassword, username: e.target.value })}
                className="w-full px-6 py-4 rounded-2xl border-2 border-purple-200 focus:border-purple-400 focus:outline-none transition-all bg-white/50"
              />
              <input
                type="text"
                placeholder="Password"
                value={newPassword.password}
                onChange={(e) => setNewPassword({ ...newPassword, password: e.target.value })}
                className="w-full px-6 py-4 rounded-2xl border-2 border-purple-200 focus:border-purple-400 focus:outline-none transition-all bg-white/50"
              />
              <div className="flex gap-4">
                <button
                  onClick={savePassword}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105"
                >
                  Save Password
                </button>
                <button
                  onClick={() => setView('menu')}
                  className="px-8 bg-gray-200 text-gray-700 py-4 rounded-2xl font-semibold hover:bg-gray-300 transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {view === 'view' && (
          <div className="bg-white/60 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border-2 border-purple-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold text-purple-600 flex items-center gap-3">
                <Eye className="w-8 h-8" />
                Saved Passwords
              </h2>
              <button
                onClick={() => setShowPasswords(!showPasswords)}
                className="px-6 py-3 bg-purple-100 text-purple-600 rounded-xl hover:bg-purple-200 transition-all flex items-center gap-2"
              >
                {showPasswords ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                {showPasswords ? 'Hide' : 'Show'} All
              </button>
            </div>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {passwords.length === 0 ? (
                <p className="text-center text-gray-500 py-8">No passwords saved yet</p>
              ) : (
                passwords.map((pwd) => (
                  <PasswordCard
                    key={pwd.id}
                    password={pwd}
                    showPassword={showPasswords}
                    onCopy={copyToClipboard}
                    copiedId={copiedId}
                  />
                ))
              )}
            </div>
            <button
              onClick={() => setView('menu')}
              className="mt-6 w-full bg-gray-200 text-gray-700 py-4 rounded-2xl font-semibold hover:bg-gray-300 transition-all"
            >
              Back to Menu
            </button>
          </div>
        )}

        {view === 'search' && (
          <div className="bg-white/60 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border-2 border-purple-200">
            <h2 className="text-3xl font-bold text-purple-600 mb-6 flex items-center gap-3">
              <Search className="w-8 h-8" />
              Search Passwords
            </h2>
            <input
              type="text"
              placeholder="Search by website name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-6 py-4 rounded-2xl border-2 border-purple-200 focus:border-purple-400 focus:outline-none transition-all bg-white/50 mb-6"
            />
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {filteredPasswords.length === 0 ? (
                <p className="text-center text-gray-500 py-8">No matches found</p>
              ) : (
                filteredPasswords.map((pwd) => (
                  <PasswordCard
                    key={pwd.id}
                    password={pwd}
                    showPassword={true}
                    onCopy={copyToClipboard}
                    copiedId={copiedId}
                  />
                ))
              )}
            </div>
            <button
              onClick={() => { setView('menu'); setSearchQuery(''); }}
              className="mt-6 w-full bg-gray-200 text-gray-700 py-4 rounded-2xl font-semibold hover:bg-gray-300 transition-all"
            >
              Back to Menu
            </button>
          </div>
        )}

        {view === 'generate' && (
          <div className="bg-white/60 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border-2 border-purple-200">
            <h2 className="text-3xl font-bold text-purple-600 mb-6 flex items-center gap-3">
              <Sparkles className="w-8 h-8" />
              Generate Password
            </h2>
            <div className="space-y-6">
              <div>
                <label className="block text-gray-700 mb-2 font-medium">Password Length: {genLength}</label>
                <input
                  type="range"
                  min="8"
                  max="32"
                  value={genLength}
                  onChange={(e) => setGenLength(Number(e.target.value))}
                  className="w-full h-3 bg-purple-200 rounded-full appearance-none cursor-pointer"
                />
              </div>
              <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-6 rounded-2xl">
                <p className="text-2xl font-mono text-center break-all text-purple-800">
                  {newPassword.password || 'Click generate to create a password'}
                </p>
              </div>
              <button
                onClick={generatePassword}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105"
              >
                Generate Password 
              </button>
              {newPassword.password && (
                <button
                  onClick={() => copyToClipboard(newPassword.password, 'gen')}
                  className="w-full bg-blue-500 text-white py-4 rounded-2xl font-semibold hover:bg-blue-600 transition-all flex items-center justify-center gap-2"
                >
                  {copiedId === 'gen' ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                  {copiedId === 'gen' ? 'Copied!' : 'Copy Password'}
                </button>
              )}
              <button
                onClick={() => setView('menu')}
                className="w-full bg-gray-200 text-gray-700 py-4 rounded-2xl font-semibold hover:bg-gray-300 transition-all"
              >
                Back to Menu
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function MenuCard({ icon, title, description, color, onClick }) {
  return (
    <button
      onClick={onClick}
      className="bg-white/60 backdrop-blur-lg rounded-3xl shadow-xl p-8 border-2 border-purple-200 hover:shadow-2xl hover:scale-105 transition-all text-left group"
    >
      <div className={`inline-block p-4 bg-gradient-to-r ${color} rounded-2xl text-white mb-4 group-hover:scale-110 transition-all`}>
        {icon}
      </div>
      <h3 className="text-2xl font-bold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </button>
  );
}

function PasswordCard({ password, showPassword, onCopy, copiedId }) {
  return (
    <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border-2 border-purple-200 hover:shadow-lg transition-all">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Key className="w-5 h-5 text-purple-500" />
            <h3 className="text-xl font-bold text-gray-800">{password.site}</h3>
          </div>
          <p className="text-gray-600 mb-2">
            <span className="font-medium">Username:</span> {password.username}
          </p>
          <p className="text-gray-600 font-mono">
            <span className="font-medium font-sans">Password:</span>{' '}
            {showPassword ? password.password : '•'.repeat(password.password.length)}
          </p>
        </div>
        <button
          onClick={() => onCopy(password.password, password.id)}
          className="p-3 bg-purple-200 text-purple-600 rounded-xl hover:bg-purple-300 transition-all"
        >
          {copiedId === password.id ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
        </button>
      </div>
    </div>
  );

}
