import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { Search, Filter, Heart, Eye, ArrowLeft } from "lucide-react";

export default function Explore() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterClayType, setFilterClayType] = useState<string>("all");

  const { data: teapots, isLoading } = trpc.teapot.getPublic.useQuery();

  const clayTypeLabels: Record<string, string> = {
    purple: "紫泥",
    green: "綠泥",
    vermilion: "朱泥",
    duan: "段泥",
    jiangpo: "降坡泥",
  };

  const filteredTeapots = teapots?.filter((teapot) => {
    const matchesSearch = teapot.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      teapot.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterClayType === "all" || teapot.clayType === filterClayType;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* 導航欄 */}
      <nav className="sticky top-0 z-50 glass border-b border-border/50 backdrop-blur-md">
        <div className="container">
          <div className="flex h-16 items-center justify-between">
            <Link href="/">
              <a className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <span className="text-white font-bold text-lg">紫</span>
                </div>
                <span className="text-xl font-semibold text-foreground">紫砂壺分享中心</span>
              </a>
            </Link>
          </div>
        </div>
      </nav>

      <div className="container py-12">
        <Link href="/">
          <a className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            返回首頁
          </a>
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">探索收藏</h1>
          <p className="text-muted-foreground">
            瀏覽壺友們分享的精美紫砂壺收藏
          </p>
        </div>

        {/* 搜索和篩選 */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="搜索壺名稱或描述..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={filterClayType} onValueChange={setFilterClayType}>
            <SelectTrigger className="w-full md:w-48">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="篩選泥料" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部泥料</SelectItem>
              <SelectItem value="purple">紫泥</SelectItem>
              <SelectItem value="green">綠泥</SelectItem>
              <SelectItem value="vermilion">朱泥</SelectItem>
              <SelectItem value="duan">段泥</SelectItem>
              <SelectItem value="jiangpo">降坡泥</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* 壺列表 */}
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="animate-pulse">
                <div className="aspect-square bg-muted" />
                <CardContent className="pt-4 space-y-2">
                  <div className="h-6 bg-muted rounded" />
                  <div className="h-4 bg-muted rounded w-2/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredTeapots && filteredTeapots.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTeapots.map((teapot) => (
              <Link key={teapot.id} href={`/teapot/${teapot.id}`}>
                <Card className="hover-lift cursor-pointer group">
                  <div className="aspect-square bg-muted relative overflow-hidden">
                    {teapot.photos?.front ? (
                      <img
                        src={teapot.photos.front}
                        alt={teapot.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        <Eye className="w-12 h-12" />
                      </div>
                    )}
                    <div className="absolute top-3 right-3">
                      <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm">
                        {clayTypeLabels[teapot.clayType]}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="pt-4">
                    <h3 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors">
                      {teapot.name}
                    </h3>
                    {teapot.shapeType && (
                      <p className="text-sm text-muted-foreground mb-2">
                        器型：{teapot.shapeType}
                      </p>
                    )}
                    {teapot.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {teapot.description}
                      </p>
                    )}
                    <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        {Math.floor(Math.random() * 1000)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Heart className="w-4 h-4" />
                        {Math.floor(Math.random() * 100)}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">暫無收藏</h3>
            <p className="text-muted-foreground mb-6">
              {searchQuery || filterClayType !== "all"
                ? "沒有找到符合條件的紫砂壺"
                : "還沒有壺友分享收藏，成為第一個吧！"}
            </p>
            <Link href="/upload">
              <Button>上傳您的收藏</Button>
            </Link>
          </Card>
        )}
      </div>
    </div>
  );
}
