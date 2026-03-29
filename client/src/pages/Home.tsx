import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getLoginUrl } from "@/const";
import { Link } from "wouter";
import { 
  Upload, 
  Search, 
  BookOpen, 
  Gavel, 
  MessageSquare, 
  Sparkles,
  ChevronRight,
  Eye,
  Palette,
  Hammer
} from "lucide-react";

export default function Home() {
  const { user, isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen">
      {/* 導航欄 */}
      <nav className="sticky top-0 z-50 glass border-b border-border/50 backdrop-blur-md">
        <div className="container">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-8">
              <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <span className="text-white font-bold text-lg">紫</span>
                </div>
                <span className="text-xl font-semibold text-foreground">紫砂壺分享中心</span>
              </Link>
              
              <div className="hidden md:flex items-center gap-6">
                <Link href="/explore" className="text-sm text-muted-foreground hover:text-foreground transition-colors">探索收藏</Link>
                <Link href="/classic" className="text-sm text-muted-foreground hover:text-foreground transition-colors">經典作品</Link>
                <Link href="/auction" className="text-sm text-muted-foreground hover:text-foreground transition-colors">拍賣會</Link>
                <Link href="/community" className="text-sm text-muted-foreground hover:text-foreground transition-colors">壺友社區</Link>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {isAuthenticated ? (
                <>
                  {user?.role === "admin" && (
                    <Link href="/admin">
                      <Button variant="outline" size="sm" asChild>
                        <span>審核後台</span>
                      </Button>
                    </Link>
                  )}
                  <Link href="/upload">
                    <Button variant="outline" size="sm" className="gap-2" asChild>
                      <span className="flex items-center gap-2">
                        <Upload className="w-4 h-4" />
                        上傳壺
                      </span>
                    </Button>
                  </Link>
                  <Link href="/my-collection">
                    <Button variant="default" size="sm" asChild>
                      <span>我的收藏</span>
                    </Button>
                  </Link>
                </>
              ) : (
                <a href={getLoginUrl()}>
                  <Button variant="default" size="sm">登入 / 註冊</Button>
                </a>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(0,0,0,0.02),transparent_50%)]" />
        
        <div className="container relative py-20 md:py-32">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
              <Sparkles className="w-4 h-4" />
              AI 智能識別 · 專業鑑賞平台
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-foreground leading-tight">
              探索紫砂之美
              <br />
              <span className="text-gradient">傳承千年工藝</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              運用AI技術識別泥料、工藝與器型，為您的紫砂壺收藏提供專業鑑定與分享平台。
              與全球壺友共同品鑒，傳承中華茶文化精髓。
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {isAuthenticated ? (
                <Link href="/upload">
                  <Button size="lg" className="gap-2 shadow-elegant hover-lift" asChild>
                    <span className="flex items-center gap-2">
                      <Upload className="w-5 h-5" />
                      開始上傳您的收藏
                    </span>
                  </Button>
                </Link>
              ) : (
                <a href={getLoginUrl()}>
                  <Button size="lg" className="gap-2 shadow-elegant hover-lift">
                    開始探索
                    <ChevronRight className="w-5 h-5" />
                  </Button>
                </a>
              )}
              
              <Link href="/classic">
                <Button size="lg" variant="outline" className="gap-2 hover-lift" asChild>
                  <span className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5" />
                    瀏覽經典作品
                  </span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-card">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">平台特色功能</h2>
            <p className="text-muted-foreground text-lg">專業、智能、便捷的紫砂壺鑑賞體驗</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="hover-lift border-border/50">
              <CardContent className="pt-6">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <Eye className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">AI 智能識別</h3>
                <p className="text-muted-foreground">
                  運用先進AI技術，自動識別紫砂壺的泥料類型、製作工藝和器型特徵，提供專業鑑定參考。
                </p>
              </CardContent>
            </Card>

            <Card className="hover-lift border-border/50">
              <CardContent className="pt-6">
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
                  <Palette className="w-6 h-6 text-accent" />
                </div>
                <h3 className="text-xl font-semibold mb-2">泥料分析</h3>
                <p className="text-muted-foreground">
                  精準識別紫泥、綠泥、朱泥、段泥、降坡泥等主要泥料，以及各類細分子類別，支持人工修正。
                </p>
              </CardContent>
            </Card>

            <Card className="hover-lift border-border/50">
              <CardContent className="pt-6">
                <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center mb-4">
                  <Hammer className="w-6 h-6 text-secondary-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">工藝鑑定</h3>
                <p className="text-muted-foreground">
                  分析壺內照片，判斷全手工、手半、點搪、車一刀等製作工藝，幫助您了解壺的製作方式。
                </p>
              </CardContent>
            </Card>

            <Card className="hover-lift border-border/50">
              <CardContent className="pt-6">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <Search className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">器型比對</h3>
                <p className="text-muted-foreground">
                  基於經典大師作品建立的器型數據庫，智能比對石瓢、西施、仿古等34種經典器型。
                </p>
              </CardContent>
            </Card>

            <Card className="hover-lift border-border/50">
              <CardContent className="pt-6">
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
                  <BookOpen className="w-6 h-6 text-accent" />
                </div>
                <h3 className="text-xl font-semibold mb-2">經典作品</h3>
                <p className="text-muted-foreground">
                  收錄顧景舟、蔣蓉等大師經典作品，提供詳細圖文介紹，學習紫砂壺的歷史與文化。
                </p>
              </CardContent>
            </Card>

            <Card className="hover-lift border-border/50">
              <CardContent className="pt-6">
                <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center mb-4">
                  <Gavel className="w-6 h-6 text-secondary-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">拍賣會數據</h3>
                <p className="text-muted-foreground">
                  集成當代紫砂壺拍賣會信息，了解市場行情，掌握收藏價值趨勢。
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container">
          <Card className="bg-gradient-to-br from-primary to-accent text-white border-0 shadow-elegant-lg">
            <CardContent className="py-16 px-8 text-center">
              <MessageSquare className="w-16 h-16 mx-auto mb-6 opacity-90" />
              <h2 className="text-3xl md:text-4xl font-bold mb-4">加入壺友社區</h2>
              <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
                與全球紫砂壺愛好者交流心得，分享收藏故事，在留言版中提問討論，共同探索紫砂文化的魅力。
              </p>
              <Link href="/community">
                <Button size="lg" variant="secondary" className="gap-2 hover-lift" asChild>
                  <span className="flex items-center gap-2">
                    前往社區
                    <ChevronRight className="w-5 h-5" />
                  </span>
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-12 bg-card">
        <div className="container">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <span className="text-white font-bold">紫</span>
                </div>
                <span className="font-semibold">紫砂壺分享中心</span>
              </div>
              <p className="text-sm text-muted-foreground">
                專業的紫砂壺鑑賞與收藏平台
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">探索</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/explore" className="hover:text-foreground transition-colors">收藏展示</Link></li>
                <li><Link href="/classic" className="hover:text-foreground transition-colors">經典作品</Link></li>
                <li><Link href="/auction" className="hover:text-foreground transition-colors">拍賣會</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">功能</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/upload" className="hover:text-foreground transition-colors">上傳壺</Link></li>
                <li><Link href="/my-collection" className="hover:text-foreground transition-colors">我的收藏</Link></li>
                <li><Link href="/community" className="hover:text-foreground transition-colors">壺友社區</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">關於</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">關於我們</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">使用條款</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">隱私政策</a></li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-border/50 text-center text-sm text-muted-foreground">
            <p>© 2026 紫砂壺分享中心. 傳承中華茶文化精髓.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
