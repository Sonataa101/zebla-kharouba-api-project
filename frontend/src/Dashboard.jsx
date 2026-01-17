import React, { useState, useEffect } from 'react';
import { Home, FileText, Target, Settings, Bell, Search, LogOut, Calendar, ChevronLeft, ChevronRight, Shield, Check, CreditCard } from 'lucide-react';
import './login.css';  // or whatever your CSS file is named
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import PromiseWorkflow from './promise'
import { apiFetch } from "./api/client";

const TaxDashboard = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authView, setAuthView] = useState('signin');
  const [activeSection, setActiveSection] = useState('dashboard');
  const [currentDate, setCurrentDate] = useState(new Date(2026, 0, 1));
  const [theme, setTheme] = useState('light');
  const [notifications, setNotifications] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [reports, setReports] = useState([]);
  const [payments, setPayments] = useState([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('EDINAR');
  const [idCardNumber, setIdCardNumber] = useState('');
  const [paymentError, setPaymentError] = useState('');
  const [error, setError] = useState(null);
  const [homeMessage, setHomeMessage] = useState('');
  // idk what this is for yet
  const [selectedPromise, setSelectedPromise] = useState(null);


  useEffect(() => {
    apiFetch("/")
      .then(setHomeMessage)
      .catch(() => setError("Failed to load home message"));

    apiFetch("/reports/my")
      .then(setReports)
      .catch(() => setError("Failed to load reports"));
    console.log("Fetched reports", reports);
  }, []);

const [taxCalculator, setTaxCalculator] = useState({
    surface: '',
    serviceCount: '',
    municipality: 'tunis',
    calculatedTax: null,
    showCalculator: true
  });
  const municipalitiesData = {
    "tunis": { ref_price: 340, T_percent: 0.14 },
    "ariana": { ref_price: 380, T_percent: 0.14 },
    "ben_arous": { ref_price: 300, T_percent: 0.14 },
    "manouba": { ref_price: 280, T_percent: 0.12 },
    "nabeul": { ref_price: 300, T_percent: 0.14 },
    "bizerte": { ref_price: 320, T_percent: 0.14 },
    "beja": { ref_price: 240, T_percent: 0.10 },
    "jendouba": { ref_price: 180, T_percent: 0.10 },
    "kef": { ref_price: 170, T_percent: 0.10 },
    "siliana": { ref_price: 180, T_percent: 0.10 },
    "sousse": { ref_price: 360, T_percent: 0.14 },
    "monastir": { ref_price: 330, T_percent: 0.14 },
    "mahdia": { ref_price: 280, T_percent: 0.12 },
    "kairouan": { ref_price: 180, T_percent: 0.10 },
    "kasserine": { ref_price: 150, T_percent: 0.10 },
    "sidi_bouzid": { ref_price: 160, T_percent: 0.10 },
    "sfax": { ref_price: 240, T_percent: 0.14 },
    "gabes": { ref_price: 200, T_percent: 0.10 },
    "medenine": { ref_price: 200, T_percent: 0.10 },
    "tataouine": { ref_price: 150, T_percent: 0.08 },
    "tozeur": { ref_price: 210, T_percent: 0.12 },
    "kebili": { ref_price: 170, T_percent: 0.10 },
    "gafsa": { ref_price: 220, T_percent: 0.10 }
  };

  const menuItems = [
    { id: 'dashboard', icon: Home, label: 'Dashboard' },
    { id: 'logs', icon: FileText, label: 'Logs' },
    { id: 'promise', icon: Target, label: 'Promise' },
    { id: 'payment', icon: CreditCard, label: 'Payment' },
    { id: 'options', icon: Settings, label: 'Options' }
  ];
 
  const handleSignIn = () => {
    if (email && password) {
      setIsAuthenticated(true);
    }
  };

  const handleSignUp = () => {
    if (email && password) {
      setIsAuthenticated(true);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setAuthView('signin');
    setEmail('');
    setPassword('');
  };
    const handlePayment = () => {
    if (!idCardNumber) {
      setPaymentError('Please enter your ID Card Number');
      return;
    }
const paymentAmount = taxCalculator.calculatedTax?.final_tax || 150.00;
    const newPayment = {
      payment_id: `PAY-${Date.now()}`,
      amount: {paymentAmount},
      municipality: taxCalculator.municipality.charAt(0).toUpperCase() + taxCalculator.municipality.slice(1),      
        reference_id: 'TAX-BILL-2026-XYZ',
      channel: selectedPaymentMethod,
      status: 'PAID',
      paid_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      id_card: idCardNumber
    };

    setPayments([newPayment, ...payments]);
    setIdCardNumber('');
    setPaymentError('');
    
    setTaxCalculator({
      surface: '',
      serviceCount: '',
      municipality: 'tunis',
      calculatedTax: null,
      showCalculator: true
    });
    alert('Payment successful!');
  };
const calculateTax = () => {
    const surface = taxCalculator.surface;
    const serviceCount = taxCalculator.serviceCount;
    const municipality = taxCalculator.municipality;
    
    if (!surface || !serviceCount) {
      alert('Please fill in all fields');
      return;
    }

    const surfaceNum = parseFloat(surface);
    const serviceNum = parseInt(serviceCount);

    const municipalityData = municipalitiesData[municipality.toLowerCase()];
    if (!municipalityData) {
      alert('Municipality not found');
      return;
    }

    let category = 1;
    if (surfaceNum > 100 && surfaceNum <= 200) category = 2;
    else if (surfaceNum > 200 && surfaceNum <= 400) category = 3;
    else if (surfaceNum > 400) category = 4;

    let T_percent = 0.08;
    if (serviceNum > 2 && serviceNum <= 4) T_percent = 0.10;
    else if (serviceNum > 4 && serviceNum <= 6) T_percent = 0.12;
    else if (serviceNum > 6) T_percent = 0.14;

    const ref_price = municipalityData.ref_price;

    const base = surfaceNum * ref_price * 0.02;
    const householdTax = base * T_percent;
    const fnahContribution = base * 0.04;
    const finalTax = Math.round((householdTax + fnahContribution) * 100) / 100;

    setTaxCalculator({
      ...taxCalculator,
      calculatedTax: {
        municipality: municipality,
        surface: surfaceNum,
        service_count: serviceNum,
        category: category,
        T_percent: T_percent,
        ref_price_used: ref_price,
        final_tax: finalTax
      },
      showCalculator: false
    });
  };
  
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const prevMonthDays = new Date(year, month, 0).getDate();
    
    const days = [];
    
    for (let i = firstDay - 1; i >= 0; i--) {
      days.push({ day: prevMonthDays - i, isCurrentMonth: false });
    }
    
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({ day: i, isCurrentMonth: true });
    }
    
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push({ day: i, isCurrentMonth: false });
    }
    
    return days;
  };

  const monthNames = ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'];
  const weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  if (!isAuthenticated) {
    if (authView === 'required') {
      return (
        <div className="login-container h-screen flex items-center justify-center bg-gray-900">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gray-800 flex items-center justify-center">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Authentication Required</h2>
            <p className="text-gray-400 mb-6">Please sign in to access this page</p>
            <button
              onClick={() => setAuthView('signin')}
              className="px-6 py-2 bg-white text-gray-900 rounded-lg hover:bg-gray-100 font-medium"
            >
              Sign In
            </button>
          </div>
        </div>
      );
    }

    if (authView === 'signup') {
      return (
        <div className="login-container h-screen flex items-center justify-center bg-gray-900">
          <div className="w-full max-w-md mx-4">
            <div className="bg-gray-800 rounded-xl p-8 border border-gray-700">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white flex items-center justify-center">
                <Shield className="w-8 h-8 text-gray-900" />
              </div>
              
              <h2 className="text-2xl font-bold text-white text-center mb-2">Create Account</h2>
              <p className="text-gray-400 text-center text-sm mb-6">Join the secure smart home platform</p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-white text-sm font-medium mb-2">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-gray-500"
                  />
                </div>
                
                <div>
                  <label className="block text-white text-sm font-medium mb-2">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a strong password"
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-gray-500"
                  />
                  <p className="text-xs text-gray-400 mt-1">Must be at least 8 characters</p>
                </div>
                
                <div className="bg-gray-700 rounded-lg p-4">
                  <p className="text-white text-sm font-medium mb-3">Security Features Included</p>
                  <div className="space-y-2">
                    {[
                      'Secure password hashing (Argon2)',
                      'Account lockout protection',
                      'Activity monitoring & logging',
                      'Optional two-factor authentication'
                    ].map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-300 text-xs">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <button
                  onClick={handleSignUp}
                  className="w-full py-3 bg-white text-gray-900 rounded-lg hover:bg-gray-100 font-semibold transition-colors"
                >
                  Sign Up
                </button>
              </div>
              
              <p className="text-center text-gray-400 text-sm mt-4">
                Already have an account?{' '}
                <button
                  onClick={() => setAuthView('signin')}
                  className="text-white hover:underline font-medium"
                >
                  Sign in
                </button>
              </p>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="h-screen flex items-center justify-center bg-gray-900">
        <div className="w-full max-w-md mx-4">
          <div className="bg-gray-800 rounded-xl p-8 border border-gray-700">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white flex items-center justify-center">
              <Shield className="w-8 h-8 text-gray-900" />
            </div>
            
            <h2 className="text-2xl font-bold text-white text-center mb-2">Welcome Back</h2>
            <p className="text-gray-400 text-center text-sm mb-6">Sign in to your account</p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-white text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-gray-500"
                />
              </div>
              
              <div>
                <label className="block text-white text-sm font-medium mb-2">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSignIn()}
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-gray-500"
                />
              </div>
              
              <button
                onClick={handleSignIn}
                className="w-full py-3 bg-white text-gray-900 rounded-lg hover:bg-gray-100 font-semibold transition-colors"
              >
                Sign In
              </button>
            </div>
            
            <p className="text-center text-gray-400 text-sm mt-4">
              Don't have an account?{' '}
              <button
                onClick={() => setAuthView('signup')}
                className="text-white hover:underline font-medium"
              >
                Sign up
              </button>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    
    <div className="h-screen flex bg-gray-50" style={{ fontFamily: 'Arial, sans-serif' }}>
      <div className="w-48 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-lg font-bold">Tax Portal</h1>
        </div>
        
        <nav className="flex-1 py-4">
          {menuItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center gap-3 px-6 py-3 text-sm hover:bg-gray-50 transition-colors ${
                activeSection === item.id ? 'bg-gray-100 border-r-4 border-blue-600 font-semibold' : ''
              }`}
            >
              <item.icon className="w-4 h-4" />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-200">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
          >
            <LogOut className="w-4 h-4" />
            <span>Log out</span>
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <span className="text-sm font-semibold">
              {activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}
            </span>
            {activeSection === 'dashboard' && <span className="text-sm text-gray-500"></span>}
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="search"
                className="pl-9 pr-4 py-1.5 border border-gray-300 rounded text-sm w-48 focus:outline-none focus:border-blue-500"
              />
            </div>
            <button className="p-2 hover:bg-gray-100 rounded">
              <Bell className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto">
            
            {activeSection === 'options' && (
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-6">
                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h3 className="font-bold text-lg mb-4">Your Account</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium mb-1">Name:</label>
                        <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Email Address</label>
                        <input type="email" value={email} readOnly className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-50" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h3 className="font-bold text-lg mb-4">Theme</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        onClick={() => setTheme('light')}
                        className={`border-2 rounded-lg p-4 transition-all ${
                          theme === 'light' ? 'border-blue-600' : 'border-gray-300'
                        }`}
                      >
                        <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded mb-2 flex items-center justify-center">
                          <div className="w-12 h-12 border-2 border-gray-400 rotate-45"></div>
                        </div>
                        <div className="text-center font-medium">Light</div>
                      </button>
                      <button
                        onClick={() => setTheme('dark')}
                        className={`border-2 rounded-lg p-4 transition-all ${
                          theme === 'dark' ? 'border-blue-600' : 'border-gray-300'
                        }`}
                      >
                        <div className="aspect-video bg-gradient-to-br from-gray-700 to-gray-900 rounded mb-2 flex items-center justify-center">
                          <div className="w-12 h-12 border-2 border-gray-300 rotate-45"></div>
                        </div>
                        <div className="text-center font-medium">Dark</div>
                      </button>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg border border-gray-200">
                    <button className="w-full px-6 py-3 text-left border-b border-gray-200 hover:bg-gray-50 font-medium">
                      Login & Security
                    </button>
                    <button className="w-full px-6 py-3 text-left border-b border-gray-200 hover:bg-gray-50 font-medium">
                      Privacy Settings
                    </button>
                    <button className="w-full px-6 py-3 text-left border-b border-gray-200 hover:bg-gray-50 font-medium">
                      Domains
                    </button>
                    <button className="w-full px-6 py-3 text-left border-b border-gray-200 hover:bg-gray-50 font-medium flex items-center justify-between">
                      <span>Notifications</span>
                      <label className="relative inline-block w-12 h-6">
                        <input
                          type="checkbox"
                          checked={notifications}
                          onChange={(e) => setNotifications(e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-full h-full bg-gray-300 peer-checked:bg-blue-600 rounded-full peer transition-all"></div>
                        <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-all peer-checked:translate-x-6"></div>
                      </label>
                    </button>
                    <button className="w-full px-6 py-3 text-left hover:bg-gray-50 font-medium">
                      Meetings
                    </button>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h3 className="font-bold text-lg mb-4">Role: Regional Manager</h3>
                    <button className="px-6 py-2 border-2 border-black rounded hover:bg-gray-50 font-medium">
                      Change Role
                    </button>
                  </div>

                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h3 className="font-bold text-lg mb-4">Help</h3>
                    <div className="space-y-2 text-sm">
                      <p>
                        <span className="font-semibold">User Guide:</span> Access the user manual.
                      </p>
                      <p>
                        <span className="font-semibold">FAQ:</span> Commonly asked questions and answers.
                      </p>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h3 className="font-bold text-lg mb-4">Feedback</h3>
                    <p className="text-sm mb-3">
                      <a href="http://fr.tunisie.gov.tn/service/1009/6-paiement-%C3%A9lectronique-de-la-taxe-sur-les-immeubles-b%C3%A2tis-%C3%A0-la-municipalit%C3%A9-de-tunis.htm" className="text-blue-500 hover:underline">Submit Feedback</a>: Form to provide feedback or suggestions.
                    </p>
                  </div>

                  <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <div className="text-xs text-gray-600 space-y-1">
                      <p>stable 000001 (547862 Beta)</p>
                      <p>Host 1.0.9152 x64 (49057)</p>
                      <p>Build Override: N/A Windows 10 64-bit</p>
                      <p>(10.0.22631)</p>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 font-medium">
                      Save & Exit
                    </button>
                  </div>
                </div>
              </div>
            )}
            {activeSection === 'dashboard' && (
              <>
                <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
                  <div className="mb-4">
                    <h3 className="text-sm text-gray-600 mb-1">Total Payed Zebla & Kharouba Tax</h3>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold text-black">3.2M Tnd</span>
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      <span>Since Last Week</span>
                      <br />
                      <span>268,420 Tnd</span>
                      <span className="text-green-600 ml-2">(+2.1%)</span>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold mb-3 text-black">Municipality Holdings</h4>
                    <div className="space-y-3">
                      {[
                        { percent: 50, label: '50%' },
                        { percent: 21, label: '21%' },
                        { percent: 1, label: '1%' },
                        { percent: 84, label: '84%' }
                        
                      ].map((item, idx) => (
                        <div key={idx} className="flex items-center gap-3">
                          <div className="flex-1 h-6 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gray-800 rounded-full"
                              style={{ width: `${item.percent}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium w-12">{item.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-black">Municipality Performance</h3>
                      <button className="text-sm text-blue-600 hover:underline">View all</button>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                        <div>
                          <div className="text-sm font-medium">Name</div>
                          <div className="text-xs text-gray-500">ID Card Number</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">Amount</div>
                          <div className="text-xs text-gray-500">Date</div>
                        </div>
                      </div>

                      {[1, 2, 3].map((item) => (
                        <div key={item} className="flex items-center justify-between py-2">
                          <div>
                            <div className="text-sm">___-__-__</div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm">MM/DD/YYY</div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 pt-4 border-t border-gray-200">
                      <div className="flex gap-2">
                        <button className="px-4 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50">
                          Add Promise
                        </button>
                        <button className="px-4 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50">
                          Filter
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <div className="flex items-center justify-between mb-4">
                      <button className="p-1 hover:bg-gray-100 rounded">
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <div className="text-center">
                        <div className="font-semibold">{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</div>
                      </div>
                      <button className="p-1 hover:bg-gray-100 rounded">
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-7 gap-1 mb-2">
                      {weekDays.map((day, idx) => (
                        <div key={idx} className="text-center text-xs font-semibold text-gray-600 py-1">
                          {day}
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-7 gap-1">
                      {getDaysInMonth(currentDate).map((item, idx) => (
                        <button
                          key={idx}
                          className={`aspect-square flex items-center justify-center text-sm rounded hover:bg-gray-100 ${
                            !item.isCurrentMonth ? 'text-gray-300' : 'text-gray-700'
                          } ${item.day === 8 && item.isCurrentMonth ? 'bg-blue-600 text-white hover:bg-blue-700' : ''}`}
                        >
                          {item.day}
                        </button>
                      ))}
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <button className="w-full flex items-center justify-center gap-2 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded">
                        <Calendar className="w-4 h-4" />
                        <span>Meetings</span>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6 mt-6">
                  <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
                    <div className="text-2xl font-bold mb-1">x.xxM Tnd</div>
                    <div className="text-sm text-gray-600">Pending</div>
                    <div className="text-sm text-red-600">(-36.4%)</div>
                  </div>
                  <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
                    <div className="text-2xl font-bold mb-1">x.xxM Tnd</div>
                  </div>
                </div>
              </>
            )}

            {activeSection === 'logs' && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-xl font-bold mb-4">Logs</h3>
                <p className="text-gray-600">Logs content will be displayed here.</p>
              </div>
            )}
            {activeSection === 'payment' && (
              <div className="grid grid-cols-2 gap-6">
                {/* Left: Tax Calculator & Payment Form */}
                <div className="space-y-6">
                  {/* Tax Calculator */}
                  {taxCalculator.showCalculator ? (
                    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                      <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-6 text-white">
                        <h3 className="text-2xl font-bold mb-1">Tax Calculator</h3>
                        <p className="text-purple-100 text-sm">Calculate your household tax</p>
                      </div>

                      <div className="p-6">
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium mb-2">Property Surface (m²)</label>
                            <input
                              type="number"
                              value={taxCalculator.surface}
                              onChange={(e) => setTaxCalculator({...taxCalculator, surface: e.target.value})}
                              placeholder="e.g., 150"
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium mb-2">Number of Services</label>
                            <input
                              type="number"
                              value={taxCalculator.serviceCount}
                              onChange={(e) => setTaxCalculator({...taxCalculator, serviceCount: e.target.value})}
                              placeholder="e.g., 3"
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                            />
                            <p className="text-xs text-gray-500 mt-1">Water, electricity, waste collection, etc.</p>
                          </div>

                          <div>
                            <label className="block text-sm font-medium mb-2">Municipality</label>
                            <select
                              value={taxCalculator.municipality}
                              onChange={(e) => setTaxCalculator({...taxCalculator, municipality: e.target.value})}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                            >
                              <option value="tunis">Tunis</option>
                              <option value="ariana">Ariana</option>
                              <option value="sfax">Sfax</option>
                              <option value="sousse">Sousse</option>
                            </select>
                          </div>

                          <button
                            onClick={calculateTax}
                            className="w-full py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-semibold transition-colors"
                          >
                            Calculate Tax
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-xl font-bold">Tax Calculation Result</h3>
                        <button
                          onClick={() => setTaxCalculator({...taxCalculator, showCalculator: true, calculatedTax: null})}
                          className="text-sm text-purple-600 hover:underline"
                        >
                          Recalculate
                        </button>
                      </div>

                      {taxCalculator.calculatedTax && (
                        <div className="space-y-3">
                          <div className="flex justify-between py-2 border-b">
                            <span className="text-gray-600">Municipality:</span>
                            <span className="font-semibold capitalize">{taxCalculator.calculatedTax.municipality}</span>
                          </div>
                          <div className="flex justify-between py-2 border-b">
                            <span className="text-gray-600">Surface:</span>
                            <span className="font-semibold">{taxCalculator.calculatedTax.surface} m²</span>
                          </div>
                          <div className="flex justify-between py-2 border-b">
                            <span className="text-gray-600">Services:</span>
                            <span className="font-semibold">{taxCalculator.calculatedTax.service_count}</span>
                          </div>
                          <div className="flex justify-between py-2 border-b">
                            <span className="text-gray-600">Category:</span>
                            <span className="font-semibold">{taxCalculator.calculatedTax.category}</span>
                          </div>
                          <div className="flex justify-between py-2 border-b">
                            <span className="text-gray-600">Tax Rate (T%):</span>
                            <span className="font-semibold">{(taxCalculator.calculatedTax.T_percent * 100).toFixed(0)}%</span>
                          </div>
                          <div className="flex justify-between py-3 bg-purple-50 rounded-lg px-4 mt-4">
                            <span className="font-bold text-lg">Total Tax:</span>
                            <span className="font-bold text-2xl text-purple-600">{taxCalculator.calculatedTax.final_tax} TND</span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Payment Form - Only show if tax is calculated */}
                  {!taxCalculator.showCalculator && taxCalculator.calculatedTax && (
                    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                      <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
                        <h3 className="text-2xl font-bold mb-1">Payment</h3>
                        <p className="text-blue-100 text-sm">Secure & Instant</p>
                      </div>

                      <div className="p-6">
                        <h4 className="font-bold text-lg mb-4">Payment Method</h4>
                        
                        <div className="grid grid-cols-2 gap-3 mb-6">
                          {[
                            { id: 'BANK_CARD', label: 'Visa / Mastercard' },
                            { id: 'Flouci', label: 'Flouci' },
                            { id: 'D17', label: 'D17' },
                            { id: 'EDINAR', label: 'EDINAR' }
                          ].map((method) => (
                            <button
                              key={method.id}
                              onClick={() => {
                                setSelectedPaymentMethod(method.id);
                                setPaymentError('');
                              }}
                              className={`p-4 border-2 rounded-lg transition-all hover:border-blue-400 ${
                                selectedPaymentMethod === method.id
                                  ? 'border-blue-600 bg-blue-50'
                                  : 'border-gray-300'
                              }`}
                            >
                              <CreditCard className="w-8 h-8 mx-auto mb-2 text-gray-700" />
                              <p className="text-sm font-medium text-center">{method.label}</p>
                            </button>
                          ))}
                        </div>

                        <div className="mb-4">
                          <label className="block text-sm font-medium text-blue-700 mb-2">
                            ID Card Number (CIN)
                          </label>
                          <input
                            type="text"
                            value={idCardNumber}
                            onChange={(e) => {
                              setIdCardNumber(e.target.value);
                              setPaymentError('');
                            }}
                            placeholder="dddddddd"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                          />
                        </div>

                        {paymentError && (
                          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
                            <div className="w-5 h-5 rounded-full border-2 border-red-700 flex items-center justify-center text-xs">!</div>
                            <span className="text-sm">{paymentError}</span>
                          </div>
                        )}

                        <button
                          onClick={handlePayment}
                          className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold transition-colors"
                        >
                          Confirm Payment
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Right: Recent Payments */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="text-xl font-bold mb-4">Recent Payments</h3>
                  {payments.length > 0 ? (
                    <div className="space-y-3">
                      {payments.map((payment) => (
                        <div
                          key={payment.payment_id}
                          className="flex justify-between items-center border-b pb-3 last:border-b-0"
                        >
                          <div>
                            <p className="font-medium">
                              {payment.municipality} - {payment.reference_id}
                            </p>
                            <p className="text-sm text-gray-600">
                              {payment.channel} • {new Date(payment.paid_at || payment.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-lg">{payment.amount} TND</p>
                            <span
                              className={`text-xs px-2 py-1 rounded-full ${
                                payment.status === 'PAID'
                                  ? 'bg-green-100 text-green-800'
                                  : payment.status === 'PENDING'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}
                            >
                              {payment.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <CreditCard className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                      <p className="text-gray-500">No payments yet.</p>
                    </div>
                  )}
                </div>
              </div>
            )}
            {activeSection === 'promise' && <PromiseWorkflow />}
            {activeSection === 'logs' && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-xl font-bold mb-4">Logs</h3>
                <p className="text-gray-600">Logs content will be displayed here.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TaxDashboard;