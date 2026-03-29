import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { ArrowLeft, BookOpen } from "lucide-react";

export default function Classic() {
  const { data: classics, isLoading } = trpc.classic.getAll.useQuery();

  // 臨時示例數據（如果數據庫中還沒有數據）
  const exampleClassics = [
    {
      id: 1,
      name: "石瓢壺",
      artist: "顧景舟",
      dynasty: "現代",
      description: "石瓢壺是紫砂壺中的經典器型，壺身呈金字塔式，上小下大，重心下垂，出水暢順。顧景舟大師的石瓢壺以線條流暢、比例協調著稱，被譽為紫砂壺中的典範之作。",
      clayType: "purple",
      shapeType: "石瓢",
      photos: ["/images/teapots/BSGz8dQEt6Jm.jpg"],
    },
    {
      id: 2,
      name: "西施壺",
      artist: "徐友泉",
      dynasty: "明末清初",
      description: "西施壺原名西施乳，壺身圓潤飽滿，壺流短而略粗，壺把倒耳之形，壺蓋截蓋式。此壺以西施之美命名，體現了紫砂壺的柔美與優雅。",
      clayType: "vermilion",
      shapeType: "西施",
      photos: ["/images/teapots/1pkKmb1o0W6P.webp"],
    },
    {
      id: 3,
      name: "掇球壺",
      artist: "邵大亨",
      dynasty: "清代",
      description: "掇球壺的壺鈕、壺蓋、壺身由小中大三個球體組成，造型渾圓飽滿，氣韻生動。邵大亨的掇球壺是紫砂壺史上的經典之作，影響深遠。",
      clayType: "purple",
      shapeType: "掇球",
      photos: ["/images/teapots/oScR2hwQ3ttK.jpg"],
    },
    {
      id: 4,
      name: "仿古壺",
      artist: "邵大亨",
      dynasty: "清代",
      description: "仿古壺身扁、腹鼓、頸高、蓋板平滑，造型古朴典雅。邵大亨初創此器型，後經多位大師演繹，成為紫砂壺中的經典器型之一。",
      clayType: "purple",
      shapeType: "仿古",
      photos: ["/images/teapots/Huaz6FMb3et8.jpg"],
    },
  ];

  const displayData = classics && classics.length > 0 ? classics : exampleClassics;

  const clayTypeLabels: Record<string, string> = {
    purple: "紫泥",
    green: "綠泥",
    vermilion: "朱泥",
    duan: "段泥",
    jiangpo: "降坡泥",
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
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <BookOpen className="w-4 h-4" />
            經典傳承
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">經典紫砂壺作品</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            收錄歷代名家經典作品，了解紫砂壺的歷史與文化傳承
          </p>
        </div>

        {isLoading ? (
          <div className="grid md:grid-cols-2 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="animate-pulse">
                <div className="aspect-[4/3] bg-muted" />
                <CardContent className="pt-6 space-y-3">
                  <div className="h-6 bg-muted rounded" />
                  <div className="h-4 bg-muted rounded w-2/3" />
                  <div className="h-20 bg-muted rounded" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8">
            {displayData.map((classic: any) => (
              <Card key={classic.id} className="hover-lift group overflow-hidden">
                <div className="aspect-[4/3] bg-muted relative overflow-hidden">
                  {classic.photos && classic.photos[0] ? (
                    <img
                      src={classic.photos[0]}
                      alt={classic.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                      <BookOpen className="w-12 h-12" />
                    </div>
                  )}
                  <div className="absolute top-4 left-4 flex gap-2">
                    {classic.clayType && (
                      <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm">
                        {clayTypeLabels[classic.clayType]}
                      </Badge>
                    )}
                    {classic.shapeType && (
                      <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm">
                        {classic.shapeType}
                      </Badge>
                    )}
                  </div>
                </div>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-2xl font-bold mb-1 group-hover:text-primary transition-colors">
                        {classic.name}
                      </h3>
                      <p className="text-muted-foreground">
                        {classic.artist} · {classic.dynasty}
                      </p>
                    </div>
                  </div>
                  <p className="text-foreground leading-relaxed">
                    {classic.description}
                  </p>
                  {classic.referenceUrl && (
                    <a
                      href={classic.referenceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-primary hover:underline mt-4"
                    >
                      了解更多 →
                    </a>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* 器型知識卡片 */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6 text-center">器型分類知識</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <Card className="hover-lift">
              <CardContent className="pt-6">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 mx-auto">
                  <span className="text-2xl">○</span>
                </div>
                <h3 className="font-semibold text-center mb-2">圓器</h3>
                <p className="text-sm text-muted-foreground text-center">
                  由不同曲度的曲線組成，講究珠圓玉潤。代表：石瓢、西施、掇球等。
                </p>
              </CardContent>
            </Card>

            <Card className="hover-lift">
              <CardContent className="pt-6">
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4 mx-auto">
                  <span className="text-2xl">□</span>
                </div>
                <h3 className="font-semibold text-center mb-2">方器</h3>
                <p className="text-sm text-muted-foreground text-center">
                  方非一式，棱面挺括，線條利落。代表：四方壺、亞明四方等。
                </p>
              </CardContent>
            </Card>

            <Card className="hover-lift">
              <CardContent className="pt-6">
                <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center mb-4 mx-auto">
                  <span className="text-2xl">≋</span>
                </div>
                <h3 className="font-semibold text-center mb-2">筋紋器</h3>
                <p className="text-sm text-muted-foreground text-center">
                  仿植物瓜果、花瓣的筋囊和紋理。代表：合菱、龍頭一捆竹等。
                </p>
              </CardContent>
            </Card>

            <Card className="hover-lift">
              <CardContent className="pt-6">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 mx-auto">
                  <span className="text-2xl">❀</span>
                </div>
                <h3 className="font-semibold text-center mb-2">花器</h3>
                <p className="text-sm text-muted-foreground text-center">
                  模擬自然形態。代表：供春壺、葫蘆壺、匏瓜壺等。
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
