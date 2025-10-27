import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  ArrowLeft,
  Package,
  Building2,
  Shield,
  TrendingUp,
  Users,
  FileCheck,
  QrCode,
  BarChart3,
  Zap,
  CheckCircle2,
  Workflow,
  Bell,
  Lock,
  Smartphone,
  Globe,
  Database,
  RefreshCw,
  ArrowRight
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import SimpleAPIStatusBadge from './common/SimpleAPIStatusBadge';
import unionLogo from 'figma:asset/88c1898e13fe3b699c65f14f809552d2a58cb2b7.png';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30" dir="rtl">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Building2 className="h-6 w-6 text-primary" />
              <span className="font-bold text-xl">Elevator ID</span>
            </div>
            <SimpleAPIStatusBadge />
          </div>
          
          <nav className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-sm hover:text-primary transition-colors">
              امکانات
            </a>
            <a href="#how-it-works" className="text-sm hover:text-primary transition-colors">
              نحوه کار
            </a>
            <a href="#benefits" className="text-sm hover:text-primary transition-colors">
              مزایا
            </a>
            <a href="#contact" className="text-sm hover:text-primary transition-colors">
              تماس با ما
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Button variant="default" size="sm" asChild>
              <Link to="/api/login">ورود</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32">
        <div className="absolute inset-0 bg-grid-slate-900/[0.04] bg-[size:75px_75px]" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        
        <div className="container mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-4xl mx-auto"
          >
            <Badge className="mb-6 text-sm px-4 py-2" variant="secondary">
              <Zap className="ml-2 h-4 w-4" />
              Elevator ID - زیرساخت ملی مدیریت آسانسور
            </Badge>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-8 pb-4 bg-clip-text text-transparent bg-gradient-to-l from-primary to-primary/60 text-[60px] leading-tight min-h-[180px] md:min-h-[200px]">
              سامانه جامع مدیریت صنعت
              <br />
              آسانسور و پله‌برقی کشور
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-10 leading-relaxed max-w-2xl mx-auto">
              تحول دیجیتال در صنعت آسانسور با هدف شفاف‌سازی زنجیره تولید تا بهره‌برداری،
              افزایش ایمنی عمومی و ارتقای بهره‌وری در سراسر کشور
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button size="lg" className="text-lg h-12 px-8" asChild>
                <Link to="/demo/user">
                  مشاهده دموی پنل کاربری
                  <ArrowLeft className="mr-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-lg h-12 px-8" asChild>
                <Link to="/demo/admin">
                  مشاهده دموی پنل ادمین
                  <ArrowRight className="mr-2 h-5 w-5" />
                </Link>
              </Button>
            </div>

            <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                <span>شفافیت کامل</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                <span>افزایش ایمنی</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                <span>نظارت هوشمند</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                <span>تصمیم‌سازی داده‌محور</span>
              </div>
            </div>
          </motion.div>

          {/* Dashboard Preview */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-16 relative"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10 pointer-events-none" />
            <div className="rounded-xl border shadow-2xl overflow-hidden bg-card">
              <div className="bg-muted/50 px-4 py-3 border-b flex items-center gap-2">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <div className="flex-1 text-center text-sm text-muted-foreground">
                  پیش‌نمایش داشبورد سامانه
                </div>
              </div>
              <div className="bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-6 md:p-8">
                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-card rounded-lg border p-4 shadow-sm hover:shadow-md transition-shadow">
                    <Package className="h-8 w-8 text-blue-600 mb-2" />
                    <div className="text-2xl font-bold">۱,۲۳۴</div>
                    <div className="text-xs text-muted-foreground">قطعات ثبت شده</div>
                  </div>
                  <div className="bg-card rounded-lg border p-4 shadow-sm hover:shadow-md transition-shadow">
                    <Building2 className="h-8 w-8 text-green-600 mb-2" />
                    <div className="text-2xl font-bold">۵۶۷</div>
                    <div className="text-xs text-muted-foreground">آسانسورها</div>
                  </div>
                  <div className="bg-card rounded-lg border p-4 shadow-sm hover:shadow-md transition-shadow">
                    <Users className="h-8 w-8 text-purple-600 mb-2" />
                    <div className="text-2xl font-bold">۸۹</div>
                    <div className="text-xs text-muted-foreground">کاربران فعال</div>
                  </div>
                  <div className="bg-card rounded-lg border p-4 shadow-sm hover:shadow-md transition-shadow">
                    <TrendingUp className="h-8 w-8 text-orange-600 mb-2" />
                    <div className="text-2xl font-bold">۹۲٪</div>
                    <div className="text-xs text-muted-foreground">نرخ رضایت</div>
                  </div>
                </div>

                {/* Chart Area */}
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-card rounded-lg border p-4 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-sm">آمار ماهانه</h3>
                      <BarChart3 className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="h-32 flex items-end justify-between gap-2">
                      <div className="w-full bg-blue-500/20 rounded-t" style={{ height: '60%' }} />
                      <div className="w-full bg-blue-500/30 rounded-t" style={{ height: '80%' }} />
                      <div className="w-full bg-blue-500/40 rounded-t" style={{ height: '95%' }} />
                      <div className="w-full bg-blue-500/50 rounded-t" style={{ height: '70%' }} />
                      <div className="w-full bg-blue-500/60 rounded-t" style={{ height: '85%' }} />
                      <div className="w-full bg-blue-500 rounded-t" style={{ height: '100%' }} />
                    </div>
                  </div>

                  <div className="bg-card rounded-lg border p-4 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-sm">وضعیت انتقالات</h3>
                      <RefreshCw className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500" />
                        <div className="flex-1 text-xs">تکمیل شده</div>
                        <div className="text-xs font-bold">۱۵۶</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-yellow-500" />
                        <div className="flex-1 text-xs">در حال انتقال</div>
                        <div className="text-xs font-bold">۲۳</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-blue-500" />
                        <div className="flex-1 text-xs">در انتظار تایید</div>
                        <div className="text-xs font-bold">۴۷</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-card rounded-lg border p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-sm">آخرین فعالیت‌ها</h3>
                    <Badge variant="secondary" className="text-xs">امروز</Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 p-2 rounded-md bg-muted/50">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <div className="flex-1 text-xs">قطعه جدید ثبت شد</div>
                      <div className="text-xs text-muted-foreground">۱۰ دقیقه پیش</div>
                    </div>
                    <div className="flex items-center gap-3 p-2 rounded-md bg-muted/50">
                      <CheckCircle2 className="h-4 w-4 text-blue-600" />
                      <div className="flex-1 text-xs">انتقال تایید شد</div>
                      <div className="text-xs text-muted-foreground">۲۵ دقیقه پیش</div>
                    </div>
                    <div className="flex items-center gap-3 p-2 rounded-md bg-muted/50">
                      <CheckCircle2 className="h-4 w-4 text-purple-600" />
                      <div className="flex-1 text-xs">شناسنامه آسانسور صادر شد</div>
                      <div className="text-xs text-muted-foreground">۱ ساعت پیش</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">یکپارچه</div>
              <div className="text-sm opacity-90">زیرساخت متمرکز ملی</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">هوشمند</div>
              <div className="text-sm opacity-90">نظارت و پایش لحظه‌ای</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">شفاف</div>
              <div className="text-sm opacity-90">زنجیره تولید تا نصب</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">ایمن</div>
              <div className="text-sm opacity-90">کاهش حوادث و تخلفات</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <Badge className="mb-4" variant="secondary">
              ماژول‌ها و قابلیت‌ها
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              یازده ماژول کلیدی سامانه
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              راهکاری جامع برای مدیریت هوشمند، نظارت دقیق و شفاف‌سازی کامل صنعت آسانسور کشور
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4`}>
                      <feature.icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 md:py-32 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <Badge className="mb-4" variant="secondary">
              نحوه کار
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              چگونه کار می‌کند؟
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              با سه گام ساده، سامانه را راه‌اندازی کنید و مدیریت را شروع کنید
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="relative"
              >
                <div className="flex items-start gap-6 mb-12">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold">
                      {step.number}
                    </div>
                  </div>
                  <Card className="flex-1">
                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {step.description}
                      </p>
                    </CardContent>
                  </Card>
                </div>
                {index < steps.length - 1 && (
                  <div className="absolute right-8 top-16 bottom-0 w-0.5 bg-border" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <Badge className="mb-4" variant="secondary">
                مزایای سامانه
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                چرا Elevator ID؟
              </h2>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                زیرساختی ملی برای تحول دیجیتال صنعت آسانسور کشور که ایمنی را افزایش می‌دهد،
                فرآیندها را تسهیل کرده و تصمیم‌گیری را بر پایه داده‌های واقعی امکان‌پذیر می‌سازد.
              </p>

              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mt-0.5">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-bold mb-1">{benefit.title}</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {benefit.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 p-8 flex items-center justify-center">
                <div className="grid grid-cols-2 gap-4 w-full max-w-md">
                  <div className="bg-card rounded-xl border p-4 shadow-sm">
                    <QrCode className="h-8 w-8 text-blue-600 mb-2" />
                    <div className="text-sm font-medium">QR Code</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      دسترسی سریع
                    </div>
                  </div>
                  <div className="bg-card rounded-xl border p-4 shadow-sm">
                    <Shield className="h-8 w-8 text-green-600 mb-2" />
                    <div className="text-sm font-medium">امنیت</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      رمزنگاری پیشرفته
                    </div>
                  </div>
                  <div className="bg-card rounded-xl border p-4 shadow-sm">
                    <BarChart3 className="h-8 w-8 text-purple-600 mb-2" />
                    <div className="text-sm font-medium">گزارش‌ها</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      تحلیل داده
                    </div>
                  </div>
                  <div className="bg-card rounded-xl border p-4 shadow-sm">
                    <Bell className="h-8 w-8 text-orange-600 mb-2" />
                    <div className="text-sm font-medium">اعلان‌ها</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      هشدار به موقع
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <Badge className="mb-4" variant="secondary">
              فناوری و زیرساخت
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              پلتفرم قدرتمند و مقیاس‌پذیر
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mt-2">
              توسعه با Laravel، معماری میکروسرویس و اتصال امن به سایر سامانه‌ها
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {technologies.map((tech, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card className="p-6 text-center hover:shadow-lg transition-shadow">
                  <tech.icon className="h-10 w-10 mx-auto mb-3 text-primary" />
                  <div className="font-medium text-sm">{tech.name}</div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-gradient-to-l from-primary to-primary/80 rounded-2xl p-12 md:p-16 text-center text-primary-foreground"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              تحول دیجیتال صنعت آسانسور
            </h2>
            <p className="text-lg md:text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              با Elevator ID، آینده‌ای شفاف، ایمن و هوشمند برای صنعت آسانسور کشور بسازیم
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="text-lg h-12 px-8" asChild>
                <Link to="/demo/user">
                  مشاهده دموی پنل کاربری
                  <ArrowLeft className="mr-2 h-5 w-5" />
                </Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="text-lg h-12 px-8 bg-transparent text-primary-foreground border-primary-foreground/30 hover:bg-primary-foreground/10" 
                asChild
              >
                <Link to="/demo/admin">
                  مشاهده دموی پنل ادمین
                  <ArrowRight className="mr-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-muted/50 border-t py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Building2 className="h-6 w-6 text-primary" />
                <span className="font-bold text-lg">Elevator ID</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                زیرساخت ملی مدیریت هوشمند صنعت آسانسور و پله‌برقی کشور با هدف شفافیت، ایمنی و بهره‌وری
              </p>
            </div>

            <div>
              <h3 className="font-bold mb-4">دسترسی سریع</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/demo/admin" className="text-muted-foreground hover:text-primary transition-colors">
                    پنل ادمین (دمو)
                  </Link>
                </li>
                <li>
                  <Link to="/demo/user" className="text-muted-foreground hover:text-primary transition-colors">
                    پنل کاربر (دمو)
                  </Link>
                </li>
                <li>
                  <Link to="/api/login" className="text-muted-foreground hover:text-primary transition-colors">
                    ورود به سیستم
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold mb-4">امکانات</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>ردیابی قطعات</li>
                <li>مدیریت آسانسورها</li>
                <li>گزارش‌گیری جامع</li>
                <li>QR Code و بارکد</li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold mb-4">تماس با ما</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>ایمیل: info@elevatorid.ir</li>
                <li>تلفن: ۶۷۶۳۱۰۰۰(۰۲۱)</li>
                <li>آدرس: تهران، خیابان فلسطین شمالی، نرسیده به بلوار کشاورز، پلاک ۴۵۸ طبقه دوم</li>
              </ul>
            </div>
          </div>

          <div className="border-t pt-8">
            {/* Union Info Section */}
            <div className="flex flex-col items-center gap-6 mb-8">
              <div className="flex items-center gap-4">
                <img 
                  src={unionLogo} 
                  alt="لوگوی اتحادیه کشوری آسانسور و پله برقی" 
                  className="h-16 w-auto"
                />
                <div className="text-center">
                  <p className="text-sm font-medium text-foreground mb-1">
                    این سامانه توسط
                  </p>
                  <p className="text-base font-bold text-primary">
                    اتحادیه کشوری آسانسور و پله برقی و خدمات وابسته
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    اجرایی شده است
                  </p>
                </div>
              </div>
            </div>

            {/* Copyright */}
            <div className="text-center text-sm text-muted-foreground">
              <p>
                © {new Date().getFullYear()} Elevator ID - سامانه جامع مدیریت صنعت آسانسور کشور. تمامی حقوق محفوظ است.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Data
const features = [
  {
    icon: Building2,
    title: 'مدیریت هویت آسانسور',
    description: 'تخصیص شناسه یکتا، ثبت کامل اطلاعات فنی و رهگیری سوابق نصب، سرویس و بازرسی',
    gradient: 'from-blue-500 to-blue-600'
  },
  {
    icon: Package,
    title: 'رصد و پایش قطعات',
    description: 'شناسه‌گذاری و ردیابی از تولید تا نصب، کنترل انتقال و جلوگیری از قطعات غیراستاندارد',
    gradient: 'from-green-500 to-green-600'
  },
  {
    icon: Users,
    title: 'پنل هوشمند شرکت‌ها',
    description: 'محیط اختصاصی برای تولید، نصب و سرویس با ثبت فعالیت و مدیریت مجوزها',
    gradient: 'from-purple-500 to-purple-600'
  },
  {
    icon: FileCheck,
    title: 'ماژول بازرسی و ایمنی',
    description: 'تعریف فرآیند بازرسی، ثبت گزارش رسمی و هشدار خودکار برای نقص‌های فنی',
    gradient: 'from-orange-500 to-orange-600'
  },
  {
    icon: Smartphone,
    title: 'ماژول بهره‌برداران',
    description: 'استعلام وضعیت با QR Code، اطلاع‌رسانی هوشمند و دسترسی عمومی به سوابق',
    gradient: 'from-pink-500 to-pink-600'
  },
  {
    icon: BarChart3,
    title: 'ماژول مدیریتی و آماری',
    description: 'داشبورد مدیریتی، گزارش‌های تحلیلی و تحلیل داده‌های خرابی در سطح ملی',
    gradient: 'from-red-500 to-red-600'
  },
  {
    icon: Shield,
    title: 'احراز هویت و مجوزها',
    description: 'احراز دیجیتال شرکت‌ها، مدیریت مجوزها و جلوگیری از فعالیت غیرمجاز',
    gradient: 'from-indigo-500 to-indigo-600'
  },
  {
    icon: Workflow,
    title: 'گردش‌کار و فرآیندها',
    description: 'مسیرهای تایید دیجیتال، ثبت مراحل با زمان‌بندی و کاهش بروکراسی اداری',
    gradient: 'from-cyan-500 to-cyan-600'
  },
  {
    icon: Bell,
    title: 'اعلان‌ها و پیام‌ها',
    description: 'ارسال خودکار هشدارها، سیستم پیام داخلی و اعلان‌های منطقه‌ای',
    gradient: 'from-yellow-500 to-yellow-600'
  },
  {
    icon: FileCheck,
    title: 'پشتیبانی و شکایات',
    description: 'ثبت شکایات، پیگیری رسیدگی شفاف و گزارش‌های مدیریتی برای بهبود',
    gradient: 'from-teal-500 to-teal-600'
  },
  {
    icon: Database,
    title: 'اتصال API و وب‌سرویس',
    description: 'ارتباط یکپارچه با سامانه‌ها، انتقال داده امن و قابلیت توسعه',
    gradient: 'from-violet-500 to-violet-600'
  }
];

const steps = [
  {
    number: '۱',
    title: 'احراز هویت و ثبت‌نام',
    description: 'با احراز هویت دیجیتال و OTP وارد سامانه شوید. شرکت‌ها و کاربران با مجوزهای مناسب ثبت می‌شوند.'
  },
  {
    number: '۲',
    title: 'ثبت و شناسه‌گذاری',
    description: 'قطعات از مرحله تولید یا واردات شناسه‌گذاری شده و آسانسورها با شناسه یکتا در سامانه ثبت می‌شوند.'
  },
  {
    number: '۳',
    title: 'نظارت و گزارش‌گیری',
    description: 'نهادها از داشبورد مدیریتی نظارت می‌کنند، شرکت‌ها فعالیت ثبت می‌کنند و شهروندان از ایمنی مطلع می‌شوند.'
  }
];

const benefits = [
  {
    title: 'برای نهادهای حاکمیتی',
    description: 'شفافیت کامل در زنجیره تولید، نظارت هوشمند، تصمیم‌سازی داده‌محور و کاهش تخلفات'
  },
  {
    title: 'برای شرکت‌های فعال',
    description: 'کاهش هزینه‌های اداری، سرعت در مجوزدهی، اعتباربخشی سوابق و ارتباط ساده با نهادها'
  },
  {
    title: 'برای شهروندان',
    description: 'اطلاع از وضعیت ایمنی آسانسور، دریافت هشدارها و افزایش اعتماد عمومی به صنعت'
  },
  {
    title: 'معماری مقیاس‌پذیر',
    description: 'توسعه با فریم‌ورک Laravel، طراحی ماژولار و زیرساخت امن برای تبادل داده'
  },
  {
    title: 'تحول دیجیتال صنعت',
    description: 'الگویی عملی برای هوشمندسازی سایر صنایع زیرساختی در کشور'
  },
  {
    title: 'اکوسیستم شفاف و هوشمند',
    description: 'زیرساختی ملی که ایمنی را افزایش می‌دهد و فرآیندها را تسهیل می‌کند'
  }
];

const technologies = [
  { name: 'React', icon: Globe },
  { name: 'TypeScript', icon: Database },
  { name: 'API امن', icon: Lock },
  { name: 'Real-time', icon: RefreshCw },
  { name: 'Responsive', icon: Smartphone },
  { name: 'QR Code', icon: QrCode },
  { name: 'گزارشات', icon: BarChart3 },
  { name: 'اعلانات', icon: Bell }
];
