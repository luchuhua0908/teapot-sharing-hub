import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { ArrowLeft, Gavel, ExternalLink, TrendingUp } from "lucide-react";

export default function Auction() {
  const { data: auctions, isLoading } = trpc.auction.getAll.useQuery();

  // 臨時示例數據
  const exampleAuctions = [
    {
      id: 1,
      name: "顧景舟 石瓢壺",
      artist: "顧景舟",
      auctionHouse: "中國嘉德",
      auctionDate: new Date("2023-11-20"),
      estimatedPrice: "RMB 800,000-1,200,000",
      finalPrice: "RMB 1,380,000",
      description: "此壺為顧景舟大師晚年精品之作，線條流暢，比例協調，泥料精良，包漿自然。壺底有顧景舟款識，附原配木盒及證書。",
      clayType: "purple",
      shapeType: "石瓢",
      photos: ["/images/teapots/E8zW5F1QhNDV.jpg"],
    },
    {
      id: 2,
      name: "蔣蓉 荷花壺",
      artist: "蔣蓉",
      auctionHouse: "北京保利",
      auctionDate: new Date("2023-10-15"),
      estimatedPrice: "RMB 500,000-800,000",
      finalPrice: "RMB 920,000",
      description: "蔣蓉大師花器代表作，以荷花為題材，造型生動自然，工藝精湛。壺身刻有蔣蓉款識，品相完好。",
      clayType: "purple",
      shapeType: "花器",
      photos: ["/images/teapots/PLOSrArjXbxh.jpg"],
    },
    {
      id: 3,
      name: "清代 秦權壺",
      artist: "未知",
      auctionHouse: "蘇富比香港",
      auctionDate: new Date("2023-09-28"),
      estimatedPrice: "HKD 300,000-500,000",
      finalPrice: "HKD 680,000",
      description: "清代中期紫砂秦權壺，造型穩重大方，泥料純正，包漿溫潤。壺底有陽文篆書款識，保存完整。",
      clayType: "purple",
      shapeType: "秦權",
      photos: ["/images/teapots/dwyjAaBTLx7k.jpg"],
    },
    {
      id: 4,
      name: "當代名家 仿古壺",
      artist: "呂堯臣",
      auctionHouse: "西泠印社",
      auctionDate: new Date("2024-01-10"),
      estimatedPrice: "RMB 200,000-350,000",
      finalPrice: "待拍賣",
      description: "呂堯臣大師近年新作，仿古器型，線條優美，泥料選用優質紫泥，製作精良。附作者親筆證書。",
      clayType: "purple",
      shapeType: "仿古",
      photos: ["/images/teapots/Huaz6FMb3et8.jpg"],
    },
  ];

  const displayData = auctions && auctions.length > 0 ? auctions : exampleAuctions;

  const clayTypeLabels: Record<string, string> = {
    purple: "紫泥",
    green: "綠泥",
    vermilion: "朱泥",
    duan: "段泥",
    jiangpo: "降坡泥",
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("zh-TW", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

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

        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">
            <Gavel className="w-4 h-4" />
            市場行情
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">當代紫砂壺拍賣會</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            追蹤國內外知名拍賣行的紫砂壺拍賣信息，了解市場動態與收藏價值
          </p>
        </div>

        {/* 市場趨勢卡片 */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="hover-lift">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-primary" />
                </div>
                <Badge variant="secondary" className="bg-green-500/10 text-green-600 border-green-500/20">
                  +15.3%
                </Badge>
              </div>
              <h3 className="font-semibold mb-1">名家作品</h3>
              <p className="text-sm text-muted-foreground">
                顧景舟、蔣蓉等大師作品近年持續升值
              </p>
            </CardContent>
          </Card>

          <Card className="hover-lift">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                  <Gavel className="w-6 h-6 text-accent" />
                </div>
                <Badge variant="secondary">2024</Badge>
              </div>
              <h3 className="font-semibold mb-1">拍賣場次</h3>
              <p className="text-sm text-muted-foreground">
                今年已舉辦32場紫砂專場拍賣會
              </p>
            </CardContent>
          </Card>

          <Card className="hover-lift">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center">
                  <span className="text-2xl">💰</span>
                </div>
                <Badge variant="secondary">最高</Badge>
              </div>
              <h3 className="font-semibold mb-1">成交記錄</h3>
              <p className="text-sm text-muted-foreground">
                單件最高成交價達 RMB 1,380萬
              </p>
            </CardContent>
          </Card>
        </div>

        {isLoading ? (
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <div className="flex flex-col md:flex-row gap-6 p-6">
                  <div className="w-full md:w-64 aspect-square bg-muted rounded-lg" />
                  <div className="flex-1 space-y-3">
                    <div className="h-6 bg-muted rounded w-2/3" />
                    <div className="h-4 bg-muted rounded w-1/2" />
                    <div className="h-20 bg-muted rounded" />
                    <div className="h-4 bg-muted rounded w-1/3" />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {displayData.map((auction: any) => (
              <Card key={auction.id} className="hover-lift group overflow-hidden">
                <div className="flex flex-col md:flex-row gap-6 p-6">
                  {/* 圖片 */}
                  <div className="w-full md:w-64 aspect-square bg-muted relative overflow-hidden rounded-lg flex-shrink-0">
                    {auction.photos && auction.photos[0] ? (
                      <img
                        src={auction.photos[0]}
                        alt={auction.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        <Gavel className="w-12 h-12" />
                      </div>
                    )}
                    <div className="absolute top-3 left-3 flex flex-col gap-2">
                      {auction.clayType && (
                        <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm">
                          {clayTypeLabels[auction.clayType]}
                        </Badge>
                      )}
                      {auction.shapeType && (
                        <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm">
                          {auction.shapeType}
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* 信息 */}
                  <div className="flex-1 flex flex-col">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-2xl font-bold mb-1 group-hover:text-primary transition-colors">
                            {auction.name}
                          </h3>
                          <p className="text-muted-foreground">
                            {auction.artist}
                          </p>
                        </div>
                      </div>

                      <p className="text-foreground leading-relaxed mb-4">
                        {auction.description}
                      </p>

                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">拍賣行</p>
                          <p className="font-medium">{auction.auctionHouse}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">拍賣日期</p>
                          <p className="font-medium">{formatDate(auction.auctionDate)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">估價</p>
                          <p className="font-medium">{auction.estimatedPrice}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">成交價</p>
                          <p className="font-bold text-accent">{auction.finalPrice}</p>
                        </div>
                      </div>
                    </div>

                    {auction.sourceUrl && (
                      <div className="flex gap-3">
                        <a
                          href={auction.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1"
                        >
                          <Button variant="outline" className="w-full gap-2">
                            <ExternalLink className="w-4 h-4" />
                            查看拍賣詳情
                          </Button>
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* 拍賣行信息 */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6 text-center">主要拍賣行</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <Card className="hover-lift">
              <CardContent className="pt-6 text-center">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 mx-auto">
                  <Gavel className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">中國嘉德</h3>
                <p className="text-sm text-muted-foreground">
                  國內領先的藝術品拍賣公司
                </p>
              </CardContent>
            </Card>

            <Card className="hover-lift">
              <CardContent className="pt-6 text-center">
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4 mx-auto">
                  <Gavel className="w-6 h-6 text-accent" />
                </div>
                <h3 className="font-semibold mb-2">北京保利</h3>
                <p className="text-sm text-muted-foreground">
                  專注高端藝術品拍賣
                </p>
              </CardContent>
            </Card>

            <Card className="hover-lift">
              <CardContent className="pt-6 text-center">
                <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center mb-4 mx-auto">
                  <Gavel className="w-6 h-6 text-secondary-foreground" />
                </div>
                <h3 className="font-semibold mb-2">蘇富比</h3>
                <p className="text-sm text-muted-foreground">
                  國際知名拍賣行
                </p>
              </CardContent>
            </Card>

            <Card className="hover-lift">
              <CardContent className="pt-6 text-center">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 mx-auto">
                  <Gavel className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">西泠印社</h3>
                <p className="text-sm text-muted-foreground">
                  專業藝術品拍賣機構
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
