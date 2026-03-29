import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { useLocation } from "wouter";
import { Upload as UploadIcon, Image as ImageIcon, Loader2, ArrowLeft, Sparkles } from "lucide-react";
import { Link } from "wouter";

export default function Upload() {
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [clayType, setClayType] = useState<"purple" | "green" | "vermilion" | "duan" | "jiangpo">("purple");
  const [claySubtype, setClaySubtype] = useState("");
  
  const [frontPhoto, setFrontPhoto] = useState<File | null>(null);
  const [backPhoto, setBackPhoto] = useState<File | null>(null);
  const [topPhoto, setTopPhoto] = useState<File | null>(null);
  const [insidePhoto, setInsidePhoto] = useState<File | null>(null);
  
  const [analyzing, setAnalyzing] = useState(false);
  const [aiResults, setAiResults] = useState<any>(null);

  const createMutation = trpc.teapot.create.useMutation({
    onSuccess: () => {
      toast.success("紫砂壺上傳成功！正在等待審核。");
      setLocation("/my-collection");
    },
    onError: (error) => {
      toast.error(`上傳失敗：${error.message}`);
    },
  });

  const analyzeClay = trpc.teapot.analyzeClay.useMutation();
  const analyzeCraft = trpc.teapot.analyzeCraft.useMutation();
  const analyzeShape = trpc.teapot.analyzeShape.useMutation();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>需要登入</CardTitle>
            <CardDescription>請先登入以上傳您的紫砂壺收藏</CardDescription>
          </CardHeader>
          <CardContent>
            <a href="/api/oauth/login">
              <Button className="w-full">立即登入</Button>
            </a>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, setter: (file: File | null) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      setter(file);
    }
  };

  const handleAIAnalysis = async () => {
    if (!frontPhoto) {
      toast.error("請先上傳正面照片以進行AI識別");
      return;
    }

    setAnalyzing(true);
    try {
      // 模擬上傳照片並獲取URL（實際應該先上傳到S3）
      const frontPhotoUrl = URL.createObjectURL(frontPhoto);
      
      // 並行執行AI識別
      const [clayResult, shapeResult] = await Promise.all([
        analyzeClay.mutateAsync({ photoUrl: frontPhotoUrl }),
        analyzeShape.mutateAsync({ frontPhotoUrl }),
      ]);

      let craftResult = null;
      if (insidePhoto) {
        const insidePhotoUrl = URL.createObjectURL(insidePhoto);
        craftResult = await analyzeCraft.mutateAsync({ insidePhotoUrl });
      }

      setAiResults({
        clay: clayResult,
        shape: shapeResult,
        craft: craftResult,
      });

      // 自動填充識別結果
      if (clayResult) {
        setClayType(clayResult.clayType);
        setClaySubtype(clayResult.claySubtype);
      }

      toast.success("AI識別完成！您可以查看並修正結果。");
    } catch (error: any) {
      toast.error(`AI識別失敗：${error.message}`);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("請輸入壺的名稱");
      return;
    }

    if (!frontPhoto) {
      toast.error("請至少上傳正面照片");
      return;
    }

    // 這裡應該先上傳照片到S3，然後獲取URL
    // 暫時使用模擬數據
    const photos = {
      front: frontPhoto ? "temp-url-front" : undefined,
      back: backPhoto ? "temp-url-back" : undefined,
      top: topPhoto ? "temp-url-top" : undefined,
      inside: insidePhoto ? "temp-url-inside" : undefined,
    };

    createMutation.mutate({
      name,
      description: description || undefined,
      clayType,
      claySubtype: claySubtype || undefined,
      photos,
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
        <div className="max-w-3xl mx-auto">
          <Link href="/">
            <a className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              返回首頁
            </a>
          </Link>

          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">上傳您的紫砂壺</h1>
            <p className="text-muted-foreground">
              分享您的收藏，讓AI幫助您識別泥料、工藝和器型
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* 基本信息 */}
            <Card>
              <CardHeader>
                <CardTitle>基本信息</CardTitle>
                <CardDescription>填寫您的紫砂壺基本資料</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">壺名稱 *</Label>
                  <Input
                    id="name"
                    placeholder="例如：石瓢壺、西施壺"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">描述（可選）</Label>
                  <Textarea
                    id="description"
                    placeholder="描述您的壺的特點、來源、故事等..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="clayType">泥料類型</Label>
                    <Select value={clayType} onValueChange={(value: any) => setClayType(value)}>
                      <SelectTrigger id="clayType">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="purple">紫泥</SelectItem>
                        <SelectItem value="green">綠泥</SelectItem>
                        <SelectItem value="vermilion">朱泥</SelectItem>
                        <SelectItem value="duan">段泥</SelectItem>
                        <SelectItem value="jiangpo">降坡泥</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="claySubtype">泥料子類（可選）</Label>
                    <Input
                      id="claySubtype"
                      placeholder="例如：老紫泥、底槽清"
                      value={claySubtype}
                      onChange={(e) => setClaySubtype(e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 照片上傳 */}
            <Card>
              <CardHeader>
                <CardTitle>照片上傳</CardTitle>
                <CardDescription>
                  請上傳多角度照片，至少需要正面照片。建議上傳所有角度以獲得更準確的AI識別結果。
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="front">正面照片 * （嘴向右，把向左）</Label>
                    <div className="relative">
                      <Input
                        id="front"
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, setFrontPhoto)}
                        className="cursor-pointer"
                      />
                      {frontPhoto && (
                        <div className="mt-2 relative aspect-video rounded-lg overflow-hidden bg-muted">
                          <img
                            src={URL.createObjectURL(frontPhoto)}
                            alt="正面"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="back">反面照片（嘴向左，把向右）</Label>
                    <div className="relative">
                      <Input
                        id="back"
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, setBackPhoto)}
                        className="cursor-pointer"
                      />
                      {backPhoto && (
                        <div className="mt-2 relative aspect-video rounded-lg overflow-hidden bg-muted">
                          <img
                            src={URL.createObjectURL(backPhoto)}
                            alt="反面"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="top">俯視照片</Label>
                    <div className="relative">
                      <Input
                        id="top"
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, setTopPhoto)}
                        className="cursor-pointer"
                      />
                      {topPhoto && (
                        <div className="mt-2 relative aspect-video rounded-lg overflow-hidden bg-muted">
                          <img
                            src={URL.createObjectURL(topPhoto)}
                            alt="俯視"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="inside">壺內照片（用於工藝識別）</Label>
                    <div className="relative">
                      <Input
                        id="inside"
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, setInsidePhoto)}
                        className="cursor-pointer"
                      />
                      {insidePhoto && (
                        <div className="mt-2 relative aspect-video rounded-lg overflow-hidden bg-muted">
                          <img
                            src={URL.createObjectURL(insidePhoto)}
                            alt="壺內"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full gap-2"
                    onClick={handleAIAnalysis}
                    disabled={!frontPhoto || analyzing}
                  >
                    {analyzing ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        AI 識別中...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        開始 AI 智能識別
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* AI識別結果 */}
            {aiResults && (
              <Card className="border-accent/50 bg-accent/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-accent" />
                    AI 識別結果
                  </CardTitle>
                  <CardDescription>
                    您可以根據實際情況修正AI識別的結果
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {aiResults.clay && (
                    <div className="p-4 rounded-lg bg-card border border-border">
                      <h4 className="font-semibold mb-2">泥料識別</h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        類型：{aiResults.clay.claySubtype || aiResults.clay.clayType}
                      </p>
                      <p className="text-sm text-muted-foreground mb-2">
                        信心度：{aiResults.clay.confidence}%
                      </p>
                      <p className="text-sm">{aiResults.clay.reasoning}</p>
                    </div>
                  )}

                  {aiResults.shape && (
                    <div className="p-4 rounded-lg bg-card border border-border">
                      <h4 className="font-semibold mb-2">器型識別</h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        器型：{aiResults.shape.shapeType}
                      </p>
                      <p className="text-sm text-muted-foreground mb-2">
                        匹配度：{aiResults.shape.matchScore}%
                      </p>
                      <p className="text-sm">{aiResults.shape.reasoning}</p>
                    </div>
                  )}

                  {aiResults.craft && (
                    <div className="p-4 rounded-lg bg-card border border-border">
                      <h4 className="font-semibold mb-2">工藝識別</h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        工藝：{aiResults.craft.craftType}
                      </p>
                      <p className="text-sm text-muted-foreground mb-2">
                        信心度：{aiResults.craft.confidence}%
                      </p>
                      <p className="text-sm">{aiResults.craft.reasoning}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* 提交按鈕 */}
            <div className="flex gap-4">
              <Link href="/">
                <Button type="button" variant="outline" className="flex-1">
                  取消
                </Button>
              </Link>
              <Button
                type="submit"
                className="flex-1 gap-2"
                disabled={createMutation.isPending}
              >
                {createMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    上傳中...
                  </>
                ) : (
                  <>
                    <UploadIcon className="w-4 h-4" />
                    提交上傳
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
