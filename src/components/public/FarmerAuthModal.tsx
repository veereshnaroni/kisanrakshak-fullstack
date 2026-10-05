import React, { useEffect, useState } from 'react';
import { ArrowLeft, Eye, EyeOff, Leaf, ShieldCheck, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { KARNATAKA_LOCATIONS } from '../../services/weatherService';
import type { Role } from '../../types';

type AuthMode = 'login' | 'register' | 'admin';

interface FarmerAuthModalProps {
  isOpen: boolean;
  initialMode: AuthMode;
  onClose: () => void;
}

const districts = Array.from(new Set(KARNATAKA_LOCATIONS.map(({ district }) => district)));

export const FarmerAuthModal: React.FC<FarmerAuthModalProps> = ({
  isOpen,
  initialMode,
  onClose,
}) => {
  const { login, registerFarmer } = useAuth();
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [district, setDistrict] = useState('Kalaburagi');
  const [taluk, setTaluk] = useState('Kalaburagi');

  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setError('');
    }
  }, [initialMode, isOpen]);

  useEffect(() => {
    if (!isOpen) return undefined;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const taluks = Array.from(
    new Set(KARNATAKA_LOCATIONS.filter((location) => location.district === district).map(({ taluk }) => taluk))
  );

  const handleModeChange = (nextMode: AuthMode) => {
    setMode(nextMode);
    setError('');
  };

  const handleLogin = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const identifier = String(formData.get('identifier') || '');
    const password = String(formData.get('password') || '');
    const role: Role = mode === 'admin' ? 'ROLE_ADMIN' : 'ROLE_FARMER';
    const result = login(identifier, password, role);
    if (!result.success) setError(result.error || 'Unable to sign in. Please try again.');
  };

  const handleRegister = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    registerFarmer({
      name: String(formData.get('name') || '').trim(),
      mobile: String(formData.get('mobile') || '').trim(),
      password: String(formData.get('password') || ''),
      district,
      taluk,
      village: String(formData.get('village') || '').trim(),
      totalAcreage: Number(formData.get('acreage')) || 4.5,
      mainCrops: [String(formData.get('crop') || 'Tur (Pigeon Pea)').trim()],
    });
  };

  const isRegister = mode === 'register';
  const isAdmin = mode === 'admin';
  const title = isRegister ? 'Create your farmer account' : isAdmin ? 'Officer sign in' : 'Welcome back';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[#10251A]/60 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-modal-title"
        className="relative my-auto w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl shadow-black/20"
      >
        <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-[#146B3A] via-emerald-400 to-lime-300" />
        <button
          type="button"
          onClick={onClose}
          aria-label="Close sign in dialog"
          className="absolute right-4 top-4 z-10 rounded-xl p-2 text-[#65736B] transition hover:bg-[#F1F5F3] hover:text-[#17211B]"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="max-h-[min(90vh,820px)] overflow-y-auto px-6 py-8 sm:px-9 sm:py-9">
          <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EAF6EE] text-[#146B3A]">
            {isAdmin ? <ShieldCheck className="h-6 w-6" /> : <Leaf className="h-6 w-6" />}
          </div>
          <h2 id="auth-modal-title" className="pr-8 text-2xl font-black tracking-tight text-[#17211B]">{title}</h2>
          <p className="mt-2 text-sm leading-6 text-[#65736B]">
            {isRegister
              ? 'Join KisanRakshak to keep your farm and family prepared.'
              : isAdmin
                ? 'Sign in to the Karnataka agriculture disaster-control portal.'
                : 'Sign in to see your farm dashboard, alerts, and protection plan.'}
          </p>

          {!isRegister && (
            <div className="mt-6 grid grid-cols-2 rounded-xl bg-[#F1F5F3] p-1">
              <button
                type="button"
                onClick={() => handleModeChange('login')}
                className={`rounded-lg px-3 py-2.5 text-sm font-bold transition ${!isAdmin ? 'bg-white text-[#146B3A] shadow-sm' : 'text-[#65736B] hover:text-[#17211B]'}`}
              >
                Farmer
              </button>
              <button
                type="button"
                onClick={() => handleModeChange('admin')}
                className={`rounded-lg px-3 py-2.5 text-sm font-bold transition ${isAdmin ? 'bg-white text-[#146B3A] shadow-sm' : 'text-[#65736B] hover:text-[#17211B]'}`}
              >
                Agriculture officer
              </button>
            </div>
          )}

          <form onSubmit={isRegister ? handleRegister : handleLogin} className="mt-6 space-y-4">
            {isRegister ? (
              <>
                <div>
                  <label htmlFor="farmer-name" className="mb-1.5 block text-sm font-bold text-[#304239]">Full name</label>
                  <input id="farmer-name" name="name" type="text" autoComplete="name" required maxLength={100} placeholder="Enter your full name" className="w-full rounded-xl border border-[#DCE6DF] px-3.5 py-3 text-sm outline-none transition placeholder:text-[#99A69E] focus:border-[#146B3A] focus:ring-2 focus:ring-emerald-100" />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="farmer-mobile" className="mb-1.5 block text-sm font-bold text-[#304239]">Mobile number</label>
                    <input id="farmer-mobile" name="mobile" type="tel" autoComplete="tel" inputMode="numeric" pattern="[0-9]{10}" required title="Enter a 10-digit mobile number" placeholder="10-digit number" className="w-full rounded-xl border border-[#DCE6DF] px-3.5 py-3 text-sm outline-none transition placeholder:text-[#99A69E] focus:border-[#146B3A] focus:ring-2 focus:ring-emerald-100" />
                  </div>
                  <div>
                    <label htmlFor="farmer-password" className="mb-1.5 block text-sm font-bold text-[#304239]">Password</label>
                    <div className="relative">
                      <input id="farmer-password" name="password" type={showPassword ? 'text' : 'password'} autoComplete="new-password" required minLength={6} placeholder="At least 6 characters" className="w-full rounded-xl border border-[#DCE6DF] px-3.5 py-3 pr-11 text-sm outline-none transition placeholder:text-[#99A69E] focus:border-[#146B3A] focus:ring-2 focus:ring-emerald-100" />
                      <button type="button" aria-label={showPassword ? 'Hide password' : 'Show password'} onClick={() => setShowPassword((visible) => !visible)} className="absolute inset-y-0 right-0 flex items-center px-3 text-[#65736B] hover:text-[#146B3A]">
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="farmer-district" className="mb-1.5 block text-sm font-bold text-[#304239]">District</label>
                    <select
                      id="farmer-district"
                      value={district}
                      onChange={(event) => {
                        const nextDistrict = event.target.value;
                        setDistrict(nextDistrict);
                        setTaluk(KARNATAKA_LOCATIONS.find((location) => location.district === nextDistrict)?.taluk || '');
                      }}
                      className="w-full rounded-xl border border-[#DCE6DF] bg-white px-3.5 py-3 text-sm outline-none focus:border-[#146B3A] focus:ring-2 focus:ring-emerald-100"
                    >
                      {districts.map((option) => <option key={option} value={option}>{option}</option>)}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="farmer-taluk" className="mb-1.5 block text-sm font-bold text-[#304239]">Taluk</label>
                    <select id="farmer-taluk" value={taluk} onChange={(event) => setTaluk(event.target.value)} className="w-full rounded-xl border border-[#DCE6DF] bg-white px-3.5 py-3 text-sm outline-none focus:border-[#146B3A] focus:ring-2 focus:ring-emerald-100">
                      {taluks.map((option) => <option key={option} value={option}>{option}</option>)}
                    </select>
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="farmer-village" className="mb-1.5 block text-sm font-bold text-[#304239]">Village</label>
                    <input id="farmer-village" name="village" type="text" required maxLength={100} placeholder="Village name" className="w-full rounded-xl border border-[#DCE6DF] px-3.5 py-3 text-sm outline-none transition placeholder:text-[#99A69E] focus:border-[#146B3A] focus:ring-2 focus:ring-emerald-100" />
                  </div>
                  <div>
                    <label htmlFor="farmer-acreage" className="mb-1.5 block text-sm font-bold text-[#304239]">Farm size (acres)</label>
                    <input id="farmer-acreage" name="acreage" type="number" min="0.1" max="10000" step="0.1" required defaultValue="4.5" className="w-full rounded-xl border border-[#DCE6DF] px-3.5 py-3 text-sm outline-none transition focus:border-[#146B3A] focus:ring-2 focus:ring-emerald-100" />
                  </div>
                </div>
                <div>
                  <label htmlFor="farmer-crop" className="mb-1.5 block text-sm font-bold text-[#304239]">Main crop</label>
                  <input id="farmer-crop" name="crop" type="text" required maxLength={100} placeholder="e.g. Tur (Pigeon Pea)" className="w-full rounded-xl border border-[#DCE6DF] px-3.5 py-3 text-sm outline-none transition placeholder:text-[#99A69E] focus:border-[#146B3A] focus:ring-2 focus:ring-emerald-100" />
                </div>
              </>
            ) : (
              <>
                <div>
                  <label htmlFor="login-identifier" className="mb-1.5 block text-sm font-bold text-[#304239]">{isAdmin ? 'Officer ID or email' : 'Mobile number or farmer ID'}</label>
                  <input id="login-identifier" name="identifier" type="text" autoComplete="username" required placeholder={isAdmin ? 'Enter your officer ID' : 'Enter your mobile number or farmer ID'} className="w-full rounded-xl border border-[#DCE6DF] px-3.5 py-3 text-sm outline-none transition placeholder:text-[#99A69E] focus:border-[#146B3A] focus:ring-2 focus:ring-emerald-100" />
                </div>
                <div>
                  <label htmlFor="login-password" className="mb-1.5 block text-sm font-bold text-[#304239]">Password</label>
                  <div className="relative">
                    <input id="login-password" name="password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" required placeholder="Enter your password" className="w-full rounded-xl border border-[#DCE6DF] px-3.5 py-3 pr-11 text-sm outline-none transition placeholder:text-[#99A69E] focus:border-[#146B3A] focus:ring-2 focus:ring-emerald-100" />
                    <button type="button" aria-label={showPassword ? 'Hide password' : 'Show password'} onClick={() => setShowPassword((visible) => !visible)} className="absolute inset-y-0 right-0 flex items-center px-3 text-[#65736B] hover:text-[#146B3A]">
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <div className="rounded-xl border border-[#E8EEE9] bg-[#F8FAF9] p-3.5 text-xs leading-5 text-[#65736B]">
                  {isAdmin ? (
                    <>Demo officer: <strong className="text-[#304239]">admin</strong> / <strong className="text-[#304239]">admin123</strong></>
                  ) : (
                    <>Demo farmer: <strong className="text-[#304239]">9845012345</strong> / <strong className="text-[#304239]">farmer123</strong></>
                  )}
                </div>
              </>
            )}

            {error && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-3.5 py-3 text-sm font-medium leading-5 text-red-700">{error}</p>}

            <button type="submit" className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#146B3A] px-5 py-3.5 text-sm font-extrabold text-white shadow-sm transition hover:bg-[#0D542D] focus:outline-none focus:ring-2 focus:ring-[#146B3A] focus:ring-offset-2">
              {isRegister ? 'Create farmer account' : isAdmin ? 'Sign in to officer portal' : 'Sign in'}
            </button>
          </form>

          <div className="mt-6 border-t border-[#E8EEE9] pt-5 text-center text-sm text-[#65736B]">
            {isRegister ? (
              <button type="button" onClick={() => handleModeChange('login')} className="inline-flex items-center gap-1.5 font-bold text-[#146B3A] hover:underline"><ArrowLeft className="h-4 w-4" /> Already registered? Sign in</button>
            ) : isAdmin ? (
              <button type="button" onClick={() => handleModeChange('login')} className="font-bold text-[#146B3A] hover:underline">Back to farmer sign in</button>
            ) : (
              <>New to KisanRakshak?{' '}<button type="button" onClick={() => handleModeChange('register')} className="font-bold text-[#146B3A] hover:underline">Create an account</button></>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
