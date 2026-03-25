import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Building2 } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

const LoginPage = () => {
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex" dir="rtl">
      <div className="w-full lg:w-[45%] flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="flex items-center gap-2 mb-8">
            <Building2 className="w-8 h-8 text-primary" />
            <h1 className="text-2xl font-bold">
              <span className="text-primary">{t.brand_name}</span>
              <span className="text-accent font-latin"> Pro</span>
            </h1>
          </div>

          <div className="flex bg-muted rounded-lg p-1 mb-8">
            <button onClick={() => setTab('login')} className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${tab === 'login' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground'}`}>
              {t.login_title}
            </button>
            <button onClick={() => setTab('register')} className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${tab === 'register' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground'}`}>
              {t.register_title}
            </button>
          </div>

          {tab === 'login' ? (
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label className="block text-sm font-medium mb-1.5">{t.email}</label>
                <Input type="email" placeholder="example@email.com" className="h-10 text-right" dir="ltr" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">{t.password}</label>
                <Input type="password" placeholder="••••••••" className="h-10" dir="ltr" />
              </div>
              <button type="button" className="text-xs text-accent hover:underline">{t.forgot_password}</button>
              <Button className="w-full h-10 bg-primary hover:bg-primary-light text-primary-foreground">{t.login_btn}</Button>
            </form>
          ) : (
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label className="block text-sm font-medium mb-1.5">{t.full_name}</label>
                <Input placeholder="أحمد بنعلي" className="h-10 text-right" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">{t.email}</label>
                <Input type="email" placeholder="example@email.com" className="h-10" dir="ltr" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">{t.phone}</label>
                <Input type="tel" placeholder="+212 6XX XXX XXX" className="h-10 font-latin" dir="ltr" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">{t.password}</label>
                <Input type="password" placeholder="••••••••" className="h-10" dir="ltr" />
              </div>
              <Button className="w-full h-10 bg-primary hover:bg-primary-light text-primary-foreground">{t.create_account}</Button>
            </form>
          )}

          <div className="mt-6 relative">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
            <div className="relative flex justify-center text-xs"><span className="bg-card px-3 text-muted-foreground">{t.or}</span></div>
          </div>

          <Button variant="outline" className="w-full h-10 mt-4">
            <svg className="w-4 h-4 ml-2" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
            {t.login_google}
          </Button>
        </div>
      </div>

      <div className="hidden lg:flex w-[55%] bg-primary items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 right-20 w-40 h-40 rounded-full bg-accent" />
          <div className="absolute bottom-32 left-16 w-64 h-64 rounded-full bg-accent" />
        </div>
        <div className="relative text-center text-primary-foreground max-w-lg">
          <h2 className="text-4xl font-bold mb-4 leading-relaxed">{t.hero_title}</h2>
          <p className="text-lg opacity-80 mb-8 leading-relaxed">{t.hero_subtitle}</p>
          <div className="grid grid-cols-3 gap-6 mt-8">
            <div className="bg-primary-foreground/10 rounded-lg p-4 backdrop-blur-sm">
              <p className="text-3xl font-bold font-latin">+500</p>
              <p className="text-sm opacity-80 mt-1">{t.stat_owners}</p>
            </div>
            <div className="bg-primary-foreground/10 rounded-lg p-4 backdrop-blur-sm">
              <p className="text-3xl font-bold font-latin">+2000</p>
              <p className="text-sm opacity-80 mt-1">{t.stat_units}</p>
            </div>
            <div className="bg-primary-foreground/10 rounded-lg p-4 backdrop-blur-sm">
              <p className="text-3xl font-bold font-latin">99%</p>
              <p className="text-sm opacity-80 mt-1">{t.stat_satisfaction}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
